// API Configuration for Aqua Stark Backend
// Centralized configuration to avoid hardcoding URLs throughout the frontend

import { ENV_CONFIG } from './environment';

export const API_CONFIG = {
  // Backend base URL - change this for different environments
  BASE_URL: ENV_CONFIG.API_URL,

  // API version
  VERSION: 'v1',

  // Endpoints
  ENDPOINTS: {
    // Player endpoints
    PLAYERS: {
      GET_BY_WALLET: '/api/v1/players/wallet/:walletAddress',
      CREATE: '/api/v1/players/create',
      PROFILE: '/api/v1/players/:playerId/profile',
      EXPERIENCE: '/api/v1/players/:playerId/experience',
      CURRENCY: '/api/v1/players/:playerId/currency',
      STATS: '/api/v1/players/:playerId/stats',
      LAST_LOGIN: '/api/v1/players/:playerId/last-login',
      PREFERENCES: '/api/v1/players/:playerId/preferences',
      DASHBOARD: '/api/v1/players/:playerId/dashboard',
    },

    // Fish endpoints
    FISH: {
      STATE: '/api/v1/fish/:fishId/state',
      PLAYER_FISH: '/api/v1/fish/player/:playerId',
      FEED: '/api/v1/fish/:fishId/feed',
      PLAY: '/api/v1/fish/:fishId/play',
      MOOD: '/api/v1/fish/:fishId/mood',
      CREATE_STATE: '/api/v1/fish/state',
    },

    // Decoration endpoints
    DECORATIONS: {
      STATE: '/api/v1/decorations/:decorationId/state',
      PLAYER_DECORATIONS: '/api/v1/decorations/player/:playerId',
      AQUARIUM_DECORATIONS: '/api/v1/decorations/aquarium/:aquariumId',
      PLACE: '/api/v1/decorations/:decorationId/place',
      REMOVE: '/api/v1/decorations/:decorationId',
      POSITION: '/api/v1/decorations/:decorationId/position',
      VISIBILITY: '/api/v1/decorations/:decorationId/visibility',
      MOVE: '/api/v1/decorations/:decorationId/move',
      STATS: '/api/v1/decorations/player/:playerId/stats',
      BULK_UPDATE: '/api/v1/decorations/bulk-update',
      CREATE_STATE: '/api/v1/decorations/state',
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

  static async post<T>(url: string, data: any, playerId?: string): Promise<T> {
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

  static async put<T>(url: string, data: any, playerId?: string): Promise<T> {
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
