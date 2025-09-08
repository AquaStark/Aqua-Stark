export interface DirtSpot {
  id: number;
  position: { x: number; y: number };
  type: DirtType;
  size: number;
  opacity: number;
  createdAt: number;
  isRemoving?: boolean;
  // Enhanced properties for improved visuals and gameplay
  intensity?: number; // 0-1, increases over time for aging effect
  lastInteraction?: number; // timestamp of last cleaning attempt
  clickCount?: number; // number of times clicked (for resistance mechanics)
  subShapes?: DirtSubShape[]; // for organic shape rendering
}

// Sub-shapes for more organic dirt appearance
export interface DirtSubShape {
  size: number;
  x: number;
  y: number;
  opacity: number;
  rotation?: number;
}

export enum DirtType {
  BASIC = 'basic',
  ALGAE = 'algae',
  WASTE = 'waste',
  DEBRIS = 'debris',
  // Additional types for enhanced visuals
  ORGANIC = 'organic', // Backward compatible with BASIC
  GRIME = 'grime', // More stubborn dirt type
}

// Enhanced dirt type properties for visual customization
export interface DirtTypeProperties {
  baseColors: string[];
  intensityMultiplier: number; // How fast this type ages/darkens
  cleaningDifficulty: number; // 1-5, higher = more clicks needed
  particleColors: string[];
  spawnProbability: number; // 0-1, relative spawn chance
  sizeRange: { min: number; max: number };
  opacityRange: { min: number; max: number };
}

// Visual configuration for different dirt types
export const DIRT_TYPE_CONFIG: Record<DirtType, DirtTypeProperties> = {
  [DirtType.BASIC]: {
    baseColors: ['#8B4513', '#A0522D', '#6B4423'],
    intensityMultiplier: 1.0,
    cleaningDifficulty: 1,
    particleColors: ['#8B4513', '#D2691E', '#CD853F'],
    spawnProbability: 0.4,
    sizeRange: { min: 15, max: 25 },
    opacityRange: { min: 0.6, max: 0.9 },
  },
  [DirtType.ALGAE]: {
    baseColors: ['#228B22', '#2F4F4F', '#006400'],
    intensityMultiplier: 1.2,
    cleaningDifficulty: 2,
    particleColors: ['#228B22', '#32CD32', '#90EE90'],
    spawnProbability: 0.3,
    sizeRange: { min: 18, max: 30 },
    opacityRange: { min: 0.7, max: 1.0 },
  },
  [DirtType.WASTE]: {
    baseColors: ['#556B2F', '#6B8E23', '#4F4F2F'],
    intensityMultiplier: 0.8,
    cleaningDifficulty: 1,
    particleColors: ['#556B2F', '#9ACD32', '#ADFF2F'],
    spawnProbability: 0.2,
    sizeRange: { min: 12, max: 20 },
    opacityRange: { min: 0.5, max: 0.8 },
  },
  [DirtType.DEBRIS]: {
    baseColors: ['#708090', '#2F4F4F', '#696969'],
    intensityMultiplier: 0.5,
    cleaningDifficulty: 3,
    particleColors: ['#708090', '#C0C0C0', '#D3D3D3'],
    spawnProbability: 0.1,
    sizeRange: { min: 20, max: 35 },
    opacityRange: { min: 0.8, max: 1.0 },
  },
  [DirtType.ORGANIC]: {
    baseColors: ['#8B4513', '#A0522D', '#6B4423'],
    intensityMultiplier: 1.0,
    cleaningDifficulty: 1,
    particleColors: ['#8B4513', '#D2691E', '#CD853F'],
    spawnProbability: 0.4,
    sizeRange: { min: 15, max: 25 },
    opacityRange: { min: 0.6, max: 0.9 },
  },
  [DirtType.GRIME]: {
    baseColors: ['#2F2F2F', '#1C1C1C', '#4A4A4A'],
    intensityMultiplier: 1.5,
    cleaningDifficulty: 4,
    particleColors: ['#2F2F2F', '#4A4A4A', '#696969'],
    spawnProbability: 0.05,
    sizeRange: { min: 25, max: 40 },
    opacityRange: { min: 0.9, max: 1.0 },
  },
};

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
  // Enhanced configuration options
  enableAging?: boolean; // spots get more intense over time
  agingRate?: number; // how fast spots age (default: 1.0)
  dirtTypeWeights?: Partial<Record<DirtType, number>>; // custom spawn probabilities
  cleanlinessDecayRate?: number; // how fast cleanliness score decays
  enableDifficultyScaling?: boolean; // harder spots spawn over time
}

