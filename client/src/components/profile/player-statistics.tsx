import { BarChart2, Fish, Sparkles, Stethoscope, ChartColumnBig } from "lucide-react"

interface PlayerStatisticsProps {
  playerStats: {
    fishFed: number
    decorationsPlaced: number
    fishBred: number
    aquariumsCreated: number
  }
}

export function PlayerStatistics({ playerStats }: PlayerStatisticsProps) {
  return (
    <div className="animate-fadeIn" style={{ animationDelay: "0.5s" }}>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <BarChart2 className="w-5 h-5 mr-2" />
        Player Statistics
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            icon: <Fish className="w-4 h-4 text-blue-300" />,
            label: "Fish Fed",
            value: playerStats.fishFed.toLocaleString(),
            color: "bg-blue-700",
            delay: 0.6,
          },
          {
            icon: <Sparkles className="w-4 h-4 text-purple-300" />,
            label: "Decorations Placed",
            value: playerStats.decorationsPlaced,
            color: "bg-purple-700",
            delay: 0.7,
          },
          {
            icon: <Stethoscope className="w-4 h-4 text-red-300" />,
            label: "Fish Bred",
            value: playerStats.fishBred,
            color: "bg-red-700",
            delay: 0.8,
          },
          {
            icon: <ChartColumnBig className="w-4 h-4 text-yellow-300" />,
            label: "Aquariums Created",
            value: playerStats.aquariumsCreated,
            color: "bg-yellow-700",
            delay: 0.9,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-blue-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
            style={{ animationDelay: `${stat.delay}s` }}
          >
            <div className="flex justify-center mb-2">
              <div
                className={`w-8 h-8 rounded-full ${stat.color} flex items-center justify-center animate-pulse-slow`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="text-center text-sm text-blue-300">{stat.label}</div>
            <div className="text-center text-2xl font-bold animate-count">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
