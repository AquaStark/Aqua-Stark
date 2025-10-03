import { useState, useCallback, useEffect } from 'react';

/**
 * @file use-modal.ts
 * @description
 * Unified hook for managing modal state and behavior across the application.
 * Provides consistent modal management with validation, persistence, and accessibility features.
 *
 * @category Hooks
 */

/**
 * Represents the current state of a modal
 */
export interface ModalState {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Whether the modal is visible (used for animations) */
  isVisible: boolean;
  /** Optional data associated with the modal */
  data?: any;
}

/**
 * Configuration options for modal behavior
 */
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

/**
 * Return type for the useModal hook
 */
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
 * Unified hook for managing modal state and behavior.
 * Provides comprehensive modal management with validation, persistence,
 * accessibility features, and animation support.
 *
 * @param config - Modal configuration options
 * @returns Object containing modal state and control functions
 *
 * @example
 * Basic usage:
 * ```tsx
 * const { open, close, isOpen } = useModal();
 *
 * return (
 *   <div>
 *     <button onClick={() => open()}>Open Modal</button>
 *     {isOpen && <MyModal onClose={close} />}
 *   </div>
 * );
 * ```
 *
 * @example
 * With validation and persistence:
 * ```tsx
 * const { open, close, isOpen, data } = useModal({
 *   closable: true,
 *   persistent: true,
 *   storageKey: 'user-preferences-modal',
 *   validator: (data) => data?.userId !== undefined,
 *   onOpen: (data) => console.log('Modal opened with:', data),
 *   onClose: () => console.log('Modal closed'),
 *   animationDuration: 500
 * });
 *
 * // Open modal with data validation
 * const handleOpenModal = () => {
 *   open({ userId: 123, settings: {...} });
 * };
 * ```
 *
 * @example
 * Non-closable modal with custom animation:
 * ```tsx
 * const { open, close, isOpen } = useModal({
 *   closable: false, // Cannot be closed with Escape or outside click
 *   animationDuration: 200,
 *   onOpen: () => console.log('Loading modal opened'),
 *   validator: (data) => data?.isValid === true
 * });
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
    animationDuration = 300,
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
            data: parsed.data,
          };
        }
      } catch (error) {
        console.warn('useModal: Failed to parse saved state:', error);
      }
    }
    return {
      isOpen: false,
      isVisible: false,
      data: undefined,
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
   * Opens the modal with optional data.
   * Runs validation if a validator function is provided.
   * Triggers onOpen callback if modal opens successfully.
   *
   * @param data - Optional data to pass to the modal
   */
  const open = useCallback(
    (data?: any) => {
      // Run validation if provided
      if (validator && !validator(data)) {
        console.warn('useModal: Validation failed, modal not opened');
        return;
      }

      setState(prev => ({
        ...prev,
        isOpen: true,
        isVisible: true,
        data,
      }));

      onOpen?.(data);
    },
    [validator, onOpen]
  );

  /**
   * Closes the modal with animation support.
   * Sets isOpen to false immediately, then sets isVisible to false
   * after the animation duration to allow for smooth transitions.
   * Triggers onClose callback with current modal data.
   */
  const close = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
    }));

    // Handle animation timing
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isVisible: false,
        data: undefined,
      }));
    }, animationDuration);

    onClose?.(state.data);
  }, [animationDuration, onClose, state.data]);

  /**
   * Toggles the modal state.
   * If modal is open, closes it. If closed, opens it with optional data.
   *
   * @param data - Optional data to pass when opening the modal
   */
  const toggle = useCallback(
    (data?: any) => {
      if (state.isOpen) {
        close();
      } else {
        open(data);
      }
    },
    [state.isOpen, open, close]
  );

  return {
    state,
    open,
    close,
    toggle,
    isOpen: state.isOpen,
    isVisible: state.isVisible,
    data: state.data,
  };
}

/**
 * Hook for managing multiple modals with individual states.
 * Useful when you need to manage several modals in a single component
 * or want to create a modal management system.
 *
 * @param modalIds - Array of unique modal identifiers
 * @param config - Default configuration applied to all modals
 * @returns Object with modal controls for each ID
 *
 * @example
 * Basic usage with multiple modals:
 * ```tsx
 * const modals = useMultipleModals(['user', 'settings', 'help'], {
 *   closable: true,
 *   persistent: true
 * });
 *
 * // Each modal is independent
 * const handleShowUser = () => modals.user.open({ userId: 123 });
 * const handleShowSettings = () => modals.settings.open();
 * const handleShowHelp = () => modals.help.open();
 *
 * return (
 *   <div>
 *     <button onClick={handleShowUser}>Show User Modal</button>
 *     <button onClick={handleShowSettings}>Show Settings</button>
 *     <button onClick={handleShowHelp}>Show Help</button>
 *
 *     {modals.user.isOpen && <UserModal onClose={modals.user.close} />}
 *     {modals.settings.isOpen && <SettingsModal onClose={modals.settings.close} />}
 *     {modals.help.isOpen && <HelpModal onClose={modals.help.close} />}
 *   </div>
 * );
 * ```
 *
 * @example
 * With individual storage keys:
 * ```tsx
 * const modals = useMultipleModals(['onboarding', 'tutorial'], {
 *   persistent: true,
 *   storageKey: 'app-modals', // Will create 'app-modals-onboarding', 'app-modals-tutorial'
 *   closable: false
 * });
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
      storageKey: config.persistent
        ? `${config.storageKey || 'modal'}-${id}`
        : undefined,
    });
  });

  return modals;
}

