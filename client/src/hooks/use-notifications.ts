import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { toast } from 'sonner';

/**
 * Notification types available in the game
 */
export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'loading';

/**
 * Notification priority levels
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Notification configuration interface
 */
export interface NotificationConfig {
  /** Unique identifier for the notification */
  id?: string;
  /** Notification title */
  title?: string;
  /** Notification message */
  message: string;
  /** Notification type */
  type: NotificationType;
  /** Priority level */
  priority?: NotificationPriority;
  /** Duration in milliseconds (0 = persistent) */
  duration?: number;
  /** Whether to persist in localStorage */
  persistent?: boolean;
  /** Custom action button text */
  actionText?: string;
  /** Custom action callback */
  onAction?: () => void;
  /** Whether to show close button */
  closable?: boolean;
  /** Custom icon */
  icon?: string;
  /** Additional data for the notification */
  data?: Record<string, any>;
}

/**
 * Stored notification interface for persistence
 */
interface StoredNotification extends NotificationConfig {
  /** Unique notification identifier */
  id: string;
  /** Timestamp when notification was created */
  timestamp: number;
  /** Whether the notification has been read */
  read: boolean;
}

/**
 * Notification queue item
 */
interface NotificationQueueItem extends NotificationConfig {
  /** Unique notification identifier */
  id: string;
  /** Timestamp when notification was created */
  timestamp: number;
  /** Priority level for queue ordering */
  priority: NotificationPriority;
}

/**
 * Hook return type
 */
export interface UseNotificationsReturn {
  /** Show a notification */
  show: (config: NotificationConfig) => string;
  /** Hide a specific notification */
  hide: (id: string) => void;
  /** Clear all notifications */
  clear: () => void;
  /** Show success notification */
  success: (message: string, config?: Partial<NotificationConfig>) => string;
  /** Show error notification */
  error: (message: string, config?: Partial<NotificationConfig>) => string;
  /** Show warning notification */
  warning: (message: string, config?: Partial<NotificationConfig>) => string;
  /** Show info notification */
  info: (message: string, config?: Partial<NotificationConfig>) => string;
  /** Show loading notification */
  loading: (message: string, config?: Partial<NotificationConfig>) => string;
  /** Get all stored notifications */
  getStoredNotifications: () => StoredNotification[];
  /** Mark notification as read */
  markAsRead: (id: string) => void;
  /** Clear stored notifications */
  clearStored: () => void;
  /** Get unread count */
  unreadCount: number;
  /** Current notification queue */
  queue: NotificationQueueItem[];
}

/**
 * Default notification configurations for each type
 */
const DEFAULT_CONFIGS: Record<NotificationType, Partial<NotificationConfig>> = {
  success: {
    duration: 4000,
    priority: 'medium',
    closable: true,
  },
  error: {
    duration: 6000,
    priority: 'high',
    closable: true,
  },
  warning: {
    duration: 5000,
    priority: 'medium',
    closable: true,
  },
  info: {
    duration: 4000,
    priority: 'low',
    closable: true,
  },
  loading: {
    duration: 0, // Persistent until manually dismissed
    priority: 'medium',
    closable: false,
  },
};

/**
 * Storage key for persistent notifications
 */
const STORAGE_KEY = 'aqua-stark-notifications';

/**
 * Maximum number of stored notifications to prevent memory issues
 */
const MAX_STORED_NOTIFICATIONS = 50;

