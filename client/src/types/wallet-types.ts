// Wallet and connector types
export interface WalletConnector {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed?: boolean;
  downloadUrl?: string;
  connect: () => Promise<WalletAccount>;
  disconnect: () => Promise<void>;
}

export interface WalletAccount {
  address: string;
  chainId: string;
  isConnected: boolean;
  isConnecting: boolean;
  connector?: WalletConnector;
}

export interface WalletState {
  account: WalletAccount | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectors: WalletConnector[];
}

// Starknet specific types
export interface StarknetAccount {
  address: string;
  chainId: string;
  isConnected: boolean;
  provider: unknown; // Starknet provider type
}

export interface StarknetConnector extends WalletConnector {
  provider: unknown;
  account: StarknetAccount | null;
}

// Transaction types
export interface TransactionRequest {
  to: string;
  value?: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
}

export interface TransactionResponse {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: string;
  error?: string;
}

// Error types for wallet operations
export interface WalletError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
