-- Aqua Stark Database Schema for Supabase
-- Execute this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE game_type AS ENUM ('flappy_fish', 'angry_fish', 'fish_racing', 'bubble_pop', 'fish_memory', 'achievement');
CREATE TYPE fish_species AS ENUM ('goldfish', 'betta', 'tetra', 'guppy', 'angelfish');
CREATE TYPE fish_color AS ENUM ('red', 'blue', 'green', 'yellow', 'orange', 'purple');
CREATE TYPE fish_pattern AS ENUM ('solid', 'striped', 'spotted', 'gradient', 'metallic');

-- Fish states table (off-chain dynamic data)
CREATE TABLE fish_states (
  fish_id TEXT PRIMARY KEY,
  owner_address TEXT NOT NULL,
  species fish_species,
  color fish_color,
  pattern fish_pattern,
  happiness_level INTEGER DEFAULT 50 CHECK (happiness_level >= 0 AND happiness_level <= 100),
  hunger_level INTEGER DEFAULT 100 CHECK (hunger_level >= 0 AND hunger_level <= 100),
  health INTEGER DEFAULT 100 CHECK (health >= 0 AND health <= 100),
  generation INTEGER DEFAULT 1 CHECK (generation >= 1),
  age INTEGER DEFAULT 0 CHECK (age >= 0),
  parent1_id TEXT,
  parent2_id TEXT,
  last_fed_timestamp TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aquarium states table (off-chain dynamic data)
CREATE TABLE aquarium_states (
  aquarium_id TEXT PRIMARY KEY,
  owner_address TEXT NOT NULL,
  water_temperature DECIMAL(4,1) DEFAULT 25.0 CHECK (water_temperature >= 15.0 AND water_temperature <= 35.0),
  lighting_level INTEGER DEFAULT 50 CHECK (lighting_level >= 0 AND lighting_level <= 100),
  pollution_level INTEGER DEFAULT 0 CHECK (pollution_level >= 0 AND pollution_level <= 100),
  fish_count INTEGER DEFAULT 0 CHECK (fish_count >= 0),
  max_capacity INTEGER DEFAULT 10 CHECK (max_capacity >= 1),
  last_cleaned TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player preferences table
CREATE TABLE player_preferences (
  wallet_address TEXT PRIMARY KEY,
  sound_enabled BOOLEAN DEFAULT TRUE,
  animations_enabled BOOLEAN DEFAULT TRUE,
  ui_theme TEXT DEFAULT 'default' CHECK (ui_theme IN ('default', 'dark', 'light', 'aqua')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es', 'fr')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Minigame sessions table
CREATE TABLE minigame_sessions (
  session_id TEXT PRIMARY KEY,
  player_wallet TEXT NOT NULL,
  game_type game_type NOT NULL,
  score INTEGER DEFAULT 0 CHECK (score >= 0),
  xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
  achievement_type TEXT,
  synced_to_chain BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  synced_at TIMESTAMP WITH TIME ZONE
);

-- Fish NFTs table (on-chain data reference)
CREATE TABLE fish_nfts (
  fish_id TEXT PRIMARY KEY,
  owner_address TEXT NOT NULL,
  token_id TEXT UNIQUE NOT NULL,
  contract_address TEXT NOT NULL,
  species fish_species NOT NULL,
  color fish_color NOT NULL,
  pattern fish_pattern NOT NULL,
  size DECIMAL(3,1) DEFAULT 1.0 CHECK (size >= 0.1 AND size <= 10.0),
  speed INTEGER DEFAULT 50 CHECK (speed >= 1 AND speed <= 100),
  mutation_rate DECIMAL(3,2) DEFAULT 0.05 CHECK (mutation_rate >= 0.0 AND mutation_rate <= 1.0),
  generation INTEGER DEFAULT 1 CHECK (generation >= 1),
  birth_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent1_id TEXT,
  parent2_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aquarium NFTs table (on-chain data reference)
CREATE TABLE aquarium_nfts (
  aquarium_id TEXT PRIMARY KEY,
  owner_address TEXT NOT NULL,
  token_id TEXT UNIQUE NOT NULL,
  contract_address TEXT NOT NULL,
  max_capacity INTEGER DEFAULT 10 CHECK (max_capacity >= 1),
  aquarium_type TEXT DEFAULT 'basic' CHECK (aquarium_type IN ('basic', 'premium', 'luxury')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Decorations table
CREATE TABLE decorations (
  decoration_id TEXT PRIMARY KEY,
  owner_address TEXT NOT NULL,
  token_id TEXT UNIQUE NOT NULL,
  contract_address TEXT NOT NULL,
  decoration_type TEXT NOT NULL CHECK (decoration_type IN ('plant', 'rock', 'castle', 'bubble_maker', 'light')),
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  aquarium_id TEXT,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
  wallet_address TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_fish_states_owner ON fish_states(owner_address);
CREATE INDEX idx_fish_states_happiness ON fish_states(happiness_level);
CREATE INDEX idx_aquarium_states_owner ON aquarium_states(owner_address);
CREATE INDEX idx_minigame_sessions_player ON minigame_sessions(player_wallet);
CREATE INDEX idx_minigame_sessions_game_type ON minigame_sessions(game_type);
CREATE INDEX idx_minigame_sessions_synced ON minigame_sessions(synced_to_chain);
CREATE INDEX idx_fish_nfts_owner ON fish_nfts(owner_address);
CREATE INDEX idx_aquarium_nfts_owner ON aquarium_nfts(owner_address);
CREATE INDEX idx_decorations_owner ON decorations(owner_address);
CREATE INDEX idx_decorations_aquarium ON decorations(aquarium_id);

-- Create foreign key constraints
ALTER TABLE fish_states 
ADD CONSTRAINT fk_fish_states_parent1 
FOREIGN KEY (parent1_id) REFERENCES fish_nfts(fish_id) ON DELETE SET NULL;

ALTER TABLE fish_states 
ADD CONSTRAINT fk_fish_states_parent2 
FOREIGN KEY (parent2_id) REFERENCES fish_nfts(fish_id) ON DELETE SET NULL;

ALTER TABLE fish_nfts 
ADD CONSTRAINT fk_fish_nfts_parent1 
FOREIGN KEY (parent1_id) REFERENCES fish_nfts(fish_id) ON DELETE SET NULL;

ALTER TABLE fish_nfts 
ADD CONSTRAINT fk_fish_nfts_parent2 
FOREIGN KEY (parent2_id) REFERENCES fish_nfts(fish_id) ON DELETE SET NULL;

ALTER TABLE decorations 
ADD CONSTRAINT fk_decorations_aquarium 
FOREIGN KEY (aquarium_id) REFERENCES aquarium_nfts(aquarium_id) ON DELETE CASCADE;

-- Enable Row Level Security (RLS)
ALTER TABLE fish_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE aquarium_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE minigame_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish_nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE aquarium_nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Fish states policies
CREATE POLICY "Users can view their own fish states" ON fish_states
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = owner_address);

CREATE POLICY "Users can update their own fish states" ON fish_states
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = owner_address);

CREATE POLICY "Users can insert their own fish states" ON fish_states
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = owner_address);

-- Aquarium states policies
CREATE POLICY "Users can view their own aquarium states" ON aquarium_states
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = owner_address);

CREATE POLICY "Users can update their own aquarium states" ON aquarium_states
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = owner_address);

CREATE POLICY "Users can insert their own aquarium states" ON aquarium_states
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = owner_address);

-- Player preferences policies
CREATE POLICY "Users can view their own preferences" ON player_preferences
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = wallet_address);

CREATE POLICY "Users can update their own preferences" ON player_preferences
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = wallet_address);

