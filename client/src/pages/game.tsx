"use client";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import { GameHeader } from "@/components/game/game-header";
import { GameMenu } from "@/components/game/game-menu";
import { GameSidebarButtons } from "@/components/game/game-sidebar-buttons";
import { AquariumTabs } from "@/components/game/aquarium-tabs";
import { TipsPopup } from "@/components/game/tips-popup";
import { BubblesBackground } from "@/components/bubble-background"; // Fixed import path
import { useBubbles } from "@/hooks/use-bubbles";
import { useFishStats } from "@/hooks/use-fish-stats";
import { useAquarium } from "@/hooks/use-aquarium";
import { motion } from "framer-motion";
import type { FishType } from "@/types/game";
import { useActiveAquarium } from "../store/active-aquarium";
import { initialAquariums } from "@/data/mock-aquarium";
import { useDirtSystemFixed as useDirtSystem } from "@/hooks/use-dirt-system-fixed";
import { useFeedingSystem } from "@/systems/feeding-system";
import { FeedFishButton } from "@/components/game/feed-fish-button";
import { FeedingAquarium } from "@/components/game/feeding-aquarium";
import DirtOverlay from "../components/dirt/dirt-overlay";
import DirtDebugger from "../components/dirt/dirt-debugger";
import { DirtSpot as NewDirtSpot, DirtShape } from "../components/dirt/types";

// Create initial game state locally since it doesn't exist
const INITIAL_GAME_STATE = {
  happiness: 85,
  food: 70,
  energy: 90,
};

