import { useState, useEffect } from 'react';

/**
 * @file use-bubbles.ts
 * @description
 * A custom hook for generating and managing a dynamic array of "bubbles" for UI animations.
 * This hook is ideal for creating visual effects like floating bubbles or particles in the background of a component.
 * It automatically handles the creation of new bubbles and limits their total count to maintain performance.
 *
 * @category Hooks
 */

export interface Bubble {
  /** A unique identifier for the bubble. */
  id: number;
  /** The size of the bubble in pixels. */
  size: number;
  /** The horizontal starting position of the bubble as a percentage. */
  left: number;
  /** The duration of the bubble's animation in seconds. */
  animationDuration: number;
}

interface UseBubblesOptions {
  /** The number of bubbles to create initially. Defaults to 25. */
  initialCount?: number;
  /** The maximum number of bubbles that can exist at any one time. Defaults to 40. */
  maxBubbles?: number;
  /** The minimum size of a bubble in pixels. Defaults to 10. */
  minSize?: number;
  /** The maximum size of a bubble in pixels. Defaults to 40. */
  maxSize?: number;
  /** The minimum duration of a bubble's animation in seconds. Defaults to 5. */
  minDuration?: number;
  /** The maximum duration of a bubble's animation in seconds. Defaults to 20. */
  maxDuration?: number;
  /** The interval in milliseconds at which new bubbles are created. Defaults to 300. */
  interval?: number;
}

/**
 * A custom hook that generates and manages a dynamic array of `Bubble` objects for animated backgrounds or effects.
 *
 * This hook provides a continuous stream of bubble data, automatically adding new bubbles at a set interval
 * and capping the total number of bubbles to prevent performance degradation. The properties of each
 * bubble (size, position, and animation duration) are randomized within the specified ranges.
 *
 * @param {UseBubblesOptions} [options={}] - An object to configure the bubble generation parameters.
 * @param {number} [options.initialCount=25] - The number of bubbles to generate on initial render.
 * @param {number} [options.maxBubbles=40] - The maximum number of bubbles to maintain in the array.
 * @param {number} [options.minSize=10] - The minimum possible size (diameter) for a bubble.
 * @param {number} [options.maxSize=40] - The maximum possible size (diameter) for a bubble.
 * @param {number} [options.minDuration=5] - The minimum animation duration in seconds.
 * @param {number} [options.maxDuration=20] - The maximum animation duration in seconds.
 * @param {number} [options.interval=300] - The time in milliseconds between the creation of new bubbles.
 * @returns {Bubble[]} An array of `Bubble` objects.
 *
 * @example
 * ```tsx
 * import { useBubbles } from '@/hooks/use-bubbles';
 *
 * const BubblesBackground = () => {
 * const bubbles = useBubbles({ initialCount: 15, maxBubbles: 30, interval: 500 });
 *
 * return (
 * <div className="relative w-full h-full overflow-hidden">
 * {bubbles.map(bubble => (
 * <div
 * key={bubble.id}
 * className="bubble-style"
 * style={{
 * '--size': `${bubble.size}px`,
 * '--left': `${bubble.left}%`,
 * '--duration': `${bubble.animationDuration}s`,
 * }}
 * />
 * ))}
 * </div>
 * );
 * };
 * ```
 */
export function useBubbles({
  initialCount = 25,
  maxBubbles = 40,
  minSize = 10,
  maxSize = 40,
  minDuration = 5,
  maxDuration = 20,
  interval = 300,
}: UseBubblesOptions = {}) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const createBubble = (idOffset = 0): Bubble => ({
      id: Date.now() + idOffset,
      size: Math.random() * (maxSize - minSize) + minSize,
      left: Math.random() * 100,
      animationDuration:
        Math.random() * (maxDuration - minDuration) + minDuration,
    });

    const initialBubbles = Array.from({ length: initialCount }, (_, i) =>
      createBubble(i)
    );
    setBubbles(initialBubbles);

    const intervalId = setInterval(() => {
      const newBubble = createBubble();
      setBubbles(prev => {
        const filtered =
          prev.length > maxBubbles ? prev.slice(-maxBubbles) : prev;
        return [...filtered, newBubble];
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [
    initialCount,
    maxBubbles,
    minSize,
    maxSize,
    minDuration,
    maxDuration,
    interval,
  ]);

  return bubbles;
}
