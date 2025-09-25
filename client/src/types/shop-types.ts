/**
 * @fileoverview Centralized shop-related type definitions
 * This file consolidates all shop-related types to avoid duplication and maintain consistency.
 */

import { BigNumberish } from 'starknet';

/**
 * Represents an item available in the shop
 */
export interface ShopItem {
  /** Unique identifier for the shop item */
  id: string;
  /** Display name of the item */
  name: string;
  /** URL or path to the item's image */
  image: string;
  /** Current price of the item */
  price: number;
  /** Original price before any discounts */
  originalPrice?: number;
  /** Rarity classification of the item */
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Special';
  /** Category classification for grouping items */
  category?: string;
  /** Detailed description of the item */
  description: string;
  /** User rating of the item (0-5) */
  rating: number;
  /** Whether this is a new item */
  isNew?: boolean;
  /** Current stock quantity available */
  stock?: number;
  /** Whether this is a limited edition item */
  isLimited?: boolean;
  /** Whether the item is currently discounted */
  discounted?: boolean;
  /** Popularity score for sorting */
  popularity?: number;
  /** Date when the item was created/added */
  createdAt?: Date;
}

/**
 * Represents a category for organizing shop items
 */
export interface ShopCategory {
  /** Unique identifier for the category */
  id: string;
  /** Display name of the category */
  name: string;
  /** Description of what items belong to this category */
  description: string;
  /** Icon or image representing the category */
  icon?: string;
  /** Order for displaying categories */
  sortOrder: number;
  /** Whether the category is currently active */
  isActive: boolean;
  /** Number of items in this category */
  itemCount?: number;
}

/**
 * Represents a bundle of items sold together at a discounted price
 */
export interface ShopBundle {
  /** Unique identifier for the bundle */
  id: string;
  /** Display name of the bundle */
  name: string;
  /** URL or path to the bundle's image */
  image: string;
  /** Current price of the bundle */
  price: number;
  /** Original price before bundle discount */
  originalPrice?: number;
  /** Discount percentage or amount */
  discount?: string;
  /** Special tag for the bundle (e.g., "Limited", "Sale") */
  tag?: string;
  /** Rarity classification of the bundle */
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Special';
  /** Array of item IDs included in this bundle */
  items: string[];
  /** Detailed description of the bundle */
  description: string;
  /** Percentage saved compared to buying items individually */
  savingsPercentage?: number;
  /** Type of items in the bundle */
  type?: 'fish' | 'decorations' | 'food' | 'misc' | 'others';
}

/**
 * Represents a transaction in the shop system
 */
export interface Transaction {
  /** Unique identifier for the transaction */
  id: number;
  /** Type of transaction performed */
  type: 'purchase' | 'sale' | 'exchange' | 'auction_win';
  /** Name of the fish or item involved */
  fishName: string;
  /** URL or path to the item's image */
  image: string;
  /** Price paid or received */
  price?: number;
  /** Date when the transaction occurred */
  date: string;
  /** Seller information */
  seller?: string;
  /** Buyer information */
  buyer?: string;
  /** Items exchanged for (for exchange transactions) */
  exchangedFor?: string;
  /** Trader information (for exchange transactions) */
  trader?: string;
}

/**
 * Represents the result of a transaction operation
 */
export interface TransactionResult {
  /** Whether the transaction was successful */
  success: boolean;
  /** Message describing the result */
  message: string;
  /** Unique identifier for the transaction */
  transactionId?: string;
  /** Hash of the blockchain transaction */
  transactionHash?: string;
  /** Error details if transaction failed */
  error?: string;
}

/**
 * Represents different states a transaction can be in
 */
export type TransactionState =
  | 'pending' // Transaction is being processed
  | 'confirmed' // Transaction has been confirmed on blockchain
  | 'failed' // Transaction failed
  | 'cancelled' // Transaction was cancelled
  | 'refunded'; // Transaction was refunded

/**
 * Represents a transaction request for blockchain operations
 */
export interface TransactionRequest {
  /** Target address for the transaction */
  to: string;
  /** Amount to transfer (in wei or token units) */
  value?: BigNumberish;
  /** Function call data */
  data?: string[];
  /** Additional transaction parameters */
  options?: Record<string, unknown>;
}

/**
 * Represents the response from a blockchain transaction
 */
