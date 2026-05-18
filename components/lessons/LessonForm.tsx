'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lesson, LessonCreate, LessonUpdate, LessonKind } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getLessonKindLabel } from "@/lib/utils";

const lessonKinds: LessonKind[] = [
  'grammar_explainer', 'dialogue', 'vocabulary', 'pronunciation',
  'listening', 'reading', 'writing', 'speaking',
  'cultural_bridge', 'exam_drill', 'roleplay_simulation'
];

const lessonSchema = z.object({
  title: z.string().min(2).max(100),
  lesson_kind: z.enum([
    'grammar_explainer', 'dialogue', 'vocabulary', 'pronunciation',
    'listening', 'reading', 'writing', 'speaking',
    'cultural_bridge', 'exam_drill', 'roleplay_simulation'
  ]),
  estimated_minutes: z.coerce.number().min(1).max(120),
  xp_reward: z.coerce.number().min(0).max(1000),
  sequence_no: z.coerce.number().min(1),
  is_published: z.boolean().default(false),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  initialData?: Lesson;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function LessonForm({ initialData, onSubmit, isLoading }: LessonFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      lesson_kind: initialData?.lesson_kind ?? "grammar_explainer",
      estimated_minutes: initialData?.estimated_minutes ?? 5,
      xp_reward: initialData?.xp_reward ?? 10,
      sequence_no: initialData?.sequence_no ?? 1,
      is_published: initialData?.is_published ?? false,
    },
  });

  const lessonKind = watch("lesson_kind");
  const isPublished = watch("is_published");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-[14px] font-bold text-text-muted uppercase tracking-wider">Lesson Info</h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            {...register("title")} 
            className={errors.title ? "border-danger" : ""}
          />
          {errors.title && <p className="text-[12px] text-danger">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Lesson Type</Label>
          <Select 
            value={lessonKind} 
            onValueChange={(val) => setValue("lesson_kind", val as LessonKind, { shouldDirty: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lessonKinds.map(k => (
                <SelectItem key={k} value={k}>{getLessonKindLabel(k)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimated_minutes">Estimated Time</Label>
            <div className="relative">
              <Input 
                id="estimated_minutes" 
                type="number" 
                {...register("estimated_minutes")} 
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-[12px]">min</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="xp_reward">XP Reward</Label>
            <div className="relative">
              <Input 
                id="xp_reward" 
                type="number" 
                {...register("xp_reward")} 
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">⚡</span>
              <style jsx>{`
                input { padding-left: 1.75rem; }
              `}</style>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sequence_no">Sequence Number</Label>
          <Input 
            id="sequence_no" 
            type="number" 
            {...register("sequence_no")} 
          />
        </div>
      </section>

      <section className="space-y-4 pt-6 border-t">
        <h3 className="text-[14px] font-bold text-text-muted uppercase tracking-wider">Status</h3>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Switch 
              checked={isPublished} 
              onCheckedChange={(val) => setValue("is_published", val, { shouldDirty: true })} 
            />
            <span className="text-[14px] font-medium">Published</span>
          </div>
          <StatusBadge status={isPublished ? 'published' : 'draft'} />
        </div>
      </section>

      <div className="pt-6">
        <Button 
          type="submit" 
          className="w-full h-11 text-[15px] font-bold" 
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner className="text-white mr-2" /> : (initialData ? "Save Changes" : "Create Lesson")}
        </Button>
      </div>
    </form>
  );
}
