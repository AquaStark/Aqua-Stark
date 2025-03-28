"use client";

import { X } from "lucide-react";
import type { Category, Topic } from "@/types/help-types";
import { renderTopicContent } from "@/components/help-center/content-renderer";

interface TopicContentProps {
  category?: Category;
  topic: Topic;
  onClose: () => void;
}

export default function TopicContent({ topic, onClose }: TopicContentProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{topic.title}</h2>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-blue-300 hover:bg-white/5 p-2 rounded-xl hover:text-white transition-colors"
        >
          <X className="h-5 w-5 " />
          <span>Close</span>
        </button>
      </div>

      <div className="text-white space-y-6">
        <h3 className="text-3xl font-bold">{topic.title}</h3>
        <div className="text-blue-100">{renderTopicContent(topic)}</div>
      </div>
    </div>
  );
}
