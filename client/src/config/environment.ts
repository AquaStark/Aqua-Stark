// Environment configuration for Aqua Stark Frontend
// This file centralizes all environment variables

export const ENV_CONFIG = {
  // Backend API URL - defaults to localhost:3001
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // API timeout in milliseconds
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // Feature flags
  FEATURES: {
    // Enable/disable backend integration
    BACKEND_INTEGRATION: import.meta.env.VITE_BACKEND_INTEGRATION !== 'false',
    
    // Enable/disable player validation
    PLAYER_VALIDATION: import.meta.env.VITE_PLAYER_VALIDATION !== 'false',
    
    // Enable/disable real-time updates
    REALTIME_UPDATES: import.meta.env.VITE_REALTIME_UPDATES !== 'false',
  }
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
