import express from 'express';
import { FishController } from '../controllers/fishController.js';
import { simpleAuth, validateOwnership } from '../middleware/auth.js';

const router = express.Router();

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
router.post('/breed', FishController.breedFish);

// Player fish collection routes (require authentication)
router.get('/player/:playerId', simpleAuth, FishController.getPlayerFish);

export default router;
