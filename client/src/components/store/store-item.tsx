"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Coins, Heart, Plus, Star, Check } from "lucide-react"
import { FishTank } from "@/components/fish-tank"
import { useCartStore } from "@/store/use-cart-store"

interface StoreItemProps {
  id?: string
  name: string
  image: string
  price: number
  rarity: string
  description?: string
  rating?: number
  originalPrice?: number
  isNew?: boolean
  stock?: number
  isLimited?: boolean
  onAddToWishlist?: (itemName: string, isFavorite: boolean) => void
}

export default function StoreItem({
  id,
  name,
  image,
  price,
  rarity,
  description = "",
  rating = 0,
  originalPrice,
  isNew = false,
  stock,
  isLimited = false,
  onAddToWishlist,
}: StoreItemProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem, addToRecentlyViewed } = useCartStore()

  const getRarityColor = () => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "bg-gray-500"
      case "rare":
        return "bg-blue-500"
      case "legendary":
        return "bg-purple-500"
      case "special":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const hasDiscount = originalPrice && originalPrice > price
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    
    if (onAddToWishlist) {
      onAddToWishlist(name, newFavoriteState)
    }
  }

  const handleAddToCart = () => {
    setIsAddingToCart(true)
    
    // Create item object for cart
    const item = { id, name, image, price, rarity, description }
    
    setTimeout(() => {
      setIsInCart(true)
      setIsAddingToCart(false)
      
      // Add to cart using useCartStore
      addItem(item)
      addToRecentlyViewed(item)
      
      setTimeout(() => {
        setIsInCart(false)
      }, 2000)
    }, 300)
  }

  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="absolute w-5 h-5 text-yellow-400" />
            <div className="absolute w-2.5 h-5 overflow-hidden">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>,
        )
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400/30" />)
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-2">{stars}</div>
        <span className="text-sm text-white">({rating.toFixed(1)})</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-blue-600 rounded-3xl overflow-hidden shadow-xl border-2 border-blue-400 transform hover:scale-105 transition-all duration-200"
    >
      <div className="relative">
        {/* Top controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className="w-10 h-10 rounded-full bg-blue-700/70 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-blue-700"
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-white"
              }`}
              fill={isFavorite ? "red" : "none"}
            />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={isInCart || isAddingToCart}
            className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
              isInCart 
                ? "bg-green-500" 
                : isAddingToCart 
                  ? "bg-blue-500 animate-pulse" 
                  : "bg-blue-700/70 hover:bg-blue-700"
            }`}
            aria-label="Quick add to cart"
          >
            {isInCart ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <Plus className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>

        {/* Discount tag */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">
            -{discountPercentage}%
          </div>
        )}

        {/* Stock indicator */}
        {isLimited && stock !== undefined && stock > 0 && (
          <div className="absolute bottom-3 right-3 z-10 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
            {stock} LEFT
          </div>
        )}

        {/* Fish tank container */}
        <div className="relative mx-auto w-full h-56 bg-blue-400/50 flex items-center justify-center overflow-hidden">
          <FishTank>
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={image || "/placeholder.svg"}
              alt={name}
              width={120}
              height={120}
              className="object-contain transition-all duration-500 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
          </FishTank>
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white uppercase">{name}</h3>
          <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${getRarityColor()}`}>{rarity}</span>
        </div>

        <p className="text-sm text-blue-100 mb-1 min-h-[20px]">{description || "No description available"}</p>

        <div className="mb-2">
          {rating > 0 ? (
            renderStars()
          ) : (
            <div className="flex items-center">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400/30" />
                ))}
              </div>
              <span className="text-sm text-white">(0.0)</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Coins className="text-yellow-400 mr-1" size={20} />
            <div className="flex items-center">
              {hasDiscount && (
                <span className="text-white/60 font-medium text-lg line-through mr-2">{originalPrice}</span>
              )}
              <span className="text-white font-bold text-xl">{price}</span>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`font-bold rounded-lg px-6 py-2 border-2 transition-all ${
                isInCart 
                  ? "bg-green-500 hover:bg-green-600 border-green-400 text-white" 
                  : "bg-orange-500 hover:bg-orange-600 border-orange-400 text-white"
              }`}
            >
              {isInCart ? "Added" : "Add to Cart"}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}