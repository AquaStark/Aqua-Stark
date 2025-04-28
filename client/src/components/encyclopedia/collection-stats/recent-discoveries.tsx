import { Badge } from "@/components/ui/badge"

interface Discovery {
  id: number
  name: string
  date: string
  rarity: string
  image: string
}

interface RecentDiscoveriesProps {
  discoveries: Discovery[]
}

export default function RecentDiscoveries({ discoveries }: RecentDiscoveriesProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-amber-500 hover:bg-amber-600"
      case "Uncommon":
        return "bg-green-500 hover:bg-green-600"
      case "Rare":
        return "bg-blue-500 hover:bg-blue-600"
      case "Epic":
        return "bg-purple-500 hover:bg-purple-600"
      case "Legendary":
        return "bg-orange-500 hover:bg-orange-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-white">Recent Discoveries</h2>
      <hr className="mb-6 border-blue-700/50" />
      <div className="space-y-4">
        {discoveries.map((discovery) => (
          <div
            key={discovery.id}
            className="group flex items-center rounded-lg bg-blue-900/50 p-3 transition-all duration-300 ease-in-out cursor-pointer hover:bg-blue-800/70 hover:translate-x-1 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-950 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <img
                src={discovery.image || "/placeholder.svg"}
                alt={discovery.name}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium text-white">{discovery.name}</h3>
              <p className="text-xs text-blue-300">Discovered on {discovery.date}</p>
            </div>
            <Badge className={`${getRarityColor(discovery.rarity)}`}>{discovery.rarity}</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
