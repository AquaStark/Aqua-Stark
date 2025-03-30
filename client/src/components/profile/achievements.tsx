import { Trophy, Fish, Check, Lock } from "lucide-react"

interface AchievementsProps {
  stats: {
    achievements: {
      completed: number
      total: number
    }
  }
}

export function Achievements({ stats }: AchievementsProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400 animate-pulse-slow" />
          Achievements
        </h2>
        <span className="text-sm">
          {stats.achievements.completed} of {stats.achievements.total} completed
        </span>
      </div>
      <div className="h-2 bg-blue-900 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 animate-expandWidth"
          style={{ width: `${(stats.achievements.completed / stats.achievements.total) * 100}%` }}
        />
      </div>

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Collector Category */}
        <div
          className="bg-blue-800 rounded-xl overflow-hidden shadow-lg animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="bg-blue-700 p-4">
            <h3 className="font-bold text-lg flex items-center">
              <Fish className="w-5 h-5 mr-2 animate-wiggle" />
              Collector
            </h3>
          </div>
          <div className="p-4">
            <div
              className="flex items-center p-3 rounded-lg mb-2 bg-blue-700 transform hover:scale-[1.02] transition-transform animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse-slow">
                <Check className="w-5 h-5 text-yellow-900" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">First Catch</h4>
                <p className="text-xs text-blue-300">Catch your first fish</p>
              </div>
              <div className="text-xs text-blue-300">Feb 15, 2025</div>
            </div>

            <div
              className="flex items-center p-3 rounded-lg mb-2 bg-blue-700 transform hover:scale-[1.02] transition-transform animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse-slow">
                <Check className="w-5 h-5 text-yellow-900" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Novice Collector</h4>
                <p className="text-xs text-blue-300">Collect 10 different fish species</p>
              </div>
              <div className="text-xs text-blue-300">Mar 10, 2025</div>
            </div>

            <div
              className="flex items-center p-3 rounded-lg mb-2 bg-blue-900/50 transform hover:scale-[1.02] transition-transform animate-fadeIn"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-blue-950">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-blue-300">Advanced Collector</h4>
                <p className="text-xs text-blue-300">Collect 50 different fish species</p>
              </div>
            </div>

            <div
              className="flex items-center p-3 rounded-lg mb-2 bg-blue-900/50 transform hover:scale-[1.02] transition-transform animate-fadeIn"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-blue-950">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-blue-300">Master Collector</h4>
                <p className="text-xs text-blue-300">Collect all 100 fish species</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mastery Category */}
        <div
          className="bg-blue-800 rounded-xl overflow-hidden shadow-lg animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-blue-700 p-4">
            <h3 className="font-bold text-lg flex items-center">
              <Trophy className="w-5 h-5 mr-2 animate-wiggle" />
              Mastery
            </h3>
          </div>
          <div className="p-4">
            <div
              className="flex items-center p-3 rounded-lg mb-2 bg-blue-700 transform hover:scale-[1.02] transition-transform animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse-slow">
                <Check className="w-5 h-5 text-yellow-900" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Aquarium Starter</h4>
                <p className="text-xs text-blue-300">Create your first aquarium</p>
              </div>
              <div className="text-xs text-blue-300">Feb 16, 2025</div>
            </div>

            <div
              className="flex items-center p-3 rounded-lg mb-2 bg-blue-700 transform hover:scale-[1.02] transition-transform animate-fadeIn"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse-slow">
                <Check className="w-5 h-5 text-yellow-900" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Fish Breeder</h4>
                <p className="text-xs text-blue-300">Successfully breed 20 fish</p>
              </div>
            </div>

            <div
              className="flex items-center p-3 rounded-lg mb-2 bg-blue-900/50 transform hover:scale-[1.02] transition-transform animate-fadeIn"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-blue-950">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-blue-300">Legendary Hunter</h4>
                <p className="text-xs text-blue-300">Collect all legendary fish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
