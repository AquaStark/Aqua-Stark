-- Migration: Species Catalog System
-- Description: Create species catalog table for centralized species data
-- Created: 2025-10-18
-- Author: Aqua Stark Team

-- Create species catalog table (single source of truth)
CREATE TABLE IF NOT EXISTS species_catalog (
  species_name TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rarity TEXT DEFAULT 'Common' CHECK (rarity IN ('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary')),
  description TEXT,
  base_stats JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add species reference to fish_states
ALTER TABLE fish_states 
ADD COLUMN IF NOT EXISTS species TEXT REFERENCES species_catalog(species_name),
ADD COLUMN IF NOT EXISTS on_chain_id TEXT;

-- Add on-chain ID to aquarium_states
ALTER TABLE aquarium_states 
ADD COLUMN IF NOT EXISTS on_chain_id TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fish_states_species ON fish_states(species);
CREATE INDEX IF NOT EXISTS idx_fish_states_on_chain_id ON fish_states(on_chain_id);
CREATE INDEX IF NOT EXISTS idx_aquarium_states_on_chain_id ON aquarium_states(on_chain_id);
CREATE INDEX IF NOT EXISTS idx_species_catalog_rarity ON species_catalog(rarity);

-- Clear old species (safe for re-runs)
DELETE FROM species_catalog;

-- Insert species catalog (TEMPORARY - replace when final species are ready)
INSERT INTO species_catalog (species_name, display_name, image_url, rarity, description, base_stats) VALUES
('AngelFish', 'Angel Fish', '/fish/fish1.png', 'Common', 'A calm and elegant fish.', '{"health": 100, "growth_rate": 5, "appetite": 3}'),
('GoldFish', 'Gold Fish', '/fish/fish2.png', 'Common', 'A vibrant golden fish.', '{"health": 100, "growth_rate": 4, "appetite": 4}'),
('Betta', 'Betta Fish', '/fish/fish3.png', 'Uncommon', 'A colorful fighting fish.', '{"health": 120, "growth_rate": 3, "appetite": 2}'),
('NeonTetra', 'Neon Tetra', '/fish/fish4.png', 'Common', 'A bright neon fish.', '{"health": 80, "growth_rate": 2, "appetite": 3}'),
('Corydoras', 'Corydoras', '/fish/fish5.png', 'Uncommon', 'A bottom-dwelling fish.', '{"health": 110, "growth_rate": 4, "appetite": 3}'),
('Hybrid', 'Hybrid Fish', '/fish/fish6.png', 'Rare', 'A unique hybrid fish.', '{"health": 130, "growth_rate": 3, "appetite": 4}');

-- Add trigger for last_updated
CREATE TRIGGER update_species_catalog_last_updated 
  BEFORE UPDATE ON species_catalog 
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();

-- Comments
COMMENT ON TABLE species_catalog IS 'Catalog of all fish species - single source of truth';
COMMENT ON COLUMN species_catalog.species_name IS 'Primary key matching on-chain enum values';
COMMENT ON COLUMN species_catalog.base_stats IS 'JSON with species stats (health, growth_rate, appetite)';
COMMENT ON COLUMN fish_states.species IS 'FK to species_catalog - image comes from catalog';
COMMENT ON COLUMN fish_states.on_chain_id IS 'Reference to on-chain fish ID';
COMMENT ON COLUMN aquarium_states.on_chain_id IS 'Reference to on-chain aquarium ID';

