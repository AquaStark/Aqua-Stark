import type { FishListing } from "@/types/market"

export const fishListings: FishListing[] = [
  {
    id: "1",
    name: "Royal Crowntail",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Rare",
    seller: {
      name: "FishMaster99",
    },
    timeAgo: "5 hours ago",
    price: 2500,
    listingType: "Sale",
  },
  {
    id: "2",
    name: "Celestial Glowfin",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Legendary",
    seller: {
      name: "CoralQueen",
      verified: true,
    },
    timeAgo: "2 hours ago",
    price: 5000,
    listingType: "Auction",
    bids: 12,
    endsIn: "2h 45m",
    level: 8,
    generation: 1,
    traits: ["Blue", "Spotted", "Long", "Medium", "Bioluminescent"],
    minNextBid: 5250,
    featured: true,
  },
  {
    id: "3",
    name: "Crimson Flasher",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Epic",
    seller: {
      name: "OceanExplorer",
      verified: true,
    },
    timeAgo: "1 day ago",
    price: 0,
    listingType: "Exchange",
    lookingFor: {
      rarity: "Legendary",
      colors: ["Blue", "Bioluminescent"],
    },
  },
  {
    id: "4",
    name: "Azure Drifter",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Common",
    seller: {
      name: "AquaDesigner",
    },
    timeAgo: "3 days ago",
    price: 800,
    listingType: "Sale",
  },
  {
    id: "5",
    name: "Emerald Whisker",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Uncommon",
    seller: {
      name: "BubbleMaker",
    },
    timeAgo: "4 days ago",
    price: 1200,
    listingType: "Sale",
  },
  {
    id: "6",
    name: "Golden Shimmer",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Epic",
    seller: {
      name: "TrophyHunter",
      verified: true,
    },
    timeAgo: "2 days ago",
    price: 3800,
    listingType: "Auction",
    bids: 7,
    endsIn: "8h 15m",
    minNextBid: 4000,
  },
]

