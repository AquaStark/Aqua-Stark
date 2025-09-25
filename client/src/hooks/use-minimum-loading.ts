import { useState, useCallback, useRef } from 'react';

/**
 * Hook for implementing minimum loading time logic
 * Ensures loading screen is shown for at least a minimum duration
 *
 * @param minDuration - Minimum time in milliseconds (default: 2500ms)
 * @returns Object with loading state and control functions
 *
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */
export function useMinimumLoading(minDuration: number = 2500) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startTimeRef = useRef<number>(0);
  const dataReadyRef = useRef<boolean>(false);

  // Start loading process
  const startLoading = useCallback(() => {
    startTimeRef.current = Date.now();
    dataReadyRef.current = false;
    setIsLoading(true);
    setIsDataReady(false);
    setIsComplete(false);
  }, []);

  // Check if minimum time has passed and data is ready
  const checkMinimumTime = useCallback(() => {
    if (!dataReadyRef.current) return;

    const elapsedTime = Date.now() - startTimeRef.current;
    const remainingTime = minDuration - elapsedTime;

    if (remainingTime > 0) {
      // Wait for remaining time before completing
      setTimeout(() => {
        setIsComplete(true);
        setIsLoading(false);
      }, remainingTime);
    } else {
      // Minimum time already passed, complete immediately
      setIsComplete(true);
      setIsLoading(false);
    }
  }, [minDuration]);

  // Mark data as ready
  const markDataReady = useCallback(() => {
    setIsDataReady(true);
    dataReadyRef.current = true;
    checkMinimumTime();
  }, [checkMinimumTime]);

  return {
    isLoading,
    isDataReady,
    isComplete,
    startLoading,
    markDataReady,
    checkMinimumTime,
  };
}

export default useMinimumLoading;
