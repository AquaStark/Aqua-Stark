import { ArrowLeft, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarketHeader() {
  return (
    <header className="bg-blue-700 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="text-white hover:bg-blue-600 flex items-center gap-2">
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

