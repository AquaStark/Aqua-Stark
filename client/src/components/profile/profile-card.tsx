import { Clock, Fish, Star, Medal } from "lucide-react"

interface ProfileCardProps {
  username: string
  level: number
  joinDate: string
  experience: {
    current: number
    total: number
  }
  stats: {
    playTime: string
    fishCollected: number
    totalFish: number
    specialFish: number
    achievements: {
      completed: number
      total: number
    }
  }
}

export function ProfileCard({ username, level, joinDate, experience, stats }: ProfileCardProps) {
  return (
    <div className="bg-blue-800 rounded-xl p-6 mb-6 shadow-lg animate-fadeIn" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-start">
        {/* Level Circle */}
        <div className="relative mr-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center animate-pulse-slow">
            <div className="text-center">
              <div className="text-4xl font-bold">{level}</div>
              <div className="text-xs">LEVEL</div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-1 animate-bounce-small">
            <Star className="w-4 h-4 text-yellow-800" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{username}</h2>
          <p className="text-blue-200 text-sm mb-4">Joined {joinDate}</p>

          {/* Experience Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Experience</span>
              <span>
                {experience.current} / {experience.total} XP
              </span>
            </div>
            <div className="h-2 bg-blue-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-300 animate-expandWidth"
                style={{ width: `${(experience.current / experience.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                icon: <Clock className="w-5 h-5 text-blue-300" />,
                label: "Play Time",
                value: stats.playTime,
                delay: 0.3,
              },
              {
                icon: <Fish className="w-5 h-5 text-blue-300" />,
                label: "Fish Collected",
                value: `${stats.fishCollected}/${stats.totalFish}`,
                delay: 0.4,
              },
              {
                icon: <Star className="w-5 h-5 text-blue-300" />,
                label: "Special Fish",
                value: stats.specialFish,
                delay: 0.5,
              },
              {
                icon: <Medal className="w-5 h-5 text-blue-300" />,
                label: "Achievements",
                value: `${stats.achievements.completed}/${stats.achievements.total}`,
                delay: 0.6,
              },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-fadeIn" style={{ animationDelay: `${stat.delay}s` }}>
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
                <div className="font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
