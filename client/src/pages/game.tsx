"use client";

import { useState, useCallback, useEffect } from "react";
import { GameHeader } from "@/components/game/game-header";
import { GameSidebarButtons } from "@/components/game/game-sidebar-buttons";
import { AquariumTabs } from "@/components/game/aquarium-tabs";
import { TipsPopup } from "@/components/game/tips-popup";
import { FishDisplay } from "@/components/game/fish-display";
import { MOCK_FISH, INITIAL_GAME_STATE } from "@/data/game-data";
import { useAquarium } from "@/hooks/use-aquarium";
import { useFishStats } from "@/hooks/use-fish-stats";
import { GameMenu } from "@/components/game/game-menu";
import { useBubbles } from "@/hooks/use-bubbles";
import { BubblesBackground } from "@/components/bubble-background";
import { Food } from "@/components/aquarium/food";
import { FoodType } from "@/types/game";
console.log("");
export default function GamePage() {
  const {
    happiness,
    food: fishFood,
    energy,
    updateFishStats,
  } = useFishStats(INITIAL_GAME_STATE);
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium();
  const [showMenu, setShowMenu] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [food, setFood] = useState<FoodType[]>([]);
  const [eatenFood, setEatenFood] = useState<number[]>([]);

  const bubbles = useBubbles({
    initialCount: 10,
    maxBubbles: 20,
    minSize: 6,
    maxSize: 30,
    minDuration: 10,
    maxDuration: 18,
    interval: 400,
  });

  const handleTipsToggle = () => {
    setShowTips(!showTips);
  };

  const handleFoodRenderOnMouseClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const boundingRect = event.currentTarget.getBoundingClientRect();
      const x =
        ((event.clientX - boundingRect.left) / boundingRect.width) * 100; // Percentage
      const y =
        ((event.clientY - boundingRect.top) / boundingRect.height) * 100; // Percentage

      const newFood: FoodType = {
        id: Date.now(),
        position: { x, y },
        createdAt: Date.now(),
      };

      setFood((prev) => [...prev, newFood]);
    },
    []
  );

  const handleFoodRenderOnClick = useCallback(() => {
    const randomX = Math.random() * 80 + 10;
    const y = 5;

    const newFood: FoodType = {
      id: Date.now(),
      position: { x: randomX, y },
      createdAt: Date.now(),
    };

    setFood((prev) => [...prev, newFood]);
  }, []);

  // Handle food being eaten
  const handleFoodEaten = useCallback((foodId: number) => {
    setEatenFood(prev => [...prev, foodId]);
    
    // Update fish stats when food is eaten
    updateFishStats(prev => ({
      ...prev,
      food: Math.min(prev.food + 10, 100), // Increase food stat by 10, max 100
      happiness: Math.min(prev.happiness + 5, 100), // Increase happiness by 5, max 100
      energy: Math.min(prev.energy + 5, 100), // Increase energy by 5, max 100
    }));

    // Remove food immediately
    setFood(prev => prev.filter(f => f.id !== foodId));
  }, [updateFishStats]);

  // Clean up eaten food state periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setFood((prev) => prev.filter((f) => now - f.createdAt < 5000));
      setEatenFood(prev => prev.filter(id => {
        const foodItem = food.find(f => f.id === id);
        return foodItem && now - foodItem.createdAt < 5000;
      }));
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, [food]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-[#005C99]"
      onClick={handleFoodRenderOnMouseClick}
    >
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
      <div className="absolute inset-0 z-10 cursor-pointer">
        <FishDisplay 
          fish={MOCK_FISH} 
          food={food} 
          onFoodEaten={handleFoodEaten}
        />

        {food.map((foodItem) => (
          <Food 
            key={foodItem.id} 
            food={foodItem} 
            isEaten={eatenFood.includes(foodItem.id)}
          />
        ))}
      </div>

      {/* Header */}
      <GameHeader
        happiness={happiness}
        food={fishFood}
        energy={energy}
        onMenuToggle={() => setShowMenu(!showMenu)}
      />

      {showMenu && <GameMenu show={showMenu} />}
      <GameSidebarButtons onFeed={handleFoodRenderOnClick} />

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
