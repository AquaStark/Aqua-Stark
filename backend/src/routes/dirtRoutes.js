import express from 'express';
import { DirtController } from '../controllers/dirtController.js';
import {
  AuthMiddleware,
  simpleAuth,
  validateOwnership,
} from '../middleware/auth.js';

const router = express.Router();

// Apply rate limiting to all dirt routes
router.use(AuthMiddleware.rateLimit(200, 15 * 60 * 1000)); // 200 requests per 15 minutes

// Aquarium dirt status routes
router.get(
  '/aquarium/:aquariumId',
  process.env.NODE_ENV === 'production' ? simpleAuth : (req, res, next) => next(),
  process.env.NODE_ENV === 'production' ? validateOwnership('aquarium') : (req, res, next) => next(),
  DirtController.getAquariumDirtStatus
);

// Clean aquarium routes
router.post(
  '/aquarium/:aquariumId/clean',
  process.env.NODE_ENV === 'production' ? simpleAuth : (req, res, next) => next(),
  process.env.NODE_ENV === 'production' ? validateOwnership('aquarium') : (req, res, next) => next(),
  DirtController.cleanAquarium
);

// Clean individual dirt spot
router.post(
  '/aquarium/:aquariumId/clean-spot',
  process.env.NODE_ENV === 'production' ? simpleAuth : (req, res, next) => next(),
  process.env.NODE_ENV === 'production' ? validateOwnership('aquarium') : (req, res, next) => next(),
  DirtController.cleanDirtSpot
);

// Initialize dirt system for new aquarium
router.post(
  '/aquarium/:aquariumId/initialize',
  process.env.NODE_ENV === 'production' ? simpleAuth : (req, res, next) => next(),
  process.env.NODE_ENV === 'production' ? validateOwnership('aquarium') : (req, res, next) => next(),
  DirtController.initializeAquariumDirtSystem
);

// Update aquarium dirt configuration
router.put(
  '/aquarium/:aquariumId/config',
  process.env.NODE_ENV === 'production' ? simpleAuth : (req, res, next) => next(),
  process.env.NODE_ENV === 'production' ? validateOwnership('aquarium') : (req, res, next) => next(),
  DirtController.updateAquariumDirtConfig
);

// Player dirt statistics routes
router.get(
  '/player/:playerId/aquariums',
  process.env.NODE_ENV === 'production' ? simpleAuth : (req, res, next) => next(),
  process.env.NODE_ENV === 'production' ? validateOwnership('player') : (req, res, next) => next(),
  DirtController.getPlayerAquariumDirtStatuses
);

router.get(
  '/player/:playerId/stats',
  process.env.NODE_ENV === 'production' ? simpleAuth : (req, res, next) => next(),
  process.env.NODE_ENV === 'production' ? validateOwnership('player') : (req, res, next) => next(),
  DirtController.getPlayerDirtStats
);

export default router;
