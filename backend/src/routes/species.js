import express from 'express';
import {
  getSpeciesCatalog,
  getSpeciesInfo,
} from '../controllers/speciesController.js';

const router = express.Router();

/**
 * @route   GET /api/v1/species
 * @desc    Get all species from catalog
 * @access  Public
 */
router.get('/', getSpeciesCatalog);

/**
 * @route   GET /api/v1/species/:speciesName
 * @desc    Get species info by name
 * @access  Public
 */
router.get('/:speciesName', getSpeciesInfo);

export default router;

