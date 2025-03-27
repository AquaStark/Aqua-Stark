"use client"

import { useState } from "react"
import { Clock, Coins, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { FishListing } from "@/types/market"
import { getRarityColor } from "@/lib/market-utils"

interface BidDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedFish: FishListing | null
  onPlaceBid: () => void
}

export function BidDialog({ open, onOpenChange, selectedFish, onPlaceBid }: BidDialogProps) {
  const [bidAmount, setBidAmount] = useState(selectedFish?.minNextBid?.toString() || "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blue-700 text-white border-blue-600 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Place Bid</DialogTitle>
        </DialogHeader>

        {selectedFish && (
          <>
            {/* Fish Info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 bg-blue-800">
                {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-200 opacity-50 rounded-b-full"></div>
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
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="pl-10 bg-blue-800 border-blue-600 text-white"
                />
              </div>
            </div>

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

