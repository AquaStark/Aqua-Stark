"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coins, Clock, Plus, Minus } from "lucide-react"
import { useMarketStore } from "@/store/market-store"
import { RarityBadge } from "@/components/market/rarity-badge"

export function BidModal() {
  const { selectedFish, showBidModal, setShowBidModal, bidAmount, setBidAmount } = useMarketStore()
  const [error, setError] = useState("")

  if (!selectedFish || !selectedFish.auction) return null

  const minBid = selectedFish.auction.currentBid + 100

  const handleBidChange = (value: number) => {
    if (value < minBid) {
      setError(`Bid must be at least ${minBid} coins`)
    } else {
      setError("")
    }
    setBidAmount(value)
  }

  const handleSubmit = () => {
    if (bidAmount < minBid) {
      setError(`Bid must be at least ${minBid} coins`)
      return
    }

    // In a real app, this would submit the bid to an API
    alert(`Bid of ${bidAmount} coins placed on ${selectedFish.name}!`)
    setShowBidModal(false)
  }

  return (
    <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
      <DialogContent className="bg-blue-900/95 border-blue-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Place a Bid</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-blue-800/50 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={selectedFish.image || "/placeholder.svg?height=50&width=50"}
              alt={selectedFish.name}
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold">{selectedFish.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <RarityBadge rarity={selectedFish.rarity} />
              <span className="text-xs text-blue-300">Level {selectedFish.level}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-800/50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-200">Current bid:</span>
            <div className="flex items-center">
              <Coins className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-bold">{selectedFish.auction.currentBid}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-200">Auction ends:</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-400 mr-1" />
              <span>{selectedFish.auction.endsIn}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-blue-200 mb-2">Your bid (minimum {minBid} coins):</label>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-black"
              onClick={() => handleBidChange(Math.max(minBid, bidAmount - 100))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="relative flex-1 mx-2">
              <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400" />
              <Input
                type="number"
                value={bidAmount || minBid}
                onChange={(e) => handleBidChange(Number(e.target.value))}
                className="pl-10 bg-blue-800/50 border-blue-700 text-white"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-black"
              onClick={() => handleBidChange(bidAmount + 100)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline" onClick={() => setShowBidModal(false)}
            className="text-black">
            Cancel
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-black" onClick={handleSubmit}>
            Place Bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

