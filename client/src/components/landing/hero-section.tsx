'use client';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { Button } from '@/components';
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
    <section className='w-full text-center px-2 sm:px-4 md:px-6 relative z-10'>
      <h1 className='text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg mb-2 sm:mb-3'>
        <span className='inline-block animate-float'>
          Dive into the world of Aqua Stark!
        </span>
      </h1>
      <p className='text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-3 sm:mb-4 max-w-lg sm:max-w-xl mx-auto drop-shadow-md leading-tight px-2'>
        Breed, feed, and collect unique fish while customizing your aquarium in
        this incredible aquatic adventure.
      </p>
      <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4'>
        <Button
          onClick={handleStartGame}
          disabled={isProcessing || isValidating}
          className='text-sm sm:text-base md:text-lg lg:text-xl font-bold py-2 sm:py-3 md:py-4 lg:py-5 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 md:border-4 border-green-300 border-b-3 sm:border-b-4 md:border-b-6 lg:border-b-8 border-r-3 sm:border-r-4 md:border-r-6 lg:border-r-8 disabled:opacity-50 disabled:cursor-not-allowed animate-heartbeat'
        >
          {isProcessing || isValidating ? 'CHECKING...' : 'START GAME'}
        </Button>
      </div>
    </section>
  );
}
