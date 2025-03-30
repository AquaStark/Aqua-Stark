import { Fish } from "lucide-react"
import { GameStatusBar } from "../game-status-bar"
import { GameButton } from "./game-button"

interface GameHeaderProps {
  happiness: number
  food: number
  energy: number
  onMenuToggle: () => void
}

export function GameHeader({ happiness, food, energy, onMenuToggle }: GameHeaderProps) {

  return (
    <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-20">
      <div className="flex items-center gap-4">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png"
          alt="Aqua Stark Logo"
          width={120}
          height={50}
          className="drop-shadow-lg"
        />
      </div>

      <div className="flex items-center gap-4 bg-blue-900/40 backdrop-blur-sm p-3 rounded-xl">
          <div className="flex items-center gap-2 mr-4 bg-blue-800/50 px-3 py-1 rounded-lg">
            <Fish className="text-blue-200 h-5 w-5" />
            <span className="text-white font-bold">2/10</span>
          </div>

          <GameStatusBar icon="🌟" value={happiness} color="from-yellow-400 to-yellow-600" label="Happiness" />
          <GameStatusBar icon="🍖" value={food} color="from-orange-400 to-orange-600" label="Hunger" />
          <GameStatusBar icon="⚡" value={energy} color="from-blue-400 to-blue-600" label="Energy" />
        </div>

      <div className="flex items-center gap-2">
        <GameButton
          icon="☰"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center"
          onClick={onMenuToggle}
        />
      </div>
    </div>
  )
} 