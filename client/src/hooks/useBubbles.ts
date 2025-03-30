import { useState, useEffect } from "react";

export interface Bubble {
  id: number;
  size: number;
  left: number;
  animationDuration: number;
}

interface UseBubblesOptions {
  initialCount?: number;
  maxBubbles?: number;
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
  interval?: number;
}

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
    // Create initial bubbles
    const createInitialBubbles = () => {
      const newBubbles = Array.from({ length: initialCount }, (_, i) => ({
        id: Date.now() + i,
        size: Math.random() * (maxSize - minSize) + minSize,
        left: Math.random() * 100,
        animationDuration:
          Math.random() * (maxDuration - minDuration) + minDuration,
      }));

      setBubbles(newBubbles);
    };

    createInitialBubbles();

    // Continuously add new bubbles
    const intervalId = setInterval(() => {
      const newBubble = {
        id: Date.now(),
        size: Math.random() * (maxSize - minSize) + minSize,
        left: Math.random() * 100,
        animationDuration:
          Math.random() * (maxDuration - minDuration) + minDuration,
      };

      setBubbles((prev) => {
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
