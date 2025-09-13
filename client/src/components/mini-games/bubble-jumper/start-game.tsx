import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface StartGameButtonProps {
  onStartGame: () => void
}

function StartGameButton({ onStartGame }: StartGameButtonProps) {
  return (
    <Button
      onClick={onStartGame}
      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold px-10 py-4 text-lg shadow-lg"
    >
      <Play className="h-5 w-5 mr-2" />
      Start Game
    </Button>
  )
}

export default StartGameButton;