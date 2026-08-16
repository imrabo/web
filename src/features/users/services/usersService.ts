import { apiClient } from '@/lib/api/client';
import type {
  CreateUserFormValues,
  EditUserFormValues,
} from '../schemas';
import type { UserType } from '../types';

export const usersService = {
  /**
   * Get all users.
   */
  async fetchUsers() {
    return apiClient.get<UserType[]>('/users');
  },

  /**
   * Get a user by ID.
   */
  async fetchUserByUserName(username: string) {
    return apiClient.get<UserType>(`/users/${username}`);
  },

  /**
   * Create a new user.
   */
  async createUser(data: CreateUserFormValues) {
    return apiClient.post<UserType>('/users', data);
  },

  /**
   * Update an existing user.
   */
  async updateUser(
    id: number,
    data: Partial<EditUserFormValues>,
  ) {
    return apiClient.patch<UserType>(`/users/${id}`, data);
  },

  /**
   * Delete a user by ID.
   */
  async deleteUser(id: number) {
    return apiClient.delete<void>(`/users/${id}`);
  },
};

export default usersService;