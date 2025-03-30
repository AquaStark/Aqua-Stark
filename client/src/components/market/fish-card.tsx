"use client"

import { motion } from "framer-motion"
import { Clock, Check, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RarityBadge } from "@/components/market/rarity-badge"
import { ListingTypeBadge } from "@/components/market/listing-type-badge"
import type { Fish } from "@/types/market"
import { useMarketStore } from "@/store/market-store"
import type React from "react"

interface FishCardProps {
  fish: Fish
  onClick?: () => void
}

export function FishCard({ fish, onClick }: FishCardProps) {
  const { setSelectedFish, setShowBidModal, setShowOfferModal } = useMarketStore()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      setSelectedFish(fish)
    }
  }

  const handleBidClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFish(fish)
    setShowBidModal(true)
  }

  const handleOfferClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFish(fish)
    setShowOfferModal(true)
  }

  return (
    <motion.div
      className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden w-full max-w-xs"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={handleClick}
    >
      {/* Parte superior cuadrada */}
      <div className="relative h-64 bg-blue-900/50">
        <div className="absolute inset-0 z-0 opacity-30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/10"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative w-full h-full flex items-center justify-center z-0">
          {/* Pez */}
          <img
            src={fish.image || "/placeholder.svg?height=100&width=100"}
            alt={fish.name}
            className="w-[110px] h-[110px] object-contain z-0"
          />

          {/* Pecera encima */}
          <img
            src="/fish/fish-tank.svg"
            alt="Fish Tank"
            className="absolute inset-0 z-10 w-full h-full object-contain pointer-events-none"
          />
        </div>

        {fish.auction && <ListingTypeBadge type="auction" />}
        {fish.exchange && <ListingTypeBadge type="exchange" />}
        {fish.price && <ListingTypeBadge type="sale" />}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-white">{fish.name}</h3>
          <RarityBadge rarity={fish.rarity} />
        </div>

        <div className="flex items-center mt-1 mb-3">
          <div className="flex items-center mr-3">
            <div className="relative w-5 h-5 rounded-full overflow-hidden mr-1">
              <img
                src={fish.seller?.avatar || "/placeholder.svg?height=50&width=50"}
                alt={fish.seller?.name || ""}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <span className="text-blue-200 text-xs">{fish.seller?.name}</span>
            {fish.seller?.verified && <Check className="h-3 w-3 text-blue-400 ml-1" />}
          </div>
          <span className="text-blue-300 text-xs flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {fish.listed}
          </span>
        </div>

        {fish.price && (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Coins className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-white font-bold">{fish.price}</span>
            </div>
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
              Buy Now
            </Button>
          </div>
        )}

        {fish.auction && (
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-white font-bold">{fish.auction.currentBid}</span>
                <span className="text-blue-300 text-xs ml-1">({fish.auction.bids} bids)</span>
              </div>
              <div className="text-blue-300 text-xs flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Ends in {fish.auction.endsIn}
              </div>
            </div>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleBidClick}>
              Place Bid
            </Button>
          </div>
        )}

        {fish.exchange && (
          <div className="flex justify-between items-center">
            <div>
              <div className="text-blue-200 text-xs">Looking for:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {fish.exchange.lookingFor.map((trait, index) => (
                  <span key={index} className="text-xs px-2 py-0.5 bg-blue-700/50 rounded-full text-blue-100">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white" onClick={handleOfferClick}>
              Offer
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