export interface TransactionResponse {
  /** Transaction hash */
  hash: string;
  /** Current status of the transaction */
  status: 'pending' | 'confirmed' | 'failed';
  /** Block number where transaction was confirmed */
  blockNumber?: number;
  /** Gas used for the transaction */
  gasUsed?: string;
}

/**
 * Represents filters for shop item searches
 */
export interface ShopFilters {
  /** Search query */
  searchQuery: string;
  /** Filter by price range */
  priceRange: [number, number];
  /** Filter by categories */
  categories: string[];
  /** Show only items on sale */
  onSale: boolean;
  /** Sort order */
  sort: 'name' | 'price' | 'rating' | 'newest' | 'popularity';
}

/**
 * Represents market-specific filters extending shop filters
 */
export interface MarketFilters {
  /** Type of listing */
  listingType: 'all' | 'buy' | 'sell' | 'auction' | 'exchange';
  /** Filter by traits */
  traits: string[];
  /** Sort options specific to market */
  sort: 'newest' | 'price-low' | 'price-high' | 'rarity' | 'level';
  /** Price range filter */
  priceRange: {
    min: number;
    max: number;
  };
  /** Filter by rarity */
  rarity: string[];
  /** Level range filter */
  level: {
    min: number;
    max: number;
  };
  /** Search term */
  search?: string;
}

/**
 * Represents a generic market item
 */
export interface MarketItem {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Price */
  price: number;
  /** Currency type */
  currency: string;
  /** Rarity */
  rarity: string;
  /** Level */
  level: number;
  /** Traits */
  traits: string[];
  /** Image URL */
  image: string;
  /** Seller information */
  seller: string;
  /** Type of listing */
  listingType: 'buy' | 'sell' | 'auction' | 'exchange';
  /** End time for time-limited listings */
  endTime?: string;
  /** Number of bids for auction items */
  bids?: number;
}

/**
 * Represents a fish in the marketplace with additional seller information
 */
export interface MarketplaceFish {
  /** Fish identifier */
  id: number;
  /** Fish name */
  name: string;
  /** Fish image */
  image: string;
  /** Fish rarity */
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Special';
  /** Generation number */
  generation: number;
  /** Level */
  level: number;
  /** Fish traits */
  traits: {
    color: string;
    pattern: string;
    fins: string;
    size: string;
    special?: string;
  };
  /** Seller information */
  seller?: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  /** Price */
  price?: number;
  /** Auction information */
  auction?: {
    currentBid: number;
    minBid: number;
    endsIn: string;
    bids: number;
  };
  /** Exchange information */
  exchange?: {
    lookingFor: string[];
  };
  /** Listing date */
  listed: string;
}

/**
 * Type validation functions for shop types
 */
export const ShopTypeValidators = {
  /**
   * Validates if an object is a valid ShopItem
   */
  isShopItem: (item: unknown): item is ShopItem => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof (item as ShopItem).id === 'string' &&
      typeof (item as ShopItem).name === 'string' &&
      typeof (item as ShopItem).image === 'string' &&
      typeof (item as ShopItem).price === 'number' &&
      typeof (item as ShopItem).rarity === 'string' &&
      typeof (item as ShopItem).description === 'string' &&
      typeof (item as ShopItem).rating === 'number'
    );
  },

  /**
   * Validates if an object is a valid Transaction
   */
  isTransaction: (transaction: unknown): transaction is Transaction => {
    return (
      typeof transaction === 'object' &&
      transaction !== null &&
      typeof (transaction as Transaction).id === 'number' &&
      typeof (transaction as Transaction).type === 'string' &&
      typeof (transaction as Transaction).fishName === 'string' &&
      typeof (transaction as Transaction).image === 'string' &&
      typeof (transaction as Transaction).date === 'string'
    );
  },

  /**
   * Validates if a string is a valid transaction state
   */
  isTransactionState: (state: string): state is TransactionState => {
    return ['pending', 'confirmed', 'failed', 'cancelled', 'refunded'].includes(
      state
    );
  },

  /**
   * Validates if a string is a valid rarity
   */
  isRarity: (rarity: string): rarity is ShopItem['rarity'] => {
    return [
      'Common',
      'Uncommon',
      'Rare',
      'Epic',
      'Legendary',
      'Special',
    ].includes(rarity);
  },
};
