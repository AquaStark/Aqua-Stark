import express from 'express';
import { PlayerController } from '../controllers/playerController.js';
import {
  AuthMiddleware,
  simpleAuth,
  validateOwnership,
} from '../middleware/auth.js';

const router = express.Router();

// Apply rate limiting to all player routes (protects endpoints performing authorization)
router.use(AuthMiddleware.rateLimit(300, 15 * 60 * 1000)); // 300 requests per 15 minutes

// Player profile routes (require authentication)
router.get(
  '/profile/:playerId',
  simpleAuth,
  validateOwnership('player'),
  PlayerController.getPlayerProfile
);
router.get('/wallet/:walletAddress', PlayerController.getPlayerByWallet);
router.post('/create', PlayerController.createPlayer);
router.put(
  '/:playerId/experience',
  simpleAuth,
  validateOwnership('player'),
  PlayerController.updatePlayerExperience
);
router.put(
  '/:playerId/currency',
  simpleAuth,
  validateOwnership('player'),
  PlayerController.updatePlayerCurrency
);
router.put(
  '/:playerId/stats',
  simpleAuth,
  validateOwnership('player'),
  PlayerController.updatePlayerStats
);
router.put(
  '/:playerId/login',
  simpleAuth,
  validateOwnership('player'),
  PlayerController.updateLastLogin
);

// Player preferences routes (require authentication)
router.get(
  '/:playerId/preferences',
  simpleAuth,
  validateOwnership('player'),
  PlayerController.getPlayerPreferences
);
router.put(
  '/:playerId/preferences',
  simpleAuth,
  validateOwnership('player'),
  PlayerController.updatePlayerPreferences
);

// Player dashboard route (require authentication)
router.get(
  '/:playerId/dashboard',
  simpleAuth,
  validateOwnership('player'),
  PlayerController.getPlayerDashboard
);

export default router;
