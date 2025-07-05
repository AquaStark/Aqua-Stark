"use client";

import type React from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import type { FishType } from "@/types/game";
import { useFishMovement } from "@/hooks/use-fish-movement";
import { Fish } from "@/components/aquarium/fish";
import { useFoodSystem } from "@/hooks/use-food-system";
import { Food } from "@/components/food/food";
import { FoodParticles } from "@/components/food/FoodParticles";

interface FishDisplayProps {
  fish: FishType[];
  containerWidth?: number;
  containerHeight?: number;
}

export function FishDisplay({
  fish,
  containerWidth = 1000,
  containerHeight = 600,
}: FishDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: containerWidth,
    height: containerHeight,
  });

  // State for particle effects
  const [particleEffects, setParticleEffects] = useState<
    Array<{
      id: number;
      position: { x: number; y: number };
      trigger: boolean;
    }>
  >([]);

  // Initialize food system
  const { foods, spawnFood, consumeFood, updateFoodAnimations, canSpawnFood } =
    useFoodSystem({
      aquariumBounds: dimensions,
      maxFoodsPerSecond: 3,
      foodLifetime: 10,
      attractionRadius: 50,
    });

  // Generate centered position for fish (your existing logic)
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

  // Handle food consumption with particle effects
  const handleFoodConsumed = useCallback(
    (foodId: number) => {
      const consumedFood = foods.find((f) => f.id === foodId);
      if (consumedFood) {
        // Add particle effect
        setParticleEffects((prev) => [
          ...prev,
          {
            id: foodId,
            position: consumedFood.position,
            trigger: true,
          },
        ]);

        // Consume the food
        consumeFood(foodId);
      }
    },
    [foods, consumeFood]
  );

  // Enhanced fish movement with food system
  const fishWithMovement = useFishMovement(fishWithInitialPosition, {
    aquariumBounds: dimensions,
    foods, // Pass foods to fish movement
    onFoodConsumed: handleFoodConsumed, // Pass consumption handler
  });

  // Handle container resize (your existing logic)
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

  // Handle aquarium clicks to spawn food
  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Try to spawn food at click position
      const spawned = spawnFood(clickX, clickY);

      if (!spawned) {
        console.log("Food spawning on cooldown");
      }
    },
    [spawnFood]
  );

  // Clean up completed particle effects
  const handleParticleComplete = useCallback((foodId: number) => {
    setParticleEffects((prev) => prev.filter((effect) => effect.id !== foodId));
  }, []);

  // Update food animations
  useEffect(() => {
    const interval = setInterval(updateFoodAnimations, 100);
    return () => clearInterval(interval);
  }, [updateFoodAnimations]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full fish-container overflow-hidden"
      onClick={handleContainerClick}
      style={{
        cursor: canSpawnFood ? "crosshair" : "wait",
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

      {/* Feeding instructions overlay */}
      <div className="absolute top-4 left-4 text-white text-sm bg-black/70 px-3 py-2 rounded-lg pointer-events-none z-50 border border-white/20 backdrop-blur-sm">
        🐠 Click to feed fish • {foods.length} food items •{" "}
        {canSpawnFood ? "✅ Ready" : "⏳ Cooldown"}
      </div>
    </div>
  );
}
