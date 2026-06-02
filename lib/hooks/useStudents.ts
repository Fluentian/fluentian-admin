import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students';
import { User } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils/api-error';

export function useStudents(
  params?: { page?: number; size?: number; role?: string },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentsApi.getStudents(params),
    enabled: options?.enabled ?? true,
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentsApi.getStudent(id),
    enabled: !!id,
  });
}

export function useStudentProgress(id: string) {
  return useQuery({
    queryKey: ['students', id, 'progress'],
    queryFn: () => studentsApi.getStudentProgress(id),
    enabled: !!id,
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      studentsApi.updateStudent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', id] });
      toast.success('Student updated');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
