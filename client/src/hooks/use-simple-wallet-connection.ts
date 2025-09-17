import { useConnect, useAccount } from '@starknet-react/core';
import { useState, useCallback } from 'react';
import { WalletConnector } from '@/types/connector-types';
import { useNotifications } from './use-notifications';

export function useSimpleWalletConnection() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const { error: showError, success: showSuccess } = useNotifications();

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
