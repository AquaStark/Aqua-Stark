import { Link } from "react-router-dom"
import { ArrowLeft, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarketHeader() {
  return (
    <header className="relative z-10 bg-blue-800/50 backdrop-blur-sm border-b border-blue-700/50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/game" className="mr-4">
            <Button variant="ghost" className="text-white hover:bg-blue-700/50 rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Game
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Trading Market</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-blue-700/50 rounded-full px-4 py-2 border border-blue-400/50">
            <Coins className="text-yellow-400 mr-2" size={20} />
            <span className="text-white font-bold">12,500</span>
          </div>
        </div>
      </div>
    </header>
  )
}

