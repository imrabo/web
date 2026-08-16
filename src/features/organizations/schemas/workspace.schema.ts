import { z } from 'zod';

/**
 * WorkSpace visibility options.
 */
export enum WorkSpaceVisibility {
    Private = 'private',
    Shared = 'shared',
}

/**
 * WorkSpace lifecycle status.
 */
export enum WorkSpaceStatus {
    Active = 'active',
    Archived = 'archived',
    Deleted = 'deleted',
}

/**
 * Additional workspace metadata.
 */
export const WorkSpaceMetadataSchema = z.record(z.string(), z.unknown());

/**
 * WorkSpace validation schema.
 */
export const WorkSpaceSchema = z.object({
    /** Database primary key */
    id: z.number().int().positive(),

    /** WorkSpace information */
    name: z.string().min(1).max(150),

    slug: z.string().min(1).max(150),

    description: z.string().max(1000),

    logoUrl: z.string().max(500),

    /** WorkSpace ownership */
    ownerId: z.number().int().positive(),

    /** WorkSpace configuration */
    visibility: z.nativeEnum(WorkSpaceVisibility),

    status: z.nativeEnum(WorkSpaceStatus),

    defaultModel: z.string().max(100).nullable().optional(),

    /** Additional workspace metadata */
    metadata: WorkSpaceMetadataSchema,

    /** Audit information */
    createdBy: z.number().int().positive(),

    updatedBy: z.number().int().positive(),

    /** Timestamps */
    createdAt: z.coerce.date(),

    updatedAt: z.coerce.date(),

    /** Soft delete timestamp */
    deletedAt: z.coerce.date().nullable().optional(),
});

export type WorkSpace = z.infer<typeof WorkSpaceSchema>;