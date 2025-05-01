"use client";

import { Search } from "lucide-react";
import { featuredTopics } from "@/data/help-center-data";
import HelpCenterSidebar from "@/components/help-center/help-sidebar";
import HelpMainContent from "@/components/help-center/help-main-content";
import { BubblesBackground } from "@/components/bubble-background";
import { useBubbles } from "@/hooks/use-bubbles";
import { PageHeader } from "@/components/layout/page-header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { useHelpCenter } from "@/hooks/use-help-center";

function HelpCenter() {
  const {
    activeCategory,
    activeTopic,
    searchQuery,
    currentCategory,
    currentTopic,
    setSearchQuery,
    handleCategoryClick,
    handleTopicClick,
    handleFeaturedTopicClick,
    handleClose,
  } = useHelpCenter();

  const bubbles = useBubbles();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background">
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title="Aqua Stark Help Center"
        backTo="/game"
        backText="Back to Game"
        rightContent={
          <div className="relative w-full max-w-sm">
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-blue-300" />
            <Input
              type="text"
              placeholder="Search help topics..."
              className="pr-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        }
      />

      <main className="relative z-20 mx-auto container flex flex-col md:flex-row px-4 py-8 gap-8 max-w-7xl">
        <HelpCenterSidebar
          categories={currentCategory ? [currentCategory] : []}
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
      </main>

      <Footer />
    </div>
  );
}

export default HelpCenter;
