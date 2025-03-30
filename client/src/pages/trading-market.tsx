"use client"

import { useMemo, useState } from "react"
import { MarketHeader } from "@/components/market/market-header"
import { MarketFooter } from "@/components/market/market-footer"
import { BubblesBackground } from "@/components/bubble-background"
import { FilterPanel } from "@/components/market/filter-panel"
import { FishCard } from "@/components/market/fish-card"
import { BidModal } from "@/components/market/bid-modal"
import { OfferModal } from "@/components/market/offer-modal"
import { ListingModal } from "@/components/market/listing-modal"
import { useMarketStore } from "@/store/market-store"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, Plus } from "lucide-react"
import { mockFishData } from "@/data/market-data"
import "@/styles/market.css"

export default function MarketPage() {
  const { filters, showFilters, setShowFilters, setFilters, setShowListingModal } = useMarketStore()
  const [activeTab, setActiveTab] = useState("browse")

  // 🫧 Generate bubbles once
  const bubbles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const base = Math.random()
      const size = base < 0.3
        ? Math.random() * 15 + 10   
        : base < 0.7
        ? Math.random() * 25 + 20   
        : Math.random() * 40 + 30   
  
      return {
        id: i,
        size,
        left: Math.random() * 100,
        animationDuration: Math.random() * 10 + 5,
      }
    })
  }, [])
  

  const filteredFish = mockFishData.filter((fish) => {
    if (filters.rarity.length > 0 && !filters.rarity.includes(fish.rarity)) return false
    if (fish.price && (fish.price < filters.minPrice || fish.price > filters.maxPrice)) return false
    if (filters.listingType !== "all") {
      if (filters.listingType === "sale" && !fish.price) return false
      if (filters.listingType === "auction" && !fish.auction) return false
      if (filters.listingType === "exchange" && !fish.exchange) return false
    }
    if (filters.traits.length > 0) {
      const fishTraits = Object.values(fish.traits).map((t) => t.toLowerCase())
      const hasMatchingTrait = filters.traits.some((trait) => fishTraits.includes(trait.toLowerCase()))
      if (!hasMatchingTrait) return false
    }
    if (filters.search && !fish.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const sortedFish = [...filteredFish].sort((a, b) => {
    if (filters.sort === "price-low") {
      return (a.price || a.auction?.currentBid || 0) - (b.price || b.auction?.currentBid || 0)
    }
    if (filters.sort === "price-high") {
      return (b.price || b.auction?.currentBid || 0) - (a.price || a.auction?.currentBid || 0)
    }
    if (filters.sort === "rarity") {
      const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 }
      return rarityOrder[b.rarity] - rarityOrder[a.rarity]
    }
    if (filters.sort === "level") {
      return b.level - a.level
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BubblesBackground bubbles={bubbles} />
      </div>

      <MarketHeader />

      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search fish..."
              className="w-full bg-blue-800/50 backdrop-blur-sm border border-blue-700/50 rounded-full px-4 py-2 pl-10 text-white placeholder:text-blue-300"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="border-blue-600/50 text-blue-100 hover:bg-blue-700/50"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Hide Filters
                </>
              ) : (
                <>
                  <Filter className="mr-2 h-4 w-4" />
                  Show Filters
                </>
              )}
            </Button>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowListingModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              List Fish
            </Button>

            <div className="flex items-center bg-blue-800/50 backdrop-blur-sm rounded-full p-1 border border-blue-700/50">
              {["browse", "auctions", "my listings", "history"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeTab === tab ? "bg-blue-600 text-white" : "text-blue-300 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showFilters && <FilterPanel />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {sortedFish.map((fish) => (
            <FishCard key={fish.id} fish={fish} />
          ))}

          {sortedFish.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl text-white mb-2">No fish found</h3>
              <p className="text-blue-300">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </main>

      <MarketFooter />

      <BidModal />
      <OfferModal />
      <ListingModal />
    </div>
  )
}
