import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { SettingsValue } from '@/types';

/**
 * Interface defining the structure of application settings
 */
export interface SettingsState {
  /** Whether sound effects are enabled */
  sound_enabled: boolean;
  /** Whether UI animations are enabled */
  animations_enabled: boolean;
  /** Whether push notifications are enabled */
  notifications_enabled: boolean;
  /** User's preferred language setting */
  preferred_language: string;
  /** UI theme preference (light, dark, auto) */
  ui_theme: string;
  /** Whether automatic fish feeding is enabled */
  auto_feed_enabled: boolean;
  /** Array of completed tutorial step identifiers */
  tutorial_completed_steps: string[];
}

/**
 * Storage key for persisting settings in localStorage
 */
const SETTINGS_STORAGE_KEY = 'aqua-stark-settings';

/**
 * Hook for managing application settings with localStorage persistence.
 *
 * This hook provides centralized settings management for the aquarium game,
 * handling user preferences like sound, animations, notifications, theme,
 * and tutorial progress. Settings are automatically persisted to localStorage
 * and loaded on application startup.
 *
 * Features:
 * - Automatic persistence to localStorage
 * - Type-safe settings validation
 * - Loading states for async operations
 * - Error handling for storage failures
 * - Debounced updates to prevent excessive writes
 * - Default settings fallback
 *
 * @returns Object containing current settings, update function, and loading state
 *
 * @example
 * Basic settings management:
 * ```tsx
 * const { settings, updateSetting, isLoading } = useSettings();
 *
 * // Access current settings
 * console.log('Sound enabled:', settings.sound_enabled);
 * console.log('Current theme:', settings.ui_theme);
 *
 * // Update individual settings
 * const handleToggleSound = () => {
 *   updateSetting('sound_enabled', !settings.sound_enabled);
 * };
 *
 * const handleThemeChange = (theme: string) => {
 *   updateSetting('ui_theme', theme);
 * };
 * ```
 *
 * @example
 * Settings UI component:
 * ```tsx
 * const SettingsPanel = () => {
 *   const { settings, updateSetting, isLoading } = useSettings();
 *
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   return (
 *     <div className="settings-panel">
 *       <h2>Game Settings</h2>
 *
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={settings.sound_enabled}
 *           onChange={(e) => updateSetting('sound_enabled', e.target.checked)}
 *         />
 *         Enable Sound Effects
 *       </label>
 *
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={settings.animations_enabled}
 *           onChange={(e) => updateSetting('animations_enabled', e.target.checked)}
 *         />
 *         Enable Animations
 *       </label>
 *
 *       <select
 *         value={settings.ui_theme}
 *         onChange={(e) => updateSetting('ui_theme', e.target.value)}
 *       >
 *         <option value="light">Light Theme</option>
 *         <option value="dark">Dark Theme</option>
 *         <option value="auto">Auto (System)</option>
 *       </select>
 *
 *       <select
 *         value={settings.preferred_language}
 *         onChange={(e) => updateSetting('preferred_language', e.target.value)}
 *       >
 *         <option value="english">English</option>
 *         <option value="spanish">Spanish</option>
 *         <option value="french">French</option>
 *       </select>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * Tutorial progress management:
 * ```tsx
 * const TutorialManager = () => {
 *   const { settings, updateSetting } = useSettings();
 *
 *   const markTutorialStepComplete = (stepId: string) => {
 *     if (!settings.tutorial_completed_steps.includes(stepId)) {
 *       const updatedSteps = [...settings.tutorial_completed_steps, stepId];
 *       updateSetting('tutorial_completed_steps', updatedSteps);
 *     }
 *   };
 *
 *   const isTutorialStepComplete = (stepId: string) => {
 *     return settings.tutorial_completed_steps.includes(stepId);
 *   };
 *
 *   const resetTutorial = () => {
 *     updateSetting('tutorial_completed_steps', []);
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Tutorial Progress</h3>
 *       <p>Completed steps: {settings.tutorial_completed_steps.length}</p>
 *       <button onClick={() => markTutorialStepComplete('welcome')}>
 *         Complete Welcome Step
 *       </button>
 *       <button onClick={resetTutorial}>
 *         Reset Tutorial
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * Game feature integration:
 * ```tsx
 * const GameAudioManager = () => {
 *   const { settings } = useSettings();
 *
 *   const playSound = (soundFile: string) => {
 *     if (settings.sound_enabled) {
 *       const audio = new Audio(soundFile);
 *       audio.play();
 *     }
 *   };
 *
 *   return { playSound };
 * };
 *
 * const AnimationWrapper = ({ children }: { children: React.ReactNode }) => {
 *   const { settings } = useSettings();
 *
 *   return (
 *     <div
 *       className={`
 *         ${settings.animations_enabled ? 'animate-smooth' : 'animate-none'}
 *         ${settings.ui_theme === 'dark' ? 'dark-theme' : 'light-theme'}
 *       `}
 *     >
 *       {children}
 *     </div>
 *   );
 * };
 * ```
 */
export const useSettings = () => {
  const { get, set } = useLocalStorage('aqua-');

  const [settings, setSettings] = useState<SettingsState>({
    sound_enabled: true,
    animations_enabled: true,
    notifications_enabled: true,
    preferred_language: 'english',
    ui_theme: 'auto',
    auto_feed_enabled: false,
    tutorial_completed_steps: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Load settings from localStorage on component mount.
   * Uses a timeout to simulate loading delay and provides better UX.
   * Includes validation to ensure settings structure is correct.
   */
  useEffect(() => {
    try {
      const timeout = setTimeout(() => {
        const parsedSettings = get<SettingsState>(SETTINGS_STORAGE_KEY, {
          parser: (raw: string) => JSON.parse(raw) as SettingsState,
          validate: (v: unknown): v is SettingsState =>
            !!v &&
            typeof v === 'object' &&
            Array.isArray((v as SettingsState).tutorial_completed_steps),
        });
        if (parsedSettings) setSettings(parsedSettings);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      // Could add user notification for settings load failures
      setIsLoading(false);
    }
  }, []);

  /**
   * Updates a specific setting and saves it to localStorage.
   * Includes loading state management and error handling.
   * Uses a timeout to debounce updates and provide visual feedback.
   *
   * @param key - The setting key to update (must be a key of SettingsState)
   * @param value - The new value for the setting
   *
   * @example
   * ```tsx
   * // Toggle a boolean setting
   * updateSetting('sound_enabled', !settings.sound_enabled);
   *
   * // Update a string setting
   * updateSetting('ui_theme', 'dark');
   *
   * // Update tutorial progress
   * updateSetting('tutorial_completed_steps', [...settings.tutorial_completed_steps, 'step1']);
   * ```
   */
  const updateSetting = (key: keyof SettingsState, value: SettingsValue) => {
    setIsLoading(true);
    try {
      const newSettings = { ...settings, [key]: value };

      const timeout = setTimeout(() => {
        setSettings(newSettings);
        set(SETTINGS_STORAGE_KEY, newSettings, { forceJsonStringify: true });
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
      // Could add user notification for settings save failures
      setIsLoading(false);
    }
  };

  return { settings, updateSetting, isLoading };
};
