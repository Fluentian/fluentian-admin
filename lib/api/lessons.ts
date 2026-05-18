import apiClient from './client';
import { 
  Lesson, 
  LessonCreate, 
  LessonUpdate, 
  PaginatedResponse, 
  LessonBlock, 
  LessonBlockCreate, 
  Question, 
  QuestionCreate 
} from '@/lib/types';

export const lessonsApi = {
  getLessons: async (params?: { page?: number; size?: number; course_id?: string; unit_id?: string }) => {
    const { data } = await apiClient.get<PaginatedResponse<Lesson>>('/content/lessons', { params });
    return data;
  },

  getLesson: async (id: string) => {
    const { data } = await apiClient.get<Lesson & { blocks: LessonBlock[]; questions: Question[] }>(`/content/lessons/${id}`);
    return data;
  },

  createLesson: async (unitId: string, data: LessonCreate) => {
    const { data: response } = await apiClient.post<Lesson>(`/content/units/${unitId}/lessons`, data);
    return response;
  },

  updateLesson: async (id: string, data: LessonUpdate) => {
    const { data: response } = await apiClient.patch<Lesson>(`/content/lessons/${id}`, data);
    return response;
  },

  deleteLesson: async (id: string) => {
    await apiClient.delete(`/content/lessons/${id}`);
  },

  addBlock: async (lessonId: string, data: LessonBlockCreate) => {
    const { data: response } = await apiClient.post<LessonBlock>(`/content/lessons/${lessonId}/blocks`, data);
    return response;
  },

  updateBlock: async (blockId: string, data: Partial<LessonBlockCreate>) => {
    const { data: response } = await apiClient.patch<LessonBlock>(`/content/blocks/${blockId}`, data);
    return response;
  },

  deleteBlock: async (blockId: string) => {
    await apiClient.delete(`/content/blocks/${blockId}`);
  },

  addQuestion: async (lessonId: string, data: QuestionCreate) => {
    const { data: response } = await apiClient.post<Question>(`/content/lessons/${lessonId}/questions`, data);
    return response;
  },

  updateQuestion: async (questionId: string, data: Partial<QuestionCreate>) => {
    const { data: response } = await apiClient.patch<Question>(`/content/questions/${questionId}`, data);
    return response;
  },

  deleteQuestion: async (questionId: string) => {
    await apiClient.delete(`/content/questions/${questionId}`);
  },
};
