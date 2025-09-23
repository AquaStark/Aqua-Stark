/**
 * Centralized fish-related types for the Aqua-Stark client
 *
 * This file consolidates fish entities, stats, rarity and state types
 * to avoid duplication across the codebase.
 */

/**
 * Rarity classification for fish shown in the UI and market.
 * Keep values capitalized to match existing usage across the app.
 */
export type FishRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Special';

/**
 * Lowercase rarity variant used by some UI elements.
 * Provided for compatibility with components that expect lowercase strings.
 */
export type FishRarityLower = Lowercase<Exclude<FishRarity, 'Special'>> | 'exotic';

/**
 * Fish behavior/state as used by animations and systems.
 */
export type FishState =
  | 'idle'
  | 'swimming'
  | 'eating'
  | 'rejecting'
  | 'darting'
  | 'hovering'
  | 'turning'
  | 'feeding'
  | 'exploring'
  | 'playful';

/**
 * Core stats tracked for fish well-being.
 */
export interface FishStats {
  /** 0-100 happiness level */
  happiness: number;
  /** 0-100 hunger level (higher means more hungry or vice versa depending on system) */
  hunger: number;
  /** 0-100 energy level */
  energy: number;
}

/**
 * Base fish entity used across UI, market and systems.
 * Additional domain-specific fields should extend this interface in their own modules.
 */
export interface FishBase {
  /** Unique fish identifier */
  id: number;
  /** Display name */
  name: string;
  /** Image path for rendering */
  image: string;
  /** Rarity class */
  rarity: FishRarity;
  /** Generational lineage index */
  generation: number;
}

/**
 * Required properties commonly used in UI and systems.
 */
export interface FishRequiredProps {
  /** Hunger numeric used by feeding system */
  hunger: number;
  /** Visual/behavioral traits */
  traits: {
    color: string;
    pattern: string;
    fins: string;
    size: string;
    special?: string;
  };
}

/**
 * Optional traits and state commonly used in UI.
 */
export interface FishOptionalProps {
  /** Optional current level (when gamified leveling is enabled) */
  level?: number;
  /** Behavior state used by animations and interactions */
  state?: FishState;
  /** Timestamp of last rejection in ms epoch */
  lastRejection?: number;
  /** Breeding cooldown display value */
  breedingCooldown?: string;
  /** Parent references by id */
  parents?: {
    father: number;
    mother: number;
  } | null;
  /** Optional stats block if available */
  stats?: FishStats;
  /** Optional backend timestamps for fish_states syncing */
  lastFedTimestamp?: Date | string | number | null;
  lastUpdated?: Date | string | number | null;
}

/**
 * Unified fish type used for UI-oriented features (market, profile, lists).
 * Compose from base plus optional props to keep compatibility while avoiding duplication.
 */
export type UIFish = FishBase & FishRequiredProps & FishOptionalProps;

// =============================================================================
// TYPE GUARDS / RUNTIME VALIDATION (lightweight)
// =============================================================================

/** Checks whether a value is a valid FishRarity string */
export function isFishRarity(value: unknown): value is FishRarity {
  return (
    typeof value === 'string' &&
    ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Special'].includes(value)
  );
}

/** Validates that the object conforms to FishStats shape */
export function isFishStats(value: unknown): value is FishStats {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.happiness === 'number' &&
    typeof v.hunger === 'number' &&
    typeof v.energy === 'number'
  );
}

/** Validates that the object looks like a UIFish (minimum required fields) */
export function isUIFish(value: unknown): value is UIFish {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.name === 'string' &&
    typeof v.image === 'string' &&
    isFishRarity(v.rarity) &&
    typeof v.generation === 'number' &&
    typeof v.hunger === 'number' &&
    v.traits !== undefined &&
    typeof (v.traits as any).color === 'string' &&
    typeof (v.traits as any).pattern === 'string' &&
    typeof (v.traits as any).fins === 'string' &&
    typeof (v.traits as any).size === 'string'
  );
}


