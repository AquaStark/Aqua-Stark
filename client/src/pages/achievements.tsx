import { useState } from "react";
import { BubblesBackground } from "@/components/bubble-background";
import { useBubbles } from "@/hooks/use-bubbles";
import { PageHeader } from "@/components/layout/page-header";
import { Footer } from "@/components/layout/footer";
import { Trophy } from "lucide-react";
import { AchievementsTabs } from "@/components/achievements/achievements-tabs";

export default function AchievementsPage() {
  const bubbles = useBubbles();
  const [activeTab, setActiveTab] = useState("achievements");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background">
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title="Achievements & Rewards"
        backTo="/"
        backText="Back to Game"
        rightContent={
          <div className="flex items-center px-3 py-1 sm:px-4 sm:py-2 border rounded-full bg-blue-700/50 border-blue-400/50">
            <Trophy className="mr-1 sm:mr-2 text-yellow-400" size={14} />
            <span className="font-bold text-xs sm:text-sm text-white">2/8</span>
          </div>
        }
      />

      <main className="relative z-20 flex flex-col items-center px-4 py-8 mx-auto max-w-7xl">
        <AchievementsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>

      <Footer />
    </div>
  );
}
