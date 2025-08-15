-- Migration: 20250815011150_fix_schema_structure.sql
-- Description: Transform existing schema to new structure with proper FK relationships
-- Created: 2025-01-15
-- Author: Aqua Stark Team

-- Step 1: Create new players table
CREATE TABLE IF NOT EXISTS players (
  player_id TEXT PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  level INTEGER DEFAULT 1,
  experience_current INTEGER DEFAULT 0,
  experience_total INTEGER DEFAULT 0,
  currency INTEGER DEFAULT 0,
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

-- Step 2: Rename existing tables to new structure
-- Rename fish_dynamic_states to fish_states
ALTER TABLE IF EXISTS fish_dynamic_states RENAME TO fish_states;

-- Rename aquarium_dynamic_states to aquarium_states
ALTER TABLE IF EXISTS aquarium_dynamic_states RENAME TO aquarium_states;

-- Step 3: Add player_id column to fish_states if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'fish_states' AND column_name = 'player_id') THEN
    ALTER TABLE fish_states ADD COLUMN player_id TEXT;
  END IF;
END $$;

-- Step 4: Add player_id column to aquarium_states if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'aquarium_states' AND column_name = 'player_id') THEN
    ALTER TABLE aquarium_states ADD COLUMN player_id TEXT;
  END IF;
END $$;

-- Step 5: Create decoration_states table
CREATE TABLE IF NOT EXISTS decoration_states (
  decoration_id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  aquarium_id TEXT,
  position_x DECIMAL(5,2),
  position_y DECIMAL(5,2),
  rotation_degrees INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Update player_preferences to use player_id instead of wallet_address
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'player_preferences' AND column_name = 'wallet_address') THEN
    -- Add player_id column
    ALTER TABLE player_preferences ADD COLUMN IF NOT EXISTS player_id TEXT;
    
    -- Update primary key
    ALTER TABLE player_preferences DROP CONSTRAINT IF EXISTS player_preferences_pkey;
    ALTER TABLE player_preferences ADD PRIMARY KEY (player_id);
    
    -- Remove old wallet_address column
    ALTER TABLE player_preferences DROP COLUMN IF EXISTS wallet_address;
  END IF;
END $$;

-- Step 7: Update minigame_sessions to use player_id
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'minigame_sessions' AND column_name = 'player_wallet') THEN
    -- Add player_id column
    ALTER TABLE minigame_sessions ADD COLUMN IF NOT EXISTS player_id TEXT;
    
    -- Remove old player_wallet column
    ALTER TABLE minigame_sessions DROP COLUMN IF EXISTS player_wallet;
  END IF;
END $$;

-- Step 8: Update game_analytics to use player_id
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'game_analytics' AND column_name = 'player_wallet') THEN
    -- Add player_id column
    ALTER TABLE game_analytics ADD COLUMN IF NOT EXISTS player_id TEXT;
    
    -- Remove old player_wallet column
    ALTER TABLE game_analytics DROP COLUMN IF EXISTS player_wallet;
  END IF;
END $$;

-- Step 9: Add foreign key constraints
-- Fish states FK
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'fk_fish_states_player') THEN
    ALTER TABLE fish_states ADD CONSTRAINT fk_fish_states_player 
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Aquarium states FK
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'fk_aquarium_states_player') THEN
    ALTER TABLE aquarium_states ADD CONSTRAINT fk_aquarium_states_player 
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Decoration states FK
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'fk_decoration_states_player') THEN
    ALTER TABLE decoration_states ADD CONSTRAINT fk_decoration_states_player 
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'fk_decoration_states_aquarium') THEN
    ALTER TABLE decoration_states ADD CONSTRAINT fk_decoration_states_aquarium 
    FOREIGN KEY (aquarium_id) REFERENCES aquarium_states(aquarium_id) ON DELETE SET NULL;
  END IF;
END $$;

-- Player preferences FK
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'fk_player_preferences_player') THEN
    ALTER TABLE player_preferences ADD CONSTRAINT fk_player_preferences_player 
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Minigame sessions FK
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'fk_minigame_sessions_player') THEN
    ALTER TABLE minigame_sessions ADD CONSTRAINT fk_minigame_sessions_player 
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Game analytics FK
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'fk_game_analytics_player') THEN
    ALTER TABLE game_analytics ADD CONSTRAINT fk_game_analytics_player 
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 10: Create new indexes
CREATE INDEX IF NOT EXISTS idx_players_wallet ON players(wallet_address);
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_fish_states_player ON fish_states(player_id);
CREATE INDEX IF NOT EXISTS idx_aquarium_states_player ON aquarium_states(player_id);
CREATE INDEX IF NOT EXISTS idx_decoration_states_player ON decoration_states(player_id);
CREATE INDEX IF NOT EXISTS idx_decoration_states_aquarium ON decoration_states(aquarium_id);
CREATE INDEX IF NOT EXISTS idx_minigame_sessions_player ON minigame_sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_game_analytics_player ON game_analytics(player_id);

-- Step 11: Update triggers for new tables
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers 
                 WHERE trigger_name = 'update_players_last_updated') THEN
    CREATE TRIGGER update_players_last_updated 
      BEFORE UPDATE ON players 
      FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers 
                 WHERE trigger_name = 'update_decoration_states_last_updated') THEN
    CREATE TRIGGER update_decoration_states_last_updated 
      BEFORE UPDATE ON decoration_states 
      FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();
  END IF;
END $$;

-- Step 12: Enable RLS on new tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE decoration_states ENABLE ROW LEVEL SECURITY;

-- Step 13: Create RLS policies for new tables
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own data' AND tablename = 'players') THEN
    CREATE POLICY "Users can view their own data" ON players
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own data' AND tablename = 'players') THEN
    CREATE POLICY "Users can update their own data" ON players
      FOR UPDATE USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own data' AND tablename = 'players') THEN
    CREATE POLICY "Users can insert their own data" ON players
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own decoration states' AND tablename = 'decoration_states') THEN
    CREATE POLICY "Users can view their own decoration states" ON decoration_states
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own decoration states' AND tablename = 'decoration_states') THEN
    CREATE POLICY "Users can update their own decoration states" ON decoration_states
      FOR UPDATE USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own decoration states' AND tablename = 'decoration_states') THEN
    CREATE POLICY "Users can insert their own decoration states" ON decoration_states
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Step 14: Enable real-time for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE decoration_states;

-- Step 15: Create new views
CREATE OR REPLACE VIEW player_profile AS
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

CREATE OR REPLACE VIEW fish_with_states AS
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

CREATE OR REPLACE VIEW aquarium_with_states AS
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
