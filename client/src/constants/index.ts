/**
 * @file index.ts
 * @description Centralized export of all shared project constants.
 * This file acts as a single entry point for importing constants across the project,
 * improving maintainability and consistency.
 *
 * 📌 Usage Example:
 * ```ts
 * import { AQUA_CONTRACT_ADDRESS, wallets, ENV_CONFIG } from '@/constants';
 * ```
 *
 * ⚠️ Notes:
 * - Constants are organized by category with clear section dividers.
 * - Types are also re-exported to simplify imports in components/hooks.
 */

// =======================
// 📜 Contract Constants
// =======================
/**
 * Smart contract addresses and blockchain-related identifiers.
 */
export { AQUA_CONTRACT_ADDRESS } from './contract';

// =======================
// 💳 Wallet Constants
// =======================
/**
 * Wallet configurations and error handling utilities.
 */
export { wallets, WALLET_ERRORS } from './wallets';
export type { Wallet } from './wallets';

// =======================
// 🌍 Environment Configuration
// =======================
/**
 * Environment-based configurations for development, production, and staging.
 */
export { ENV_CONFIG, isDevelopment, isProduction, getApiUrl } from '../config/environment';

// =======================
// 🔗 API Configuration
// =======================
/**
 * API endpoints, headers, and reusable client utilities.
 */
export { API_CONFIG, buildApiUrl, createHeaders, ApiClient } from '../config/api';

// =======================
// 🎮 Game Policies & Cartridge
// =======================
/**
 * Game-specific rules and cartridge configuration.
 */
export { GAME_POLICIES, CARTRIDGE_CONFIG, DEV_POLICIES } from '../config/policies';

// =======================
// ⚙️ Wallet Configuration
// =======================
/**
 * Wallet and cartridge chain configuration with supported modes.
 */
export {
	getWalletConfig, getCartridgePolicies, getCartridgeChains, CHAIN_IDS,
	WALLET_MODES
} from '../config';

export type { WalletConfig, WalletMode } from '../config';

// =======================
// 🎮 Game Data Constants
// =======================
/**
 * Mock data and initial state for the game simulation.
 */
export { MOCK_FISH, MOCK_AQUARIUMS, INITIAL_GAME_STATE } from '../data/game-data';
export { fishCollection, breedingResults } from '../data/fish-data';

// =======================
// 🐟 Fish System Constants
// =======================
/**
 * Fish-related system constants and utilities.
 */
export { FISH_SPECIES } from '../systems/data-transformation-system';
export { DEFAULT_OPTIONS, clamp } from '../utils/fishIndicators';

// =======================
// 🧹 Dirt System Constants
// =======================
/**
 * Dirt system configuration, types, and calculation helpers.
 */
export {
	DIRT_TYPE_CONFIG, DirtType, getDirtTypeConfig,
	calculateSpotIntensity, calculateSpotAge
} from '../types/dirt';

export type {
	DirtSpot, DirtSubShape, DirtTypeProperties,
} from '../types/dirt';

export type { DirtSpot as DirtSpotType } from '../types/dirt';
export type { DirtSystemConfig, DirtSystemState } from '../types/dirt';

// =======================
// 🔎 Type Validation
// =======================
/**
 * Type validation schemas and utilities.
 */
export { TYPE_VALIDATION } from '../types/index';

// =======================
// 🛒 Market Data
// =======================
/**
 * Mock data for the marketplace including fish, transactions, and food bundles.
 */
export { mockFishData, mockTransactions, foodData, specialFoodBundles } from '../data/market-data';

// =======================
// 📚 Help Center
// =======================
/**
 * Help center categories and featured topics.
 */
export { categories, featuredTopics } from '../data/help-center-data';

// =======================
// 🏪 Shop Types
// =======================
/**
 * Type validators for shop-related entities.
 */
export { ShopTypeValidators } from '../types/shop-types';
