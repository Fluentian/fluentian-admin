import apiClient from "./client";
import { Language } from "@/lib/types";

export const languagesApi = {
  list: async () => {
    const response = await apiClient.get<Language[]>('/content/languages');
    return response.data;
  },
};
