// Tipos para la integración de Cartridge Controller

export interface CartridgeAccount {
  address: string;
  username?: string;
  avatar?: string;
  sessionType?: 'social' | 'wallet' | 'passkey';
  email?: string;
  provider?: 'google' | 'discord' | 'walletconnect' | 'native';
}

export interface CartridgeSession {
  isConnected: boolean;
  account?: CartridgeAccount;
  isConnecting: boolean;
  sessionId?: string;
  expiresAt?: Date;
}

export interface CartridgeConfig {
  theme: 'aqua-stark' | 'dark' | 'light';
  namespace: string;
  slot: string;
  colorMode: 'dark' | 'light';
  defaultChainId: string;
  chains: Array<{
    rpcUrl: string;
    chainId?: string;
  }>;
}

export interface CartridgeLoginOptions {
  // Opciones de login social
  enableGoogle?: boolean;
  enableDiscord?: boolean;
  enableWalletConnect?: boolean;
  enablePasskey?: boolean;

  // Opciones de UX
  showRegistration?: boolean;
  redirectAfterLogin?: string;
  autoConnect?: boolean;
}

export interface CartridgeSessionPolicies {
  contracts: {
    [contractAddress: string]: {
      name: string;
      description: string;
      methods: Array<{
        name: string;
        entrypoint: string;
        description: string;
      }>;
    };
  };
}

// Tipos para eventos de Cartridge
export interface CartridgeEvent {
  type: 'connect' | 'disconnect' | 'session_expired' | 'error';
  data?: any;
  timestamp: Date;
}

// Tipos para el hook de sesión
export interface UseCartridgeSessionReturn {
  isConnected: boolean;
  address?: string;
  username?: string;
  avatar?: string;
  sessionType?: 'social' | 'wallet' | 'passkey';
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshSession: () => Promise<void>;
  account?: CartridgeAccount;
}

// Tipos para errores de Cartridge
export interface CartridgeError {
  code: string;
  message: string;
  details?: any;
}

export type CartridgeErrorType =
  | 'USER_REJECTED'
  | 'NETWORK_ERROR'
  | 'ACCOUNT_NOT_FOUND'
  | 'SESSION_EXPIRED'
  | 'INVALID_CONFIG'
  | 'UNKNOWN_ERROR';

// Tipos para el componente ConnectButton
export interface ConnectButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showAddress?: boolean;
  showUsername?: boolean;
  onConnect?: (account: CartridgeAccount) => void;
  onDisconnect?: () => void;
  onError?: (error: CartridgeError) => void;
}

// Tipos para el modal de Cartridge
export interface CartridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (account: CartridgeAccount) => void;
  onError?: (error: CartridgeError) => void;
  options?: CartridgeLoginOptions;
}

// Tipos para las políticas de sesión del juego
export interface GameSessionPolicies {
  // Contratos del juego que pueden ejecutar transacciones automáticas
  contracts: {
    [contractAddress: string]: {
      name: string;
      description: string;
      methods: Array<{
        name: string;
        entrypoint: string;
        description: string;
        maxGas?: number;
        requiresConfirmation?: boolean;
      }>;
    };
  };

  // Configuración general de la sesión
  sessionConfig?: {
    maxDuration?: number; // en milisegundos
    autoRenewal?: boolean;
    enablePasskey?: boolean;
    enableBiometric?: boolean;
  };

  // Configuración de UX
  uxConfig?: {
    showGamingBadge?: boolean;
    prioritizeGaming?: boolean;
    showFallbackOptions?: boolean;
  };
}
