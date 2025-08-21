/**
 * Attendees domain models and validation schemas
 * 
 * Defines the data structure for event attendees and their validation rules.
 */

import { z } from 'zod';

/**
 * Zod schema for an event attendee
 */
export const AttendeeSchema = z.object({
  id: z.string().min(1, 'Attendee ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Valid email is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  hasRedeemedCode: z.boolean().default(false),
  redeemedCodeId: z.string().optional(),
  createdAt: z.date(),
  redeemedAt: z.date().optional(),
});

/**
 * TypeScript type derived from Zod schema
 */
export type Attendee = z.infer<typeof AttendeeSchema>;

/**
 * Schema for creating a new attendee (excludes computed fields)
 */
export const CreateAttendeeSchema = AttendeeSchema.omit({
  id: true,
  hasRedeemedCode: true,
  redeemedCodeId: true,
  createdAt: true,
  redeemedAt: true,
});

export type CreateAttendee = z.infer<typeof CreateAttendeeSchema>;

/**
 * Schema for attendee code redemption flow
 */
export const AttendeeRedemptionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Valid email is required'),
  // Make projectId optional for backward compatibility with eventId
  projectId: z.string().optional(),
  eventId: z.string().optional(), // Legacy field for backward compatibility
});

export type AttendeeRedemption = z.infer<typeof AttendeeRedemptionSchema>;

/**
 * Schema for step-by-step validation during redemption
 */
export const AttendeeValidationStepSchema = z.object({
  step: z.enum(['name', 'email']),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Valid email is required').optional(),
  // Make projectId optional for backward compatibility with eventId
  projectId: z.string().optional(),
  eventId: z.string().optional(), // Legacy field for backward compatibility
});

export type AttendeeValidationStep = z.infer<typeof AttendeeValidationStepSchema>;

/**
 * Response schema for attendee validation
 */
export const AttendeeValidationResponseSchema = z.object({
  isValid: z.boolean(),
  attendeeId: z.string().optional(),
  expectedEmail: z.string().optional(),
  hasAlreadyRedeemed: z.boolean().default(false),
  error: z.string().optional(),
});

export type AttendeeValidationResponse = z.infer<typeof AttendeeValidationResponseSchema>;

/**
 * Schema for bulk attendee import from CSV
 */
export const BulkAttendeeImportSchema = z.object({
  attendees: z.array(CreateAttendeeSchema.omit({ projectId: true })),
  projectId: z.string().min(1, 'Project ID is required'),
});

export type BulkAttendeeImport = z.infer<typeof BulkAttendeeImportSchema>;
