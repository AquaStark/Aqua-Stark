import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle player input in the Floppy Fish game.
 * Supports keyboard (Space), mouse clicks, and touch events inside the game area.
 *
 * @param {() => void} jump - Callback function triggered when the player jumps.
 * @param {boolean} gameOver - Flag indicating if the game has ended.
 * @returns {{ gameAreaRef: React.RefObject<HTMLDivElement> }}
 *   - `gameAreaRef`: Ref to the game container. Clicks/touches inside this area trigger jumps.
 *
 * @example
 * const { gameAreaRef } = useInputHandler(jump, gameOver);
 * return <div ref={gameAreaRef}>...</div>;
 */
export function useInputHandler(jump: () => void, gameOver: boolean) {
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameOver) return;

    /**
     * Handles keyboard input.
     * Triggers jump when Space key is pressed.
     *
     * @param {KeyboardEvent} e - The keyboard event object.
     */
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    /**
     * Handles mouse click input.
     * Triggers jump only if click is inside the game area.
     *
     * @param {MouseEvent} e - The mouse event object.
     */
    const handleClick = (e: MouseEvent) => {
      if (
        gameAreaRef.current &&
        gameAreaRef.current.contains(e.target as Node)
      ) {
        jump();
      }
    };

    /**
     * Handles touch input.
     * Triggers jump only if touch is inside the game area.
     *
     * @param {TouchEvent} e - The touch event object.
     */
    const handleTouch = (e: TouchEvent) => {
      if (
        gameAreaRef.current &&
        gameAreaRef.current.contains(e.target as Node)
      ) {
        jump();
      }
    };

    // Attach event listeners
    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('touchstart', handleTouch);

    // Cleanup event listeners on unmount or game over
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [jump, gameOver]);

  return { gameAreaRef };
}
