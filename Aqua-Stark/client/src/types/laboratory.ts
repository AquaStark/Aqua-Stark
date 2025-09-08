import { Fish } from '@/types/fish';

export interface BreedingPair {
  father: Fish | null;
  mother: Fish | null;
}

export interface BreedingResult {
  id: number;
  name: string;
  image: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
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
