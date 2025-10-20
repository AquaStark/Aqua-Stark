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

  // Encontrar el conector de Cartridge Controller
  const controller = connectors.find(
    c => c instanceof ControllerConnector
  ) as ControllerConnector;

  const handleConnect = useCallback(async () => {
    if (!controller) {
      toast.error('Cartridge Controller no está disponible');
      return;
    }

    setIsConnecting(true);
    try {
      // Esto abrirá el modal de Cartridge con opciones de:
      // - Google
      // - Discord
      // - WalletConnect
      // - Wallets nativas (Argent X, Braavos, etc.)
      await connect({ connector: controller });
      toast.success('¡Conectado exitosamente! 🎮');
    } catch (error) {
      console.error('Error connecting to Cartridge:', error);

      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          toast.error('Conexión cancelada por el usuario');
        } else if (
          error.message.includes('account') ||
          error.message.includes('login')
        ) {
          toast.error('Error de cuenta. Verifica tu login en Cartridge');
        } else if (error.message.includes('network')) {
          toast.error('Error de red. Verifica tu conexión');
        } else {
          toast.error('Error al conectar con Cartridge');
        }
      } else {
        toast.error('Error inesperado al conectar');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [connect, controller]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      toast.success('Desconectado exitosamente');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Error al desconectar');
    }
  }, [disconnect]);

  // Si está conectado, mostrar información de la cuenta y botón de desconectar
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
          <span>Desconectar</span>
        </button>
      </div>
    );
  }

  // Botón de conexión con estilo de Cartridge
  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`text-sm sm:text-base font-bold py-1.5 sm:py-2 px-3 sm:px-5 bg-black hover:bg-gray-900 text-yellow-400 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-yellow-400 flex items-center gap-1 sm:gap-2 ${className} ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isConnecting ? (
        <>
          <div className='w-3 h-3 sm:w-4 sm:h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin'></div>
          <span className='hidden xs:inline'>Conectando...</span>
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
