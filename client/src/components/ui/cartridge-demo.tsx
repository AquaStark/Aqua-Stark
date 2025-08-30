'use client';

import React from 'react';
import { ConnectButton } from './connect-button';
import { useCartridgeSession } from '@/hooks/use-cartridge-session';

export function CartridgeDemo() {
  const {
    isConnected,
    address,
    username,
    avatar,
    sessionType,
    isConnecting,
    refreshSession,
  } = useCartridgeSession();

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <h1 className='text-3xl font-bold text-white'>
          🎮 Cartridge Controller Demo
        </h1>
        <p className='text-gray-400'>
          Integración completa con login social (Google, Discord), WalletConnect
          y sesiones
        </p>
      </div>

      {/* Estado de conexión */}
      <div className='bg-gray-800 rounded-lg p-6'>
        <h2 className='text-xl font-semibold text-white mb-4'>
          Estado de Conexión
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
              ></div>
              <span className='text-gray-300'>
                Estado: {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>

            {isConnecting && (
              <div className='flex items-center gap-2 text-yellow-400'>
                <div className='w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin'></div>
                <span>Conectando...</span>
              </div>
            )}
          </div>

          {isConnected && address && (
            <div className='space-y-2'>
              <div className='text-gray-300'>
                <span className='font-medium'>Dirección:</span> {address}
              </div>
              {username && (
                <div className='text-gray-300'>
                  <span className='font-medium'>Usuario:</span> {username}
                </div>
              )}
              {sessionType && (
                <div className='text-gray-300'>
                  <span className='font-medium'>Tipo de sesión:</span>{' '}
                  {sessionType}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botón de conexión */}
      <div className='bg-gray-800 rounded-lg p-6'>
        <h2 className='text-xl font-semibold text-white mb-4'>
          Conectar Wallet / Iniciar Sesión
        </h2>

        <div className='space-y-4'>
          <ConnectButton size='lg' />

          <div className='text-sm text-gray-400 space-y-2'>
            <p>
              💡 <strong>Opciones disponibles en el modal de Cartridge:</strong>
            </p>
            <ul className='list-disc list-inside space-y-1 ml-4'>
              <li>
                🔐 <strong>Google</strong> - Login con cuenta de Google
              </li>
              <li>
                🎮 <strong>Discord</strong> - Login con cuenta de Discord
              </li>
              <li>
                🔗 <strong>WalletConnect</strong> - Conectar wallets externas
              </li>
              <li>
                🦊 <strong>Wallets nativas</strong> - Argent X, Braavos, etc.
              </li>
              <li>
                🔑 <strong>Passkey</strong> - Autenticación biométrica
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Información de sesión */}
      {isConnected && (
        <div className='bg-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-white mb-4'>
            Información de Sesión
          </h2>

          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-gray-700 rounded-lg p-4'>
                <h3 className='font-medium text-white mb-2'>
                  Detalles de Cuenta
                </h3>
                <div className='space-y-1 text-sm text-gray-300'>
                  <div>
                    Dirección: {address?.slice(0, 10)}...{address?.slice(-8)}
                  </div>
                  {username && <div>Usuario: {username}</div>}
                  {sessionType && <div>Tipo: {sessionType}</div>}
                </div>
              </div>

              <div className='bg-gray-700 rounded-lg p-4'>
                <h3 className='font-medium text-white mb-2'>Capacidades</h3>
                <div className='space-y-1 text-sm text-gray-300'>
                  <div>✅ Transacciones automáticas</div>
                  <div>✅ Session keys activas</div>
                  <div>✅ Gasless transactions</div>
                  <div>✅ Gaming optimizado</div>
                </div>
              </div>

              <div className='bg-gray-700 rounded-lg p-4'>
                <h3 className='font-medium text-white mb-2'>Acciones</h3>
                <div className='space-y-2'>
                  <button
                    onClick={refreshSession}
                    className='w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors'
                  >
                    🔄 Refrescar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className='bg-blue-900/20 border border-blue-500/30 rounded-lg p-6'>
        <h2 className='text-xl font-semibold text-white mb-4'>
          🚀 Características de Cartridge Controller
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <h3 className='font-medium text-blue-300'>Login Social</h3>
            <ul className='text-sm text-gray-300 space-y-1'>
              <li>• Google OAuth integrado</li>
              <li>• Discord OAuth integrado</li>
              <li>• Registro automático</li>
              <li>• Perfiles de usuario</li>
            </ul>
          </div>

          <div className='space-y-3'>
            <h3 className='font-medium text-blue-300'>Gaming Features</h3>
            <ul className='text-sm text-gray-300 space-y-1'>
              <li>• Session keys automáticas</li>
              <li>• Transacciones sin gas</li>
              <li>• UX optimizada para juegos</li>
              <li>• Integración con Dojo Engine</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
