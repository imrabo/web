export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
  Tool = 'tool',
}

export enum MessageStatus {
  Pending = 'pending',
  Streaming = 'streaming',
  Completed = 'completed',
  Failed = 'failed',
}

export interface Message {
  id: number;
  conversation_id: number;
  workspace_id: number;

  role: MessageRole;
  content: string;
  status: MessageStatus;

  tokenUsage: Record<string, unknown>;
  metadata: Record<string, unknown>;

  createdAt: Date;
}

export interface CreateMessage {
  conversation_id: number;
  workspace_id: number;
  role: MessageRole;
  content: string;
  status?: MessageStatus;
  tokenUsage?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UpdateMessage {
  content?: string;
  status?: MessageStatus;
  tokenUsage?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}