// UI component prop types
export interface UIAnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  onComplete?: () => void;
  onStart?: () => void;
}

export interface CardVariant {
  type: 'default' | 'premium' | 'special' | 'achievement';
  size: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'colorful';
}

export interface BannerType {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  active: boolean;
  priority: number;
}

export interface FilterType {
  id: string;
  label: string;
  value: string | number | boolean;
  options?: Array<{
    label: string;
    value: string | number | boolean;
  }>;
}

// Modal and overlay types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  className?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  data?: unknown;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ErrorWithMessage {
  message?: string;
  toString?: () => string;
}

// Animation props for framer-motion
import type { Easing } from 'framer-motion';

export interface MotionAnimationProps {
  animate?: {
    rotate?: number | number[];
    y?: number | number[];
    scale?: number | number[];
    x?: number | number[];
  };
  transition?: {
    duration?: number;
    repeat?: number;
    ease?: Easing | Easing[];
    delay?: number;
  };
}

// Framer Motion variants - use the official Variants type
import type { Variants } from 'framer-motion';
export type MotionVariants = Variants;
