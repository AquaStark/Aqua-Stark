import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { WalletConnector } from '@/types/connector-types';
import { useLocalStorage } from '@/hooks';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { setValue: setSessionData } = useLocalStorage('aqua-stark-session', {
    defaultValue: null,
    syncAcrossTabs: true,
  });

  const handleConnect = async (connector: WalletConnector) => {
    try {
      await connect({ connector });
      // Initialize gaming session
      const sessionData = {
        startTime: Date.now(),
        permissions: ['game_actions', 'asset_transfer'],
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      setSessionData(sessionData);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      // Add user-friendly error feedback
      alert('Failed to connect wallet. Please try again.');
    }
  };

  if (isConnected) {
    return (
      <div className='wallet-connected'>
        <p>
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div className='wallet-selection'>
      {connectors.map(connector => (
        <button
          key={connector.id}
          onClick={() => handleConnect(connector)}
          className={`wallet-button ${
            connector.id === 'cartridge' ? 'gaming-optimized' : ''
          }`}
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}
