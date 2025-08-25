// Type declarations for fish indicators and hook options

export type IndicatorValue = number; // 0..100

export interface FishIndicatorState {
  hunger: IndicatorValue; // 0 (starving) .. 100 (full)
  energy: IndicatorValue; // 0 (exhausted) .. 100 (energized)
  happiness: IndicatorValue; // 0 (sad) .. 100 (happy)
  lastFedAt: Date | null;
  lastUpdatedAt: Date | null;
}

export interface HappinessWeights {
  hunger: number; // contribution weight
  energy: number;
  cleanliness: number; // weight for cleanliness factor (0..100 scale)
}

export interface FishIndicatorOptions {
  tickMs: number; // update interval
  hungerDecayPerHour: number; // points/hour decrease
  energyDecayPerHour: number; // points/hour decrease (base)
  feedingBoost: number; // points added to hunger on feed
  maxCleanlinessPenalty: number; // max extra % decay at 0 cleanliness (e.g., 0.5 => +50%)
  happinessWeights: HappinessWeights;
  clampMin: number;
  clampMax: number;
}

export interface UseFishIndicatorsParams {
  fishId: string | number;
  initial?: Partial<FishIndicatorState>;
  lastFedTimestamp?: Date | string | number | null;
  lastUpdated?: Date | string | number | null;
  cleanliness?: IndicatorValue; // 0..100 (100 = perfectly clean)
  options?: Partial<FishIndicatorOptions>;
  onChange?: (state: FishIndicatorState) => void; // callback on each update
}

export interface UseFishIndicatorsReturn {
  indicators: FishIndicatorState;
  feed: (boost?: number, fedAt?: Date) => void;
  setCleanliness: (value: IndicatorValue) => void;
  reset: (state?: Partial<FishIndicatorState>) => void;
}
