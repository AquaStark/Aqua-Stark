import { useCallback, useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from '@starknet-react/core';
import ControllerConnector from '@cartridge/connector/controller';
import { toast } from 'sonner';
import {
  UseCartridgeSessionReturn,
  CartridgeAccount,
  CartridgeError,
  CartridgeErrorType,
} from '@/types';

/**
 * @file use-cartridge-session.ts
 * @description
 * A custom hook to manage user sessions specifically with the Cartridge Controller.
 * It provides a streamlined interface for connecting, disconnecting, and managing
 * the user's account data and session state, including robust error handling and
 * user-friendly notifications.
 *
 * @category Hooks
 */
export function useCartridgeSession(): UseCartridgeSessionReturn {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<CartridgeAccount | undefined>();

  // Encontrar el conector de Cartridge Controller
  const controller = connectors.find(
    c => c instanceof ControllerConnector
  ) as ControllerConnector;

  /**
   * Handles and categorizes errors from the Cartridge connection process.
   * @param {any} error - The raw error object caught during the connection attempt.
   * @returns {CartridgeError} An object containing a standardized error code and message.
   */
  const handleCartridgeError = useCallback((error: any): CartridgeError => {
    let errorType: CartridgeErrorType = 'UNKNOWN_ERROR';
    let message = 'Error inesperado al conectar';

    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        errorType = 'USER_REJECTED';
        message = 'Conexión cancelada por el usuario';
      } else if (
        error.message.includes('account') ||
        error.message.includes('login')
      ) {
        errorType = 'ACCOUNT_NOT_FOUND';
        message = 'Error de cuenta. Verifica tu login en Cartridge';
      } else if (error.message.includes('network')) {
        errorType = 'NETWORK_ERROR';
        message = 'Error de red. Verifica tu conexión';
      } else if (error.message.includes('session')) {
        errorType = 'SESSION_EXPIRED';
        message = 'Sesión expirada. Reconecta tu cuenta';
      }
    }

    return {
      code: errorType,
      message,
      details: error,
    };
  }, []);

  /**
   * Initiates the connection process to the Cartridge Controller.
   * This function opens the Cartridge modal, handles the connection,
   * attempts to retrieve additional user data, and shows toasts for success or failure.
   * @returns {Promise<void>}
   */
  const handleConnect = useCallback(async () => {
    if (!controller) {
      const error: CartridgeError = {
        code: 'INVALID_CONFIG',
        message: 'Cartridge Controller no está disponible',
      };
      toast.error(error.message);
      return;
    }

    setIsConnecting(true);
    try {
      // Conectar con Cartridge - esto abrirá el modal con opciones de:
      // - Google
      // - Discord
      // - WalletConnect
      // - Wallets nativas
      await connect({ connector: controller });

      // Intentar obtener información adicional de la sesión
      try {
        if (controller.account && address) {
          const accountData: CartridgeAccount = {
            address,
            username: (controller.account as any).username,
            avatar: (controller.account as any).avatar,
            sessionType: (controller.account as any).sessionType,
            email: (controller.account as any).email,
            provider: (controller.account as any).provider,
          };
          setAccount(accountData);
        }
      } catch (sessionError) {
        console.warn(
          'No se pudo obtener información adicional de la sesión:',
          sessionError
        );
        // Si no podemos obtener datos adicionales, al menos guardamos la dirección
        if (address) {
          setAccount({ address });
        }
      }

      toast.success('¡Conectado exitosamente! 🎮');
    } catch (error) {
      console.error('Error connecting to Cartridge:', error);
      const cartridgeError = handleCartridgeError(error);
      toast.error(cartridgeError.message);
    } finally {
      setIsConnecting(false);
    }
  }, [connect, controller, address, handleCartridgeError]);

  /**
   * Disconnects the current wallet session and clears the account state.
   * @returns {Promise<void>}
   */
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      setAccount(undefined);
      toast.success('Desconectado exitosamente');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Error al desconectar');
    }
  }, [disconnect]);

  /**
   * Attempts to refresh the user's session.
   * NOTE: This function is a placeholder for future Cartridge SDK features, as `refreshSession` is not currently available.
   * @returns {Promise<void>}
   */
  const refreshSession = useCallback(async () => {
    if (!controller || !isConnected) return;

    try {
      // Nota: refreshSession no está disponible en la versión actual del SDK
      // Esta función se mantiene para compatibilidad futura
      toast.success('Sesión activa');
    } catch (error) {
      console.warn('No se pudo refrescar la sesión:', error);
      const cartridgeError = handleCartridgeError(error);
      toast.error(cartridgeError.message);
    }
  }, [controller, isConnected, handleCartridgeError]);

  /**
   * Effect to manage the account state based on the connection status from `starknet-react/core`.
   * It ensures the `account` state is cleared on disconnect and populated with a basic address on connect.
   */
  useEffect(() => {
    if (!isConnected) {
      setAccount(undefined);
    } else if (address && !account) {
      // Si estamos conectados pero no tenemos datos de cuenta, crear uno básico
      setAccount({ address });
    }
  }, [isConnected, address, account]);

  /**
   * @returns {UseCartridgeSessionReturn} An object containing the session state and control functions.
   */
  return {
    isConnected: isConnected || false,
    address,
    username: account?.username,
    avatar: account?.avatar,
    sessionType: account?.sessionType,
    isConnecting,
    connect: handleConnect,
    disconnect: handleDisconnect,
    refreshSession,
    account,
  };
}
