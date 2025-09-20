/**
 * @fileoverview Centralized user-related types for the Aqua-Stark game
 * This file consolidates all user, player, and account types to avoid duplication
 */

import type { BigNumberish } from 'starknet';

/**
 * Core user interface representing the basic user entity
 * @interface User
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's wallet address */
  walletAddress: string;
  /** Display username */
  username: string;
  /** User's email address (optional) */
  email?: string;
  /** User's avatar URL (optional) */
  avatar?: string;
  /** Session type for authentication */
  sessionType?: 'social' | 'wallet' | 'passkey';
  /** Authentication provider */
  provider?: 'google' | 'discord' | 'walletconnect' | 'native';
  /** User creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * Complete user profile with game-specific data
 * @interface UserProfile
 */
export interface UserProfile extends User {
  /** User's experience points */
  experience: number;
  /** User's current level */
  level: number;
  /** User's in-game currency */
  currency: number;
  /** Last login timestamp */
  lastLogin: string;
  /** User preferences and settings */
  preferences: Record<string, unknown>;
  /** User's game statistics */
  stats: UserStats;
}

/**
 * User statistics and achievements
 * @interface UserStats
 */
export interface UserStats {
  /** Total number of fish owned */
  totalFish: number;
  /** Total number of aquariums owned */
  totalAquariums: number;
  /** Number of achievements unlocked */
  achievements: number;
  /** Total playtime in minutes */
  totalPlaytime?: number;
  /** Number of fish bred */
  fishBred?: number;
  /** Number of trades completed */
  tradesCompleted?: number;
}

/**
 * Backend representation of user data (snake_case format)
 * @interface BackendUserData
 */
