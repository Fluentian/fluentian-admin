'use client';
import { useEffect, useState } from 'react';
import { exploreApi, CultureStory, CultureStoryInput } from '@/lib/api/explore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const empty: CultureStoryInput = { title: '', location: '', category: '', sequence_no: 0, is_published: false, media: [], paragraphs: [] };
export default function ExploreContentPage() {
  const [stories, setStories] = useState<CultureStory[]>([]); const [editing, setEditing] = useState<string>(); const [form, setForm] = useState(empty); const [media, setMedia] = useState('[]'); const [paragraphs, setParagraphs] = useState('[]'); const [error, setError] = useState('');
  const load = () => exploreApi.list().then(setStories).catch(() => setError('Could not load Explore content.'));
  useEffect(() => { exploreApi.list().then(setStories).catch(() => setError('Could not load Explore content.')); }, []);
  const edit = (story: CultureStory) => { setEditing(story.id); setForm(story); setMedia(JSON.stringify(story.media, null, 2)); setParagraphs(JSON.stringify(story.paragraphs, null, 2)); };
  const reset = () => { setEditing(undefined); setForm(empty); setMedia('[]'); setParagraphs('[]'); setError(''); };
  const save = async () => { try { const payload = {...form, media: JSON.parse(media), paragraphs: JSON.parse(paragraphs)}; editing ? await exploreApi.update(editing, payload) : await exploreApi.create(payload); reset(); load(); } catch { setError('Check the JSON and required fields, then try again.'); } };
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Explore Content</h1><p className="text-text-muted">Every post, image, carousel order, and translation shown in the app comes from here.</p></div>
    {error && <p className="text-danger">{error}</p>}<div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle>{editing ? 'Edit story' : 'New story'}</CardTitle></CardHeader><CardContent className="space-y-3">
      <Input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><Input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/><Input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/><Input type="number" placeholder="Order" value={form.sequence_no} onChange={e=>setForm({...form,sequence_no:Number(e.target.value)})}/>
      <label className="flex gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Published</label><label className="text-sm font-semibold">Media JSON (add multiple images for a swipeable carousel)</label><Textarea className="min-h-40 font-mono" value={media} onChange={e=>setMedia(e.target.value)}/><label className="text-sm font-semibold">Translated paragraphs JSON</label><Textarea className="min-h-40 font-mono" value={paragraphs} onChange={e=>setParagraphs(e.target.value)}/><div className="flex gap-2"><Button onClick={save}>Save</Button>{editing && <Button variant="outline" onClick={reset}>Cancel</Button>}</div>
    </CardContent></Card><div className="space-y-3">{stories.map(s=><Card key={s.id}><CardContent className="p-4 flex items-center gap-3"><div className="flex-1 min-w-0"><p className="font-bold truncate">{s.title}</p><p className="text-sm text-text-muted">{s.media.length} media · {s.is_published?'Published':'Draft'}</p></div><Button variant="outline" onClick={()=>edit(s)}>Edit</Button><Button variant="outline" onClick={async()=>{if(confirm('Delete this story?')){await exploreApi.remove(s.id);load();}}}>Delete</Button></CardContent></Card>)}</div></div></div>;
}
