import { z } from 'zod';

export const fishIdSchema = z.string().min(1, 'fishId is required');
export const playerIdSchema = z.string().min(1, 'playerId is required');
export const happinessSchema = z.number().min(0).max(100);
export const foodTypeSchema = z.enum(['basic', 'premium']);
