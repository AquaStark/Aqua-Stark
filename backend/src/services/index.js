/**
 * Services Index - Central export point for all Aqua Stark backend services
 * 
 * This module provides a centralized export point for all service classes
 * used throughout the Aqua Stark backend. It includes comprehensive JSDoc
 * documentation for each service and their capabilities.
 * 
 * @fileoverview Central services export with documentation
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-09-16
 */

// Import all service classes
import { AquariumService } from './aquariumService.js';
import { DecorationService } from './decorationService.js';
import { FishService } from './fishService.js';
import { MinigameService } from './minigameService.js';
import { PlayerService } from './playerService.js';

/**
 * Service Registry - Complete list of available services
 * 
 * @namespace Services
 * @description All available services in the Aqua Stark backend
 */
export const Services = {
  /**
   * Aquarium Service
   * @see {@link AquariumService}
   * @description Manages aquarium states, environmental controls, fish capacity, and health monitoring
   */
  Aquarium: AquariumService,

  /**
   * Decoration Service
   * @see {@link DecorationService}
   * @description Handles decoration placement, positioning, visibility, and movement between aquariums
   */
  Decoration: DecorationService,

  /**
   * Fish Service
   * @see {@link FishService}
   * @description Manages fish states, feeding, happiness, mood, and health tracking
   */
  Fish: FishService,

  /**
   * Minigame Service
   * @see {@link MinigameService}
   * @description Handles minigame sessions, scoring, XP calculation, and leaderboards
   */
  Minigame: MinigameService,

  /**
   * Player Service
   * @see {@link PlayerService}
   * @description Manages player profiles, experience, currency, statistics, and preferences
   */
  Player: PlayerService,
};

/**
 * Individual Service Exports
 * 
 * Export each service individually for direct imports
 */

/**
 * @exports AquariumService
 * @description Service for managing aquarium states and operations
 * @see {@link AquariumService}
 */
export { AquariumService };

/**
 * @exports DecorationService
 * @description Service for managing decoration states and operations
 * @see {@link DecorationService}
 */
export { DecorationService };

/**
 * @exports FishService
 * @description Service for managing fish states and operations
 * @see {@link FishService}
 */
export { FishService };

/**
 * @exports MinigameService
 * @description Service for managing minigame sessions and operations
 * @see {@link MinigameService}
 */
export { MinigameService };

/**
 * @exports PlayerService
 * @description Service for managing player data and operations
 * @see {@link PlayerService}
 */
export { PlayerService };

/**
 * Service Documentation Summary
 * 
 * @description Overview of all available services and their primary functions
 * 
 * ## Available Services
 * 
 * ### 1. AquariumService
 * - **Purpose**: Manage aquarium environmental conditions and fish capacity
 * - **Key Features**: Temperature control, lighting adjustment, pollution management, health scoring
 * - **Use Cases**: Aquarium setup, environmental monitoring, fish habitat management
 * 
 * ### 2. DecorationService
 * - **Purpose**: Handle decoration placement and management within aquariums
 * - **Key Features**: Position tracking, visibility control, aquarium-to-aquarium movement
 * - **Use Cases**: Aquarium customization, decoration inventory management
 * 
 * ### 3. FishService
 * - **Purpose**: Manage fish states, health, and interactions
 * - **Key Features**: Feeding system, happiness tracking, mood management, batch operations
 * - **Use Cases**: Fish care, health monitoring, breeding management
 * 
 * ### 4. MinigameService
 * - **Purpose**: Handle minigame sessions and XP rewards
 * - **Key Features**: Session management, scoring, leaderboards, blockchain sync
 * - **Use Cases**: Game progression, competitive features, achievement systems
 * 
 * ### 5. PlayerService
 * - **Purpose**: Manage player profiles and game progression
 * - **Key Features**: Experience tracking, currency management, statistics, preferences
 * - **Use Cases**: Player onboarding, progression tracking, settings management
 * 
 * ## Usage Examples
 * 
 * ```javascript
 * // Import specific service
 * import { FishService } from './services/index.js';
 * 
 * // Import all services
 * import { Services } from './services/index.js';
 * const fishService = Services.Fish;
 * 
 * // Use service methods
 * const fishState = await FishService.getFishState('fish_123');
 * await FishService.feedFish('fish_123', 'premium');
 * ```
 * 
 * ## Performance Considerations
 * 
 * - All services use Redis caching for improved performance
 * - Database operations are optimized with proper indexing
 * - Error handling is comprehensive with detailed logging
 * - Services support batch operations where applicable
 * 
 * ## Error Handling
 * 
 * All services implement consistent error handling:
 * - Validation errors for invalid parameters
 * - Database errors with proper error codes
 * - Service-specific errors with descriptive messages
 * - Comprehensive logging for debugging
 */
