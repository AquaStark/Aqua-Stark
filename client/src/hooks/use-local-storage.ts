import { useState, useEffect, useCallback } from 'react';

/**
 * @interface LocalStorageOptions
 * @description Configuration options for localStorage operations
 */
export interface LocalStorageOptions {
  /** Default value to use if localStorage is empty or invalid */
  defaultValue?: any;
  /** Custom serializer function (defaults to JSON.stringify) */
  serializer?: (value: any) => string;
  /** Custom deserializer function (defaults to JSON.parse) */
  deserializer?: (value: string) => any;
  /** Validation function to check if the parsed value is valid */
  validator?: (value: any) => boolean;
  /** Whether to sync with other tabs/windows (defaults to true) */
  syncAcrossTabs?: boolean;
}

/**
 * @interface LocalStorageReturn
 * @description Return type for the useLocalStorage hook
 */
export interface LocalStorageReturn<T> {
  /** Current value stored in localStorage */
  value: T;
  /** Function to update the value in localStorage */
  setValue: (value: T | ((prevValue: T) => T)) => void;
  /** Function to remove the value from localStorage */
  removeValue: () => void;
  /** Whether the hook is currently loading from localStorage */
  isLoading: boolean;
  /** Whether there was an error during the last operation */
  hasError: boolean;
  /** Error message from the last failed operation */
  error: string | null;
}

/**
 * @type LocalStorageError
 * @description Custom error type for localStorage operations
 */
export class LocalStorageError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'LocalStorageError';
  }
}

/**
 * @function isLocalStorageAvailable
 * @description Checks if localStorage is available in the current environment
 * @returns {boolean} True if localStorage is available, false otherwise
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * @function validateStorageQuota
 * @description Checks if there's enough space in localStorage
 * @param {string} key - The key to check
 * @param {string} value - The value to store
 * @returns {boolean} True if there's enough space, false otherwise
 */
function validateStorageQuota(key: string, value: string): boolean {
  try {
    const currentSize = new Blob([localStorage.getItem(key) || '']).size;
    const newSize = new Blob([value]).size;
    const totalSize = new Blob([...Object.values(localStorage)]).size;
    
    // Check if adding this value would exceed reasonable limits (5MB)
    return totalSize - currentSize + newSize < 5 * 1024 * 1024;
  } catch {
    return true; // If we can't check, assume it's okay
  }
}

/**
 * @function cleanCorruptedData
 * @description Attempts to clean corrupted localStorage data
 * @param {string} key - The key to clean
 * @param {any} defaultValue - Default value to use if cleaning fails
 * @returns {any} Cleaned value or default value
 */
function cleanCorruptedData(key: string, defaultValue: any): any {
  try {
    localStorage.removeItem(key);
    console.warn(`Cleaned corrupted data for key: ${key}`);
    return defaultValue;
  } catch (error) {
    console.error(`Failed to clean corrupted data for key: ${key}`, error);
    return defaultValue;
  }
}

