import { FishService } from '../services/fishService.js';

// Fish controller for handling HTTP requests related to fish operations
export class FishController {
  // Get fish state
  static async getFishState(req, res) {
    try {
      // Resource is already validated by ownership middleware
      const fishState = req.resource;

      res.json({ success: true, data: fishState });
    } catch (error) {
      console.error('Error in getFishState:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update fish happiness
  static async updateFishHappiness(req, res) {
    try {
      const { fishId } = req.params;
      const { happinessLevel } = req.body;

      const updatedFish = await FishService.updateFishHappiness(
        fishId,
        happinessLevel
      );

      res.json({
        success: true,
        data: updatedFish,
        message: `Fish happiness updated to ${happinessLevel}`,
      });
    } catch (error) {
      console.error('Error in updateFishHappiness:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Feed fish
  static async feedFish(req, res) {
    try {
      const { fishId } = req.params;
      const { foodType = 'regular' } = req.body;

      const feedingResult = await FishService.feedFish(fishId, foodType);

      res.json({
        success: true,
        data: feedingResult,
        message: `Fish fed with ${foodType} food`,
      });
    } catch (error) {
      console.error('Error in feedFish:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get fish statistics
  static async getFishStats(req, res) {
    try {
      const { fishId } = req.params;

      const stats = await FishService.getFishStats(fishId);

      if (!stats) {
        return res.status(404).json({ error: 'Fish not found' });
      }

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error in getFishStats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Breed fish (placeholder for future implementation)
  static async breedFish(req, res) {
    try {
      const { parent1Id: _parent1Id, parent2Id: _parent2Id } = req.body;

      // This would be implemented when breeding is added
      res.status(501).json({
        error: 'Not implemented',
        message: 'Fish breeding will be implemented in a future update',
      });
    } catch (error) {
      console.error('Error in breedFish:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all fish for a player
  static async getPlayerFish(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own fish
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const fish = await FishService.getPlayerFish(playerId);

      res.json({ success: true, data: fish });
    } catch (error) {
      console.error('Error in getPlayerFish:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Feed multiple fish
  static async feedMultipleFish(req, res) {
    try {
      const { fishIds, foodType = 'basic' } = req.body;

      const result = await FishService.feedMultipleFish(fishIds, foodType);

      res.json({
        success: true,
        data: result,
        message: `Fed ${result.successful.length} fish successfully, ${result.failed.length} failed`,
      });
    } catch (error) {
      console.error('Error in feedMultipleFish:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Filter fish
  static async filterFish(req, res) {
    try {
      const filters = req.query;

      const filteredFish = await FishService.filterFish(filters);

      res.json({
        success: true,
        data: filteredFish,
        count: filteredFish.length,
      });
    } catch (error) {
      console.error('Error in filterFish:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get fish needing attention
  static async getFishNeedingAttention(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const fishNeedingAttention =
        await FishService.getFishNeedingAttention(playerId);

      res.json({
        success: true,
        data: fishNeedingAttention,
        count: fishNeedingAttention.length,
      });
    } catch (error) {
      console.error('Error in getFishNeedingAttention:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update fish mood
  static async updateFishMood(req, res) {
    try {
      const { fishId } = req.params;

      const updatedFish = await FishService.updateFishMood(fishId);

      if (!updatedFish) {
        return res.status(404).json({ error: 'Fish not found' });
      }

      res.json({
        success: true,
        data: updatedFish,
        message: `Fish mood updated to ${updatedFish.mood}`,
      });
    } catch (error) {
      console.error('Error in updateFishMood:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get global fish statistics
  static async getGlobalFishStats(req, res) {
    try {
      const stats = await FishService.getFishStats(null);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error in getGlobalFishStats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
