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

function coerceDate(input: Date | string | number | null | undefined): Date | null {
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

  const feed = useCallback<UseFishIndicatorsReturn['feed']>(
    (boost, fedAt) => {
      setIndicators(prev => {
        const next = feedIndicators(
          prev,
          boost ?? optionsRef.current.feedingBoost,
          optionsRef.current
        );
        return { ...next, lastFedAt: fedAt ? coerceDate(fedAt) : new Date() } as FishIndicatorState;
      });
    },
    []
  );

  const setCleanliness = useCallback<UseFishIndicatorsReturn['setCleanliness']>(
    value => {
      setCleanlinessState(Math.max(0, Math.min(100, value)));
    },
    []
  );

  const reset = useCallback<UseFishIndicatorsReturn['reset']>(state => {
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
  }, [cleanliness]);

  return {
    indicators,
    feed,
    setCleanliness,
    reset,
  };
}

export type { FishIndicatorState };
