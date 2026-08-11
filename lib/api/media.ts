import apiClient from './client';

export interface MediaAsset {
  id: string;
  storage_key: string;
  url: string;
  mime_type: string;
  duration_ms: number | null;
  created_at: string;
}

export const mediaApi = {
  upload: async (file: File): Promise<MediaAsset> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<MediaAsset>('/content/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