export interface BackendUserData {
  id: string;
  wallet_address: string;
  username: string;
  email?: string;
  avatar?: string;
  experience: number;
  level: number;
  currency: number;
  last_login: string;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * On-chain user data representation
 * @interface OnChainUserData
 */
export interface OnChainUserData {
  id: string;
  owner: string;
  username: string;
  experience: number;
  level: number;
  currency: number;
  last_login: number;
}

/**
 * User session state
 * @interface UserSession
 */
export interface UserSession {
  /** Whether user is currently connected */
  isConnected: boolean;
  /** User account information */
  account?: User;
  /** Whether connection is in progress */
  isConnecting: boolean;
  /** Session identifier */
  sessionId?: string;
  /** Session expiration date */
  expiresAt?: Date;
}

/**
 * User authentication states
 * @type UserAuthState
 */
export type UserAuthState = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'authenticating'
  | 'authenticated'
  | 'error';

/**
 * User connection states
 * @type UserConnectionState
 */
export type UserConnectionState = 
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected'
  | 'error';

/**
 * User profile update payload
 * @interface UserProfileUpdate
 */
export interface UserProfileUpdate {
  username?: string;
  avatar?: string;
  preferences?: Record<string, unknown>;
}

/**
 * User validation result
 * @interface UserValidationResult
 */
export interface UserValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * User statistics update payload
 * @interface UserStatsUpdate
 */
export interface UserStatsUpdate {
  totalFish?: number;
  totalAquariums?: number;
  achievements?: number;
  totalPlaytime?: number;
  fishBred?: number;
  tradesCompleted?: number;
}

// ===== TYPE VALIDATION FUNCTIONS =====

/**
 * Validates if an object matches the User interface
 * @param obj - Object to validate
 * @returns UserValidationResult
 */
export function validateUser(obj: unknown): UserValidationResult {
  const errors: string[] = [];
  
  if (!obj || typeof obj !== 'object') {
    return { isValid: false, errors: ['User must be an object'] };
  }
  
  const user = obj as Record<string, unknown>;
  
  if (!user.id || typeof user.id !== 'string') {
    errors.push('User id is required and must be a string');
  }
  
  if (!user.walletAddress || typeof user.walletAddress !== 'string') {
    errors.push('User walletAddress is required and must be a string');
  }
  
  if (!user.username || typeof user.username !== 'string') {
    errors.push('User username is required and must be a string');
  }
  
  if (user.email && typeof user.email !== 'string') {
    errors.push('User email must be a string if provided');
  }
  
  if (user.avatar && typeof user.avatar !== 'string') {
    errors.push('User avatar must be a string if provided');
  }
  
  if (user.sessionType && !['social', 'wallet', 'passkey'].includes(user.sessionType as string)) {
    errors.push('User sessionType must be one of: social, wallet, passkey');
  }
  
  if (user.provider && !['google', 'discord', 'walletconnect', 'native'].includes(user.provider as string)) {
    errors.push('User provider must be one of: google, discord, walletconnect, native');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates if an object matches the UserProfile interface
 * @param obj - Object to validate
 * @returns UserValidationResult
 */
export function validateUserProfile(obj: unknown): UserValidationResult {
  const userValidation = validateUser(obj);
  if (!userValidation.isValid) {
    return userValidation;
  }
  
  const errors: string[] = [...userValidation.errors];
  const profile = obj as Record<string, unknown>;
  
  if (typeof profile.experience !== 'number' || profile.experience < 0) {
    errors.push('UserProfile experience must be a non-negative number');
  }
  
  if (typeof profile.level !== 'number' || profile.level < 1) {
    errors.push('UserProfile level must be a positive number');
  }
  
  if (typeof profile.currency !== 'number' || profile.currency < 0) {
    errors.push('UserProfile currency must be a non-negative number');
  }
  
  if (!profile.lastLogin || typeof profile.lastLogin !== 'string') {
    errors.push('UserProfile lastLogin is required and must be a string');
  }
  
  if (!profile.preferences || typeof profile.preferences !== 'object') {
    errors.push('UserProfile preferences must be an object');
  }
  
  if (!profile.stats || typeof profile.stats !== 'object') {
    errors.push('UserProfile stats is required and must be an object');
  } else {
    const statsValidation = validateUserStats(profile.stats);
    if (!statsValidation.isValid) {
      errors.push(...statsValidation.errors.map(error => `stats.${error}`));
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates if an object matches the UserStats interface
 * @param obj - Object to validate
 * @returns UserValidationResult
 */
export function validateUserStats(obj: unknown): UserValidationResult {
  const errors: string[] = [];
  
  if (!obj || typeof obj !== 'object') {
    return { isValid: false, errors: ['UserStats must be an object'] };
  }
  
  const stats = obj as Record<string, unknown>;
  
  if (typeof stats.totalFish !== 'number' || stats.totalFish < 0) {
    errors.push('UserStats totalFish must be a non-negative number');
  }
  
  if (typeof stats.totalAquariums !== 'number' || stats.totalAquariums < 0) {
    errors.push('UserStats totalAquariums must be a non-negative number');
  }
  
  if (typeof stats.achievements !== 'number' || stats.achievements < 0) {
    errors.push('UserStats achievements must be a non-negative number');
  }
  
  if (stats.totalPlaytime !== undefined && (typeof stats.totalPlaytime !== 'number' || stats.totalPlaytime < 0)) {
    errors.push('UserStats totalPlaytime must be a non-negative number if provided');
  }
  
  if (stats.fishBred !== undefined && (typeof stats.fishBred !== 'number' || stats.fishBred < 0)) {
    errors.push('UserStats fishBred must be a non-negative number if provided');
  }
  
  if (stats.tradesCompleted !== undefined && (typeof stats.tradesCompleted !== 'number' || stats.tradesCompleted < 0)) {
    errors.push('UserStats tradesCompleted must be a non-negative number if provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Settings value type for user preferences
 * @type SettingsValue
 */
export type SettingsValue = string | number | boolean | Record<string, unknown>;

/**
 * Game action call structure
 * @interface GameCall
 */
export interface GameCall {
  contractAddress: string;
  entrypoint: string;
  calldata: BigNumberish[];
}

/**
 * Game action parameters
 * @interface GameActionParams
 */
export interface GameActionParams {
  calls: GameCall[];
}

/**
 * Game action result
 * @interface GameActionResult
 */
export interface GameActionResult {
  hash: string;
  success?: boolean;
  error?: string;
}

// ===== LEGACY COMPATIBILITY TYPES =====
// These types maintain backward compatibility with existing code

/**
 * @deprecated Use UserProfile instead
 * Legacy player data interface for backward compatibility
 */
export interface PlayerData extends UserProfile {}

/**
 * @deprecated Use BackendUserData instead
 * Legacy backend player data interface for backward compatibility
 */
export interface BackendPlayerData extends BackendUserData {}

/**
 * @deprecated Use OnChainUserData instead
 * Legacy on-chain player data interface for backward compatibility
 */
export interface OnChainPlayerData extends OnChainUserData {}

/**
 * @deprecated Use User instead
 * Legacy cartridge account interface for backward compatibility
 */
export interface CartridgeAccount extends User {}

/**
 * @deprecated Use UserSession instead
 * Legacy cartridge session interface for backward compatibility
 */
export interface CartridgeSession extends UserSession {}

/**
 * @deprecated Use UserSession instead
 * Legacy cartridge session return type for backward compatibility
 */
export interface UseCartridgeSessionReturn extends UserSession {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
