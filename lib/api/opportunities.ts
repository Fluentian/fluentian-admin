import apiClient from './client';
import { OpportunityPost, OpportunityCreate, PaginatedResponse } from '@/lib/types';

export const opportunitiesApi = {
  getOpportunities: async (params?: { page?: number; size?: number; type?: string }) => {
    const { data } = await apiClient.get<PaginatedResponse<OpportunityPost>>('/opportunities', { params });
    return data;
  },

  createOpportunity: async (data: OpportunityCreate) => {
    const { data: response } = await apiClient.post<OpportunityPost>('/opportunities', data);
    return response;
  },

  updateOpportunity: async (id: string, data: Partial<OpportunityCreate> & { is_active?: boolean }) => {
    const { data: response } = await apiClient.patch<OpportunityPost>(`/opportunities/${id}`, data);
    return response;
  },

  getOpportunity: async (id: string) => {
    const { data } = await apiClient.get<OpportunityPost>(`/opportunities/${id}`);
    return data;
  },

  getApplications: async (opportunityId: string) => {
    const { data } = await apiClient.get<any[]>(`/opportunities/${opportunityId}/applications`);
    return data;
  },

  updateApplicationStatus: async (applicationId: string, status: string) => {
    const { data } = await apiClient.patch<any>(`/opportunities/applications/${applicationId}/status`, null, { params: { status } });
    return data;
  }
};
