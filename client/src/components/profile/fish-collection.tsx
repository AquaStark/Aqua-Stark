import { ChevronRight, Star } from "lucide-react"

interface Fish {
  id: string
  name: string
  imageUrl: string
  rarity: string
  level: number
  obtainedDate: string
}

interface FishCollectionProps {
  fishCollection: {
    collected: number
    total: number
    displayedFish: Fish[]
  }
}

export function FishCollection({ fishCollection }: FishCollectionProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Fish Collection</h2>
        <span className="text-sm">
          {fishCollection.collected} of {fishCollection.total} collected
        </span>
      </div>
      <div className="h-2 bg-blue-900 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-300 animate-expandWidth"
          style={{ width: `${(fishCollection.collected / fishCollection.total) * 100}%` }}
        />
      </div>

      {/* Fish Grid */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {fishCollection.displayedFish.map((fish, index) => (
          <div
            key={fish.id}
            className="bg-blue-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="p-4 flex justify-center items-center h-24 relative">
              <div
                className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${
                  fish.rarity === "Legendary"
                    ? "bg-purple-500"
                    : fish.rarity === "Rare"
                      ? "bg-blue-500"
                      : fish.rarity === "Special"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                }`}
              >
                {fish.rarity}
              </div>
              <img
                src={fish.imageUrl}
                alt={fish.name}
                width={80}
                height={80}
                className="h-20 w-auto animate-float-small"
              />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm mb-1">{fish.name}</h3>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" />
                  <span>Level {fish.level}</span>
                </div>
                <span className="text-blue-300">Obtained: {fish.obtainedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-3 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors transform hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-md">
        <span>View Full Collection</span>
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
