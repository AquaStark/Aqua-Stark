"use client";

import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs } from "@/components/ui/tabs";
import EncyclopediaTabs from "@/components/encyclopedia/encyclopedia-tabs";
import { useEncyclopedia } from "@/hooks/use-encyclopedia";
import { BubblesBackground } from "@/components/bubble-background";
import { useBubbles } from "@/hooks/use-bubbles";

export default function EncyclopediaPage() {
  const { discoveredSpecies, totalSpecies, activeTab, setActiveTab } =
    useEncyclopedia();

  const bubbles = useBubbles();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background">
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title="Aqua Stark Encyclopedia"
        backTo="/game"
        backText="Back to Game"
        rightContent={
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/30 border border-blue-300 text-sm font-medium text-white shadow-sm backdrop-blur-md">
            <span className="mr-1">Discovered:</span>
            <span className="font-semibold text-blue-100">
              {discoveredSpecies}
            </span>
            <span className="mx-1 text-blue-300">/</span>
            <span className="text-blue-100">{totalSpecies}</span>
          </div>
        }
      />

      <main className="relative z-20 flex flex-col items-center px-4 py-8 mx-auto max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <EncyclopediaTabs />
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
