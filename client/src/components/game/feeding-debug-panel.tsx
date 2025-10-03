'use client';

import { useState, useEffect } from 'react';
import type { FoodItem } from '@/types';

interface FeedingDebugPanelProps {
  foods: FoodItem[];
  isFeeding: boolean;
  onValidateState: () => void;
  className?: string;
}

export function FeedingDebugPanel({
  foods,
  isFeeding,
  onValidateState,
  className = '',
}: FeedingDebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Update timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeFoods = foods.filter(f => !f.consumed);
  const consumedFoods = foods.filter(f => f.consumed);

  const getFoodStatusColor = (food: FoodItem) => {
    if (food.consumed) return 'text-red-500';
    const age = (Date.now() - food.createdAt) / 1000;
    if (age > 8) return 'text-yellow-500';
    if (age > 5) return 'text-orange-500';
    return 'text-green-500';
  };

  const formatTime = (timestamp: number) => {
    const age = (Date.now() - timestamp) / 1000;
    return `${age.toFixed(1)}s ago`;
  };

  return (
    <div className={`${className}`}>
      {/* Collapsible Debug Panel */}
      <div className='bg-black/80 backdrop-blur-sm rounded-lg border border-blue-400/30 shadow-lg'>
        {/* Header */}
        <div
          className='flex items-center justify-between p-3 cursor-pointer hover:bg-blue-900/20 transition-colors'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className='flex items-center gap-2'>
            <div
              className={`w-3 h-3 rounded-full ${isFeeding ? 'bg-green-400' : 'bg-red-400'}`}
            />
            <span className='text-white font-mono text-sm'>Feeding Debug</span>
          </div>
          <div className='text-blue-400 text-xs'>{isExpanded ? '▼' : '▶'}</div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className='p-3 border-t border-blue-400/20 space-y-3'>
            {/* Status Overview */}
            <div className='space-y-2'>
              <div className='text-white text-xs font-semibold'>Status</div>
              <div className='grid grid-cols-2 gap-2 text-xs'>
                <div className='text-gray-300'>
                  Mode:{' '}
                  <span
                    className={isFeeding ? 'text-green-400' : 'text-red-400'}
                  >
                    {isFeeding ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className='text-gray-300'>
                  Active Foods:{' '}
                  <span className='text-blue-400'>{activeFoods.length}</span>
                </div>
                <div className='text-gray-300'>
                  Consumed:{' '}
                  <span className='text-red-400'>{consumedFoods.length}</span>
                </div>
                <div className='text-gray-300'>
                  Last Update:{' '}
                  <span className='text-yellow-400'>
                    {formatTime(lastUpdate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Foods */}
            {activeFoods.length > 0 && (
              <div className='space-y-2'>
                <div className='text-white text-xs font-semibold'>
                  Active Foods
                </div>
                <div className='space-y-1 max-h-32 overflow-y-auto'>
                  {activeFoods.map(food => (
                    <div
                      key={food.id}
                      className={`text-xs p-2 rounded bg-blue-900/30 border border-blue-400/20 ${getFoodStatusColor(food)}`}
                    >
                      <div className='flex justify-between'>
                        <span>ID: {food.id}</span>
                        <span>{formatTime(food.createdAt)}</span>
                      </div>
                      <div className='text-gray-300'>
                        Pos: ({food.position.x.toFixed(1)},{' '}
                        {food.position.y.toFixed(1)})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consumed Foods */}
            {consumedFoods.length > 0 && (
              <div className='space-y-2'>
                <div className='text-white text-xs font-semibold'>
                  Recently Consumed
                </div>
                <div className='space-y-1 max-h-24 overflow-y-auto'>
                  {consumedFoods.slice(-5).map(food => (
                    <div
                      key={food.id}
                      className='text-xs p-2 rounded bg-red-900/30 border border-red-400/20 text-red-300'
                    >
                      <div className='flex justify-between'>
                        <span>ID: {food.id}</span>
                        <span>{formatTime(food.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className='space-y-2'>
              <div className='text-white text-xs font-semibold'>Actions</div>
              <div className='flex gap-2'>
                <button
                  onClick={onValidateState}
                  className='px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors'
                >
                  Validate State
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className='px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors'
                >
                  Reload
                </button>
              </div>
            </div>

            {/* Warnings */}
            {activeFoods.length > 10 && (
              <div className='p-2 bg-yellow-900/30 border border-yellow-400/20 rounded'>
                <div className='text-yellow-300 text-xs'>
                  ⚠️ High food count: {activeFoods.length} active foods
                </div>
              </div>
            )}

            {consumedFoods.length > 20 && (
              <div className='p-2 bg-orange-900/30 border border-orange-400/20 rounded'>
                <div className='text-orange-300 text-xs'>
                  ⚠️ Many consumed foods: {consumedFoods.length} in memory
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
