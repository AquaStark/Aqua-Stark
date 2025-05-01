import { Gavel, RefreshCw, Tag } from "lucide-react"

interface ListingTypeBadgeProps {
  type: "sale" | "auction" | "exchange"
}

export function ListingTypeBadge({ type }: ListingTypeBadgeProps) {
  if (type === "auction") {
    return (
      <div className="absolute top-2 right-2 bg-amber-500/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-black flex items-center">
        <Gavel className="h-3 w-3 mr-1" />
        Auction
      </div>
    )
  }

  if (type === "exchange") {
    return (
      <div className="absolute top-2 right-2 bg-purple-500/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white flex items-center">
        <RefreshCw className="h-3 w-3 mr-1" />
        Exchange
      </div>
    )
  }

  return (
    <div className="absolute top-2 right-2 bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-black flex items-center">
      <Tag className="h-3 w-3 mr-1" />
      Sale
    </div>
  )
}

