import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskTag } from "@/components/pages/tasks";

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
      className={`cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging ? "opacity-50 rotate-3 shadow-lg" : ""
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
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 rounded"
          >
            <GripVertical className="h-4 w-4" />
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
