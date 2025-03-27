"use client"

import { Clock, Hammer, Check, Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { FishListing } from "@/types/market"
import { getRarityColor } from "@/lib/market-utils"

interface AuctionCardProps {
  fish: FishListing
  onBidClick: (fish: FishListing) => void
}

export function AuctionCard({ fish, onBidClick }: AuctionCardProps) {
  return (
    <div className="bg-blue-800 rounded-lg overflow-hidden relative">
      {/* Auction Badge */}
      <Badge className="absolute top-4 right-4 z-10 bg-amber-500 flex items-center">
        <Hammer className="w-3 h-3 mr-1" />
        Auction
      </Badge>

      {/* Fish Image */}
      <div className="p-6 flex justify-center items-center bg-blue-900">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-700 bg-blue-800">
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-yellow-200 opacity-50 rounded-b-full"></div>
        </div>
      </div>

      {/* Fish Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{fish.name}</h3>
          <Badge className={`${getRarityColor(fish.rarity)} font-medium`}>{fish.rarity}</Badge>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3">
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          <div className="w-6 h-6 rounded-full bg-white"></div>
          <span className="text-blue-200">{fish.seller.name}</span>
          {fish.seller.verified && <Check className="w-4 h-4 text-blue-400" />}
          <span className="text-blue-300 text-sm ml-auto">
            <Clock className="w-4 h-4 inline mr-1" />
            Ends in {fish.endsIn}
          </span>
        </div>

        {/* Price Info */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <Coins className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="font-bold text-white">{fish.price}</span>
              {fish.bids && <span className="text-blue-300 text-sm ml-2">({fish.bids} bids)</span>}
            </div>
            <p className="text-blue-300 text-xs">Min. next bid: {fish.minNextBid}</p>
          </div>

          {/* Action Button */}
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => onBidClick(fish)}>
            Place Bid
          </Button>
        </div>
      </div>
    </div>
  )
}

