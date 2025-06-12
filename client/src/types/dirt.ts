export interface DirtSpot {
  id: number;
  position: { x: number; y: number };
  type: DirtType;
  size: number;
  opacity: number;
  createdAt: number;
  isRemoving?: boolean;
}

export enum DirtType {
  BASIC = 'basic',
  ALGAE = 'algae',
  WASTE = 'waste',
  DEBRIS = 'debris'
}

export interface DirtSystemConfig {
  spawnInterval: number; // milliseconds
  maxSpots: number;
  minSpotDistance: number; // minimum distance between spots
  aquariumBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  spawnChance: number; // 0-1 probability
}

export interface DirtSystemState {
  spots: DirtSpot[];
  isSpawnerActive: boolean;
  totalSpotsCreated: number;
  totalSpotsRemoved: number;
  cleanlinessScore: number; // 0-100
}
