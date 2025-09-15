import { useState, useCallback, useMemo, useEffect } from 'react';
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
  id: string;
  timestamp: number;
  read: boolean;
}

/**
 * Notification queue item
 */
interface NotificationQueueItem extends NotificationConfig {
  id: string;
  timestamp: number;
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
 * Default notification configurations
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
 * Maximum number of stored notifications
 */
const MAX_STORED_NOTIFICATIONS = 50;

/**
 * Unified hook for managing game notifications
 *
 * This hook centralizes all notification logic to avoid duplication across components.
 * It provides a consistent interface for showing different types of notifications,
 * managing notification persistence, and handling notification queues.
 *
 * @example
 * ```tsx
 * const { success, error, warning, info, loading } = useNotifications();
 *
 * // Show a success notification
 * success('Fish fed successfully!');
 *
 * // Show an error with custom config
 * error('Failed to connect wallet', {
 *   title: 'Connection Error',
 *   persistent: true,
 *   actionText: 'Retry',
 *   onAction: () => retryConnection()
 * });
 * ```
 *
 * @returns {UseNotificationsReturn} Object containing notification methods and state
 */
export function useNotifications(): UseNotificationsReturn {
  const [queue, setQueue] = useState<NotificationQueueItem[]>([]);
  const [storedNotifications, setStoredNotifications] = useState<
    StoredNotification[]
  >([]);

  /**
   * Load stored notifications from localStorage on mount
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredNotification[];
        setStoredNotifications(parsed);
      }
    } catch (error) {
      console.error('Failed to load stored notifications:', error);
    }
  }, []);

  /**
   * Save notifications to localStorage
   */
  const saveToStorage = useCallback((notifications: StoredNotification[]) => {
    try {
      // Keep only the most recent notifications
      const limited = notifications.slice(-MAX_STORED_NOTIFICATIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      setStoredNotifications(limited);
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
    }
  }, []);

  /**
   * Generate unique ID for notification
   */
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Validate notification configuration
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
   * Show a notification
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
   * Hide a specific notification
   */
  const hide = useCallback((id: string) => {
    toast.dismiss(id);
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clear = useCallback(() => {
    toast.dismiss();
    setQueue([]);
  }, []);

  /**
   * Show success notification
   */
  const success = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'success' });
    },
    [show]
  );

  /**
   * Show error notification
   */
  const error = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'error' });
    },
    [show]
  );

  /**
   * Show warning notification
   */
  const warning = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'warning' });
    },
    [show]
  );

  /**
   * Show info notification
   */
  const info = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'info' });
    },
    [show]
  );

  /**
   * Show loading notification
   */
  const loading = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) => {
      return show({ ...config, message, type: 'loading' });
    },
    [show]
  );

  /**
   * Get all stored notifications
   */
  const getStoredNotifications = useCallback(() => {
    return storedNotifications;
  }, [storedNotifications]);

  /**
   * Mark notification as read
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
   * Clear stored notifications
   */
  const clearStored = useCallback(() => {
    setStoredNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Calculate unread count
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