/**
 * Hook for managing modal with confirmation functionality.
 * Extends the basic modal with confirm/cancel actions,
 * commonly used for delete confirmations, form submissions, etc.
 *
 * @param config - Modal configuration with additional confirm/cancel callbacks
 * @returns Modal controls extended with confirmation methods
 *
 * @example
 * Delete confirmation modal:
 * ```tsx
 * const { open, close, confirm, cancel, isOpen, data } = useConfirmModal({
 *   onConfirm: (data) => {
 *     console.log('Deleting item:', data.itemId);
 *     deleteItem(data.itemId);
 *   },
 *   onCancel: () => console.log('Delete cancelled'),
 *   validator: (data) => data?.itemId !== undefined
 * });
 *
 * const handleDeleteClick = (itemId: string) => {
 *   open({ itemId, itemName: 'Important Document' });
 * };
 *
 * return (
 *   <div>
 *     <button onClick={() => handleDeleteClick('doc-123')}>
 *       Delete Document
 *     </button>
 *
 *     {isOpen && (
 *       <ConfirmModal
 *         title="Delete Document"
 *         message={`Are you sure you want to delete "${data?.itemName}"?`}
 *         onConfirm={() => confirm(data)}
 *         onCancel={cancel}
 *       />
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * Form submission confirmation:
 * ```tsx
 * const { open, confirm, cancel, isOpen } = useConfirmModal({
 *   onConfirm: (formData) => {
 *     submitForm(formData);
 *     showSuccessMessage('Form submitted successfully');
 *   },
 *   onCancel: () => showMessage('Submission cancelled')
 * });
 * ```
 */
export function useConfirmModal(
  config: ModalConfig & {
    /** Callback when user confirms the action */
    onConfirm?: (data?: any) => void;
    /** Callback when user cancels the action */
    onCancel?: () => void;
  } = {}
) {
  const { onConfirm, onCancel, ...modalConfig } = config;
  const modal = useModal(modalConfig);

  /**
   * Confirms the modal action and closes the modal.
   * Triggers the onConfirm callback with optional data.
   *
   * @param data - Optional data to pass to the onConfirm callback
   */
  const confirm = useCallback(
    (data?: any) => {
      onConfirm?.(data);
      modal.close();
    },
    [onConfirm, modal]
  );

  /**
   * Cancels the modal action and closes the modal.
   * Triggers the onCancel callback.
   */
  const cancel = useCallback(() => {
    onCancel?.();
    modal.close();
  }, [onCancel, modal]);

  return {
    ...modal,
    confirm,
    cancel,
  };
}
