-- Migration: 004_insert_mock_data.sql
-- Description: Insert mock data for testing the dirt system and other features
-- Created: 2025-01-15
-- Author: Aqua Stark Team

-- Insert mock players
INSERT INTO players (
  player_id, 
  wallet_address, 
  username, 
  level, 
  experience_current, 
  experience_total, 
  currency, 
  play_time_minutes, 
  fish_collected, 
  total_fish, 
  special_fish, 
  achievements_completed, 
  fish_fed_count, 
  decorations_placed, 
  fish_bred_count, 
  aquariums_created, 
  last_login, 
  created_at
) VALUES 
(
  'demo-player',
  '0x1234567890abcdef1234567890abcdef12345678',
  'DemoPlayer',
  5,
  250,
  1250,
  500,
  120,
  8,
  12,
  2,
  3,
  45,
  6,
  1,
  2,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '7 days'
),
(
  'test-player-1',
  '0xabcdef1234567890abcdef1234567890abcdef12',
  'TestPlayer1',
  3,
  150,
  750,
  300,
  80,
  5,
  8,
  1,
  2,
  30,
  4,
  0,
  1,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '5 days'
),
(
  'test-player-2',
  '0x9876543210fedcba9876543210fedcba98765432',
  'TestPlayer2',
  7,
  400,
  2000,
  800,
  200,
  15,
  20,
  3,
  5,
  80,
  10,
  2,
  3,
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '10 days'
);

-- Insert mock aquarium states with dirt system data
INSERT INTO aquarium_states (
  aquarium_id,
  player_id,
  water_temperature,
  lighting_level,
  pollution_level,
  background_music_playing,
  last_cleaned_timestamp,
  current_theme_id,
  last_cleaning_time,
  dirt_level,
  partial_dirt_level,
  cleaning_streak,
  total_cleanings,
  dirt_config,
  created_at,
  last_updated
) VALUES 
(
  '1',
  'demo-player',
  25.5,
  60,
  0.1,
  true,
  NOW() - INTERVAL '2 hours',
  'ocean-theme',
  NOW() - INTERVAL '15 seconds', -- Recently cleaned for testing
  0.0,
  0.0,
  3,
  12,
  '{
    "grace_period_hours": 10,
    "dirt_multiplier": 30,
    "max_dirt_level": 95,
    "log_base": 10,
    "cleaning_threshold": 10
  }'::jsonb,
  NOW() - INTERVAL '7 days',
  NOW()
),
(
  '2',
  'demo-player',
  24.0,
  45,
  0.3,
  false,
  NOW() - INTERVAL '1 day',
  'coral-theme',
  NOW() - INTERVAL '30 seconds', -- Some dirt should appear soon
  5.0,
  2.5,
  1,
  5,
  '{
    "grace_period_hours": 10,
    "dirt_multiplier": 30,
    "max_dirt_level": 95,
    "log_base": 10,
    "cleaning_threshold": 10
  }'::jsonb,
  NOW() - INTERVAL '5 days',
  NOW()
),
(
  '3',
  'test-player-1',
  26.0,
  70,
  0.2,
  true,
  NOW() - INTERVAL '3 hours',
  'tropical-theme',
  NOW() - INTERVAL '20 seconds', -- Clean aquarium
  0.0,
  0.0,
  2,
  8,
  '{
    "grace_period_hours": 10,
    "dirt_multiplier": 30,
    "max_dirt_level": 95,
    "log_base": 10,
    "cleaning_threshold": 10
  }'::jsonb,
  NOW() - INTERVAL '3 days',
  NOW()
),
(
  '4',
  'test-player-2',
  25.0,
  55,
  0.4,
  false,
  NOW() - INTERVAL '2 days',
  'deep-sea-theme',
  NOW() - INTERVAL '45 seconds', -- Dirty aquarium
  25.0,
  15.0,
  0,
  2,
  '{
    "grace_period_hours": 10,
    "dirt_multiplier": 30,
    "max_dirt_level": 95,
    "log_base": 10,
    "cleaning_threshold": 10
  }'::jsonb,
  NOW() - INTERVAL '8 days',
  NOW()
),
(
  '5',
  'test-player-2',
  27.0,
  80,
  0.1,
  true,
  NOW() - INTERVAL '1 hour',
  'arctic-theme',
  NOW() - INTERVAL '35 seconds', -- Moderately dirty
  12.0,
  8.0,
  1,
  6,
  '{
    "grace_period_hours": 10,
    "dirt_multiplier": 30,
    "max_dirt_level": 95,
    "log_base": 10,
    "cleaning_threshold": 10
  }'::jsonb,
  NOW() - INTERVAL '6 days',
  NOW()
);

