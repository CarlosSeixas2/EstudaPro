import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./taskcard";
import type { Task, TaskStatus, TaskTag } from "@/components/pages/tasks";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  tagColors: Record<TaskTag, string>;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  tagColors,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Card
      className={`transition-colors ${
        isOver ? "ring-2 ring-primary ring-opacity-50" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          {title}
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} tagColors={tagColors} />
            ))}
          </SortableContext>
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-muted rounded-lg">
              Drop tasks here
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
