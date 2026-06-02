import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, CreateUserPayload, UpdateUserRolePayload, UserAdminResponse, UsersListResponse } from '@/lib/api/admin';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/api-error';

export function useListUsers(params?: { page?: number; size?: number; role?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.listUsers(params),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => adminApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User created successfully. Credentials sent via email.');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserRolePayload }) =>
      adminApi.updateUserRole(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User role updated successfully');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminApi.deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User deactivated');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useReactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminApi.reactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User reactivated');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: (userId: string) => adminApi.resetUserPassword(userId),
    onSuccess: () => {
      toast.success('Password reset. New credentials sent to user email');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