-- Insert mock fish states
INSERT INTO fish_states (
  fish_id,
  player_id,
  happiness_level,
  hunger_level,
  health,
  mood,
  last_fed_timestamp,
  last_played_timestamp,
  last_interaction_timestamp,
  activity_streak,
  experience_points,
  created_at,
  last_updated
) VALUES 
(
  'fish-1',
  'demo-player',
  85,
  70,
  95,
  'happy',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '30 minutes',
  5,
  150,
  NOW() - INTERVAL '7 days',
  NOW()
),
(
  'fish-2',
  'demo-player',
  60,
  40,
  80,
  'hungry',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '1 hour',
  2,
  100,
  NOW() - INTERVAL '5 days',
  NOW()
),
(
  'fish-3',
  'test-player-1',
  90,
  85,
  100,
  'excited',
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '15 minutes',
  7,
  200,
  NOW() - INTERVAL '3 days',
  NOW()
),
(
  'fish-4',
  'test-player-2',
  45,
  20,
  70,
  'sad',
  NOW() - INTERVAL '8 hours',
  NOW() - INTERVAL '5 hours',
  NOW() - INTERVAL '2 hours',
  0,
  50,
  NOW() - INTERVAL '8 days',
  NOW()
),
(
  'fish-5',
  'test-player-2',
  75,
  60,
  85,
  'playful',
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '45 minutes',
  3,
  120,
  NOW() - INTERVAL '6 days',
  NOW()
);

-- Insert mock decoration states
INSERT INTO decoration_states (
  decoration_id,
  player_id,
  aquarium_id,
  position_x,
  position_y,
  rotation_degrees,
  is_visible,
  created_at,
  last_updated
) VALUES 
(
  'decoration-1',
  'demo-player',
  '1',
  100.0,
  150.0,
  0,
  true,
  NOW() - INTERVAL '7 days',
  NOW()
),
(
  'decoration-2',
  'demo-player',
  '1',
  200.0,
  100.0,
  45,
  true,
  NOW() - INTERVAL '6 days',
  NOW()
),
(
  'decoration-3',
  'demo-player',
  '2',
  150.0,
  200.0,
  90,
  true,
  NOW() - INTERVAL '5 days',
  NOW()
),
(
  'decoration-4',
  'test-player-1',
  '3',
  80.0,
  120.0,
  30,
  true,
  NOW() - INTERVAL '3 days',
  NOW()
),
(
  'decoration-5',
  'test-player-2',
  '4',
  250.0,
  180.0,
  60,
  true,
  NOW() - INTERVAL '8 days',
  NOW()
);

-- Insert mock player preferences
INSERT INTO player_preferences (
  player_id,
  sound_enabled,
  animations_enabled,
  notifications_enabled,
  preferred_language,
  ui_theme,
  auto_feed_enabled,
  tutorial_completed_steps,
  created_at,
  last_updated
) VALUES 
(
  'demo-player',
  true,
  true,
  true,
  'en',
  'light',
  false,
  '{"welcome", "first_fish", "first_aquarium"}',
  NOW() - INTERVAL '7 days',
  NOW()
),
(
  'test-player-1',
  true,
  true,
  true,
  'en',
  'dark',
  true,
  '{"welcome", "first_fish", "first_aquarium", "feeding", "decorations"}',
  NOW() - INTERVAL '5 days',
  NOW()
),
(
  'test-player-2',
  false,
  true,
  false,
  'es',
  'auto',
  true,
  '{"welcome", "first_fish", "first_aquarium", "feeding", "decorations", "minigames"}',
  NOW() - INTERVAL '10 days',
  NOW()
);

-- Insert mock minigame sessions
INSERT INTO minigame_sessions (
  session_id,
  player_id,
  game_type,
  score,
  duration,
  xp_earned,
  synced_to_chain,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'demo-player',
  'flappy_fish',
  1500,
  120,
  50,
  false,
  NOW() - INTERVAL '2 hours'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'demo-player',
  'bubble_pop',
  800,
  90,
  30,
  false,
  NOW() - INTERVAL '1 hour'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'test-player-1',
  'fish_race',
  2000,
  180,
  75,
  true,
  NOW() - INTERVAL '30 minutes'
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'test-player-2',
  'treasure_hunt',
  1200,
  150,
  45,
  false,
  NOW() - INTERVAL '3 hours'
);

