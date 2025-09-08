import { useConnect, useAccount } from '@starknet-react/core';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useSimpleWalletConnection() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(
    async (connector: any) => {
      if (!connector || !connector.available()) {
        toast.error('Wallet no disponible');
        return;
      }

      setIsConnecting(true);
      try {
        await connect({ connector });
        toast.success(`Conectado con ${connector.name}`);
      } catch (error) {
        console.error('Error connecting wallet:', error);

        // Manejar errores específicos
        if (error instanceof Error) {
          if (error.message.includes('User rejected')) {
            toast.error('Conexión cancelada por el usuario');
          } else if (error.message.includes('network')) {
            toast.error('Error de red. Verifica tu conexión');
          } else {
            toast.error(`Error al conectar con ${connector.name}`);
          }
        } else {
          toast.error('Error inesperado al conectar');
        }
      } finally {
        setIsConnecting(false);
      }
    },
    [connect]
  );

  // Filtrar conectores disponibles
  const availableConnectors = connectors.filter(connector => {
    try {
      return connector.available();
    } catch (error) {
      console.warn(`Error checking availability for ${connector.name}:`, error);
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
