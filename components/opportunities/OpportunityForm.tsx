'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { OpportunityCreate, OpportunityPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const opportunitySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  type: z.string().min(1, "Required"),
  deadline: z.string().optional(),
});

type OpportunityFormValues = z.infer<typeof opportunitySchema>;

interface OpportunityFormProps {
  initialData?: OpportunityPost;
  onSubmit: (data: OpportunityFormValues) => void;
  isLoading?: boolean;
}

export function OpportunityForm({ initialData, onSubmit, isLoading }: OpportunityFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      type: initialData?.type ?? "scholarship",
      deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : "",
    },
  });

  const [isCustomType, setIsCustomType] = useState(false);
  const [customTypeValue, setCustomTypeValue] = useState("");

  const type = watch("type");

  useEffect(() => {
    if (initialData && !['scholarship', 'internship', 'event', 'job'].includes(initialData.type)) {
      setIsCustomType(true);
      setCustomTypeValue(initialData.type);
      setValue("type", "other");
    }
  }, [initialData, setValue]);

  const handleFormSubmit = (data: OpportunityFormValues) => {
    const finalData = {
      ...data,
      type: isCustomType ? customTypeValue : data.type
    };
    onSubmit(finalData);
  };

  return (
    <Card className="max-w-[640px] border-none shadow-sm mx-auto">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Full-ride Scholarship for B1 Students" 
              {...register("title")} 
              className={errors.title ? "border-danger" : ""}
            />
            {errors.title && <p className="text-[12px] text-danger">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the opportunity, eligibility criteria, and how to apply..." 
              rows={5}
              {...register("description")} 
              className={errors.description ? "border-danger" : ""}
            />
            {errors.description && <p className="text-[12px] text-danger">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={type} 
                onValueChange={(val) => setValue("type", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="job">Job Opening</SelectItem>
                  <SelectItem value="other">Other...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'other' ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label htmlFor="customType">Specify Type</Label>
                <Input 
                  id="customType" 
                  placeholder="e.g. Workshop, Competition..." 
                  value={customTypeValue}
                  onChange={(e) => {
                    setCustomTypeValue(e.target.value);
                    setIsCustomType(true);
                  }}
                  className={!customTypeValue && isCustomType ? "border-danger" : ""}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input 
                  id="deadline" 
                  type="date"
                  {...register("deadline")} 
                />
              </div>
            )}
          </div>

          {type === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input 
                id="deadline" 
                type="date"
                {...register("deadline")} 
              />
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" className="h-10 px-8" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post Opportunity"}
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
