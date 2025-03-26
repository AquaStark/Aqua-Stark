import {
  Volume2,
  Trophy,
  ShoppingBag,
  HelpCircle,
  Camera,
  Home,
  Settings,
} from "lucide-react"
import { GameButton } from "./game-button"

interface GameMenuProps {
  show: boolean
}

export function GameMenu({ show }: GameMenuProps) {
    if (!show) return null

  const menuItems = [
    { icon: <Volume2 className="h-5 w-5" />, onClick: () => {} },
    { icon: <Trophy className="h-5 w-5" />, onClick: () => {} },
    { icon: <ShoppingBag className="h-5 w-5" />, onClick: () => {} },
    { icon: <HelpCircle className="h-5 w-5" />, onClick: () => {} },
    { icon: <Camera className="h-5 w-5" />, onClick: () => {} },
    { icon: <Home className="h-5 w-5" />, onClick: () => {} },
    { icon: <Settings className="h-5 w-5" />, onClick: () => {} },
  ]

  return (
    <div className="absolute top-32 right-4 z-30 flex flex-col gap-3">
      {menuItems.map((item, index) => (
        <GameButton
          key={index}
          icon={item.icon}
          onClick={item.onClick}
          className="w-12 h-12 rounded-xl bg-blue-500/20 hover:bg-blue-500/40 backdrop-blur-sm text-white border border-blue-400/30 shadow-lg hover:shadow-blue-400/20 transition-all duration-300 hover:-translate-y-0.5"
        />
      ))}
    </div>
  )
} 