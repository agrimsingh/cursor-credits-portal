/**
 * Codes domain models and validation schemas
 * 
 * Defines the data structure for Cursor credit codes and their validation rules.
 */

import { z } from 'zod';

/**
 * Zod schema for a Cursor credit code
 */
export const CodeSchema = z.object({
  id: z.string().min(1, 'Code ID is required'),
  code: z.string().min(1, 'Code value is required'),
  isRedeemed: z.boolean().default(false),
  projectId: z.string().min(1, 'Project ID is required'),
  createdAt: z.date(),
  redeemedAt: z.date().optional(),
  redeemedBy: z.string().optional(), // Attendee document ID
});

/**
 * TypeScript type derived from Zod schema
 */
export type Code = z.infer<typeof CodeSchema>;

/**
 * Schema for creating a new code (excludes computed fields)
 */
export const CreateCodeSchema = CodeSchema.omit({
  id: true,
  isRedeemed: true,
  createdAt: true,
  redeemedAt: true,
  redeemedBy: true,
});

export type CreateCode = z.infer<typeof CreateCodeSchema>;

/**
 * Schema for code redemption
 */
export const RedeemCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  attendeeId: z.string().min(1, 'Attendee ID is required'),
});

export type RedeemCode = z.infer<typeof RedeemCodeSchema>;

/**
 * Schema for bulk code import from CSV
 */
export const BulkCodeImportSchema = z.object({
  codes: z.array(z.string().min(1, 'Code cannot be empty')),
  projectId: z.string().min(1, 'Project ID is required'),
});

export type BulkCodeImport = z.infer<typeof BulkCodeImportSchema>;
