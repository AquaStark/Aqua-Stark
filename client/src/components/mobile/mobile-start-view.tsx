'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BubblesBackground } from '@/components';
import { useBubbles } from '@/hooks';

interface MobileStartViewProps {
  onRegister: (usernameToRegister?: string) => Promise<void>;
  onContinue: () => void;
  loading: boolean;
  txHash: string;
}

export function MobileStartView({ onRegister, onContinue, loading, txHash }: MobileStartViewProps) {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const bubbles = useBubbles({ initialCount: 8, maxBubbles: 20 });

  // Focus input on mount
  useEffect(() => {
    const input = document.getElementById('mobile-username-input') as HTMLInputElement | null;
    if (input) input.focus();
  }, []);

  // Validate username format
  const validateUsername = (value: string) => {
    setUsernameError('');

    if (!value.trim()) {
      setUsernameError('Username is required');
      return false;
    }

    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      return false;
    }

    if (value.length > 24) {
      setUsernameError('Username must be less than 24 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setUsernameError('Username can only contain letters, numbers, underscores, and hyphens');
      return false;
    }

    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
    setUsernameSuggestions([]);
  };


  const handleRegister = async () => {
    if (!validateUsername(username)) return;
    await onRegister(username);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUsername(suggestion);
    setUsernameError('');
    setUsernameSuggestions([]);
  };

  return (
    <div className='relative w-full h-screen overflow-y-auto flex flex-col'>
      {/* Oceanic background image and gradient overlays - same as PC */}
      <div className='absolute inset-0 -z-10'>
        <img
          src='/backgrounds/initaial-background.webp'
          alt='Ocean Background'
          className='absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none'
          draggable='false'
          role='presentation'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-[#001a2e] via-[#021d3b] to-[#000d1a] opacity-95' />
        {/* Glow spots for dynamic lighting - mobile optimized sizes */}
        <div className='absolute top-10 left-1/4 w-32 sm:w-48 md:w-72 h-20 sm:h-32 md:h-40 bg-cyan-400/10 blur-3xl rounded-full' />
        <div className='absolute bottom-20 right-1/5 w-40 sm:w-56 md:w-80 h-16 sm:h-24 md:h-32 bg-purple-400/10 blur-3xl rounded-full' />
        <div className='absolute top-1/2 right-4 sm:right-8 md:right-10 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-blue-300/10 blur-2xl rounded-full' />
      </div>

      {/* Bubbles animation overlay */}
      <BubblesBackground bubbles={bubbles} className='z-10' />

      {/* Mobile header - compact */}
      <div className='relative z-30 p-2 sm:p-3 bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30'>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <button
            onClick={() => window.history.back()}
            className='flex items-center text-white text-xs sm:text-sm touch-manipulation hover:bg-blue-500/50 px-1 py-1 rounded transition-colors'
          >
            <span className='mr-1'>←</span>
            Back Home
          </button>
          <h1 className='text-sm sm:text-base md:text-lg font-bold text-white'>Start Your Journey</h1>
          <div className='w-12 sm:w-16' /> {/* Spacer */}
        </div>
      </div>

      {/* Main content - compact mobile layout */}
      <main className='flex flex-col items-center gap-2 sm:gap-4 md:gap-6 px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-8 relative z-30 min-h-[85vh]'>
        {/* Content container - compact flex layout */}
        <div className='flex flex-col sm:flex-row items-center justify-center w-full max-w-6xl gap-2 sm:gap-4 md:gap-6'>
          {/* Fish section - much smaller sizing */}
          <div className='w-12 sm:w-16 md:w-24 lg:w-32 xl:w-40 animate-float order-1 sm:order-1 z-20 pointer-events-none select-none'>
            <img
              src='/fish/fish2.png'
              alt='Decorative Fish Swimming'
              className='w-full h-auto drop-shadow-lg -scale-x-110'
              draggable='false'
              role='presentation'
            />
          </div>
          
          {/* Form card - much smaller */}
          <div className='relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-gradient-to-b from-blue-900/70 to-blue-800/60 backdrop-blur-lg rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-5 border border-blue-400/30 shadow-[0_0_15px_2px_rgba(0,0,50,0.2)] overflow-hidden order-2 sm:order-2'>
            {/* Top highlight strip */}
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400/20 via-blue-300/30 to-purple-500/20' />
            
            {/* Title - compact typography */}
            <h2 className='text-sm sm:text-base md:text-lg lg:text-xl font-extrabold uppercase tracking-wide mb-1 sm:mb-2 text-white drop-shadow'>
              Create Your Profile
            </h2>
            
            {/* Description - compact typography */}
            <p className='mb-2 sm:mb-3 text-blue-100/90 text-xs drop-shadow leading-relaxed'>
              Pick a username to start exploring the world beneath the surface.
            </p>
            
            {/* Input - compact sizing */}
            <Input
              id='mobile-username-input'
              placeholder='Enter your username'
              className={`bg-blue-100/10 border-blue-300/30 text-white placeholder:text-blue-100/50 mb-1 h-7 sm:h-8 md:h-9 text-xs ${
                usernameError ? 'border-red-400' : ''
              }`}
              value={username}
              onChange={handleUsernameChange}
              autoComplete='off'
              maxLength={24}
              aria-label='Username'
              disabled={loading}
            />
            
            {/* Error message */}
            {usernameError && (
              <div className='text-red-400 text-xs mb-1 px-1'>
                {usernameError}
              </div>
            )}
            
            {/* Suggestions - compact layout */}
            {usernameSuggestions.length > 0 && (
              <div className='mb-2'>
                <p className='text-blue-200 text-xs mb-1'>
                  Try these suggestions:
                </p>
                <div className='flex flex-wrap gap-1'>
                  {usernameSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className='px-1 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors touch-manipulation'
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Button - compact sizing */}
            <Button
              onClick={handleRegister}
              className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/10 h-7 sm:h-8 md:h-9 text-xs touch-manipulation'
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Registering...' : 'Start Adventure'}
            </Button>

            {/* Transaction success section */}
            {txHash && (
              <div className='mt-2 bg-blue-900/50 text-white text-xs p-1 rounded border border-blue-400/40 shadow-inner'>
                <div className='mb-1 font-semibold'>Transaction Hash:</div>
                <div className='break-all text-xs'>{txHash}</div>
                <Button
                  onClick={onContinue}
                  className='mt-1 w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-500/10 h-6 text-xs touch-manipulation'
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tips section - compact */}
        <div className='max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mt-3 sm:mt-4 md:mt-6 mb-2 sm:mb-3 md:mb-4 text-blue-100/90 text-xs text-center opacity-90 drop-shadow space-y-1 px-2'>
          <p className='leading-relaxed'>
            💡 Choose a memorable name — this will represent you across the
            aquatic universe.
          </p>
          <p className='leading-relaxed'>
            🐠 After registering, you'll unlock your starter aquarium and
            receive your first fish.
          </p>
          <p className='leading-relaxed'>
            🪙 Get started with free coins and discover rare aquatic species!
          </p>
        </div>
      </main>

      {/* Footer - darker blue like in image */}
      <div className='relative z-30 p-3 sm:p-4 bg-blue-900/90 backdrop-blur-md border-t border-blue-400/50'>
        <div className='text-center text-blue-100 text-sm'>
          <p className='mb-2'>© 2025 Aqua Stark - All rights reserved</p>
          <div className='flex flex-wrap justify-center gap-2 sm:gap-3 text-sm'>
            <span className='hover:text-blue-200 cursor-pointer touch-manipulation px-2 py-1 rounded hover:bg-blue-500/20 transition-colors'>Polity and Privacy</span>
            <span className='hover:text-blue-200 cursor-pointer touch-manipulation px-2 py-1 rounded hover:bg-blue-500/20 transition-colors'>Terms of Service</span>
            <span className='hover:text-blue-200 cursor-pointer touch-manipulation px-2 py-1 rounded hover:bg-blue-500/20 transition-colors'>Contact</span>
          </div>
        </div>
      </div>
    </div>
  );
}
