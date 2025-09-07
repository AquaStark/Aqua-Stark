import { BigNumberish } from 'starknet';

export interface FishType {
  id: number;
  name: string;
  image: string;
  position: {
    x: number;
    y: number;
  };
  rarity: string;
  generation: number;
  // Optional timestamps from backend (Supabase fish_states)
  lastFedTimestamp?: Date | string | number | null;
  lastUpdated?: Date | string | number | null;
  stats?: {
    happiness: number;
    hunger: number;
    energy: number;
  };
}

export interface AquariumData {
  id: number;
  name: string;
  fishes: FishType[];
}

// Contract-specific types
export interface ContractAquarium {
  id: BigNumberish;
  owner: string;
  fish_count: BigNumberish;
  decoration_count: BigNumberish;
  max_capacity: BigNumberish;
  cleanliness: BigNumberish;
  housed_fish: Array<BigNumberish>;
  housed_decorations: Array<BigNumberish>;
  max_decorations: BigNumberish;
}

export interface ContractFish {
  id: BigNumberish;
  owner: string;
  species: unknown; // Cairo enum type
  generation: BigNumberish;
  rarity: BigNumberish;
  traits: {
    color: BigNumberish;
    pattern: BigNumberish;
    fins: BigNumberish;
    size: BigNumberish;
  };
  stats: {
    hunger: BigNumberish;
    happiness: BigNumberish;
    energy: BigNumberish;
  };
  last_fed: BigNumberish;
  breeding_cooldown: BigNumberish;
}

// Fish species enum type - match the actual species used in the codebase
export type FishSpecies = 'AngelFish' | 'GoldFish' | 'Betta' | 'NeonTetra' | 'Corydoras' | 'Hybrid';

// Fish species data mapping
export interface FishSpeciesData {
  image: string;
  name: string;
  rarity: string;
  generation: number;
}

// Error types
export interface GameError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
