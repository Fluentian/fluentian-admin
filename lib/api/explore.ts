import apiClient from './client';

export type CultureStory = { id: string; title: string; location: string; category: string; sequence_no: number; is_published: boolean; media: {type: string; url: string; caption: string}[]; paragraphs: {original: string; translated: string}[][] };
export type CultureStoryInput = Omit<CultureStory, 'id'>;

export const exploreApi = {
  list: async () => (await apiClient.get('/content/culture-stories', { params: { size: 100, include_unpublished: true } })).data.items as CultureStory[],
  create: async (payload: CultureStoryInput) => (await apiClient.post('/content/culture-stories', payload)).data as CultureStory,
  update: async (id: string, payload: CultureStoryInput) => (await apiClient.patch(`/content/culture-stories/${id}`, payload)).data as CultureStory,
  remove: async (id: string) => apiClient.delete(`/content/culture-stories/${id}`),
};
