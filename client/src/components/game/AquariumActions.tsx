import { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { useGameActions } from '@/hooks';
import { toast } from 'sonner';

export function AquariumActions() {
  const { isConnected } = useAccount();
  const {
    feedFish,
    cleanAquarium,
    collectRewards,
    dailyMaintenance,
    upgradeAquarium,
  } = useGameActions();

  const [isLoading, setIsLoading] = useState(false);
  const [fishIds] = useState(['1', '2', '3']); // Example fish IDs

  if (!isConnected) {
    return (
      <div className='p-6 bg-gray-800 rounded-lg'>
        <h3 className='text-white text-lg font-semibold mb-4'>
          🎮 Gaming Actions
        </h3>
        <p className='text-gray-400'>
          Connect your wallet to access gaming actions
        </p>
      </div>
    );
  }

  const handleAction = async (
    action: () => Promise<any>,
    actionName: string
  ) => {
    setIsLoading(true);
    try {
      await action();
      toast.success(`${actionName} completed successfully!`);
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      toast.error(`Failed to ${actionName.toLowerCase()}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-6 bg-gray-800 rounded-lg'>
      <h3 className='text-white text-lg font-semibold mb-4 flex items-center gap-2'>
        🎮 Gaming Actions
        <span className='text-xs bg-green-500 text-white px-2 py-1 rounded-full'>
          Session Keys Active
        </span>
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Basic Actions */}
        <div className='space-y-3'>
          <h4 className='text-white font-medium'>Basic Actions</h4>

          <button
            onClick={() => handleAction(() => feedFish('1'), 'Feed Fish')}
            disabled={isLoading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50'
          >
            🐟 Feed Fish
          </button>

          <button
            onClick={() =>
              handleAction(() => cleanAquarium(), 'Clean Aquarium')
            }
            disabled={isLoading}
            className='w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50'
          >
            🧹 Clean Aquarium
          </button>

          <button
            onClick={() =>
              handleAction(() => collectRewards(), 'Collect Rewards')
            }
            disabled={isLoading}
            className='w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50'
          >
            💰 Collect Rewards
          </button>
        </div>

        {/* Advanced Actions */}
        <div className='space-y-3'>
          <h4 className='text-white font-medium'>Advanced Actions</h4>

          <button
            onClick={() =>
              handleAction(() => dailyMaintenance(fishIds), 'Daily Maintenance')
            }
            disabled={isLoading}
            className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50'
          >
            ⚡ Daily Maintenance (Batch)
          </button>

          <button
            onClick={() =>
              handleAction(() => upgradeAquarium('filter'), 'Upgrade Filter')
            }
            disabled={isLoading}
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50'
          >
            🔧 Upgrade Filter
          </button>

          <button
            onClick={() =>
              handleAction(() => upgradeAquarium('size'), 'Upgrade Size')
            }
            disabled={isLoading}
            className='w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50'
          >
            📏 Upgrade Size
          </button>
        </div>
      </div>

      {/* Información de session keys */}
      <div className='mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg'>
        <h5 className='text-green-400 font-medium mb-2'>
          🎯 Session Keys Active
        </h5>
        <p className='text-green-300 text-sm'>
          All actions are executed automatically without popups. Gas fees are
          covered by Cartridge. Perfect for seamless gaming experience!
        </p>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className='mt-4 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
          <span className='ml-2 text-white'>Processing transaction...</span>
        </div>
      )}
    </div>
  );
}
