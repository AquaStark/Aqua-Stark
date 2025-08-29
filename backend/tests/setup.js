// Test setup file for Aqua Stark Backend
// This file runs before all tests

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3002';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-jwt-secret';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Test utilities
global.testUtils = {
  // Mock player data
  mockPlayer: {
    player_id: 'player_123',
    wallet_address: '0x1234567890abcdef',
    username: 'testuser',
    level: 1,
    experience_current: 0,
    experience_total: 0,
    currency: 100,
    play_time_minutes: 0,
    fish_collected: 0,
    total_fish: 0,
    special_fish: 0,
    achievements_completed: 0,
    achievements_total: 8,
    fish_fed_count: 0,
    decorations_placed: 0,
    fish_bred_count: 0,
    aquariums_created: 0,
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },

  // Mock fish data
  mockFish: {
    fish_id: 'fish_456',
    player_id: 'player_123',
    happiness_level: 85,
    hunger_level: 90,
    health: 100,
    mood: 'happy',
    last_fed_timestamp: new Date().toISOString(),
    last_interaction_timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },

  // Mock decoration data
  mockDecoration: {
    decoration_id: 'decoration_789',
    player_id: 'player_123',
    aquarium_id: 'aquarium_101',
    position_x: 100,
    position_y: 200,
    rotation_degrees: 0,
    is_visible: true,
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },

  // Mock aquarium data
  mockAquarium: {
    aquarium_id: 'aquarium_101',
    player_id: 'player_123',
    water_temperature: 25,
    lighting_level: 80,
    pollution_level: 10,
    last_cleaned_timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },

  // Helper to create request headers
  createAuthHeaders: playerId => ({
    'Content-Type': 'application/json',
    'x-player-id': playerId,
  }),

  // Helper to create mock request
  createMockRequest: (params = {}, body = {}, headers = {}) => ({
    params,
    body,
    headers,
    user: null,
  }),

  // Helper to create mock response
  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
