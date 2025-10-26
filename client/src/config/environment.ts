// Environment configuration for Aqua Stark Frontend
// This file centralizes all environment variables

// Backend URL configuration with fallbacks
const getBackendUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback based on environment
  if (import.meta.env.MODE === 'production') {
    // Production: use relative path (same origin deployment)
    return '/api';
  }

  // Development: use absolute URL to local backend
  return 'http://localhost:3001/api';
};

export const ENV_CONFIG = {
  // Backend API URL with smart fallbacks
  API_URL: getBackendUrl(),

  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',

  // API timeout in milliseconds
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),

  // Debug mode
  DEBUG:
    import.meta.env.VITE_DEBUG === 'true' ||
    import.meta.env.MODE === 'development',

  // Feature flags
  FEATURES: {
    // Enable/disable backend integration
    BACKEND_INTEGRATION: import.meta.env.VITE_BACKEND_INTEGRATION !== 'false',

    // Enable/disable player validation
    PLAYER_VALIDATION: import.meta.env.VITE_PLAYER_VALIDATION !== 'false',

    // Enable/disable real-time updates
    REALTIME_UPDATES: import.meta.env.VITE_REALTIME_UPDATES !== 'false',
  },
};

// Helper function to check if we're in development
export const isDevelopment = () => ENV_CONFIG.NODE_ENV === 'development';

// Helper function to check if we're in production
export const isProduction = () => ENV_CONFIG.NODE_ENV === 'production';

// Helper function to get API URL with validation
export const getApiUrl = () => {
  if (!ENV_CONFIG.API_URL) {
    throw new Error('API_URL is not configured');
  }
  return ENV_CONFIG.API_URL;
};

// Helper function to check if using local backend
export const isLocalBackend = () => {
  return (
    ENV_CONFIG.API_URL.includes('localhost') ||
    ENV_CONFIG.API_URL.includes('127.0.0.1')
  );
};

// Helper function to check if using remote backend
export const isRemoteBackend = () => {
  return !isLocalBackend() && !ENV_CONFIG.API_URL.startsWith('/');
};

// Helper function to check if using relative path (same-origin deployment)
export const isRelativeBackend = () => {
  return ENV_CONFIG.API_URL.startsWith('/');
};

// Helper function to get backend type for debugging
export const getBackendType = () => {
  if (isLocalBackend()) {
    return 'local';
  }
  if (isRelativeBackend()) {
    return 'same-origin (unified deployment)';
  }
  return 'remote';
};

// Debug function to log current configuration
export const logEnvironmentConfig = () => {
  if (ENV_CONFIG.DEBUG) {
    console.log('🌊 Aqua Stark Environment Configuration:');
    console.log('📍 API URL:', ENV_CONFIG.API_URL);
    console.log('🌍 Environment:', ENV_CONFIG.NODE_ENV);
    console.log('🔧 Backend Type:', getBackendType());
    console.log('⚡ Features:', ENV_CONFIG.FEATURES);
    console.log('🐛 Debug Mode:', ENV_CONFIG.DEBUG);
  }
};
