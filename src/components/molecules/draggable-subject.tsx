import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subject } from "@/types/types";

interface DraggableSubjectProps {
  subject: Subject;
  onEdit: () => void;
  onRemove: () => void;
}

export function DraggableSubject({
  subject,
  onEdit,
  onRemove,
}: DraggableSubjectProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-${subject.id}`,
    data: { subject, fromLibrary: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "group/libitem relative flex items-center gap-3 p-3.5 rounded-lg bg-background border cursor-grab active:cursor-grabbing transition-all duration-200",
        isDragging && "opacity-50 shadow-lg scale-105"
      )}
    >
      <div
        className="w-5 h-5 rounded-md flex-shrink-0"
        style={{ backgroundColor: subject.color }}
      />
      <span className="font-medium text-sm flex-1 truncate">
        {subject.name}
      </span>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-0.5 opacity-0 group-hover/libitem:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
