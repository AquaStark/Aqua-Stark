'use client';

import { useState, useEffect } from 'react';
import { useAccount } from '@starknet-react/core';
import { usePlayer } from '@/hooks';
import { usePlayerValidation } from '@/hooks';
import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BubblesBackground } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useBubbles } from '@/hooks';
import { useMobileDetection } from '@/hooks/use-mobile-detection';
import { MobileStartView } from '@/components/mobile/mobile-start-view';
import { ErrorWithMessage } from '@/types';

export default function Start() {
  const { account } = useAccount();
  const { registerPlayer } = usePlayer();
  const { createBackendPlayer } = usePlayerValidation();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  // Mobile detection
  const { isMobile } = useMobileDetection();

  // Use enhanced bubbles config
  const bubbles = useBubbles({ initialCount: 12, maxBubbles: 30 });

  // Accessibility: focus input on mount
  useEffect(() => {
    const input = document.getElementById(
      'username-input'
    ) as HTMLInputElement | null;
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

    // Check for valid characters (alphanumeric, underscore, hyphen)
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setUsernameError(
        'Username can only contain letters, numbers, underscores, and hyphens'
      );
      return false;
    }

    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
    setUsernameSuggestions([]); // Clear suggestions when user types
  };

  const generateUsernameSuggestions = (baseUsername: string) => {
    const suggestions = [];
    const suffixes = ['123', '2024', 'Aqua', 'Fish', 'Ocean', 'Blue', 'Star'];

    for (const suffix of suffixes) {
      const suggestion = `${baseUsername}${suffix}`;
      if (suggestion.length <= 24) {
        suggestions.push(suggestion);
      }
    }

    // Add some random suggestions
    const randomSuffixes = ['Cool', 'Pro', 'Gamer', 'Player', 'Master'];
    for (const suffix of randomSuffixes) {
      const suggestion = `${baseUsername}${suffix}`;
      if (suggestion.length <= 24) {
        suggestions.push(suggestion);
      }
    }

    return suggestions.slice(0, 5); // Return max 5 suggestions
  };

  const handleRegister = async (usernameToRegister?: string) => {
    const finalUsername = usernameToRegister || username;
    if (!account) {
      toast.error('Connect your wallet first');
      return;
    }
    if (!validateUsername(finalUsername)) {
      return;
    }
    try {
      setLoading(true);

      // Register player on-chain first
      const tx = await registerPlayer(account, finalUsername.trim());
      toast.success('Player registered on-chain successfully!');
      setTxHash(tx.transaction_hash);

      // Create player in backend
      try {
        const playerId = account.address; // Use wallet address as player ID
        await createBackendPlayer(playerId, account.address, finalUsername.trim());
        toast.success('Player synced to backend successfully!');
      } catch (backendError) {
        console.error('Backend sync error:', backendError);
        toast.warning(
          'Player registered on-chain but backend sync failed. You can continue.'
        );
      }
    } catch (error) {
      console.error('Registration error:', error);

      // Check for specific error types
      const errorMessage =
        (error as ErrorWithMessage)?.message || error?.toString() || '';

      if (
        errorMessage.includes('USERNAME ALREADY TAKEN') ||
        (errorMessage.includes('username') && errorMessage.includes('taken'))
      ) {
        toast.error(
          'Username is already taken. Please choose a different username.'
        );
        setUsernameError('Username is already taken');
        setUsernameSuggestions(generateUsernameSuggestions(finalUsername));
      } else if (errorMessage.includes('multicall-failed')) {
        toast.error(
          'Transaction failed. Please try again with a different username.'
        );
        setUsernameError(
          'Transaction failed. Please try a different username.'
        );
        setUsernameSuggestions(generateUsernameSuggestions(finalUsername));
      } else {
        toast.error('Failed to register player. Please try again.');
        setUsernameError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/onboarding');
  };

  // Render mobile view if device is detected as mobile
  if (isMobile) {
    return (
      <MobileStartView
        onRegister={handleRegister}
        onContinue={handleContinue}
        loading={loading}
        txHash={txHash}
      />
    );
  }

  // Desktop/tablet view
  return (
    <OrientationLock>
      <div className='relative min-h-screen w-full overflow-hidden flex flex-col justify-between'>
        {/* Oceanic background image and gradient overlays */}
        <div className='absolute inset-0 -z-10'>
          <img
            src='/backgrounds/initaial-background.webp'
            alt='Ocean Background'
            className='absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none'
            draggable='false'
            role='presentation'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-[#001a2e] via-[#021d3b] to-[#000d1a] opacity-95' />
          {/* Glow spots for dynamic lighting */}
          <div className='absolute top-10 left-1/4 w-72 h-40 bg-cyan-400/10 blur-3xl rounded-full' />
          <div className='absolute bottom-20 right-1/5 w-80 h-32 bg-purple-400/10 blur-3xl rounded-full' />
          <div className='absolute top-1/2 right-10 w-40 h-40 bg-blue-300/10 blur-2xl rounded-full' />
        </div>

        {/* Bubbles animation overlay */}
        <BubblesBackground bubbles={bubbles} className='z-10' />

        {/* Page header */}
        <PageHeader
          title='Start Your Journey'
          backTo='/'
          backText='Back Home'
          className='bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30 z-30'
        />

        <main className='flex flex-col items-center gap-8 px-4 py-16 relative z-30 min-h-[80vh]'>
          <div className='flex flex-row items-center justify-center'>
            {/* Animated floating fish (decorative) */}
            <div className='w-64 sm:w-72 lg:w-80 animate-float hidden sm:block mr-20 z-20 pointer-events-none select-none'>
              <img
                src='/fish/fish2.png'
                alt='Decorative Fish Swimming'
                className='w-full h-auto drop-shadow-2xl -scale-x-110'
                draggable='false'
                role='presentation'
              />
            </div>
            {/* Form card with highlight strip and glow */}
            <div className='relative w-full max-w-xl bg-gradient-to-b from-blue-900/70 to-blue-800/60 backdrop-blur-lg rounded-3xl px-6 sm:px-10 py-10 border border-blue-400/30 shadow-[0_0_30px_5px_rgba(0,0,50,0.2)] overflow-hidden'>
              {/* Top highlight strip */}
              <div className='absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400/20 via-blue-300/30 to-purple-500/20' />
              <h2 className='text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-4 text-white drop-shadow'>
                Create Your Profile
              </h2>
              <p className='mb-6 text-blue-100/90 text-sm sm:text-base drop-shadow'>
                Pick a username to start exploring the world beneath the
                surface.
              </p>
              <Input
                id='username-input'
                placeholder='Enter your username'
                className={`bg-blue-100/10 border-blue-300/30 text-white placeholder:text-blue-100/50 mb-2 ${
                  usernameError ? 'border-red-400' : ''
                }`}
                value={username}
                onChange={handleUsernameChange}
                autoComplete='off'
                maxLength={24}
                aria-label='Username'
                disabled={loading}
              />
              {usernameError && (
                <div className='text-red-400 text-sm mb-2 px-2'>
                  {usernameError}
                </div>
              )}
              {usernameSuggestions.length > 0 && (
                <div className='mb-4'>
                  <p className='text-blue-200 text-sm mb-2'>
                    Try these suggestions:
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {usernameSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setUsername(suggestion);
                          setUsernameError('');
                          setUsernameSuggestions([]);
                        }}
                        className='px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors'
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button
                onClick={() => handleRegister()}
                className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/10'
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Registering...' : 'Start Adventure'}
              </Button>

              {txHash && (
                <div className='mt-6 bg-blue-900/50 text-white text-sm p-4 rounded-lg border border-blue-400/40 shadow-inner'>
                  <div className='mb-2 font-semibold'>Transaction Hash:</div>
                  <div className='break-all'>{txHash}</div>
                  <Button
                    onClick={handleContinue}
                    className='mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-500/10'
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Glowing tips section */}
          <div className='max-w-2xl mt-10 text-blue-100/90 text-sm sm:text-base text-center opacity-90 drop-shadow space-y-2'>
            <p>
              💡 Choose a memorable name — this will represent you across the
              aquatic universe.
            </p>
            <p>
              🐠 After registering, you'll unlock your starter aquarium and
              receive your first fish.
            </p>
            <p>
              🪙 Get started with free coins and discover rare aquatic species!
            </p>
          </div>
        </main>

        {/* Sticky, blurred footer */}
        <LayoutFooter className='bg-blue-900/60 backdrop-blur-md border-t border-blue-400/30 fixed bottom-0 left-0 w-full z-40' />
      </div>
    </OrientationLock>
  );
}
