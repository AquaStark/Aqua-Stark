import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
      // Initialize gaming session
      const sessionData = {
        startTime: Date.now(),
        permissions: ['game_actions', 'asset_transfer'],
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem('aqua-stark-session', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Wallet connection failed:', error);
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
