/**
 * @file hooks/index.ts
 * @description
 * Central export hub (barrel file) for all custom hooks used across the application.
 *
 * This file re-exports hooks from individual hook modules and subfolders,
 * allowing for clean, centralized imports:
 *
 * ```ts
 * import { useAquarium, useFishMovement } from "@/hooks";
 * ```
 *
 * ### Benefits
 * - Simplifies import paths (no need to import from subfolders manually).
 * - Provides a single, organized entry point for all hooks.
 * - Makes refactoring and code navigation easier.
 *
 * @category Hooks
 */

// Top-level hooks
export { useAquarium } from './use-aquarium';
export { useBubbles } from './use-bubbles';
export { useCartridgeConnection } from './use-cartridge-connection';
export { useCartridgeSession } from './use-cartridge-session';
export { useCommunity } from './use-community';
export { useStarknetConnect } from './use-connector';
export { useDebounce } from './use-debounce';
export { useDevConsoleHandlers } from './use-dev-console-handlers';
export { useDirtSystemFixed } from './use-dirt-system-fixed';
export { useDirtSystem } from './use-dirt-system';
export { useDirtSystemRealistic } from './use-dirt-system-realistic';
export { useEncyclopedia } from './use-encyclopedia';
export { useEventsCalendar } from './use-events-calendar';
export { useExperience } from './use-experience';
export { useFishMovement } from './use-fish-movement';
export { useFishStats } from './use-fish-stats';
export { useFoodSystem } from './use-food-system';
export { useFullscreen } from './use-fullscreen';
export { useFullscreenConfig } from './use-fullscreen-config';
export { useFullscreenPrompt } from './use-fullscreen-prompt';
export { useGames } from './use-games';
export { useHelpCenter } from './use-help-center';
export { useLoadingNavigation } from './use-loading-navigation';
export { useModal, useMultipleModals, useConfirmModal } from './use-modal';
export { useNotifications } from './use-notifications';
export { useSettings } from './use-settings';
export { useShopData } from './use-shop-data';
export { useSimpleWalletConnection } from './use-simple-wallet-connection';
export { useStoreFilters } from './use-store-filters';
export { useStoreLoading } from './use-store-loading';
export { useMinimumLoading } from './use-minimum-loading';
export { useFishIndicators } from './useFishIndicators';
export { useGameActions } from './useGameActions';
export { usePlayerValidation } from './usePlayerValidation';
export { useLocalStorage } from './use-local-storage';

// Dojo hooks

export { useDecoration } from './dojo/useDecoration';
export { useFish } from './dojo/useFish';
export { usePlayer } from './dojo/usePlayer';

// Minigames hooks

export { useGameLogic } from './minigames/floppy-fish/use-game-logic';
export { useInputHandler } from './minigames/floppy-fish/use-input-handler';

// API hooks
export { useApi, useApiRequest } from './use-api';

// dojo hooks
export * from './dojo/index';

// minigames hook (floppy fish)
export * from './minigames/floppy-fish/index';
