import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client for caching
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    tls: process.env.REDIS_URL?.includes('upstash.io') || false,
    rejectUnauthorized: false,
  },
});

// Connect to Redis
redisClient.on('error', err => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Initialize Redis connection
export const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connection established');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

// Cache keys for different game states
export const CACHE_KEYS = {
  FISH_HAPPINESS: fishId => `fish:happiness:${fishId}`,
  AQUARIUM_STATE: aquariumId => `aquarium:state:${aquariumId}`,
  AQUARIUM_DIRT: aquariumId => `aquarium:dirt:${aquariumId}`,
  PLAYER_SESSION: playerId => `player:session:${playerId}`,
  PLAYER_PROFILE: playerId => `player:profile:${playerId}`,
  DECORATION_STATE: decorationId => `decoration:state:${decorationId}`,
  GAME_LEADERBOARD: 'game:leaderboard',
  ACTIVE_PLAYERS: 'game:active_players',
  STORE_ITEMS: filters => `store:items:${filters}`,
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  FISH_STATE: 300, // 5 minutes
  AQUARIUM_STATE: 600, // 10 minutes
  AQUARIUM_DIRT: 300, // 5 minutes
  PLAYER_SESSION: 3600, // 1 hour
  LEADERBOARD: 1800, // 30 minutes
  STORE_ITEMS: 900, // 15 minutes
};
