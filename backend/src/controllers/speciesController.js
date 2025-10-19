import { FishService } from '../services/fishService.js';
import { logger } from '../../utils/logger.js';

/**
 * Controller for species catalog endpoints
 * @module SpeciesController
 */

/**
 * Get all species from catalog
 * @route GET /api/v1/species
 */
export const getSpeciesCatalog = async (req, res, next) => {
  try {
    logger.info('GET /api/v1/species - Fetching species catalog');
    const species = await FishService.getSpeciesCatalog();
    
    res.json({
      success: true,
      data: species,
      count: species.length,
    });
  } catch (error) {
    logger.error({ error }, 'Error in getSpeciesCatalog controller');
    next(error);
  }
};

/**
 * Get species info by name
 * @route GET /api/v1/species/:speciesName
 */
export const getSpeciesInfo = async (req, res, next) => {
  try {
    const { speciesName } = req.params;
    logger.info({ speciesName }, 'GET /api/v1/species/:speciesName');
    
    const species = await FishService.getSpeciesInfo(speciesName);
    
    res.json({
      success: true,
      data: species,
    });
  } catch (error) {
    logger.error({ error }, 'Error in getSpeciesInfo controller');
    next(error);
  }
};

