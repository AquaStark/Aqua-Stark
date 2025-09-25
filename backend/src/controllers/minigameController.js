import { MinigameService } from '../services/minigameService.js';
import { loggingMiddleware } from '../middleware/logging.js';

// Minigame controller for handling HTTP requests related to game sessions
export class MinigameController {
  // Create a new game session
  static async createGameSession(req, res) {
    try {
      const { gameType } = req.body;
      const { walletAddress } = req.user;

      if (!gameType) {
        return res.status(400).json({ error: 'Game type is required' });
      }

      const validGameTypes = [
        'flappy_fish',
        'angry_fish',
        'fish_racing',
        'bubble_pop',
        'fish_memory',
      ];
      if (!validGameTypes.includes(gameType)) {
        return res.status(400).json({ error: 'Invalid game type' });
      }

      const session = await MinigameService.createGameSession(
        walletAddress,
        gameType
      );

      res.json({
        success: true,
        data: session,
        message: `Game session created for ${gameType}`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'createGameSession',
        error,
        {
          gameType: req.body?.gameType,
          walletAddress: req.user?.walletAddress,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // End game session with final score
  static async endGameSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { finalScore, gameType } = req.body;
      const { walletAddress: _walletAddress } = req.user;

      if (!sessionId || finalScore === undefined || !gameType) {
        return res.status(400).json({
          error: 'Session ID, final score, and game type are required',
        });
      }

      const session = await MinigameService.endGameSession(
        sessionId,
        finalScore,
        gameType
      );

      res.json({
        success: true,
        data: session,
        message: 'Game session ended successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'endGameSession',
        error,
        {
          sessionId: req.params?.sessionId,
          finalScore: req.body?.finalScore,
          gameType: req.body?.gameType,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get player statistics
  static async getPlayerStats(req, res) {
    try {
      const { playerId } = req.params;

      const stats = await MinigameService.getPlayerStats(playerId);

      res.json({ success: true, data: stats });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getPlayerStats',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get game leaderboard
  static async getGameLeaderboard(req, res) {
    try {
      const { gameType } = req.params;

      const leaderboard = await MinigameService.getGameLeaderboard(gameType);

      res.json({ success: true, data: leaderboard });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getGameLeaderboard',
        error,
        {
          gameType: req.params?.gameType,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get global leaderboard
  static async getGlobalLeaderboard(req, res) {
    try {
      const leaderboard = await MinigameService.getGlobalLeaderboard();

      res.json({ success: true, data: leaderboard });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getGlobalLeaderboard',
        error
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Award bonus XP to player
  static async awardBonusXP(req, res) {
    try {
      const { playerId } = req.params;
      const { bonusXP } = req.body;

      if (!bonusXP || bonusXP <= 0) {
        return res.status(400).json({
          error: 'Valid bonus XP amount is required',
        });
      }

      const result = await MinigameService.awardBonusXP(playerId, bonusXP);

      res.json({
        success: true,
        data: result,
        message: `Bonus XP awarded: +${bonusXP}`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'awardBonusXP',
        error,
        {
          playerId: req.params?.playerId,
          bonusXP: req.body?.bonusXP,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get game session details
  static async getGameSession(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await MinigameService.getGameSession(sessionId);

      if (!session) {
        return res.status(404).json({ error: 'Game session not found' });
      }

      res.json({ success: true, data: session });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getGameSession',
        error,
        {
          sessionId: req.params?.sessionId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get available game types
  static async getGameTypes(req, res) {
    try {
      const gameTypes = await MinigameService.getGameTypes();

      res.json({
        success: true,
        data: gameTypes,
        count: gameTypes.length,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getGameTypes',
        error
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
