"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BubblesBackground } from "@/components/bubble-background";
import { useBubbles } from "@/hooks/use-bubbles";
import { PageHeader } from "@/components/layout/page-header";
import { Footer } from "@/components/layout/footer";
import { CommunityTabs } from "@/components/community/community-tabs";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("gallery");
  const bubbles = useBubbles();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background">
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title="Aqua Stark Community"
        backTo="/game"
        backText="Back to Game"
        rightContent={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search community..."
                className="pl-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-300"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <Users className="w-4 h-4 mr-2" />
              My Friends
            </Button>
          </div>
        }
      />

      <main className="relative z-20 flex flex-col items-center px-4 py-8 mx-auto max-w-7xl">
        <CommunityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>

      <Footer />
    </div>
  );
}
