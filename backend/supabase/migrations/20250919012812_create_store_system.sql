-- Migration: create_store_system
-- Description: Create store system with items table and storage bucket
-- Created: 2025-01-XX
-- Author: Aqua Stark Team

-- Create ENUM for store item types
CREATE TYPE store_item_type AS ENUM (
  'fish', 'decoration', 'food', 'other'
);

-- Create store_items table
CREATE TABLE store_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  type store_item_type NOT NULL,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_store_items_type ON store_items(type);
CREATE INDEX idx_store_items_price ON store_items(price);
CREATE INDEX idx_store_items_stock ON store_items(stock);
CREATE INDEX idx_store_items_active ON store_items(is_active);
CREATE INDEX idx_store_items_created_at ON store_items(created_at);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_store_items_updated_at 
  BEFORE UPDATE ON store_items 
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();

-- Enable Row Level Security
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for store items (public read access)
CREATE POLICY "Anyone can view active store items" ON store_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage store items" ON store_items
  FOR ALL USING (true); -- Will be updated with proper admin auth

-- Enable real-time for store items
ALTER PUBLICATION supabase_realtime ADD TABLE store_items;

-- Create view for active store items
CREATE VIEW active_store_items AS
SELECT 
  id,
  name,
  description,
  price,
  type,
  stock,
  image_url,
  created_at,
  updated_at
FROM store_items 
WHERE is_active = true AND stock > 0
ORDER BY type, price;
