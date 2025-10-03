-- Update fish image URLs to use the correct file names from Supabase Storage
-- Based on the actual files: coralyth.webp, cyantris.webp, discarion.webp, fynthera.webp, glauven.webp, lumarid.webp, noctylen.webp, pyrrhanis.webp, rosythea.webp, scaloryn.webp, stelarae.webp

UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/glauven.webp' WHERE name = 'Goldfish';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/lumarid.webp' WHERE name = 'Neon Tetra';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/rosythea.webp' WHERE name = 'Betta Fish';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/coralyth.webp' WHERE name = 'Clownfish';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/cyantris.webp' WHERE name = 'Angelfish';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/discarion.webp' WHERE name = 'Coralyth';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/fynthera.webp' WHERE name = 'Cyantris';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/noctylen.webp' WHERE name = 'Aquamarine';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/pyrrhanis.webp' WHERE name = 'Turquoise';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/scaloryn.webp' WHERE name = 'Emerald';
UPDATE store_items SET image_url = 'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/stelarae.webp' WHERE name = 'Sapphire';
