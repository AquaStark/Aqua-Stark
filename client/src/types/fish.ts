import type { UIFish, FishState } from './fish-types';

// Legacy aliases kept for backwards compatibility across the app
export type FishStateType = FishState;
export type Fish = UIFish;

export interface BreedingPair {
  father: Fish | null;
  mother: Fish | null;
}

export interface BreedingResult {
  id: number;
  name: string;
  image: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  generation?: number;
  traits: {
    color: string;
    pattern: string;
    fins: string;
    size: string;
    special?: string;
  };
  parents: {
    father: number;
    mother: number;
  };
  discovered: string;
}

export interface GeneticCombination {
  trait: string;
  fatherGene: string;
  motherGene: string;
  possibleOutcomes: {
    outcome: string;
    probability: number;
  }[];
}
