export interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

import type { UIFish } from './fish-types';

export interface Fish extends Pick<
  UIFish,
  'id' | 'name' | 'image' | 'rarity' | 'generation' | 'traits'
> {
  id: number;
  name: string;
  image: string;
  rarity: UIFish['rarity'];
  generation: number;
  level: number;
  traits: {
    color: string;
    pattern: string;
    fins: string;
    size: string;
    special?: string;
  };
  seller?: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  price?: number;
  auction?: {
    currentBid: number;
    minBid: number;
    endsIn: string;
    bids: number;
  };
  exchange?: {
    lookingFor: string[];
  };
  listed: string;
}

export interface MarketFilters {
  listingType: 'all' | 'buy' | 'sell' | 'auction' | 'exchange';
  traits: string[];
  sort: 'newest' | 'price-low' | 'price-high' | 'rarity' | 'level';
  priceRange: {
    min: number;
    max: number;
  };
  rarity: string[];
  level: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface MarketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rarity: string;
  level: number;
  traits: string[];
  image: string;
  seller: string;
  listingType: 'buy' | 'sell' | 'auction' | 'exchange';
  endTime?: string;
  bids?: number;
}

export interface Transaction {
  id: number;
  type: 'purchase' | 'sale' | 'exchange' | 'auction_win';
  fishName: string;
  image: string;
  price?: number;
  date: string;
  seller?: string;
  buyer?: string;
  exchangedFor?: string;
  trader?: string;
}
