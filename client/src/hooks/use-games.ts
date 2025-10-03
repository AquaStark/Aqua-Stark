import { useState } from 'react';
import { mockFish, mockGames } from '@/data/mockdata-games';

/**
 * Hook that manages the state of available fish and games.
 * Provides utilities to select a fish and handle navigation to game pages.
 *
 * @example
 * ```tsx
 * const {
 *   availableFish,
 *   selectedFish,
 *   setSelectedFish,
 *   allGames,
 *   handleGameClick
 * } = useGames();
 *
 * // Selecting a fish
 * setSelectedFish(availableFish[1]);
 *
 * // Navigating to a game
 * handleGameClick(allGames[0]);
 * ```
 *
 * @returns {{
 *   availableFish: typeof mockFish;
 *   selectedFish: typeof mockFish[number];
 *   setSelectedFish: React.Dispatch<React.SetStateAction<typeof mockFish[number]>>;
 *   allGames: typeof mockGames;
 *   handleGameClick: (game: { id: string; link: string }) => void;
 * }} Hook API for managing fish and games.
 */
export function useGames() {
  /** List of available fish */
  const [availableFish] = useState(mockFish);

  /** Currently selected fish */
  const [selectedFish, setSelectedFish] = useState(mockFish[0]);

  /** All available games */
  const allGames = mockGames;

  /**
   * Handles redirection to a game page when clicked.
   *
   * @param {{ id: string; link: string }} game - The game object containing its ID and link.
   */
  const handleGameClick = (game: { id: string; link: string }) => {
    window.location.href = game.link;
  };

  return {
    availableFish,
    selectedFish,
    setSelectedFish,
    allGames,
    handleGameClick,
  };
}
