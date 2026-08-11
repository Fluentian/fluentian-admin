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
import { Loader2, ImageIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { mediaApi } from "@/lib/api/media";
import { toast } from "sonner";

const opportunitySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  type: z.string().min(1, "Required"),
  deadline: z.string().optional(),
  image_url: z.string().optional(),
  cta_url: z.union([z.literal(""), z.string().url("Enter a valid website URL")]).optional(),
  cta_label: z.string().max(80, "CTA label must be 80 characters or fewer").optional(),
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
      image_url: initialData?.image_url ?? "",
      cta_url: initialData?.cta_url ?? "",
      cta_label: initialData?.cta_label ?? "",
    },
  });

  const [isCustomType, setIsCustomType] = useState(false);
  const [customTypeValue, setCustomTypeValue] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const type = watch("type");
  const imageUrl = watch("image_url");

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const asset = await mediaApi.upload(file);
      setValue("image_url", asset.url);
    } catch (error) {
      toast.error("Could not upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

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
      type: isCustomType ? customTypeValue.trim() : data.type,
      deadline: data.deadline || undefined,
      image_url: data.image_url?.trim() || undefined,
      cta_url: data.cta_url?.trim() || undefined,
      cta_label: data.cta_label?.trim() || undefined,
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

          <div className="space-y-2">
            <Label>Image (optional)</Label>
            {imageUrl ? (
              <div className="relative w-full max-w-[280px]">
                <img
                  src={imageUrl}
                  alt=""
                  className="h-40 w-full rounded-lg border object-cover"
                />
                <button
                  type="button"
                  onClick={() => setValue("image_url", "")}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex h-28 w-full max-w-[280px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground hover:border-primary hover:text-primary">
                {isUploadingImage ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ImageIcon size={20} />
                    <span className="text-[12px]">Click to upload an image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={isUploadingImage}
                  onChange={handleImageSelect}
                />
              </label>
            )}
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta_url">CTA Website (Optional)</Label>
              <Input
                id="cta_url"
                type="url"
                placeholder="https://example.com/apply"
                {...register("cta_url")}
                className={errors.cta_url ? "border-danger" : ""}
              />
              {errors.cta_url && <p className="text-[12px] text-danger">{errors.cta_url.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_label">CTA Button Label (Optional)</Label>
              <Input
                id="cta_label"
                placeholder="Apply on website"
                {...register("cta_label")}
                className={errors.cta_label ? "border-danger" : ""}
              />
              {errors.cta_label && <p className="text-[12px] text-danger">{errors.cta_label.message}</p>}
            </div>
          </div>

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
