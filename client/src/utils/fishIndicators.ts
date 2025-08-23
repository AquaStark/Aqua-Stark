// Utility functions and defaults for fish health indicators
import type {
  FishIndicatorOptions,
  FishIndicatorState,
  IndicatorValue,
  HappinessWeights,
} from '@/types/fishIndicators';

export const DEFAULT_OPTIONS: FishIndicatorOptions = {
  tickMs: 1000,
  hungerDecayPerHour: 15, // decreases 15 pts/hour since last fed
  energyDecayPerHour: 10, // base decay 10 pts/hour
  feedingBoost: 35, // add when fish eats
  maxCleanlinessPenalty: 0.5, // up to +50% extra decay at 0 cleanliness
  happinessWeights: { hunger: 0.5, energy: 0.4, cleanliness: 0.1 },
  clampMin: 0,
  clampMax: 100,
};

export const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

export function hoursBetween(a: Date, b: Date): number {
  return Math.max(0, (b.getTime() - a.getTime()) / (1000 * 60 * 60));
}

export function cleanlinessPenalty(
  cleanliness: IndicatorValue,
  maxPenalty: number
): number {
  // cleanliness 100 => no penalty, 0 => maxPenalty
  const factor = 1 - clamp(cleanliness, 0, 100) / 100;
  return factor * maxPenalty;
}

export function applyDecay(
  value: number,
  hours: number,
  baseDecayPerHour: number,
  cleanliness: IndicatorValue,
  maxPenalty: number,
  clampMin: number,
  clampMax: number
): number {
  const penalty = cleanlinessPenalty(cleanliness, maxPenalty);
  const decay = hours * baseDecayPerHour * (1 + penalty);
  return clamp(value - decay, clampMin, clampMax);
}

export function computeHappiness(
  hunger: number,
  energy: number,
  cleanliness: IndicatorValue,
  weights: HappinessWeights,
  clampMin: number,
  clampMax: number
): number {
  const normClean = clamp(cleanliness, 0, 100);
  const raw =
    hunger * weights.hunger + energy * weights.energy + normClean * weights.cleanliness;
  const weightSum = weights.hunger + weights.energy + weights.cleanliness;
  return clamp(raw / Math.max(1e-6, weightSum), clampMin, clampMax);
}

export function computeNextIndicators(
  prev: FishIndicatorState,
  now: Date,
  cleanliness: IndicatorValue,
  options: FishIndicatorOptions
): FishIndicatorState {
  const lastUpdated = prev.lastUpdatedAt ?? prev.lastFedAt ?? now;
  const hours = hoursBetween(lastUpdated, now);

  const hunger = applyDecay(
    prev.hunger,
    hours,
    options.hungerDecayPerHour,
    cleanliness,
    options.maxCleanlinessPenalty,
    options.clampMin,
    options.clampMax
  );

  const energy = applyDecay(
    prev.energy,
    hours,
    options.energyDecayPerHour,
    cleanliness,
    options.maxCleanlinessPenalty,
    options.clampMin,
    options.clampMax
  );

  const happiness = computeHappiness(
    hunger,
    energy,
    cleanliness,
    options.happinessWeights,
    options.clampMin,
    options.clampMax
  );

  return {
    hunger,
    energy,
    happiness,
    lastFedAt: prev.lastFedAt,
    lastUpdatedAt: now,
  };
}

export function feedIndicators(
  state: FishIndicatorState,
  boost: number,
  options: FishIndicatorOptions
): FishIndicatorState {
  const hunger = clamp(state.hunger + boost, options.clampMin, options.clampMax);
  return {
    ...state,
    hunger,
    lastFedAt: new Date(),
  };
}
