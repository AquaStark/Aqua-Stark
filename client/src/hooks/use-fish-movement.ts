'use client';

import { useState, useEffect, useRef } from 'react';
import type { FishType, FoodItem } from '@/types';

/**
 * Configuration parameters that define a fish's movement characteristics.
 */
interface MovementParams {
  /** Base swimming speed in pixels per second */
  speed: number;
  /** Rate at which the fish can change direction */
  turnRate: number;
  /** Parameters for darting behavior (sudden fast movements) */
  darting: {
    /** Probability of darting behavior occurring per frame */
    probability: number;
    /** Multiplier applied to base speed during darting */
    speedMultiplier: number;
    /** Duration of darting behavior in seconds */
    duration: number;
  };
  /** Parameters for hovering behavior (slow, floating movement) */
  hovering: {
    /** Probability of hovering behavior occurring per frame */
    probability: number;
    /** Duration of hovering behavior in seconds */
    duration: number;
    /** Intensity multiplier for hovering movement */
    intensity: number;
  };
  /** Padding distance from aquarium boundaries to prevent fish from getting stuck */
  boundaryPadding: number;
  /** Radius in pixels within which fish can detect food */
  foodDetectionRadius: number;
  /** Speed multiplier when moving toward food */
  feedingSpeed: number;
  /** Minimum distance to target position to prevent excessive circling */
  minTargetDistance: number;
  /** Cooldown time in seconds between direction changes */
  directionChangeCooldown: number;
  /** Base energy level that affects swimming speed and behavior */
  baseEnergyLevel: number;
  /** Amount of random variation in swimming patterns */
  swimmingVariation: number;
  /** How likely the fish is to investigate food and explore */
  curiosityLevel: number;
}

/**
 * Current state of an individual fish's movement simulation.
 */
interface FishMovementState {
  /** Unique identifier for the fish */
  id: number;
  /** Current position in pixel coordinates */
  position: { x: number; y: number };
  /** Current velocity vector */
  velocity: { x: number; y: number };
  /** Current target position the fish is moving toward */
  targetPosition: { x: number; y: number };
  /** Current behavioral state affecting movement patterns */
  behaviorState:
    | 'idle'
    | 'darting'
    | 'hovering'
    | 'turning'
    | 'feeding'
    | 'exploring'
    | 'playful';
  /** Timer for current behavior state duration */
  behaviorTimer: number;
  /** Whether the fish is facing left (for sprite rendering) */
  facingLeft: boolean;
  /** Timestamp of last direction change to enforce cooldown */
  lastDirectionChangeTime: number;
  /** Timer to detect if fish is stuck in one position */
  stuckTimer: number;
  /** ID of currently targeted food item */
  targetFoodId?: number;
  /** Cooldown timer after feeding to prevent immediate re-feeding */
  feedingCooldown: number;
  /** Current direction change cooldown timer */
  directionChangeCooldown: number;
  /** Last recorded X velocity for direction change detection */
  lastVelocityX: number;
  /** Current energy level affecting speed and behavior */
  energyLevel: number;
  /** Timer for exploration behavior cycles */
  explorationTimer: number;
  /** Timer for playfulness behavior cycles */
  playfulnessTimer: number;
  /** Current swimming pattern type */
  swimmingPattern: 'straight' | 'zigzag' | 'circular' | 'spiral';
  /** Timer for swimming pattern duration */
  patternTimer: number;
  /** ID of the last food item consumed to prevent targeting the same food repeatedly */
  lastFoodConsumedId?: number;
  /** Number of consecutive feeding attempts on the same target */
  feedingAttempts: number;
  /** Maximum allowed feeding attempts before giving up on a target */
  maxFeedingAttempts: number;
}

/**
 * Options for configuring the fish movement simulation.
 */
interface UseFishMovementOptions {
  /** Dimensions of the aquarium container */
  aquariumBounds: { width: number; height: number };
  /** Current food items in the aquarium */
  foods?: FoodItem[];
  /** Callback function invoked when a fish consumes food */
  onFoodConsumed?: (foodId: number) => void;
}

