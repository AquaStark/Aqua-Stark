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
import speciesRouter from './routes/species.js';
import aquariumRouter from './routes/aquariumRoutes.js';
import sseRoutes from './routes/sseRoutes.js';

// Import WebSocket
import { GameWebSocket } from './websocket/gameWebSocket.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server for WebSocket (only if not in Vercel)
let server;
let gameWebSocket;

if (process.env.VERCEL) {
  // Vercel doesn't support persistent WebSocket connections
  console.log(
    '🌊 Running on Vercel - WebSocket disabled, using polling fallback'
  );
} else {
  // Create HTTP server for WebSocket (local development)
  server = http.createServer(app);

  // Initialize WebSocket server
  gameWebSocket = new GameWebSocket(server);
  console.log('🌊 WebSocket enabled for real-time updates');
}

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://aqua-stark-frontend.vercel.app',
            'https://your-frontend-domain.vercel.app',
          ]
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

// API versioning
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Aqua Stark API v1',
    version: '1.0.0',
    endpoints: {
      players: '/api/v1/players',
      fish: '/api/v1/fish',
      aquariums: '/api/v1/aquariums',
      decorations: '/api/v1/decorations',
      minigames: '/api/v1/minigames',
      dirt: '/api/v1/dirt',
      store: '/api/v1/store',
      species: '/api/v1/species',
      websocket: '/ws',
    },
  });
});

// API routes
app.use('/api/v1/fish', fishRoutes);
app.use('/api/v1/aquariums', aquariumRouter);
app.use('/api/v1/minigames', minigameRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/decorations', decorationRoutes);
app.use('/api/v1/dirt', dirtRoutes);
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/shop', shopRouter);
app.use('/api/transaction/', transactionRouter);
app.use('/api/v1/species', speciesRouter);
app.use('/api/v1/events', sseRoutes);

// Real-time endpoint info
app.get('/ws', (req, res) => {
  if (process.env.VERCEL) {
    res.json({
      message: 'Server-Sent Events endpoint (Vercel compatible)',
      url: `${req.protocol}://${req.get('host')}/api/v1/events/{playerWallet}`,
      method: 'GET',
      format: 'text/event-stream',
      channels: ['fish_updates', 'aquarium_updates', 'game_events'],
      example: '/api/v1/events/0x123...abc',
    });
  } else {
    res.json({
      message: 'WebSocket endpoint',
      url: `ws://${req.get('host')}/ws`,
      authentication: 'Send JWT token in authenticate message',
      channels: ['fish_updates', 'aquarium_updates', 'game_events'],
    });
  }
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

    if (process.env.VERCEL) {
      // For Vercel, just export the app
      console.log('Server ready for Vercel deployment');
      return;
    }

    // Start server (only for non-Vercel environments)
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

// Initialize Redis for both Vercel and local development
if (process.env.VERCEL) {
  // For Vercel, initialize Redis but don't start server
  initRedis().catch(console.error);
} else {
  // For local development, start the full server
  startServer();
}

// Export for Vercel - must be the default export
export default app;
