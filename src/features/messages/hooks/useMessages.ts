import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import messagesService from '../services/messagesService';

import type {
  CreateMessage,
  UpdateMessage,
} from '../types';

export const useMessagesQuery = () => {
  return useQuery({
    queryKey: ['messages-data'],
    queryFn: () => messagesService.fetchMessages(),
  });
};

export const useMessageDetailsQuery = (messageId: number | null) => {
  return useQuery({
    queryKey: ['message-details', messageId],
    queryFn: async () => {
      if (!messageId) return null;

      return messagesService.fetchMessageById(messageId);
    },
    enabled: !!messageId,
  });
};

export const useCreateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessage) =>
      messagesService.createMessage(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages-data'],
      });

      toast.success('Message sent successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to send message');
    },
  });
};

export const useUpdateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateMessage;
    }) => messagesService.updateMessage(id, data),

    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['messages-data'],
      });

      queryClient.invalidateQueries({
        queryKey: ['message-details', updated.data?.id],
      });

      toast.success('Message updated successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to update message');
    },
  });
};

export const useDeleteMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      messagesService.deleteMessage(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages-data'],
      });

      toast.success('Message deleted successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete message');
    },
  });
};