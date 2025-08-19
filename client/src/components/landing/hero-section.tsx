'use client';
import { useNavigate, Link } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePlayerValidation } from '@/hooks/usePlayerValidation';
import { useState } from 'react';

export function HeroSection() {
  const { account } = useAccount();
  const navigate = useNavigate();
  const { validatePlayer, syncPlayerToBackend, isValidating } =
    usePlayerValidation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartGame = async () => {
    if (!account) {
      toast.error('Connect your wallet before playing.');
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
            await syncPlayerToBackend(validation.playerData, account.address);
            toast.success('Welcome back! Your data has been synced.');
          } catch (error) {
            console.error('Error syncing player to backend:', error);
            // Continue anyway, user can still play
          }
        } else {
          toast.success('Welcome back!');
        }

        // Navigate to game
        navigate('/game');
      } else {
        // New user - go to registration
        navigate('/start');
      }
    } catch (error) {
      console.error('Error validating player:', error);
      // On error, default to registration flow
      toast.info('Starting registration process...');
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
          className='text-sm sm:text-base md:text-lg lg:text-xl font-bold py-2 sm:py-3 md:py-4 lg:py-5 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 md:border-4 border-green-300 border-b-3 sm:border-b-4 md:border-b-6 lg:border-b-8 border-r-3 sm:border-r-4 md:border-r-6 lg:border-r-8 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isProcessing || isValidating ? 'CHECKING...' : 'START GAME'}
        </Button>

        <Link to='/store'>
          <Button className='text-xs sm:text-sm md:text-base lg:text-lg font-bold py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-orange-300 border-b-3 sm:border-b-4 md:border-b-6 border-r-3 sm:border-r-4 md:border-r-6 flex items-center gap-1 sm:gap-2'>
            <svg
              className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              />
            </svg>
            VISIT STORE
          </Button>
        </Link>
      </div>
    </section>
  );
}
