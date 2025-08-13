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
