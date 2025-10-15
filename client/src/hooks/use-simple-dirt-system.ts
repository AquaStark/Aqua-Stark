import { useState, useEffect, useCallback } from 'react';

interface DirtSpot {
  id: number;
  x: number;
  y: number;
  size: number;
}

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export function useSimpleDirtSystem(aquariumId?: string, playerId?: string) {
  const [spots, setSpots] = useState<DirtSpot[]>([]);
  const [isSpongeMode, setIsSpongeMode] = useState(false);
  const [dirtLevel, setDirtLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modo testing: true para desarrollo, false para producción
  const isTestingMode = false; // Forzar modo producción
  
  // Variable para almacenar el tiempo de la última limpieza
  const [lastCleaningTime, setLastCleaningTime] = useState<string>('');
  
  // Contador independiente para manchas (se resetea al limpiar)
  const [spotCounter, setSpotCounter] = useState(0);

  // Generar manchas basadas en el tiempo real del backend
  const generateSpotsFromBackend = useCallback((level: number, lastCleaningTime?: string) => {
    let hoursSinceCleaning = 0;
    if (lastCleaningTime) {
      const lastCleaning = new Date(lastCleaningTime);
      const now = new Date();
      hoursSinceCleaning = (now.getTime() - lastCleaning.getTime()) / (1000 * 60 * 60);
    }

    // PRODUCTION: 1 mancha cada hora después del período de gracia (4 horas)
    const gracePeriod = 4; // 4 horas
    const spotsPerHour = 1; // 1 mancha cada hora
    const timeSinceGracePeriod = Math.max(0, hoursSinceCleaning - gracePeriod);
    const expectedSpotCount = Math.min(8, Math.floor(timeSinceGracePeriod / spotsPerHour));

    setSpots(prevSpots => {
      const currentSpotCount = prevSpots.length;
      
      if (currentSpotCount >= expectedSpotCount) {
        return prevSpots;
      }

      // Calcular cuántas manchas necesitamos agregar
      const spotsToAdd = expectedSpotCount - currentSpotCount;

      // Márgenes para evitar header y footer
      const SAFE_MARGINS = {
        top: 100,
        bottom: 120,
        left: 50,
        right: 50,
      };

      const safeArea = {
        width: window.innerWidth - SAFE_MARGINS.left - SAFE_MARGINS.right,
        height: window.innerHeight - SAFE_MARGINS.top - SAFE_MARGINS.bottom,
        startX: SAFE_MARGINS.left,
        startY: SAFE_MARGINS.top,
      };

      // Agregar solo las manchas que faltan
      const newSpots: DirtSpot[] = [...prevSpots];
      for (let i = 0; i < spotsToAdd; i++) {
        newSpots.push({
          id: Date.now() + i + Math.random() * 1000, // ID único
          x: Math.random() * safeArea.width + safeArea.startX,
          y: Math.random() * safeArea.height + safeArea.startY,
          size: Math.random() * 150 + 200, // Tamaño entre 200-350px (MUY GRANDE)
        });
      }

      return newSpots;
    });
  }, []);

  // Obtener estado del backend
  const fetchDirtStatus = useCallback(async () => {
    if (!aquariumId || !playerId) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/dirt/aquarium/${aquariumId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        const dirtData = result.data;
        
        setDirtLevel(dirtData.current_dirt_level);
        setLastCleaningTime(dirtData.last_cleaning_time);
        
        // Generar manchas basadas en el tiempo real del backend
        generateSpotsFromBackend(dirtData.current_dirt_level, dirtData.last_cleaning_time);
      }
    } catch (error) {
      // Fallback a sistema local
      generateSpotsFromBackend(50);
    } finally {
      setIsLoading(false);
    }
  }, [aquariumId, playerId, generateSpotsFromBackend]);

  // Limpiar mancha en el backend
  const cleanSpot = useCallback(async (spotId: number) => {
    if (!aquariumId || !playerId) {
      setDirtLevel(prev => Math.max(0, prev - 10));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dirt/aquarium/${aquariumId}/clean-spot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spotId: spotId }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDirtLevel(result.data.new_dirt_level);
          
          // Solo actualizar tiempo si se limpió COMPLETAMENTE
          if (result.data.is_complete_cleaning) {
            setSpotCounter(0);
            setTimeout(() => {
              fetchDirtStatus();
            }, 1000);
          }
        }
      } else {
        setDirtLevel(prev => Math.max(0, prev - 10));
      }
    } catch (error) {
      setDirtLevel(prev => Math.max(0, prev - 10));
    }
  }, [aquariumId, playerId, fetchDirtStatus]);

  // Remover mancha local
  const removeSpot = useCallback((id: number) => {
    setSpots(prev => {
      const newSpots = prev.filter(spot => spot.id !== id);
      if (newSpots.length === 0) {
        setSpotCounter(0);
      }
      return newSpots;
    });
  }, []);

  // Toggle modo esponja
  const toggleSpongeMode = useCallback(() => {
    setIsSpongeMode(prev => !prev);
  }, []);

  // Inicializar sistema de dirt si es necesario
  const initializeDirtSystem = useCallback(async () => {
    if (!aquariumId || !playerId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/dirt/aquarium/${aquariumId}/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
      }
    } catch (error) {
      // Fallback silencioso
    }
  }, [aquariumId, playerId]);

  // Cargar estado inicial
  useEffect(() => {
    const loadInitialState = async () => {
      // Primero intentar inicializar el sistema
      await initializeDirtSystem();
      // Luego obtener el estado
      await fetchDirtStatus();
    };
    
    loadInitialState();
  }, [initializeDirtSystem, fetchDirtStatus]);

  // Sincronizar contador con manchas existentes al iniciar
  useEffect(() => {
    if (spots.length > 0 && spotCounter === 0) {
      setSpotCounter(spots.length);
    }
  }, [spots.length, spotCounter]);

  // PRODUCTION: verificación cada hora para generar nuevas manchas
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (lastCleaningTime) {
        const hoursSinceCleaning = (new Date().getTime() - new Date(lastCleaningTime).getTime()) / (1000 * 60 * 60);
        const gracePeriod = 4;
        const spotsPerHour = 1;
        const timeSinceGracePeriod = Math.max(0, hoursSinceCleaning - gracePeriod);
        const expectedSpots = Math.min(8, Math.floor(timeSinceGracePeriod / spotsPerHour));
        
        if (expectedSpots > spots.length) {
          generateSpotsFromBackend(expectedSpots * 10, lastCleaningTime);
        }
      }
    }, 3600000); // Cada 1 hora (3600000 ms)
    
    // Verificación con backend cada 30 minutos (sincronización)
    const backendInterval = setInterval(() => {
      fetchDirtStatus();
    }, 1800000); // 30 minutos (1800000 ms)
    
    return () => {
      clearInterval(checkInterval);
      clearInterval(backendInterval);
    };
  }, [spots.length, generateSpotsFromBackend, fetchDirtStatus, lastCleaningTime]);



  return {
    spots,
    isSpongeMode,
    dirtLevel,
    isLoading,
    removeSpot,
    cleanSpot,
    toggleSpongeMode,
    refresh: fetchDirtStatus,
  };
}
