import { useState, useEffect, useRef } from "react";
import { FishType, FoodType } from "@/types/game";

// Movement parameters for different fish behaviors
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
}

// Current movement state of a fish
interface FishMovementState {
  id: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  targetPosition: { x: number; y: number };
  behaviorState:
    | "idle"
    | "darting"
    | "hovering"
    | "turning"
    | "seeking_food"
    | "eating"
    | "satisfied";
  behaviorTimer: number;
  facingLeft: boolean;
  lastDirectionChangeTime: number; // Track when we last changed direction
  stuckTimer: number; // Track how long a fish has been "stuck" in the same position
  turningProgress?: number; // Track turning animation progress
  targetFood?: FoodType;
  eatingTimer?: number;
  satisfactionTimer?: number;
}

interface UseFishMovementOptions {
  aquariumBounds: { width: number; height: number };
  collisionRadius: number;
}

// Spatial Grid Implementation
interface GridCell {
  x: number;
  y: number;
  fish: FishMovementState[];
  food: FoodType[];
}

interface SpatialGrid {
  cells: Map<string, GridCell>;
  cellSize: number;
  width: number;
  height: number;
}

function createSpatialGrid(
  width: number,
  height: number,
  cellSize: number
): SpatialGrid {
  const cells = new Map<string, GridCell>();
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);

  // Initialize grid cells
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const key = `${x},${y}`;
      cells.set(key, { x, y, fish: [], food: [] });
    }
  }

  return { cells, cellSize, width: gridWidth, height: gridHeight };
}

function getCellForPosition(
  position: { x: number; y: number },
  grid: SpatialGrid
): GridCell | null {
  const cellX = Math.floor(position.x / grid.cellSize);
  const cellY = Math.floor(position.y / grid.cellSize);
  return grid.cells.get(`${cellX},${cellY}`) || null;
}

function getAdjacentCells(cell: GridCell, grid: SpatialGrid): GridCell[] {
  const adjacent: GridCell[] = [];
  const directions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  for (const [dx, dy] of directions) {
    const newX = cell.x + dx;
    const newY = cell.y + dy;
    if (newX >= 0 && newX < grid.width && newY >= 0 && newY < grid.height) {
      const adjacentCell = grid.cells.get(`${newX},${newY}`);
      if (adjacentCell) adjacent.push(adjacentCell);
    }
  }

  return adjacent;
}

function calculateDistance(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number }
): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function findNearestFood(
  fishState: FishMovementState,
  grid: SpatialGrid
): FoodType | null {
  // Instead of just checking nearby cells, check all cells for food
  let nearestFood: FoodType | null = null;
  let minDistance = Infinity;

  // Check all cells in the grid for food
  for (const cell of grid.cells.values()) {
    for (const food of cell.food) {
      const distance = calculateDistance(fishState.position, food.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearestFood = food;
      }
    }
  }

  return nearestFood;
}

function populateGrid(
  grid: SpatialGrid,
  fishStates: FishMovementState[],
  food: FoodType[]
) {
  // Clear existing data
  for (const cell of grid.cells.values()) {
    cell.fish = [];
    cell.food = [];
  }

  // Add fish to grid
  for (const fish of fishStates) {
    const cell = getCellForPosition(fish.position, grid);
    if (cell) cell.fish.push(fish);
  }

  // Add food to grid
  for (const foodItem of food) {
    const cell = getCellForPosition(foodItem.position, grid);
    if (cell) cell.food.push(foodItem);
  }
}

