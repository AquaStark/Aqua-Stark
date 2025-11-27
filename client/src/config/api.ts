// API Configuration for Aqua Stark Backend
// Centralized configuration to avoid hardcoding URLs throughout the frontend

import { ENV_CONFIG } from '@/constants';
import { RequestData } from '../types/api-types';

export const API_CONFIG = {
  // Backend base URL - change this for different environments
  BASE_URL: ENV_CONFIG.API_URL,

  // API version
  VERSION: 'v1',

  // Endpoints (without /api prefix - BASE_URL already includes it)
  ENDPOINTS: {
    // Player endpoints
    PLAYERS: {
      GET_BY_WALLET: '/v1/players/wallet/:walletAddress',
      CREATE: '/v1/players/create',
      PROFILE: '/v1/players/:playerId/profile',
      EXPERIENCE: '/v1/players/:playerId/experience',
      CURRENCY: '/v1/players/:playerId/currency',
      STATS: '/v1/players/:playerId/stats',
      LAST_LOGIN: '/v1/players/:playerId/last-login',
      PREFERENCES: '/v1/players/:playerId/preferences',
      DASHBOARD: '/v1/players/:playerId/dashboard',
    },

    // Fish endpoints
    FISH: {
      STATE: '/v1/fish/:fishId/state',
      PLAYER_FISH: '/v1/fish/player/:playerId',
      FEED: '/v1/fish/:fishId/feed',
      PLAY: '/v1/fish/:fishId/play',
      MOOD: '/v1/fish/:fishId/mood',
      CREATE_STATE: '/v1/fish/state',
    },

    // Decoration endpoints
    DECORATIONS: {
      STATE: '/v1/decorations/:decorationId/state',
      PLAYER_DECORATIONS: '/v1/decorations/player/:playerId',
      AQUARIUM_DECORATIONS: '/v1/decorations/aquarium/:aquariumId',
      PLACE: '/v1/decorations/:decorationId/place',
      REMOVE: '/v1/decorations/:decorationId',
      POSITION: '/v1/decorations/:decorationId/position',
      VISIBILITY: '/v1/decorations/:decorationId/visibility',
      MOVE: '/v1/decorations/:decorationId/move',
      STATS: '/v1/decorations/player/:playerId/stats',
      BULK_UPDATE: '/v1/decorations/bulk-update',
      CREATE_STATE: '/v1/decorations/state',
    },

    // Real-time endpoints
    EVENTS: {
      SSE: '/v1/events/:playerWallet',
      WEBSOCKET_INFO: '/ws',
    },

    // Minigame endpoints
    MINIGAMES: {
      SESSIONS: '/v1/minigames/sessions',
      SESSION: '/v1/minigames/sessions/:sessionId',
      END_SESSION: '/v1/minigames/sessions/:sessionId/end',
      PLAYER_STATS: '/v1/minigames/player/stats',
      GAME_LEADERBOARD: '/v1/minigames/leaderboard/:gameType',
      GLOBAL_LEADERBOARD: '/v1/minigames/leaderboard/global',
      GAME_TYPES: '/v1/minigames/types',
      BONUS_XP: '/v1/minigames/achievements/bonus-xp',
    },
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string>
): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }

  return url;
};

// Helper function to create headers with authentication
export const createHeaders = (playerId?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (playerId) {
    headers['x-player-id'] = playerId;
  }

  return headers;
};

// Generic API client for making requests
export class ApiClient {
  static async get<T>(url: string, playerId?: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(playerId),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async post<T>(
    url: string,
    data: RequestData,
    playerId?: string
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(playerId),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async put<T>(
    url: string,
    data: RequestData,
    playerId?: string
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: createHeaders(playerId),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async delete<T>(url: string, playerId?: string): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: createHeaders(playerId),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
