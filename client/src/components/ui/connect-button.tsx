'use client';

import { useState, useCallback } from 'react';
import { useConnect, useDisconnect, useAccount } from '@starknet-react/core';
import ControllerConnector from '@cartridge/connector/controller';
import { toast } from 'sonner';

interface ConnectButtonProps {
  className?: string;
}

export function ConnectButton({ className = '' }: ConnectButtonProps) {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);

  // Find the Cartridge Controller connector
  const controller = connectors.find(
    c => c instanceof ControllerConnector
  ) as ControllerConnector;

  const handleConnect = useCallback(async () => {
    if (!controller) {
      toast.error('Cartridge Controller is not available');
      return;
    }

    setIsConnecting(true);
    try {
      // This will open the Cartridge modal with options for:
      // - Google
      // - Discord
      // - WalletConnect
      // - Native wallets (Argent X, Braavos, etc.)
      await connect({ connector: controller });
      toast.success('Connected successfully! 🎮');
    } catch (error) {
      console.error('Error connecting to Cartridge:', error);

      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          toast.error('Connection cancelled by user');
        } else if (
          error.message.includes('account') ||
          error.message.includes('login')
        ) {
          toast.error('Account error. Verify your login in Cartridge');
        } else if (error.message.includes('network')) {
          toast.error('Network error. Check your connection');
        } else {
          toast.error('Error connecting to Cartridge');
        }
      } else {
        toast.error('Unexpected connection error');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [connect, controller]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      toast.success('Disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Error disconnecting');
    }
  }, [disconnect]);

  // If connected, show account info and disconnect button
  if (isConnected && address) {
    return (
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg'>
          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
          <span className='text-sm text-gray-300'>
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className='px-3 py-2 rounded-lg bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-red-300 flex items-center justify-center'
        >
          <span>🚪</span>
          <span>Disconnect</span>
        </button>
      </div>
    );
  }

  // Connect button with Cartridge style
  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`text-sm sm:text-base font-bold py-1.5 sm:py-2 px-3 sm:px-5 bg-black hover:bg-gray-900 text-yellow-400 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-yellow-400 flex items-center gap-1 sm:gap-2 ${className} ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isConnecting ? (
        <>
          <div className='w-3 h-3 sm:w-4 sm:h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin'></div>
          <span className='hidden xs:inline'>Connecting...</span>
          <span className='xs:hidden'>...</span>
        </>
      ) : (
        <>
          <img
            src='/logo/cartridge_logo.jpg'
            alt='Cartridge'
            className='w-5 h-5 sm:w-6 sm:h-6 rounded-sm object-contain'
          />
          <span className='hidden xs:inline font-bold'>Connect</span>
          <span className='xs:hidden font-bold'>Connect</span>
        </>
      )}
    </button>
  );
}
