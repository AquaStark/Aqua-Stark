-- Migration: 001_initial_schema.sql
-- Description: Off-chain dynamic states for Aqua Stark - On-chain handles ownership, off-chain handles states
-- Created: 2024-01-XX
-- Author: Aqua Stark Team

-- Clean slate - drop any existing tables
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS fish_states CASCADE;
DROP TABLE IF EXISTS aquarium_states CASCADE;
DROP TABLE IF EXISTS decoration_states CASCADE;
DROP TABLE IF EXISTS player_preferences CASCADE;
DROP TABLE IF EXISTS minigame_sessions CASCADE;
DROP TABLE IF EXISTS game_analytics CASCADE;
DROP TABLE IF EXISTS schema_migrations CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom ENUM types for off-chain data only
CREATE TYPE mood_state AS ENUM (
  'happy', 'sad', 'excited', 'sleepy', 'hungry', 'sick', 'playful', 'lonely'
);

CREATE TYPE game_type AS ENUM (
  'flappy_fish', 'bubble_pop', 'fish_race', 'treasure_hunt', 'feeding_frenzy'
);

-- Players table - stores off-chain dynamic data for on-chain players
-- player_id comes from on-chain registration
CREATE TABLE players (
  player_id TEXT PRIMARY KEY, -- References on-chain player ID (from Dojo)
  wallet_address TEXT UNIQUE NOT NULL, -- References on-chain wallet address
  username TEXT, -- For easier queries (also stored on-chain)
  level INTEGER DEFAULT 1,
  experience_current INTEGER DEFAULT 0,
  experience_total INTEGER DEFAULT 0,
  currency INTEGER DEFAULT 0, -- Off-chain currency for micro-transactions
  play_time_minutes INTEGER DEFAULT 0,
  fish_collected INTEGER DEFAULT 0,
  total_fish INTEGER DEFAULT 0,
  special_fish INTEGER DEFAULT 0,
  achievements_completed INTEGER DEFAULT 0,
  achievements_total INTEGER DEFAULT 8,
  fish_fed_count INTEGER DEFAULT 0,
  decorations_placed INTEGER DEFAULT 0,
  fish_bred_count INTEGER DEFAULT 0,
  aquariums_created INTEGER DEFAULT 0,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fish states - dynamic data for on-chain fish NFTs
-- fish_id comes from on-chain fish creation
CREATE TABLE fish_states (
  fish_id TEXT PRIMARY KEY, -- References on-chain fish NFT ID
  player_id TEXT NOT NULL, -- FK to players table
  happiness_level INTEGER DEFAULT 50 CHECK (happiness_level >= 0 AND happiness_level <= 100),
  hunger_level INTEGER DEFAULT 100 CHECK (hunger_level >= 0 AND hunger_level <= 100),
  health INTEGER DEFAULT 100 CHECK (health >= 0 AND health <= 100),
  mood mood_state DEFAULT 'happy',
  last_fed_timestamp TIMESTAMP WITH TIME ZONE,
  last_played_timestamp TIMESTAMP WITH TIME ZONE,
  last_interaction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activity_streak INTEGER DEFAULT 0,
  experience_points INTEGER DEFAULT 0, -- Temporary until synced to on-chain
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Aquarium states - dynamic data for on-chain aquarium NFTs
-- aquarium_id comes from on-chain aquarium creation
CREATE TABLE aquarium_states (
  aquarium_id TEXT PRIMARY KEY, -- References on-chain aquarium NFT ID
  player_id TEXT NOT NULL, -- FK to players table
  water_temperature DECIMAL(4,1) DEFAULT 25.0 CHECK (water_temperature >= 18.0 AND water_temperature <= 32.0),
  lighting_level INTEGER DEFAULT 50 CHECK (lighting_level >= 0 AND lighting_level <= 100),
  pollution_level DECIMAL(3,2) DEFAULT 0.0 CHECK (pollution_level >= 0.0 AND pollution_level <= 1.0),
  background_music_playing BOOLEAN DEFAULT false,
  last_cleaned_timestamp TIMESTAMP WITH TIME ZONE,
  current_theme_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Decoration states - dynamic data for on-chain decoration NFTs
-- decoration_id comes from on-chain decoration creation
CREATE TABLE decoration_states (
  decoration_id TEXT PRIMARY KEY, -- References on-chain decoration NFT ID
  player_id TEXT NOT NULL, -- FK to players table
  aquarium_id TEXT, -- Optional: which aquarium it's placed in
  position_x DECIMAL(5,2), -- Position in aquarium
  position_y DECIMAL(5,2),
  rotation_degrees INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
  FOREIGN KEY (aquarium_id) REFERENCES aquarium_states(aquarium_id) ON DELETE SET NULL
);

-- Player preferences (off-chain only)
CREATE TABLE player_preferences (
  player_id TEXT PRIMARY KEY, -- FK to players table
  sound_enabled BOOLEAN DEFAULT true,
  animations_enabled BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  preferred_language TEXT DEFAULT 'en',
  ui_theme TEXT DEFAULT 'light' CHECK (ui_theme IN ('light', 'dark', 'auto')),
  auto_feed_enabled BOOLEAN DEFAULT false,
  tutorial_completed_steps TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Minigame sessions (off-chain temporary data)
CREATE TABLE minigame_sessions (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id TEXT NOT NULL, -- FK to players table
  game_type game_type NOT NULL,
  score INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0, -- in seconds
  xp_earned INTEGER DEFAULT 0,
  synced_to_chain BOOLEAN DEFAULT false, -- Track if XP was synced to on-chain
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Game analytics (off-chain aggregated data)
CREATE TABLE game_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id TEXT NOT NULL, -- FK to players table
  fish_id TEXT, -- Optional, for fish-specific analytics
  metric_name TEXT NOT NULL, -- 'daily_interactions', 'feeding_count', etc.
  metric_value INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, fish_id, metric_name, date),
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_players_wallet ON players(wallet_address);
CREATE INDEX idx_players_username ON players(username);
CREATE INDEX idx_fish_states_player ON fish_states(player_id);
CREATE INDEX idx_fish_states_happiness ON fish_states(happiness_level);
CREATE INDEX idx_fish_states_last_interaction ON fish_states(last_interaction_timestamp);
CREATE INDEX idx_aquarium_states_player ON aquarium_states(player_id);
CREATE INDEX idx_aquarium_states_pollution ON aquarium_states(pollution_level);
CREATE INDEX idx_decoration_states_player ON decoration_states(player_id);
CREATE INDEX idx_decoration_states_aquarium ON decoration_states(aquarium_id);
CREATE INDEX idx_minigame_sessions_player ON minigame_sessions(player_id);
CREATE INDEX idx_minigame_sessions_unsynced ON minigame_sessions(synced_to_chain) WHERE synced_to_chain = false;
CREATE INDEX idx_game_analytics_player ON game_analytics(player_id);
CREATE INDEX idx_game_analytics_player_date ON game_analytics(player_id, date);

-- Create trigger for updating last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_last_updated 
  BEFORE UPDATE ON players 
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();

CREATE TRIGGER update_fish_states_last_updated 
  BEFORE UPDATE ON fish_states 
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();

CREATE TRIGGER update_aquarium_states_last_updated 
  BEFORE UPDATE ON aquarium_states 
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();

CREATE TRIGGER update_decoration_states_last_updated 
  BEFORE UPDATE ON decoration_states 
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();

CREATE TRIGGER update_player_preferences_last_updated 
  BEFORE UPDATE ON player_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE aquarium_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE decoration_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE minigame_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (simplified - will be updated based on actual auth)
CREATE POLICY "Users can view their own data" ON players
  FOR SELECT USING (true); -- Will be updated with proper auth

CREATE POLICY "Users can update their own data" ON players
  FOR UPDATE USING (true); -- Will be updated with proper auth

CREATE POLICY "Users can insert their own data" ON players
  FOR INSERT WITH CHECK (true); -- Will be updated with proper auth

CREATE POLICY "Users can view their own fish states" ON fish_states
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own fish states" ON fish_states
  FOR UPDATE USING (true);

CREATE POLICY "Users can insert their own fish states" ON fish_states
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own aquarium states" ON aquarium_states
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own aquarium states" ON aquarium_states
  FOR UPDATE USING (true);

CREATE POLICY "Users can insert their own aquarium states" ON aquarium_states
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own decoration states" ON decoration_states
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own decoration states" ON decoration_states
  FOR UPDATE USING (true);

CREATE POLICY "Users can insert their own decoration states" ON decoration_states
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own preferences" ON player_preferences
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own preferences" ON player_preferences
  FOR UPDATE USING (true);

CREATE POLICY "Users can insert their own preferences" ON player_preferences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own game sessions" ON minigame_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own game sessions" ON minigame_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own analytics" ON game_analytics
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own analytics" ON game_analytics
  FOR INSERT WITH CHECK (true);

-- Enable real-time for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE fish_states;
ALTER PUBLICATION supabase_realtime ADD TABLE aquarium_states;
ALTER PUBLICATION supabase_realtime ADD TABLE minigame_sessions;

-- Create views for easier querying
CREATE VIEW player_profile AS
SELECT 
  p.player_id,
  p.wallet_address,
  p.username,
  p.level,
  p.experience_current,
  p.experience_total,
  p.currency,
  p.play_time_minutes,
  p.fish_collected,
  p.total_fish,
  p.special_fish,
  p.achievements_completed,
  p.achievements_total,
  p.fish_fed_count,
  p.decorations_placed,
  p.fish_bred_count,
  p.aquariums_created,
  p.last_login,
  p.last_updated
FROM players p;

CREATE VIEW fish_with_states AS
SELECT 
  fs.fish_id,
  fs.player_id,
  fs.happiness_level,
  fs.hunger_level,
  fs.health,
  fs.mood,
  fs.last_fed_timestamp,
  fs.last_played_timestamp,
  fs.activity_streak,
  fs.experience_points,
  fs.last_updated
FROM fish_states fs;

CREATE VIEW aquarium_with_states AS
SELECT 
  aqs.aquarium_id,
  aqs.player_id,
  aqs.water_temperature,
  aqs.lighting_level,
  aqs.pollution_level,
  aqs.background_music_playing,
  aqs.last_cleaned_timestamp,
  aqs.current_theme_id,
  aqs.last_updated
FROM aquarium_states aqs;
