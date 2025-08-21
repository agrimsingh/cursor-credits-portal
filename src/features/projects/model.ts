/**
 * Projects domain models and validation schemas
 * 
 * Defines the data structure for hackathon/event projects and their validation rules.
 */

import { z } from 'zod';

/**
 * Zod schema for a project/event
 */
export const ProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  eventDate: z.date().optional(),
  slug: z.string().min(1, 'Project slug is required').regex(
    /^[a-z0-9-]+$/,
    'Slug must contain only lowercase letters, numbers, and hyphens'
  ),
  status: z.enum(['active', 'archived', 'draft']).default('active'),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Stats (computed values)
  totalCodes: z.number().default(0),
  totalAttendees: z.number().default(0),
  totalRedemptions: z.number().default(0),
});

/**
 * TypeScript type derived from Zod schema
 */
export type Project = z.infer<typeof ProjectSchema>;

/**
 * Schema for creating a new project (excludes computed fields)
 */
export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalCodes: true,
  totalAttendees: true,
  totalRedemptions: true,
});

export type CreateProject = z.infer<typeof CreateProjectSchema>;

/**
 * Schema for updating a project
 */
export const UpdateProjectSchema = CreateProjectSchema.partial();

export type UpdateProject = z.infer<typeof UpdateProjectSchema>;

/**
 * Schema for project summary (for selection lists)
 */
export const ProjectSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  status: z.enum(['active', 'archived', 'draft']),
  eventDate: z.date().optional(),
  createdAt: z.date(),
  totalCodes: z.number(),
  totalAttendees: z.number(),
  totalRedemptions: z.number(),
});

export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;

/**
 * Helper function to generate slug from project name
 */
export function generateProjectSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Helper function to validate project slug uniqueness
 */
export function validateSlugFormat(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0;
}
