'use client';

import React from 'react';
import { useConnect } from '@starknet-react/core';


interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
  const { connect, connectors } = useConnect();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleWalletSelect = async (connector: any) => {
    try {
      await connect({ connector });
      onClose();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // You can add toast notification here
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      onClick={onClose}
      onKeyDown={e => e.key === 'Escape' && onClose()}
      role='dialog'
      aria-modal='true'
      aria-labelledby='wallet-modal-title'
    >
      <div
        className='bg-[#1C1D1F] rounded-lg p-6 w-full max-w-md mx-4'
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 id='wallet-modal-title' className='text-white text-xl font-bold'>
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white'
            aria-label='Close modal'
          >
            ✕
          </button>
        </div>

        <div className='space-y-3'>
          {connectors.map(connector => {
            const isAvailable = connector.available();
            const isCartridge = connector.id === 'cartridge';

            return (
              <button
                key={connector.id}
                onClick={() => handleWalletSelect(connector)}
                disabled={!isAvailable}
                className={`flex items-center gap-4 p-4 rounded-md w-full text-left transition-all duration-300 ${
                  isAvailable
                    ? isCartridge 
                      ? 'bg-gradient-to-r from-green-600/80 to-blue-600/80 hover:scale-105 border-2 border-green-400/50'
                      : 'bg-purple-700/60 hover:scale-105'
                    : 'bg-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className='flex-shrink-0'>
                  {isCartridge ? '🎮' : '🦊'}
                </div>
                <div>
                  <h3 className='text-white font-semibold flex items-center gap-2'>
                    {connector.name}
                    {isCartridge && (
                      <span className='text-xs bg-green-500 text-white px-2 py-1 rounded-full'>
                        Gaming Optimized
                      </span>
                    )}
                  </h3>
                  <p className='text-gray-400 text-sm'>
                    {isAvailable 
                      ? isCartridge 
                        ? 'Session keys, gasless transactions, passkey auth'
                        : 'Available'
                      : 'Wallet not detected'
                    }
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className='mt-4 text-center text-sm text-gray-400'>
          <p>
            Don't have a wallet?{' '}
            <a
              href='https://starknet.io/ecosystem/wallets/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-purple-400 hover:underline'
            >
              Get one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
