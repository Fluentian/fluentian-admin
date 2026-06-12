import apiClient from './client';
import { 
  User, 
  UserWithProfile, 
  PaginatedResponse, 
  UserLessonProgress, 
  UserUnitProgress 
} from '@/lib/types';

export const studentsApi = {
  getStudents: async (params?: { page?: number; size?: number; role?: string }) => {
    const { data } = await apiClient.get<PaginatedResponse<User>>('/students', { params });
    return data;
  },

  getStudent: async (id: string) => {
    const { data } = await apiClient.get<UserWithProfile>(`/students/${id}`);
    return data;
  },

  getStudentProgress: async (id: string) => {
    const { data: lessons } = await apiClient.get<PaginatedResponse<UserLessonProgress>>(`/progress/users/${id}/lessons`);
    const { data: units } = await apiClient.get<PaginatedResponse<UserUnitProgress>>(`/progress/users/${id}/units`);
    return { lessons: lessons.items, units: units.items };
  },

  updateStudent: async (id: string, data: Partial<User>) => {
    const { data: response } = await apiClient.patch<User>(`/students/${id}`, data);
    return response;
  },
};
