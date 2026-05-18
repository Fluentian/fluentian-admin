'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UnitKind } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const unitSchema = z.object({
  title: z.string().min(2, "Title is too short").max(255),
  unit_kind: z.enum(['core', 'practice', 'story', 'checkpoint']),
  unit_no: z.coerce.number().min(1, "Unit number must be at least 1"),
});

type UnitFormValues = z.infer<typeof unitSchema>;

interface UnitFormProps {
  initialData?: any;
  onSubmit: (data: UnitFormValues) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function UnitForm({ initialData, onSubmit, isLoading, onCancel }: UnitFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      unit_kind: initialData?.unit_kind ?? "core",
      unit_no: initialData?.unit_no ?? 1,
    },
  });

  const unitKind = watch("unit_kind");

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Unit Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Greetings and Basics" 
              {...register("title")} 
              className={errors.title ? "border-danger" : ""}
            />
            {errors.title && <p className="text-[12px] text-danger">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Unit Type</Label>
              <Select 
                value={unitKind} 
                onValueChange={(val) => setValue("unit_kind", val as UnitKind)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core Learning</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="checkpoint">Checkpoint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_no">Unit Number</Label>
              <Input 
                id="unit_no" 
                type="number"
                {...register("unit_no")} 
                className={errors.unit_no ? "border-danger" : ""}
              />
              {errors.unit_no && <p className="text-[12px] text-danger">{errors.unit_no.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" className="h-10 px-8" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Unit"}
            </Button>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
