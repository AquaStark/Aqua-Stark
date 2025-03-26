import { useState, useEffect } from "react"

interface GameState {
  happiness: number
  food: number
  energy: number
}

export function useFishStats(initialState: GameState) {
  const [happiness, setHappiness] = useState(initialState.happiness)
  const [food, setFood] = useState(initialState.food)
  const [energy, setEnergy] = useState(initialState.energy)

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * 3)
      const change = Math.floor(Math.random() * 11) - 5 // -5 a +5

      if (random === 0) {
        setHappiness((prev) => Math.min(Math.max(0, prev + change), 100))
      } else if (random === 1) {
        setFood((prev) => Math.min(Math.max(0, prev + change), 100))
      } else {
        setEnergy((prev) => Math.min(Math.max(0, prev + change), 100))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return { happiness, food, energy }
} 