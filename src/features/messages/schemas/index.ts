import * as zod from 'zod';

import { MessageRole, MessageStatus } from '@/features/messages/types';

export const createMessageSchema = zod.object({
  conversation_id: zod.coerce.number().int().positive(
    'Conversation ID is required'
  ),

  workspace_id: zod.coerce.number().int().positive(
    'Workspace ID is required'
  ),

  role: zod.enum(MessageRole),

  content: zod.string().min(
    1,
    'Message content is required'
  ),

  status: zod.enum(MessageStatus).default(MessageStatus.Completed),

  tokenUsage: zod.record(zod.string(), zod.unknown()).default({}),

  metadata: zod.record(zod.string(), zod.unknown()).default({}),
});

export type CreateMessageFormValues = zod.infer<
  typeof createMessageSchema
>;

export const updateMessageSchema = zod.object({
  content: zod
    .string()
    .min(1, 'Message content cannot be empty')
    .optional(),

  status: zod.enum(MessageStatus).optional(),

  tokenUsage: zod
    .record(zod.string(), zod.unknown())
    .optional(),

  metadata: zod
    .record(zod.string(), zod.unknown())
    .optional(),
});

export type UpdateMessageFormValues = zod.infer<
  typeof updateMessageSchema
>;