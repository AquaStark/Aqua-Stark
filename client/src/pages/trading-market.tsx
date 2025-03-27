"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  Check,
  Coins,
  Tag,
  Brush,
  ShoppingBag,
  ShoppingCart,
  Hammer,
  RefreshCw,
  Info,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Footer } from "@/components/footer"
import { BubblesBackground } from "@/components/bubble-background"
import { useBubbles } from "@/hooks/useBubbles"

type FishRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
type ListingType = "Sale" | "Auction" | "Exchange"

interface FishListing {
  id: string
  name: string
  image: string
  rarity: FishRarity
  seller: {
    name: string
    verified?: boolean
  }
  timeAgo: string
  price: number
  listingType: ListingType
  bids?: number
  endsIn?: string
  lookingFor?: {
    rarity?: FishRarity
    colors?: string[]
    traits?: string[]
  }
  level?: number
  generation?: number
  traits?: string[]
  minNextBid?: number
  featured?: boolean
}

const fishListings: FishListing[] = [
  {
    id: "1",
    name: "Royal Crowntail",
    image: "public/fish/fish1.png",
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
    image: "public/fish/fish2.png",
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
    image: "public/fish/fish3.png",
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
    image: "public/fish/fish4.png",
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
    image: "public/fish/fish1.png",
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
    image: "public/fish/fish3.png",
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

const getRarityColor = (rarity: FishRarity) => {
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

const getListingBadgeColor = (type: ListingType) => {
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

const getListingTypeIcon = (type: ListingType) => {
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

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type MarketHeaderProps = {}

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
function MarketHeader({}: MarketHeaderProps) {
  return (
    <header className="bg-blue-700 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-blue-600 flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Game</span>
        </Button>
        <h1 className="text-2xl font-bold text-white">Trading Market</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-blue-800 bg-opacity-30 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold">12,500</span>
        </div>
      </div>
    </header>
  )
}

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
}

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
function NavigationTabs({  }: NavigationTabsProps) {
  return (
    <TabsList className="w-full bg-blue-800 p-1">
      <TabsTrigger
        value="browse"
        className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        Browse Market
      </TabsTrigger>
      <TabsTrigger
        value="auctions"
        className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
      >
        <Brush className="w-5 h-5 mr-2" />
        Auctions
      </TabsTrigger>
      <TabsTrigger
        value="listings"
        className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
      >
        <Tag className="w-5 h-5 mr-2" />
        My Listings
      </TabsTrigger>
      <TabsTrigger
        value="history"
        className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
      >
        <Clock className="w-5 h-5 mr-2" />
        History
      </TabsTrigger>
    </TabsList>
  )
}

interface FishCardProps {
  fish: FishListing
  onBidClick?: (fish: FishListing) => void
}

function FishCard({ fish, onBidClick }: FishCardProps) {
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
    <div className="bg-blue-800 rounded-lg overflow-hidden relative transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/70 cursor-pointer shadow-md shadow-blue-900/40">
      {/* Listing Type Badge */}
      <Badge className={`absolute top-4 right-4 z-10 ${getListingBadgeColor(fish.listingType)} flex items-center`}>
        {getListingTypeIcon(fish.listingType)}
        {fish.listingType}
      </Badge>

      {/* Fish Image */}
      <div className="p-6 flex justify-center items-center bg-blue-900">
        <div className="relative w-48 h-48 flex justify-center items-center">
          {/* Fish Tank Background */}
          <img src="/fish/fish-tank.svg" alt="Fish Tank" className="absolute w-full h-full object-contain" />
          {/* Fish Image */}
          <img
            src={fish.image || "/placeholder.svg"}
            alt={fish.name}
            className="absolute w-32 h-32 object-contain z-0 transform hover:scale-110 transition-transform duration-300"
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
          {fish.endsIn ? (
            <div className="text-sm text-blue-300 flex items-center ml-auto">
              <Clock className="w-4 h-4 mr-1" />
              <span>Ends in {fish.endsIn}</span>
            </div>
          ) : (
            <span className="text-blue-300 text-sm ml-auto">{fish.timeAgo}</span>
          )}
        </div>

        {/* Price or Exchange Info */}
        <div className="flex justify-between items-center">
          <div>
            {fish.listingType !== "Exchange" ? (
              <div>
                <div className="flex items-center">
                  <Coins className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-bold text-white">{fish.price}</span>
                </div>
                {fish.bids && <p className="text-blue-300 text-sm">({fish.bids} bids)</p>}
              </div>
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

          {/* Action Button */}
          {getActionButton(fish)}
        </div>
      </div>
    </div>
  )
}

interface AuctionCardProps {
  fish: FishListing
  onBidClick: (fish: FishListing) => void
}

function AuctionCard({ fish, onBidClick }: AuctionCardProps) {
  return (
    <div className="bg-blue-800 rounded-lg overflow-hidden relative transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/70 cursor-pointer shadow-md shadow-blue-900/40">
      {/* Auction Badge */}
      <Badge className="absolute top-4 right-4 z-10 bg-amber-500 flex items-center">
        <Hammer className="w-3 h-3 mr-1" />
        Auction
      </Badge>

      {/* Fish Image */}
      <div className="p-6 flex justify-center items-center bg-blue-900">
        <div className="relative w-48 h-48 flex justify-center items-center">
          {/* Fish Tank Background */}
          <img src="/fish/fish-tank.svg" alt="Fish Tank" className="absolute w-full h-full object-contain" />
          {/* Fish Image */}
          <img
            src={fish.image || "/placeholder.svg"}
            alt={fish.name}
            className="absolute w-32 h-32 object-contain z-0 transform hover:scale-110 transition-transform duration-300"
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
          <div className="text-sm text-blue-300 flex items-center ml-auto">
            <Clock className="w-4 h-4 mr-1" />
            <span>Ends in {fish.endsIn}</span>
          </div>
        </div>

        {/* Price Info */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <Coins className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="font-bold text-white">{fish.price}</span>
            </div>
            {fish.bids && <p className="text-blue-300 text-sm">({fish.bids} bids)</p>}
            <p className="text-blue-300 text-xs mt-1">Min. next bid: {fish.minNextBid}</p>
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

interface FeaturedAuctionProps {
  auction: FishListing
  onBidClick: (fish: FishListing) => void
}

function FeaturedAuction({ auction, onBidClick }: FeaturedAuctionProps) {
  return (
    <div className="bg-blue-800 rounded-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/70 cursor-pointer shadow-lg shadow-blue-900/50">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Fish Image */}
        <div className="p-6 relative bg-blue-900 md:w-1/3">
          <Badge className="absolute top-4 left-4 z-10 bg-amber-500 flex items-center">
            <Hammer className="w-3 h-3 mr-1" />
            Featured Auction
          </Badge>
          <div className="flex justify-center items-center h-full">
            <div className="relative w-48 h-48 flex justify-center items-center">
              {/* Fish Tank Background */}
              <img src="/fish/fish-tank.svg" alt="Fish Tank" className="absolute w-full h-full object-contain" />
              {/* Fish Image */}
              <img
                src={auction.image || "/placeholder.svg"}
                alt={auction.name}
                className="absolute w-32 h-32 object-contain z-0 transform hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Fish Details */}
        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-white">{auction.name}</h3>
              <Badge className={`${getRarityColor(auction.rarity)} font-medium`}>{auction.rarity}</Badge>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-blue-300">
                <Clock className="w-4 h-4 mr-1" />
                <span>Ends in {auction.endsIn}</span>
              </div>
              <p className="text-blue-300 text-sm">{auction.bids} bids placed</p>
            </div>
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
            <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg border border-white border-opacity-60">
              <p className="text-blue-300 mb-1">Level</p>
              <p className="text-white text-xl font-bold">{auction.level}</p>
            </div>
            <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg border border-white border-opacity-60">
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
  )
}

interface BrowseMarketProps {
  fishListings: FishListing[]
  onBidClick: (fish: FishListing) => void
}

function BrowseMarket({ fishListings, onBidClick }: BrowseMarketProps) {
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
          <Button
            variant="outline"
            className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-blue-900/50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-green-400 hover:bg-green-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-green-900/50">
            <Plus className="h-4 w-4 mr-2" />
            List Fish
          </Button>
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

interface AuctionsViewProps {
  auctionListings: FishListing[]
  featuredAuction: FishListing | undefined
  onBidClick: (fish: FishListing) => void
}

function AuctionsView({ auctionListings, featuredAuction, onBidClick }: AuctionsViewProps) {
  return (
    <>
      {/* Auctions Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Live Auctions</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-blue-900/50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-amber-900/50">
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

interface BidDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedFish: FishListing | null
  onPlaceBid: () => void
}

function BidDialog({ open, onOpenChange, selectedFish, onPlaceBid }: BidDialogProps) {
  const [bidAmount, setBidAmount] = useState(selectedFish?.minNextBid?.toString() || "")
  const [bidError, setBidError] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blue-700 text-white border-blue-600 max-w-md [&>button]:hidden shadow-xl shadow-blue-900/50">
        <div className="flex items-center justify-between mb-2">
          <DialogTitle className="text-xl font-bold text-white">Place Bid</DialogTitle>
          <DialogClose className="text-white hover:text-blue-200">
            <X className="h-5 w-5" />
          </DialogClose>
        </div>
        {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
        <div className="border-b border-blue-600 pb-2 -mt-2"></div>

        {selectedFish && (
          <>
            {/* Fish Info */}
            <div className="flex items-center gap-3 mb-6 mt-4">
              <div className="relative w-16 h-16 flex justify-center items-center">
                {/* Fish Tank Background */}
                <img src="/fish/fish-tank.svg" alt="Fish Tank" className="absolute w-full h-full object-contain" />
                {/* Fish Image */}
                <img
                  src={selectedFish.image || "/placeholder.svg"}
                  alt={selectedFish.name}
                  className="absolute w-10 h-10 object-contain z-0 transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="font-bold text-white">{selectedFish.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={`${getRarityColor(selectedFish.rarity)} text-xs`}>{selectedFish.rarity}</Badge>
                  <span className="text-blue-200 text-sm">Level {selectedFish.level}</span>
                </div>
              </div>
            </div>

            {/* Auction Info */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Current Bid</span>
                <div className="flex items-center">
                  <Coins className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-bold">{selectedFish.price}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Minimum Bid</span>
                <div className="flex items-center">
                  <Coins className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-bold">{selectedFish.minNextBid}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Auction Ends</span>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-200 mr-1" />
                  <span>{selectedFish.endsIn}</span>
                </div>
              </div>
            </div>

            {/* Bid Input */}
            <div className="mb-6">
              {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
              <label className="text-blue-200 mb-2 block">Your Bid</label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    setBidAmount(e.target.value)
                    if (value < 5250) {
                      setBidError("Bid must be at least 5250 coins")
                    } else {
                      setBidError(null)
                    }
                  }}
                  className="pl-10 bg-blue-800 border-blue-600 text-white"
                />
              </div>
            </div>
            {bidError && (
              <p className="text-red-500 text-sm -mt-4 mb-6 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                {bidError}
              </p>
            )}

            {/* Bidding Rules */}
            <div className="bg-blue-800 p-3 rounded-md mb-6 flex gap-2">
              <Info className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-semibold mb-1">Bidding Rules</p>
                <p>
                  Your coins will be held in escrow until the auction ends. If you're outbid, your coins will be
                  returned to your wallet.
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold" onClick={onPlaceBid}>
                Place Bid
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-blue-400 text-blue-200 hover:bg-blue-600 hover:text-white"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("browse")
  const [bidDialogOpen, setBidDialogOpen] = useState(false)
  const [selectedFish, setSelectedFish] = useState<FishListing | null>(null)
  
  // Initialize bubbles with custom settings
  const bubbles = useBubbles({
    initialCount: 50,
    maxBubbles: 70,
    minSize: 20,
    maxSize: 60,
    minDuration: 15,
    maxDuration: 30,
    interval: 300,
  })

  const handleOpenBidDialog = (fish: FishListing) => {
    setSelectedFish(fish)
    setBidDialogOpen(true)
  }

  const handlePlaceBid = () => {
    console.log(`Placed bid of ${selectedFish?.minNextBid} on ${selectedFish?.name}`)
    setBidDialogOpen(false)
  }

  const auctionListings = fishListings.filter((fish) => fish.listingType === "Auction")
  const featuredAuction = auctionListings.find((fish) => fish.featured)

  return (
    <div className="min-h-screen bg-blue-600 relative overflow-hidden">
      {/* Bubbles Background */}
      <BubblesBackground
        bubbles={bubbles}
        className="opacity-50"
        customStyles={{ 
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      />

      {/* Header */}
      <MarketHeader />

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4 relative z-10">
        {/* Navigation Tabs */}
        <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <TabsContent value="browse">
            <BrowseMarket fishListings={fishListings} onBidClick={handleOpenBidDialog} />
          </TabsContent>

          <TabsContent value="auctions">
            <AuctionsView
              auctionListings={auctionListings}
              featuredAuction={featuredAuction}
              onBidClick={handleOpenBidDialog}
            />
          </TabsContent>

          <TabsContent value="listings">
            <div className="text-center py-12 text-white">
              <h2 className="text-xl font-bold mb-2">My Listings</h2>
              <p className="text-blue-200">You don't have any active listings.</p>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="text-center py-12 text-white">
              <h2 className="text-xl font-bold mb-2">Transaction History</h2>
              <p className="text-blue-200">No recent transactions found.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Place Bid Dialog */}
      <BidDialog
        open={bidDialogOpen}
        onOpenChange={setBidDialogOpen}
        selectedFish={selectedFish}
        onPlaceBid={handlePlaceBid}
      />
      <Footer />
    </div>
  )
}
