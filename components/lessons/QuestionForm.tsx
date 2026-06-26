'use client';

import { Question } from "@/lib/types";
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
import { Plus, Trash2 } from "lucide-react";

const questionSchema = z.object({
  question_kind: z.string(),
  sequence_no: z.number().min(1),
  difficulty: z.number().min(1).max(5).default(1),
  prompt: z.string().min(1, "Prompt is required"),
  options: z.array(z.string()),
  correct_answer: z.string().min(1, "Correct answer is required"),
}).superRefine((values, ctx) => {
  if (!values.question_kind.startsWith("mcq")) return;

  const filledOptions = values.options.map((option) => option.trim()).filter(Boolean);
  if (filledOptions.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Add at least two options",
      path: ["options"],
    });
  }

  if (!filledOptions.includes(values.correct_answer)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select the correct answer from the options",
      path: ["correct_answer"],
    });
  }
});

interface QuestionFormProps {
  initialData?: Partial<Question>;
  onSubmit: (_data: any) => void;
  isLoading?: boolean;
}

export function QuestionForm({ initialData, onSubmit, isLoading }: QuestionFormProps) {
  const promptPayload = (initialData?.prompt_payload as Record<string, unknown>) || {};
  const gradingPayload = (initialData?.grading_payload as Record<string, unknown>) || {};
  const initialOptionsRaw = promptPayload.options ?? promptPayload.mcqOptions;
  const initialOptions = Array.isArray(initialOptionsRaw)
    ? initialOptionsRaw.map((option) => String(option))
    : [];

  let initialCorrect = "";
  if (gradingPayload.correct_answer != null) {
    initialCorrect = String(gradingPayload.correct_answer);
  } else if (promptPayload.mcqCorrectAnswer != null) {
    initialCorrect = String(promptPayload.mcqCorrectAnswer);
  } else if (
    typeof gradingPayload.correct_index === "number" &&
    initialOptions.length > gradingPayload.correct_index
  ) {
    initialCorrect = initialOptions[gradingPayload.correct_index as number];
  }

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_kind: initialData?.question_kind || 'mcq_single',
      sequence_no: initialData?.sequence_no || 1,
      difficulty: initialData?.difficulty || 1,
      prompt:
        String(promptPayload.question || promptPayload.text || promptPayload.prompt || ""),
      options: initialOptions.length > 0 ? initialOptions : ["", ""],
      correct_answer: initialCorrect,
    },
  });

  const questionKind = form.watch("question_kind");
  const options = form.watch("options");
  const isMultipleChoice = questionKind.startsWith("mcq");
  const filledOptions = options.map((option) => option.trim()).filter(Boolean);

  const addOption = () => {
    form.setValue("options", [...options, ""], { shouldDirty: true });
  };

  const updateOption = (index: number, value: string) => {
    const nextOptions = options.map((option, optionIndex) =>
      optionIndex === index ? value : option
    );
    const currentCorrectAnswer = form.getValues("correct_answer");
    form.setValue("options", nextOptions, { shouldDirty: true, shouldValidate: true });
    if (currentCorrectAnswer && !nextOptions.map((option) => option.trim()).includes(currentCorrectAnswer)) {
      form.setValue("correct_answer", "", { shouldDirty: true, shouldValidate: true });
    }
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const removedOption = options[index]?.trim();
    const nextOptions = options.filter((_, optionIndex) => optionIndex !== index);
    form.setValue("options", nextOptions, { shouldDirty: true, shouldValidate: true });
    if (removedOption && form.getValues("correct_answer") === removedOption) {
      form.setValue("correct_answer", "", { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleSubmit = (values: z.infer<typeof questionSchema>) => {
    const cleanedOptions = values.options.map((option) => option.trim()).filter(Boolean);
    const payload = {
      question_kind: values.question_kind,
      sequence_no: values.sequence_no,
      difficulty: values.difficulty,
      prompt_payload: {
        question: values.prompt,
        text: values.prompt,
        options: values.question_kind.startsWith("mcq") ? cleanedOptions : [],
        mcqOptions: values.question_kind.startsWith("mcq") ? cleanedOptions : [],
      },
      grading_payload: {
        correct_answer: values.correct_answer,
        accepted_answers: [values.correct_answer],
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
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={(val) => field.onChange(parseInt(val, 10))} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Level 1 (Easiest)</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
                  <SelectItem value="5">Level 5 (Hardest)</SelectItem>
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

        {isMultipleChoice && (
          <FormField
            control={form.control}
            name="options"
            render={() => (
              <FormItem>
                <div className="flex items-center justify-between gap-3">
                  <FormLabel>Options</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={addOption}
                  >
                    <Plus className="h-4 w-4" />
                    Add option
                  </Button>
                </div>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          value={option}
                          placeholder={`Option ${index + 1}`}
                          onChange={(event) => updateOption(index, event.target.value)}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 text-text-muted hover:bg-danger/10 hover:text-danger"
                        onClick={() => removeOption(index)}
                        disabled={options.length <= 2}
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isMultipleChoice ? (
          <FormField
            control={form.control}
            name="correct_answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correct Answer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={filledOptions.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select from options" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filledOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
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
        )}

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
