'use client';

import { useEffect, useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { useCartridgeSession } from '@/hooks/use-cartridge-session';
import { usePlayer } from '@/hooks/dojo/usePlayer';
import { usePlayerValidation } from '@/hooks/usePlayerValidation';
import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BubblesBackground } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useBubbles } from '@/hooks';
import { useMobileDetection } from '@/hooks/use-mobile-detection';
import { MobileStartView } from '@/components/mobile/mobile-start-view';
import { toast } from 'sonner';

export default function Start() {
  const { account } = useAccount();
  const { account: cartridgeAccount } = useCartridgeSession();
  const { registerPlayer } = usePlayer();
  const { createBackendPlayer } = usePlayerValidation();
  const navigate = useNavigate();

  // States for registration
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<string>('');

  // Extract Cartridge username if available, fallback to address
  const cartridgeUsername =
    cartridgeAccount?.username ||
    (cartridgeAccount?.address
      ? `User_${cartridgeAccount.address.slice(-6)}`
      : undefined);

  // Redirect if not connected with Cartridge
  useEffect(() => {
    // Only redirect if no wallet connected (Starknet) OR no Cartridge
    const timer = setTimeout(() => {
      if (!account || !cartridgeAccount) {
        console.log('Redirecting to home - no wallet or Cartridge account');
        navigate('/');
      }
    }, 2000); // Esperar 2 segundos para que se cargue todo

    return () => clearTimeout(timer);
  }, [cartridgeAccount, account, navigate]);

  // Mobile detection
  const { isMobile } = useMobileDetection();

  // Use enhanced bubbles config
  const bubbles = useBubbles({ initialCount: 12, maxBubbles: 30 });

  const handleContinue = async () => {
    console.log('🎯 handleContinue called');
    console.log('Account:', account);
    console.log('CartridgeAccount:', cartridgeAccount);
    console.log('CartridgeUsername:', cartridgeUsername);

    if (!account || !cartridgeUsername) {
      console.error('❌ Missing account or username');
      toast.error('Missing account or username');
      return;
    }

    try {
      setIsRegistering(true);
      console.log('🚀 Starting registration...');

      // Step 1: Register on-chain
      setRegistrationStep('Registering on blockchain...');
      console.log('📝 Calling registerPlayer with:', {
        account: account.address,
        username: cartridgeUsername,
      });
      const tx = await registerPlayer(account, cartridgeUsername);
      console.log('✅ On-chain registration successful:', tx);
      toast.success('Registered on blockchain!');

      // Step 2: Register in backend
      setRegistrationStep('Syncing to backend...');
      console.log('💾 Calling createBackendPlayer with:', {
        playerId: account.address,
        walletAddress: account.address,
        username: cartridgeUsername,
      });
      await createBackendPlayer(
        account.address, // Use wallet address as playerId
        account.address, // walletAddress
        cartridgeUsername // username from Cartridge
      );
      console.log('✅ Backend registration successful');
      toast.success('Registration complete!');

      // Step 3: Navigate to onboarding
      console.log('🎉 Navigating to /onboarding');
      navigate('/onboarding');
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('Error type:', typeof error);
      console.error('Error details:', JSON.stringify(error, null, 2));

      // Handle specific error types
      const errorMessage = error?.toString() || 'Registration failed';

      if (errorMessage.includes('USERNAME ALREADY TAKEN')) {
        toast.error('Username is already taken. Please try again.');
      } else if (errorMessage.includes('multicall-failed')) {
        toast.error('Transaction failed. Please try again.');
      } else if (errorMessage.includes('User abort')) {
        toast.error('Transaction cancelled by user.');
      } else {
        toast.error(`Registration failed: ${errorMessage}`);
      }
    } finally {
      setIsRegistering(false);
      setRegistrationStep('');
      console.log('🏁 Registration process finished');
    }
  };

  // Render mobile view if device is detected as mobile
  if (isMobile) {
    return (
      <MobileStartView
        onContinue={handleContinue}
        cartridgeUsername={cartridgeUsername}
        isRegistering={isRegistering}
        registrationStep={registrationStep}
      />
    );
  }

  // Desktop/tablet view
  return (
    <OrientationLock forcePortrait={isMobile}>
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

              {/* Cartridge greeting - Always shown since Cartridge is required */}
              <div className='mb-8 text-center bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4'>
                <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]'>
                  Hello, {cartridgeUsername || 'Player'}! 👋
                </h2>
                <p className='text-cyan-100/70 text-sm font-medium'>
                  Welcome from Cartridge
                </p>
              </div>

              {/* Welcome message and contract execution button */}
              <div className='text-center'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-4 text-white drop-shadow'>
                  Ready to Dive In?
                </h2>
                <p className='mb-6 text-blue-100/90 text-sm sm:text-base drop-shadow'>
                  You're all set! Let's start your aquatic adventure.
                </p>
                <Button
                  onClick={handleContinue}
                  className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/10'
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      {registrationStep || 'Processing...'}
                    </div>
                  ) : (
                    'Start Adventure'
                  )}
                </Button>
              </div>
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
