'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Languages, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { lessonsApi } from '@/lib/api/lessons';
import { useLanguages } from '@/lib/hooks/useLanguages';
import { Lesson, LessonBlock, LessonTranslationUpdate, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type LessonWithContent = Lesson & { blocks: LessonBlock[]; questions: Question[] };

const blockField = (block: LessonBlock) => {
  const preferred = ['content', 'rule', 'base', 'meaning', 'hint', 'explanation', 'translation'];
  return preferred.find((key) => typeof block.block_payload[key] === 'string') ?? 'content';
};

const sourceBlockText = (block: LessonBlock) => {
  const key = blockField(block);
  return String(block.block_payload[key] ?? 'No source explanation text');
};

const questionText = (question: Question) =>
  String(question.prompt_payload.question ?? question.prompt_payload.text ?? question.prompt_payload.prompt ?? '');

export function LessonTranslationsEditor({ lesson }: { lesson: LessonWithContent }) {
  const queryClient = useQueryClient();
  const { data: languages } = useLanguages();
  const { data: translations } = useQuery({
    queryKey: ['lessons', lesson.id, 'translations'],
    queryFn: () => lessonsApi.getTranslations(lesson.id),
  });
  const availableLanguages = useMemo(
    () => (languages ?? []).filter((language) =>
      language.is_active && !['fr', 'en'].includes(language.iso_code.toLowerCase())
    ),
    [languages],
  );
  const [languageId, setLanguageId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Record<string, string>>({});
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!languageId && availableLanguages.length > 0) setLanguageId(availableLanguages[0].id);
  }, [availableLanguages, languageId]);

  useEffect(() => {
    if (!languageId) return;
    const existing = translations?.find((item) => item.language_id === languageId);
    setTitle(existing?.title ?? '');
    setDescription(existing?.description ?? '');
    setPublished(existing?.is_published ?? false);
    setBlocks(Object.fromEntries(lesson.blocks.map((block) => {
      const field = blockField(block);
      return [block.id, String(existing?.block_translations?.[block.id]?.[field] ?? '')];
    })));
    setQuestions(Object.fromEntries(lesson.questions.map((question) => [
      question.id,
      String(existing?.question_translations?.[question.id]?.prompt_payload?.question ?? ''),
    ])));
    setOptions(Object.fromEntries(lesson.questions.map((question) => {
      const saved = existing?.question_translations?.[question.id]?.prompt_payload?.options;
      return [question.id, Array.isArray(saved) ? saved.join('\n') : ''];
    })));
    setCorrectAnswers(Object.fromEntries(lesson.questions.map((question) => [
      question.id,
      String(existing?.question_translations?.[question.id]?.grading_payload?.correct_answer ?? ''),
    ])));
  }, [languageId, lesson.blocks, lesson.questions, translations]);

  const selectedLanguage = availableLanguages.find((language) => language.id === languageId);
  const save = useMutation({
    mutationFn: (payload: LessonTranslationUpdate) =>
      lessonsApi.saveTranslation(lesson.id, languageId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['lessons', lesson.id, 'translations'] });
      toast.success(`${selectedLanguage?.native_name ?? 'Translation'} saved`);
    },
    onError: (error: any) => toast.error(
      error?.response?.data?.message ?? 'Could not save this lesson translation'
    ),
  });

  const handleSave = () => {
    if (!languageId || title.trim().length < 2) {
      toast.error('Choose a language and add its lesson title');
      return;
    }
    const blockTranslations = Object.fromEntries(
      lesson.blocks
        .filter((block) => blocks[block.id]?.trim())
        .map((block) => [block.id, { [blockField(block)]: blocks[block.id].trim() }]),
    );
    const questionTranslations = Object.fromEntries(
      lesson.questions
        .filter((question) => questions[question.id]?.trim() || options[question.id]?.trim() || correctAnswers[question.id]?.trim())
        .map((question) => [question.id, {
          prompt_payload: {
            ...(questions[question.id]?.trim() ? { question: questions[question.id].trim(), text: questions[question.id].trim() } : {}),
            ...(options[question.id]?.trim()
              ? { options: options[question.id].split('\n').map((item) => item.trim()).filter(Boolean) }
              : {}),
          },
          ...(correctAnswers[question.id]?.trim() ? {
            grading_payload: {
              correct_answer: correctAnswers[question.id].trim(),
              accepted_answers: [correctAnswers[question.id].trim()],
            },
          } : {}),
        }]),
    );
    save.mutate({
      title: title.trim(),
      description: description.trim(),
      block_translations: blockTranslations,
      question_translations: questionTranslations,
      is_published: published,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <Languages className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-bold text-text-primary">Explanation-language versions</h2>
            <p className="mt-1 text-[13px] leading-5 text-text-muted">
              French remains the language being taught. Translate titles, guidance, meanings, and quiz instructions into the learner&apos;s preferred language.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border bg-white p-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Explanation language</Label>
          <Select value={languageId} onValueChange={setLanguageId}>
            <SelectTrigger><SelectValue placeholder="Choose a language" /></SelectTrigger>
            <SelectContent>
              {availableLanguages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.native_name} ({language.english_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div>
            <p className="text-[13px] font-semibold">Available to learners</p>
            <p className="text-[11px] text-text-muted">Publish only when every required translation is ready.</p>
          </div>
          <Switch checked={published} onCheckedChange={setPublished} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Translated lesson title</Label>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Lesson title in the selected language" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Translated lesson description</Label>
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What the learner will learn, written in their explanation language" />
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-[14px] font-bold uppercase tracking-wide text-text-muted">Teaching content</h3>
        {lesson.blocks.map((block) => (
          <div key={block.id} className="grid gap-4 rounded-xl border bg-white p-5 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase text-text-muted">Source · {block.block_kind.replaceAll('_', ' ')}</p>
              <p className="mt-2 whitespace-pre-wrap text-[13px] leading-5">{sourceBlockText(block)}</p>
            </div>
            <div className="space-y-2">
              <Label>{selectedLanguage?.native_name ?? 'Translated explanation'}</Label>
              <Textarea value={blocks[block.id] ?? ''} onChange={(event) => setBlocks((current) => ({ ...current, [block.id]: event.target.value }))} placeholder="Translate only the explanation or meaning; keep French examples in French" />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="text-[14px] font-bold uppercase tracking-wide text-text-muted">Quiz guidance</h3>
        {lesson.questions.map((question) => (
          <div key={question.id} className="space-y-4 rounded-xl border bg-white p-5">
            <div><p className="text-[11px] font-bold uppercase text-text-muted">Source question</p><p className="mt-1 text-[13px]">{questionText(question)}</p></div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2"><Label>Translated prompt</Label><Textarea value={questions[question.id] ?? ''} onChange={(event) => setQuestions((current) => ({ ...current, [question.id]: event.target.value }))} /></div>
              <div className="space-y-2"><Label>Translated choices · one per line</Label><Textarea value={options[question.id] ?? ''} onChange={(event) => setOptions((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Leave empty when the choices must stay in French" /></div>
              <div className="space-y-2"><Label>Translated correct answer</Label><Textarea value={correctAnswers[question.id] ?? ''} onChange={(event) => setCorrectAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Required when answer choices are translated" /></div>
            </div>
          </div>
        ))}
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <Button onClick={handleSave} disabled={save.isPending || !languageId} className="gap-2 shadow-lg">
          {published ? <ShieldCheck className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {save.isPending ? 'Saving…' : published ? 'Save & publish translation' : 'Save translation draft'}
        </Button>
      </div>
    </div>
  );
}
