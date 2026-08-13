'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Languages, Save } from 'lucide-react';
import { toast } from 'sonner';
import { coursesApi } from '@/lib/api/courses';
import { useLanguages } from '@/lib/hooks/useLanguages';
import { MetadataTranslationUpdate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export function MetadataTranslationsEditor({ ownerType, ownerId }: { ownerType: 'course' | 'unit'; ownerId: string }) {
  const queryClient = useQueryClient();
  const { data: languages } = useLanguages();
  const available = useMemo(() => (languages ?? []).filter((l) => l.is_active && !['fr', 'en'].includes(l.iso_code.toLowerCase())), [languages]);
  const [languageId, setLanguageId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const translationsQuery = useQuery({
    queryKey: ['metadata-translations', ownerType, ownerId],
    queryFn: () => ownerType === 'course' ? coursesApi.getTranslations(ownerId) : coursesApi.getUnitTranslations(ownerId),
    enabled: !!ownerId,
  });
  useEffect(() => { if (!languageId && available.length) setLanguageId(available[0].id); }, [available, languageId]);
  useEffect(() => {
    const current = translationsQuery.data?.find((item) => item.language_id === languageId);
    setTitle(current?.title ?? ''); setDescription(current?.description ?? ''); setPublished(current?.is_published ?? false);
  }, [languageId, translationsQuery.data]);
  const save = useMutation({
    mutationFn: (data: MetadataTranslationUpdate) => ownerType === 'course'
      ? coursesApi.saveTranslation(ownerId, languageId, data)
      : coursesApi.saveUnitTranslation(ownerId, languageId, data),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['metadata-translations', ownerType, ownerId] }); toast.success('Translation saved'); },
    onError: () => toast.error('Could not save translation'),
  });
  if (!available.length) return null;
  return <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-5 space-y-4">
    <div className="flex items-center gap-2"><Languages size={16} className="text-primary" /><p className="font-semibold">Explanation-language translation</p></div>
    <Select value={languageId} onValueChange={setLanguageId}><SelectTrigger><SelectValue placeholder="Choose language" /></SelectTrigger><SelectContent>{available.map((language) => <SelectItem key={language.id} value={language.id}>{language.native_name} · {language.english_name}</SelectItem>)}</SelectContent></Select>
    <div className="space-y-2"><Label>Translated title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title in the learner's language" /></div>
    <div className="space-y-2"><Label>Translated description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional explanation in the learner's language" /></div>
    <div className="flex items-center justify-between"><Label>Publish translation</Label><Switch checked={published} onCheckedChange={setPublished} /></div>
    <Button disabled={save.isPending || title.trim().length < 2} onClick={() => save.mutate({ title: title.trim(), description, is_published: published })}><Save size={15} className="mr-2" />{save.isPending ? 'Saving…' : 'Save translation'}</Button>
  </div>;
}
