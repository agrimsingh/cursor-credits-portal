/**
 * Authentication domain models and validation schemas
 * 
 * Defines user roles, claims, and authentication-related data structures.
 */

import { z } from 'zod';

/**
 * User roles in the system
 */
export const UserRole = z.enum(['attendee', 'organizer', 'admin']);
export type UserRole = z.infer<typeof UserRole>;

/**
 * Firebase Auth custom claims schema
 */
export const UserClaimsSchema = z.object({
  role: UserRole.default('attendee'),
  organizationId: z.string().optional(),
  eventIds: z.array(z.string()).default([]),
});

export type UserClaims = z.infer<typeof UserClaimsSchema>;

/**
 * User profile schema combining Firebase Auth with custom data
 */
export const UserProfileSchema = z.object({
  uid: z.string().min(1, 'User ID is required'),
  email: z.string().email('Valid email is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  role: UserRole,
  organizationId: z.string().optional(),
  eventIds: z.array(z.string()).default([]),
  createdAt: z.date(),
  lastLoginAt: z.date().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * Schema for user authentication flow
 */
export const AuthRequestSchema = z.object({
  email: z.string().email('Valid email is required'),
  returnUrl: z.string().url().optional(),
});

export type AuthRequest = z.infer<typeof AuthRequestSchema>;

/**
 * Schema for admin user creation
 */
export const CreateAdminUserSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  role: UserRole,
  organizationId: z.string().optional(),
});

export type CreateAdminUser = z.infer<typeof CreateAdminUserSchema>;
