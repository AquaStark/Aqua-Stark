import { CheckCircle, Layers, Star, Award } from "lucide-react"

interface Achievement {
  id: number
  title: string
  description: string
  current: number
  total: number
  completed: boolean
}

interface CollectionAchievementsProps {
  achievements: Achievement[]
}

export default function CollectionAchievements({ achievements }: CollectionAchievementsProps) {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-white">Collection Achievements</h2>
      <hr className="mb-6 border-blue-700/50" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className="group rounded-lg border border-blue-700 bg-blue-900/30 p-4 backdrop-blur-sm transition-all duration-300 ease-in-out cursor-pointer hover:bg-blue-800/50 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-blue-600/20 hover:border-blue-500"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-white group-hover:text-blue-200 transition-colors duration-300">{achievement.title}</h3>
                <p className="text-sm text-blue-300">{achievement.description}</p>
              </div>
              {achievement.completed ? (
                <CheckCircle className="h-6 w-6 text-green-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
              ) : (
                <>
                  {achievement.title === "Beginner Collector" && <Award className="h-6 w-6 text-blue-400 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />}
                  {achievement.title === "Intermediate Collector" && <Layers className="h-6 w-6 text-blue-400 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />}
                  {achievement.title === "Rare Finder" && <Star className="h-6 w-6 text-blue-400 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />}
                  {achievement.title === "Legendary Discovery" && <Award className="h-6 w-6 text-orange-400 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />}
                </>
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-300">Progress</span>
                <span className="text-xs text-blue-300">
                  {achievement.current}/{achievement.total}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-blue-950 group-hover:bg-blue-900 transition-colors duration-300">
                <div
                  className={`h-full rounded-full ${achievement.completed ? "bg-green-500" : "bg-blue-500"} transition-all duration-700 ease-out`}
                  style={{
                    width: `${(achievement.current / achievement.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
