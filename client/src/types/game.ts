export interface FishType {
  id: number
  name: string
  image: string
  position: {
    x: number
    y: number
  };
  rarity: string
  generation: number
}

export interface FoodType {
  id: number;
  position: {
    x: number;
    y: number;
  };
  createdAt: number; // timestamp for animation and cleanup
} 
export interface AquariumData {
  id: any
  name: string
  fishes: FishType[]
}
