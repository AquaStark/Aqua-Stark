import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  FishIndicatorOptions,
  FishIndicatorState,
  IndicatorValue,
  UseFishIndicatorsParams,
  UseFishIndicatorsReturn,
} from '@/types/fishIndicators';
import {
  DEFAULT_OPTIONS,
  computeHappiness,
  computeNextIndicators,
  feedIndicators,
} from '@/utils/fishIndicators';

/**
 * Converts various input types to a valid Date object or null.
 *
 * @param {Date | string | number | null | undefined} input - The input to convert.
 * @returns {Date | null} A valid Date object or null if the input is invalid.
 */
function coerceDate(
  input: Date | string | number | null | undefined
): Date | null {
  if (!input && input !== 0) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

const DEFAULT_STATE: FishIndicatorState = {
  hunger: 85,
  energy: 80,
  happiness: 82,
  lastFedAt: null,
  lastUpdatedAt: null,
};

/**
 * Custom hook to manage and simulate fish indicator states over time.
 *
 * This hook handles the core logic for fish well-being indicators including
 * hunger, energy, happiness, and cleanliness. It automatically updates indicators
 * at regular intervals based on configurable decay rates and provides methods
 * to feed the fish or adjust tank cleanliness.
 *
 * The happiness indicator is dynamically computed based on the other three indicators
 * using configurable weights, ensuring realistic simulation of fish mood.
 *
 * @param {UseFishIndicatorsParams} params - Configuration parameters for the hook.
 * @param {Partial<FishIndicatorState>} [params.initial] - Initial indicator values to override defaults.
 * @param {Date | string | number | null} [params.lastFedTimestamp] - Timestamp when the fish was last fed.
 * @param {Date | string | number | null} [params.lastUpdated] - Timestamp of the last state update.
 * @param {IndicatorValue} [params.cleanliness=100] - Initial cleanliness level (0-100).
 * @param {Partial<FishIndicatorOptions>} [params.options] - Override default simulation options.
 * @param {(state: FishIndicatorState) => void} [params.onChange] - Callback invoked when indicators change.
 *
 * @returns {UseFishIndicatorsReturn} An object containing the current indicators and control functions.
 *
 * @example
 * ```tsx
 * const { indicators, feed, setCleanliness } = useFishIndicators({
 *   initial: { hunger: 70, energy: 90 },
 *   cleanliness: 95,
 *   onChange: (state) => console.log('Fish state updated:', state)
 * });
 *
 * // Feed the fish with default boost
 * feed();
 *
 * // Set tank cleanliness to 80%
 * setCleanliness(80);
 * ```
 */
export function useFishIndicators(
  params: UseFishIndicatorsParams
): UseFishIndicatorsReturn {
  const {
    initial,
    lastFedTimestamp,
    lastUpdated,
    cleanliness: initialCleanliness = 100,
    options: partialOptions,
    onChange,
  } = params;

  const options: FishIndicatorOptions = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...(partialOptions || {}) }),
    [partialOptions]
  );

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const [cleanliness, setCleanlinessState] = useState<IndicatorValue>(
    Math.max(0, Math.min(100, initialCleanliness))
  );

  const [indicators, setIndicators] = useState<FishIndicatorState>(() => {
    const fedAt = coerceDate(lastFedTimestamp);
    const updatedAt = coerceDate(lastUpdated);

    const base: FishIndicatorState = {
      ...DEFAULT_STATE,
      ...initial,
      lastFedAt: fedAt,
      lastUpdatedAt: updatedAt,
    } as FishIndicatorState;

    // normalize happiness based on current hunger/energy/cleanliness
    const normalizedHappiness = computeHappiness(
      base.hunger,
      base.energy,
      cleanliness,
      (optionsRef.current || options).happinessWeights,
      (optionsRef.current || options).clampMin,
      (optionsRef.current || options).clampMax
    );

    return { ...base, happiness: normalizedHappiness };
  });

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // interval tick to compute next indicators
  useEffect(() => {
    const tick = () => {
      setIndicators(prev =>
        computeNextIndicators(prev, new Date(), cleanliness, optionsRef.current)
      );
    };

    const id = setInterval(tick, options.tickMs);
    return () => clearInterval(id);
  }, [cleanliness, options.tickMs]);

  // emit onChange when indicators update
  useEffect(() => {
    onChangeRef.current?.(indicators);
  }, [indicators]);

  /**
   * Feeds the fish, increasing hunger and energy indicators.
   *
   * @param {number} [boost] - Custom feeding boost amount. Uses default if not provided.
   * @param {Date | string | number} [fedAt] - Timestamp of when the fish was fed. Defaults to now.
   */
  const feed = useCallback<UseFishIndicatorsReturn['feed']>((boost, fedAt) => {
    setIndicators(prev => {
      const next = feedIndicators(
        prev,
        boost ?? optionsRef.current.feedingBoost,
        optionsRef.current
      );
      return {
        ...next,
        lastFedAt: fedAt ? coerceDate(fedAt) : new Date(),
      } as FishIndicatorState;
    });
  }, []);

  /**
   * Updates the tank cleanliness level.
   *
   * @param {IndicatorValue} value - New cleanliness value (will be clamped between 0 and 100).
   */
  const setCleanliness = useCallback<UseFishIndicatorsReturn['setCleanliness']>(
    value => {
      setCleanlinessState(Math.max(0, Math.min(100, value)));
    },
    []
  );

  /**
   * Resets the fish indicators to a specified state or default values.
   *
   * @param {Partial<FishIndicatorState>} [state] - Partial state to reset to. Uses defaults if not provided.
   */
  const reset = useCallback<UseFishIndicatorsReturn['reset']>(
    state => {
      setIndicators(prev => {
        const merged: FishIndicatorState = {
          ...DEFAULT_STATE,
          ...prev,
          ...(state || {}),
        } as FishIndicatorState;

        const fedAt = coerceDate(merged.lastFedAt);
        const updatedAt = coerceDate(merged.lastUpdatedAt);

        merged.lastFedAt = fedAt;
        merged.lastUpdatedAt = updatedAt;

        merged.happiness = computeHappiness(
          merged.hunger,
          merged.energy,
          cleanliness,
          optionsRef.current.happinessWeights,
          optionsRef.current.clampMin,
          optionsRef.current.clampMax
        );

        return merged;
      });
    },
    [cleanliness]
  );

  return {
    indicators,
    feed,
    setCleanliness,
    reset,
  };
}

export type { FishIndicatorState };
