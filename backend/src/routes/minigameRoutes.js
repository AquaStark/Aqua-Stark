import express from 'express';
import { MinigameController } from '../controllers/minigameController.js';
import { AuthMiddleware } from '../middleware/auth.js';
import { rateLimitPresets } from '../middleware/rateLimiting.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken);
router.use(rateLimitPresets.minigame);

// Game session routes
router.post('/sessions', MinigameController.createGameSession);
router.get('/sessions/:sessionId', MinigameController.getGameSession);
router.put('/sessions/:sessionId/end', MinigameController.endGameSession);

// Player statistics routes
router.get('/player/stats', MinigameController.getPlayerStats);

// Leaderboard routes
router.get('/leaderboard/:gameType', MinigameController.getGameLeaderboard);
router.get('/leaderboard/global', MinigameController.getGlobalLeaderboard);

// Achievement routes
router.post('/achievements/bonus-xp', MinigameController.awardBonusXP);

// Game information routes
router.get('/types', MinigameController.getGameTypes);

export default router;