CREATE POLICY "Users can insert their own preferences" ON player_preferences
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = wallet_address);

-- Minigame sessions policies
CREATE POLICY "Users can view their own game sessions" ON minigame_sessions
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = player_wallet);

CREATE POLICY "Users can insert their own game sessions" ON minigame_sessions
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = player_wallet);

CREATE POLICY "Users can update their own game sessions" ON minigame_sessions
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = player_wallet);

-- Fish NFTs policies
CREATE POLICY "Users can view their own fish NFTs" ON fish_nfts
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = owner_address);

-- Aquarium NFTs policies
CREATE POLICY "Users can view their own aquarium NFTs" ON aquarium_nfts
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = owner_address);

-- Decorations policies
CREATE POLICY "Users can view their own decorations" ON decorations
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = owner_address);

CREATE POLICY "Users can update their own decorations" ON decorations
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = owner_address);

-- Players policies
CREATE POLICY "Users can view their own player data" ON players
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = wallet_address);

CREATE POLICY "Users can update their own player data" ON players
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = wallet_address);

CREATE POLICY "Users can insert their own player data" ON players
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = wallet_address);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_fish_states_last_updated
  BEFORE UPDATE ON fish_states
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();

CREATE TRIGGER update_aquarium_states_last_updated
  BEFORE UPDATE ON aquarium_states
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();

CREATE TRIGGER update_player_preferences_updated_at
  BEFORE UPDATE ON player_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();

-- Enable real-time for tables
ALTER PUBLICATION supabase_realtime ADD TABLE fish_states;
ALTER PUBLICATION supabase_realtime ADD TABLE aquarium_states;
ALTER PUBLICATION supabase_realtime ADD TABLE minigame_sessions;

-- Create views for common queries
CREATE VIEW player_fish_collection AS
SELECT 
  fs.*,
  fn.species as nft_species,
  fn.color as nft_color,
  fn.pattern as nft_pattern,
  fn.generation as nft_generation
FROM fish_states fs
LEFT JOIN fish_nfts fn ON fs.fish_id = fn.fish_id
WHERE fs.owner_address = auth.jwt() ->> 'wallet_address';

CREATE VIEW player_aquarium_collection AS
SELECT 
  aqs.*,
  an.aquarium_type,
  an.max_capacity as nft_max_capacity
FROM aquarium_states aqs
LEFT JOIN aquarium_nfts an ON aqs.aquarium_id = an.aquarium_id
WHERE aqs.owner_address = auth.jwt() ->> 'wallet_address';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
