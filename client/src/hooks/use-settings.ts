import { useLocalStorage } from './use-local-storage';
import { SettingsValue } from '@/types/player-types';

export interface SettingsState {
  sound_enabled: boolean;
  animations_enabled: boolean;
  notifications_enabled: boolean;
  preferred_language: string;
  ui_theme: string;
  auto_feed_enabled: boolean;
  tutorial_completed_steps: string[];
}

const SETTINGS_STORAGE_KEY = 'aqua-stark-settings';

const defaultSettings: SettingsState = {
  sound_enabled: true,
  animations_enabled: true,
  notifications_enabled: true,
  preferred_language: 'english',
  ui_theme: 'auto',
  auto_feed_enabled: false,
  tutorial_completed_steps: [],
};

/**
 * Validates that the settings object has the correct structure
 * @param value - The value to validate
 * @returns {boolean} True if valid, false otherwise
 */
const validateSettings = (value: any): value is SettingsState => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.sound_enabled === 'boolean' &&
    typeof value.animations_enabled === 'boolean' &&
    typeof value.notifications_enabled === 'boolean' &&
    typeof value.preferred_language === 'string' &&
    typeof value.ui_theme === 'string' &&
    typeof value.auto_feed_enabled === 'boolean' &&
    Array.isArray(value.tutorial_completed_steps)
  );
};

export const useSettings = () => {
  const {
    value: settings,
    setValue: setSettings,
    isLoading,
    hasError,
    error,
  } = useLocalStorage<SettingsState>(SETTINGS_STORAGE_KEY, {
    defaultValue: defaultSettings,
    validator: validateSettings,
    syncAcrossTabs: true,
  });

  /**
   * Updates a specific setting and saves it to localStorage
   * @param {keyof SettingsState} key - The setting key to update
   * @param {SettingsValue} value - The new value for the setting
   */
  const updateSetting = (key: keyof SettingsState, value: SettingsValue) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return { 
    settings, 
    updateSetting, 
    isLoading,
    hasError,
    error,
  };
};
