-- Migration: store_items_seeds
-- Description: Seed data for store items (fish, decorations, food)
-- Created: 2025-01-XX
-- Author: Aqua Stark Team

-- Insert fish items
INSERT INTO store_items (name, description, price, type, stock, image_url) VALUES
-- Common Fish
('Goldfish', 'A classic golden fish that brings joy to any aquarium. Perfect for beginners!', 15.99, 'fish', 50, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/goldfish.webp'),
('Neon Tetra', 'Bright and colorful, these small fish add vibrant energy to your tank.', 8.99, 'fish', 30, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/neon-tetra.webp'),
('Betta Fish', 'Beautiful and elegant with flowing fins. Known for their striking colors.', 12.99, 'fish', 25, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/betta.webp'),
('Clownfish', 'Made famous by movies, these orange and white fish are always popular.', 24.99, 'fish', 20, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/clownfish.webp'),
('Angelfish', 'Graceful and majestic, these fish are the royalty of any aquarium.', 18.99, 'fish', 15, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/angelfish.webp'),
('Coralyth', 'A vibrant coral-colored fish that brings tropical beauty to your tank.', 22.99, 'fish', 18, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/coralyth.webp'),
('Cyantris', 'A stunning cyan-colored fish with mesmerizing patterns.', 19.99, 'fish', 16, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/cyantris.webp'),
('Aquamarine', 'A beautiful aquamarine fish that glows like a precious gem.', 27.99, 'fish', 12, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/aquamarine.webp'),
('Turquoise', 'A magnificent turquoise fish with flowing fins and elegant movements.', 31.99, 'fish', 10, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/turquoise.webp'),
('Emerald', 'A rare emerald fish that shimmers with green brilliance.', 35.99, 'fish', 8, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/emerald.webp'),
('Sapphire', 'A legendary sapphire fish with deep blue scales that catch the light.', 49.99, 'fish', 5, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/sapphire.webp'),

-- Decorations
('Coral Reef', 'A beautiful coral formation that provides hiding spots for your fish.', 25.99, 'decoration', 20, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/decorations/coral-reef.png'),
('Ancient Treasure Chest', 'A mysterious chest that might contain hidden treasures for your fish.', 35.99, 'decoration', 15, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/decorations/treasure-chest.png'),
('Underwater Castle', 'A majestic castle fit for the king of the aquarium.', 45.99, 'decoration', 10, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/decorations/underwater-castle.png'),
('Seaweed Forest', 'Natural-looking seaweed that provides a natural habitat feel.', 15.99, 'decoration', 30, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/decorations/seaweed-forest.png'),
('Bubble Generator', 'Creates beautiful bubbles that entertain your fish and visitors.', 22.99, 'decoration', 25, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/decorations/bubble-generator.png'),
('Glowing Anemone', 'A bioluminescent anemone that glows softly in the dark.', 38.99, 'decoration', 12, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/decorations/glowing-anemone.png'),
('Pirate Ship Wreck', 'An ancient shipwreck that tells stories of the deep sea.', 55.99, 'decoration', 8, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/decorations/pirate-ship.png'),
('Crystal Cave', 'A magical cave made of pure crystal that sparkles beautifully.', 42.99, 'decoration', 6, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/decorations/crystal-cave.png'),

-- Food Items
('Basic Fish Food', 'Nutritious pellets that keep your fish healthy and happy.', 5.99, 'food', 100, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/food/basic-food.png'),
('Premium Fish Food', 'High-quality food with extra nutrients for optimal fish health.', 9.99, 'food', 75, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/food/premium-food.png'),
('Special Treats', 'Delicious treats that make your fish extra happy and increase their mood.', 7.99, 'food', 50, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/food/special-treats.png'),
('Growth Formula', 'Special formula that helps young fish grow faster and stronger.', 12.99, 'food', 40, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/food/growth-formula.png'),
('Color Enhancer', 'Food that brings out the natural colors of your fish.', 11.99, 'food', 35, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/food/color-enhancer.png'),
('Health Boost', 'Medicinal food that helps sick fish recover faster.', 15.99, 'food', 25, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/food/health-boost.png'),

-- Other Items
('Aquarium Cleaner', 'Keeps your aquarium clean and your fish healthy.', 8.99, 'other', 60, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/other/aquarium-cleaner.png'),
('Water Conditioner', 'Improves water quality and creates the perfect environment.', 6.99, 'other', 80, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/other/water-conditioner.png'),
('Temperature Controller', 'Maintains optimal water temperature for your fish.', 19.99, 'other', 20, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/other/temperature-controller.png'),
('LED Lighting System', 'Energy-efficient lighting that makes your aquarium glow.', 29.99, 'other', 15, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/other/led-lighting.png'),
('Filter System', 'Advanced filtration system for crystal clear water.', 39.99, 'other', 12, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/other/filter-system.png'),
('Aquarium Heater', 'Maintains consistent water temperature year-round.', 24.99, 'other', 18, 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/other/aquarium-heater.png');
