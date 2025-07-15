import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskTag } from "@/pages/tasks";

interface TaskCardProps {
  task: Task;
  tagColors: Record<TaskTag, string>;
}

export function TaskCard({ task, tagColors }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging
          ? "opacity-60 rotate-6 shadow-2xl scale-105 z-50 ring-2 ring-primary/30"
          : "hover:shadow-lg hover:scale-[1.02] hover:rotate-1"
      }`}
      {...attributes}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm leading-tight flex-1 pr-2">
            {task.title}
          </h3>
          <div
            {...listeners}
            className={`transition-all p-1 -m-1 rounded hover:bg-muted group ${
              isDragging
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GripVertical
              className={`h-4 w-4 transition-transform ${
                isDragging ? "scale-110" : "group-hover:scale-110"
              }`}
            />
          </div>
        </div>
        {task.tag && (
          <Badge
            variant="secondary"
            className={`w-fit text-xs ${tagColors[task.tag]}`}
          >
            {task.tag}
          </Badge>
        )}
      </CardHeader>
      {task.description && (
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
