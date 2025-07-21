import { useState } from "react"
import { mockFish, mockGames } from "@/data/mockdata-games"

export function useGames() {
  // List of available fish
  const [availableFish] = useState(mockFish)

  // Currently selected fish
  const [selectedFish, setSelectedFish] = useState(mockFish[0])

  // All available games
  const allGames = mockGames

  // When a game is clicked, redirect to its page
  const handleGameClick = (game: { id: string; link: string }) => {
    window.location.href = game.link
  }

  return {
    availableFish,
    selectedFish,
    setSelectedFish,
    allGames,
    handleGameClick,
  }
}
