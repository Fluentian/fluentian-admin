'use client';

import { LessonBlock } from "@/lib/types";
import { BlockCard } from "./BlockCard";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Type, 
  BookMarked, 
  Languages, 
  Lightbulb 
} from "lucide-react";

// I need to import DropdownMenu components from UI
import { 
  DropdownMenu as DropdownRoot,
  DropdownMenuTrigger as DropdownTrigger,
  DropdownMenuContent as DropdownContent,
  DropdownMenuItem as DropdownItem
} from "@/components/ui/dropdown-menu";

interface BlockEditorProps {
  blocks: LessonBlock[];
  onBlocksChange: (blocks: LessonBlock[]) => void;
  onAddBlock: (kind: string) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, payload: any) => void;
}

export function BlockEditor({ 
  blocks, 
  onBlocksChange, 
  onAddBlock, 
  onDeleteBlock, 
  onUpdateBlock 
}: BlockEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      // Update sequence_no for all blocks
      const sequencedBlocks = newBlocks.map((b, i) => ({ ...b, sequence_no: i + 1 }));
      onBlocksChange(sequencedBlocks);
    }
  };

  const blockTypes = [
    { kind: 'rich_text', label: 'Rich Text', icon: Type },
    { kind: 'grammar_note', label: 'Grammar Note', icon: BookMarked },
    { kind: 'sentence_pair', label: 'Sentence Pair', icon: Languages },
    { kind: 'ai_hint', label: 'AI Hint', icon: Lightbulb },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-text-primary">Content Blocks</h2>
        <DropdownRoot>
          <DropdownTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary/5">
              <Plus size={14} />
              Add Block
            </Button>
          </DropdownTrigger>
          <DropdownContent align="end" className="w-48">
            {blockTypes.map((t) => (
              <DropdownItem key={t.kind} onClick={() => onAddBlock(t.kind)} className="gap-2 cursor-pointer">
                <t.icon size={14} className="text-text-muted" />
                <span>{t.label}</span>
              </DropdownItem>
            ))}
          </DropdownContent>
        </DropdownRoot>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {blocks.sort((a, b) => a.sequence_no - b.sequence_no).map((block) => (
              <BlockCard 
                key={block.id} 
                block={block} 
                onDelete={onDeleteBlock}
                onUpdate={onUpdateBlock}
              />
            ))}
            
            {blocks.length === 0 && (
              <div className="p-12 border-2 border-dashed border-border rounded-xl text-center bg-gray-50/30">
                <p className="text-text-muted text-[14px] mb-4">This lesson has no content blocks yet.</p>
                <p className="text-text-muted text-[12px]">Add a block to get started with your lesson content.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
