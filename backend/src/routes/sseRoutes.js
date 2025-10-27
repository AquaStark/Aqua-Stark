import express from 'express';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Store active SSE connections
const activeConnections = new Map();

// Redis client for real-time updates
let redisClient;
let subscriber;

// Initialize Redis connection
async function initRedisSSE() {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    subscriber = createClient({ url: process.env.REDIS_URL });

    await redisClient.connect();
    await subscriber.connect();

    // Subscribe to game channels
    await subscriber.subscribe('fish_updates', handleFishUpdate);
    await subscriber.subscribe('aquarium_updates', handleAquariumUpdate);
    await subscriber.subscribe('game_events', handleGameEvent);
  }
}

// Handle fish updates
function handleFishUpdate(message) {
  const data = JSON.parse(message);
  // Broadcast to all connected clients
  activeConnections.forEach((res, playerWallet) => {
    res.write(
      `data: ${JSON.stringify({
        type: 'fish_update',
        data: data,
        timestamp: Date.now(),
      })}\n\n`
    );
  });
}

// Handle aquarium updates
function handleAquariumUpdate(message) {
  const data = JSON.parse(message);
  activeConnections.forEach((res, playerWallet) => {
    res.write(
      `data: ${JSON.stringify({
        type: 'aquarium_update',
        data: data,
        timestamp: Date.now(),
      })}\n\n`
    );
  });
}

// Handle game events
function handleGameEvent(message) {
  const data = JSON.parse(message);
  activeConnections.forEach((res, playerWallet) => {
    res.write(
      `data: ${JSON.stringify({
        type: 'game_event',
        data: data,
        timestamp: Date.now(),
      })}\n\n`
    );
  });
}

// Server-Sent Events endpoint for real-time updates
router.get('/:playerWallet', async (req, res) => {
  const { playerWallet } = req.params;

  // Initialize Redis if not already done
  await initRedisSSE();

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  // Store connection
  activeConnections.set(playerWallet, res);

  // Send initial connection message
  res.write(
    `data: ${JSON.stringify({
      type: 'connection',
      message: 'Connected to Aqua Stark real-time updates',
      playerWallet: playerWallet,
      timestamp: Date.now(),
    })}\n\n`
  );

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(
      `data: ${JSON.stringify({
        type: 'ping',
        timestamp: Date.now(),
      })}\n\n`
    );
  }, 30000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(keepAlive);
    activeConnections.delete(playerWallet);
    console.log(`SSE connection closed for player: ${playerWallet}`);
  });
});

// Broadcast function for services to use
export async function broadcastUpdate(type, data, targetPlayer = null) {
  if (!redisClient) await initRedisSSE();

  const message = JSON.stringify({
    type: type,
    data: data,
    timestamp: Date.now(),
  });

  if (targetPlayer) {
    // Send to specific player
    const connection = activeConnections.get(targetPlayer);
    if (connection) {
      connection.write(`data: ${message}\n\n`);
    }
  } else {
    // Broadcast to all players
    activeConnections.forEach((res, playerWallet) => {
      res.write(`data: ${message}\n\n`);
    });
  }
}

export default router;
