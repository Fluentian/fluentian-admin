import apiClient from "./client";

export interface AnalyticsSummary {
  total_users: number;
  total_completions: number;
  average_score: number;
  active_users_7d: number;
  retention_7d_percent: number;
}

export interface DayStat {
  date: string;
  count?: number;
  started?: number;
  completed?: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface DropOff {
  title: string;
  rate: number;
}

export interface XPDist {
  range: string;
  count: number;
}

export interface AnalyticsDashboard {
  summary: AnalyticsSummary;
  timeline: {
    registrations: DayStat[];
    activity: DayStat[];
  };
  funnel: FunnelStage[];
  content_performance: {
    dropoffs: DropOff[];
    xp_distribution: XPDist[];
  };
}

export const analyticsApi = {
  getDashboard: async (): Promise<AnalyticsDashboard> => {
    const { data } = await apiClient.get("/analytics/dashboard");
    return data;
  },
};
