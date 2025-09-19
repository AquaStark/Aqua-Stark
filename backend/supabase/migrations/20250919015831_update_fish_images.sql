-- Migration: update_fish_images
-- Description: Update fish images to use .webp format and add new fish
-- Created: 2025-01-XX
-- Author: Aqua Stark Team

-- First, delete existing fish items to replace them with updated ones
DELETE FROM store_items WHERE type = 'fish';

-- Insert updated fish items with .webp images and new fish
INSERT INTO store_items (name, description, price, type, stock, image_url) VALUES
-- Common Fish
('Goldfish', 'A classic golden fish that brings joy to any aquarium. Perfect for beginners!', 15.99, 'fish', 50, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/goldfish.webp'),
('Neon Tetra', 'Bright and colorful, these small fish add vibrant energy to your tank.', 8.99, 'fish', 30, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/neon-tetra.webp'),
('Betta Fish', 'Beautiful and elegant with flowing fins. Known for their striking colors.', 12.99, 'fish', 25, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/betta.webp'),
('Clownfish', 'Made famous by movies, these orange and white fish are always popular.', 24.99, 'fish', 20, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/clownfish.webp'),
('Angelfish', 'Graceful and majestic, these fish are the royalty of any aquarium.', 18.99, 'fish', 15, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/angelfish.webp'),

-- New Fish from your images
('Coralyth', 'A vibrant coral-colored fish that brings tropical beauty to your tank.', 22.99, 'fish', 18, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/coralyth.webp'),
('Cyantris', 'A stunning cyan-colored fish with mesmerizing patterns.', 19.99, 'fish', 16, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/cyantris.webp'),
('Aquamarine', 'A beautiful aquamarine fish that glows like a precious gem.', 27.99, 'fish', 12, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/aquamarine.webp'),
('Turquoise', 'A magnificent turquoise fish with flowing fins and elegant movements.', 31.99, 'fish', 10, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/turquoise.webp'),
('Emerald', 'A rare emerald fish that shimmers with green brilliance.', 35.99, 'fish', 8, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/emerald.webp'),
('Sapphire', 'A legendary sapphire fish with deep blue scales that catch the light.', 49.99, 'fish', 5, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/sapphire.webp');
