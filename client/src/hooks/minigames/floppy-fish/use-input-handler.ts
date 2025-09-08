import { useEffect, useRef } from 'react';

export function useInputHandler(jump: () => void, gameOver: boolean) {
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameOver) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Only jump if click is inside game area
      if (
        gameAreaRef.current &&
        gameAreaRef.current.contains(e.target as Node)
      ) {
        jump();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      if (
        gameAreaRef.current &&
        gameAreaRef.current.contains(e.target as Node)
      ) {
        jump();
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('touchstart', handleTouch);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [jump, gameOver]);

  return { gameAreaRef };
}