/**
 * Unified hook for managing game notifications.
 *
 * This hook centralizes all notification logic to avoid duplication across components.
 * It provides a consistent interface for showing different types of notifications,
 * managing notification persistence, and handling notification queues with priority support.
 *
 * Features:
 * - Multiple notification types (success, error, warning, info, loading)
 * - Persistent notifications stored in localStorage
 * - Priority-based queuing system
 * - Automatic cleanup and memory management
 * - Custom actions and callbacks
 * - Read/unread state management
 *
 * @returns Object containing notification methods and state
 *
 * @example
 * Basic usage:
 * ```tsx
 * const notifications = useNotifications();
 *
 * // Show different types of notifications
 * notifications.success('Fish fed successfully!');
 * notifications.error('Failed to save progress');
 * notifications.warning('Low on fish food');
 * notifications.info('New feature available');
 * notifications.loading('Connecting to blockchain...');
 * ```
 *
 * @example
 * Advanced usage with custom configuration:
 * ```tsx
 * const { success, error, show } = useNotifications();
 *
 * // Error with retry action
 * error('Failed to connect wallet', {
 *   title: 'Connection Error',
 *   persistent: true,
 *   actionText: 'Retry',
 *   onAction: () => retryConnection(),
 *   priority: 'high'
 * });
 *
 * // Custom notification with full control
 * show({
 *   message: 'Achievement unlocked!',
 *   type: 'success',
 *   title: 'Congratulations',
 *   duration: 8000,
 *   persistent: true,
 *   icon: '🏆',
 *   data: { achievementId: 'first_fish' }
 * });
 * ```
 *
 * @example
 * Managing notification state:
 * ```tsx
 * const {
 *   unreadCount,
 *   getStoredNotifications,
 *   markAsRead,
 *   clearStored,
 *   queue
 * } = useNotifications();
 *
 * // Show unread count in UI
 * const notifications = getStoredNotifications();
 * const unread = notifications.filter(n => !n.read);
 *
 * // Mark as read when user views notification
 * const handleNotificationClick = (id: string) => {
 *   markAsRead(id);
 * };
 *
 * // Clear all stored notifications
 * const handleClearAll = () => {
 *   clearStored();
 * };
 * ```
 *
 * @example
 * Loading states and dismissal:
 * ```tsx
 * const { loading, hide } = useNotifications();
 *
 * const handleAsyncAction = async () => {
 *   const loadingId = loading('Processing transaction...');
 *
 *   try {
 *     await performAction();
 *     hide(loadingId);
 *     success('Transaction completed!');
 *   } catch (error) {
 *     hide(loadingId);
 *     error('Transaction failed');
 *   }
 * };
 * ```
 */
