'use client';

import { LessonBlock } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GripVertical, 
  Trash2, 
  Type, 
  BookMarked, 
  Languages, 
  MessageSquare, 
  Volume2, 
  Image as ImageIcon, 
  Lightbulb, 
  Globe 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface BlockCardProps {
  block: LessonBlock;
  onDelete: (id: string) => void;
  onUpdate: (id: string, payload: any) => void;
}

export function BlockCard({ block, onDelete, onUpdate }: BlockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderPayloadEditor = () => {
    const p = block.block_payload as any;

    switch (block.block_kind) {
      case 'rich_text':
        return (
          <Textarea 
            value={p.content ?? ""} 
            onChange={(e) => onUpdate(block.id, { ...p, content: e.target.value })}
            placeholder="Type your content here..."
            className="min-h-[100px] border-none focus-visible:ring-0 p-0 resize-none"
          />
        );
      case 'grammar_note':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-text-muted uppercase">Rule</label>
              <Textarea 
                value={p.rule ?? ""} 
                onChange={(e) => onUpdate(block.id, { ...p, rule: e.target.value })}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-text-muted uppercase">Example (French)</label>
              <Input 
                value={p.example ?? ""} 
                onChange={(e) => onUpdate(block.id, { ...p, example: e.target.value })}
              />
            </div>
          </div>
        );
      case 'sentence_pair':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-text-muted uppercase">French</label>
              <Input 
                value={p.target ?? ""} 
                onChange={(e) => onUpdate(block.id, { ...p, target: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-text-muted uppercase">Translation</label>
              <Input 
                value={p.base ?? ""} 
                onChange={(e) => onUpdate(block.id, { ...p, base: e.target.value })}
              />
            </div>
          </div>
        );
      case 'ai_hint':
        return (
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-text-muted uppercase italic flex items-center gap-1">
              <Lightbulb size={10} /> AI Tutor Hint
            </label>
            <Textarea 
              value={p.hint ?? ""} 
              onChange={(e) => onUpdate(block.id, { ...p, hint: e.target.value })}
              placeholder="E.g. Think about the gender of the noun..."
            />
          </div>
        );
      default:
        return <p className="text-[12px] text-text-muted">Editor for {block.block_kind} not yet implemented.</p>;
    }
  };

  const getIcon = () => {
    switch (block.block_kind) {
      case 'rich_text': return Type;
      case 'grammar_note': return BookMarked;
      case 'sentence_pair': return Languages;
      case 'dialogue_script': return MessageSquare;
      case 'audio_clip': return Volume2;
      case 'image': return ImageIcon;
      case 'ai_hint': return Lightbulb;
      case 'cultural_note': return Globe;
      default: return Type;
    }
  };

  const Icon = getIcon();

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "group relative",
        isDragging && "z-50 opacity-50"
      )}
    >
      <Card className="border-border hover:border-primary/50 transition-colors shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50 border-b">
          <div className="flex items-center gap-2">
            <button 
              {...attributes} 
              {...listeners} 
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded text-text-muted"
            >
              <GripVertical size={16} />
            </button>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white border rounded text-[10px] font-bold text-text-muted uppercase">
              <Icon size={12} />
              {block.block_kind.replace('_', ' ')}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-text-muted hover:text-danger hover:bg-danger/10"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
        <CardContent className="p-5">
          {renderPayloadEditor()}
        </CardContent>
      </Card>
    </div>
  );
}
