import { z } from 'zod';

export const fishIdSchema = z.string().min(1, 'fishId is required');
export const playerIdSchema = z.string().min(1, 'playerId is required');
export const happinessSchema = z.number().min(0).max(100);
export const foodTypeSchema = z.enum(['basic', 'premium']);

// Shop Input validation
export const shopItemSchema = z.object({
  item_id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['food', 'decoration', 'aquarium_upgrade', 'special']),
  subcategory: z.string().max(50).optional(),
  price: z.number().positive(),
  currency_type: z.enum(['coins', 'gems']).default('coins'),
  stock_quantity: z.number().int().min(-1).default(-1),
  is_limited_time: z.boolean().default(false),
  is_active: z.boolean().default(true),
  available_until: z.union([z.string().datetime(), z.null()]).optional(),
  image_url: z.string().url().optional(),
  sort_order: z.number().int().default(0),
});

export const purchaseSchema = z.object({
  player_wallet: z.string().min(1),
  item_id: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  use_gems: z.boolean().default(false),
});
