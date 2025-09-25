import { useConnect, useAccount } from '@starknet-react/core';
import { useState, useCallback } from 'react';

/**
 * @file use-starknet-connect.ts
 * @description
 * A custom hook to simplify the connection process to a Starknet wallet.
 * It uses the `@starknet-react/core` library to manage connection state and
 * provides a single handler to initiate the connection to a specific connector.
 *
 * @category Hooks
 */

/**
 * A custom hook to manage the wallet connection state using `starknet-react`.
 * It provides a simple function to connect to a wallet, tracks whether a connection
 * has been attempted, and exposes the current connection status.
 *
 * This hook is designed for a scenario where you want to programmatically
 * trigger the connection to a single, predefined connector (in this case,
 * the third one in the list, `connectors[2]`).
 *
 * @returns {{
 * status: 'idle' | 'loading' | 'connected' | 'reconnecting' | 'disconnected',
 * handleConnect: () => Promise<void>,
 * hasTriedConnect: boolean,
 * setHasTriedConnect: (tried: boolean) => void,
 * }} An object containing the connection status, a connection handler, and state related to connection attempts.
 *
 * @example
 * ```tsx
 * import { useStarknetConnect } from '@/hooks/use-starknet-connect';
 *
 * function ConnectButton() {
 * const { status, handleConnect, hasTriedConnect } = useStarknetConnect();
 *
 * const getButtonText = () => {
 * if (status === 'connected') return 'Conectado';
 * if (status === 'loading') return 'Conectando...';
 * return 'Conectar Wallet';
 * };
 *
 * return (
 * <button onClick={handleConnect} disabled={status === 'loading'}>
 * {getButtonText()}
 * </button>
 * );
 * }
 * ```
 */
export function useStarknetConnect() {
  const { connect, connectors } = useConnect();
  const { status } = useAccount();
  const [hasTriedConnect, setHasTriedConnect] = useState(false);

  /**
   * Initiates a connection to the Starknet wallet using a specific connector.
   * Currently, it attempts to connect to the connector at index 2 of the `connectors` array.
   * It also updates the `hasTriedConnect` state to track the connection attempt.
   *
   * @returns {Promise<void>} A promise that resolves when the connection attempt is complete.
   */
  const handleConnect = useCallback(async () => {
    console.log(connectors);
    const connector = connectors[2];
    console.log(connector);
    if (!connector) return;
    setHasTriedConnect(true);
    await connect({ connector });
    console.log('exit');
  }, [connect, connectors]);

  return { status, handleConnect, hasTriedConnect, setHasTriedConnect };
}
