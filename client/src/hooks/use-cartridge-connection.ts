import { useConnect, useAccount } from '@starknet-react/core';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { WalletConnector } from '@/types';

/**
 * @file use-cartridge-connection.ts
 * @description
 * A custom hook to manage wallet connections with a primary focus on the Cartridge connector,
 * providing a streamlined experience for users of the Starknet gaming wallet. It handles connection
 * states, success/error toasts, and provides fallback options for other wallets.
 *
 * @category Hooks
 */
export function useCartridgeConnection() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  /**
   * Finds the Cartridge connector and separates it from the other available connectors.
   * This is memoized to ensure stability and prevent unnecessary re-calculations.
   * @returns {{cartridgeConnector: WalletConnector | undefined, otherConnectors: WalletConnector[]}}
   * An object containing the Cartridge connector and an array of all other connectors.
   */
  const { cartridgeConnector, otherConnectors } = useMemo(() => {
    const cartridge = connectors.find(
      connector => connector.id === 'cartridge'
    );
    const others = connectors.filter(connector => connector.id !== 'cartridge');
    return { cartridgeConnector: cartridge, otherConnectors: others };
  }, [connectors]);

  /**
   * Attempts to connect to the Cartridge wallet. It shows specific toasts for
   * success and common errors, and a modal for login/account-related issues.
   * @returns {Promise<void>}
   */
  const connectWithCartridge = useCallback(async () => {
    if (!cartridgeConnector) {
      toast.error('Cartridge no está disponible');
      return;
    }

    setIsConnecting(true);
    try {
      await connect({ connector: cartridgeConnector });
      toast.success('¡Conectado con Cartridge! Gaming optimizado activado');
    } catch (error) {
      console.error('Error connecting to Cartridge:', error);

      // Manejar errores específicos de Cartridge
      if (error instanceof Error) {
        if (
          error.message.includes('account') ||
          error.message.includes('login')
        ) {
          // Mostrar modal de ayuda en lugar de solo un toast
          setShowHelpModal(true);
        } else if (error.message.includes('network')) {
          toast.error('Error de red. Intenta con otra wallet');
        } else {
          toast.error(
            'Error al conectar con Cartridge. Intenta con otra wallet'
          );
        }
      } else {
        toast.error('Error inesperado al conectar');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [connect, cartridgeConnector]);

  /**
   * Attempts to connect to any other specified wallet connector.
   * @param {WalletConnector} connector - The wallet connector to use for the connection.
   * @returns {Promise<void>}
   */
  const connectWithFallback = useCallback(
    async (connector: WalletConnector) => {
      setIsConnecting(true);
      try {
        await connect({ connector });
        toast.success(`Conectado con ${connector.name}`);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error(`Error al conectar con ${connector.name}`);
      } finally {
        setIsConnecting(false);
      }
    },
    [connect]
  );

  /**
   * Handles the action of using an alternative wallet, typically after a Cartridge connection failure.
   * It closes the help modal and provides a user-friendly message.
   * @returns {void}
   */
  const handleUseAlternative = useCallback(() => {
    setShowHelpModal(false);
    // Aquí podrías abrir el modal de selección de wallets
    // o navegar a una página específica
    toast.info('Selecciona otra wallet del modal de conexión');
  }, []);

  /**
   * @returns {{
   * isConnected: boolean,
   * isConnecting: boolean,
   * showHelpModal: boolean,
   * cartridgeConnector: WalletConnector | undefined,
   * otherConnectors: WalletConnector[],
   * connectWithCartridge: () => Promise<void>,
   * connectWithFallback: (connector: WalletConnector) => Promise<void>,
   * setShowHelpModal: (show: boolean) => void,
   * handleUseAlternative: () => void,
   * }} An object containing state, connectors, and methods for wallet connection.
   */
  return {
    isConnected,
    isConnecting,
    showHelpModal,
    cartridgeConnector,
    otherConnectors,
    connectWithCartridge,
    connectWithFallback,
    setShowHelpModal,
    handleUseAlternative,
  };
}
