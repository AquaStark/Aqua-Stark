import { Filter, Hammer } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FishListing } from "./types"
import { FeaturedAuction } from "./featured-auction"
import { AuctionCard } from "./auction-card"

interface AuctionsViewProps {
  auctionListings: FishListing[]
  featuredAuction: FishListing | undefined
  onBidClick: (fish: FishListing) => void
}

export function AuctionsView({ auctionListings, featuredAuction, onBidClick }: AuctionsViewProps) {
  return (
    <>
      {/* Auctions Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Live Auctions</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            <Hammer className="h-4 w-4 mr-2" />
            My Bids
          </Button>
        </div>
      </div>

      {/* Featured Auction */}
      {featuredAuction && <FeaturedAuction auction={featuredAuction} onBidClick={onBidClick} />}

      {/* All Auctions */}
      <h2 className="text-xl font-bold text-white mb-4">All Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctionListings.map((fish) => (
          <AuctionCard key={fish.id} fish={fish} onBidClick={onBidClick} />
        ))}
      </div>
    </>
  )
}

