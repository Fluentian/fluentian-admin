'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from "react";
import { useLesson, useUpdateLesson, useAddBlock, useUpdateBlock, useDeleteBlock, useAddQuestion, useUpdateQuestion, useDeleteQuestion } from "@/lib/hooks/useLessons";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { LessonForm } from "@/components/lessons/LessonForm";
import { BlockEditor } from "@/components/lessons/BlockEditor";
import { QuestionEditor } from "@/components/lessons/QuestionEditor";
import { QuestionForm } from "@/components/lessons/QuestionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { LessonBlock, Question } from '@/lib/types';

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: lesson, isLoading } = useLesson(id);
  const { mutate: updateLesson, isPending: isUpdatingLesson } = useUpdateLesson();
  const { mutate: addBlock } = useAddBlock();
  const { mutate: deleteBlock } = useDeleteBlock();
  const { mutate: updateBlock } = useUpdateBlock();
  const { mutate: deleteQuestion } = useDeleteQuestion();
  const { mutate: addQuestion, isPending: addingQuestion } = useAddQuestion();
  const { mutate: updateQuestion, isPending: updatingQuestion } = useUpdateQuestion();

  const [activeTab, setActiveTab] = useState("blocks");
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center -mt-20">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-center py-12">Lesson not found.</div>;
  }

  const handleSaveLesson = (data: any) => {
    updateLesson({ id, data });
  };

  const handleAddBlock = (kind: string) => {
    addBlock({
      lessonId: id,
      data: {
        lesson_id: id,
        block_kind: kind,
        sequence_no: (lesson.blocks?.length || 0) + 1,
        block_payload: kind === 'rich_text' ? { content: '' } : {},
      }
    });
  };

  const handleBlockUpdate = (blockId: string, payload: any) => {
    updateBlock({ blockId, data: { block_payload: payload }, lessonId: id });
  };

  const handleBlocksReorder = (newBlocks: LessonBlock[]) => {
    newBlocks.forEach((b, i) => {
      if (b.sequence_no !== i + 1) {
        updateBlock({ blockId: b.id, data: { sequence_no: i + 1 }, lessonId: id });
      }
    });
  };

  const handleQuestionSubmit = (data: any) => {
    if (editingQuestion) {
      updateQuestion({ 
        questionId: editingQuestion.id, 
        lessonId: id, 
        data 
      }, {
        onSuccess: () => {
          setIsQuestionModalOpen(false);
          setEditingQuestion(null);
        }
      });
    } else {
      addQuestion({ 
        lessonId: id, 
        data: { ...data, lesson_id: id } 
      }, {
        onSuccess: () => {
          setIsQuestionModalOpen(false);
        }
      });
    }
  };

  const openAddQuestion = () => {
    setEditingQuestion(null);
    setIsQuestionModalOpen(true);
  };

  const openEditQuestion = (questionId: string) => {
    const q = lesson.questions?.find(x => x.id === questionId);
    if (q) {
      setEditingQuestion(q);
      setIsQuestionModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px-64px)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ChevronLeft size={18} />
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-[20px] font-bold text-text-primary leading-tight">{lesson.title}</h1>
            <p className="text-[12px] text-text-muted">Editor mode</p>
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <aside className="w-[320px] shrink-0 sticky top-24">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <LessonForm 
              initialData={lesson} 
              onSubmit={handleSaveLesson} 
              isLoading={isUpdatingLesson}
            />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-white border border-border rounded-xl p-1 shadow-sm inline-flex">
              <TabsList className="bg-transparent border-none">
                <TabsTrigger 
                  value="blocks" 
                  className="px-6 py-2 text-[13px] font-semibold data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
                >
                  Content Blocks
                </TabsTrigger>
                <TabsTrigger 
                  value="questions" 
                  className="px-6 py-2 text-[13px] font-semibold data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
                >
                  Quiz Questions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="blocks" className="mt-0 outline-none">
              <BlockEditor 
                blocks={lesson.blocks || []} 
                onBlocksChange={handleBlocksReorder}
                onAddBlock={handleAddBlock}
                onDeleteBlock={(blockId) => deleteBlock({ blockId, lessonId: id })}
                onUpdateBlock={handleBlockUpdate}
              />
            </TabsContent>

            <TabsContent value="questions" className="mt-0 outline-none">
              <QuestionEditor 
                questions={lesson.questions || []} 
                onAddQuestion={openAddQuestion}
                onDeleteQuestion={(questionId) => deleteQuestion({ questionId, lessonId: id })}
                onEditQuestion={openEditQuestion}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <QuestionForm 
              initialData={editingQuestion || { sequence_no: (lesson.questions?.length || 0) + 1 }}
              onSubmit={handleQuestionSubmit}
              isLoading={addingQuestion || updatingQuestion}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
