import express from 'express';
import { FishController } from '../controllers/fishController.js';
import { simpleAuth, validateOwnership } from '../middleware/auth.js';
import { rateLimitPresets } from '../middleware/rateLimiting.js';

const router = express.Router();

// Apply rate limiting to all fish routes
router.use(rateLimitPresets.authenticated);

// Fish state routes (require authentication)
router.get(
  '/:fishId',
  simpleAuth,
  validateOwnership('fish'),
  FishController.getFishState
);
router.get('/:fishId/stats', FishController.getFishStats);
router.put(
  '/:fishId/happiness',
  simpleAuth,
  validateOwnership('fish'),
  FishController.updateFishHappiness
);

// Fish feeding routes
router.post(
  '/:fishId/feed',
  simpleAuth,
  validateOwnership('fish'),
  FishController.feedFish
);

// Fish breeding routes
router.post(
  '/breed',
  simpleAuth,
  validateOwnership('fish'),
  FishController.breedFish
);

// Player fish collection routes (require authentication)
router.get('/player/:playerId', FishController.getPlayerFish);

// Fish needing attention route
router.get(
  '/player/:playerId/attention',
  FishController.getFishNeedingAttention
);

// Fish filtering route
router.get('/filter', FishController.filterFish);
// Global fish statistics route
router.get('/stats', FishController.getGlobalFishStats);

export default router;
