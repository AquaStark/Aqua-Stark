import React from "react"
import {
  Droplets,
  Leaf,
  Sparkles,
  Palette,
  Layers,
} from "lucide-react"
import { GameButton } from "./game-button"

const SIDEBAR_BUTTONS = [
  { icon: "🌿", color: "from-green-400 to-green-600", tooltip: "Plants" },
  { icon: "🪨", color: "from-blue-400 to-blue-600", tooltip: "Rocks" },
  { icon: "🏰", color: "from-purple-400 to-purple-600", tooltip: "Decorations" },
  { icon: <Droplets className="h-5 w-5" />, color: "from-cyan-400 to-cyan-600", tooltip: "Water" },
  { icon: <Leaf className="h-5 w-5" />, color: "from-emerald-400 to-emerald-600", tooltip: "Algae" },
  { icon: <Sparkles className="h-5 w-5" />, color: "from-amber-400 to-amber-600", tooltip: "Effects" },
  { icon: <Palette className="h-5 w-5" />, color: "from-pink-400 to-pink-600", tooltip: "Colors" },
  { icon: <Layers className="h-5 w-5" />, color: "from-indigo-400 to-indigo-600", tooltip: "Layers" },
]

export function GameSidebarButtons() {
  return (
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
      {SIDEBAR_BUTTONS.map((button, index) => (
        <GameButton
          key={index}
          icon={button.icon}
          color={button.color}
          tooltip={button.tooltip}
        />
      ))}
    </div>
  )
} 