import { apiClient } from '@/lib/api/client';
import type { IWorkSpace } from '../types';

export const workspacesService = {
  fetchWorkSpaces: () =>
    apiClient.get<IWorkSpace[]>('/workspaces'),
  fetchWorkSpaceById: (id: string) =>
    apiClient.get<IWorkSpace>(`/workspaces/${id}`),
  createWorkSpace: (
    data: Omit<IWorkSpace, 'id' | 'createdAt' | 'updatedAt'>
  ) =>
    apiClient.post<IWorkSpace>('/workspaces', data),
  updateWorkSpace: (
    id: string,
    data: Partial<IWorkSpace>
  ) =>
    apiClient.patch<IWorkSpace>(`/workspaces/${id}`, data),
  deleteWorkSpace: (id: string) =>
    apiClient.delete(`/workspaces/${id}`),
};
