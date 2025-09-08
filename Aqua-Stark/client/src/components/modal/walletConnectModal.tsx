'use client';

import React from 'react';
import { ConnectButton } from '@/components/ui/connect-button';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
        <div className='flex justify-between items-center mb-6'>
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

        <div className='space-y-6'>
          {/* Botón principal de Cartridge */}
          <div className='text-center'>
            <ConnectButton className='w-full' />
          </div>

          {/* Información sobre las opciones disponibles */}
          <div className='bg-gray-800/50 rounded-lg p-4'>
            <h3 className='text-white font-medium mb-3'>
              💡 Opciones disponibles en Cartridge:
            </h3>
            <div className='space-y-2 text-sm text-gray-300'>
              <div className='flex items-center gap-2'>
                <span>🔐</span>
                <span>
                  <strong>Google</strong> - Login con cuenta de Google
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span>🎮</span>
                <span>
                  <strong>Discord</strong> - Login con cuenta de Discord
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span>🔗</span>
                <span>
                  <strong>WalletConnect</strong> - Conectar wallets externas
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span>🦊</span>
                <span>
                  <strong>Wallets nativas</strong> - Argent X, Braavos, etc.
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span>🔑</span>
                <span>
                  <strong>Passkey</strong> - Autenticación biométrica
                </span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className='text-center text-sm text-gray-400 space-y-2'>
            <p>
              ¿No tienes una wallet?{' '}
              <a
                href='https://starknet.io/ecosystem/wallets/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-purple-400 hover:underline'
              >
                Obtén una aquí
              </a>
            </p>
            <p className='text-xs'>
              💡 <strong>Tip:</strong> Cartridge es ideal para gaming con
              transacciones automáticas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
