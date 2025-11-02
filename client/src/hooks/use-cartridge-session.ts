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
    let message = 'Unexpected connection error';

    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        errorType = 'USER_REJECTED';
        message = 'Connection cancelled by user';
      } else if (
        error.message.includes('account') ||
        error.message.includes('login')
      ) {
        errorType = 'ACCOUNT_NOT_FOUND';
        message = 'Account error. Verify your login in Cartridge';
      } else if (error.message.includes('network')) {
        errorType = 'NETWORK_ERROR';
        message = 'Network error. Check your connection';
      } else if (error.message.includes('session')) {
        errorType = 'SESSION_EXPIRED';
        message = 'Session expired. Reconnect your account';
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
        message: 'Cartridge Controller is not available',
      };
      toast.error(error.message);
      return;
    }

    setIsConnecting(true);
    try {
      // Connect with Cartridge - this will open the modal with options for:
      // - Google
      // - Discord
      // - WalletConnect
      // - Native wallets
      await connect({ connector: controller });

      // Try to get additional session information
      try {
        if (controller.account && address) {
          // Get username using the correct method from ControllerConnector
          let username: string | undefined;
          try {
            username = await controller.username();
          } catch (usernameError) {
            console.warn('Could not get username:', usernameError);
          }

          const accountData: CartridgeAccount = {
            address,
            username,
            avatar: (controller.account as any).avatar,
            sessionType: (controller.account as any).sessionType,
            email: (controller.account as any).email,
            provider: (controller.account as any).provider,
          };
          setAccount(accountData);
        }
      } catch (sessionError) {
        console.warn(
          'Could not get additional session information:',
          sessionError
        );
        // If we can't get additional data, at least save the address
        if (address) {
          setAccount({ address });
        }
      }

      toast.success('Connected successfully! 🎮');
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
      toast.success('Disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Error disconnecting');
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
      // Note: refreshSession is not available in the current SDK version
      // This function is kept for future compatibility
      toast.success('Active session');
    } catch (error) {
      console.warn('Could not refresh session:', error);
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
      // If we are connected but don't have account data, create a basic one
      setAccount({ address });
    }
  }, [isConnected, address, account]);

  /**
   * Effect to fetch username when controller is available and we have an address
   */
  useEffect(() => {
    const fetchUsername = async () => {
      if (controller && address && account && !account.username) {
        try {
          const username = await controller.username();
          if (username) {
            setAccount(prev =>
              prev ? { ...prev, username } : { address, username }
            );
          }
        } catch (error) {
          console.warn('Error fetching username:', error);
        }
      }
    };

    fetchUsername();
  }, [controller, address, account]);

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
