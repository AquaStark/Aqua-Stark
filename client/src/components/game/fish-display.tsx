"use client";

import type React from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import type { FishType } from "@/types/game";
import { useFishMovement } from "@/hooks/use-fish-movement";
import { Fish } from "@/components/aquarium/fish";
import { useFeedingSystem } from "@/systems/feeding-system";
import { Food } from "@/components/food/Food";
import { FoodParticles } from "@/components/food/FoodParticles";

interface FishDisplayProps {
  fish: FishType[];
  containerWidth?: number;
  containerHeight?: number;
  feedingSystem?: ReturnType<typeof useFeedingSystem>;
}

export function FishDisplay({
  fish,
  containerWidth = 1000,
  containerHeight = 600,
  feedingSystem,
}: FishDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: containerWidth,
    height: containerHeight,
  });

  // Use external feeding system if provided, otherwise create internal one
  const internalFeedingSystem = useFeedingSystem({
    aquariumBounds: dimensions,
    maxFoodsPerSecond: 3,
    foodLifetime: 10,
    attractionRadius: 50,
  });

  const activeFeedingSystem = feedingSystem || internalFeedingSystem;

  // Update external feeding system bounds when dimensions change
  useEffect(() => {
    if (feedingSystem && feedingSystem.updateAquariumBounds) {
      feedingSystem.updateAquariumBounds(dimensions);
    }
  }, [dimensions, feedingSystem]);

  const {
    foods,
    updateFoodAnimations,
    isFeeding,
    particleEffects,
    handleFeedClick,
    handleFoodConsumed,
    handleParticleComplete,
    getFeedingStatus,
  } = activeFeedingSystem;

  // Generate centered position for fish
  const generateCenteredPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 10 + Math.random() * 10; // 10–20% de dispersión
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

  // Enhanced fish movement with food system
  const fishWithMovement = useFishMovement(fishWithInitialPosition, {
    aquariumBounds: dimensions,
    foods, // Pass foods to fish movement
    onFoodConsumed: handleFoodConsumed, // Pass consumption handler
  });

  // Handle container resize
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

  // Handle aquarium clicks (only when feeding is active)
  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !isFeeding) return;

      const rect = containerRef.current.getBoundingClientRect();
      const spawned = handleFeedClick(event.clientX, event.clientY, rect);

      if (!spawned && isFeeding) {
        console.log("Food spawning on cooldown");
      }
    },
    [isFeeding, handleFeedClick]
  );

  // Update food animations
  useEffect(() => {
    const interval = setInterval(updateFoodAnimations, 100);
    return () => clearInterval(interval);
  }, [updateFoodAnimations]);

  const feedingStatus = getFeedingStatus();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full fish-container overflow-hidden"
      onClick={handleContainerClick}
      style={{
        cursor: isFeeding ? "crosshair" : "default",
        userSelect: "none",
      }}
    >
      {/* Render fish with your existing Fish component */}
      {fishWithMovement.map((fishState) => {
        const fishData = fishWithInitialPosition.find(
          (f) => f.id === fishState.id
        );
        if (!fishData) return null;

        return (
          <Fish
            key={fishData.id}
            fish={fishData}
            position={fishState.position}
            facingLeft={fishState.facingLeft}
            behaviorState={fishState.behaviorState}
            // Add feeding visual enhancement
            style={{
              filter:
                fishState.behaviorState === "feeding"
                  ? "brightness(1.2) drop-shadow(0 0 8px rgba(255,215,0,0.6))"
                  : "none",
            }}
          />
        );
      })}

      {/* Render food items */}
      {foods.map((food) => (
        <Food key={food.id} food={food} aquariumBounds={dimensions} />
      ))}

      {/* Render particle effects */}
      {particleEffects.map((effect) => (
        <FoodParticles
          key={effect.id}
          position={effect.position}
          trigger={effect.trigger}
          onComplete={() => handleParticleComplete(effect.id)}
        />
      ))}

    </div>
  );
}
