"use client";

import { ChevronRight, X } from "lucide-react";
import type { Category, Topic } from "@/types/help-types";
import { renderTopicContent } from "@/components/help-center/content-renderer";
import { getIcon } from "@/components/help-center/icon-mapper";

interface HelpMainContentProps {
  currentCategory: Category | undefined;
  currentTopic: Topic | undefined;
  activeTopic: string | null;
  onTopicClick: (topicId: string) => void;
  onClose: () => void;
}

export default function HelpMainContent({
  currentCategory,
  currentTopic,
  activeTopic,
  onTopicClick,
  onClose,
}: HelpMainContentProps) {
  return (
    <div className="flex-1 backdrop-blur-sm bg-blue-700/70 h-fit rounded-lg p-6">
      {activeTopic && currentTopic ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {currentTopic.title}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center text-blue-300 hover:text-white transition-colors"
            >
              <X className="h-5 w-5 mr-1" />
              <span>Close</span>
            </button>
          </div>

          <div className="text-white space-y-6">
            <h3 className="text-2xl font-bold">{currentTopic.title}</h3>
            <div className="text-blue-100">
              {renderTopicContent(currentTopic)}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {currentCategory?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentCategory?.topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white/10 rounded-lg p-4 cursor-pointer hover:scale-[1.03] duration-200"
                onClick={() => onTopicClick(topic.id)}
              >
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-white">{getIcon(topic.icon)}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {topic.title}
                      </h3>
                      <p className="text-blue-200">{topic.description}</p>
                    </div>
                  </div>
                  <div className="ml-auto text-blue-300">
                    <ChevronRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
