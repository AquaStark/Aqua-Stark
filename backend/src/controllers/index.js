/**
 * Controllers Index
 *
 * Central export point for all controller classes in the Aqua-Stark backend.
 * This module provides organized access to all HTTP request handlers.
 *
 * @module controllers
 */

import { PlayerController } from './playerController.js';
import { FishController } from './fishController.js';
import { DecorationController } from './decorationController.js';
import { MinigameController } from './minigameController.js';

/**
 * Collection of all controller classes
 *
 * @typedef {Object} Controllers
 * @property {Object} PlayerController - Handles player-related operations
 * @property {Object} FishController - Handles fish-related operations
 * @property {Object} DecorationController - Handles decoration-related operations
 * @property {Object} MinigameController - Handles minigame-related operations
 */

/**
 * Exported controllers object containing all controller classes
 *
 * @type {Controllers}
 */
export const controllers = {
  PlayerController,
  FishController,
  DecorationController,
  MinigameController,
};

// Named exports for individual controllers
export { PlayerController } from './playerController.js';
export { FishController } from './fishController.js';
export { DecorationController } from './decorationController.js';
export { MinigameController } from './minigameController.js';

/**
 * Default export containing all controllers
 *
 * @type {Controllers}
 */
export default controllers;
