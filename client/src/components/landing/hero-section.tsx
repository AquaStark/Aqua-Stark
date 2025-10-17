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
        backendData: validation.backendData
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
      <section className='w-full text-center px-0.5 sm:px-1 md:px-2 lg:px-4 relative z-10'>
        <h1 className='text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl font-bold text-white drop-shadow-lg mb-0.5 sm:mb-1 md:mb-2'>
          <span className='inline-block animate-float'>
            Dive into the world of Aqua Stark!
          </span>
        </h1>
        <p className='text-xs sm:text-sm md:text-base text-white/90 mb-1 sm:mb-2 md:mb-3 max-w-xs sm:max-w-md md:max-w-lg mx-auto drop-shadow-md leading-tight px-0.5 sm:px-1'>
          Breed, feed, and collect unique fish while customizing your aquarium in
          this incredible aquatic adventure.
        </p>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3'>
          <Button
            onClick={handleStartGame}
            disabled={isProcessing || isValidating}
            className='text-xs sm:text-sm md:text-base font-bold py-1 sm:py-1.5 md:py-2 lg:py-3 px-2 sm:px-3 md:px-4 lg:px-6 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-sm sm:rounded-md md:rounded-lg shadow-md sm:shadow-lg md:shadow-xl transform hover:scale-105 transition-all duration-200 border-1 sm:border-2 border-green-300 disabled:opacity-50 disabled:cursor-not-allowed animate-heartbeat'
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
