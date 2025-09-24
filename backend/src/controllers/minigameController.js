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
      loggingMiddleware.logControllerError('MinigameController', 'createGameSession', error, {
        gameType: req.body?.gameType,
        walletAddress: req.user?.walletAddress
      });
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

      if (finalScore < 0) {
        return res
          .status(400)
          .json({ error: 'Final score must be non-negative' });
      }

      // Calculate XP based on game type and score
      const xpEarned = MinigameService.calculateXP(gameType, finalScore);

      const endedSession = await MinigameService.endGameSession(
        sessionId,
        finalScore,
        xpEarned
      );

      res.json({
        success: true,
        data: endedSession,
        message: `Game ended! Score: ${finalScore}, XP earned: ${xpEarned}`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError('MinigameController', 'endGameSession', error, {
        sessionId: req.params?.sessionId,
        finalScore: req.body?.finalScore,
        gameType: req.body?.gameType
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get player statistics
  static async getPlayerStats(req, res) {
    try {
      const { walletAddress: _walletAddress } = req.user;

      if (!_walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const stats = await MinigameService.getPlayerStats(_walletAddress);

      res.json({ success: true, data: stats });
    } catch (error) {
      loggingMiddleware.logControllerError('MinigameController', 'getPlayerStats', error, {
        playerId: req.params?.playerId
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get leaderboard for specific game type
  static async getGameLeaderboard(req, res) {
    try {
      const { gameType } = req.params;
      const { limit = 10 } = req.query;

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

      const leaderboard = await MinigameService.getLeaderboard(
        gameType,
        parseInt(limit)
      );

      res.json({ success: true, data: leaderboard });
    } catch (error) {
      loggingMiddleware.logControllerError('MinigameController', 'getGameLeaderboard', error, {
        gameType: req.params?.gameType
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get global leaderboard
  static async getGlobalLeaderboard(req, res) {
    try {
      const { limit = 20 } = req.query;

      const leaderboard = await MinigameService.getGlobalLeaderboard(
        parseInt(limit)
      );

      res.json({ success: true, data: leaderboard });
    } catch (error) {
      loggingMiddleware.logControllerError('MinigameController', 'getGlobalLeaderboard', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Award bonus XP for achievements
  static async awardBonusXP(req, res) {
    try {
      const { achievement, bonusXP } = req.body;
      const { walletAddress } = req.user;

      if (!achievement || !bonusXP) {
        return res
          .status(400)
          .json({ error: 'Achievement and bonus XP are required' });
      }

      if (bonusXP <= 0) {
        return res.status(400).json({ error: 'Bonus XP must be positive' });
      }

      const bonusSession = await MinigameService.awardBonusXP(
        walletAddress,
        achievement,
        bonusXP
      );

      res.json({
        success: true,
        data: bonusSession,
        message: `Bonus XP awarded for achievement: ${achievement}`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError('MinigameController', 'awardBonusXP', error, {
        playerId: req.params?.playerId,
        bonusXP: req.body?.bonusXP
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get game session by ID
  static async getGameSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { walletAddress: _walletAddress } = req.user;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      // This would need to be implemented in the service
      // For now, we'll return a placeholder
      res.json({
        success: true,
        data: { sessionId, status: 'active' },
        message: 'Session details retrieved',
      });
    } catch (error) {
      loggingMiddleware.logControllerError('MinigameController', 'getGameSession', error, {
        sessionId: req.params?.sessionId
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get available game types
  static async getGameTypes(req, res) {
    try {
      const gameTypes = [
        {
          id: 'flappy_fish',
          name: 'Flappy Fish',
          description: 'Navigate your fish through obstacles',
          baseXP: 10,
          difficulty: 'medium',
        },
        {
          id: 'angry_fish',
          name: 'Angry Fish',
          description: 'Launch your fish to hit targets',
          baseXP: 15,
          difficulty: 'hard',
        },
        {
          id: 'fish_racing',
          name: 'Fish Racing',
          description: 'Race your fish against others',
          baseXP: 20,
          difficulty: 'easy',
        },
        {
          id: 'bubble_pop',
          name: 'Bubble Pop',
          description: 'Pop bubbles to earn points',
          baseXP: 8,
          difficulty: 'easy',
        },
        {
          id: 'fish_memory',
          name: 'Fish Memory',
          description: 'Match fish pairs in memory game',
          baseXP: 12,
          difficulty: 'medium',
        },
      ];

      res.json({ success: true, data: gameTypes });
    } catch (error) {
      loggingMiddleware.logControllerError('MinigameController', 'getGameTypes', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
