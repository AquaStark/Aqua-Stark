// Player data types
export interface PlayerData {
  id: string;
  walletAddress: string;
  username: string;
  experience: number;
  level: number;
  currency: number;
  lastLogin: string;
  preferences: Record<string, unknown>;
  stats: {
    totalFish: number;
    totalAquariums: number;
    achievements: number;
  };
}

export interface BackendPlayerData {
  id: string;
  wallet_address: string;
  username: string;
  experience: number;
  level: number;
  currency: number;
  last_login: string;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OnChainPlayerData {
  id: string;
  owner: string;
  username: string;
  experience: number;
  level: number;
  currency: number;
  last_login: number;
}

// Game action call types
import type { BigNumberish } from 'starknet';

export interface GameCall {
  contractAddress: string;
  entrypoint: string;
  calldata: BigNumberish[];
}

export interface GameActionParams {
  calls: GameCall[];
}

export interface GameActionResult {
  hash: string;
  success?: boolean;
  error?: string;
}

// Settings types
export type SettingsValue = string | number | boolean | Record<string, unknown>;
