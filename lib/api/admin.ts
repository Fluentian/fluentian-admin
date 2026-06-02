import apiClient from './client';
import { User, PaginatedResponse } from '@/lib/types';

export interface UserAdminResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name?: string;
    avatar_url?: string;
  };
}

export interface CreateUserPayload {
  email: string;
  username: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

export interface UpdateUserRolePayload {
  role: string;
}

export interface UsersListResponse {
  data: UserAdminResponse[];
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

export const adminApi = {
  // User Management
  createUser: async (payload: CreateUserPayload) => {
    const { data } = await apiClient.post<UserAdminResponse>('/admin/users', payload);
    return data;
  },

  listUsers: async (params?: {
    page?: number;
    size?: number;
    role?: string;
    is_active?: boolean;
  }) => {
    const { data } = await apiClient.get<UsersListResponse>('/admin/users', { params });
    return data;
  },

  updateUserRole: async (userId: string, payload: UpdateUserRolePayload) => {
    const { data } = await apiClient.patch<UserAdminResponse>(
      `/admin/users/${userId}/role`,
      payload
    );
    return data;
  },

  deactivateUser: async (userId: string) => {
    const { data } = await apiClient.post<UserAdminResponse>(
      `/admin/users/${userId}/deactivate`
    );
    return data;
  },

  reactivateUser: async (userId: string) => {
    const { data } = await apiClient.post<UserAdminResponse>(
      `/admin/users/${userId}/reactivate`
    );
    return data;
  },

  resetUserPassword: async (userId: string) => {
    const { data } = await apiClient.post<{ message: string }>(
      `/admin/users/${userId}/reset-password`
    );
    return data;
  },
};
