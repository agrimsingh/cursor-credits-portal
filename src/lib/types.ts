/**
 * Shared types and schemas across the application
 * 
 * This module contains types that are used across multiple domains.
 */

import { z } from 'zod';

/**
 * Event schema for hackathons and meetups
 */
export const EventSchema = z.object({
  id: z.string().min(1, 'Event ID is required'),
  name: z.string().min(1, 'Event name is required').max(200, 'Event name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  organizerId: z.string().min(1, 'Organizer ID is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
  location: z.string().min(1, 'Location is required'),
  eventDate: z.date(),
  isActive: z.boolean().default(true),
  totalCodes: z.number().int().min(0).default(0),
  redeemedCodes: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Event = z.infer<typeof EventSchema>;

/**
 * Schema for creating a new event
 */
export const CreateEventSchema = EventSchema.omit({
  id: true,
  totalCodes: true,
  redeemedCodes: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEvent = z.infer<typeof CreateEventSchema>;

/**
 * Redemption record linking attendees and codes
 */
export const RedemptionSchema = z.object({
  id: z.string().min(1, 'Redemption ID is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  attendeeId: z.string().min(1, 'Attendee ID is required'),
  codeId: z.string().min(1, 'Code ID is required'),
  attendeeName: z.string().min(1, 'Attendee name is required'),
  attendeeEmail: z.string().email('Valid email is required'),
  codeValue: z.string().min(1, 'Code value is required'),
  redeemedAt: z.date(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export type Redemption = z.infer<typeof RedemptionSchema>;

/**
 * API response wrapper
 */
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  timestamp: z.date(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
};
