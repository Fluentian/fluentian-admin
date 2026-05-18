'use client';

import { Question, QuestionKind } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const questionSchema = z.object({
  question_kind: z.string(),
  sequence_no: z.number().min(1),
  prompt: z.string().min(1, "Prompt is required"),
  options: z.string().optional(), // For MCQ
  correct_answer: z.string().min(1, "Correct answer is required"),
});

interface QuestionFormProps {
  initialData?: Partial<Question>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function QuestionForm({ initialData, onSubmit, isLoading }: QuestionFormProps) {
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_kind: initialData?.question_kind || 'mcq_single',
      sequence_no: initialData?.sequence_no || 1,
      prompt: (initialData?.prompt_payload as any)?.question || "",
      options: (initialData?.prompt_payload as any)?.options?.join("\n") || "",
      correct_answer: (initialData?.grading_payload as any)?.correct_answer || "",
    },
  });

  const handleSubmit = (values: z.infer<typeof questionSchema>) => {
    const payload = {
      question_kind: values.question_kind,
      sequence_no: values.sequence_no,
      prompt_payload: {
        question: values.prompt,
        options: values.options ? values.options.split("\n").filter(Boolean) : [],
      },
      grading_payload: {
        correct_answer: values.correct_answer,
      }
    };
    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question_kind"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mcq_single">Multiple Choice (Single)</SelectItem>
                  <SelectItem value="mcq_multi">Multiple Choice (Multiple)</SelectItem>
                  <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                  <SelectItem value="translation">Translation</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt / Question</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter the question text..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("question_kind").startsWith("mcq") && (
          <FormField
            control={form.control}
            name="options"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Options (One per line)</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Option A&#10;Option B&#10;Option C" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="correct_answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correct Answer</FormLabel>
              <FormControl>
                <Input {...field} placeholder="The exact correct value" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
