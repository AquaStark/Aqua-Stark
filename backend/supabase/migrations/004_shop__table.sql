-- Simplified Shop System Database Schema for Aqua Stark
-- Execute this in your Supabase SQL editor

-- Create shop item categories enum
CREATE TYPE shop_category AS ENUM ('food', 'decoration', 'aquarium_upgrade', 'special');
CREATE TYPE currency_type AS ENUM ('coins', 'gems');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Shop items table
CREATE TABLE shop_items (
    item_id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category shop_category NOT NULL,
    subcategory VARCHAR(50),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    currency_type currency_type NOT NULL DEFAULT 'coins',
    stock_quantity INTEGER NOT NULL DEFAULT -1 CHECK (stock_quantity >= -1), -- -1 for unlimited
    is_limited_time BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    available_until TIMESTAMP WITH TIME ZONE,
    requirements JSONB DEFAULT '{"min_level": 1, "required_items": []}',
    effects JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop transactions table
CREATE TABLE shop_transactions (
    transaction_id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    player_wallet TEXT NOT NULL,
    item_id TEXT NOT NULL REFERENCES shop_items(item_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
    total_cost DECIMAL(10,2) NOT NULL CHECK (total_cost > 0),
    currency_type currency_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX idx_shop_items_category ON shop_items(category);
CREATE INDEX idx_shop_items_active ON shop_items(is_active);
CREATE INDEX idx_shop_items_limited ON shop_items(is_limited_time, available_until);
CREATE INDEX idx_shop_items_price ON shop_items(price);
CREATE INDEX idx_shop_transactions_player ON shop_transactions(player_wallet);
CREATE INDEX idx_shop_transactions_status ON shop_transactions(status);
CREATE INDEX idx_shop_transactions_date ON shop_transactions(transaction_date);

-- Enable Row Level Security
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shop_items (public read, admin write)
CREATE POLICY "Anyone can view active shop items" ON shop_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can insert shop items" ON shop_items
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can update shop items" ON shop_items
    FOR UPDATE TO public USING (true);

-- RLS Policies for shop_transactions
CREATE POLICY "Users can view their own transactions" ON shop_transactions
    FOR SELECT USING (auth.jwt() ->> 'wallet_address' = player_wallet);

CREATE POLICY "Users can insert their own transactions" ON shop_transactions
    FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = player_wallet);

-- Stored procedure for processing purchases atomically
CREATE OR REPLACE FUNCTION process_shop_purchase(
    p_player_wallet TEXT,
    p_item_id TEXT,
    p_quantity INTEGER,
    p_total_cost DECIMAL,
    p_currency_type TEXT
)
RETURNS TABLE(transaction_id TEXT, success BOOLEAN, message TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_transaction_id TEXT;
    v_current_balance INTEGER;
    v_new_balance INTEGER;
    v_item_stock INTEGER;
BEGIN
    -- Generate transaction ID
    v_transaction_id := gen_random_uuid();
    
    -- Start transaction
    BEGIN
        -- Lock player row for update
        IF p_currency_type = 'gems' THEN
            SELECT gems INTO v_current_balance 
            FROM players 
            WHERE wallet_address = p_player_wallet 
            FOR UPDATE;
        ELSE
            SELECT coins INTO v_current_balance 
            FROM players 
            WHERE wallet_address = p_player_wallet 
            FOR UPDATE;
        END IF;
        
        -- Check if player exists
        IF v_current_balance IS NULL THEN
            RETURN QUERY SELECT v_transaction_id, FALSE, 'Player not found';
            RETURN;
        END IF;
        
        -- Check sufficient balance
        IF v_current_balance < p_total_cost THEN
            RETURN QUERY SELECT v_transaction_id, FALSE, 'Insufficient balance';
            RETURN;
        END IF;
        
        -- Lock and check item stock
        SELECT stock_quantity INTO v_item_stock
        FROM shop_items 
        WHERE item_id = p_item_id AND is_active = true
        FOR UPDATE;
        
        IF v_item_stock IS NULL THEN
            RETURN QUERY SELECT v_transaction_id, FALSE, 'Item not found or inactive';
            RETURN;
        END IF;
        
        -- Check stock availability (skip if unlimited stock = -1)
        IF v_item_stock != -1 AND v_item_stock < p_quantity THEN
            RETURN QUERY SELECT v_transaction_id, FALSE, 'Insufficient stock';
            RETURN;
        END IF;
        
        -- Calculate new balance
        v_new_balance := v_current_balance - p_total_cost::INTEGER;
        
        -- Update player currency
        IF p_currency_type = 'gems' THEN
            UPDATE players SET gems = v_new_balance WHERE wallet_address = p_player_wallet;
        ELSE
            UPDATE players SET coins = v_new_balance WHERE wallet_address = p_player_wallet;
        END IF;
        
        -- Update item stock (only if not unlimited)
        IF v_item_stock != -1 THEN
            UPDATE shop_items 
            SET stock_quantity = stock_quantity - p_quantity,
                updated_at = NOW()
            WHERE item_id = p_item_id;
        END IF;
        
        -- Insert transaction record
        INSERT INTO shop_transactions (
            transaction_id,
            player_wallet,
            item_id,
            quantity,
            unit_price,
            total_cost,
            currency_type,
            status,
            completed_at
        ) VALUES (
            v_transaction_id,
            p_player_wallet,
            p_item_id,
            p_quantity,
            p_total_cost / p_quantity,
            p_total_cost,
            p_currency_type::currency_type,
            'completed',
            NOW()
        );
        
        RETURN QUERY SELECT v_transaction_id, TRUE, 'Purchase successful';
        
    EXCEPTION WHEN OTHERS THEN
        -- Insert failed transaction record
        INSERT INTO shop_transactions (
            transaction_id,
            player_wallet,
            item_id,
            quantity,
            unit_price,
            total_cost,
            currency_type,
            status,
            metadata
        ) VALUES (
            v_transaction_id,
            p_player_wallet,
            p_item_id,
            p_quantity,
            p_total_cost / p_quantity,
            p_total_cost,
            p_currency_type::currency_type,
            'failed',
            jsonb_build_object('error', SQLERRM)
        );
        
        RETURN QUERY SELECT v_transaction_id, FALSE, SQLERRM;
    END;
END;
$$;

-- Insert sample shop items
INSERT INTO shop_items (item_id, name, description, category, price, currency_type, effects, metadata) VALUES
('basic_fish_food', 'Basic Fish Food', 'Standard fish food that restores hunger', 'food', 10, 'coins', 
 '{"hunger_restore": 30}', '{"icon": "fish-food-basic"}'),
 
('premium_fish_food', 'Premium Fish Food', 'High-quality food that restores hunger and boosts happiness', 'food', 25, 'coins', 
 '{"hunger_restore": 50, "happiness_boost": 15}', '{"icon": "fish-food-premium"}'),
 
('super_fish_food', 'Super Fish Food', 'Ultimate fish food with maximum benefits', 'food', 50, 'gems', 
 '{"hunger_restore": 100, "happiness_boost": 30, "health_boost": 10}', '{"icon": "fish-food-super", "rarity": "epic"}'),
 
('coral_decoration', 'Coral Decoration', 'Beautiful coral that enhances aquarium aesthetics', 'decoration', 100, 'coins', 
 '{"happiness_boost": 5}', '{"icon": "coral", "size": "medium"}'),
 
('treasure_chest', 'Treasure Chest', 'Mysterious chest decoration that fish love', 'decoration', 200, 'coins', 
 '{"happiness_boost": 10}', '{"icon": "treasure-chest", "size": "large"}'),
 
('aquarium_filter_upgrade', 'Advanced Filter System', 'Reduces pollution and maintains water quality', 'aquarium_upgrade', 500, 'coins', 
 '{"pollution_reduction": 25}', '{"icon": "filter", "permanent": true}'),
 
('bubble_maker', 'Bubble Maker', 'Creates soothing bubbles for fish entertainment', 'decoration', 150, 'coins', 
 '{"happiness_boost": 8}', '{"icon": "bubbles", "animated": true}');

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE shop_transactions;

-- Grant permissions
GRANT ALL ON shop_items TO anon, authenticated;
GRANT ALL ON shop_transactions TO anon, authenticated;