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
