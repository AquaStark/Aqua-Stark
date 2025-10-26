/**
 * @file componets/index.ts
 * @description
 * Central export hub (barrel file) for all components used across the application.
 *
 * This file re-exports components from individual component modules,
 * allowing for clean, centralized imports:
 *
 * ```ts
 * import { ExperienceBar } from "@/components";
 * ```
 *
 * ### Benefits
 * - Simplifies import paths (no need to import from subfolders manually).
 * - Provides a single, organized entry point for all components.
 * - Makes refactoring and code navigation easier.
 *
 * @category Components
 */

// achievement components
export * from './achievements';

// aquarium components
export * from './aquarium';

// community components
export * from './community';

// dirt components
export * from './dirt';

// encyclopedia components
export * from './encyclopedia';

// events-calender components
export * from './events-calendar';

// food components
export * from './food';

// game components
export * from './game';

// genetics components
export * from './genetics';

// help-center components
export * from './help-center';

// laboratory components
export * from './laboratory';

// landing components
export * from './landing';

// layout components
export * from './layout';

// loading components
export * from './loading';

// market components
export * from './market';

// mini-games components
export * from './mini-games';

// mobile components
export * from './mobile';

// modal components
export * from './modal';

// profile components
export * from './profile';

// store components
export * from './store';

// ui component (not literally)
export * from './ui';

// ungrouped components
export { BubblesBackground } from './bubble-background';
export { FishTank } from './fish-tank';
export { FishStatus } from './FishStatus';
export { GameStatusBar } from './game-status-bar';
export { GeneticCombinationsPage } from './genetics';
export { WalletConnection } from './WalletConnection';

// SSE Components
export { SSEWrapper } from './sse-wrapper';
export { SSEStatus } from './sse-status';

// Backend Components
export { BackendStatus, BackendConnectionStatus } from './backend-status';
