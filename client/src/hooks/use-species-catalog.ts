import { useState, useEffect } from 'react';
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

const STORAGE_KEY = 'aqua_stark_species_catalog';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hook to manage species catalog
 * Uses localStorage cache with fallback to API
 */
export const useSpeciesCatalog = () => {
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
            setCatalog(data);
            setIsLoading(false);
            return;
          }
        }

        // Fetch from API
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/species`);

        if (!response.ok) {
          throw new Error('Failed to fetch species catalog');
        }

        const result = await response.json();

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
   * Hardcoded species catalog as fallback
   */
  const getHardcodedSpeciesImage = (speciesName: string): string => {
    const hardcodedImages: Record<string, string> = {
      'Betta': '/fish/fish2.png',
      'Corydoras': '/fish/fish5.png',
      'AngelFish': '/fish/fish1.png',
      'GoldFish': '/fish/fish3.png',
      'NeonTetra': '/fish/fish4.png',
      'Hybrid': '/fish/fish6.png'
    };
    return hardcodedImages[speciesName] || '/fish/fish1.png';
  };

  /**
   * Get image URL for a species
   */
  const getSpeciesImage = (speciesName: string): string => {
    const found = catalog[speciesName];
    console.log('🔎 Catalog lookup for', speciesName, ':', found);
    console.log('📚 Available species in catalog:', Object.keys(catalog));
    
    // Use hardcoded fallback if catalog is empty
    if (Object.keys(catalog).length === 0) {
      console.log('🔄 Using hardcoded fallback for', speciesName);
      return getHardcodedSpeciesImage(speciesName);
    }
    
    return catalog[speciesName]?.image_url || getHardcodedSpeciesImage(speciesName);
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

  return {
    catalog,
    isLoading,
    error,
    getSpecies,
    getSpeciesImage,
    getSpeciesDisplayName,
    getAllSpecies,
    clearCache,
  };
};
