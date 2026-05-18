import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '../api/lessons';
import { LessonCreate, LessonUpdate, LessonBlockCreate, QuestionCreate } from '../types';
import { toast } from 'sonner';

export function useLessons(params?: { page?: number; size?: number; course_id?: string; unit_id?: string }) {
  return useQuery({
    queryKey: ['lessons', params],
    queryFn: () => lessonsApi.getLessons(params),
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ['lessons', id],
    queryFn: () => lessonsApi.getLesson(id),
    enabled: !!id,
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ unitId, data }: { unitId: string; data: LessonCreate }) =>
      lessonsApi.createLesson(unitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create lesson');
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LessonUpdate }) =>
      lessonsApi.updateLesson(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', id] });
      toast.success('Lesson updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update lesson');
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lessonsApi.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete lesson');
    },
  });
}

export function useAddBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: string; data: LessonBlockCreate }) =>
      lessonsApi.addBlock(lessonId, data),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] });
      toast.success('Block added');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add block');
    },
  });
}

export function useUpdateBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blockId, data, lessonId }: { blockId: string; data: Partial<LessonBlockCreate>; lessonId: string }) =>
      lessonsApi.updateBlock(blockId, data),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update block');
    },
  });
}

export function useDeleteBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blockId, lessonId }: { blockId: string; lessonId: string }) =>
      lessonsApi.deleteBlock(blockId),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] });
      toast.success('Block deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete block');
    },
  });
}

export function useAddQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: string; data: QuestionCreate }) =>
      lessonsApi.addQuestion(lessonId, data),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] });
      toast.success('Question added');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add question');
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, data, lessonId }: { questionId: string; data: Partial<QuestionCreate>; lessonId: string }) =>
      lessonsApi.updateQuestion(questionId, data),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] });
      toast.success('Question updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update question');
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, lessonId }: { questionId: string; lessonId: string }) =>
      lessonsApi.deleteQuestion(questionId),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] });
      toast.success('Question deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete question');
    },
  });
}