export default function GamePage() {
  const activeAquariumId = useActiveAquarium((s) => s.activeAquariumId);
  const aquarium =
    initialAquariums.find((a) => a.id.toString() === activeAquariumId) ||
    initialAquariums[0];
  const { happiness, food, energy } = useFishStats(INITIAL_GAME_STATE);
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium();
  const [showMenu, setShowMenu] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const location = useLocation();

  // Initialize dirt system
  const dirtSystem = useDirtSystem({
    spawnInterval: 5000, // 5 seconds
    maxSpots: 5,
    aquariumBounds: {
      x: 0,
      y: 0,
      width: 2000,
      height: 1000,
    },
    spawnChance: 0.7, // 70% chance
  });

  // Convert old dirt spots to new format
  const convertedSpots: NewDirtSpot[] = dirtSystem.spots.map((spot) => ({
    id: spot.id.toString(), // Convert number to string
    x: spot.position.x,
    y: spot.position.y,
    type: spot.type,
    shape: DirtShape.CIRCLE, // Default shape
    size: spot.size,
    opacity: spot.opacity,
    createdAt: spot.createdAt,
    isBeingCleaned: spot.isRemoving,
  }));

  // Create adapter object to match DirtDebugger interface
  const dirtSystemAdapter = {
    spots: convertedSpots,
    isSpawnerActive: dirtSystem.isSpawnerActive,
    totalCreated: dirtSystem.totalSpotsCreated,
    totalRemoved: dirtSystem.totalSpotsRemoved,
    cleanliness: dirtSystem.cleanlinessScore,
    toggleSpawner: dirtSystem.toggleSpawner,
    forceSpawn: () => {
      dirtSystem.forceSpawnSpot();
    },
    clearAll: dirtSystem.clearAllSpots,
  };

  // Handle dirt removal with ID conversion
  const handleRemoveSpot = (id: string) => {
    const numericId = parseInt(id, 10);
    dirtSystem.removeDirtSpot(numericId);
  };

  const bubbles = useBubbles({
    initialCount: 10,
    maxBubbles: 20,
    minSize: 6,
    maxSize: 30,
    minDuration: 10,
    maxDuration: 18,
    interval: 400,
  });

  // Initialize feeding system - use reasonable default bounds that will be updated by FishDisplay
  const feedingSystem = useFeedingSystem({
    aquariumBounds: {
      width: 1000,
      height: 600,
    },
    maxFoodsPerSecond: 3,
    foodLifetime: 10,
    attractionRadius: 50,
  });

  const handleTipsToggle = () => {
    setShowTips(!showTips);
  };

  // Parse fish species from URL param
  const searchParams = new URLSearchParams(location.search);
  const fishesParam = searchParams.get("fishes");
  const fishFromUrl = JSON.parse(
    decodeURIComponent(fishesParam || "[]")
  ) as string[];

  // Match species to mock data
  const speciesToFishData = {
    AngelFish: {
      image: "/fish/fish1.png",
      name: "Blue Striped Fish",
      rarity: "Rare",
      generation: 1,
    },
    GoldFish: {
      image: "/fish/fish2.png",
      name: "Tropical Coral Fish",
      rarity: "Uncommon",
      generation: 2,
    },
    Betta: {
      image: "/fish/fish3.png",
      name: "Orange Tropical Fish",
      rarity: "Epic",
      generation: 1,
    },
    NeonTetra: {
      image: "/fish/fish4.png",
      name: "Scarlet Fin",
      rarity: "Legendary",
      generation: 1,
    },
  };

  // Create fish objects from URL parameters
  const fishObjects: FishType[] = fishFromUrl.map((species, index) => {
    const data = speciesToFishData[
      species as keyof typeof speciesToFishData
    ] || {
      image: "/fish/fish1.png",
      name: "Unknown Fish",
      rarity: "Common",
      generation: 1,
    };

    return {
      id: index,
      name: data.name,
      image: data.image,
      rarity: data.rarity,
      generation: data.generation,
      position: { x: 0, y: 0 },
    };
  });

  // Use fish from URL if available, otherwise use selected aquarium fish
  const displayFish =
    fishObjects.length > 0
      ? fishObjects
      : aquarium.fishes.map((fish) => ({
          ...fish,
          position: { x: 0, y: 0 }, // Will be repositioned by FishDisplay
        }));

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#005C99]">
      {/* Background */}
      <img
        src="/backgrounds/background2.png"
        alt="Underwater Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Bubbles */}
      <BubblesBackground
        bubbles={bubbles}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Effects */}
      <div className="absolute inset-0 light-rays z-20"></div>
      <div className="absolute inset-0 animate-water-movement z-20"></div>

      {/* Fish */}
      <motion.div
        key={aquarium.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className="relative z-20 w-full h-full"
      >
        <FeedingAquarium fish={displayFish} feedingSystem={feedingSystem} />
      </motion.div>

      {/* Dirt System */}
      <DirtOverlay spots={convertedSpots} onRemoveSpot={handleRemoveSpot} />

      {/* Dirt Debugger */}
      <DirtDebugger dirtSystem={dirtSystemAdapter} />

      {/* Header */}
      <GameHeader
        happiness={happiness}
        food={food}
        energy={energy}
        onMenuToggle={() => setShowMenu(!showMenu)}
      />

      {showMenu && <GameMenu show={showMenu} />}

      <GameSidebarButtons />

      {/* Click to Feed Instructions - Under Header */}
      {!feedingSystem.isFeeding && (
        <div className="absolute top-[9rem] left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-black/50 text-white text-sm px-4 py-2 rounded-lg border border-gray-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <span>🐠</span>
              <span>Click "Feed Fish" to start feeding your aquarium</span>
            </div>
          </div>
        </div>
      )}

      {/* Feed Fish Button - Bottom Center */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
        <FeedFishButton
          isFeeding={feedingSystem.isFeeding}
          timeRemaining={feedingSystem.getFeedingStatus().timeRemaining}
          onStartFeeding={() => feedingSystem.startFeeding(30000)} // 30 seconds
          onStopFeeding={feedingSystem.stopFeeding}
        />
      </div>

      {/* Tips */}
      <div className="absolute bottom-0 right-4 mb-4 z-30">
        <TipsPopup
          show={showTips}
          onClose={() => setShowTips(false)}
          onToggle={handleTipsToggle}
        />
      </div>

      {/* Tabs */}
      <AquariumTabs
        aquariums={aquariums}
        selectedAquarium={selectedAquarium}
        onAquariumSelect={handleAquariumChange}
      />
    </div>
  );
}
