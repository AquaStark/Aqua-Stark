"use client";

import { BubblesBackground } from "@/components/bubble-background";
import { FeaturedFish } from "@/components/landing/featured-fish";
import { FishStatusTips } from "@/components/landing/fish-status-tips";
import { HeroSection } from "@/components/landing/hero-section";
import { Navbar } from "@/components/landing/navbar";
import { ReadyToPlay } from "@/components/landing/ready-to-play";
import { Footer } from "@/components/layout/footer";
import { useBubbles } from "@/hooks/use-bubbles";

export default function LandingPage() {
  const bubbles = useBubbles({
    initialCount: 15,
    maxBubbles: 25,
    minSize: 6,
    maxSize: 30,
    minDuration: 8,
    maxDuration: 25,
    interval: 500,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-700 animated-background">
      <div className="water-movement"></div>
      <BubblesBackground bubbles={bubbles} />
      <Navbar />
      <main className="relative  container mx-auto px-4 py-8 flex flex-col items-center">
        <HeroSection />
        <FeaturedFish />
        <FishStatusTips />
        <ReadyToPlay />
      </main>

      <Footer />
    </div>
  );
}
