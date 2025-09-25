import { useMemo } from 'react';

/**
 * use-local-storage
 * Centralized helper hook to safely interact with window.localStorage.
 *
 * Goals:
 * - Provide unified get/set/remove helpers with robust error handling
 * - Work in SSR/Non-DOM environments by gracefully no-op'ing
 * - Allow optional key namespacing without breaking existing keys
 * - Support pluggable parsing/validation for stored data
 */

/**
 * Type guard function to validate if a value matches the expected type T
 * @template T - The expected type to validate against
 * @param value - The value to validate
 * @returns True if the value is of type T, false otherwise
 */
export type LocalStorageValidator<T> = (value: unknown) => value is T;

/**
 * Function to parse a raw string from localStorage into the desired type
 * @template T - The target type to parse to
 * @param raw - The raw string value from localStorage
 * @returns The parsed value of type T
 */
export type LocalStorageParser<T> = (raw: string) => T;

/**
 * Options for getting values from localStorage
 * @template T - The expected type of the stored value
 */
export interface GetOptions<T> {
  /** Optional custom parser to convert the raw string into the desired type */
  parser?: LocalStorageParser<T>;
  /** Optional validator to ensure parsed value matches expected contract */
  validate?: LocalStorageValidator<T>;
}

/**
 * Options for setting values in localStorage
 */
export interface SetOptions {
  /**
   * Force stringify behavior. If undefined, primitives are stringified with String(),
   * objects/arrays are JSON.stringify'ed.
   */
  forceJsonStringify?: boolean;
}

/**
 * API interface returned by the useLocalStorage hook
 */
export interface UseLocalStorageApi {
  /** Indicates if localStorage is available in current environment */
  isAvailable: boolean;
  /** Compose a fully-qualified key using the provided prefix if any */
  buildKey: (key: string) => string;
  /** Read a value from storage with optional parser/validator */
  get: <T = unknown>(key: string, options?: GetOptions<T>) => T | null;
  /** Write a value to storage with safe serialization */
  set: (key: string, value: unknown, options?: SetOptions) => void;
  /** Remove a specific key from storage */
  remove: (key: string) => void;
  /** Remove all keys that begin with the current namespace prefix */
  clearNamespace: () => void;
}

/**
 * Safely determine if localStorage is accessible in the current environment.
 * Handles SSR environments and browsers where localStorage might be disabled.
 *
 * @returns True if localStorage is available and functional, false otherwise
 *
 * @example
 * ```typescript
 * const isAvailable = detectAvailability();
 * if (isAvailable) {
 *   // Safe to use localStorage
 * }
 * ```
 */
function detectAvailability(): boolean {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window))
      return false;
    const testKey = '__aqua_ls_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a unified localStorage helper with safe error handling and optional namespacing.
 * Works in both client-side and SSR environments by gracefully degrading functionality.
 *
 * @param prefix - Optional namespace prefix (e.g. "aqua:") for keys to avoid collisions
 * @returns API object with methods to interact with localStorage safely
 *
 * @example
 * Basic usage:
 * ```typescript
 * const storage = useLocalStorage();
 *
 * // Set a value
 * storage.set('user', { name: 'John', age: 30 });
 *
 * // Get a value
 * const user = storage.get('user');
 *
 * // Remove a value
 * storage.remove('user');
 * ```
 *
 * @example
 * With namespace prefix:
 * ```typescript
 * const storage = useLocalStorage('myApp:');
 * storage.set('settings', { theme: 'dark' }); // Stored as "myApp:settings"
 * ```
 *
 * @example
 * With custom parser and validator:
 * ```typescript
 * const storage = useLocalStorage();
 *
 * // Custom parser for dates
 * const dateParser = (raw: string) => new Date(raw);
 * const isDate = (value: unknown): value is Date => value instanceof Date;
 *
 * const savedDate = storage.get('lastLogin', {
 *   parser: dateParser,
 *   validate: isDate
 * });
 * ```
 */
export function useLocalStorage(prefix?: string): UseLocalStorageApi {
  const isAvailable = useMemo(() => detectAvailability(), []);

  const buildKey = (key: string) => (prefix ? `${prefix}${key}` : key);

  return useMemo<UseLocalStorageApi>(() => {
    const api: UseLocalStorageApi = {
      isAvailable,
      buildKey,
      get: <T = unknown>(key: string, options?: GetOptions<T>): T | null => {
        if (!isAvailable) return null;
        const fullKey = buildKey(key);
        try {
          const raw = window.localStorage.getItem(fullKey);
          if (raw === null) return null;

          // Default parser: try JSON.parse, fallback to raw string
          const parsed: unknown = options?.parser
            ? options.parser(raw)
            : (() => {
                try {
                  return JSON.parse(raw);
                } catch {
                  return raw;
                }
              })();

          if (options?.validate && !options.validate(parsed)) {
            // If invalid, do not propagate corrupted value
            return null;
          }

          return parsed as T;
        } catch (error) {
          // Log minimal error to help debugging without being noisy

          console.error('[useLocalStorage] get failed:', {
            key: fullKey,
            error,
          });
          return null;
        }
      },
      set: (key: string, value: unknown, options?: SetOptions): void => {
        if (!isAvailable) return;
        const fullKey = buildKey(key);
        try {
          let toStore: string;
          if (options?.forceJsonStringify) {
            toStore = JSON.stringify(value);
          } else if (value !== null && typeof value === 'object') {
            // Objects/arrays are JSON stringified by default
            toStore = JSON.stringify(value);
          } else {
            // Primitives are stored as plain strings
            toStore = String(value);
          }
          window.localStorage.setItem(fullKey, toStore);
        } catch (error) {
          console.error('[useLocalStorage] set failed:', {
            key: fullKey,
            error,
          });
        }
      },
      remove: (key: string): void => {
        if (!isAvailable) return;
        const fullKey = buildKey(key);
        try {
          window.localStorage.removeItem(fullKey);
        } catch (error) {
          console.error('[useLocalStorage] remove failed:', {
            key: fullKey,
            error,
          });
        }
      },
      clearNamespace: (): void => {
        if (!isAvailable) return;
        if (!prefix) return;
        try {
          const keys: string[] = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k && k.startsWith(prefix)) keys.push(k);
          }
          keys.forEach(k => window.localStorage.removeItem(k));
        } catch (error) {
          console.error('[useLocalStorage] clearNamespace failed:', {
            prefix,
            error,
          });
        }
      },
    };

    return api;
  }, [isAvailable, prefix]);
}
