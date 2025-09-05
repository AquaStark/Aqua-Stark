"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Pause, Square } from "lucide-react"

interface GameUIProps {
  score: number
  bestScore: number
  isPlaying: boolean
  isGameOver: boolean
  isPaused: boolean
  selectedFish: {
    rarity: string
    multiplier: number
  }
  onBack: () => void
  onTogglePause: () => void
  onEndGame: () => void
}

export function GameUI({
  score,
  bestScore,
  isPlaying,
  isGameOver,
  isPaused,
  selectedFish,
  onBack,
  onTogglePause,
  onEndGame,
}: GameUIProps) {
  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      <div className="absolute top-32 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400/50 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur-md rounded-xl px-6 py-3 border-2 border-blue-400/50 shadow-lg">
            <span className="text-white font-bold text-lg">Score: {score}</span>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 backdrop-blur-md rounded-xl px-6 py-3 border-2 border-yellow-400/50 shadow-lg">
            <span className="text-white font-bold text-lg">Best: {bestScore}</span>
          </div>
        </div>
      </div>

      {isPlaying && !isGameOver && (
        <div className="absolute top-[15rem] right-4 flex flex-col gap-3 pointer-events-auto">
          {/* Pause and Stop buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onTogglePause}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button
              onClick={onEndGame}
              size="sm"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg"
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-gradient-to-r from-green-600/90 to-green-700/90 backdrop-blur-md rounded-xl px-4 py-2 border-2 border-green-400/50 shadow-lg">
            <div className="text-center">
              <p className="text-white font-bold text-sm">{selectedFish.rarity}</p>
              <p className="text-white/90 text-xs">{selectedFish.multiplier}x XP</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
