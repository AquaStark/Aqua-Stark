import { z } from 'zod';

export const fishIdSchema = z.string().min(1, 'fishId is required');
export const playerIdSchema = z.string().min(1, 'playerId is required');
export const happinessSchema = z.number().min(0).max(100);
export const foodTypeSchema = z.enum(['basic', 'premium']);

// Transaction Validation schema

export const TransactionSchema = z.object({
  player_wallet: z.string().min(1, 'player_wallet is required'),
  item_id: z.string().min(1, 'item_id is required'),
  quantity: z.number().int().positive('quantity must be > 0'),
  unit_price: z.number().positive('unit_price must be > 0'),
  total_cost: z.number().positive('total_cost must be > 0'),
  currency_type: z.enum(['coins', 'gems']),
  status: z
    .enum(['pending', 'completed', 'failed', 'refunded'])
    .default('pending'),
});
