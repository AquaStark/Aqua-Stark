'use client';

import { useState } from 'react';
import { ConnectButton } from '@/components';
import { LogOut, Maximize, Menu, X } from 'lucide-react';
import { useAccount, useDisconnect } from '@starknet-react/core';
import { useNotifications } from '@/hooks';
import { useFullscreen } from '@/hooks/use-fullscreen';

interface NavbarMobileProps {
  isPulsing?: boolean;
}

export function NavbarMobile({ isPulsing = false }: NavbarMobileProps) {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { info } = useNotifications();
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen();

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const handleNavClick = (action: string) => {
    setActiveButton(action);
    setIsSidebarOpen(false);
    switch (action) {
      case 'store':
        window.location.href = '/store';
        break;
      case 'tutorial':
        info('Tutorial coming soon!');
        break;
      case 'settings':
        window.location.href = '/settings';
        break;
      case 'credits':
        window.location.href = '/credits';
        break;
      default:
        break;
    }
  };

  return (
    <>
      <nav className='relative z-10 flex items-center px-2 py-1 h-full w-full'>
        {/* Mobile Menu Button - Left side */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='px-2 py-1 rounded-md bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-md transform hover:scale-105 transition-all duration-200 border border-blue-300 flex items-center justify-center'
          title='Menu'
        >
          {isSidebarOpen ? (
            <X className='w-4 h-4 text-white' />
          ) : (
            <Menu className='w-4 h-4 text-white' />
          )}
        </button>

        {/* Logo - More to the left */}
        <div className='flex items-center ml-4'>
          <img
            src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png'
            alt='Aqua Stark Logo'
            className='h-10 w-auto drop-shadow-2xl'
          />
        </div>

        {/* Spacer to push controls to the right */}
        <div className='flex-1'></div>

        {/* Right side controls */}
        <div className='flex gap-1 items-center'>
          {/* Fullscreen Button */}
          {isSupported && (
            <button
              onClick={toggleFullscreen}
              className='px-1 py-0.5 rounded-sm bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-md transform hover:scale-105 transition-all duration-200 border border-blue-300 flex items-center justify-center'
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              <Maximize className='w-3 h-3 text-white' />
            </button>
          )}

          {isConnected ? (
            <div className='flex items-center gap-1'>
              <div className='bg-blue-600/40 backdrop-blur-sm rounded-lg px-1 py-0.5 border border-blue-400/50'>
                <span className='text-white text-[8px] font-bold tracking-wide'>
                  {address
                    ? `${address.slice(0, 4)}...${address.slice(-2)}`
                    : 'Connected'}
                </span>
              </div>
              <button
                onClick={handleDisconnectWallet}
                className='px-1 py-0.5 rounded-sm bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 shadow-md transform hover:scale-105 transition-all duration-200 border border-red-300 flex items-center justify-center'
                title='Disconnect Wallet'
              >
                <LogOut className='w-3 h-3 text-white' />
              </button>
            </div>
          ) : (
            <div className={isPulsing ? 'animate-pulse-glow' : ''}>
              <ConnectButton />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className='fixed inset-0 z-50'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setIsSidebarOpen(false);
              }
            }}
            role='button'
            tabIndex={0}
            aria-label='Close sidebar'
          />

          {/* Sidebar */}
          <div className='absolute right-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900/95 to-blue-800/95 backdrop-blur-md border-l border-blue-400/50 shadow-2xl'>
            <div className='p-4'>
              {/* Close button */}
              <div className='flex justify-end mb-6'>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className='p-2 rounded-lg bg-blue-600/50 hover:bg-blue-500/50 transition-colors'
                >
                  <X className='w-5 h-5 text-white' />
                </button>
              </div>

              {/* Navigation buttons */}
              <div className='space-y-3'>
                <button
                  onClick={() => handleNavClick('store')}
                  className={`w-full px-4 py-3 rounded-lg bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all duration-200 border border-emerald-300 flex items-center justify-center ${
                    activeButton === 'store'
                      ? 'scale-105 ring-2 ring-emerald-300'
                      : ''
                  }`}
                >
                  <span className='text-white text-sm font-bold'>Store</span>
                </button>

                <button
                  onClick={() => handleNavClick('tutorial')}
                  className={`w-full px-4 py-3 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 shadow-lg transform hover:scale-105 transition-all duration-200 border border-cyan-300 flex items-center justify-center ${
                    activeButton === 'tutorial'
                      ? 'scale-105 ring-2 ring-cyan-300'
                      : ''
                  }`}
                >
                  <span className='text-white text-sm font-bold'>Tutorial</span>
                </button>

                <button
                  onClick={() => handleNavClick('settings')}
                  className={`w-full px-4 py-3 rounded-lg bg-gradient-to-b from-violet-400 to-violet-600 hover:from-violet-500 hover:to-violet-700 shadow-lg transform hover:scale-105 transition-all duration-200 border border-violet-300 flex items-center justify-center ${
                    activeButton === 'settings'
                      ? 'scale-105 ring-2 ring-violet-300'
                      : ''
                  }`}
                >
                  <span className='text-white text-sm font-bold'>Settings</span>
                </button>

                <button
                  onClick={() => handleNavClick('credits')}
                  className={`w-full px-4 py-3 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-lg transform hover:scale-105 transition-all duration-200 border border-amber-300 flex items-center justify-center ${
                    activeButton === 'credits'
                      ? 'scale-105 ring-2 ring-amber-300'
                      : ''
                  }`}
                >
                  <span className='text-white text-sm font-bold'>Credits</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
