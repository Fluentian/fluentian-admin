/**
 * API Schemas with Zod
 * Validates API requests and responses, generates TypeScript types
 */

import { z } from 'zod';

// ── Auth Schemas ────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginRequest = z.infer<typeof LoginSchema>;

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.literal('bearer'),
  user: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email(),
    role: z.enum(['student', 'tutor', 'admin', 'moderator']),
  }),
});
export type TokenResponse = z.infer<typeof TokenResponseSchema>;

// ── Pagination ──────────────────────────────────────────────

export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(10),
});
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

// ── Course Schemas ──────────────────────────────────────────

export const CourseCreateSchema = z.object({
  target_language_id: z.string().uuid('Invalid language ID'),
  code: z.string().min(1).max(50),
  level_min: z.enum(['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']),
  level_max: z.enum(['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']),
});
export type CourseCreateRequest = z.infer<typeof CourseCreateSchema>;

export const CourseSchema = CourseCreateSchema.extend({
  id: z.string().uuid(),
  is_published: z.boolean(),
  created_at: z.string().datetime(),
});
export type Course = z.infer<typeof CourseSchema>;

// ── Lesson Schemas ──────────────────────────────────────────

export const LessonCreateSchema = z.object({
  course_id: z.string().uuid(),
  unit_id: z.string().uuid(),
  lesson_kind: z.enum([
    'grammar_explainer', 'dialogue', 'vocabulary', 'pronunciation',
    'listening', 'reading', 'writing', 'speaking',
    'cultural_bridge', 'exam_drill', 'roleplay_simulation'
  ]),
  sequence_no: z.number().int().min(1),
  title: z.string().min(1).max(200),
  estimated_minutes: z.number().int().min(1).optional(),
  xp_reward: z.number().int().min(0).optional(),
});
export type LessonCreateRequest = z.infer<typeof LessonCreateSchema>;

export const LessonSchema = LessonCreateSchema.extend({
  id: z.string().uuid(),
  is_published: z.boolean(),
  created_at: z.string().datetime(),
});
export type Lesson = z.infer<typeof LessonSchema>;

// ── Lesson Block Schemas ────────────────────────────────────

export const LessonBlockCreateSchema = z.object({
  lesson_id: z.string().uuid('Invalid lesson ID'),
  block_kind: z.string().min(1),
  sequence_no: z.number().int().min(1),
  block_payload: z.record(z.unknown()),
});
export type LessonBlockCreateRequest = z.infer<typeof LessonBlockCreateSchema>;

export const LessonBlockSchema = LessonBlockCreateSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
});
export type LessonBlock = z.infer<typeof LessonBlockSchema>;

// ── Question Schemas ────────────────────────────────────────

export const QuestionCreateSchema = z.object({
  lesson_id: z.string().uuid('Invalid lesson ID'),
  question_kind: z.enum([
    'mcq_single', 'mcq_multi', 'fill_blank', 'reorder',
    'match_pairs', 'short_text', 'translation',
    'speech_record', 'listening_comprehension', 'dictation'
  ]),
  sequence_no: z.number().int().min(1),
  prompt_payload: z.record(z.unknown()),
  grading_payload: z.record(z.unknown()),
});
export type QuestionCreateRequest = z.infer<typeof QuestionCreateSchema>;

// ── API Response Wrapper ────────────────────────────────────

export const ApiErrorSchema = z.object({
  message: z.string(),
  detail: z.string().optional(),
  error: z.string().optional(),
  status_code: z.number().int().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    items: z.array(schema),
    total: z.number().int(),
    page: z.number().int(),
    size: z.number().int(),
    pages: z.number().int(),
  });

/**
 * Validate API response and return typed data or error
 */
export const validateResponse = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string } => {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
    }
    return { success: false, error: 'Unknown validation error' };
  }
};
