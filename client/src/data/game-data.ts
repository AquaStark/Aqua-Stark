import { FishType } from "@/types/game"

// Tipos
export interface GameState {
  happiness: number
  food: number
  energy: number
}

// Datos mock
export const MOCK_FISH: FishType[] = [
  {
    id: 1,
    name: "Fish 1",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png",
    rarity: "Common",
    generation: 1,
    position: { x: 20, y: 30 },
  },
  {
    id: 2,
    name: "Fish 2",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png",
    rarity: "Rare",
    generation: 2,
    position: { x: 60, y: 50 },
  }
]

export const MOCK_AQUARIUMS = ["My First Aquarium", "Second Aquarium", "Tropical Paradise"]

export const INITIAL_GAME_STATE: GameState = {
  happiness: 80,
  food: 90,
  energy: 75,
} 