'use client';

import { useState } from 'react';
import { ConnectButton } from '@/components/ui/connect-button';
import { LogOut } from 'lucide-react';
import { useAccount, useDisconnect } from '@starknet-react/core';
import { toast } from 'sonner';

export function Navbar() {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const handleNavClick = (action: string) => {
    setActiveButton(action);
    switch (action) {
      case 'store':
        window.location.href = '/store';
        break;
      case 'tutorial':
        toast.info('Tutorial coming soon!');
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
    <nav className='relative z-10 flex justify-between items-center px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-b from-black/20 to-transparent h-full'>
      <div className='flex items-center'>
        <img
          src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png'
          alt='Aqua Stark Logo'
          className='h-20 sm:h-24 md:h-28 lg:h-32 w-auto drop-shadow-2xl'
        />
      </div>

      {/* Navigation Menu - Centered and fixed width */}
      <div className='hidden lg:flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2'>
        <button
          onClick={() => handleNavClick('store')}
          className={`px-3 py-2 rounded-lg bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-emerald-300 flex items-center justify-center ${
            activeButton === 'store' ? 'scale-105 ring-2 ring-emerald-300' : ''
          }`}
          title='Visit Store'
        >
          <span className='text-white text-xs font-bold whitespace-nowrap'>
            Store
          </span>
        </button>

        <button
          onClick={() => handleNavClick('tutorial')}
          className={`px-3 py-2 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-cyan-300 flex items-center justify-center ${
            activeButton === 'tutorial' ? 'scale-105 ring-2 ring-cyan-300' : ''
          }`}
          title='Tutorial'
        >
          <span className='text-white text-xs font-bold whitespace-nowrap'>
            Tutorial
          </span>
        </button>

        <button
          onClick={() => handleNavClick('settings')}
          className={`px-3 py-2 rounded-lg bg-gradient-to-b from-violet-400 to-violet-600 hover:from-violet-500 hover:to-violet-700 shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-violet-300 flex items-center justify-center ${
            activeButton === 'settings'
              ? 'scale-105 ring-2 ring-violet-300'
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
          className={`px-3 py-2 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-amber-300 flex items-center justify-center ${
            activeButton === 'credits' ? 'scale-105 ring-2 ring-amber-300' : ''
          }`}
          title='Credits'
        >
          <span className='text-white text-xs font-bold whitespace-nowrap'>
            Credits
          </span>
        </button>
      </div>

      <div className='flex gap-2 sm:gap-3 items-center'>
        {isConnected ? (
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='bg-blue-600/40 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-blue-400/50'>
              <span className='text-white text-xs sm:text-sm font-bold tracking-wide'>
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : 'Connected'}
              </span>
            </div>
            <button
              onClick={handleDisconnectWallet}
              className='px-3 py-2 rounded-lg bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-red-300 flex items-center justify-center'
              title='Disconnect Wallet'
            >
              <LogOut className='w-4 h-4 text-white' />
            </button>
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
}
