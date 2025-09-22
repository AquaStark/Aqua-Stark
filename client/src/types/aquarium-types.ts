import { BigNumberish } from 'starknet';
import type { Fish } from './fish';

/**
 * Core aquarium interface representing the main aquarium entity
 * Consolidates aquarium data from different parts of the application
 */
export interface Aquarium {
  /** Unique identifier for the aquarium */
  id: number;
  /** Display name of the aquarium */
  name: string;
  /** Image URL or path for the aquarium */
  image: string;
  /** Current level of the aquarium */
  level: number;
  /** Type of aquarium (Standard, Premium, etc.) */
  type: string;
  /** Health percentage of the aquarium (0-100) */
  health: number;
  /** Last time the aquarium was visited */
  lastVisited: string;
  /** Number of fish in the aquarium as string */
  fishCount: string;
  /** Rating of the aquarium (1-5 stars) */
  rating: number;
  /** Whether this is a premium aquarium */
  isPremium?: boolean;
  /** Array of fish currently in the aquarium */
  fishes: Fish[];
}

/**
 * Statistics interface for aquarium metrics and analytics
 * Used for displaying aquarium statistics in the UI
 */
export interface AquariumStats {
  /** Total number of aquariums owned */
  totalAquariums: number;
  /** Total number of fish across all aquariums */
  totalFish: number;
  /** Number of premium aquariums */
  premiumAquariums: number;
  /** Average health percentage across all aquariums */
  averageHealth: number;
}

/**
 * Aquarium type enumeration
 * Defines the different types of aquariums available
 */
export type AquariumType = 'Standard' | 'Premium' | 'Deluxe' | 'Ultimate';

/**
 * Contract-specific aquarium interface for blockchain integration
 * Represents the on-chain aquarium state from the smart contract
 */
export interface ContractAquarium {
  /** Unique identifier for the aquarium */
  id: BigNumberish;
  /** Owner address of the aquarium */
  owner: string;
  /** Current number of fish in the aquarium */
  fish_count: BigNumberish;
  /** Current number of decorations in the aquarium */
  decoration_count: BigNumberish;
  /** Maximum capacity of fish for this aquarium */
  max_capacity: BigNumberish;
  /** Cleanliness level of the aquarium */
  cleanliness: BigNumberish;
  /** Array of fish IDs currently housed in the aquarium */
  housed_fish: Array<BigNumberish>;
  /** Array of decoration IDs currently in the aquarium */
  housed_decorations: Array<BigNumberish>;
  /** Maximum number of decorations allowed */
  max_decorations: BigNumberish;
}

/**
 * Aquarium data interface for simplified aquarium representation
 * Used in game logic and data transfer
 */
export interface AquariumData {
  /** Unique identifier for the aquarium */
  id: number;
  /** Display name of the aquarium */
  name: string;
  /** Array of fish in the aquarium */
  fishes: Fish[];
}

/**
 * Aquarium state enumeration
 * Defines the different states an aquarium can be in
 */
export type AquariumState =
  | 'active' // Aquarium is active and being used
  | 'inactive' // Aquarium is not currently active
  | 'maintenance' // Aquarium is under maintenance
  | 'locked' // Aquarium is locked and cannot be accessed
  | 'upgrading'; // Aquarium is being upgraded

/**
 * Aquarium health status enumeration
 * Based on health percentage ranges
 */
export type AquariumHealthStatus =
  | 'excellent' // 90-100%
  | 'good' // 70-89%
  | 'fair' // 50-69%
  | 'poor' // 30-49%
  | 'critical'; // 0-29%

/**
 * Aquarium configuration interface
 * Contains configuration settings for aquarium behavior
 */
export interface AquariumConfig {
  /** Maximum number of fish allowed */
  maxFish: number;
  /** Maximum number of decorations allowed */
  maxDecorations: number;
  /** Base cleanliness decay rate per hour */
  cleanlinessDecayRate: number;
  /** Base health decay rate per hour */
  healthDecayRate: number;
  /** Whether the aquarium supports breeding */
  supportsBreeding: boolean;
  /** Whether the aquarium supports decorations */
  supportsDecorations: boolean;
}

/**
 * Aquarium metrics interface
 * Contains real-time metrics for aquarium monitoring
 */
export interface AquariumMetrics {
  /** Current cleanliness level (0-100) */
  cleanliness: number;
  /** Current food level (0-100) */
  food: number;
  /** Current number of fish */
  currentFish: number;
  /** Maximum number of fish allowed */
  maxFish: number;
  /** Last maintenance timestamp */
  lastMaintenance?: Date;
  /** Last feeding timestamp */
  lastFeeding?: Date;
}

/**
 * Type validation functions for aquarium types
 */
export const AquariumTypeValidation = {
  /**
   * Validates if a value is a valid aquarium type
   */
  isValidAquariumType: (value: string): value is AquariumType => {
    return ['Standard', 'Premium', 'Deluxe', 'Ultimate'].includes(value);
  },

  /**
   * Validates if a value is a valid aquarium state
   */
  isValidAquariumState: (value: string): value is AquariumState => {
    return [
      'active',
      'inactive',
      'maintenance',
      'locked',
      'upgrading',
    ].includes(value);
  },

  /**
   * Validates if a value is a valid aquarium health status
   */
  isValidAquariumHealthStatus: (
    value: string
  ): value is AquariumHealthStatus => {
    return ['excellent', 'good', 'fair', 'poor', 'critical'].includes(value);
  },

  /**
   * Gets health status based on health percentage
   */
  getHealthStatus: (health: number): AquariumHealthStatus => {
    if (health >= 90) return 'excellent';
    if (health >= 70) return 'good';
    if (health >= 50) return 'fair';
    if (health >= 30) return 'poor';
    return 'critical';
  },

  /**
   * Validates aquarium data structure
   */
  validateAquarium: (aquarium: Partial<Aquarium>): string[] => {
    const errors: string[] = [];

    if (!aquarium.id || typeof aquarium.id !== 'number') {
      errors.push('Aquarium ID must be a valid number');
    }

    if (!aquarium.name || typeof aquarium.name !== 'string') {
      errors.push('Aquarium name must be a valid string');
    }

    if (
      aquarium.health !== undefined &&
      (aquarium.health < 0 || aquarium.health > 100)
    ) {
      errors.push('Aquarium health must be between 0 and 100');
    }

    if (
      aquarium.rating !== undefined &&
      (aquarium.rating < 1 || aquarium.rating > 5)
    ) {
      errors.push('Aquarium rating must be between 1 and 5');
    }

    return errors;
  },
};
