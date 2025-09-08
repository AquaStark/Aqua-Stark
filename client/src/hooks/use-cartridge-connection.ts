import { useConnect, useAccount } from '@starknet-react/core';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export function useCartridgeConnection() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Encontrar el conector de Cartridge - usar useMemo para estabilidad
  const { cartridgeConnector, otherConnectors } = useMemo(() => {
    const cartridge = connectors.find(
      connector => connector.id === 'cartridge'
    );
    const others = connectors.filter(connector => connector.id !== 'cartridge');
    return { cartridgeConnector: cartridge, otherConnectors: others };
  }, [connectors]);

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

  const connectWithFallback = useCallback(
    async (connector: any) => {
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

  const handleUseAlternative = useCallback(() => {
    setShowHelpModal(false);
    // Aquí podrías abrir el modal de selección de wallets
    // o navegar a una página específica
    toast.info('Selecciona otra wallet del modal de conexión');
  }, []);

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
