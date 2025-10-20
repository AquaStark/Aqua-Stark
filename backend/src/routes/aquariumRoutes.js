import express from 'express';
import {
  createAquarium,
  getPlayerAquariums,
} from '../controllers/aquariumController.js';

const router = express.Router();

/**
 * POST /api/v1/aquariums/create
 * Create aquarium state in backend after blockchain creation
 */
router.post('/create', createAquarium);

/**
 * GET /api/v1/aquariums/player/:playerId
 * Get all aquariums for a player
 */
router.get('/player/:playerId', getPlayerAquariums);

export default router;
