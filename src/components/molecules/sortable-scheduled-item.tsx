import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduledItem } from "@/types/types";

interface SortableScheduledItemProps {
  item: ScheduledItem;
  onDoubleClick: (item: ScheduledItem) => void; // Add this prop
}

export function SortableScheduledItem({
  item,
  onDoubleClick,
}: SortableScheduledItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.uniqueId, data: { item, fromLibrary: false } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onDoubleClick={() => onDoubleClick(item)} // Add this event
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg bg-card border shadow-sm touch-none cursor-pointer",
        isDragging && "opacity-60"
      )}
    >
      <div
        className="w-2 h-8 rounded-full flex-shrink-0"
        style={{ backgroundColor: item.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm break-words">{item.name}</p>
      </div>
      <div
        {...listeners}
        {...attributes}
        className="p-2 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}
