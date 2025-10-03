-- Migration: 003_add_dirt_system.sql
-- Description: Add dirt/cleanliness system to aquarium_states table
-- Created: 2025-01-15
-- Author: Aqua Stark Team

-- Add dirt system fields to aquarium_states table
ALTER TABLE aquarium_states 
ADD COLUMN IF NOT EXISTS last_cleaning_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS dirt_level DECIMAL(5,2) DEFAULT 0.0 CHECK (dirt_level >= 0.0 AND dirt_level <= 100.0),
ADD COLUMN IF NOT EXISTS partial_dirt_level DECIMAL(5,2) DEFAULT 0.0 CHECK (partial_dirt_level >= 0.0 AND partial_dirt_level <= 100.0),
ADD COLUMN IF NOT EXISTS cleaning_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_cleanings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dirt_config JSONB DEFAULT '{
  "grace_period_hours": 4,
  "dirt_multiplier": 30,
  "max_dirt_level": 95,
  "log_base": 10,
  "cleaning_threshold": 10
}'::jsonb;

-- Create index for dirt system queries
CREATE INDEX IF NOT EXISTS idx_aquarium_states_last_cleaning ON aquarium_states(last_cleaning_time);
CREATE INDEX IF NOT EXISTS idx_aquarium_states_dirt_level ON aquarium_states(dirt_level);

-- Create function to calculate dirt level based on time
CREATE OR REPLACE FUNCTION calculate_dirt_level(
  last_cleaning_time TIMESTAMP WITH TIME ZONE,
  config JSONB DEFAULT '{
    "grace_period_hours": 4,
    "dirt_multiplier": 30,
    "max_dirt_level": 95,
    "log_base": 10,
    "cleaning_threshold": 10
  }'::jsonb
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  hours_since_cleaning DECIMAL(10,2);
  grace_period DECIMAL(10,2);
  dirt_multiplier DECIMAL(10,2);
  max_dirt DECIMAL(10,2);
  log_base DECIMAL(10,2);
  calculated_dirt DECIMAL(5,2);
BEGIN
  -- Extract configuration values
  grace_period := (config->>'grace_period_hours')::DECIMAL(10,2);
  dirt_multiplier := (config->>'dirt_multiplier')::DECIMAL(10,2);
  max_dirt := (config->>'max_dirt_level')::DECIMAL(10,2);
  log_base := (config->>'log_base')::DECIMAL(10,2);
  
  -- Calculate hours since last cleaning
  hours_since_cleaning := EXTRACT(EPOCH FROM (NOW() - last_cleaning_time)) / 3600.0;
  
  -- If within grace period, return 0
  IF hours_since_cleaning <= grace_period THEN
    RETURN 0.0;
  END IF;
  
  -- Calculate dirt level using logarithmic formula
  -- dirt = min(max_dirt, dirt_multiplier * log10((hours - grace_period) / 2 + 1))
  calculated_dirt := LEAST(
    max_dirt,
    dirt_multiplier * LOG(log_base, ((hours_since_cleaning - grace_period) / 2.0) + 1.0)
  );
  
  RETURN ROUND(calculated_dirt, 2);
END;
$$ LANGUAGE plpgsql;

-- Create function to update aquarium dirt level
CREATE OR REPLACE FUNCTION update_aquarium_dirt_level(aquarium_id_param TEXT)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  last_cleaning TIMESTAMP WITH TIME ZONE;
  config JSONB;
  new_dirt_level DECIMAL(5,2);
BEGIN
  -- Get current aquarium state
  SELECT last_cleaning_time, dirt_config 
  INTO last_cleaning, config
  FROM aquarium_states 
  WHERE aquarium_id = aquarium_id_param;
  
  -- If no aquarium found, return 0
  IF last_cleaning IS NULL THEN
    RETURN 0.0;
  END IF;
  
  -- Calculate new dirt level
  new_dirt_level := calculate_dirt_level(last_cleaning, config);
  
  -- Update the aquarium state
  UPDATE aquarium_states 
  SET 
    dirt_level = new_dirt_level,
    partial_dirt_level = new_dirt_level,
    last_updated = NOW()
  WHERE aquarium_id = aquarium_id_param;
  
  RETURN new_dirt_level;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean aquarium
