export interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

export interface Fish {
  id: number;
  name: string;
  image: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
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

export interface MarketFilter {
  search: string;
  rarity: string[];
  minPrice: number;
  maxPrice: number;
  traits: string[];
  listingType: "all" | "sale" | "auction" | "exchange";
  sort: "newest" | "price-low" | "price-high" | "rarity" | "level";
}

export interface Transaction {
  id: number;
  type: "purchase" | "sale" | "exchange" | "auction_win";
  fishName: string;
  image: string;
  price?: number;
  date: string;
  seller?: string;
  buyer?: string;
  exchangedFor?: string;
  trader?: string;
}
