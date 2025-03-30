import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GameButtonProps {
  icon: React.ReactNode | string
  text?: string
  color?: string
  tooltip?: string
  onClick?: () => void
  className?: string
}

export function GameButton({
  icon,
  text,
  color = "from-blue-400 to-blue-600",
  tooltip,
  onClick,
  className,
}: GameButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "game-button bg-gradient-to-b text-white rounded-xl relative group",
        text ? "px-4 py-2" : "w-12 h-12",
        color,
        className
      )}
    >
      <div className="flex items-center gap-2">
        {typeof icon === "string" ? <span className="text-xl">{icon}</span> : icon}
        {text && <span className="font-bold">{text}</span>}
      </div>
      {tooltip && (
        <div className="absolute -right-24 top-1/2 transform -translate-y-1/2 game-container p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <span className="text-white text-xs">{tooltip}</span>
        </div>
      )}
    </Button>
  )
} 