import apiClient from './client';
import type { UserProfile, UserWithProfile } from '@/lib/types';

export const usersApi = {
  getMe: async (): Promise<UserWithProfile> => {
    const { data } = await apiClient.get<UserWithProfile>('/users/me');
    return data;
  },

  updateUsername: async (username: string): Promise<UserWithProfile> => {
    const { data } = await apiClient.patch<UserWithProfile>('/users/me', { username });
    return data;
  },

  updateProfile: async (payload: { display_name?: string }): Promise<UserProfile> => {
    const { data } = await apiClient.patch<UserProfile>('/users/me/profile', payload);
    return data;
  },
};
