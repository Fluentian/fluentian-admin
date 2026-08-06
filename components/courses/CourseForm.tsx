'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProficiencyLevel, CourseCreate, CourseUpdate, Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguages } from "@/lib/hooks/useLanguages";
import { useEffect } from "react";

const LEVELS: ProficiencyLevel[] = ['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

const LEVEL_LABELS: Record<string, string> = {
  a0: "A0 - Absolute Beginner",
  a1: "A1 - Beginner",
  a2: "A2 - Elementary",
  b1: "B1 - Intermediate",
  b2: "B2 - Upper Intermediate",
  c1: "C1 - Advanced",
  c2: "C2 - Mastery",
};

const courseSchema = z.object({
  code: z.string().min(2).max(50).regex(/^[A-Z0-9_]+$/, "Uppercase and underscores only"),
  level_min: z.enum(['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']),
  level_max: z.enum(['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']),
  is_published: z.boolean().default(false),
  target_language_id: z.string().min(1, "Required"),
}).refine((data) => {
  const minIdx = LEVELS.indexOf(data.level_min);
  const maxIdx = LEVELS.indexOf(data.level_max);
  return maxIdx >= minIdx;
}, {
  message: "Max level must be greater than or equal to min level",
  path: ["level_max"],
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  initialData?: Course;
  onSubmit: (data: CourseFormValues) => void;
  isLoading?: boolean;
}

export function CourseForm({ initialData, onSubmit, isLoading }: CourseFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: initialData?.code ?? "",
      level_min: initialData?.level_min ?? "a1",
      level_max: initialData?.level_max ?? "a2",
      is_published: initialData?.is_published ?? false,
      target_language_id: initialData?.target_language_id ?? "",
    },
  });

  const { data: languages, isLoading: isLoadingLangs } = useLanguages();
  const french = languages?.find((language) => language.iso_code.toLowerCase() === 'fr');

  // Fluentian always teaches French. Other languages explain the French lesson.
  useEffect(() => {
    if (french && watch("target_language_id") !== french.id) {
      setValue("target_language_id", french.id);
    }
  }, [french, setValue, watch]);

  const levelMin = watch("level_min");
  const levelMax = watch("level_max");
  const isPublished = watch("is_published");

  return (
    <Card className="max-w-[640px] border-none shadow-sm mx-auto">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Course Code</Label>
            <Input 
              id="code" 
              placeholder="e.g. FR_A1_BASICS" 
              {...register("code")} 
              className={errors.code ? "border-danger" : ""}
            />
            <p className="text-[12px] text-text-muted">Use uppercase with underscores. Must be unique.</p>
            {errors.code && <p className="text-[12px] text-danger">{errors.code.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Level Minimum</Label>
              <Select 
                value={levelMin} 
                onValueChange={(val) => setValue("level_min", val as ProficiencyLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(l => (
                    <SelectItem key={l} value={l}>{LEVEL_LABELS[l]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level Maximum</Label>
              <Select 
                value={levelMax} 
                onValueChange={(val) => setValue("level_max", val as ProficiencyLevel)}
              >
                <SelectTrigger className={errors.level_max ? "border-danger" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(l => (
                    <SelectItem key={l} value={l}>{LEVEL_LABELS[l]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.level_max && <p className="text-[12px] text-danger">{errors.level_max.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Language being taught</Label>
            <Select 
              value={watch("target_language_id")} 
              onValueChange={(val) => setValue("target_language_id", val)}
              disabled={isLoadingLangs || Boolean(french)}
            >
              <SelectTrigger className={errors.target_language_id ? "border-danger" : ""}>
                <SelectValue placeholder={isLoadingLangs ? "Loading languages..." : "Select language"} />
              </SelectTrigger>
              <SelectContent>
                {french && (
                  <SelectItem key={french.id} value={french.id}>
                    French ({french.native_name})
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-[12px] leading-5 text-text-muted">
              Fluentian teaches French. Add Amharic or Afaan Oromo explanations from each lesson&apos;s Languages tab.
            </p>
            {errors.target_language_id && <p className="text-[12px] text-danger">{errors.target_language_id.message}</p>}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
            <div className="space-y-0.5">
              <Label className="text-[14px]">Publish this course</Label>
              <p className="text-[12px] text-text-muted">Students can only see published courses.</p>
            </div>
            <Switch 
              checked={isPublished} 
              onCheckedChange={(val) => setValue("is_published", val)} 
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" className="h-10 px-8" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Course"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