export function useFishMovement(
  initialFish: FishType[],
  options: UseFishMovementOptions,
  food: FoodType[] = [] // Add food parameter with default empty array
) {
  const { aquariumBounds, collisionRadius } = options;

  // Store movement state for each fish
  const [fishStates, setFishStates] = useState<FishMovementState[]>(() =>
    initialFish.map((fish) => initializeFishState(fish))
  );

  // Store movement parameters for each fish
  const fishParamsRef = useRef<Map<number, MovementParams>>(new Map());

  // Create spatial grid
  const gridRef = useRef<SpatialGrid>(
    createSpatialGrid(aquariumBounds.width, aquariumBounds.height, 100)
  );

  // Timestamp for animation frame
  const lastUpdateTimeRef = useRef<number>(Date.now());
  // Request animation frame ID for cleanup
  const animationFrameRef = useRef<number | null>(null);

  // Debug: log initial fish
  useEffect(() => {
    // Ensure we reinitialize fish states when initialFish changes
    if (initialFish.length > 0) {
      setFishStates(initialFish.map((fish) => initializeFishState(fish)));
    }
  }, [initialFish.length]);

  // Initialize fish movement parameters
  useEffect(() => {
    // Reset fish parameters when initialFish changes significantly
    if (initialFish.length !== fishParamsRef.current.size) {
      fishParamsRef.current.clear();
    }

    // Initialize movement parameters for each fish
    initialFish.forEach((fish) => {
      if (!fishParamsRef.current.has(fish.id)) {
        fishParamsRef.current.set(fish.id, generateMovementParams(fish));
      }
    });

    // Start animation loop
    const animate = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastUpdateTimeRef.current) / 1000, 0.1); // Convert to seconds, cap to avoid large jumps
      lastUpdateTimeRef.current = now;

      // Update fish positions based on their movement behaviors
      setFishStates((prevStates) =>
        updateFishStates(prevStates, food, deltaTime, now)
      );

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initialFish, food]);

  // Initialize a fish's movement state
  function initializeFishState(fish: FishType): FishMovementState {
    // Generate random direction for initial velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = 15 + Math.random() * 20; // Increased speed for more visible movement
    const velocityX = Math.cos(angle) * speed;

    // Ensure the fish is positioned within bounds
    const safePosition = {
      x: Math.min(
        Math.max((fish.position.x / 100) * aquariumBounds.width, 20),
        aquariumBounds.width - 20
      ),
      y: Math.min(
        Math.max((fish.position.y / 100) * aquariumBounds.height, 20),
        aquariumBounds.height - 20
      ),
    };

    return {
      id: fish.id,
      position: safePosition,
      velocity: {
        x: velocityX,
        y: Math.sin(angle) * speed,
      },
      targetPosition: {
        x: Math.random() * (aquariumBounds.width - 40) + 20,
        y: Math.random() * (aquariumBounds.height - 40) + 20,
      },
      behaviorState: "idle",
      behaviorTimer: 0,
      // Initialize facing direction based on the initial velocity
      facingLeft: velocityX < 0,
      lastDirectionChangeTime: Date.now(),
      stuckTimer: 0,
    };
  }

  // Generate movement parameters based on fish properties
  function generateMovementParams(fish: FishType): MovementParams {
    // Use fish properties to influence movement parameters
    // Higher rarity could mean more complex or interesting movement patterns
    const isExotic =
      fish.rarity.toLowerCase().includes("exotic") ||
      fish.rarity.toLowerCase().includes("legendary");

    return {
      // Base speed inversely related to generation (older fish are slower)
      // Increased speeds overall for better visibility
      speed: Math.max(20, 40 - fish.generation * 2),

      // Turn rate - how quickly the fish can change direction
      turnRate: isExotic ? 3.0 : 2.0, // Increased for faster responsiveness

      // Darting behavior - sudden bursts of speed
      darting: {
        probability: isExotic ? 0.02 : 0.01, // Increased probability
        speedMultiplier: isExotic ? 5 : 4, // Increased speed boost
        duration: 0.8 + Math.random() * 0.5, // Longer darting duration
      },

      // Hovering behavior - staying in one place with small movements
      hovering: {
        probability: isExotic ? 0.008 : 0.01, // Reduced slightly to favor movement
        duration: 1.5 + Math.random() * 2, // Shorter hover time
        intensity: isExotic ? 0.7 : 1.2, // Increased movement while hovering
      },

      // Padding from boundaries - prevents fish from getting too close to edges
      boundaryPadding: 30, // Increased to keep fish further from edges
    };
  }

  // Get a safe target position within the aquarium bounds
  function getSafeTargetPosition(params: MovementParams): {
    x: number;
    y: number;
  } {
    const padding = params.boundaryPadding;
    return {
      x: Math.random() * (aquariumBounds.width - 2 * padding) + padding,
      y: Math.random() * (aquariumBounds.height - 2 * padding) + padding,
    };
  }

  // Update all fish states for a new frame
  function updateFishStates(
    prevStates: FishMovementState[],
    food: FoodType[],
    deltaTime: number,
    currentTime: number
  ): FishMovementState[] {
    // Update the spatial grid with current fish and food positions
    populateGrid(gridRef.current, prevStates, food);

    // First get all updated states
    const newStates = prevStates.map((fishState) => {
      const params = fishParamsRef.current.get(fishState.id);
      if (!params) return fishState;

      // Clone the state to avoid mutations
      const newState = { ...fishState };

      // Update behavior state timer
      newState.behaviorTimer -= deltaTime;

      // Always check for food unless the fish is currently eating or satisfied
      if (
        newState.behaviorState !== "eating" &&
        newState.behaviorState !== "satisfied"
      ) {
        const nearestFood = findNearestFood(newState, gridRef.current);

        if (nearestFood) {
          // Set behavior to seeking food
          newState.behaviorState = "seeking_food";
          newState.targetFood = nearestFood;
          const foodPos = {
            x: (nearestFood.position.x / 100) * aquariumBounds.width,
            y: (nearestFood.position.y / 100) * aquariumBounds.height
          };
          newState.targetPosition = foodPos;

          // Calculate direction to food
          const dx = foodPos.x - newState.position.x;
          const dy = foodPos.y - newState.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Adjust velocity to move towards food
          if (distance > 0) {
            // Move faster when seeking food
            const speed = params.speed * 2;
            newState.velocity = {
              x: (dx / distance) * speed,
              y: (dy / distance) * speed,
            };

            // Update facing direction based on movement
            newState.facingLeft = newState.velocity.x < 0;
          }

          // Check if fish is close enough to eat
          if (distance < 20) {
            // Eating distance threshold
            newState.behaviorState = "eating";
            newState.eatingTimer = 1.0; // 1 second eating animation
            // Slow down when eating
            newState.velocity.x *= 0.3;
            newState.velocity.y *= 0.3;
          }
        } else {
          // If no food is found, return to idle behavior
          if (newState.behaviorState === "seeking_food") {
            newState.behaviorState = "idle";
            newState.targetFood = undefined;
            newState.targetPosition = getSafeTargetPosition(params);
          }
        }
      }

      // Handle eating state
      if (newState.behaviorState === "eating") {
        newState.eatingTimer! -= deltaTime;
        if (newState.eatingTimer! <= 0) {
          newState.behaviorState = "satisfied";
          newState.satisfactionTimer = 5.0; // 5 seconds satisfaction
          // Remove eaten food from the grid
          const foodCell = getCellForPosition(
            newState.targetFood!.position,
            gridRef.current
          );
          if (foodCell) {
            foodCell.food = foodCell.food.filter(
              (f) => f.id !== newState.targetFood!.id
            );
          }
        }
      }

      // Handle satisfaction state
      if (newState.behaviorState === "satisfied") {
        newState.satisfactionTimer! -= deltaTime;
        if (newState.satisfactionTimer! <= 0) {
          newState.behaviorState = "idle";
          newState.targetFood = undefined;
        }
      }

      // IMPORTANT: Always set facingLeft based on velocity BEFORE applying any other logic
      // This ensures visual direction always matches actual movement
      if (Math.abs(newState.velocity.x) > 5) {
        newState.facingLeft = newState.velocity.x < 0;
      }

      // Check if fish is stuck (not moving much)
      const velocityMagnitude = Math.sqrt(
        newState.velocity.x * newState.velocity.x +
          newState.velocity.y * newState.velocity.y
      );

      if (velocityMagnitude < 5) {
        newState.stuckTimer += deltaTime;

        // If stuck for too long, give it a new target and velocity boost
        if (newState.stuckTimer > 2) {
          // 2 seconds of being stuck
          newState.stuckTimer = 0;
          newState.targetPosition = getSafeTargetPosition(params);

          // Calculate direction to target
          const dx = newState.targetPosition.x - newState.position.x;
          const dy = newState.targetPosition.y - newState.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0) {
            // Set new velocity toward target
            newState.velocity = {
              x: (dx / distance) * params.speed * 2,
              y: (dy / distance) * params.speed * 2,
            };

            // Update facing direction based on new velocity
            newState.facingLeft = newState.velocity.x < 0;
          }

          newState.lastDirectionChangeTime = currentTime;
        }
      } else {
        // Reset stuck timer if moving
        newState.stuckTimer = 0;
      }

      // Handle behavior state changes
      if (newState.behaviorTimer <= 0) {
        // Reset timer and potentially change behavior
        if (newState.behaviorState !== "idle") {
          // Return to idle if in a special state
          newState.behaviorState = "idle";
          newState.behaviorTimer = 1 + Math.random() * 3; // Idle for 1-4 seconds
        } else {
          // Possibly transition to a special state
          const dartRoll = Math.random();
          const hoverRoll = Math.random();

          if (dartRoll < params.darting.probability) {
            newState.behaviorState = "darting";
            newState.behaviorTimer = params.darting.duration;

            // Set a new target when darting
            newState.targetPosition = getSafeTargetPosition(params);

            // Calculate direction to target
            const dx = newState.targetPosition.x - newState.position.x;
            const dy = newState.targetPosition.y - newState.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
              // Set new velocity toward target with darting boost
              newState.velocity = {
                x:
                  (dx / distance) *
                  params.speed *
                  params.darting.speedMultiplier,
                y:
                  (dy / distance) *
                  params.speed *
                  params.darting.speedMultiplier,
              };

              // Update facing direction based on new velocity
              newState.facingLeft = newState.velocity.x < 0;
            }
          } else if (hoverRoll < params.hovering.probability) {
            newState.behaviorState = "hovering";
            newState.behaviorTimer = params.hovering.duration;
            // Slow down when entering hovering state
            newState.velocity.x *= 0.3;
            newState.velocity.y *= 0.3;
          } else {
            // Stay in idle
            newState.behaviorTimer = 1 + Math.random() * 3;

            // Occasionally set a new target while idle
            if (Math.random() < 0.2) {
              newState.targetPosition = getSafeTargetPosition(params);
            }
          }
        }
      }

      // Calculate desired velocity based on behavior state
      let desiredVelocity = calculateDesiredVelocity(newState, params);

      // Update velocity with easing for smooth transitions
      newState.velocity = {
        x:
          newState.velocity.x +
          (desiredVelocity.x - newState.velocity.x) *
            params.turnRate *
            deltaTime,
        y:
          newState.velocity.y +
          (desiredVelocity.y - newState.velocity.y) *
            params.turnRate *
            deltaTime,
      };

      // MOST IMPORTANT PART: Update facing direction based on actual velocity
      // Must be done after velocity update to ensure it matches current movement
      if (Math.abs(newState.velocity.x) > 5) {
        newState.facingLeft = newState.velocity.x < 0;
      }

      // Prevent extremely slow movement that causes pauses
      if (
        Math.abs(newState.velocity.x) < 5 &&
        newState.behaviorState !== "hovering"
      ) {
        newState.velocity.x = Math.sign(newState.velocity.x || 1) * 5;
      }
      if (
        Math.abs(newState.velocity.y) < 3 &&
        newState.behaviorState !== "hovering"
      ) {
        newState.velocity.y = Math.sign(newState.velocity.y || 1) * 3;
      }

      // Update position based on velocity
      newState.position = {
        x: newState.position.x + newState.velocity.x * deltaTime,
        y: newState.position.y + newState.velocity.y * deltaTime,
      };

      // Apply boundary constraints
      const directionChanged = applyBoundaryConstraints(newState, params);

      // If direction changed due to boundary, make sure velocity and facing direction are consistent
      if (directionChanged) {
        // Direction has changed due to boundary collision, make sure we update lastDirectionChangeTime
        newState.lastDirectionChangeTime = currentTime;
      }

      return newState;
    });

    // Apply collision avoidance
    return applyCollisionAvoidance(newStates, collisionRadius);
  }

  // Apply collision avoidance - prevent fish from overlapping
  function applyCollisionAvoidance(
    states: FishMovementState[],
    radius: number
  ): FishMovementState[] {
    // We'll just make slight position adjustments to avoid fish clustering too much
    return states.map((fish, index) => {
      // Skip collision check on hovering or darting fish
      if (fish.behaviorState !== "idle") return fish;

      const newFish = { ...fish };
      let totalPush = { x: 0, y: 0 };
      let pushCount = 0;

      // Check against all other fish
      for (let j = 0; j < states.length; j++) {
        if (index === j) continue;

        const otherFish = states[j];

        // Calculate distance between fish
        const dx = newFish.position.x - otherFish.position.x;
        const dy = newFish.position.y - otherFish.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If they're too close, calculate a push vector
        if (distance < radius) {
          // Direction to push (away from other fish)
          const pushFactor = (radius - distance) / radius;
          totalPush.x += dx * pushFactor * 0.5;
          totalPush.y += dy * pushFactor * 0.5;
          pushCount++;
        }
      }

      // Apply the average push if there were any collisions
      if (pushCount > 0) {
        newFish.position.x += totalPush.x / pushCount;
        newFish.position.y += totalPush.y / pushCount;

        // Ensure the fish stays within bounds after collision avoidance
        const params = fishParamsRef.current.get(newFish.id);
        if (params) {
          applyBoundaryConstraints(newFish, params);
        }
      }

      return newFish;
    });
  }

  // Calculate desired velocity based on current state and behavior
  function calculateDesiredVelocity(
    state: FishMovementState,
    params: MovementParams
  ) {
    // Direction to target
    const dx = state.targetPosition.x - state.position.x;
    const dy = state.targetPosition.y - state.position.y;

    // Distance to target
    const distToTarget = Math.sqrt(dx * dx + dy * dy);

    // Base speed depends on behavior state
    let speed = params.speed;

    // Apply behavior-specific modifications
    switch (state.behaviorState) {
      case "darting":
        speed *= params.darting.speedMultiplier;
        break;

      case "hovering":
        // When hovering, move very little and make random small adjustments
        // But preserve facing direction by ensuring x velocity has correct sign
        const xVelocity =
          (Math.random() - 0.5) * params.hovering.intensity * 15;
        return {
          // Ensure hovering fish maintain their facing direction by keeping velocity sign consistent
          x: state.facingLeft ? -Math.abs(xVelocity) : Math.abs(xVelocity),
          y: (Math.random() - 0.5) * params.hovering.intensity * 15, // Increased
        };

      case "idle":
      default:
        // If very close to target, slow down
        if (distToTarget < 20) {
          speed *= distToTarget / 20;
        }
        break;
    }

    // Normalize direction and apply speed
    if (distToTarget > 0) {
      return {
        x: (dx / distToTarget) * speed,
        y: (dy / distToTarget) * speed,
      };
    } else {
      // If at target, move in a random direction
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle) * speed * 0.3, // Increased
        y: Math.sin(angle) * speed * 0.3, // Increased
      };
    }
  }

  // Apply constraints to keep fish within boundaries
  function applyBoundaryConstraints(
    state: FishMovementState,
    params: MovementParams
  ) {
    const padding = params.boundaryPadding;
    let directionChanged = false;

    // Check horizontal boundaries
    if (state.position.x < padding) {
      state.position.x = padding;
      // Fish hit left boundary - make it move right
      if (state.velocity.x < 0) {
        state.velocity.x = Math.abs(state.velocity.x) * 0.8; // Bounce
        state.facingLeft = false; // Always face right when bouncing off left wall
        directionChanged = true;
      }
    } else if (state.position.x > aquariumBounds.width - padding) {
      state.position.x = aquariumBounds.width - padding;
      // Fish hit right boundary - make it move left
      if (state.velocity.x > 0) {
        state.velocity.x = -Math.abs(state.velocity.x) * 0.8; // Bounce
        state.facingLeft = true; // Always face left when bouncing off right wall
        directionChanged = true;
      }
    }

    // Check vertical boundaries
    if (state.position.y < padding) {
      state.position.y = padding;
      state.velocity.y = Math.abs(state.velocity.y) * 0.8; // Bounce
    } else if (state.position.y > aquariumBounds.height - padding) {
      state.position.y = aquariumBounds.height - padding;
      state.velocity.y = -Math.abs(state.velocity.y) * 0.8; // Bounce
    }

    return directionChanged;
  }

  // Return fish states with transformed positions as percentages for rendering
  return fishStates.map((state) => {
    // CRITICAL: Ensure facingLeft is consistent with velocity direction
    // This is the final check before rendering to make sure fish never move backwards
    if (Math.abs(state.velocity.x) > 1) {
      state.facingLeft = state.velocity.x < 0;
    }

    return {
      id: state.id,
      position: {
        x: (state.position.x / aquariumBounds.width) * 100,
        y: (state.position.y / aquariumBounds.height) * 100,
      },
      facingLeft: state.facingLeft,
      behaviorState: state.behaviorState,
    };
  });
}
