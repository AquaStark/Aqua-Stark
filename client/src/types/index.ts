/**
 * @fileoverview Central export file for all type definitions
 * This file exports all types from the types directory for easy importing
 */

// Shop and marketplace types (exported first to take precedence)
export * from './shop-types';

// Core game types
export * from './game';
export * from './fishIndicators';

// API and backend types
export * from './api-types';

// User types (centralized user-related types)
export * from './user-types';

// Laboratory and breeding types (excluding conflicting types from fish.ts)
export type {
  FishStateType,
  BreedingPair as FishBreedingPair,
  BreedingResult as FishBreedingResult,
} from './fish';

// Food system types
export * from './food';

// Events and community types
export * from './events';
export * from './community';

// Wallet and connector types (excluding conflicting types)
export type { WalletConnector as WalletConnectorType } from './wallet-types';

export * from './connector-types';

// UI and component types
export * from './ui-types';

// Help system types
export * from './help-types';

// Dirt system types
export * from './dirt';

// Dojo blockchain types
export * from './dojo';

// Cartridge types (legacy - use user-types instead)
// Exclude types that are now centralized in user-types.ts
export type {
  CartridgeConfig,
  CartridgeLoginOptions,
  CartridgeSessionPolicies,
  CartridgeEvent,
  CartridgeError,
  CartridgeErrorType,
  ConnectButtonProps,
  CartridgeModalProps,
  GameSessionPolicies,
} from './cartridge';
