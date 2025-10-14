'use client';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { Button } from '@/components/ui/button';
import { usePlayerValidation, useNotifications } from '@/hooks';
import { useState } from 'react';

export function HeroSection() {
  const { account } = useAccount();
  const navigate = useNavigate();
  const { validatePlayer, syncPlayerToBackend, isValidating } =
    usePlayerValidation();
  const { success, error, info } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartGame = async () => {
    if (!account) {
      error('Connect your wallet before playing.');
      return;
    }

    setIsProcessing(true);

    try {
      // Validate if user exists (on-chain and backend)
      const validation = await validatePlayer(account.address);

      if (validation.exists) {
        // User exists - check if we need to sync to backend
        if (validation.isOnChain && !validation.isInBackend) {
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
        // New user - go to registration
        navigate('/start');
      }
    } catch (err) {
      console.error('Error validating player:', err);
      // On error, default to registration flow
      info('Starting registration process...');
      navigate('/start');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className='w-full text-center px-1 sm:px-2 md:px-4 lg:px-6 relative z-10'>
      <h1 className='text-sm sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-lg mb-1 sm:mb-2 md:mb-3'>
        <span className='inline-block animate-float'>
          Dive into the world of Aqua Stark!
        </span>
      </h1>
      <p className='text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-2 sm:mb-3 md:mb-4 max-w-xs sm:max-w-lg md:max-w-xl mx-auto drop-shadow-md leading-tight px-1 sm:px-2'>
        Breed, feed, and collect unique fish while customizing your aquarium in
        this incredible aquatic adventure.
      </p>
      <div className='flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4'>
        <Button
          onClick={handleStartGame}
          disabled={isProcessing || isValidating}
          className='text-xs sm:text-sm md:text-base lg:text-lg font-bold py-1.5 sm:py-2 md:py-3 lg:py-4 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-md sm:rounded-lg md:rounded-xl shadow-lg sm:shadow-xl md:shadow-2xl transform hover:scale-105 transition-all duration-200 border-1 sm:border-2 md:border-3 border-green-300 disabled:opacity-50 disabled:cursor-not-allowed animate-heartbeat'
        >
          {isProcessing || isValidating ? 'CHECKING...' : 'START GAME'}
        </Button>
      </div>
    </section>
  );
}
