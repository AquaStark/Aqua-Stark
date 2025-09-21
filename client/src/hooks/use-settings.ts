import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { SettingsValue } from '@/types';

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
   * Updates a specific setting and saves it to localStorage
   * @param {keyof SettingsState} key - The setting key to update
   * @param {SettingsValue} value - The new value for the setting
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