/**
 * @hook useLocalStorage
 * @description A unified hook for managing localStorage with error handling, validation, and data cleaning
 * 
 * @template T - The type of data to store
 * @param {string} key - The localStorage key
 * @param {LocalStorageOptions} options - Configuration options
 * @returns {LocalStorageReturn<T>} Object containing value, setter, and utility functions
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { value, setValue, removeValue } = useLocalStorage('user-preferences', {
 *   defaultValue: { theme: 'light', language: 'en' }
 * });
 * 
 * // With validation
 * const { value, setValue } = useLocalStorage('game-settings', {
 *   defaultValue: { sound: true, music: true },
 *   validator: (val) => typeof val === 'object' && val !== null
 * });
 * 
 * // With custom serialization
 * const { value, setValue } = useLocalStorage('user-session', {
 *   defaultValue: null,
 *   serializer: (val) => btoa(JSON.stringify(val)),
 *   deserializer: (val) => JSON.parse(atob(val))
 * });
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  options: LocalStorageOptions = {}
): LocalStorageReturn<T> {
  const {
    defaultValue,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    validator,
    syncAcrossTabs = true,
  } = options;

  const [value, setValueState] = useState<T>(defaultValue as T);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * @function loadFromStorage
   * @description Loads value from localStorage with error handling and validation
   */
  const loadFromStorage = useCallback(() => {
    if (!isLocalStorageAvailable()) {
      setError('localStorage is not available in this environment');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    try {
      const storedValue = localStorage.getItem(key);
      
      if (storedValue === null) {
        setValueState(defaultValue as T);
        setIsLoading(false);
        return;
      }

      const parsedValue = deserializer(storedValue);
      
      // Validate the parsed value if validator is provided
      if (validator && !validator(parsedValue)) {
        console.warn(`Invalid data for key "${key}", using default value`);
        setValueState(defaultValue as T);
        setError('Invalid data format, using default value');
        setHasError(true);
        cleanCorruptedData(key, defaultValue);
      } else {
        setValueState(parsedValue);
        setHasError(false);
        setError(null);
      }
    } catch (parseError) {
      console.error(`Failed to parse localStorage data for key "${key}":`, parseError);
      setValueState(defaultValue as T);
      setError('Failed to parse stored data, using default value');
      setHasError(true);
      cleanCorruptedData(key, defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue, deserializer, validator]);

  /**
   * @function saveToStorage
   * @description Saves value to localStorage with error handling and quota validation
   * @param {T} newValue - The value to save
   */
  const saveToStorage = useCallback((newValue: T) => {
    if (!isLocalStorageAvailable()) {
      setError('localStorage is not available in this environment');
      setHasError(true);
      return;
    }

    try {
      const serializedValue = serializer(newValue);
      
      // Check storage quota before saving
      if (!validateStorageQuota(key, serializedValue)) {
        throw new LocalStorageError('Storage quota exceeded', 'QUOTA_EXCEEDED');
      }

      localStorage.setItem(key, serializedValue);
      setHasError(false);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof LocalStorageError 
        ? error.message 
        : `Failed to save data to localStorage for key "${key}"`;
      
      console.error(errorMessage, error);
      setError(errorMessage);
      setHasError(true);
    }
  }, [key, serializer]);

  /**
   * @function setValue
   * @description Updates the value in both state and localStorage
   * @param {T | ((prevValue: T) => T)} newValue - New value or function to update value
   */
  const setValue = useCallback((newValue: T | ((prevValue: T) => T)) => {
    const resolvedValue = typeof newValue === 'function' 
      ? (newValue as (prevValue: T) => T)(value)
      : newValue;
    
    setValueState(resolvedValue);
    saveToStorage(resolvedValue);
  }, [value, saveToStorage]);

  /**
   * @function removeValue
   * @description Removes the value from both state and localStorage
   */
  const removeValue = useCallback(() => {
    if (!isLocalStorageAvailable()) {
      setError('localStorage is not available in this environment');
      setHasError(true);
      return;
    }

    try {
      localStorage.removeItem(key);
      setValueState(defaultValue as T);
      setHasError(false);
      setError(null);
    } catch (error) {
      const errorMessage = `Failed to remove data from localStorage for key "${key}"`;
      console.error(errorMessage, error);
      setError(errorMessage);
      setHasError(true);
    }
  }, [key, defaultValue]);

  // Load initial value from localStorage
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    if (!syncAcrossTabs || !isLocalStorageAvailable()) {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === localStorage) {
        if (e.newValue === null) {
          setValueState(defaultValue as T);
        } else {
          try {
            const parsedValue = deserializer(e.newValue);
            if (!validator || validator(parsedValue)) {
              setValueState(parsedValue);
            }
          } catch (error) {
            console.error(`Failed to parse storage change for key "${key}":`, error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, deserializer, validator, syncAcrossTabs]);

  return {
    value,
    setValue,
    removeValue,
    isLoading,
    hasError,
    error,
  };
}
