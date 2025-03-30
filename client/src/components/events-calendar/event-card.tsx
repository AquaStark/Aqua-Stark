"use client"

import { Bookmark, Calendar, Clock, Gift, Leaf, Sparkles, Tag, Trophy, Users } from "lucide-react"

// Moved utility functions directly into component
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
}

function formatTimeLeft(dateString: string): string {
  const targetDate = new Date(dateString)
  const now = new Date()

  const diffMs = targetDate.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays > 30) {
    const diffMonths = Math.floor(diffDays / 30)
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`
  } else {
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""}`
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`
    }
  }
}

interface EventCardProps {
  event: any
  onClick: () => void
  isPast?: boolean
}

export function EventCard({ event, onClick, isPast = false }: EventCardProps) {
  const getCategoryTag = (category: string) => {
    switch (category) {
      case "special":
        return {
          bg: "bg-purple-500",
          text: "Special",
          icon: <Sparkles className="w-4 h-4" />,
        }
      case "tournament":
        return {
          bg: "bg-yellow-500",
          text: "Tournament",
          icon: <Trophy className="w-4 h-4" />,
        }
      case "offer":
        return {
          bg: "bg-blue-400",
          text: "Offer",
          icon: <Tag className="w-4 h-4" />,
        }
      case "season":
        return {
          bg: "bg-green-500",
          text: "Season",
          icon: <Leaf className="w-4 h-4" />,
        }
      default:
        return {
          bg: "bg-gray-500",
          text: "Event",
          icon: <Calendar className="w-4 h-4" />,
        }
    }
  }

  const tag = getCategoryTag(event.category)

  // Modify the component to handle past events with no interactions
  if (isPast) {
    return (
      <div className="bg-blue-800/40 border border-blue-700/50 rounded-lg overflow-hidden cursor-default">
        <div className="relative h-40 2xl:h-60 bg-gray-200">
          <div className="absolute top-2 right-2">
            <span className={`${tag.bg} text-white px-2 py-0.5 flex gap-x-1 rounded-full text-xs font-medium`}>
              {tag.icon} {tag.text}
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/placeholder.svg?height=160&width=160" alt="" className="w-16 h-16" />
          </div>
          <div className="absolute bottom-0 left-0 w-full pl-4 pt-0.5 bg-gradient-to-b from-gray-200 via-gray-500 to-gray-600">
            <h3 className="font-bold text-white mb-1 text-sm">{event.title}</h3>
            <div className="text-xs text-blue-300 mb-2">Ended on {formatDate(event.endDate)}</div>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-blue-200 mr-1 text-xs">
                <Gift className="w-4 h-4 inline mr-1" />
                <span>{event.rewards.length} rewards</span>
              </span>
            </div>
            <div>
              <span className="text-xs text-blue-300/70 flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {event.participants} participants
              </span>
            </div>
          </div>
          <div className="mt-1 text-xs text-blue-300/70 flex items-center">
            <span className="bg-blue-700/40 px-2 py-0.5 rounded-full text-xs">Event completed</span>
            {event.progress === 100 && <span className="ml-1 text-green-400/70">✓ Completed</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-blue-800/40 border border-blue-700/50 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:transform hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative h-40 2xl:h-60 bg-gray-200">
        <div className="absolute top-2 right-2">
          <span className={`${tag.bg} text-white px-2 py-0.5 flex gap-x-1 rounded-full text-xs font-medium`}>
            {tag.icon} {tag.text}
          </span>
        </div>

        {new Date(event.startDate) <= new Date() && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
              Active
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/placeholder.svg?height=160&width=160" alt="" className="w-16 h-16" />
        </div>
        <div className="absolute bottom-0 left-0 w-full pl-4 pt-0.5 bg-gradient-to-b from-gray-200 via-gray-500 to-gray-600">
          <h3 className="font-bold text-white mb-1 text-sm">{event.title}</h3>
          {isPast ? (
            <div className="text-xs text-blue-300 mb-2">Ended on {formatDate(event.endDate)}</div>
          ) : (
            <div className="text-xs text-blue-300 mb-2 flex items-center">
              {new Date(event.startDate) > new Date() ? (
                <>
                  <span>Starts {formatDate(event.startDate)}</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Ends in {formatTimeLeft(event.endDate)}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center">
          <span className="text-blue-200 mr-1 text-xs">
            <Gift className="w-4 h-4" />
          </span>
          <span className="text-xs text-blue-200">{event.rewards.length} rewards</span>

          <>
            <span className="mx-1 text-blue-500">•</span>
            <span className="text-xs text-blue-200 flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {event.participants}
            </span>
          </>
        </div>

        <div className="flex justify-end">
          <button
            className="text-xs text-blue-600 p-1 rounded"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

