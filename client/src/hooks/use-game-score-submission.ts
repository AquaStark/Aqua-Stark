import { useCallback, useRef } from 'react';
import { useMinigameApi } from './use-minigame-api';

/**
 * Hook for automatically submitting game scores when games end
 * Wraps the minigame API to provide a simple interface for score submission
 */
export function useGameScoreSubmission(gameType: string) {
  const { submitScore, loading, error } = useMinigameApi();
  const isSubmittingRef = useRef(false);

  /**
   * Submit score when game ends
   * This should be called from the game's onGameOver callback
   */
  const handleGameOver = useCallback(
    async (finalScore: number) => {
      // Prevent multiple submissions
      if (isSubmittingRef.current) {
        return;
      }

      if (finalScore <= 0) {
        // Don't submit zero or negative scores
        return;
      }

      try {
        isSubmittingRef.current = true;
        await submitScore(gameType, finalScore);

        // Show success notification (optional, can be removed if too noisy)
        // toast.success(`Score submitted: ${finalScore} points!`);
      } catch (err) {
        console.error('Failed to submit score:', err);
        // Don't show error to user - score is still saved locally
        // toast.error('Failed to submit score to leaderboard');
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [gameType, submitScore]
  );

  return {
    handleGameOver,
    loading,
    error,
  };
}
