import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import { FishTank } from "@/components/fish-tank"

export default function StoreItem({ name, image, price, rarity }: { name: string; image: string; price: number; rarity: string }) {
  const rarityColor = () => {
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

  return (
    <div className="bg-blue-600 rounded-3xl overflow-hidden shadow-xl border-2 border-blue-400 transform hover:scale-105 transition-all duration-200">
      <div className="p-4 text-center">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <span className={`text-xs font-bold text-white px-2 py-1 rounded-full ${rarityColor()}`}>{rarity}</span>
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
          <Button className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg px-6 py-2 border-2 border-green-400">
            BUY
          </Button>
        </div>
      </div>
    </div>
  )
}
