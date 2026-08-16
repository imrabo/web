'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

import type {
  CreateUserFormValues,
  EditUserFormValues,
} from '../schemas';
import type { UserType } from '../types';
import usersService from '../services/usersService';
import { data } from 'react-router-dom';

/**
 * Get all users.
 */
export const useUsersQuery = () => {
  return useQuery({
    queryKey: [COLLECTIONS.USERS],
    queryFn: () => usersService.fetchUsers(),
  });
};

/**
 * Get a user by username.
 */

export const useUserQuery = (username: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.USERS, username],

    queryFn: async () => {
      const data = await usersService.fetchUserByUserName(username);
      return data?.data;
    },

    enabled: Boolean(username),
  });
};

/**
 * Create a new user.
 */
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserFormValues) =>
      usersService.createUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.USERS],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'stats'],
      });

      toast.success('User account created successfully');
    },

    onError: (err: Error) => {
      toast.error(
        err.message || 'Failed to create user account',
      );
    },
  });
};

/**
 * Update an existing user.
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<EditUserFormValues>;
    }) => usersService.updateUser(id, data),

    onSuccess: (updatedUser) => {
      // Update detail cache.
      queryClient.setQueryData<UserType>(
        [COLLECTIONS.USERS, updatedUser.data?.id],
        updatedUser.data!,
      );

      // Update list cache.
      queryClient.setQueryData<UserType[]>(
        [COLLECTIONS.USERS],
        (oldUsers) =>
          oldUsers?.map((user) =>
            user.id === updatedUser.data?.id
              ? updatedUser.data!
              : user,
          ) ?? [],
      );

      toast.success(
        `Updated details for ${updatedUser.data?.first_name} ${updatedUser.data?.last_name}`,
      );
    },

    onError: (err: Error) => {
      toast.error(
        err.message || 'Failed to update user details',
      );
    },
  });
};

/**
 * Delete a user.
 */
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      usersService.deleteUser(id),

    onSuccess: (_, deletedUserId) => {
      // Remove the deleted user's detail cache.
      queryClient.removeQueries({
        queryKey: [COLLECTIONS.USERS, deletedUserId],
      });

      // Remove the deleted user from the list cache.
      queryClient.setQueryData<UserType[]>(
        [COLLECTIONS.USERS],
        (oldUsers) =>
          oldUsers?.filter(
            (user) => user.id !== deletedUserId,
          ) ?? [],
      );

      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'stats'],
      });

      toast.success('User account deleted successfully');
    },

    onError: (err: Error) => {
      toast.error(
        err.message || 'Failed to delete user account',
      );
    },
  });
};