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
}

export interface AquariumData {
  id: any;
  name: string;
  fishes: FishType[];
}
