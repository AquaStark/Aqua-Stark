import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameActions } from './useGameActions';

// Mock setTimeout
vi.useFakeTimers();

describe('useGameActions', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  it('should return all game action functions', () => {
    const { result } = renderHook(() => useGameActions());

    expect(result.current.feedFish).toBeDefined();
    expect(result.current.cleanAquarium).toBeDefined();
    expect(result.current.collectRewards).toBeDefined();
    expect(result.current.upgradeAquarium).toBeDefined();
    expect(result.current.dailyMaintenance).toBeDefined();
  });

  it('should execute feedFish action', async () => {
    const { result } = renderHook(() => useGameActions());

    const promise = result.current.feedFish('fish123');

    // Fast-forward timers
    vi.runAllTimers();

    const result_data = await promise;
    expect(result_data).toEqual({ hash: '0x123...' });
  });

  it('should execute cleanAquarium action', async () => {
    const { result } = renderHook(() => useGameActions());

    const promise = result.current.cleanAquarium();

    // Fast-forward timers
    vi.runAllTimers();

    const result_data = await promise;
    expect(result_data).toEqual({ hash: '0x123...' });
  });

  it('should execute collectRewards action', async () => {
    const { result } = renderHook(() => useGameActions());

    const promise = result.current.collectRewards();

    // Fast-forward timers
    vi.runAllTimers();

    const result_data = await promise;
    expect(result_data).toEqual({ hash: '0x123...' });
  });

  it('should execute upgradeAquarium action', async () => {
    const { result } = renderHook(() => useGameActions());

    const promise = result.current.upgradeAquarium('filter');

    // Fast-forward timers
    vi.runAllTimers();

    const result_data = await promise;
    expect(result_data).toEqual({ hash: '0x123...' });
  });

  it('should execute dailyMaintenance action', async () => {
    const { result } = renderHook(() => useGameActions());

    const promise = result.current.dailyMaintenance(['fish1', 'fish2']);

    // Fast-forward timers
    vi.runAllTimers();

    const result_data = await promise;
    expect(result_data).toEqual({ hash: '0x123...' });
  });
});
