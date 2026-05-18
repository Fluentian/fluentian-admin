'use client';

import { Question } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  FileQuestion,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface QuestionEditorProps {
  questions: Question[];
  onAddQuestion: () => void;
  onDeleteQuestion: (id: string) => void;
  onEditQuestion: (id: string) => void;
}

export function QuestionEditor({ 
  questions, 
  onAddQuestion, 
  onDeleteQuestion, 
  onEditQuestion 
}: QuestionEditorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-text-primary">Quiz Questions</h2>
        <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary/5" onClick={onAddQuestion}>
          <Plus size={14} />
          Add Question
        </Button>
      </div>

      <div className="space-y-3">
        {questions.sort((a, b) => a.sequence_no - b.sequence_no).map((q) => (
          <Card key={q.id} className="border-border hover:border-primary/30 transition-colors shadow-sm group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-6 text-[12px] font-bold text-text-muted">{q.sequence_no}</div>
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-text-muted">
                  <HelpCircle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded">
                      {q.question_kind.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[14px] text-text-primary truncate font-medium">
                    {(q.prompt_payload as any).question || (q.prompt_payload as any).sentence || "Question Content"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => onEditQuestion(q.id)} className="text-primary hover:text-primary hover:bg-primary/5 h-8">
                  Edit
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteQuestion(q.id)} className="text-text-muted hover:text-danger hover:bg-danger/10 h-8 w-8">
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {questions.length === 0 && (
          <div className="p-12 border-2 border-dashed border-border rounded-xl text-center bg-gray-50/30">
            <p className="text-text-muted text-[14px] mb-4">No questions created yet.</p>
            <Button variant="outline" size="sm" onClick={onAddQuestion}>Create First Question</Button>
          </div>
        )}
      </div>
    </div>
  );
}
