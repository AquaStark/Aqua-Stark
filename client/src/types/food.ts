// Food system types
export interface FoodItem {
  id: number;
  position: { x: number; y: number };
  createdAt: number;
  consumed: boolean;
  attractionRadius: number;
  scale: number; // For spawn animation
}

export interface FoodSystemState {
  foods: FoodItem[];
  lastSpawnTime: number;
  spawnCooldown: number; // milliseconds
  maxFoodsPerSecond: number;
}
