import React, { useRef, useState, useCallback, useEffect } from "react";
import type { FishType } from "@/types/game";
import { useFishMovement } from "@/hooks/use-fish-movement";
import { FishDisplay } from "./fish-display";
import { Food } from "@/components/food/Food";
import { FoodParticles } from "@/components/food/FoodParticles";
import { useFeedingSystem } from "@/systems/feeding-system";
import type { FoodItem } from "@/types/food";

interface FeedingAquariumProps {
  fish: FishType[];
  feedingSystem: ReturnType<typeof useFeedingSystem>;
  containerWidth?: number;
  containerHeight?: number;
}

export function FeedingAquarium({
  fish,
  feedingSystem,
  containerWidth = 1000,
  containerHeight = 600,
}: FeedingAquariumProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: containerWidth,
    height: containerHeight,
  });

  useEffect(() => {
    if (feedingSystem && feedingSystem.updateAquariumBounds) {
      feedingSystem.updateAquariumBounds(dimensions);
    }
  }, [dimensions, feedingSystem]);

  const generateCenteredPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 10 + Math.random() * 10;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  const fishWithInitialPosition = fish.map((f, i) => ({
    ...f,
    position:
      f.position && (f.position.x !== 0 || f.position.y !== 0)
        ? f.position
        : generateCenteredPosition(i, fish.length),
  }));

  const fishWithMovement = useFishMovement(fishWithInitialPosition, {
    aquariumBounds: dimensions,
    foods: feedingSystem.foods,
    onFoodConsumed: feedingSystem.handleFoodConsumed,
  }).map(state => ({
    ...state,
    name: fishWithInitialPosition.find(f => f.id === state.id)?.name || "Unknown Fish",
    image: fishWithInitialPosition.find(f => f.id === state.id)?.image || "/fish/fish1.png",
    rarity: fishWithInitialPosition.find(f => f.id === state.id)?.rarity || "Common",
    generation: fishWithInitialPosition.find(f => f.id === state.id)?.generation || 1,
  }));

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector(".fish-container");
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !feedingSystem.isFeeding) return;
      const rect = containerRef.current.getBoundingClientRect();
      const spawned = feedingSystem.handleFeedClick(event.clientX, event.clientY, rect);
      if (!spawned && feedingSystem.isFeeding) {
        console.log("Food spawning on cooldown");
      }
    },
    [feedingSystem]
  );

  useEffect(() => {
    const interval = setInterval(feedingSystem.updateFoodAnimations, 100);
    return () => clearInterval(interval);
  }, [feedingSystem.updateFoodAnimations]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full fish-container overflow-hidden"
      onClick={handleContainerClick}
      style={{
        cursor: feedingSystem.isFeeding ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      <FishDisplay fish={fishWithMovement} />
      {feedingSystem.foods.map((food: FoodItem) => (
        <Food key={food.id} food={food} aquariumBounds={dimensions} />
      ))}
      {feedingSystem.particleEffects.map((effect) => (
        <FoodParticles
          key={effect.id}
          position={effect.position}
          trigger={effect.trigger}
          onComplete={() => feedingSystem.handleParticleComplete(effect.id)}
        />
      ))}
    </div>
  );
} 