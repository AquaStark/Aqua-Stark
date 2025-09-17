import { useState, useCallback, useEffect } from 'react';

/**
 * @file use-modal.ts
 * @description
 * Unified hook for managing modal state and behavior across the application.
 * Provides consistent modal management with validation, persistence, and accessibility features.
 * 
 * @category Hooks
 */

export interface ModalState {
  isOpen: boolean;
  isVisible: boolean;
  data?: any;
}

export interface ModalConfig {
  /** Whether the modal can be closed by clicking outside or pressing Escape */
  closable?: boolean;
  /** Whether to persist modal state in localStorage */
  persistent?: boolean;
  /** Storage key for persistence (required if persistent is true) */
  storageKey?: string;
  /** Validation function that returns true if modal can be opened */
  validator?: (data?: any) => boolean;
  /** Callback when modal opens */
  onOpen?: (data?: any) => void;
  /** Callback when modal closes */
  onClose?: (data?: any) => void;
  /** Animation duration in milliseconds */
  animationDuration?: number;
}

export interface UseModalReturn {
  /** Current modal state */
  state: ModalState;
  /** Open the modal with optional data */
  open: (data?: any) => void;
  /** Close the modal */
  close: () => void;
  /** Toggle modal state */
  toggle: (data?: any) => void;
  /** Check if modal is open */
  isOpen: boolean;
  /** Check if modal is visible (for animations) */
  isVisible: boolean;
  /** Current modal data */
  data: any;
}

/**
 * Unified hook for managing modal state and behavior
 * 
 * @param config - Modal configuration options
 * @returns Modal state and control functions
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { open, close, isOpen } = useModal();
 * 
 * // With validation and persistence
 * const { open, close, isOpen, data } = useModal({
 *   closable: true,
 *   persistent: true,
 *   storageKey: 'user-preferences-modal',
 *   validator: (data) => data?.userId !== undefined,
 *   onOpen: (data) => console.log('Modal opened with:', data),
 *   onClose: () => console.log('Modal closed')
 * });
 * 
 * // Usage in component
 * return (
 *   <div>
 *     <button onClick={() => open({ userId: 123 })}>Open Modal</button>
 *     {isOpen && <MyModal onClose={close} data={data} />}
 *   </div>
 * );
 * ```
 */
export function useModal(config: ModalConfig = {}): UseModalReturn {
  const {
    closable = true,
    persistent = false,
    storageKey,
    validator,
    onOpen,
    onClose,
    animationDuration = 300
  } = config;

  // Validate configuration
  if (persistent && !storageKey) {
    console.warn('useModal: storageKey is required when persistent is true');
  }

  // Initialize state
  const [state, setState] = useState<ModalState>(() => {
    if (persistent && storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            isOpen: parsed.isOpen || false,
            isVisible: parsed.isVisible || false,
            data: parsed.data
          };
        }
      } catch (error) {
        console.warn('useModal: Failed to parse saved state:', error);
      }
    }
    return {
      isOpen: false,
      isVisible: false,
      data: undefined
    };
  });

  // Persist state to localStorage
  useEffect(() => {
    if (persistent && storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.warn('useModal: Failed to save state:', error);
      }
    }
  }, [state, persistent, storageKey]);

  // Handle escape key
  useEffect(() => {
    if (!state.isOpen || !closable) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [state.isOpen, closable]);

  // Handle body scroll lock
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [state.isOpen]);

  /**
   * Open the modal with optional data
   */
  const open = useCallback((data?: any) => {
    // Run validation if provided
    if (validator && !validator(data)) {
      console.warn('useModal: Validation failed, modal not opened');
      return;
    }

    setState(prev => ({
      ...prev,
      isOpen: true,
      isVisible: true,
      data
    }));

    onOpen?.(data);
  }, [validator, onOpen]);

  /**
   * Close the modal
   */
  const close = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false
    }));

    // Handle animation timing
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isVisible: false,
        data: undefined
      }));
    }, animationDuration);

    onClose?.(state.data);
  }, [animationDuration, onClose, state.data]);

  /**
   * Toggle modal state
   */
  const toggle = useCallback((data?: any) => {
    if (state.isOpen) {
      close();
    } else {
      open(data);
    }
  }, [state.isOpen, open, close]);

  return {
    state,
    open,
    close,
    toggle,
    isOpen: state.isOpen,
    isVisible: state.isVisible,
    data: state.data
  };
}

/**
 * Hook for managing multiple modals
 * 
 * @param modalIds - Array of modal identifiers
 * @param config - Default configuration for all modals
 * @returns Object with modal controls for each ID
 * 
 * @example
 * ```tsx
 * const modals = useMultipleModals(['user', 'settings', 'help'], {
 *   closable: true,
 *   persistent: true
 * });
 * 
 * // Usage
 * modals.user.open({ userId: 123 });
 * modals.settings.close();
 * modals.help.isOpen;
 * ```
 */
export function useMultipleModals(
  modalIds: string[],
  config: ModalConfig = {}
): Record<string, UseModalReturn> {
  const modals: Record<string, UseModalReturn> = {};

  modalIds.forEach(id => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    modals[id] = useModal({
      ...config,
      storageKey: config.persistent ? `${config.storageKey || 'modal'}-${id}` : undefined
    });
  });

  return modals;
}

/**
 * Hook for managing modal with confirmation
 * 
 * @param config - Modal configuration
 * @returns Modal controls with confirmation methods
 * 
 * @example
 * ```tsx
 * const { open, close, confirm, isOpen } = useConfirmModal({
 *   onConfirm: (data) => console.log('Confirmed:', data),
 *   onCancel: () => console.log('Cancelled')
 * });
 * ```
 */
export function useConfirmModal(config: ModalConfig & {
  onConfirm?: (data?: any) => void;
  onCancel?: () => void;
} = {}) {
  const { onConfirm, onCancel, ...modalConfig } = config;
  const modal = useModal(modalConfig);

  const confirm = useCallback((data?: any) => {
    onConfirm?.(data);
    modal.close();
  }, [onConfirm, modal]);

  const cancel = useCallback(() => {
    onCancel?.();
    modal.close();
  }, [onCancel, modal]);

  return {
    ...modal,
    confirm,
    cancel
  };
}
