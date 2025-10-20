'use client';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { Button } from '@/components/ui/button';
import { usePlayerValidation, useNotifications } from '@/hooks';
import { useState } from 'react';
import { ConnectWalletModal } from '@/components/modal/connect-wallet-modal';

interface HeroSectionProps {
  onTriggerPulse?: () => void;
}

export function HeroSection({ onTriggerPulse }: HeroSectionProps) {
  const { account } = useAccount();
  const navigate = useNavigate();
  const { validatePlayer, syncPlayerToBackend, isValidating } =
    usePlayerValidation();
  const { success, info } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleStartGame = async () => {
    console.log('🎮 handleStartGame called');
    console.log('Account:', account);

    if (!account) {
      console.log('❌ No account, showing connect modal');
      setShowConnectModal(true);
      if (onTriggerPulse) {
        onTriggerPulse();
      }
      return;
    }

    setIsProcessing(true);

    try {
      // Validate if user exists (on-chain and backend)
      console.log('🔍 Validating player:', account.address);
      const validation = await validatePlayer(account.address);

      console.log('📊 Validation result:', {
        exists: validation.exists,
        isOnChain: validation.isOnChain,
        isInBackend: validation.isInBackend,
        playerData: validation.playerData,
        backendData: validation.backendData,
      });

      if (validation.exists) {
        console.log('✅ Player exists, navigating to /game');

        // User exists - check if we need to sync to backend
        if (validation.isOnChain && !validation.isInBackend) {
          console.log('🔄 Syncing on-chain player to backend');
          try {
            if (validation.playerData) {
              await syncPlayerToBackend(validation.playerData, account.address);
            }
            success('Welcome back! Your data has been synced.');
          } catch (err) {
            console.error('Error syncing player to backend:', err);
            // Continue anyway, user can still play
          }
        } else {
          success('Welcome back!');
        }

        // Navigate to game
        navigate('/game');
      } else {
        console.log('🆕 New player, navigating to /start');
        // New user - go to registration
        navigate('/start');
      }
    } catch (err) {
      console.error('❌ Error validating player:', err);
      // On error, default to registration flow
      info('Starting registration process...');
      navigate('/start');
    } finally {
      setIsProcessing(false);
      console.log('🏁 handleStartGame finished');
    }
  };

  return (
    <>
      <section className='w-full text-center px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 max-w-4xl mx-auto'>
        <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-lg mb-3 sm:mb-4 md:mb-6'>
          <span className='inline-block animate-float'>
            Dive into the world of Aqua Stark!
          </span>
        </h1>
        <p className='text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-md sm:max-w-lg md:max-w-xl mx-auto drop-shadow-md leading-relaxed'>
          Breed, feed, and collect unique fish while customizing your aquarium
          in this incredible aquatic adventure.
        </p>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6'>
          <Button
            onClick={handleStartGame}
            disabled={isProcessing || isValidating}
            className='text-sm sm:text-base md:text-lg font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl md:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-green-300 disabled:opacity-50 disabled:cursor-not-allowed animate-heartbeat'
          >
            {isProcessing || isValidating ? 'CHECKING...' : 'START GAME'}
          </Button>
        </div>
      </section>

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </>
  );
}
