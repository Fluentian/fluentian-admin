import apiClient from './client';
import { MessageResponse, Notification, NotificationCreate, PaginatedResponse } from '@/lib/types';

export const notificationsApi = {
  getNotifications: async (params?: { page?: number; size?: number }) => {
    const { data } = await apiClient.get<PaginatedResponse<Notification>>('/notifications', { params });
    return data;
  },

  sendNotification: async (data: NotificationCreate) => {
    const { data: response } = await apiClient.post<MessageResponse>('/notifications', data);
    return response;
  },
};
