import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @file use-debounce.ts
 * @description
 * A versatile custom hook for debouncing a value. It delays the update of a state value
 * until a specified period of inactivity, which is useful for performance optimization
 * in scenarios like search bars, input validation, and window resizing. This hook
 * includes advanced controls like `cancel`, `reset`, and `flush`.
 *
 * @category Hooks
 */

/**
 * Configuration options for the debounce hook.
 */
interface UseDebounceOptions {
  /** The delay in milliseconds before the value is updated. */
  delay?: number;
  /** Whether to update the value immediately on first call. */
  immediate?: boolean;
  /** Maximum number of times the debounce can be called. */
  maxCalls?: number;
}

/**
 * Return type for the useDebounce hook.
 * @template T - The type of the debounced value.
 */
interface UseDebounceReturn<T> {
  /** The debounced value. */
  debouncedValue: T;
  /** Function to cancel the current debounce. */
  cancel: () => void;
  /** Function to reset the debounce to the original value. */
  reset: () => void;
  /** Function to flush the debounce immediately. */
  flush: () => void;
  /** Whether the debounce is currently pending. */
  isPending: boolean;
}

/**
 * A custom hook for debouncing a value with advanced control options.
 *
 * This hook returns a debounced version of the input `value`. It delays the
 * update of the `debouncedValue` state until a specified `delay` has passed
 * without a new change to the input `value`.
 *
 * It also provides utility functions to manually control the debounce process,
 * such as `cancel`, `reset`, and `flush`, which gives more granular control
 * over when the debounced value is updated.
 *
 * @template T - The type of the value to debounce.
 * @param {T} value - The value to debounce.
 * @param {UseDebounceOptions | number} [options={}] - Configuration options for the debounce behavior. Can be an object or a number representing the delay.
 * @returns {UseDebounceReturn<T>} Object containing the debounced value and control functions.
 *
 * @example
 * ```tsx
 * const { debouncedValue, cancel, reset, flush, isPending } = useDebounce(
 * searchQuery,
 * { delay: 300, immediate: false }
 * );
 *
 * // Cancel current debounce
 * cancel();
 *
 * // Reset to original value
 * reset();
 *
 * // Flush immediately
 * flush();
 * ```
 *
 * @example
 * ```tsx
 * // Simple usage with just delay
 * const debouncedValue = useDebounce(inputValue, { delay: 500 });
 * ```
 */
export function useDebounce<T>(
  value: T,
  options: UseDebounceOptions | number = {}
): UseDebounceReturn<T> {
  // Normalize options - support both object and number for backward compatibility
  const normalizedOptions: Required<UseDebounceOptions> =
    typeof options === 'number'
      ? { delay: options, immediate: false, maxCalls: Infinity }
      : {
          delay: options.delay ?? 300,
          immediate: options.immediate ?? false,
          maxCalls: options.maxCalls ?? Infinity,
        };

  // Parameter validation
  if (normalizedOptions.delay < 0) {
    throw new Error('useDebounce: delay must be a non-negative number');
  }

  if (normalizedOptions.maxCalls < 1) {
    throw new Error('useDebounce: maxCalls must be a positive number');
  }

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callCountRef = useRef(0);
  const originalValueRef = useRef(value);

  // Update original value reference when value changes
  useEffect(() => {
    originalValueRef.current = value;
  }, [value]);

  /**
   * Cancels the current pending debounce. The debounced value is not updated.
   * @returns {void}
   */
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsPending(false);
    }
  }, []);

  /**
   * Resets the debounced value to the original input value and clears any pending debounces.
   * @returns {void}
   */
  const reset = useCallback(() => {
    cancel();
    setDebouncedValue(originalValueRef.current);
    callCountRef.current = 0;
  }, [cancel]);

  /**
   * Immediately updates the debounced value with the latest input value and clears any pending debounces.
   * @returns {void}
   */
  const flush = useCallback(() => {
    cancel();
    setDebouncedValue(value);
    callCountRef.current = 0;
  }, [cancel, value]);

  // Main debounce effect
  useEffect(() => {
    // Check if we've exceeded max calls
    if (callCountRef.current >= normalizedOptions.maxCalls) {
      return;
    }

    // Handle immediate option
    if (normalizedOptions.immediate && callCountRef.current === 0) {
      setDebouncedValue(value);
      callCountRef.current++;
      return;
    }

    // Set pending state
    setIsPending(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsPending(false);
      callCountRef.current++;
      timeoutRef.current = null;
    }, normalizedOptions.delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsPending(false);
    };
  }, [
    value,
    normalizedOptions.delay,
    normalizedOptions.immediate,
    normalizedOptions.maxCalls,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    debouncedValue,
    cancel,
    reset,
    flush,
    isPending,
  };
}
