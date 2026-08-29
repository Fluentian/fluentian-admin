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
    is_founder?: boolean;
  };
}

export interface PlatformSettings {
  founder_badge_enabled: boolean;
  updated_at: string;
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
  listAiScenarios: async () => (await apiClient.get('/admin/ai-scenarios')).data,
  createAiScenario: async (payload: Record<string, unknown>) => (await apiClient.post('/admin/ai-scenarios', payload)).data,
  updateAiScenario: async (id: string, payload: Record<string, unknown>) => (await apiClient.patch(`/admin/ai-scenarios/${id}`, payload)).data,
  listAiCallReports: async (limit = 50) => {
    const { data } = await apiClient.get('/admin/ai-call-reports', { params: { limit } });
    return data;
  },
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

  // Platform-wide settings
  getPlatformSettings: async () => {
    const { data } = await apiClient.get<PlatformSettings>('/admin/platform-settings');
    return data;
  },

  updatePlatformSettings: async (payload: Partial<PlatformSettings>) => {
    const { data } = await apiClient.patch<PlatformSettings>(
      '/admin/platform-settings',
      payload
    );
    return data;
  },
};
