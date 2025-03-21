"use client"

import type { FeaturedTopic } from "@/types/help-types"

interface FeaturedTopicsProps {
  topics: FeaturedTopic[]
  onTopicClick: (categoryId: string, topicId: string) => void
}

export default function FeaturedTopics({ topics, onTopicClick }: FeaturedTopicsProps) {
  return (
    <div className="bg-blue-800/20 backdrop-blur-sm rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">Featured Topics</h2>
      <div className="space-y-2">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`p-3 rounded-md cursor-pointer ${topic.bgColor} hover:opacity-80 duration-300`}
            onClick={() => onTopicClick(topic.categoryId, topic.id)}
          >
            <div className="flex items-start space-x-2">
              <div className="mt-1 text-white">{topic.icon}</div>
              <div>
                <h3 className="font-semibold text-white">{topic.title}</h3>
                <p className="text-sm text-white/80">{topic.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

