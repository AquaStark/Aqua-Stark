import { useCallback, useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from '@starknet-react/core';
import ControllerConnector from '@cartridge/connector/controller';
import { toast } from 'sonner';
import {
  UseCartridgeSessionReturn,
  CartridgeAccount,
  CartridgeError,
  CartridgeErrorType,
} from '@/types/cartridge';

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

  // Función para manejar errores de Cartridge
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

  // Función para conectar con Cartridge
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

  // Función para desconectar
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

  // Función para refrescar la sesión
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

  // Efecto para limpiar datos de sesión cuando se desconecta
  useEffect(() => {
    if (!isConnected) {
      setAccount(undefined);
    } else if (address && !account) {
      // Si estamos conectados pero no tenemos datos de cuenta, crear uno básico
      setAccount({ address });
    }
  }, [isConnected, address, account]);

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
