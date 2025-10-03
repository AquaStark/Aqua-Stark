import { useConnect, useAccount } from '@starknet-react/core';
import { useState, useCallback } from 'react';
import { WalletConnector } from '@/types';
import { useNotifications } from './use-notifications';

/**
 * Custom hook to manage Starknet wallet connection logic with user feedback.
 *
 * This hook provides simplified wallet connection functionality using Starknet React,
 * including connection state tracking, error handling with user-friendly messages,
 * and filtering of only available wallet connectors.
 *
 * @returns {{
 *   isConnected: boolean;
 *   isConnecting: boolean;
 *   connectors: WalletConnector[];
 *   connectWallet: (connector: WalletConnector) => Promise<void>;
 * }} An object containing connection state, available connectors, and a connection function.
 *
 * @example
 * ```tsx
 * const { isConnected, isConnecting, connectors, connectWallet } = useSimpleWalletConnection();
 *
 * return (
 *   <div>
 *     {isConnected ? (
 *       <p>Wallet connected!</p>
 *     ) : (
 *       <div>
 *         {connectors.map(connector => (
 *           <button
 *             key={connector.id}
 *             onClick={() => connectWallet(connector)}
 *             disabled={isConnecting}
 *           >
 *             {connector.name}
 *           </button>
 *         ))}
 *       </div>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useSimpleWalletConnection() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const { error: showError, success: showSuccess } = useNotifications();

  /**
   * Initiates a wallet connection attempt using the provided connector.
   *
   * Handles common connection errors (e.g., user rejection, network issues)
   * and displays appropriate notifications to the user via the notification system.
   *
   * @param {WalletConnector} connector - The wallet connector to use for connection.
   * @returns {Promise<void>} A promise that resolves when the connection attempt completes.
   */
  const connectWallet = useCallback(
    async (connector: WalletConnector) => {
      if (!connector || !connector.available()) {
        showError('Wallet no disponible');
        return;
      }

      setIsConnecting(true);
      try {
        await connect({ connector });
        showSuccess(`Conectado con ${connector.name}`);
      } catch (err: unknown) {
        console.error('Error connecting wallet:', err);

        // Manejar errores específicos
        if (err instanceof Error) {
          if (err.message.includes('User rejected')) {
            showError('Conexión cancelada por el usuario');
          } else if (err.message.includes('network')) {
            showError('Error de red. Verifica tu conexión');
          } else {
            showError(`Error al conectar con ${connector.name}`);
          }
        } else {
          showError('Error inesperado al conectar');
        }
      } finally {
        setIsConnecting(false);
      }
    },
    [connect, showError, showSuccess]
  );

  // Filtrar conectores disponibles
  const availableConnectors = connectors.filter(connector => {
    try {
      return connector.available();
    } catch (connectorError) {
      console.warn(
        `Error checking availability for ${connector.name}:`,
        connectorError
      );
      return false;
    }
  });

  return {
    isConnected,
    isConnecting,
    connectors: availableConnectors,
    connectWallet,
  };
}
