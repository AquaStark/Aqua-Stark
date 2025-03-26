import React, { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { GameButton } from "./game-button"

interface TipsPopupProps {
  show: boolean
  onClose: () => void
  onToggle: () => void
}

export function TipsPopup({ show, onClose, onToggle }: TipsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <div className="relative">
      <GameButton
        icon="💡"
        text="Tips"
        color="from-yellow-400 to-yellow-600 cursor-pointer z-50"
        onClick={onToggle}
      />

      {show && (
        <div
          ref={popupRef}
          className="absolute bottom-16 right-0 w-64 bg-blue-600/90 backdrop-blur-md rounded-2xl p-4 border-2 border-blue-400/50 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-300 z-50"
        >
          <div className="absolute -bottom-3 right-8 w-6 h-6 bg-blue-600/90 transform rotate-45 border-r-2 border-b-2 border-blue-400/50"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <span className="text-xl mr-2">💡</span>
              <h3 className="text-white font-bold">Tip of the day</h3>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <p className="text-white/90 text-sm">
            Feed your fish regularly to keep them healthy and happy. Well-fed fish grow faster and have more vibrant colors.
          </p>
          <div className="mt-3 flex justify-end">
            <span className="text-xs text-white/70">Tap to close</span>
          </div>

          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white/20 animate-pulse"></div>
          <div
            className="absolute top-6 right-6 w-2 h-2 rounded-full bg-white/20 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-10 right-4 w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      )}
    </div>
  )
} 