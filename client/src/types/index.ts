/**
 * @fileoverview Centralized type exports for Aqua-Stark game client
 *
 * This file serves as the main entry point for all TypeScript types used throughout
 * the application. It organizes types by categories for better maintainability and
 * provides a single import location for components and hooks.
 *
 * @author Aqua-Stark Team
 * @version 1.0.0
 * @since 2025-01-27
 */

// =============================================================================
// CORE GAME TYPES
// =============================================================================

// Core game entities and contract interfaces
export type {
  FishType,
  AquariumData,
  ContractAquarium,
  ContractFish,
  FishSpecies,
  FishSpeciesData,
  GameError,
} from './game';

// Fish-specific types for breeding, genetics, and states
export type {
  Fish,
  FishStateType,
  BreedingPair,
  BreedingResult,
  GeneticCombination,
} from './fish';

// Fish health and status indicator system
export type {
  IndicatorValue,
  FishIndicatorState,
  HappinessWeights,
  FishIndicatorOptions,
  UseFishIndicatorsParams,
  UseFishIndicatorsReturn,
} from './fishIndicators';

// =============================================================================
// GAME SYSTEMS
// =============================================================================

// Dirt/cleaning system with visual effects and mechanics
export type {
  DirtSpot,
  DirtSubShape,
  DirtTypeProperties,
  DirtSystemConfig,
  DirtSystemState,
  ParticleEffect,
  BubbleEffect,
  CleaningRipple,
  DirtSystemAnalytics,
  DirtSystemEvent,
  DirtSystemHook,
} from './dirt';

// Export DirtType as value (enum) since it's used as a value in code
export { DirtType } from './dirt';

export {
  DIRT_TYPE_CONFIG,
  isDirtType,
  getDirtTypeConfig,
  calculateSpotAge,
  calculateSpotIntensity,
} from './dirt';

// Food system for fish feeding mechanics
export type { FoodItem, FoodSystemState } from './food';

// Fish breeding laboratory types
export type {
  BreedingPair as LaboratoryBreedingPair,
  BreedingResult as LaboratoryBreedingResult,
} from './laboratory';

// =============================================================================
// UI & INTERFACE TYPES
// =============================================================================

// Common UI component types, animations, and form structures
export type {
  UIAnimationProps,
  CardVariant,
  BannerType,
  FilterType,
  ModalProps,
  FormField,
  LoadingState,
  ErrorState,
  ErrorWithMessage,
  MotionAnimationProps,
  MotionVariants,
} from './ui-types';

// Help system and documentation structure
export type {
  IconType,
  ContentSection,
  Topic,
  Category,
  FeaturedTopic,
} from './help-types';

// =============================================================================
// WALLET & BLOCKCHAIN
// =============================================================================

// Wallet connection and transaction types
export type {
  WalletConnector as BaseWalletConnector,
  WalletAccount,
  WalletState,
  StarknetAccount,
  StarknetConnector,
  TransactionRequest,
  TransactionResponse,
  WalletError,
} from './wallet-types';

// Specific wallet connector implementations
export type {
  WalletConnector,
  CartridgeConnector,
  ArgentXConnector,
  BraavosConnector,
  SupportedConnector,
} from './connector-types';

// Cartridge Controller integration types
export type {
  CartridgeAccount,
  CartridgeSession,
  CartridgeConfig,
  CartridgeLoginOptions,
  CartridgeSessionPolicies,
  CartridgeEvent,
  UseCartridgeSessionReturn,
  CartridgeError,
  CartridgeErrorType,
  ConnectButtonProps,
  CartridgeModalProps,
  GameSessionPolicies,
} from './cartridge';

// Dojo framework integration
export type { DojoClient } from './dojo';

// =============================================================================
// API & BACKEND
// =============================================================================

// API request/response structures and backend communication
export type {
  ApiResponse,
  ApiError,
  RequestData,
  PlayerCreateRequest,
  PlayerProfileResponse,
  FishStateRequest,
  FishFeedRequest,
  DecorationPlaceRequest,
  DecorationMoveRequest,
} from './api-types';

// Player data structures for frontend, backend, and blockchain
export type {
  PlayerData,
  BackendPlayerData,
  OnChainPlayerData,
  GameCall,
  GameActionParams,
  GameActionResult,
  SettingsValue,
} from './player-types';

// =============================================================================
// MARKET & TRADING
// =============================================================================

// Marketplace and trading system types
export type {
  Bubble,
  Fish as MarketFish,
  MarketFilters,
  MarketItem,
  Transaction,
} from './market';

// Shop and marketplace types
export * from './shop-types';

// =============================================================================
// EVENTS & COMMUNITY
// =============================================================================

// Calendar events and community activities
export type { CalendarEvent, EventFilters, EventClickHandler } from './events';

// Community features and social interactions
export type {
  CommunityEventFilters,
  CommunityGalleryFilters,
} from './community';

// =============================================================================
// COMMON RE-EXPORTS
// =============================================================================

// Re-export commonly used types for convenience
export type {
  Fish as CommonFish,
  BreedingPair as CommonBreedingPair,
  BreedingResult as CommonBreedingResult,
} from './fish';

// Re-export dirt system types with common naming
export type { DirtSpot as DirtSpotType } from './dirt';

// =============================================================================
// TYPE VALIDATION
// =============================================================================

/**
 * Validates that all expected types are properly exported
 * This helps catch missing exports during development
 */
export const TYPE_VALIDATION = {
  // Core Game Types
  FISH_TYPES: ['FishType', 'AquariumData', 'ContractAquarium', 'ContractFish'],
  FISH_SYSTEM: ['Fish', 'FishStateType', 'BreedingPair', 'BreedingResult'],
  FISH_INDICATORS: ['FishIndicatorState', 'FishIndicatorOptions'],

  // Game Systems
  DIRT_SYSTEM: ['DirtSpot', 'DirtType', 'DirtSystemConfig', 'DirtSystemState'],
  FOOD_SYSTEM: ['FoodItem', 'FoodSystemState'],

  // UI Types
  UI_COMPONENTS: ['ModalProps', 'FormField', 'LoadingState', 'ErrorState'],

  // Wallet Types
  WALLET_TYPES: ['WalletAccount', 'WalletState', 'TransactionRequest'],

  // API Types
  API_TYPES: ['ApiResponse', 'ApiError', 'PlayerCreateRequest'],

  // Market Types
  MARKET_TYPES: ['MarketFish', 'MarketFilters', 'Transaction'],
} as const;

// =============================================================================
// EXPORT ORGANIZATION COMMENTS
// =============================================================================

/**
 * EXPORT ORGANIZATION:
 *
 * 1. Core Game Types - Fundamental game entities and blockchain interfaces
 * 2. Game Systems - Specialized game mechanics (dirt, food, breeding)
 * 3. UI & Interface Types - Component props, forms, animations
 * 4. Wallet & Blockchain - Wallet connections, transactions, connectors
 * 5. API & Backend - Server communication and data structures
 * 6. Market & Trading - Marketplace functionality
 * 7. Events & Community - Calendar events and social features
 * 8. Common Re-exports - Frequently used type aliases
 * 9. Type Validation - Development-time validation helpers
 *
 * MAINTENANCE NOTES:
 * - When adding new types, place them in the appropriate category section
 * - Update TYPE_VALIDATION object with new type names
 * - Add JSDoc comments for complex types
 * - Use type-only imports where appropriate
 * - Keep exports organized by functional domain
 */