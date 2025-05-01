"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, Clock, RefreshCw, Plus } from "lucide-react"
import { useMarketStore } from "@/store/market-store"
import { RarityBadge } from "@/components/market/rarity-badge"
import { useState } from "react"

export function ListingModal() {
  const { selectedFish, showListingModal, setShowListingModal } = useMarketStore()
  const [listingType, setListingType] = useState("sale")
  const [price, setPrice] = useState("1000")
  const [duration, setDuration] = useState("24")
  const [traits, setTraits] = useState<string[]>([])

  if (!selectedFish) return null

  const handleAddTrait = (trait: string) => {
    if (!traits.includes(trait)) {
      setTraits([...traits, trait])
    }
  }

  const handleRemoveTrait = (trait: string) => {
    setTraits(traits.filter((t) => t !== trait))
  }

  const handleSubmit = () => {
    // In a real app, this would submit the listing to an API
    alert(`${selectedFish.name} listed for ${listingType}!`)
    setShowListingModal(false)
  }

  return (
    <Dialog open={showListingModal} onOpenChange={setShowListingModal}>
      <DialogContent className="bg-blue-900/95 border-blue-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">List Your Fish</DialogTitle>
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

        <Tabs defaultValue="sale" onValueChange={setListingType}>
          <TabsList className="grid grid-cols-3 bg-blue-800/50">
            <TabsTrigger value="sale" className="data-[state=active]:bg-blue-700">
              <Coins className="h-4 w-4 mr-2" />
              Sale
            </TabsTrigger>
            <TabsTrigger value="auction" className="data-[state=active]:bg-blue-700">
              <Clock className="h-4 w-4 mr-2" />
              Auction
            </TabsTrigger>
            <TabsTrigger value="exchange" className="data-[state=active]:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Exchange
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sale" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="price" className="text-blue-200">
                  Price (coins):
                </Label>
                <div className="relative mt-1">
                  <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400" />
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-10 bg-blue-800/50 border-blue-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration" className="text-blue-200">
                  Duration:
                </Label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full mt-1 bg-blue-800/50 border-blue-700 text-white rounded-md p-2"
                >
                  <option value="24">24 hours</option>
                  <option value="48">2 days</option>
                  <option value="72">3 days</option>
                  <option value="168">7 days</option>
                </select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auction" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="starting-bid" className="text-blue-200">
                  Starting bid (coins):
                </Label>
                <div className="relative mt-1">
                  <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400" />
                  <Input
                    id="starting-bid"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-10 bg-blue-800/50 border-blue-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="auction-duration" className="text-blue-200">
                  Duration:
                </Label>
                <select
                  id="auction-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full mt-1 bg-blue-800/50 border-blue-700 text-white rounded-md p-2"
                >
                  <option value="24">24 hours</option>
                  <option value="48">2 days</option>
                  <option value="72">3 days</option>
                  <option value="168">7 days</option>
                </select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exchange" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label className="text-blue-200">Looking for (traits):</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {traits.map((trait) => (
                    <span
                      key={trait}
                      className="text-xs px-2 py-1 bg-blue-700/50 rounded-full text-blue-100 flex items-center"
                      onClick={() => handleRemoveTrait(trait)}
                    >
                      {trait}
                      <button className="ml-1 text-blue-300 hover:text-blue-100">×</button>
                    </span>
                  ))}

                  {traits.length === 0 && <span className="text-blue-300 text-sm">No traits selected</span>}
                </div>
              </div>

              <div>
                <Label className="text-blue-200">Add traits:</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Rare", "Epic", "Legendary", "Blue", "Red", "Green", "Gold", "Spotted", "Striped"].map((trait) => (
                    <Button
                      key={trait}
                      variant="outline"
                      size="sm"
                      className="border-blue-600/50 text-blue-100 bg-blue-800/30 hover:bg-blue-700/50"
                      onClick={() => handleAddTrait(trait)}
                      disabled={traits.includes(trait)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {trait}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="exchange-duration" className="text-blue-200">
                  Duration:
                </Label>
                <select
                  id="exchange-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full mt-1 bg-blue-800/50 border-blue-700 text-white rounded-md p-2"
                >
                  <option value="24">24 hours</option>
                  <option value="48">2 days</option>
                  <option value="72">3 days</option>
                  <option value="168">7 days</option>
                </select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline" onClick={() => setShowListingModal(false)}
            className="text-black">
            Cancel
          </Button>
          <Button
            className={
              listingType === "sale"
                ? "bg-green-500 hover:bg-green-600 text-black"
                : listingType === "auction"
                  ? "bg-amber-500 hover:bg-amber-600 text-black"
                  : "bg-purple-500 hover:bg-purple-600"
            }
            onClick={handleSubmit}
          >
            List Fish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

