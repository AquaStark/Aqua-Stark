'use client';

import { useState, useEffect, useRef } from 'react';
import type { FishType } from '@/types/game';
import type { FoodItem } from '@/types/food';

interface MovementParams {
  speed: number;
  turnRate: number;
  darting: {
    probability: number;
    speedMultiplier: number;
    duration: number;
  };
  hovering: {
    probability: number;
    duration: number;
    intensity: number;
  };
  boundaryPadding: number;
  foodDetectionRadius: number;
  feedingSpeed: number;
  minTargetDistance: number;
  directionChangeCooldown: number;
  baseEnergyLevel: number;
  swimmingVariation: number;
  curiosityLevel: number;
}

interface FishMovementState {
  id: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  targetPosition: { x: number; y: number };
  behaviorState:
    | 'idle'
    | 'darting'
    | 'hovering'
    | 'turning'
    | 'feeding'
    | 'exploring'
    | 'playful';
  behaviorTimer: number;
  facingLeft: boolean;
  lastDirectionChangeTime: number;
  stuckTimer: number;
  targetFoodId?: number;
  feedingCooldown: number;
  directionChangeCooldown: number;
  lastVelocityX: number;
  energyLevel: number;
  explorationTimer: number;
  playfulnessTimer: number;
  swimmingPattern: 'straight' | 'zigzag' | 'circular' | 'spiral';
  patternTimer: number;
}

interface UseFishMovementOptions {
  aquariumBounds: { width: number; height: number };
  foods?: FoodItem[];
  onFoodConsumed?: (foodId: number) => void;
}

