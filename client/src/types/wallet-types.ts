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
import type { AccountInterface, ProviderInterface } from 'starknet';

export interface StarknetAccount {
  address: string;
  chainId: string;
  isConnected: boolean;
  provider: ProviderInterface | AccountInterface;
}

export interface StarknetConnector extends WalletConnector {
  provider: ProviderInterface | AccountInterface;
  account: StarknetAccount | null;
}

// Transaction types
import type { BigNumberish } from 'starknet';

export interface TransactionRequest {
  to: string;
  value?: BigNumberish;
  data?: string;
  gasLimit?: BigNumberish;
  gasPrice?: BigNumberish;
}

export interface TransactionResponse {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: BigNumberish;
  error?: string;
}

// Error types for wallet operations
export interface WalletError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
