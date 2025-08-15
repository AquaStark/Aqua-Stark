'use client';

import React from 'react';
import { useConnect, Connector } from '@starknet-react/core';
const wallets = [
  {
    id: 'argentX',
    name: 'Argent X',
    description: 'Browser wallet',
    icon: '🦊',
    bgColor: 'bg-purple-700/60',
  },
  {
    id: 'braavos',
    name: 'Braavos',
    description: 'Browser wallet',
    icon: '🦁',
    bgColor: 'bg-blue-700/60',
  },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (connector: Connector) => void;
}

const WalletModal = ({ isOpen, onClose, onSelectWallet }: WalletModalProps) => {
  const { connectors } = useConnect();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  React.useEffect(() => {
    console.log(
      'Available connectors:',
      connectors.map(c => ({ id: c.id, name: c.name }))
    );
  }, [connectors]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div
        className='bg-[#1C1D1F] rounded-lg p-6 w-full max-w-md mx-4'
        onClick={e => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 id="wallet-modal-title" className='text-white text-xl font-bold'>Connect Wallet</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white'
            aria-label='Close modal'
          >
            ✕
          </button>
        </div>

        <div className='space-y-3'>
          {wallets.map(wallet => {
            const connector = connectors.find(c => c.id === wallet.id);
            const isAvailable = !!connector;

            return (
              <button
                key={wallet.id}
                onClick={() =>
                  isAvailable && connector && onSelectWallet(connector)
                }
                disabled={!isAvailable}
                className={`flex items-center gap-4 p-4 rounded-md w-full text-left transition-all duration-300 ${
                  isAvailable
                    ? `${wallet.bgColor} hover:scale-105`
                    : 'bg-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className='flex-shrink-0'>{wallet.icon}</div>
                <div>
                  <h3 className='text-white font-semibold'>{wallet.name}</h3>
                  <p className='text-gray-400 text-sm'>
                    {isAvailable ? wallet.description : 'Wallet not detected'}
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