/**
 * Custom hook that simulates realistic fish movement behaviors in an aquarium.
 *
 * This hook handles complex fish AI including:
 * - Natural swimming patterns (straight, zigzag, circular, spiral)
 * - Behavioral states (exploring, darting, hovering, feeding, playful)
 * - Food detection and consumption with collision detection
 * - Boundary avoidance and wall bouncing
 * - Energy management affecting speed and behavior
 * - Direction-based sprite flipping (facingLeft)
 *
 * The simulation runs at 60fps using requestAnimationFrame and automatically
 * converts between percentage-based positions (for UI) and pixel-based positions (for physics).
 *
 * @param {FishType[]} initialFish - Array of fish data to initialize the simulation.
 * @param {UseFishMovementOptions} options - Configuration options for the simulation.
 * @param {Object} options.aquariumBounds - Dimensions of the aquarium container.
 * @param {FoodItem[]} [options.foods=[]] - Current food items available in the aquarium.
 * @param {(foodId: number) => void} [options.onFoodConsumed] - Callback when food is consumed.
 *
 * @returns {Array<{ id: number; position: { x: number; y: number }; facingLeft: boolean; behaviorState: string }>}
 * An array of fish movement states with positions normalized to percentages (0-100).
 *
 * @example
 * ```tsx
 * const fishMovement = useFishMovement(fishData, {
 *   aquariumBounds: { width: 800, height: 600 },
 *   foods: currentFoods,
 *   onFoodConsumed: (foodId) => {
 *     // Update food state or player stats
 *     removeFood(foodId);
 *   }
 * });
 *
 * return (
 *   <Aquarium width={800} height={600}>
 *     {fishMovement.map(fish => (
 *       <FishSprite
 *         key={fish.id}
 *         position={fish.position}
 *         facingLeft={fish.facingLeft}
 *         behavior={fish.behaviorState}
 *       />
 *     ))}
 *   </Aquarium>
 * );
 * ```
 */
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

  /**
   * Initializes the movement state for a new fish based on its type and aquarium bounds.
   *
   * @param {FishType} fish - The fish data to initialize.
   * @returns {FishMovementState} The initialized movement state.
   */
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
      // Initialize new fields
      lastFoodConsumedId: undefined,
      feedingAttempts: 0,
      maxFeedingAttempts: 3,
    };
  }

  /**
   * Generates movement parameters based on fish rarity and characteristics.
   *
   * @param {FishType} fish - The fish type to generate parameters for.
   * @returns {MovementParams} Configured movement parameters.
   */
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

  /**
   * Finds the nearest unconsumed food item within detection radius.
   *
   * @param {{ x: number; y: number }} fishPixelPos - Current fish position in pixels.
   * @param {number} detectionRadius - Maximum distance to search for food.
   * @returns {FoodItem | null} The nearest food item or null if none found.
   */
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

  /**
   * Checks if the fish has reached its target food item for consumption.
   *
   * @param {FishMovementState} fishState - Current fish movement state.
   * @returns {boolean} True if the fish is close enough to consume the food.
   */
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

    // Increase collision radius slightly and add some randomness to prevent perfect loops
    const baseRadius = 20;
    const randomOffset = (Math.random() - 0.5) * 4; // ±2px variation
    const collisionRadius = baseRadius + randomOffset;

    return distance <= collisionRadius;
  }

  /**
   * Generates a safe target position that maintains minimum distance from current position.
   *
   * @param {{ x: number; y: number }} currentPos - Current position in pixels.
   * @param {number} minDistance - Minimum distance the new target should be from current position.
   * @returns {{ x: number; y: number }} A safe target position within aquarium bounds.
   */
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

  /**
   * Applies the current swimming pattern to modify the base velocity vector.
   *
   * @param {FishMovementState} state - Current fish movement state.
   * @param {{ x: number; y: number }} baseVelocity - Base velocity vector to modify.
   * @returns {{ x: number; y: number }} Modified velocity vector with pattern applied.
   */
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

  /**
   * Updates all fish movement states based on elapsed time and current conditions.
   *
   * @param {FishMovementState[]} prevStates - Previous fish movement states.
   * @param {number} deltaTime - Time elapsed since last update in seconds.
   * @returns {FishMovementState[]} Updated fish movement states.
   */
  function updateFishStates(
    prevStates: FishMovementState[],
    deltaTime: number
  ): FishMovementState[] {
    return prevStates.map((fishState: FishMovementState) => {
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

      // Enhanced food consumption logic with loop prevention
      if (newState.behaviorState === 'feeding' && checkFoodReached(newState)) {
        const targetFood = foods.find(
          f => f.id === newState.targetFoodId && !f.consumed
        );

        if (targetFood) {
          if (onFoodConsumed && newState.targetFoodId) {
            onFoodConsumed(newState.targetFoodId);
          }

          // Dispatch a global event so listeners (e.g., per-fish indicator hooks) can react
          try {
            if (typeof window !== 'undefined' && newState.targetFoodId) {
              window.dispatchEvent(
                new CustomEvent('fish-fed', {
                  detail: {
                    fishId: newState.id,
                    foodId: newState.targetFoodId,
                  },
                })
              );
            }
          } catch (error) {
            console.error('Failed to dispatch fish-fed event:', error);
            // Continue execution - this is not critical for fish behavior
          }

          newState.energyLevel = Math.min(1, newState.energyLevel + 0.3);
          newState.behaviorState = 'playful';
          newState.lastFoodConsumedId = newState.targetFoodId;
          newState.targetFoodId = undefined;
          newState.feedingCooldown = 1.5; // Increased from 0.5 to prevent immediate re-targeting
          newState.behaviorTimer = 2 + Math.random() * 2;
          newState.feedingAttempts = 0; // Reset attempts after successful consumption
          newState.targetPosition = getSafeTargetPosition(
            newState.position,
            params.minTargetDistance
          );
        } else {
          // Food was already consumed by another fish, reset state
          newState.behaviorState = 'exploring';
          newState.targetFoodId = undefined;
          newState.feedingAttempts = 0;
          newState.behaviorTimer = 1;
          newState.targetPosition = getSafeTargetPosition(
            newState.position,
            params.minTargetDistance
          );
        }
      }

      // Enhanced food targeting logic with loop prevention
      if (newState.feedingCooldown <= 0) {
        const nearestFood = findNearestFood(
          newState.position,
          params.foodDetectionRadius
        );

        if (
          nearestFood &&
          nearestFood.id !== newState.targetFoodId &&
          nearestFood.id !== newState.lastFoodConsumedId && // Don't target recently consumed food
          newState.feedingAttempts < newState.maxFeedingAttempts
        ) {
          // Limit attempts

          const foodExists = foods.find(
            f => f.id === nearestFood.id && !f.consumed
          );

          if (foodExists) {
            newState.behaviorState = 'feeding';
            newState.targetFoodId = nearestFood.id;
            newState.behaviorTimer = 6;
            newState.feedingAttempts++;

            const foodPixelPos = {
              x: (nearestFood.position.x / 100) * aquariumBounds.width,
              y: (nearestFood.position.y / 100) * aquariumBounds.height,
            };
            newState.targetPosition = foodPixelPos;
          }
        }
      }

      // Reset feeding state if target food no longer exists or max attempts reached
      if (newState.targetFoodId) {
        const targetFood = foods.find(
          f => f.id === newState.targetFoodId && !f.consumed
        );
        if (
          !targetFood ||
          newState.feedingAttempts >= newState.maxFeedingAttempts
        ) {
          newState.behaviorState = 'exploring';
          newState.targetFoodId = undefined;
          newState.feedingAttempts = 0;
          newState.behaviorTimer = 1;
          newState.targetPosition = getSafeTargetPosition(
            newState.position,
            params.minTargetDistance
          );
        }
      }

      // Enhanced behavior state management
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

      setFishStates((prevStates: FishMovementState[]) =>
        updateFishStates(prevStates, deltaTime)
      );

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

  return fishStates.map((state: FishMovementState) => ({
    id: state.id,
    position: {
      x: (state.position.x / aquariumBounds.width) * 100,
      y: (state.position.y / aquariumBounds.height) * 100,
    },
    facingLeft: state.facingLeft,
    behaviorState: state.behaviorState,
  }));
}
