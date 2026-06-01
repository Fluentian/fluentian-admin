import apiClient from './client';
import { Course, CourseCreate, CourseUpdate, PaginatedResponse, PathUnit, PathUnitCreate } from '@/lib/types';

export const coursesApi = {
  getCourses: async (params?: { page?: number; size?: number; is_published?: boolean }) => {
    const { data } = await apiClient.get<PaginatedResponse<Course>>('/content/courses', { params });
    return data;
  },

  getCourse: async (id: string) => {
    const { data } = await apiClient.get<Course>(`/content/courses/${id}`);
    return data;
  },

  createCourse: async (data: CourseCreate) => {
    const { data: response } = await apiClient.post<Course>('/content/courses', data);
    return response;
  },

  updateCourse: async (id: string, data: CourseUpdate) => {
    const { data: response } = await apiClient.patch<Course>(`/content/courses/${id}`, data);
    return response;
  },

  deleteCourse: async (id: string) => {
    await apiClient.delete(`/content/courses/${id}`);
  },

  getCourseUnits: async (courseId: string) => {
    const { data } = await apiClient.get<PathUnit[]>(`/content/courses/${courseId}/units`);
    return data;
  },
  
  createUnit: async (courseId: string, data: PathUnitCreate) => {
    const { data: response } = await apiClient.post<PathUnit>(`/content/courses/${courseId}/units`, data);
    return response;
  },
};
