 feat/food-tab
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { FishTank } from "@/components/fish-tank";


import { motion } from "framer-motion";
import { useCartStore } from "@/store/use-cart-store";
import { Coins, ShoppingCart } from "lucide-react";
import { FishTank } from "@/components/fish-tank";

interface StoreItemProps {
  name: string;
  image: string;
  price: number;
  rarity: string;
}

 main
export default function StoreItem({
  name,
  image,
  price,
  rarity,
 feat/food-tab
}: {
  name: string;
  image: string;
  price: number;
  rarity: string;
}) {

}: StoreItemProps) {
  const { addItem, addToRecentlyViewed } = useCartStore();

  const handleAddToCart = () => {
    const item = { name, image, price, rarity };
    addItem(item);
    addToRecentlyViewed(item);
  };
 main
  const rarityColor = () => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "bg-gray-500";
      case "rare":
        return "bg-blue-500";
      case "legendary":
        return "bg-purple-500";
      case "special":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-blue-600 rounded-3xl overflow-hidden shadow-xl border-2 border-blue-400 transform hover:scale-105 transition-all duration-200"
    >
      <div className="p-4 text-center">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <span
            className={`text-xs font-bold text-white px-2 py-1 rounded-full ${rarityColor()}`}
          >
            {rarity}
          </span>
        </div>
        <div className="relative mx-auto w-full h-48 bg-blue-400/50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-300/50"></div>
          <FishTank>
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              width={120}
              height={120}
              className="object-contain transform hover:scale-110 transition-all duration-500"
            />
          </FishTank>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Coins className="text-yellow-400 mr-1" size={20} />
            <span className="text-white font-bold text-xl">{price}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
          >
            <ShoppingCart className="mr-2" />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
 feat/food-tab
    </div>

    </motion.div>
 main
  );
}
