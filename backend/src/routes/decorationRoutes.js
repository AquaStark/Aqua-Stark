import express from 'express';
import { DecorationController } from '../controllers/decorationController.js';
import { simpleAuth, validateOwnership } from '../middleware/auth.js';
import { rateLimitPresets } from '../middleware/rateLimiting.js';

const router = express.Router();

// Apply rate limiting to all decoration routes
router.use(rateLimitPresets.authenticated);

// Decoration state routes (require authentication)
router.get(
  '/:decorationId',
  simpleAuth,
  validateOwnership('decoration'),
  DecorationController.getDecorationState
);
router.post('/create', simpleAuth, DecorationController.createDecorationState);

// Player decoration routes (require authentication)
router.get(
  '/player/:playerId',
  simpleAuth,
  DecorationController.getPlayerDecorations
);
router.get(
  '/player/:playerId/stats',
  simpleAuth,
  DecorationController.getPlayerDecorationStats
);

// Aquarium decoration routes (require authentication)
router.get(
  '/aquarium/:aquariumId',
  simpleAuth,
  DecorationController.getAquariumDecorations
);

// Decoration placement and management routes (require authentication)
router.post(
  '/:decorationId/place',
  simpleAuth,
  validateOwnership('decoration'),
  DecorationController.placeDecoration
);
router.delete(
  '/:decorationId/remove',
  simpleAuth,
  validateOwnership('decoration'),
  DecorationController.removeDecoration
);
router.put(
  '/:decorationId/position',
  simpleAuth,
  validateOwnership('decoration'),
  DecorationController.updateDecorationPosition
);
router.put(
  '/:decorationId/visibility',
  simpleAuth,
  validateOwnership('decoration'),
  DecorationController.toggleDecorationVisibility
);
router.put(
  '/:decorationId/move',
  simpleAuth,
  validateOwnership('decoration'),
  DecorationController.moveDecoration
);

// Bulk operations (require authentication)
router.put(
  '/bulk/positions',
  simpleAuth,
  DecorationController.bulkUpdatePositions
);

export default router;
