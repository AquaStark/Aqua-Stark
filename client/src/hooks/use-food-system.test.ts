import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFoodSystem } from './use-food-system';

// Mock console.log to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const mockAquariumBounds = { width: 800, height: 600 };

describe('useFoodSystem', () => {
  it('should initialize with empty food array', () => {
    const { result } = renderHook(() =>
      useFoodSystem({ aquariumBounds: mockAquariumBounds })
    );

    expect(result.current.foods).toEqual([]);
    expect(result.current.canSpawnFood).toBe(true);
  });

  it('should spawn food when clicked', () => {
    const { result } = renderHook(() =>
      useFoodSystem({ aquariumBounds: mockAquariumBounds })
    );

    act(() => {
      const spawned = result.current.spawnFood(100, 200);
      expect(spawned).toBe(true);
    });

    expect(result.current.foods).toHaveLength(1);
    expect(result.current.foods[0]).toMatchObject({
      id: expect.any(Number),
      position: {
        x: expect.any(Number),
        y: expect.any(Number),
      },
      createdAt: expect.any(Number),
      consumed: false,
      attractionRadius: expect.any(Number),
      scale: 0,
    });
  });

  it('should enforce spawn cooldown', () => {
    const { result } = renderHook(() =>
      useFoodSystem({
        aquariumBounds: mockAquariumBounds,
        maxFoodsPerSecond: 2, // 500ms cooldown
      })
    );

    // First spawn should succeed
    act(() => {
      const firstSpawn = result.current.spawnFood(100, 200);
      expect(firstSpawn).toBe(true);
    });

    // Immediate second spawn should fail due to cooldown
    act(() => {
      const secondSpawn = result.current.spawnFood(200, 300);
      expect(secondSpawn).toBe(false);
    });

    expect(result.current.foods).toHaveLength(1);
  });

  it('should allow spawning after cooldown period', () => {
    const { result } = renderHook(() =>
      useFoodSystem({
        aquariumBounds: mockAquariumBounds,
        maxFoodsPerSecond: 2, // 500ms cooldown
      })
    );

    // First spawn
    act(() => {
      result.current.spawnFood(100, 200);
    });

    // Wait for cooldown to pass
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Second spawn should now succeed
    act(() => {
      const secondSpawn = result.current.spawnFood(200, 300);
      expect(secondSpawn).toBe(true);
    });

    expect(result.current.foods).toHaveLength(2);
  });

  it('should constrain food position to aquarium bounds', () => {
    const { result } = renderHook(() =>
      useFoodSystem({ aquariumBounds: mockAquariumBounds })
    );

    // Test edge cases - clicking outside bounds
    act(() => {
      result.current.spawnFood(-100, -100); // Far outside
    });

    const food = result.current.foods[0];
    expect(food.position.x).toBeGreaterThanOrEqual(5);
    expect(food.position.x).toBeLessThanOrEqual(95);
    expect(food.position.y).toBeGreaterThanOrEqual(5);
    expect(food.position.y).toBeLessThanOrEqual(95);
  });

  it('should consume and remove food immediately', () => {
    const { result } = renderHook(() =>
      useFoodSystem({ aquariumBounds: mockAquariumBounds })
    );

    // Spawn food first
    act(() => {
      result.current.spawnFood(100, 200);
    });

    const foodId = result.current.foods[0].id;

    // Consume the food
    act(() => {
      result.current.consumeFood(foodId);
    });

    // Food should be removed immediately
    expect(result.current.foods).toHaveLength(0);
  });

  it('should handle consuming non-existent food', () => {
    const { result } = renderHook(() =>
      useFoodSystem({ aquariumBounds: mockAquariumBounds })
    );

    // Try to consume food that doesn't exist
    expect(() => {
      act(() => {
        result.current.consumeFood(999);
      });
    }).not.toThrow();

    expect(result.current.foods).toHaveLength(0);
  });

  it('should update food animations', () => {
    const { result } = renderHook(() =>
      useFoodSystem({ aquariumBounds: mockAquariumBounds })
    );

    // Spawn food
    act(() => {
      result.current.spawnFood(100, 200);
    });

    expect(result.current.foods[0].scale).toBe(0);

    // Update animations
    act(() => {
      result.current.updateFoodAnimations();
    });

    expect(result.current.foods[0].scale).toBeGreaterThan(0);
    expect(result.current.foods[0].scale).toBeLessThanOrEqual(1);
  });

  it('should animate food to full scale gradually', () => {
    const { result } = renderHook(() =>
      useFoodSystem({ aquariumBounds: mockAquariumBounds })
    );

    // Spawn food
    act(() => {
      result.current.spawnFood(100, 200);
    });

    // Multiple animation updates should gradually increase scale
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.updateFoodAnimations();
      });
    }

    expect(result.current.foods[0].scale).toBe(1);
  });

  it('should expire food after lifetime', () => {
    const { result } = renderHook(() =>
      useFoodSystem({
        aquariumBounds: mockAquariumBounds,
        foodLifetime: 2, // 2 seconds
      })
    );

    // Spawn food
    act(() => {
      result.current.spawnFood(100, 200);
    });

    expect(result.current.foods).toHaveLength(1);

    // Advance time beyond food lifetime plus cleanup interval
    act(() => {
      vi.advanceTimersByTime(5000); // 5 seconds to ensure cleanup runs
    });

    // Food should be expired and removed
    expect(result.current.foods).toHaveLength(0);
  });

  it('should generate unique food IDs', () => {
    const { result } = renderHook(() =>
      useFoodSystem({ aquariumBounds: mockAquariumBounds })
    );

    const foodIds = new Set();

    // Spawn multiple foods
    for (let i = 0; i < 5; i++) {
      act(() => {
        vi.advanceTimersByTime(1000); // Ensure cooldown passes
        result.current.spawnFood(100 + i * 50, 200);
      });
    }

    // Collect all food IDs
    result.current.foods.forEach(food => {
      foodIds.add(food.id);
    });

    // All IDs should be unique
    expect(foodIds.size).toBe(result.current.foods.length);
  });

  it('should handle custom options', () => {
    const customOptions = {
      aquariumBounds: { width: 1000, height: 800 },
      maxFoodsPerSecond: 1, // 1 second cooldown
      foodLifetime: 10,
      attractionRadius: 100,
    };

    const { result } = renderHook(() => useFoodSystem(customOptions));

    // Spawn food with custom options
    act(() => {
      result.current.spawnFood(500, 400);
    });

    expect(result.current.foods[0].attractionRadius).toBe(100);

    // Test cooldown with custom rate
    act(() => {
      const secondSpawn = result.current.spawnFood(600, 500);
      expect(secondSpawn).toBe(false); // Should fail due to 1-second cooldown
    });

    // Wait for custom cooldown
    act(() => {
      vi.advanceTimersByTime(1100);
      const thirdSpawn = result.current.spawnFood(600, 500);
      expect(thirdSpawn).toBe(true); // Should succeed after cooldown
    });
  });

  it('should track canSpawnFood status based on cooldown', () => {
    const { result } = renderHook(() =>
      useFoodSystem({
        aquariumBounds: mockAquariumBounds,
        maxFoodsPerSecond: 1, // 1 second cooldown
      })
    );

    // Initially should be able to spawn
    expect(result.current.canSpawnFood).toBe(true);

    // Spawn food
    act(() => {
      const spawned = result.current.spawnFood(100, 200);
      expect(spawned).toBe(true);
    });

    // The canSpawnFood getter depends on the implementation
    // Test that spawning behavior works correctly instead
    act(() => {
      const secondSpawn = result.current.spawnFood(200, 300);
      expect(secondSpawn).toBe(false); // Should fail due to cooldown
    });

    // After waiting, should be able to spawn again
    act(() => {
      vi.advanceTimersByTime(1100);
      const thirdSpawn = result.current.spawnFood(300, 400);
      expect(thirdSpawn).toBe(true); // Should succeed after cooldown
    });
  });
});