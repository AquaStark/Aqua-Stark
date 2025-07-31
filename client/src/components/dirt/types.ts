export interface DirtSpot {
  id: string;
  x: number;
  y: number;
  type: DirtType;
  shape: DirtShape;
  size: number;
  opacity: number;
  createdAt: number;
  isBeingCleaned?: boolean;
}

export enum DirtType {
  BASIC = "basic",
  ALGAE = "algae",
  WASTE = "waste",
  DEBRIS = "debris",
}

export enum DirtShape {
  CIRCLE = "circle",
  OVAL = "oval",
  IRREGULAR = "irregular",
  SPLATTER = "splatter",
}

export interface DirtSystemConfig {
  spawnInterval: number;
  maxSpots: number;
  spawnChance: number;
  aquariumBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DirtSystemState {
  spots: DirtSpot[];
  isSpawnerActive: boolean;
  totalCreated: number;
  totalRemoved: number;
  cleanliness: number;
}