export function useFishMovement(
  initialFish: FishType[],
  options: UseFishMovementOptions
) {
  const { aquariumBounds, foods = [], onFoodConsumed } = options;

  const [fishStates, setFishStates] = useState<FishMovementState[]>(() =>
    initialFish.map(fish => initializeFishState(fish))
  );

  const fishParamsRef = useRef<Map<number, MovementParams>>(new Map());
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  function initializeFishState(fish: FishType): FishMovementState {
    const angle = Math.random() * Math.PI * 2;
    const speed = 35 + Math.random() * 25;

    const pixelPosition = {
      x: (fish.position.x / 100) * aquariumBounds.width,
      y: (fish.position.y / 100) * aquariumBounds.height,
    };

    const safePosition = {
      x: Math.max(30, Math.min(aquariumBounds.width - 30, pixelPosition.x)),
      y: Math.max(30, Math.min(aquariumBounds.height - 30, pixelPosition.y)),
    };

    const velocityX = Math.cos(angle) * speed;

    return {
      id: fish.id,
      position: safePosition,
      velocity: {
        x: velocityX,
        y: Math.sin(angle) * speed,
      },
      targetPosition: {
        x: 50 + Math.random() * (aquariumBounds.width - 100),
        y: 50 + Math.random() * (aquariumBounds.height - 100),
      },
      behaviorState: 'exploring',
      behaviorTimer: 0,
      facingLeft: velocityX < 0,
      lastDirectionChangeTime: Date.now(),
      stuckTimer: 0,
      feedingCooldown: 0,
      directionChangeCooldown: 0,
      lastVelocityX: velocityX,
      energyLevel: 0.7 + Math.random() * 0.3,
      explorationTimer: Math.random() * 2,
      playfulnessTimer: Math.random() * 5,
      swimmingPattern: 'straight',
      patternTimer: 0,
    };
  }

  function generateMovementParams(fish: FishType): MovementParams {
    const isExotic =
      fish.rarity.toLowerCase().includes('legendary') ||
      fish.rarity.toLowerCase().includes('epic');
    const isRare = fish.rarity.toLowerCase().includes('rare');

    return {
      speed: isExotic ? 45 + Math.random() * 20 : 35 + Math.random() * 15,
      turnRate: isExotic ? 4.5 : 3.5,
      darting: {
        probability: isExotic ? 0.03 : 0.02,
        speedMultiplier: isExotic ? 3.5 : 3.0,
        duration: 0.8 + Math.random() * 0.7,
      },
      hovering: {
        probability: 0.008,
        duration: 1 + Math.random() * 1.5,
        intensity: 1.5,
      },
      boundaryPadding: 30,
      foodDetectionRadius: 140,
      feedingSpeed: isExotic ? 120 : 100,
      minTargetDistance: 80,
      directionChangeCooldown: 0.3,
      baseEnergyLevel: isExotic ? 0.9 : isRare ? 0.8 : 0.7,
      swimmingVariation: isExotic ? 0.4 : 0.3,
      curiosityLevel: isExotic ? 0.8 : 0.6,
    };
  }

  function findNearestFood(
    fishPixelPos: { x: number; y: number },
    detectionRadius: number
  ): FoodItem | null {
    let nearestFood: FoodItem | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const food of foods) {
      if (food.consumed) continue;

      const foodPixelPos = {
        x: (food.position.x / 100) * aquariumBounds.width,
        y: (food.position.y / 100) * aquariumBounds.height,
      };

      const dx = foodPixelPos.x - fishPixelPos.x;
      const dy = foodPixelPos.y - fishPixelPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= detectionRadius && distance < nearestDistance) {
        nearestDistance = distance;
        nearestFood = food;
      }
    }

    return nearestFood;
  }

  function checkFoodReached(fishState: FishMovementState): boolean {
    if (!fishState.targetFoodId) return false;

    const targetFood = foods.find(
      f => f.id === fishState.targetFoodId && !f.consumed
    );
    if (!targetFood) return false;

    const foodPixelPos = {
      x: (targetFood.position.x / 100) * aquariumBounds.width,
      y: (targetFood.position.y / 100) * aquariumBounds.height,
    };

    const dx = foodPixelPos.x - fishState.position.x;
    const dy = foodPixelPos.y - fishState.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= 18;
  }

  function getSafeTargetPosition(
    currentPos: { x: number; y: number },
    minDistance: number
  ): { x: number; y: number } {
    let attempts = 0;
    let newTarget: { x: number; y: number };

    do {
      newTarget = {
        x: 50 + Math.random() * (aquariumBounds.width - 100),
        y: 50 + Math.random() * (aquariumBounds.height - 100),
      };

      const dx = newTarget.x - currentPos.x;
      const dy = newTarget.y - currentPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= minDistance) {
        return newTarget;
      }

      attempts++;
    } while (attempts < 10);

    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.max(
        50,
        Math.min(
          aquariumBounds.width - 50,
          currentPos.x + Math.cos(angle) * minDistance
        )
      ),
      y: Math.max(
        50,
        Math.min(
          aquariumBounds.height - 50,
          currentPos.y + Math.sin(angle) * minDistance
        )
      ),
    };
  }

  function applySwimmingPattern(
    state: FishMovementState,
    baseVelocity: { x: number; y: number }
  ): { x: number; y: number } {
    const time = Date.now() / 1000;
    const modifiedVelocity = { ...baseVelocity };

    switch (state.swimmingPattern) {
      case 'zigzag': {
        const zigzagOffset = Math.sin(time * 4) * 15;
        modifiedVelocity.y += zigzagOffset;
        break;
      }

      case 'circular': {
        const circularForce = 20;
        const perpX = -baseVelocity.y;
        const perpY = baseVelocity.x;
        const length = Math.sqrt(perpX * perpX + perpY * perpY);
        if (length > 0) {
          modifiedVelocity.x += (perpX / length) * circularForce;
          modifiedVelocity.y += (perpY / length) * circularForce;
        }
        break;
      }

      case 'spiral': {
        const spiralTime = time * 2;
        const spiralRadius = 10 + Math.sin(spiralTime * 0.5) * 5;
        modifiedVelocity.x += Math.cos(spiralTime) * spiralRadius;
        modifiedVelocity.y += Math.sin(spiralTime) * spiralRadius;
        break;
      }

      case 'straight':
      default: {
        modifiedVelocity.x += (Math.random() - 0.5) * 8;
        modifiedVelocity.y += (Math.random() - 0.5) * 6;
        break;
      }
    }

    return modifiedVelocity;
  }

  function updateFishStates(
    prevStates: FishMovementState[],
    deltaTime: number
  ): FishMovementState[] {
    return prevStates.map(fishState => {
      const params = fishParamsRef.current.get(fishState.id);
      if (!params) return fishState;

      const newState = { ...fishState };

      newState.behaviorTimer -= deltaTime;
      newState.feedingCooldown = Math.max(
        0,
        newState.feedingCooldown - deltaTime
      );
      newState.directionChangeCooldown = Math.max(
        0,
        newState.directionChangeCooldown - deltaTime
      );
      newState.explorationTimer -= deltaTime;
      newState.playfulnessTimer -= deltaTime;
      newState.patternTimer -= deltaTime;

      newState.energyLevel = Math.min(
        1,
        newState.energyLevel + deltaTime * 0.1
      );

      if (newState.patternTimer <= 0) {
        const patterns: Array<'straight' | 'zigzag' | 'circular' | 'spiral'> = [
          'straight',
          'zigzag',
          'circular',
          'spiral',
        ];
        newState.swimmingPattern =
          patterns[Math.floor(Math.random() * patterns.length)];
        newState.patternTimer = 2 + Math.random() * 4;
      }

      if (newState.behaviorState === 'feeding' && checkFoodReached(newState)) {
        console.log(
          `🐠 Fish ${newState.id} ATE food ${newState.targetFoodId}! (Close contact)`
        );

        if (onFoodConsumed && newState.targetFoodId) {
          onFoodConsumed(newState.targetFoodId);
        }

        newState.energyLevel = Math.min(1, newState.energyLevel + 0.3);
        newState.behaviorState = 'playful';
        newState.targetFoodId = undefined;
        newState.feedingCooldown = 0.5;
        newState.behaviorTimer = 2 + Math.random() * 2;
        newState.targetPosition = getSafeTargetPosition(
          newState.position,
          params.minTargetDistance
        );
      }

      if (newState.feedingCooldown <= 0) {
        const nearestFood = findNearestFood(
          newState.position,
          params.foodDetectionRadius
        );

        if (nearestFood && nearestFood.id !== newState.targetFoodId) {
          const foodExists = foods.find(
            f => f.id === nearestFood.id && !f.consumed
          );

          if (foodExists) {
            console.log(
              `🎯 Fish ${newState.id} targeting food ${nearestFood.id}`
            );

            newState.behaviorState = 'feeding';
            newState.targetFoodId = nearestFood.id;
            newState.behaviorTimer = 6;

            const foodPixelPos = {
              x: (nearestFood.position.x / 100) * aquariumBounds.width,
              y: (nearestFood.position.y / 100) * aquariumBounds.height,
            };
            newState.targetPosition = foodPixelPos;
          }
        }
      }

      if (newState.targetFoodId) {
        const targetFood = foods.find(
          f => f.id === newState.targetFoodId && !f.consumed
        );
        if (!targetFood) {
          newState.behaviorState = 'exploring';
          newState.targetFoodId = undefined;
          newState.behaviorTimer = 1;
          newState.targetPosition = getSafeTargetPosition(
            newState.position,
            params.minTargetDistance
          );
        }
      }

      if (newState.behaviorTimer <= 0 && newState.behaviorState !== 'feeding') {
        const rand = Math.random();

        if (newState.energyLevel > 0.8 && rand < 0.3) {
          newState.behaviorState = 'darting';
          newState.behaviorTimer = 0.8 + Math.random() * 0.5;
        } else if (newState.playfulnessTimer <= 0 && rand < 0.4) {
          newState.behaviorState = 'playful';
          newState.behaviorTimer = 2 + Math.random() * 2;
          newState.playfulnessTimer = 8 + Math.random() * 5;
        } else if (newState.explorationTimer <= 0 && rand < 0.6) {
          newState.behaviorState = 'exploring';
          newState.behaviorTimer = 3 + Math.random() * 3;
          newState.explorationTimer = 5 + Math.random() * 3;
        } else if (rand < 0.1) {
          newState.behaviorState = 'hovering';
          newState.behaviorTimer = 1 + Math.random() * 1.5;
        } else {
          newState.behaviorState = 'exploring';
          newState.behaviorTimer = 2 + Math.random() * 2;
        }

        newState.targetPosition = getSafeTargetPosition(
          newState.position,
          params.minTargetDistance
        );
      }

      const dx = newState.targetPosition.x - newState.position.x;
      const dy = newState.targetPosition.y - newState.position.y;
      const distToTarget = Math.sqrt(dx * dx + dy * dy);

      let speed = params.speed * newState.energyLevel;

      switch (newState.behaviorState) {
        case 'feeding':
          speed = params.feedingSpeed;
          if (distToTarget < 40) {
            speed *= 0.7;
          }
          break;
        case 'darting':
          speed *= params.darting.speedMultiplier;
          break;
        case 'playful':
          speed *= 1.4;
          break;
        case 'exploring':
          speed *= 1.2;
          break;
        case 'hovering':
          speed *= 0.3;
          break;
      }

      speed *= 1 + (Math.random() - 0.5) * params.swimmingVariation;

      let desiredVelocity = { x: 0, y: 0 };
      if (distToTarget > 5) {
        desiredVelocity = {
          x: (dx / distToTarget) * speed,
          y: (dy / distToTarget) * speed,
        };
      }

      if (newState.behaviorState !== 'feeding') {
        desiredVelocity = applySwimmingPattern(newState, desiredVelocity);
      }

      const turnSpeed =
        newState.behaviorState === 'feeding'
          ? params.turnRate * 2
          : params.turnRate * 1.5;
      newState.velocity = {
        x:
          newState.velocity.x +
          (desiredVelocity.x - newState.velocity.x) * turnSpeed * deltaTime,
        y:
          newState.velocity.y +
          (desiredVelocity.y - newState.velocity.y) * turnSpeed * deltaTime,
      };

      const minSpeed = newState.behaviorState === 'hovering' ? 5 : 15;
      if (
        Math.abs(newState.velocity.x) < minSpeed &&
        newState.behaviorState !== 'hovering'
      ) {
        newState.velocity.x = Math.sign(newState.velocity.x || 1) * minSpeed;
      }
      if (
        Math.abs(newState.velocity.y) < minSpeed * 0.7 &&
        newState.behaviorState !== 'hovering'
      ) {
        newState.velocity.y =
          Math.sign(newState.velocity.y || 1) * (minSpeed * 0.7);
      }

      const velocityXSign = Math.sign(newState.velocity.x);
      const lastVelocityXSign = Math.sign(newState.lastVelocityX);

      if (Math.abs(newState.velocity.x) > 15) {
        if (
          newState.directionChangeCooldown <= 0 &&
          velocityXSign !== lastVelocityXSign
        ) {
          newState.facingLeft = newState.velocity.x < 0;
          newState.directionChangeCooldown = params.directionChangeCooldown;
          newState.lastVelocityX = newState.velocity.x;
        }
      }

      newState.position = {
        x: newState.position.x + newState.velocity.x * deltaTime,
        y: newState.position.y + newState.velocity.y * deltaTime,
      };

      const padding = params.boundaryPadding;
      let hitBoundary = false;

      if (newState.position.x < padding) {
        newState.position.x = padding;
        if (newState.velocity.x < 0) {
          newState.velocity.x = Math.abs(newState.velocity.x) * 0.9;
          hitBoundary = true;
        }
      } else if (newState.position.x > aquariumBounds.width - padding) {
        newState.position.x = aquariumBounds.width - padding;
        if (newState.velocity.x > 0) {
          newState.velocity.x = -Math.abs(newState.velocity.x) * 0.9;
          hitBoundary = true;
        }
      }

      if (newState.position.y < padding) {
        newState.position.y = padding;
        if (newState.velocity.y < 0) {
          newState.velocity.y = Math.abs(newState.velocity.y) * 0.9;
        }
      } else if (newState.position.y > aquariumBounds.height - padding) {
        newState.position.y = aquariumBounds.height - padding;
        if (newState.velocity.y > 0) {
          newState.velocity.y = -Math.abs(newState.velocity.y) * 0.9;
        }
      }

      if (hitBoundary && newState.directionChangeCooldown <= 0) {
        newState.facingLeft = newState.velocity.x < 0;
        newState.directionChangeCooldown = params.directionChangeCooldown;
        newState.lastVelocityX = newState.velocity.x;

        if (newState.behaviorState !== 'feeding') {
          newState.targetPosition = getSafeTargetPosition(
            newState.position,
            params.minTargetDistance
          );
        }
      }

      return newState;
    });
  }

  useEffect(() => {
    if (initialFish.length !== fishParamsRef.current.size) {
      fishParamsRef.current.clear();
    }

    initialFish.forEach(fish => {
      if (!fishParamsRef.current.has(fish.id)) {
        fishParamsRef.current.set(fish.id, generateMovementParams(fish));
      }
    });

    const animate = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastUpdateTimeRef.current) / 1000, 0.1);
      lastUpdateTimeRef.current = now;

      setFishStates(prevStates => updateFishStates(prevStates, deltaTime));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initialFish, foods]);

  useEffect(() => {
    if (initialFish.length > 0) {
      setFishStates(initialFish.map(fish => initializeFishState(fish)));
    }
  }, [initialFish.length]);

  return fishStates.map(state => ({
    id: state.id,
    position: {
      x: (state.position.x / aquariumBounds.width) * 100,
      y: (state.position.y / aquariumBounds.height) * 100,
    },
    facingLeft: state.facingLeft,
    behaviorState: state.behaviorState,
  }));
}
