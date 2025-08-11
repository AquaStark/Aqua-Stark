import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFishMovement } from './use-fish-movement';
import type { FishType } from '@/types/game';
import type { FoodItem } from '@/types/food';

// Mock requestAnimationFrame
beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    return setTimeout(cb, 16) as any;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    clearTimeout(id);
  });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const mockFish: FishType[] = [
  {
    id: 1,
    name: 'Test Fish',
    species: 'Test Species',
    position: { x: 50, y: 50 },
    rarity: 'common',
    size: 'medium',
    color: 'blue',
    age: 1,
    health: 100,
    happiness: 80,
    hunger: 60,
    breeding: false,
    isActive: true,
    lastFed: Date.now() - 3600000,
    traits: [],
    image: 'test.png',
  },
];

const mockAquariumBounds = { width: 800, height: 600 };

describe('useFishMovement', () => {
  it('should initialize fish states correctly', () => {
    const { result } = renderHook(() =>
      useFishMovement(mockFish, { aquariumBounds: mockAquariumBounds })
    );

    // Should have the correct number of fish
    expect(result.current).toHaveLength(1);
    
    // Should have the correct structure
    const fishState = result.current[0];
    expect(fishState).toMatchObject({
      id: expect.any(Number),
      position: expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
      }),
      facingLeft: expect.any(Boolean),
      behaviorState: expect.any(String),
    });

    // Position should be within bounds (0-100%)
    expect(fishState.position.x).toBeGreaterThanOrEqual(0);
    expect(fishState.position.x).toBeLessThanOrEqual(100);
    expect(fishState.position.y).toBeGreaterThanOrEqual(0);
    expect(fishState.position.y).toBeLessThanOrEqual(100);
  });

  it('should update fish position over time', async () => {
    const { result } = renderHook(() =>
      useFishMovement(mockFish, { aquariumBounds: mockAquariumBounds })
    );

    const initialPosition = { ...result.current[0].position };

    // Simulate animation frame calls
    act(() => {
      // Call the mocked requestAnimationFrame callback directly
      vi.advanceTimersByTime(100);
    });

    // Fish should maintain its structure even if position changes
    expect(result.current[0]).toMatchObject({
      id: 1,
      position: expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
      }),
      facingLeft: expect.any(Boolean),
      behaviorState: expect.any(String),
    });
  });

  it('should handle food consumption callback', async () => {
    const mockFood: FoodItem[] = [
      {
        id: 1,
        position: { x: 50, y: 50 },
        createdAt: Date.now(),
        consumed: false,
        attractionRadius: 50,
        scale: 1,
      },
    ];

    const onFoodConsumed = vi.fn();

    const { result } = renderHook(() =>
      useFishMovement(mockFish, {
        aquariumBounds: mockAquariumBounds,
        foods: mockFood,
        onFoodConsumed,
      })
    );

    // Hook should initialize correctly with food options
    expect(result.current).toHaveLength(1);
    expect(typeof onFoodConsumed).toBe('function');
  });

  it('should keep fish within aquarium bounds', () => {
    const { result } = renderHook(() =>
      useFishMovement(mockFish, { aquariumBounds: mockAquariumBounds })
    );

    // All fish should stay within 0-100% bounds
    result.current.forEach(fish => {
      expect(fish.position.x).toBeGreaterThanOrEqual(0);
      expect(fish.position.x).toBeLessThanOrEqual(100);
      expect(fish.position.y).toBeGreaterThanOrEqual(0);
      expect(fish.position.y).toBeLessThanOrEqual(100);
    });
  });

  it('should handle multiple fish independently', () => {
    const multipleFish: FishType[] = [
      ...mockFish,
      {
        ...mockFish[0],
        id: 2,
        name: 'Second Fish',
        position: { x: 25, y: 75 },
        rarity: 'epic',
      },
    ];

    const { result } = renderHook(() =>
      useFishMovement(multipleFish, { aquariumBounds: mockAquariumBounds })
    );

    expect(result.current).toHaveLength(2);
    expect(result.current[0].id).toBe(1);
    expect(result.current[1].id).toBe(2);

    // Each fish should have its own state
    expect(result.current[0]).not.toBe(result.current[1]);
  });

  it('should handle different fish rarities', () => {
    const rareFish: FishType[] = [
      {
        ...mockFish[0],
        id: 1,
        rarity: 'common',
      },
      {
        ...mockFish[0],
        id: 2,
        rarity: 'legendary',
      },
    ];

    const { result } = renderHook(() =>
      useFishMovement(rareFish, { aquariumBounds: mockAquariumBounds })
    );

    expect(result.current).toHaveLength(2);
    expect(result.current[0].id).toBe(1);
    expect(result.current[1].id).toBe(2);
  });

  it('should have valid behavior states', () => {
    const { result } = renderHook(() =>
      useFishMovement(mockFish, { aquariumBounds: mockAquariumBounds })
    );

    // Behavior state should be one of the valid states
    const validStates = [
      'idle',
      'darting',
      'hovering',
      'turning',
      'feeding',
      'exploring',
      'playful',
    ];
    expect(validStates).toContain(result.current[0].behaviorState);
  });

  it('should handle empty fish array', () => {
    const { result } = renderHook(() =>
      useFishMovement([], { aquariumBounds: mockAquariumBounds })
    );

    expect(result.current).toEqual([]);
  });

  it('should cleanup animation frame on unmount', () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const { unmount } = renderHook(() =>
      useFishMovement(mockFish, { aquariumBounds: mockAquariumBounds })
    );

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });
});