-- Insert mock game analytics
INSERT INTO game_analytics (
  player_id,
  fish_id,
  metric_name,
  metric_value,
  date,
  created_at
) VALUES 
(
  'demo-player',
  'fish-1',
  'daily_interactions',
  15,
  CURRENT_DATE,
  NOW()
),
(
  'demo-player',
  'fish-2',
  'feeding_count',
  8,
  CURRENT_DATE,
  NOW()
),
(
  'demo-player',
  NULL,
  'decorations_placed',
  2,
  CURRENT_DATE,
  NOW()
),
(
  'demo-player',
  NULL,
  'minigames_played',
  3,
  CURRENT_DATE,
  NOW()
),
(
  'test-player-1',
  'fish-3',
  'daily_interactions',
  12,
  CURRENT_DATE,
  NOW()
),
(
  'test-player-1',
  'fish-3',
  'feeding_count',
  5,
  CURRENT_DATE,
  NOW()
),
(
  'test-player-2',
  'fish-4',
  'daily_interactions',
  8,
  CURRENT_DATE,
  NOW()
),
(
  'test-player-2',
  'fish-5',
  'feeding_count',
  15,
  CURRENT_DATE,
  NOW()
);

-- Update the view to include the new dirt system data
DROP VIEW IF EXISTS aquarium_with_states;
CREATE VIEW aquarium_with_states AS
SELECT 
  aq.aquarium_id,
  aq.player_id,
  aq.water_temperature,
  aq.lighting_level,
  aq.pollution_level,
  aq.background_music_playing,
  aq.last_cleaned_timestamp,
  aq.current_theme_id,
  aq.last_cleaning_time,
  aq.dirt_level,
  aq.partial_dirt_level,
  aq.cleaning_streak,
  aq.total_cleanings,
  aq.dirt_config,
  aq.created_at,
  aq.last_updated,
  -- Calculate hours since cleaning (in seconds for testing)
  EXTRACT(EPOCH FROM (NOW() - aq.last_cleaning_time)) / 3600.0 AS hours_since_cleaning,
  -- Calculate current dirt level using the function
  calculate_dirt_level(aq.last_cleaning_time, aq.dirt_config) AS calculated_dirt_level,
  -- Get cleanliness status
  CASE 
    WHEN calculate_dirt_level(aq.last_cleaning_time, aq.dirt_config) <= 10 THEN 'clean'
    WHEN calculate_dirt_level(aq.last_cleaning_time, aq.dirt_config) <= 30 THEN 'slightly_dirty'
    WHEN calculate_dirt_level(aq.last_cleaning_time, aq.dirt_config) <= 60 THEN 'dirty'
    WHEN calculate_dirt_level(aq.last_cleaning_time, aq.dirt_config) <= 80 THEN 'very_dirty'
    ELSE 'extremely_dirty'
  END AS cleanliness_status,
  -- Get needs cleaning flag
  calculate_dirt_level(aq.last_cleaning_time, aq.dirt_config) > 30 AS needs_cleaning
FROM aquarium_states aq;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_wallet_address ON players(wallet_address);
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_fish_states_player_id ON fish_states(player_id);
CREATE INDEX IF NOT EXISTS idx_fish_states_mood ON fish_states(mood);
CREATE INDEX IF NOT EXISTS idx_decoration_states_aquarium_id ON decoration_states(aquarium_id);
CREATE INDEX IF NOT EXISTS idx_minigame_sessions_player_id ON minigame_sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_minigame_sessions_game_type ON minigame_sessions(game_type);
CREATE INDEX IF NOT EXISTS idx_game_analytics_player_date ON game_analytics(player_id, date);

-- Add some comments for documentation
COMMENT ON TABLE players IS 'Off-chain dynamic data for on-chain players';
COMMENT ON TABLE fish_states IS 'Dynamic states for fish NFTs including happiness, hunger, and health';
COMMENT ON TABLE aquarium_states IS 'Dynamic states for aquarium NFTs including dirt system and environmental conditions';
COMMENT ON TABLE decoration_states IS 'Dynamic states for decoration NFTs including position and visibility';
COMMENT ON TABLE player_preferences IS 'User preferences and settings';
COMMENT ON TABLE minigame_sessions IS 'Records of minigame sessions and scores';
COMMENT ON TABLE game_analytics IS 'Daily aggregated analytics data';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Mock data inserted successfully!';
  RAISE NOTICE 'Players: 3';
  RAISE NOTICE 'Aquariums: 5 (with dirt system data)';
  RAISE NOTICE 'Fish: 5';
  RAISE NOTICE 'Decorations: 5';
  RAISE NOTICE 'Preferences: 3';
  RAISE NOTICE 'Minigame sessions: 4';
  RAISE NOTICE 'Analytics records: 4';
  RAISE NOTICE 'Ready for testing!';
END $$;
