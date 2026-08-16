/**
 * WorkSpace visibility options.
 */
export enum IWorkSpaceVisibility {
    Private = 'private',
    Shared = 'shared',
}

/**
 * WorkSpace lifecycle status.
 */
export enum IWorkSpaceStatus {
    Active = 'active',
    Archived = 'archived',
    Deleted = 'deleted',
}

/**
 * Additional workspace metadata.
 */
export interface IWorkSpaceMetadata {
    [key: string]: unknown;
}

/**
 * Represents a workspace.
 *
 * A workspace is the top-level container for agents,
 * conversations, and other resources.
 */
export interface IWorkSpace {
    /** Database primary key */
    id: number;

    /** WorkSpace information */
    name: string;
    slug: string;
    description: string;
    logoUrl: string;

    /** WorkSpace ownership */
    ownerId: number;

    /** WorkSpace configuration */
    visibility: IWorkSpaceVisibility;
    status: IWorkSpaceStatus;
    defaultModel?: string | null;

    /** Additional workspace metadata */
    metadata: IWorkSpaceMetadata;

    /** Audit information */
    createdBy: number;
    updatedBy: number;

    /** Timestamps */
    createdAt: Date;
    updatedAt: Date;

    /** Soft delete timestamp */
    deletedAt?: Date | null;
}