"use client"

import { useState } from "react"
import { Footer } from "@/components/layout/footer"
import { PageHeader } from "@/components/layout/page-header"
import { BubblesBackground } from "@/components/bubble-background"
import { FilterPanel } from "@/components/market/filter-panel"
import { FishCard } from "@/components/market/fish-card"
import { BidModal } from "@/components/market/bid-modal"
import { OfferModal } from "@/components/market/offer-modal"
import { ListingModal } from "@/components/market/listing-modal"
import { useMarketStore } from "@/store/market-store"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, Plus, Coins } from "lucide-react"
import { mockFishData } from "@/data/market-data"
import { useBubbles } from "@/hooks/use-bubbles"
import "@/styles/market.css"

export default function MarketPage() {
  const { filters, showFilters, setShowFilters, setFilters, setShowListingModal } = useMarketStore()
  const [activeTab, setActiveTab] = useState("browse")

  const bubbles = useBubbles()
  
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background">
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title="Trading Market"
        backTo="/game"
        backText="Back to Game"
        rightContent={
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-blue-700/50 rounded-full px-4 py-2 border border-blue-400/50">
            <Coins className="text-yellow-400 mr-2" size={20} />
            <span className="text-white font-bold">12,500</span>
          </div>
        </div>        }
      />

      <main className="relative z-20 flex flex-col items-center px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 w-full">
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
              className="border-blue-600/50 !text-blue-100 bg-blue-600 hover:bg-blue-700/50"
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

            <Button
              className="border border-blue-600/50 bg-blue-600 hover:bg-blue-700/50 text-white"
              onClick={() => setShowListingModal(true)}>
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

        {/* if tab is browse */}
        {activeTab === "browse" && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 w-full">
          {sortedFish.map((fish) => (
            <FishCard key={fish.id} fish={fish} />
          ))}

          {sortedFish.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl text-white mb-2">No fish found</h3>
              <p className="text-blue-300">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>}

        {/* if tab is auctions */}
        {activeTab === "auctions" && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 w-full">
          {sortedFish.filter(fish => fish.auction).map((fish) => (
            <FishCard key={fish.id} fish={fish} />
          ))}

          {sortedFish.filter(fish => fish.auction).length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl text-white mb-2">No auctions found</h3>
              <p className="text-blue-300">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>}

        {/* if tab is my listings */}
        {activeTab === "my listings" && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 w-full">
          {sortedFish.filter(fish => fish.listed).map((fish) => (
            <FishCard key={fish.id} fish={fish} />
          ))}

          {sortedFish.filter(fish => fish.listed).length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl text-white mb-2">No listings found</h3>
              <p className="text-blue-300">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>}

        {/* if tab is history */}
        {activeTab === "history" && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 w-full">
          {sortedFish.filter(fish => fish.exchange).map((fish) => (
            <FishCard key={fish.id} fish={fish} />
          ))}

          {sortedFish.filter(fish => fish.exchange).length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl text-white mb-2">No history found</h3>
              <p className="text-blue-300">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>}
      </main>

      <Footer />

      <BidModal />
      <OfferModal />
      <ListingModal />
    </div>
  )
}
