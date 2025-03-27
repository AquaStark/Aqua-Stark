// Fish data types
export type FishRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
export type ListingType = "Sale" | "Auction" | "Exchange"

export interface FishListing {
  id: string
  name: string
  image: string
  rarity: FishRarity
  seller: {
    name: string
    verified?: boolean
  }
  timeAgo: string
  price: number
  listingType: ListingType
  bids?: number
  endsIn?: string
  lookingFor?: {
    rarity?: FishRarity
    colors?: string[]
    traits?: string[]
  }
  level?: number
  generation?: number
  traits?: string[]
  minNextBid?: number
  featured?: boolean
}

