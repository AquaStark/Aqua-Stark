"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  categories,
  featuredTopics,
} from "@/data/help-center-data";
import BackToGameButton from "@/components/help-center/back-to-game-button";
import HelpCenterSidebar from "@/components/help-center/help-sidebar";
import HelpMainContent from "@/components/help-center/help-main-content";
import { BubblesBackground } from "@/components/bubble-background";
import { useBubbles } from "@/hooks/useBubbles";
import HelpFooter from "@/components/help-center/help-footer";

function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const bubbles = useBubbles({
    initialCount: 30,
    maxBubbles: 50,
    minSize: 10,
    maxSize: 60,
    minDuration: 8,
    maxDuration: 25,
    interval: 500,
  });

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveTopic(null);
  };

  const handleTopicClick = (topicId: string) => {
    setActiveTopic(topicId === activeTopic ? null : topicId);
  };

  const handleFeaturedTopicClick = (categoryId: string, topicId: string) => {
    setActiveCategory(categoryId);
    setActiveTopic(topicId);
  };

  const handleClose = () => {
    setActiveTopic(null);
  };

  const currentCategory = categories.find((cat) => cat.id === activeCategory);
  const currentTopic = currentCategory?.topics.find(
    (topic) => topic.id === activeTopic
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-700">
      <BubblesBackground bubbles={bubbles} className="absolute inset-0" />

      <div className="relative z-20 flex flex-col min-h-screen bg-transparent">
        {/* Header */}
        <header className="bg-blue-600 py-4 px-6 lg:px-10 xl:px-20">
          <div className="flex mx-auto container items-center justify-between">
            <div className="flex items-center space-x-10">
              <BackToGameButton />
              <h1 className="text-2xl font-bold text-white">
                Aqua Stark Help Center
              </h1>
            </div>
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="Search help topics..."
                className="w-full py-2 px-4 pr-10 rounded-md bg-transparent text-white border border-white/40 placeholder-blue-300 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-blue-300" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="mx-auto container flex p-4 px-6 lg:px-10 xl:px-20 gap-8">
          <HelpCenterSidebar
            categories={categories}
            featuredTopics={featuredTopics}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
            onFeaturedTopicClick={handleFeaturedTopicClick}
          />

          <HelpMainContent
            currentCategory={currentCategory}
            currentTopic={currentTopic}
            activeTopic={activeTopic}
            onTopicClick={handleTopicClick}
            onClose={handleClose}
          />
        </div>

        <HelpFooter />
      </div>
    </div>
  );
}

export default HelpCenter;
