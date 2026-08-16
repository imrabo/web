import { apiClient } from '@/lib/api/client';

import type {
  Message,
  CreateMessage,
  UpdateMessage,
} from '@/features/messages/types';

export const messagesService = {
  async fetchMessages() {
    return apiClient.get<Message[]>('/messages');
  },

  async fetchMessageById(id: number) {
    return apiClient.get<Message>(`/messages/${id}`);
  },

  async createMessage(data: CreateMessage) {
    return apiClient.post<Message>('/messages', data);
  },

  async updateMessage(id: number, data: UpdateMessage) {
    return apiClient.patch<Message>(
      `/messages/${id}`,
      data
    );
  },

  async deleteMessage(id: number) {
    return apiClient.delete<void>(`/messages/${id}`);
  },
};

export default messagesService;