import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';

// Import configurations
import { initRedis } from './config/redis.js';

// Import routes
import fishRoutes from './routes/fishRoutes.js';
import minigameRoutes from './routes/minigameRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import decorationRoutes from './routes/decorationRoutes.js';
import dirtRoutes from './routes/dirtRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import shopRouter from './routes/shopRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';

// Import WebSocket
import { GameWebSocket } from './websocket/gameWebSocket.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server for WebSocket
const server = http.createServer(app);

// Initialize WebSocket server
const gameWebSocket = new GameWebSocket(server);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for fullscreen
  crossOriginEmbedderPolicy: false
})); // Security headers

// Full screen headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'fullscreen=(self)');
  next();
});

app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Full screen configuration endpoint
app.get('/api/v1/fullscreen-config', (req, res) => {
  res.json({
    fullscreen: {
      enabled: true,
      supported: true,
      permissions: {
        fullscreen: 'granted'
      },
      features: {
        orientationLock: true,
        fullscreenAPI: true,
        mobileFullscreen: true
      }
    }
  });
});

// API versioning
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Aqua Stark API v1',
    version: '1.0.0',
    endpoints: {
      players: '/api/v1/players',
      fish: '/api/v1/fish',
      decorations: '/api/v1/decorations',
      minigames: '/api/v1/minigames',
      dirt: '/api/v1/dirt',
      store: '/api/v1/store',
      websocket: '/ws',
    },
  });
});

// API routes
app.use('/api/v1/fish', fishRoutes);
app.use('/api/v1/minigames', minigameRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/decorations', decorationRoutes);
app.use('/api/v1/dirt', dirtRoutes);
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/shop', shopRouter);
app.use('/api/transaction/', transactionRouter);

// WebSocket endpoint info
app.get('/ws', (req, res) => {
  res.json({
    message: 'WebSocket endpoint',
    url: `ws://${req.get('host')}/ws`,
    authentication: 'Send JWT token in authenticate message',
    channels: ['fish_updates', 'aquarium_updates', 'game_events'],
  });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Initialize and start server
async function startServer() {
  try {
    // Initialize Redis connection
    await initRedis();

    // Start server
    server.listen(PORT, () => {
      console.log('');
      console.log(
        '🌊 ╔══════════════════════════════════════════════════════════════╗'
      );
      console.log(
        '🐟 ║                    AQUA STARK BACKEND                        ║'
      );
      console.log(
        '🌊 ║                     Underwater API                           ║'
      );
      console.log(
        '🐠 ╚══════════════════════════════════════════════════════════════╝'
      );
      console.log('');
      console.log(`🌊  Server swimming on port ${PORT}`);
      console.log(`🐟  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
      console.log('🔗 API Endpoints:');
      console.log(`   🐠 Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`   🐡 Health: http://localhost:${PORT}/health`);
      console.log(`   🌊 WebSocket: ws://localhost:${PORT}/ws`);
      console.log('');
      console.log('🎮 Game Features:');
      console.log('   🐟 Fish Management API');
      console.log('   🏠 Aquarium States');
      console.log('   🎯 Minigame Sessions');
      console.log('   🏪 Store System');
      console.log('   ⚡ Real-time Updates');
      console.log('');
      console.log('🌊 Ready to dive into the aquatic world! 🐠');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Export for testing
export { app, server, gameWebSocket };
