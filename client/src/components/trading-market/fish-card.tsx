"use client"

import { Check, Clock, Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { FishListing } from "@/types/market"
import { getRarityColor, getListingBadgeColor, getListingTypeIcon } from "@/lib/market-utils"

interface FishCardProps {
  fish: FishListing
  onBidClick?: (fish: FishListing) => void
}

export function FishCard({ fish, onBidClick }: FishCardProps) {
  // Get action button based on listing type
  const getActionButton = (listing: FishListing) => {
    switch (listing.listingType) {
      case "Sale":
        return <Button className="bg-green-500 hover:bg-green-600 text-white">Buy Now</Button>
      case "Auction":
        return (
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => onBidClick?.(listing)}>
            Place Bid
          </Button>
        )
      case "Exchange":
        return <Button className="bg-purple-500 hover:bg-purple-600 text-white">Offer</Button>
      default:
        return null
    }
  }

  return (
    <div className="bg-blue-800 rounded-lg overflow-hidden relative">
      {/* Listing Type Badge */}
      <Badge className={`absolute top-4 right-4 z-10 ${getListingBadgeColor(fish.listingType)} flex items-center`}>
        {getListingTypeIcon(fish.listingType)}
        {fish.listingType}
      </Badge>

      {/* Fish Image */}
      <div className="p-6 flex justify-center items-center bg-blue-900/50">
        <div className="relative w-48 h-48">
          <img
            src={fish.image}
            alt={fish.name}
            className="absolute inset-0 w-full h-full object-contain z-10 p-4"
          />
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
          <span className="text-blue-300 text-sm ml-auto">{fish.timeAgo}</span>
        </div>

        {/* Price or Exchange Info */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {fish.listingType !== "Exchange" ? (
              <>
                <Coins className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-bold text-white">{fish.price}</span>
                {fish.bids && <span className="text-blue-300 text-sm ml-2">({fish.bids} bids)</span>}
              </>
            ) : (
              <div className="text-sm text-blue-200">
                <p>Looking for:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {fish.lookingFor?.rarity && (
                    <Badge className={`${getRarityColor(fish.lookingFor.rarity)} text-xs`}>
                      {fish.lookingFor.rarity}
                    </Badge>
                  )}
                  {fish.lookingFor?.colors?.map((color) => (
                    <Badge key={color} variant="outline" className="text-xs text-blue-200 border-blue-500">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Auction Timer */}
          {fish.endsIn && (
            <div className="text-sm text-blue-300 flex items-center mr-4">
              <Clock className="w-4 h-4 mr-1" />
              Ends in {fish.endsIn}
            </div>
          )}

          {/* Action Button */}
          {getActionButton(fish)}
        </div>
      </div>
    </div>
  )
}

