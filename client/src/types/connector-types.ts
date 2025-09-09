import { Connector } from '@starknet-react/core';

// Base connector interface that extends the Starknet React Connector
export interface WalletConnector extends Connector {
  id: string;
  name: string;
  available(): boolean;
}

// Specific connector types for different wallet providers
export interface CartridgeConnector extends WalletConnector {
  id: 'cartridge';
  name: 'Cartridge';
}

export interface ArgentXConnector extends WalletConnector {
  id: 'argentX';
  name: 'Argent X';
}

export interface BraavosConnector extends WalletConnector {
  id: 'braavos';
  name: 'Braavos';
}

// Union type for all supported connectors
export type SupportedConnector =
  | CartridgeConnector
  | ArgentXConnector
  | BraavosConnector
  | WalletConnector;
