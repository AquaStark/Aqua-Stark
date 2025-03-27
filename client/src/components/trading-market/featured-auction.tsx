"use client"

import { Check, Clock, Coins, Hammer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { FishListing } from "@/types/market"
import { getRarityColor } from "@/lib/market-utils"

interface FeaturedAuctionProps {
  auction: FishListing
  onBidClick: (fish: FishListing) => void
}

export function FeaturedAuction({ auction, onBidClick }: FeaturedAuctionProps) {
  return (
    <div className="bg-blue-800 rounded-lg overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Fish Image */}
        <div className="p-6 relative bg-blue-900/50 md:w-1/3">
          <Badge className="absolute top-4 left-4 z-20 bg-amber-500 flex items-center">
            <Hammer className="w-3 h-3 mr-1" />
            Featured Auction
          </Badge>
          <div className="flex justify-center items-center h-full">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0">
                <img
                  src={auction.image}
                  alt={auction.name}
                  className="absolute inset-0 w-full h-full object-contain z-10 p-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Fish Details */}
        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-white">{auction.name}</h3>
            <Badge className={`${getRarityColor(auction.rarity)} font-medium`}>{auction.rarity}</Badge>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2 mb-6">
            {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
            <div className="w-6 h-6 rounded-full bg-white"></div>
            <span className="text-blue-200">{auction.seller.name}</span>
            {auction.seller.verified && <Check className="w-4 h-4 text-blue-400" />}
          </div>

          {/* Fish Stats */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-blue-300 mb-1">Level</p>
              <p className="text-white text-xl font-bold">{auction.level}</p>
            </div>
            <div>
              <p className="text-blue-300 mb-1">Generation</p>
              <p className="text-white text-xl font-bold">{auction.generation}</p>
            </div>
          </div>

          {/* Traits */}
          <div className="mb-6">
            <p className="text-blue-300 mb-2">Traits</p>
            <div className="flex flex-wrap gap-2">
              {auction.traits?.map((trait) => (
                <Badge key={trait} variant="outline" className="text-blue-200 border-blue-500">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bid Info */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-blue-300 mb-1">Current Bid</p>
              <div className="flex items-center">
                <Coins className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-white text-2xl font-bold">{auction.price}</span>
              </div>
              <p className="text-blue-300 text-sm mt-1">Min. next bid: {auction.minNextBid} coins</p>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center text-blue-300 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>Ends in {auction.endsIn}</span>
              </div>
              <p className="text-blue-300 mb-2">{auction.bids} bids placed</p>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                onClick={() => onBidClick(auction)}
              >
                Place Bid
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

