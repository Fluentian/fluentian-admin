// ── Enums ──────────────────────────────────────────────────

export type AppRole = 'student' | 'tutor' | 'admin' | 'moderator' | 'teacher' | 'super_admin';

export type ProficiencyLevel = 'a0' | 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

export type SubscriptionTier = 'free' | 'plus' | 'pro';

export type LessonKind =
  | 'grammar_explainer' | 'dialogue' | 'vocabulary' | 'pronunciation'
  | 'listening' | 'reading' | 'writing' | 'speaking'
  | 'cultural_bridge' | 'exam_drill' | 'roleplay_simulation';

export type UnitKind = 'core' | 'practice' | 'story' | 'checkpoint';

export type QuestionKind =
  | 'mcq_single' | 'mcq_multi' | 'fill_blank' | 'reorder'
  | 'match_pairs' | 'short_text' | 'translation'
  | 'speech_record' | 'listening_comprehension' | 'dictation';

export type MessageKind = 'text' | 'image' | 'audio' | 'system';

export type RoomKind = 'dm' | 'group' | 'level_based';

export type CallKind = 'audio' | 'video';

// ── API Response wrapper ────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ── Auth ────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  user: User;
}

// ── Languages ───────────────────────────────────────────────

export interface Language {
  id: string;
  iso_code: string;
  english_name: string;
  native_name: string | null;
  is_active: boolean;
  created_at: string;
}

// ── Users ───────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  role: AppRole;
  ui_language_id: string | null;
  base_language_id: string | null;
  target_language_id: string | null;
  current_level: ProficiencyLevel;
  xp_total: number;
  streak_days: number;
  hearts: number;
  daily_goal_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  learning_goal: string | null;
  preferred_voice_id: string | null;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  notifications_enabled: boolean;
  offline_mode_enabled: boolean;
  autoplay_audio: boolean;
  sound_enabled: boolean;
  updated_at: string;
}

export interface UserWithProfile extends User {
  profile: UserProfile | null;
  settings: UserSettings | null;
}

// ── Subscriptions ───────────────────────────────────────────

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: string;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
}

// ── Courses ─────────────────────────────────────────────────

export interface Course {
  id: string;
  target_language_id: string;
  code: string;
  level_min: ProficiencyLevel;
  level_max: ProficiencyLevel;
  is_published: boolean;
  created_at: string;
}

export interface CourseCreate {
  target_language_id: string;
  code: string;
  level_min: ProficiencyLevel;
  level_max: ProficiencyLevel;
}

export interface CourseUpdate {
  code?: string;
  level_min?: ProficiencyLevel;
  level_max?: ProficiencyLevel;
  is_published?: boolean;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  is_active: boolean;
}

// ── Units ───────────────────────────────────────────────────

export interface PathUnit {
  id: string;
  course_id: string;
  unit_kind: UnitKind;
  unit_no: number;
  title: string;
  created_at: string;
}

export interface PathUnitCreate {
  course_id: string;
  unit_kind: UnitKind;
  unit_no: number;
  title: string;
}

export interface PathUnitUpdate {
  unit_kind?: UnitKind;
  unit_no?: number;
  title?: string;
}

// ── Lessons ─────────────────────────────────────────────────

export interface Lesson {
  id: string;
  course_id: string;
  unit_id: string;
  lesson_kind: LessonKind;
  sequence_no: number;
  title: string;
  estimated_minutes: number;
  xp_reward: number;
  is_published: boolean;
  created_at: string;
}

export interface LessonCreate {
  course_id: string;
  unit_id: string;
  lesson_kind: LessonKind;
  sequence_no: number;
  title: string;
  estimated_minutes?: number;
  xp_reward?: number;
}

export interface LessonUpdate {
  lesson_kind?: LessonKind;
  sequence_no?: number;
  title?: string;
  estimated_minutes?: number;
  xp_reward?: number;
  is_published?: boolean;
}

// ── Lesson Blocks ────────────────────────────────────────────

export interface LessonBlock {
  id: string;
  lesson_id: string;
  block_kind: string;
  sequence_no: number;
  block_payload: Record<string, unknown>;
  created_at: string;
}

export interface LessonBlockCreate {
  lesson_id: string;
  block_kind: string;
  sequence_no: number;
  block_payload: Record<string, unknown>;
}

// ── Questions ────────────────────────────────────────────────

export interface Question {
  id: string;
  lesson_id: string;
  question_kind: QuestionKind;
  sequence_no: number;
  difficulty?: number;
  prompt_payload: Record<string, unknown>;
  grading_payload: Record<string, unknown>;
  created_at: string;
}

export interface QuestionCreate {
  lesson_id: string;
  question_kind: QuestionKind;
  sequence_no: number;
  difficulty?: number;
  prompt_payload: Record<string, unknown>;
  grading_payload: Record<string, unknown>;
}

// ── Progress ─────────────────────────────────────────────────

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  mastery_score: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface UserUnitProgress {
  id: string;
  user_id: string;
  unit_id: string;
  is_completed: boolean;
  created_at: string;
}

// ── AI ───────────────────────────────────────────────────────

export interface AiConversation {
  id: string;
  user_id: string;
  title: string | null;
  started_at: string;
  ended_at: string | null;
}

export interface AiConversationMessage {
  id: string;
  conversation_id: string;
  is_user_message: boolean;
  content: string;
  pronunciation_score: number | null;
  created_at: string;
}

// ── Social ───────────────────────────────────────────────────

export interface Room {
  id: string;
  room_kind: RoomKind;
  title: string;
  target_language_id: string;
  created_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_user_id: string;
  message_kind: MessageKind;
  body: string;
  created_at: string;
}

// ── Notifications ─────────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationCreate {
  user_id: string;
  title: string;
  body: string;
}

export interface MessageResponse {
  message: string;
  detail?: string | null;
}

// ── Opportunity Board ─────────────────────────────────────────

export interface OpportunityPost {
  id: string;
  title: string;
  description: string;
  type: string;
  deadline: string | null;
  is_active: boolean;
  created_at: string;
}

export interface OpportunityCreate {
  title: string;
  description: string;
  type: string;
  deadline?: string;
}

// ── Stats (computed by admin, not DB table) ───────────────────

export interface DashboardStats {
  total_students: number;
  active_students: number;
  total_courses: number;
  total_lessons: number;
  lessons_completed_today: number;
  new_enrollments_this_week: number;
}
