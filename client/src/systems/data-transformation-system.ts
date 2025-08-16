/**
 * Data Transformation System
 * Handles data conversions for contract interactions
 */

import { CairoCustomEnum } from 'starknet';
import { stringToFelt } from '@/utils/starknet';

/**
 * Fish species available in the game
 */
export const FISH_SPECIES = [
  'GoldFish',
  'AngelFish', 
  'Betta',
  'NeonTetra',
  'Corydoras'
] as const;

export type FishSpecies = typeof FISH_SPECIES[number];

/**
 * Result type for string to felt conversion
 */
export interface FeltConversionResult {
  success: boolean;
  value: string | string[] | bigint | null;
  error: string | null;
}

/**
 * Safely convert string to felt with error handling
 */
export function safeStringToFelt(value: string, fieldName: string): FeltConversionResult {
  if (!value || value.trim() === '') {
    return {
      success: false,
      value: null,
      error: `${fieldName} is required`
    };
  }

  try {
    const feltValue = stringToFelt(value);
    
    // Check if result is an array (indicates string too long)
    if (Array.isArray(feltValue)) {
      return {
        success: false,
        value: null,
        error: `${fieldName} is too long for felt conversion`
      };
    }

    return {
      success: true,
      value: feltValue,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      value: null,
      error: `Failed to convert ${fieldName} to felt: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Create Cairo custom enum for fish species
 */
export function createFishSpeciesEnum(species: string): CairoCustomEnum {
  if (!FISH_SPECIES.includes(species as FishSpecies)) {
    throw new Error(`Invalid fish species: ${species}. Valid options: ${FISH_SPECIES.join(', ')}`);
  }

  return new CairoCustomEnum({ [species]: {} });
}

/**
 * Safely parse integer with validation
 */
export function safeParseInt(value: string, fieldName: string, minValue: number = 0): {
  success: boolean;
  value: number | null;
  error: string | null;
} {
  if (!value || value.trim() === '') {
    return {
      success: false,
      value: null,
      error: `${fieldName} is required`
    };
  }

  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    return {
      success: false,
      value: null,
      error: `${fieldName} must be a valid number`
    };
  }

  if (parsed < minValue) {
    return {
      success: false,
      value: null,
      error: `${fieldName} must be at least ${minValue}`
    };
  }

  return {
    success: true,
    value: parsed,
    error: null
  };
}

/**
 * Transform form data for contract calls
 */
export class GameDataTransformer {
  /**
   * Transform decoration data for contract creation
   */
  static transformDecorationData(data: {
    name: string;
    description: string;
    price: string;
    rarity: string;
  }) {
    const nameResult = safeStringToFelt(data.name, 'Decoration name');
    if (!nameResult.success) {
      return { success: false, error: nameResult.error };
    }

    const descResult = safeStringToFelt(data.description, 'Decoration description');
    if (!descResult.success) {
      return { success: false, error: descResult.error };
    }

    const priceResult = safeParseInt(data.price, 'Price', 0);
    if (!priceResult.success) {
      return { success: false, error: priceResult.error };
    }

    const rarityResult = safeParseInt(data.rarity, 'Rarity', 1);
    if (!rarityResult.success) {
      return { success: false, error: rarityResult.error };
    }

    return {
      success: true,
      data: {
        name: nameResult.value as string,
        description: descResult.value as string,
        price: priceResult.value as number,
        rarity: rarityResult.value as number
      }
    };
  }

  /**
   * Transform fish data for contract creation
   */
  static transformFishData(data: {
    aquariumId: string;
    species: string;
  }) {
    const aquariumResult = safeParseInt(data.aquariumId, 'Aquarium ID', 1);
    if (!aquariumResult.success) {
      return { success: false, error: aquariumResult.error };
    }

    try {
      const speciesEnum = createFishSpeciesEnum(data.species);
      
      return {
        success: true,
        data: {
          aquariumId: aquariumResult.value as number,
          species: speciesEnum
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Invalid fish species' 
      };
    }
  }

  /**
   * Transform aquarium data for contract creation
   */
  static transformAquariumData(data: {
    maxCapacity: string;
    maxDecorations: string;
  }) {
    const capacityResult = safeParseInt(data.maxCapacity, 'Max capacity', 1);
    if (!capacityResult.success) {
      return { success: false, error: capacityResult.error };
    }

    const decorationsResult = safeParseInt(data.maxDecorations, 'Max decorations', 1);
    if (!decorationsResult.success) {
      return { success: false, error: decorationsResult.error };
    }

    return {
      success: true,
      data: {
        maxCapacity: capacityResult.value as number,
        maxDecorations: decorationsResult.value as number
      }
    };
  }

  /**
   * Transform movement data for fish/decoration transfers
   */
  static transformMovementData(data: {
    itemId: string;
    fromAquariumId: string;
    toAquariumId: string;
  }) {
    const itemResult = safeParseInt(data.itemId, 'Item ID', 1);
    if (!itemResult.success) {
      return { success: false, error: itemResult.error };
    }

    const fromResult = safeParseInt(data.fromAquariumId, 'From Aquarium ID', 1);
    if (!fromResult.success) {
      return { success: false, error: fromResult.error };
    }

    const toResult = safeParseInt(data.toAquariumId, 'To Aquarium ID', 1);
    if (!toResult.success) {
      return { success: false, error: toResult.error };
    }

    return {
      success: true,
      data: {
        itemId: itemResult.value as number,
        fromAquariumId: fromResult.value as number,
        toAquariumId: toResult.value as number
      }
    };
  }

  /**
   * Transform breeding data for fish reproduction
   */
  static transformBreedingData(data: {
    parent1Id: string;
    parent2Id: string;
  }) {
    const parent1Result = safeParseInt(data.parent1Id, 'Parent 1 ID', 1);
    if (!parent1Result.success) {
      return { success: false, error: parent1Result.error };
    }

    const parent2Result = safeParseInt(data.parent2Id, 'Parent 2 ID', 1);
    if (!parent2Result.success) {
      return { success: false, error: parent2Result.error };
    }

    return {
      success: true,
      data: {
        parent1Id: parent1Result.value as number,
        parent2Id: parent2Result.value as number
      }
    };
  }
}

/**
 * Response formatting utilities
 */
export class ResponseFormatter {
  /**
   * Format contract response for display
   */
  static formatContractResponse(response: unknown): string {
    if (response === null || response === undefined) {
      return 'No response data';
    }

    try {
      return JSON.stringify(
        response,
        (_key, value) => typeof value === 'bigint' ? value.toString() : value,
        2
      );
    } catch (error) {
      return `Error formatting response: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Format error for user display
   */
  static formatError(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unknown error occurred';
  }
}