export interface DirtSystemState {
  spots: DirtSpot[];
  isSpawnerActive: boolean;
  totalSpotsCreated: number;
  totalSpotsRemoved: number;
  cleanlinessScore: number; // 0-100
  // Enhanced state tracking
  averageSpotAge: number;
  totalCleaningClicks: number;
  efficiency: number; // totalSpotsRemoved / totalSpotsCreated
  dirtTypeStats: Record<
    DirtType,
    {
      created: number;
      removed: number;
      averageTimeToClean: number;
    }
  >;
  lastSpawnTime: number;
  sessionStartTime: number;
}

// Animation and effect interfaces
export interface ParticleEffect {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  rotation?: number;
  rotationSpeed?: number;
}

export interface BubbleEffect {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  opacity?: number;
  speed?: number;
}

export interface CleaningRipple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  intensity: number; // based on dirt type difficulty
}

// Utility type for dirt system analytics
export interface DirtSystemAnalytics {
  sessionDuration: number;
  spotsPerMinute: number;
  cleaningEfficiency: number;
  averageResponseTime: number; // time between spawn and clean
  dirtTypePreferences: Record<DirtType, number>; // which types player cleans first
  cleaningHotspots: { x: number; y: number; count: number }[]; // most cleaned areas
}

// Event system for dirt-related actions
export type DirtSystemEvent =
  | {
      type: 'SPOT_SPAWNED';
      payload: { spot: DirtSpot; spawnLocation: { x: number; y: number } };
    }
  | {
      type: 'SPOT_CLICKED';
      payload: { spot: DirtSpot; clickPosition: { x: number; y: number } };
    }
  | {
      type: 'SPOT_CLEANED';
      payload: { spot: DirtSpot; cleaningTime: number; clickCount: number };
    }
  | {
      type: 'CLEANLINESS_CHANGED';
      payload: { oldScore: number; newScore: number; change: number };
    }
  | {
      type: 'SPAWNER_TOGGLED';
      payload: { isActive: boolean; timestamp: number };
    }
  | { type: 'SYSTEM_RESET'; payload: { timestamp: number } };

// Helper type for component props
export interface DirtSystemHook {
  // State
  spots: DirtSpot[];
  isSpawnerActive: boolean;
  cleanlinessScore: number;
  config: DirtSystemConfig;
  totalSpotsCreated: number;
  totalSpotsRemoved: number;

  // Actions
  toggleSpawner: () => void;
  forceSpawnSpot: () => void;
  removeDirtSpot: (spotId: number) => void;
  clearAllSpots: () => void;
  updateConfig: (newConfig: Partial<DirtSystemConfig>) => void;

  // Analytics
  getAnalytics: () => DirtSystemAnalytics;
  getSpotsByType: (type: DirtType) => DirtSpot[];
  getDirtCoverage: () => number; // percentage of aquarium covered
}

// Type guards and utilities
export function isDirtType(value: string): value is DirtType {
  return Object.values(DirtType).includes(value as DirtType);
}

export function getDirtTypeConfig(type: DirtType): DirtTypeProperties {
  return DIRT_TYPE_CONFIG[type] || DIRT_TYPE_CONFIG[DirtType.BASIC];
}

export function calculateSpotAge(spot: DirtSpot): number {
  return (Date.now() - spot.createdAt) / 1000; // age in seconds
}

export function calculateSpotIntensity(
  spot: DirtSpot,
  config: DirtSystemConfig
): number {
  if (!config.enableAging) return spot.opacity;

  const age = calculateSpotAge(spot);
  const typeConfig = getDirtTypeConfig(spot.type);
  const agingMultiplier = config.agingRate || 1.0;

  // Intensity increases over time based on dirt type
  const ageIntensity = Math.min(
    1,
    (age / 60) * typeConfig.intensityMultiplier * agingMultiplier
  );
  return Math.min(1, (spot.intensity || 0) + ageIntensity);
}

// Backward compatibility - ensure existing code works
export type { DirtSpot as DirtSpotType };
