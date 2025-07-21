import { Play } from "lucide-react"

interface GameCardProps {
  game: {
    id: string
    name: string
    image: string
    link: string
  }
  onClick: () => void
}

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <div className="group bg-blue-800/30 border border-blue-700/50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.015] flex flex-col">
      <div className="w-full h-40 bg-blue-900/40">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-white font-bold text-lg text-center">{game.name}</h3>
        <button
          onClick={onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          Play
        </button>
      </div>
    </div>
  )
}
