import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Create Supabase client with anon key for client-side operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Create Supabase client with service role key for server-side operations
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Database table names constants
export const TABLES = {
  PLAYERS: 'players',
  FISH_STATES: 'fish_states',
  AQUARIUM_STATES: 'aquarium_states',
  DECORATION_STATES: 'decoration_states',
  PLAYER_PREFERENCES: 'player_preferences',
  MINIGAME_SESSIONS: 'minigame_sessions',
  GAME_ANALYTICS: 'game_analytics',
  STORE_ITEMS: 'store_items',
  SHOP: 'shop_items',
};

// Real-time subscription channels
export const CHANNELS = {
  PLAYER_UPDATES: 'player_updates',
  FISH_UPDATES: 'fish_updates',
  AQUARIUM_UPDATES: 'aquarium_updates',
  DECORATION_UPDATES: 'decoration_updates',
  GAME_EVENTS: 'game_events',
  STORE_UPDATES: 'store_updates',
};
