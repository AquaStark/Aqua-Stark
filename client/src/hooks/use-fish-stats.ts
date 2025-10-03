import { useState, useEffect } from 'react';

interface GameState {
  happiness: number;
  food: number;
  energy: number;
}

/**
 * Custom hook to manage the stats of a fish (happiness, food, energy).
 * The stats are randomly updated every 5 seconds with values between -5 and +5,
 * and always clamped between 0 and 100.
 *
 * @example
 * ```tsx
 * const { happiness, food, energy } = useFishStats({
 *   happiness: 80,
 *   food: 70,
 *   energy: 90
 * });
 *
 * console.log(happiness, food, energy);
 * ```
 *
 * @param {GameState} initialState - Initial values for the fish stats.
 * @returns {{ happiness: number; food: number; energy: number }} The current fish stats.
 */
export function useFishStats(initialState: GameState) {
  const [happiness, setHappiness] = useState(initialState.happiness);
  const [food, setFood] = useState(initialState.food);
  const [energy, setEnergy] = useState(initialState.energy);

  /**
   * Effect that runs once to periodically update fish stats.
   * Every 5 seconds, one of the stats (happiness, food, energy) is randomly selected
   * and modified by a random value between -5 and +5.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * 3);
      const change = Math.floor(Math.random() * 11) - 5; // random value between -5 and +5

      if (random === 0) {
        setHappiness(prev => Math.min(Math.max(0, prev + change), 100));
      } else if (random === 1) {
        setFood(prev => Math.min(Math.max(0, prev + change), 100));
      } else {
        setEnergy(prev => Math.min(Math.max(0, prev + change), 100));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { happiness, food, energy };
}
