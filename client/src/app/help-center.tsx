"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import {
  categories,
  featuredTopics,
} from "@/lib/constants/mock-data/mock-help-center";
import BackToGameButton from "@/components/back-to-game-button";
import HelpCategories from "@/components/help-categories";
import FeaturedTopics from "@/components/featured-topics";
import TopicContent from "@/components/topic-content";

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
  const [bubbles, setBubbles] = useState<
    Array<{ id: number; size: number; left: number; animationDuration: number }>
  >([]);
  const [backgroundBubbles, setBackgroundBubbles] = useState<
    Array<{
      id: number;
      size: number;
      left: number;
      duration: number;
      delay: number;
      drift: number;
    }>
  >([]);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      size: number;
      top: number;
      left: number;
      duration: number;
      delay: number;
      floatX: number;
      floatY: number;
    }>
  >([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 30 + 10,
      left: Math.random() * 100,
      animationDuration: Math.random() * 15 + 5,
    }));
    setBubbles(newBubbles);

    const newBackgroundBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 40,
      left: Math.random() * 100,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 100,
    }));
    setBackgroundBubbles(newBackgroundBubbles);

    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      floatX: (Math.random() - 0.5) * 200,
      floatY: (Math.random() - 0.5) * 200,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-700 animated-background">
      <div className="water-movement"></div>
      {backgroundBubbles.map((bubble) => (
        <div
          key={`bg-bubble-${bubble.id}`}
          className="background-bubble"
          style={
            {
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              bottom: "-100px",
              "--duration": `${bubble.duration}s`,
              "--delay": `${bubble.delay}s`,
              "--drift": `${bubble.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
      {particles.map((particle) => (
        <div
          key={`particle-${particle.id}`}
          className="floating-particle"
          style={
            {
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              "--float-duration": `${particle.duration}s`,
              "--float-delay": `${particle.delay}s`,
              "--float-x": `${particle.floatX}px`,
              "--float-y": `${particle.floatY}px`,
            } as React.CSSProperties
          }
        />
      ))}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={
            {
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              "--duration": `${bubble.animationDuration}s`,
            } as React.CSSProperties
          }
        />
      ))}
      <div className=" flex relative z-20 flex-col min-h-screen  bg-transparent">
        {/* Header */}
        <header className="bg-blue-600  py-4 px-6 lg:px-10 xl:px-20 ">
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
                className="w-full py-2 px-4 pr-10 rounded-md bg-transparent text-white border border-white/40 placeholder-blue-300 focus:outline-none "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-blue-300" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="mx-auto container flex flex- p-4 px-6 lg:px-10 xl:px-20 gap-8">
          {/* Left sidebar */}
          <div className="w-64 flex-shrink-0 space-y-6">
            <HelpCategories
              categories={categories}
              activeCategory={activeCategory}
              onCategoryClick={handleCategoryClick}
            />
            <FeaturedTopics
              topics={featuredTopics}
              onTopicClick={handleFeaturedTopicClick}
            />
          </div>

          {/* Main content area */}
          <div className="flex-1 backdrop-blur-sm bg-blue-700/70 h-fit rounded-lg p-6">
            {activeTopic && currentTopic ? (
              <TopicContent
                category={currentCategory!}
                topic={currentTopic}
                onClose={handleClose}
              />
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  {currentCategory?.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentCategory?.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="bg-white/10 rounded-lg p-4 cursor-pointer hover:scale-[1.03] duration-200  "
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <div className="flex items-center justify-between space-x-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-white">{topic.icon}</div>
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
        </div>

        {/* Footer */}
        <footer className="backdrop-blur-sm py-4 px-6 lg:px-10 xl:px-20 text-center bg-black/20 text-white/80  text-sm">
          <p>© 2025 Aqua Stark - All rights reserved</p>
          <p>
            Need more help? Contact our support team or visit the community
            forums.
          </p>
        </footer>
      </div>{" "}
    </div>
  );
}
