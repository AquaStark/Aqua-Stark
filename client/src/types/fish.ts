export type FishStateType = 'idle' | 'swimming' | 'eating' | 'rejecting';
export interface Fish {
  id: number;
  name: string;
  image: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  generation: number;
  level: number;
  hunger: number;
  state: FishStateType;
  lastRejection?: number;
  traits: {
    color: string;
    pattern: string;
    fins: string;
    size: string;
    special?: string;
  };
  breedingCooldown?: string;
  parents?: {
    father: number;
    mother: number;
  };
}

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