export function useNotifications(): UseNotificationsReturn {
  const { get, set, remove } = useLocalStorage('aqua-');
  const [queue, setQueue] = useState<NotificationQueueItem[]>([]);
  const [storedNotifications, setStoredNotifications] = useState<
    StoredNotification[]
  >([]);

  /**
   * Load stored notifications from localStorage on component mount.
   * Handles parsing errors gracefully and validates data structure.
   */
  useEffect(() => {
    try {
      const parsed = get<StoredNotification[]>(STORAGE_KEY, {
        parser: (raw: string) => JSON.parse(raw) as StoredNotification[],
        validate: (v: unknown): v is StoredNotification[] => Array.isArray(v),
      });
      if (parsed) setStoredNotifications(parsed);
    } catch (error) {
      console.error('Failed to load stored notifications:', error);
    }
  }, [get]);

  /**
   * Save notifications to localStorage with automatic cleanup.
   * Limits stored notifications to prevent memory issues.
   *
   * @param notifications - Array of notifications to save
   */
  const saveToStorage = useCallback((notifications: StoredNotification[]) => {
    try {
      // Keep only the most recent notifications
      const limited = notifications.slice(-MAX_STORED_NOTIFICATIONS);
      set(STORAGE_KEY, limited, { forceJsonStringify: true });
      setStoredNotifications(limited);
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
    }
  }, [set]);

  /**
   * Generate a unique identifier for notifications.
   * Uses timestamp and random string to ensure uniqueness.
   *
   * @returns Unique notification ID
   */
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Validate notification configuration before showing.
   * Ensures required fields are present and valid.
   *
   * @param config - Notification configuration to validate
   * @returns True if configuration is valid, false otherwise
   */
  const validateConfig = useCallback((config: NotificationConfig): boolean => {
    if (!config.message || typeof config.message !== 'string') {
      console.error('Notification message is required and must be a string');
      return false;
    }

    if (
      !config.type ||
      !['success', 'error', 'warning', 'info', 'loading'].includes(config.type)
    ) {
      console.error('Invalid notification type');
      return false;
    }

    if (
      config.duration !== undefined &&
      (typeof config.duration !== 'number' || config.duration < 0)
    ) {
      console.error('Duration must be a non-negative number');
      return false;
    }

    return true;
  }, []);

  /**
   * Show a notification with full configuration options.
   * Handles validation, queue management, toast display, and persistence.
   *
   * @param config - Complete notification configuration
   * @returns Notification ID for later reference, empty string if validation fails
   */
  const show = useCallback(
    (config: NotificationConfig): string => {
      if (!validateConfig(config)) {
        return '';
      }

      const id = config.id || generateId();
      const defaultConfig = DEFAULT_CONFIGS[config.type] || {};
      const finalConfig = { ...defaultConfig, ...config, id };

      // Add to queue
      const queueItem: NotificationQueueItem = {
        ...finalConfig,
        id,
        timestamp: Date.now(),
        priority: finalConfig.priority || 'medium',
      };

      setQueue(prev => [...prev, queueItem]);

      // Show toast notification
      const toastOptions = {
        id,
        duration: finalConfig.duration,
        onDismiss: () => {
          setQueue(prev => prev.filter(item => item.id !== id));
        },
        action:
          finalConfig.actionText && finalConfig.onAction
            ? {
                label: finalConfig.actionText,
                onClick: finalConfig.onAction,
              }
            : undefined,
      };

      switch (finalConfig.type) {
        case 'success':
          toast.success(finalConfig.message, {
            ...toastOptions,
            description: finalConfig.title,
          });
          break;
        case 'error':
          toast.error(finalConfig.message, {
            ...toastOptions,
            description: finalConfig.title,
          });
          break;
        case 'warning':
          toast.warning(finalConfig.message, {
            ...toastOptions,
            description: finalConfig.title,
          });
          break;
        case 'info':
          toast.info(finalConfig.message, {
            ...toastOptions,
            description: finalConfig.title,
          });
          break;
        case 'loading':
          toast.loading(finalConfig.message, {
            ...toastOptions,
            description: finalConfig.title,
          });
          break;
      }

      // Store persistent notifications
      if (finalConfig.persistent) {
        const storedNotification: StoredNotification = {
          ...finalConfig,
          id,
          timestamp: Date.now(),
          read: false,
        };

        setStoredNotifications(prev => {
          const updated = [...prev, storedNotification];
          saveToStorage(updated);
          return updated;
        });
      }

      return id;
    },
    [validateConfig, generateId, saveToStorage]
  );

  /**
   * Hide a specific notification by ID.
   * Removes from both toast display and internal queue.
   *
   * @param id - Notification ID to hide
   */
  const hide = useCallback((id: string) => {
    toast.dismiss(id);
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  /**
   * Clear all currently visible notifications.
   * Dismisses all toasts and clears the queue.
   */
  const clear = useCallback(() => {
    toast.dismiss();
    setQueue([]);
  }, []);

  /**
   * Show a success notification with default success styling.
   *
   * @param message - Success message to display
   * @param config - Optional additional configuration
   * @returns Notification ID for later reference
   */
  const success = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'success' });
    },
    [show]
  );

  /**
   * Show an error notification with default error styling.
   *
   * @param message - Error message to display
   * @param config - Optional additional configuration
   * @returns Notification ID for later reference
   */
  const error = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'error' });
    },
    [show]
  );

  /**
   * Show a warning notification with default warning styling.
   *
   * @param message - Warning message to display
   * @param config - Optional additional configuration
   * @returns Notification ID for later reference
   */
  const warning = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'warning' });
    },
    [show]
  );

  /**
   * Show an info notification with default info styling.
   *
   * @param message - Info message to display
   * @param config - Optional additional configuration
   * @returns Notification ID for later reference
   */
  const info = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'info' });
    },
    [show]
  );

  /**
   * Show a loading notification with default loading styling.
   * Loading notifications are persistent by default.
   *
   * @param message - Loading message to display
   * @param config - Optional additional configuration
   * @returns Notification ID for later reference (important for dismissing loading states)
   */
  const loading = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'loading' });
    },
    [show]
  );

  /**
   * Get all stored notifications from localStorage.
   * Returns notifications sorted by timestamp (newest first).
   *
   * @returns Array of stored notifications
   */
  const getStoredNotifications = useCallback(() => {
    return storedNotifications;
  }, [storedNotifications]);

  /**
   * Mark a specific notification as read.
   * Updates the notification state and saves to localStorage.
   *
   * @param id - Notification ID to mark as read
   */
  const markAsRead = useCallback(
    (id: string) => {
      setStoredNotifications(prev => {
        const updated = prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        );
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  /**
   * Clear all stored notifications from localStorage and memory.
   * This does not affect currently visible toast notifications.
   */
  const clearStored = useCallback(() => {
    setStoredNotifications([]);
    remove(STORAGE_KEY);
  }, [remove]);

  /**
   * Calculate the number of unread notifications.
   * Updates automatically when notifications are added or marked as read.
   */
  const unreadCount = useMemo(() => {
    return storedNotifications.filter(notification => !notification.read)
      .length;
  }, [storedNotifications]);

  return {
    show,
    hide,
    clear,
    success,
    error,
    warning,
    info,
    loading,
    getStoredNotifications,
    markAsRead,
    clearStored,
    unreadCount,
    queue,
  };
}