CREATE OR REPLACE FUNCTION clean_aquarium(
  aquarium_id_param TEXT,
  cleaning_type TEXT DEFAULT 'partial' -- 'partial' or 'complete'
)
RETURNS JSONB AS $$
DECLARE
  current_dirt DECIMAL(5,2);
  current_partial DECIMAL(5,2);
  config JSONB;
  cleaning_threshold DECIMAL(5,2);
  new_dirt_level DECIMAL(5,2);
  new_partial_level DECIMAL(5,2);
  is_complete_cleaning BOOLEAN := FALSE;
  result JSONB;
BEGIN
  -- Get current aquarium state
  SELECT dirt_level, partial_dirt_level, dirt_config
  INTO current_dirt, current_partial, config
  FROM aquarium_states 
  WHERE aquarium_id = aquarium_id_param;
  
  -- If no aquarium found, return error
  IF current_dirt IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Aquarium not found'
    );
  END IF;
  
  -- Extract cleaning threshold
  cleaning_threshold := (config->>'cleaning_threshold')::DECIMAL(5,2);
  
  -- Calculate new levels based on cleaning type
  IF cleaning_type = 'complete' THEN
    new_dirt_level := 0.0;
    new_partial_level := 0.0;
    is_complete_cleaning := TRUE;
  ELSE
    -- Partial cleaning: reduce by 20-30%
    new_dirt_level := GREATEST(0.0, current_dirt - (current_dirt * 0.25));
    new_partial_level := GREATEST(0.0, current_partial - (current_partial * 0.25));
    
    -- If below threshold, consider it complete cleaning
    IF new_dirt_level <= cleaning_threshold THEN
      new_dirt_level := 0.0;
      new_partial_level := 0.0;
      is_complete_cleaning := TRUE;
    END IF;
  END IF;
  
  -- Update aquarium state
  UPDATE aquarium_states 
  SET 
    dirt_level = new_dirt_level,
    partial_dirt_level = new_partial_level,
    last_cleaning_time = CASE 
      WHEN is_complete_cleaning THEN NOW()
      ELSE last_cleaning_time
    END,
    cleaning_streak = CASE 
      WHEN is_complete_cleaning THEN cleaning_streak + 1
      ELSE cleaning_streak
    END,
    total_cleanings = total_cleanings + 1,
    last_updated = NOW()
  WHERE aquarium_id = aquarium_id_param;
  
  -- Build result
  result := jsonb_build_object(
    'success', true,
    'old_dirt_level', current_dirt,
    'new_dirt_level', new_dirt_level,
    'is_complete_cleaning', is_complete_cleaning,
    'cleaning_streak', CASE WHEN is_complete_cleaning THEN 
      (SELECT cleaning_streak FROM aquarium_states WHERE aquarium_id = aquarium_id_param)
    ELSE NULL END
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update the aquarium_with_states view to include dirt system fields
-- First drop the existing view to avoid column name conflicts
DROP VIEW IF EXISTS aquarium_with_states;

-- Recreate the view with all fields including new dirt system fields
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
  aqs.last_cleaning_time,
  aqs.dirt_level,
  aqs.partial_dirt_level,
  aqs.cleaning_streak,
  aqs.total_cleanings,
  aqs.dirt_config,
  aqs.last_updated
FROM aquarium_states aqs;

-- Add comment to document the dirt system
COMMENT ON COLUMN aquarium_states.last_cleaning_time IS 'Timestamp of last complete cleaning (used for dirt calculation)';
COMMENT ON COLUMN aquarium_states.dirt_level IS 'Current dirt level (0-100) calculated from last_cleaning_time';
COMMENT ON COLUMN aquarium_states.partial_dirt_level IS 'Current partial dirt level (0-100) for partial cleanings';
COMMENT ON COLUMN aquarium_states.cleaning_streak IS 'Number of consecutive complete cleanings';
COMMENT ON COLUMN aquarium_states.total_cleanings IS 'Total number of cleaning actions performed';
COMMENT ON COLUMN aquarium_states.dirt_config IS 'JSON configuration for dirt system parameters';
