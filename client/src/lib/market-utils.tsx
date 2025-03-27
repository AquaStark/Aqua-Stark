import type { FishRarity, ListingType } from "@/types/market"
import { ShoppingCart, Hammer, RefreshCw } from "lucide-react"
// Get background color based on rarity
export const getRarityColor = (rarity: FishRarity) => {
  switch (rarity) {
    case "Common":
      return "bg-slate-600 text-white"
    case "Uncommon":
      return "bg-green-600 text-white"
    case "Rare":
      return "bg-blue-600 text-white"
    case "Epic":
      return "bg-purple-600 text-white"
    case "Legendary":
      return "bg-amber-600 text-white"
    default:
      return "bg-slate-600 text-white"
  }
}

export const getListingBadgeColor = (type: ListingType) => {
  switch (type) {
    case "Sale":
      return "bg-green-500 hover:bg-green-600"
    case "Auction":
      return "bg-amber-500 hover:bg-amber-600"
    case "Exchange":
      return "bg-purple-500 hover:bg-purple-600"
    default:
      return "bg-slate-500 hover:bg-slate-600"
  }
}

export const getListingTypeIcon = (type: ListingType) => {
  switch (type) {
    case "Sale":
      return <ShoppingCart className="w-3 h-3 mr-1" />
    case "Auction":
      return <Hammer className="w-3 h-3 mr-1" />
    case "Exchange":
      return <RefreshCw className="w-3 h-3 mr-1" />
    default:
      return null
  }
}

