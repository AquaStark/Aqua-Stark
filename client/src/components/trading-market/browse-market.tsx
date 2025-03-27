"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FishListing } from "@/types/market"
import { FishCard } from "./fish-card"

interface BrowseMarketProps {
  fishListings: FishListing[]
  onBidClick: (fish: FishListing) => void
}

export function BrowseMarket({ fishListings, onBidClick }: BrowseMarketProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for fish by name, traits, or seller..."
            className="pl-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-green-400 hover:bg-green-500 text-white">List Fish</Button>
        </div>
      </div>

      {/* Fish Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fishListings.map((fish) => (
          <FishCard key={fish.id} fish={fish} onBidClick={onBidClick} />
        ))}
      </div>
    </>
  )
}

