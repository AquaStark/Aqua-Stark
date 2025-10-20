'use client';

import { useState } from 'react';
import { ConnectButton } from '@/components';
import { LogOut, Maximize, Menu, X } from 'lucide-react';
import { useAccount, useDisconnect } from '@starknet-react/core';
import { useNotifications } from '@/hooks';
import { useFullscreen } from '@/hooks/use-fullscreen';

interface NavbarProps {
  isPulsing?: boolean;
}

export function Navbar({ isPulsing = false }: NavbarProps) {
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
    setIsSidebarOpen(false); // Close sidebar when navigating
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
      <nav className='relative z-10 flex justify-between items-center px-1 sm:px-2 md:px-4 lg:px-6 py-0.5 sm:py-1 md:py-2 bg-gradient-to-b from-black/20 to-transparent h-full'>
        {/* Mobile Menu Button - Left side */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='sm:hidden px-2 py-1 rounded-md bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-md transform hover:scale-105 transition-all duration-200 border border-blue-300 flex items-center justify-center'
          title='Menu'
        >
          {isSidebarOpen ? (
            <X className='w-4 h-4 text-white' />
          ) : (
            <Menu className='w-4 h-4 text-white' />
          )}
        </button>

        {/* Logo - Right side on mobile, left side on desktop */}
        <div className='flex items-center order-2 sm:order-1 ml-auto sm:ml-0'>
          <img
            src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png'
            alt='Aqua Stark Logo'
            className='h-8 sm:h-12 md:h-16 lg:h-20 w-auto drop-shadow-2xl'
          />
        </div>

        {/* Desktop Navigation Menu - Hidden on mobile */}
        <div className='hidden sm:flex items-center gap-2 md:gap-3 lg:gap-4 absolute left-1/2 transform -translate-x-1/2'>
          <button
            onClick={() => handleNavClick('store')}
            className={`px-2 md:px-3 py-1 md:py-2 rounded-md md:rounded-lg bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-200 border border-emerald-300 flex items-center justify-center ${
              activeButton === 'store'
                ? 'scale-105 ring-1 sm:ring-2 ring-emerald-300'
                : ''
            }`}
            title='Visit Store'
          >
            <span className='text-white text-xs font-bold whitespace-nowrap'>
              Store
            </span>
          </button>

          <button
            onClick={() => handleNavClick('tutorial')}
            className={`px-2 md:px-3 py-1 md:py-2 rounded-md md:rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-200 border border-cyan-300 flex items-center justify-center ${
              activeButton === 'tutorial'
                ? 'scale-105 ring-1 sm:ring-2 ring-cyan-300'
                : ''
            }`}
            title='Tutorial'
          >
            <span className='text-white text-xs font-bold whitespace-nowrap'>
              Tutorial
            </span>
          </button>

          <button
            onClick={() => handleNavClick('settings')}
            className={`px-2 md:px-3 py-1 md:py-2 rounded-md md:rounded-lg bg-gradient-to-b from-violet-400 to-violet-600 hover:from-violet-500 hover:to-violet-700 shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-200 border border-violet-300 flex items-center justify-center ${
              activeButton === 'settings'
                ? 'scale-105 ring-1 sm:ring-2 ring-violet-300'
                : ''
            }`}
            title='Settings'
          >
            <span className='text-white text-xs font-bold whitespace-nowrap'>
              Settings
            </span>
          </button>

          <button
            onClick={() => handleNavClick('credits')}
            className={`px-2 md:px-3 py-1 md:py-2 rounded-md md:rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-200 border border-amber-300 flex items-center justify-center ${
              activeButton === 'credits'
                ? 'scale-105 ring-1 sm:ring-2 ring-amber-300'
                : ''
            }`}
            title='Credits'
          >
            <span className='text-white text-xs font-bold whitespace-nowrap'>
              Credits
            </span>
          </button>
        </div>

        <div className='flex gap-1 sm:gap-2 md:gap-3 items-center order-3 mt-6 sm:mt-0'>
          {/* Fullscreen Button */}
          {isSupported && (
            <button
              onClick={toggleFullscreen}
              className='px-1 sm:px-2 py-0.5 sm:py-1 rounded-sm sm:rounded-md bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-200 border border-blue-300 flex items-center justify-center'
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              <Maximize className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
            </button>
          )}

          {isConnected ? (
            <div className='flex items-center gap-1 sm:gap-2 md:gap-3'>
              <div className='bg-blue-600/40 backdrop-blur-sm rounded-lg px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-2 border border-blue-400/50'>
                <span className='text-white text-[8px] sm:text-xs md:text-sm font-bold tracking-wide'>
                  {address
                    ? `${address.slice(0, 4)}...${address.slice(-2)}`
                    : 'Connected'}
                </span>
              </div>
              <button
                onClick={handleDisconnectWallet}
                className='px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-2 rounded-sm sm:rounded-md md:rounded-lg bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-200 border border-red-300 flex items-center justify-center'
                title='Disconnect Wallet'
              >
                <LogOut className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
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
        <div className='fixed inset-0 z-50 sm:hidden'>
          {/* Backdrop */}
          <div 
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsSidebarOpen(false)}
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
                  <span className='text-white text-sm font-bold'>
                    Store
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('tutorial')}
                  className={`w-full px-4 py-3 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 shadow-lg transform hover:scale-105 transition-all duration-200 border border-cyan-300 flex items-center justify-center ${
                    activeButton === 'tutorial'
                      ? 'scale-105 ring-2 ring-cyan-300'
                      : ''
                  }`}
                >
                  <span className='text-white text-sm font-bold'>
                    Tutorial
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('settings')}
                  className={`w-full px-4 py-3 rounded-lg bg-gradient-to-b from-violet-400 to-violet-600 hover:from-violet-500 hover:to-violet-700 shadow-lg transform hover:scale-105 transition-all duration-200 border border-violet-300 flex items-center justify-center ${
                    activeButton === 'settings'
                      ? 'scale-105 ring-2 ring-violet-300'
                      : ''
                  }`}
                >
                  <span className='text-white text-sm font-bold'>
                    Settings
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('credits')}
                  className={`w-full px-4 py-3 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-lg transform hover:scale-105 transition-all duration-200 border border-amber-300 flex items-center justify-center ${
                    activeButton === 'credits'
                      ? 'scale-105 ring-2 ring-amber-300'
                      : ''
                  }`}
                >
                  <span className='text-white text-sm font-bold'>
                    Credits
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
