"use client";

import { BubblesBackground } from "@/components/bubble-background";
import { FeaturedFish } from "@/components/landing/featured-fish";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { Navbar } from "@/components/landing/navbar";
import { useBubbles } from "@/hooks/use-bubbles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LandingPage() {
  const bubbles = useBubbles({
    initialCount: 12,
    maxBubbles: 20,
    minSize: 4,
    maxSize: 20,
    minDuration: 8,
    maxDuration: 25,
    interval: 800,
  });

  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleSidebarClick = (action: string) => {
    setActiveButton(action);
    switch (action) {
      case "start":
        navigate("/start");
        break;
      case "tutorial":
        toast.info("Tutorial coming soon!");
        break;
      case "settings":
        toast.info("Settings coming soon!");
        break;
      case "credits":
        toast.info("Credits coming soon!");
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/backgrounds/initaial-background.webp")',
          filter: 'brightness(0.8)'
        }}
      />
      
      {/* Water movement effect */}
      <div className="water-movement"></div>
      
      {/* Bubbles */}
      <BubblesBackground bubbles={bubbles} />

      {/* Top navbar/HUD - Compact */}
      <div className="relative z-30 h-18 sm:h-22 md:h-24 lg:h-28">
        <Navbar />
      </div>

      {/* Main layout - Using CSS Grid for perfect control */}
      <div className="relative z-20 h-[calc(100vh-4.5rem)] sm:h-[calc(100vh-5.5rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)] grid grid-cols-[auto_1fr] gap-2 sm:gap-4 p-2 sm:p-4">
        {/* Sidebar - Vertical Stack */}
        <aside className="flex flex-col justify-center gap-3 sm:gap-4">
          <button
            onClick={() => handleSidebarClick("start")}
            className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-blue-300 flex items-center justify-center ${
              activeButton === "start" ? "scale-105 ring-2 sm:ring-3 ring-blue-300" : ""
            }`}
            title="Start Game"
          >
            <span className="text-white text-sm sm:text-base md:text-lg font-bold whitespace-nowrap">Start</span>
          </button>

          <button
            onClick={() => handleSidebarClick("tutorial")}
            className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl bg-gradient-to-b from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-purple-300 flex items-center justify-center ${
              activeButton === "tutorial" ? "scale-105 ring-2 sm:ring-3 ring-purple-300" : ""
            }`}
            title="Tutorial"
          >
            <span className="text-white text-sm sm:text-base md:text-lg font-bold whitespace-nowrap">Tutorial</span>
          </button>

          <button
            onClick={() => handleSidebarClick("settings")}
            className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl bg-gradient-to-b from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-gray-300 flex items-center justify-center ${
              activeButton === "settings" ? "scale-105 ring-2 sm:ring-3 ring-gray-300" : ""
            }`}
            title="Settings"
          >
            <span className="text-white text-sm sm:text-base md:text-lg font-bold whitespace-nowrap">Settings</span>
          </button>

          <button
            onClick={() => handleSidebarClick("credits")}
            className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-yellow-300 flex items-center justify-center ${
              activeButton === "credits" ? "scale-105 ring-2 sm:ring-3 ring-yellow-300" : ""
            }`}
            title="Credits"
          >
            <span className="text-white text-sm sm:text-base md:text-lg font-bold whitespace-nowrap">Credits</span>
          </button>
        </aside>

        {/* Main content - Also using grid for precise control */}
        <main className="grid grid-rows-[auto_1fr_auto] gap-2 sm:gap-4 min-h-0">
          {/* Hero section - Fixed height */}
          <div className="flex items-center justify-center">
            <HeroSection />
          </div>

          {/* Featured fish section - Takes remaining space */}
          <div className="flex items-center justify-center min-h-0">
            <FeaturedFish />
          </div>

          {/* Footer - Fixed height */}
          <Footer />
        </main>
      </div>
    </div>
  );
}