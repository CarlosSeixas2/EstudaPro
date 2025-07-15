import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ScheduledItem } from "@/types/types";
import { SortableScheduledItem } from "@/components/molecules/sortable-scheduled-item";

interface DayColumnProps {
  day: string;
  items: ScheduledItem[];
}

export function DayColumn({ day, items }: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: day });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "flex flex-col min-h-[350px] transition-colors duration-200",
        isOver ? "bg-primary/5" : "bg-muted/30"
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-base font-bold">{day}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 p-2">
        <SortableContext
          items={items.map((i) => i.uniqueId)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableScheduledItem key={item.uniqueId} item={item} />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg p-4">
            Arraste uma matéria aqui
          </div>
        )}
      </CardContent>
    </Card>
  );
}
