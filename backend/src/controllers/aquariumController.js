import { AquariumService } from '../services/aquariumService.js';
import { logger } from '../../utils/logger.js';

/**
 * Controller for aquarium management endpoints
 *
 * @module AquariumController
 */

/**
 * Create aquarium state in backend
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const createAquarium = async (req, res, next) => {
  try {
    const { aquariumId, playerId, onChainId } = req.body;

    logger.info(
      { aquariumId, playerId, onChainId },
      'POST /api/v1/aquariums/create'
    );

    if (!aquariumId || !playerId) {
      return res.status(400).json({
        success: false,
        error: 'aquariumId and playerId are required',
      });
    }

    const aquarium = await AquariumService.createAquariumState(
      aquariumId,
      playerId,
      onChainId
    );

    res.status(201).json({
      success: true,
      data: aquarium,
    });
  } catch (error) {
    logger.error({ error }, 'Error in createAquarium controller');
    next(error);
  }
};

/**
 * Get all aquariums for a player
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getPlayerAquariums = async (req, res, next) => {
  try {
    const { playerId } = req.params;

    logger.info({ playerId }, 'GET /api/v1/aquariums/player/:playerId');

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: 'playerId is required',
      });
    }

    const aquariums = await AquariumService.getPlayerAquariumStates(playerId);

    res.json({
      success: true,
      data: aquariums,
      count: aquariums.length,
    });
  } catch (error) {
    logger.error({ error }, 'Error in getPlayerAquariums controller');
    next(error);
  }
};

