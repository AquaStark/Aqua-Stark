import { useState, useEffect, useCallback, useRef} from 'react';
import {
  DirtSpot,
  DirtType,
  DirtSystemConfig,
  DirtSystemState,
  DirtSystemAnalytics,
  DirtSystemEvent,
  DIRT_TYPE_CONFIG,
  getDirtTypeConfig,
  calculateSpotIntensity,
  calculateSpotAge,
} from '@/types/dirt';

const DEFAULT_CONFIG: DirtSystemConfig = {
  spawnInterval: 30000, // 30 seconds
  maxSpots: 5,
  minSpotDistance: 60, // pixels
  aquariumBounds: {
    x: 0,
    y: 0,
    width: 800,
    height: 400,
  },
  spawnChance: 0.7,
  // Enhanced defaults
  enableAging: true,
  agingRate: 1.0,
  cleanlinessDecayRate: 0.1, // points per minute when dirty
  enableDifficultyScaling: false,
  dirtTypeWeights: {
    [DirtType.BASIC]: 0.4,
    [DirtType.ALGAE]: 0.3,
    [DirtType.WASTE]: 0.2,
    [DirtType.DEBRIS]: 0.1,
  },
};

export function useDirtSystemFixed(config: Partial<DirtSystemConfig> = {}) {
  const [localConfig, setLocalConfig] = useState<DirtSystemConfig>(() => ({ ...DEFAULT_CONFIG, ...config }));
  useEffect(() => {
  setLocalConfig(prev => ({ ...prev, ...config }));
   }, [config]);
   const finalConfig = localConfig;
  
  const [state, setState] = useState<DirtSystemState>({
    spots: [],
    isSpawnerActive: true,
    totalSpotsCreated: 0,
    totalSpotsRemoved: 0,
    cleanlinessScore: 100,
    // Enhanced state
    averageSpotAge: 0,
    totalCleaningClicks: 0,
    efficiency: 0,
    dirtTypeStats: {
      [DirtType.BASIC]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.ALGAE]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.WASTE]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.DEBRIS]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.ORGANIC]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.GRIME]: { created: 0, removed: 0, averageTimeToClean: 0 },
    },
    lastSpawnTime: Date.now(),
    sessionStartTime: Date.now(),
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const agingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextIdRef = useRef(1);
  const eventListenersRef = useRef<Array<(event: DirtSystemEvent) => void>>([]);

  // Event system
  const dispatchEvent = useCallback((event: DirtSystemEvent) => {
       for (const listener of eventListenersRef.current) {
         try {
           listener(event);
         } catch {
           // optionally log
         }
       }
     }, []);

  const addEventListener = useCallback((listener: (event: DirtSystemEvent) => void) => {
    eventListenersRef.current.push(listener);
    return () => {
      eventListenersRef.current = eventListenersRef.current.filter(l => l !== listener);
    };
  }, []);

  // Weighted random dirt type selection
   const selectRandomDirtType = useCallback((): DirtType => {
    const weights = finalConfig.dirtTypeWeights || {};
    const types = Object.keys(DIRT_TYPE_CONFIG) as Array<keyof typeof DIRT_TYPE_CONFIG>;
    const total = types.reduce(
      (sum, t) => sum + (weights[t as DirtType] ?? DIRT_TYPE_CONFIG[t].spawnProbability ?? 0.1),
      0
    );
    if (total <= 0) return DirtType.BASIC;
    let r = Math.random() * total;
    for (const t of types) {
      r -= (weights[t as DirtType] ?? DIRT_TYPE_CONFIG[t].spawnProbability ?? 0.1);
      if (r <= 0) return t as DirtType;
    }
    return DirtType.BASIC;
  }, [finalConfig.dirtTypeWeights]);

  // Generate random position within aquarium bounds
  const generateRandomPosition = useCallback((): { x: number; y: number } => {
    const { aquariumBounds } = finalConfig;
    const padding = 30;

    return {
      x: Math.random() * (aquariumBounds.width - padding * 2) + aquariumBounds.x + padding,
      y: Math.random() * (aquariumBounds.height - padding * 2) + aquariumBounds.y + padding,
    };
  }, [finalConfig]);

  // Check if position conflicts with existing spots
  const isValidPosition = useCallback(
    (newPos: { x: number; y: number }, spots: DirtSpot[]): boolean => {
      const { minSpotDistance } = finalConfig;
      const minDist2 = minSpotDistance * minSpotDistance;
      return spots.every(spot => {
        const dx = newPos.x - spot.position.x;
        const dy = newPos.y - spot.position.y;
        return (dx * dx + dy * dy) >= minDist2;
      });
    },
    [finalConfig]
  );

  // Create a new dirt spot with enhanced properties
  const createDirtSpot = useCallback((position: { x: number; y: number }, type?: DirtType): DirtSpot => {
    const selectedType = type || selectRandomDirtType();
    const typeConfig = getDirtTypeConfig(selectedType);
    
    // Generate organic sub-shapes for more natural appearance
    const subShapeCount = Math.floor(Math.random() * 3) + 2;
    const subShapes = Array.from({ length: subShapeCount }, (_, i) => {
      const angle = (i / subShapeCount) * Math.PI * 2;
      const distance = Math.random() * 5;
      return {
        size: (typeConfig.sizeRange.min + Math.random() * (typeConfig.sizeRange.max - typeConfig.sizeRange.min)) * (0.6 + Math.random() * 0.4),
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0.6 + Math.random() * 0.4,
        rotation: Math.random() * 360,
      };
    });

    return {
      id: nextIdRef.current++,
      position,
      type: selectedType,
      size: typeConfig.sizeRange.min + Math.random() * (typeConfig.sizeRange.max - typeConfig.sizeRange.min),
      opacity: typeConfig.opacityRange.min + Math.random() * (typeConfig.opacityRange.max - typeConfig.opacityRange.min),
      createdAt: Date.now(),
      intensity: 0,
      clickCount: 0,
      subShapes,
    };
  }, [selectRandomDirtType]);

  function updateDirtTypeStats(
    prevStats: DirtSystemState['dirtTypeStats'],
       type: DirtType,
       updates: Partial<{ created: number; removed: number; averageTimeToClean: number }>
      ) {
       const existing = prevStats[type] || { created: 0, removed: 0, averageTimeToClean: 0 };
       return {
         ...prevStats,
          [type]: { ...existing, ...updates },
       };
    }
  

  // Force spawn function for debugging
  const forceSpawnSpot = useCallback((type?: DirtType) => {
      let didSpawn = false;
      setState(prev => {
      const { maxSpots } = finalConfig;
      if (prev.spots.length >= maxSpots) return prev;
  
      for (let attempts = 0; attempts < 10; attempts++) {
        const position = generateRandomPosition();
        if (isValidPosition(position, prev.spots)) {
          const newSpot = createDirtSpot(position, type);
              const newState = {
                ...prev,
                spots: [...prev.spots, newSpot],
                totalSpotsCreated: prev.totalSpotsCreated + 1,
                lastSpawnTime: Date.now(),
                cleanlinessScore: Math.max(0, prev.cleanlinessScore - 100 / maxSpots),
                dirtTypeStats: updateDirtTypeStats(prev.dirtTypeStats, newSpot.type, {
                  created: (prev.dirtTypeStats[newSpot.type]?.created || 0) + 1,
                }),
              };
              dispatchEvent({
                type: 'SPOT_SPAWNED',
                payload: { spot: newSpot, spawnLocation: position },
              });
              dispatchEvent({
                type: 'CLEANLINESS_CHANGED',
                payload: {
                  oldScore: prev.cleanlinessScore,
                  newScore: newState.cleanlinessScore,
                  change: newState.cleanlinessScore - prev.cleanlinessScore,
                },
              });
                didSpawn = true;
              return newState;
        }
      }
  
      return prev;
    });
  
    return didSpawn;
  }, [finalConfig, generateRandomPosition, isValidPosition, createDirtSpot, dispatchEvent]);
  

  // Remove dirt spot with enhanced tracking
  const removeDirtSpot = useCallback((spotId: number) => {
    setState(prev => {
      const spot = prev.spots.find(s => s.id === spotId);
      if (!spot) return prev;
  
      const cleaningTime = Date.now() - spot.createdAt;
      const clickCount = spot.clickCount || 1;
  
      const typeStats = prev.dirtTypeStats[spot.type] || { created: 0, removed: 0, averageTimeToClean: 0 };
      const totalRemoved = typeStats.removed + 1;
      const newAverageTime = (typeStats.averageTimeToClean * typeStats.removed + cleaningTime) / totalRemoved;
  
      const newState = {
        ...prev,
        spots: prev.spots.filter(s => s.id !== spotId),
        totalSpotsRemoved: prev.totalSpotsRemoved + 1,
        totalCleaningClicks: prev.totalCleaningClicks + clickCount,
        cleanlinessScore: Math.min(100, prev.cleanlinessScore + 100 / finalConfig.maxSpots),
        efficiency: prev.totalSpotsCreated > 0
          ? ((prev.totalSpotsRemoved + 1) / prev.totalSpotsCreated) * 100
          : 0,
        dirtTypeStats: updateDirtTypeStats(prev.dirtTypeStats, spot.type, {
          removed: totalRemoved,
          averageTimeToClean: newAverageTime,
        }),
      };
  
      dispatchEvent({ type: 'SPOT_CLEANED', payload: { spot, cleaningTime, clickCount } });
      dispatchEvent({
        type: 'CLEANLINESS_CHANGED',
        payload: { oldScore: prev.cleanlinessScore, newScore: newState.cleanlinessScore, change: newState.cleanlinessScore - prev.cleanlinessScore },
      });
  
      return newState;
    });
  }, [finalConfig.maxSpots, dispatchEvent]);
  
  const removalTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Handle spot clicks (for difficulty mechanics)
  const handleSpotClick = useCallback((spotId: number, clickPosition: { x: number; y: number }) => {
    setState(prev => {
      const spots = prev.spots.map(spot => {
        if (spot.id === spotId) {
          const updatedSpot = {
            ...spot,
            clickCount: (spot.clickCount || 0) + 1,
            lastInteraction: Date.now(),
          };

          // Dispatch click event
          dispatchEvent({
            type: 'SPOT_CLICKED',
            payload: { spot: updatedSpot, clickPosition },
          });

          const typeConfig = getDirtTypeConfig(spot.type);
          if (updatedSpot.clickCount >= typeConfig.cleaningDifficulty) {
           // Clear any existing timeout for this spot
            const existingTimeout = removalTimeoutsRef.current.get(spotId);
            if (existingTimeout) clearTimeout(existingTimeout);
            
            // Schedule removal
            const timeout = setTimeout(() => {
              removeDirtSpot(spotId);
              removalTimeoutsRef.current.delete(spotId);
            }, 100);
            removalTimeoutsRef.current.set(spotId, timeout);
            
            return { ...updatedSpot, isRemoving: true };
          }   

          return updatedSpot;
        }
        return spot;
      });

      return { ...prev, spots };
    });
      }, [dispatchEvent, removeDirtSpot]);

  // Toggle spawner
  const toggleSpawner = useCallback(() => {
    setState((prev: DirtSystemState) => {
      const newState = { ...prev, isSpawnerActive: !prev.isSpawnerActive };
      
      dispatchEvent({
        type: 'SPAWNER_TOGGLED',
        payload: { isActive: newState.isSpawnerActive, timestamp: Date.now() },
      });

      return newState;
    });
  }, [dispatchEvent]);

  // Clear all spots
  const clearAllSpots = useCallback(() => {
    setState((prev: DirtSystemState) => {
      const clearedCount = prev.spots.length;
      const typeCounts = prev.spots.reduce((acc, s) => {
            acc[s.type] = (acc[s.type] || 0) + 1;
            return acc;
          }, {} as Record<DirtType, number>);
          const newDirtTypeStats = Object.fromEntries(
            Object.entries(prev.dirtTypeStats).map(([type, stats]) => {
              const inc = typeCounts[type as unknown as DirtType] || 0;
              return [type, { ...stats, removed: stats.removed + inc }];
            })
           ) as DirtSystemState['dirtTypeStats'];
            const newState = {
        ...prev,
        spots: [],
        totalSpotsRemoved: prev.totalSpotsRemoved + clearedCount,
        cleanlinessScore: 100,
        efficiency: prev.totalSpotsCreated > 0 
          ? ((prev.totalSpotsRemoved + clearedCount) / prev.totalSpotsCreated) * 100 
          : 0,
          dirtTypeStats: newDirtTypeStats,
      };

      dispatchEvent({
            type: 'CLEANLINESS_CHANGED',
             payload: { oldScore: prev.cleanlinessScore, newScore: newState.cleanlinessScore, change: newState.cleanlinessScore - prev.cleanlinessScore },
           });

      return newState;
    });
  }, [dispatchEvent]);

  // Update spot aging
  const updateSpotAging = useCallback(() => {
    if (!finalConfig.enableAging) return;

    setState(prev => {
      // const now = Date.now();
      let totalAge = 0;
      
      const updatedSpots = prev.spots.map(spot => {
        const age = calculateSpotAge(spot);
        totalAge += age;
        
        const newIntensity = calculateSpotIntensity(spot, finalConfig);
        return { ...spot, intensity: newIntensity };
      });

      return {
        ...prev,
        spots: updatedSpots,
        averageSpotAge: updatedSpots.length > 0 ? totalAge / updatedSpots.length : 0,
      };
    });
  }, [finalConfig]);

  // Analytics
  const getAnalytics = useCallback((): DirtSystemAnalytics => {
    const sessionDuration = (Date.now() - state.sessionStartTime) / 1000 / 60; // minutes
    const spotsPerMinute = sessionDuration > 0 ? state.totalSpotsCreated / sessionDuration : 0;
    let totalMs = 0;
    let removed = 0;
    Object.values(state.dirtTypeStats).forEach(stats => {
      totalMs += stats.averageTimeToClean * stats.removed;
      removed += stats.removed;
    });
    const averageResponseTime = removed > 0 ? (totalMs / removed) / 1000 : 0;

    return {
      sessionDuration,
      spotsPerMinute,
      cleaningEfficiency: state.efficiency,
      averageResponseTime,
      dirtTypePreferences: Object.entries(state.dirtTypeStats).reduce((acc, [type, stats]) => {
        acc[type as DirtType] = stats.removed;
        return acc;
      }, {} as Record<DirtType, number>),
      cleaningHotspots: [], // Would need position tracking for this
    };
  }, [state]);

  // Get spots by type
  const getSpotsByType = useCallback((type: DirtType) => {
    return state.spots.filter(spot => spot.type === type);
  }, [state.spots]);

  // Calculate dirt coverage percentage
  const getDirtCoverage = useCallback(() => {
    const totalArea = finalConfig.aquariumBounds.width * finalConfig.aquariumBounds.height;
    const dirtArea = state.spots.reduce((sum, spot) => {
      // Account for organic shapes if they exist
      if (spot.subShapes && spot.subShapes.length > 0) {
          // Sum areas of all sub-shapes
          const subShapeArea = spot.subShapes.reduce((subSum, shape) => {
            const subRadius = shape.size / 2;
            return subSum + Math.PI * subRadius * subRadius * (shape.opacity || 1);
          }, 0);
          return sum + subShapeArea;
        } else {
          // Fallback to simple circle
          const radius = spot.size / 2;
          return sum + Math.PI * radius * radius;
        }
    }, 0);
    return (dirtArea / totalArea) * 100;
  }, [state.spots, finalConfig.aquariumBounds]);

  // Setup spawn interval
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (state.isSpawnerActive) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const { maxSpots, spawnChance } = finalConfig;
          if (prev.spots.length >= maxSpots || Math.random() > spawnChance) return prev;
      
          for (let attempts = 0; attempts < 10; attempts++) {
            const position = generateRandomPosition();
            if (isValidPosition(position, prev.spots)) {
              const newSpot = createDirtSpot(position);
              dispatchEvent({
                type: 'SPOT_SPAWNED',
                payload: { spot: newSpot, spawnLocation: position },
              });
              return {
                ...prev,
                spots: [...prev.spots, newSpot],
                totalSpotsCreated: prev.totalSpotsCreated + 1,
                lastSpawnTime: Date.now(),
                cleanlinessScore: Math.max(0, prev.cleanlinessScore - 100 / maxSpots),
                dirtTypeStats: updateDirtTypeStats(prev.dirtTypeStats, newSpot.type, {
                  created: (prev.dirtTypeStats[newSpot.type]?.created || 0) + 1,
                }),
              };
            }
          }
      
          return prev;
        });
      }, finalConfig.spawnInterval);
      
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isSpawnerActive, generateRandomPosition, isValidPosition, createDirtSpot, dispatchEvent, finalConfig.spawnInterval, finalConfig.maxSpots, finalConfig.spawnChance]);

  // Setup aging interval
  useEffect(() => {
    // Clear any existing interval first
    if (agingIntervalRef.current) {
      clearInterval(agingIntervalRef.current);
      agingIntervalRef.current = null;
    }
    // If aging is disabled, don’t set a new interval (cleanup already done)
    if (!finalConfig.enableAging) {
      return () => {
        if (agingIntervalRef.current) {
          clearInterval(agingIntervalRef.current);
          agingIntervalRef.current = null;
        }
      };
    }
    // Enable aging: set up a new interval
    agingIntervalRef.current = setInterval(updateSpotAging, 5000);
    // Cleanup on unmount or before next run
    return () => {
      if (agingIntervalRef.current) {
        clearInterval(agingIntervalRef.current);
        agingIntervalRef.current = null;
      }
    };
  }, [finalConfig.enableAging, updateSpotAging]);

  // Update aquarium bounds
  const updateAquariumBounds = useCallback((bounds: DirtSystemConfig['aquariumBounds']) => {
    setLocalConfig(prev => ({ ...prev, aquariumBounds: { ...prev.aquariumBounds, ...bounds } }));
    }, []);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<DirtSystemConfig>) => {
     setLocalConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (agingIntervalRef.current) clearInterval(agingIntervalRef.current);
      // Clear all pending removal timeouts
      removalTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      removalTimeoutsRef.current.clear();
    };
  }, []);

  return {
    // State
    spots: state.spots,
    isSpawnerActive: state.isSpawnerActive,
    totalSpotsCreated: state.totalSpotsCreated,
    totalSpotsRemoved: state.totalSpotsRemoved,
    cleanlinessScore: Math.round(state.cleanlinessScore),
      // expose an immutable snapshot to callers
    config: Object.freeze({
        ...finalConfig,
        aquariumBounds: { ...finalConfig.aquariumBounds },
        dirtTypeWeights: { ...(finalConfig.dirtTypeWeights || {}) },
      }) as Readonly<DirtSystemConfig>,
    // Enhanced state
    averageSpotAge: state.averageSpotAge,
    totalCleaningClicks: state.totalCleaningClicks,
    efficiency: Math.round(state.efficiency),
    dirtTypeStats: state.dirtTypeStats,

    // Actions
    removeDirtSpot,
    forceSpawnSpot,
    toggleSpawner,
    clearAllSpots,
    updateAquariumBounds,
    updateConfig,
    handleSpotClick,

    // Analytics
    getAnalytics,
    getSpotsByType,
    getDirtCoverage,

    // Events
    addEventListener,
  };
}