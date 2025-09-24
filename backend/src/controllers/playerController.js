import { PlayerService } from '../services/playerService.js';

// Player controller for handling HTTP requests related to player operations
export class PlayerController {
  // Get player profile
  static async getPlayerProfile(req, res) {
    try {
      // Resource is already validated by ownership middleware
      const playerProfile = req.resource;

      res.json({ success: true, data: playerProfile });
    } catch (error) {
      console.error('Error in getPlayerProfile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get player by wallet address (public endpoint - no auth required)
  static async getPlayerByWallet(req, res) {
    try {
      const { walletAddress } = req.params;

      const player = await PlayerService.getPlayerByWallet(walletAddress);

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      res.json({ success: true, data: player });
    } catch (error) {
      console.error('Error in getPlayerByWallet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new player (public endpoint - no auth required)
  static async createPlayer(req, res) {
    try {
      const { playerId, walletAddress, username } = req.body;

      const newPlayer = await PlayerService.createPlayer(
        playerId,
        walletAddress,
        username
      );

      res.status(201).json({
        success: true,
        data: newPlayer,
        message: 'Player created successfully',
      });
    } catch (error) {
      console.error('Error in createPlayer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update player experience
  static async updatePlayerExperience(req, res) {
    try {
      const { playerId } = req.params;
      const { experienceGained } = req.body;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own experience
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPlayer = await PlayerService.updatePlayerExperience(
        playerId,
        experienceGained
      );

      res.json({
        success: true,
        data: updatedPlayer,
        message: `Experience updated: +${experienceGained} XP`,
      });
    } catch (error) {
      console.error('Error in updatePlayerExperience:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update player currency
  static async updatePlayerCurrency(req, res) {
    try {
      const { playerId } = req.params;
      const { currencyChange } = req.body;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own currency
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPlayer = await PlayerService.updatePlayerCurrency(
        playerId,
        currencyChange
      );

      res.json({
        success: true,
        data: updatedPlayer,
        message: `Currency updated: ${currencyChange > 0 ? '+' : ''}${currencyChange}`,
      });
    } catch (error) {
      console.error('Error in updatePlayerCurrency:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update player statistics
  static async updatePlayerStats(req, res) {
    try {
      const { playerId } = req.params;
      const statsUpdate = req.body;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own stats
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPlayer = await PlayerService.updatePlayerStats(
        playerId,
        statsUpdate
      );

      res.json({
        success: true,
        data: updatedPlayer,
        message: 'Player statistics updated successfully',
      });
    } catch (error) {
      console.error('Error in updatePlayerStats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update last login
  static async updateLastLogin(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own last login
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPlayer = await PlayerService.updateLastLogin(playerId);

      res.json({
        success: true,
        data: updatedPlayer,
        message: 'Last login updated successfully',
      });
    } catch (error) {
      console.error('Error in updateLastLogin:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get player preferences
  static async getPlayerPreferences(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own preferences
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const preferences = await PlayerService.getPlayerPreferences(playerId);

      if (!preferences) {
        return res.status(404).json({ error: 'Player preferences not found' });
      }

      res.json({ success: true, data: preferences });
    } catch (error) {
      console.error('Error in getPlayerPreferences:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update player preferences
  static async updatePlayerPreferences(req, res) {
    try {
      const { playerId } = req.params;
      const preferences = req.body;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own preferences
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPreferences = await PlayerService.updatePlayerPreferences(
        playerId,
        preferences
      );

      res.json({
        success: true,
        data: updatedPreferences,
        message: 'Player preferences updated successfully',
      });
    } catch (error) {
      console.error('Error in updatePlayerPreferences:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get player dashboard data (profile + preferences + stats)
  static async getPlayerDashboard(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own dashboard
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const [profile, preferences] = await Promise.all([
        PlayerService.getPlayerProfile(playerId),
        PlayerService.getPlayerPreferences(playerId),
      ]);

      if (!profile) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const dashboardData = {
        profile,
        preferences: preferences || {},
        lastUpdated: new Date().toISOString(),
      };

      res.json({ success: true, data: dashboardData });
    } catch (error) {
      console.error('Error in getPlayerDashboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
