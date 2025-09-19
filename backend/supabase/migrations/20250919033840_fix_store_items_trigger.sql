-- Fix store_items trigger by adding last_updated column
ALTER TABLE store_items ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_store_items_last_updated ON store_items;

-- Create the trigger
CREATE TRIGGER update_store_items_last_updated
    BEFORE UPDATE ON store_items
    FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();
