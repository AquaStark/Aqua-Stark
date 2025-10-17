import { useState, useEffect, useCallback } from 'react';

interface UsePulseAnimationOptions {
  duration?: number; // Duration in milliseconds
}

/**
 * Hook to trigger a pulse animation effect on an element.
 * The animation will run for the specified duration and then automatically stop.
 *
 * @param options - Configuration options for the pulse animation
 * @returns Object containing isPulsing state and triggerPulse function
 *
 * @example
 * ```tsx
 * const { isPulsing, triggerPulse } = usePulseAnimation({ duration: 3000 });
 *
 * <button
 *   onClick={triggerPulse}
 *   className={isPulsing ? 'animate-pulse-glow' : ''}
 * >
 *   Click me
 * </button>
 * ```
 */
export function usePulseAnimation(options: UsePulseAnimationOptions = {}) {
  const { duration = 3000 } = options;
  const [isPulsing, setIsPulsing] = useState(false);

  const triggerPulse = useCallback(() => {
    setIsPulsing(true);
  }, []);

  useEffect(() => {
    if (!isPulsing) return;

    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [isPulsing, duration]);

  return {
    isPulsing,
    triggerPulse,
  };
}
