import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { API_CONFIG } from '@/config/api';

/**
 * Species data from catalog
 */
interface Species {
  species_name: string;
  display_name: string;
  image_url: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  base_stats: {
    health?: number;
    growth_rate?: number;
    appetite?: number;
    [key: string]: any;
  };
  is_active: boolean;
  created_at: string;
  last_updated: string;
}

/**
 * Species catalog as a map for quick lookup
 */
type SpeciesCatalog = Record<string, Species>;

interface SpeciesCatalogContextType {
  catalog: SpeciesCatalog;
  isLoading: boolean;
  error: string | null;
  getSpecies: (speciesName: string) => Species | null;
  getSpeciesImage: (speciesName: string) => string;
  getSpeciesDisplayName: (speciesName: string) => string;
  getAllSpecies: () => Species[];
  clearCache: () => void;
}

const SpeciesCatalogContext = createContext<
  SpeciesCatalogContextType | undefined
>(undefined);

const STORAGE_KEY = 'aqua_stark_species_catalog';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface SpeciesCatalogProviderProps {
  children: ReactNode;
}

export const SpeciesCatalogProvider: React.FC<SpeciesCatalogProviderProps> = ({
  children,
}) => {
  const [catalog, setCatalog] = useState<SpeciesCatalog>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setIsLoading(true);

        // Try localStorage first
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          // Use cache if less than 24h old
          if (age < CACHE_DURATION) {
            console.log('📚 Using cached species catalog');
            setCatalog(data);
            setIsLoading(false);
            return;
          }
        }

        // Fetch from API
        const apiUrl = `${API_CONFIG.BASE_URL}/api/v1/species`;
        console.log('🌐 Fetching species catalog from:', apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          console.error(
            '❌ Species catalog fetch failed:',
            response.status,
            response.statusText
          );
          throw new Error('Failed to fetch species catalog');
        }

        const result = await response.json();
        console.log('✅ Species catalog response:', result);

        // Convert array to map
        const catalogMap: SpeciesCatalog = {};
        result.data.forEach((species: Species) => {
          catalogMap[species.species_name] = species;
        });

        // Save to localStorage
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ data: catalogMap, timestamp: Date.now() })
        );

        setCatalog(catalogMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching species catalog:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  /**
   * Get species data by name
   */
  const getSpecies = (speciesName: string): Species | null => {
    return catalog[speciesName] || null;
  };

  /**
   * Get image URL for a species
   */
  const getSpeciesImage = (speciesName: string): string => {
    return catalog[speciesName]?.image_url || '/fish/fish1.png';
  };

  /**
   * Get display name for a species
   */
  const getSpeciesDisplayName = (speciesName: string): string => {
    return catalog[speciesName]?.display_name || speciesName;
  };

  /**
   * Get all species as array
   */
  const getAllSpecies = (): Species[] => {
    return Object.values(catalog);
  };

  /**
   * Clear cache (force reload on next mount)
   */
  const clearCache = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: SpeciesCatalogContextType = {
    catalog,
    isLoading,
    error,
    getSpecies,
    getSpeciesImage,
    getSpeciesDisplayName,
    getAllSpecies,
    clearCache,
  };

  return (
    <SpeciesCatalogContext.Provider value={value}>
      {children}
    </SpeciesCatalogContext.Provider>
  );
};

export const useSpeciesCatalog = (): SpeciesCatalogContextType => {
  const context = useContext(SpeciesCatalogContext);
  if (context === undefined) {
    throw new Error(
      'useSpeciesCatalog must be used within a SpeciesCatalogProvider'
    );
  }
  return context;
};
