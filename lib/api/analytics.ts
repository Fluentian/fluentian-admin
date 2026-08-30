import apiClient from "./client";

export interface DateRangeParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

function toQuery(range?: DateRangeParams) {
  return {
    start_date: range?.startDate,
    end_date: range?.endDate,
  };
}

// ── Overview ────────────────────────────────────────────────────────────

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

export interface AnalyticsOverview {
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

export interface OfflinePerformance {
  lesson_open_count: number;
  p95_lesson_open_latency_ms: number;
  estimated_bytes: number;
  cache_layer_hits: Record<string, number>;
  cache_hit_ratio: number;
}

export async function getOfflinePerformance(): Promise<OfflinePerformance> {
  const { data } = await apiClient.get<OfflinePerformance>('/analytics/offline-performance');
  return data;
}

// ── Engagement ─────────────────────────────────────────────────────────

export interface AnalyticsEngagement {
  dau_trend: { date: string; active_users: number }[];
  mau_30d: number;
  retention: { cohort: string; percent: number }[];
  streak_distribution: { band: string; count: number }[];
  session_frequency: { bucket: string; count: number }[];
}

// ── Learning ───────────────────────────────────────────────────────────

export interface AnalyticsLearning {
  course_completion: { course: string; started: number; completed: number; rate: number }[];
  mastery_distribution: { bucket: string; count: number }[];
  placement_levels: { level: string; count: number }[];
  srs_distribution: { bucket: string; count: number }[];
}

// ── Content & Social ──────────────────────────────────────────────────

export interface AnalyticsContentSocial {
  call_volume: { date: string; call_kind: string; calls: number; total_minutes: number }[];
  avg_call_duration_minutes: { call_kind: string; avg_minutes: number; count: number }[];
  live_lobby_active_now: number;
  partnership_status: { status: string; count: number }[];
  feedback_by_category: { category: string; avg_rating: number; count: number }[];
}

// ── AI Usage ───────────────────────────────────────────────────────────

export interface AnalyticsAiUsage {
  token_trend: { date: string; prompt_tokens: number; completion_tokens: number; total_tokens: number }[];
  by_feature: { feature: string; provider: string; total_tokens: number; requests: number }[];
  top_users: { username: string; total_tokens: number; requests: number }[];
  conversation_volume: { date: string; count: number }[];
}

export type AnalyticsDomain = "overview" | "engagement" | "learning" | "content-social" | "ai-usage";

export const analyticsApi = {
  getOverview: async (range?: DateRangeParams): Promise<AnalyticsOverview> => {
    const { data } = await apiClient.get("/analytics/overview", { params: toQuery(range) });
    return data;
  },
  getEngagement: async (range?: DateRangeParams): Promise<AnalyticsEngagement> => {
    const { data } = await apiClient.get("/analytics/engagement", { params: toQuery(range) });
    return data;
  },
  getLearning: async (range?: DateRangeParams): Promise<AnalyticsLearning> => {
    const { data } = await apiClient.get("/analytics/learning", { params: toQuery(range) });
    return data;
  },
  getContentSocial: async (range?: DateRangeParams): Promise<AnalyticsContentSocial> => {
    const { data } = await apiClient.get("/analytics/content-social", { params: toQuery(range) });
    return data;
  },
  getAiUsage: async (range?: DateRangeParams): Promise<AnalyticsAiUsage> => {
    const { data } = await apiClient.get("/analytics/ai-usage", { params: toQuery(range) });
    return data;
  },
  exportCsv: async (domain: AnalyticsDomain, range?: DateRangeParams): Promise<void> => {
    const response = await apiClient.get(`/analytics/export/${domain}`, {
      params: toQuery(range),
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `fluentian-${domain}-${range?.startDate ?? "all"}_${range?.endDate ?? "all"}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
