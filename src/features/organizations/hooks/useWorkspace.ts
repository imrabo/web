import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { workspacesService } from '../services/workspaceService';
import type { IWorkSpace } from '../types';

export const useWorkspacesQuery = () => {
  return useQuery({
    queryKey: [COLLECTIONS.COMMUNITIES],
    queryFn: async () => {
      return await workspacesService.fetchWorkSpaces();
    },
  });
};

// export const useWorkspacesQuery = () => {
//   return useQuery({
//     queryKey: [COLLECTIONS.COMMUNITIES],
//     queryFn: async () => {
//       const [data] = await Promise.all([
//         workspacesService.fetchWorkspaces(),

//       ]);
//       return { data };
//     },
//   });
// };

export const useCreateWorkSpaceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => workspacesService.createWorkSpace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.COMMUNITIES] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Neighborhood WorkSpace created successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create community group');
    },
  });
};

export const useDeleteWorkSpaceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workspacesService.deleteWorkSpace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.COMMUNITIES] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('WorkSpace group removed');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete community group');
    },
  });
};

export const useWorkSpaceQuery = (id: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.COMMUNITIES, id],
    queryFn: () => workspacesService.fetchWorkSpaceById(id),
    enabled: !!id,
  });
};

export const useUpdateWorkSpaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<IWorkSpace>;
    }) => workspacesService.updateWorkSpace(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.COMMUNITIES],
      });

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.COMMUNITIES, variables.id],
      });

      toast.success('WorkSpace updated successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to update community');
    },
  });
};