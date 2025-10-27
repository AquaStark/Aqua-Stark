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

// Redis connection state
let isConnected = false;
let reconnectAttempts = 0;

// Connect to Redis
redisClient.on('error', err => {
  console.error('Redis Client Error:', err.message);
  isConnected = false;
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
  isConnected = true;
  reconnectAttempts = 0;
});

redisClient.on('ready', () => {
  console.log('Redis connection established');
  isConnected = true;
});

redisClient.on('end', () => {
  console.log('Redis connection ended');
  isConnected = false;
});

redisClient.on('reconnecting', () => {
  reconnectAttempts++;
  console.log(`Redis: Reconnecting... (attempt ${reconnectAttempts})`);
});

// Initialize Redis connection with retry logic
export const initRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    console.log('Redis connection established');
    return true;
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    
    // Don't throw error, just log it and continue without Redis
    console.log('Continuing without Redis cache...');
    return false;
  }
};

// Safe Redis operations that won't crash the app
export const safeRedisGet = async (key) => {
  try {
    if (!isConnected || !redisClient.isOpen) return null;
    return await redisClient.get(key);
  } catch (error) {
    console.error('Redis GET error:', error.message);
    return null;
  }
};

export const safeRedisSet = async (key, value, ttl = null) => {
  try {
    if (!isConnected || !redisClient.isOpen) return false;
    if (ttl) {
      await redisClient.setEx(key, ttl, value);
    } else {
      await redisClient.set(key, value);
    }
    return true;
  } catch (error) {
    console.error('Redis SET error:', error.message);
    return false;
  }
};

export const safeRedisDel = async (key) => {
  try {
    if (!isConnected || !redisClient.isOpen) return false;
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error.message);
    return false;
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
  SHOP_ITEM: itemId => `shop:item:${itemId}`,
  PLAYER_INVENTORY: 'player:inventory',
  PLAYER_CURRENCY: 'player:currency',
  SHOP_CATEGORIES: 'shop:categories',
  LIMITED_ITEMS: 'shop:limited',
  DAILY_DEALS: 'shop:daily_deals',
  TRANSACTION: id => `transaction:${id}`,
  PLAYER_TRANSACTIONS: wallet => `player:transactions:${wallet}`,
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  FISH_STATE: 300, // 5 minutes
  AQUARIUM_STATE: 600, // 10 minutes
  AQUARIUM_DIRT: 300, // 5 minutes
  PLAYER_SESSION: 3600, // 1 hour
  LEADERBOARD: 1800, // 30 minutes
  STORE_ITEMS: 900, // 15 minutes

  SHOP_ITEMS: 300, //  5 minutes
  PLAYER_DATA: 300, // 5 minutes
  CATEGORIES: 7200, // 2 hours
  LIMITED_ITEMS: 60, // 1 minute for limited items

  TRANSACTION: 300, // 5 minutes
  PLAYER_TRANSACTIONS: 300, // 5 minutes
};
