import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./taskcard";
import type { Task, TaskStatus, TaskTag } from "@/pages/tasks";

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
      className={`transition-all duration-200 ${
        isOver
          ? "ring-2 ring-primary ring-opacity-50 bg-primary/5 scale-[1.02] shadow-lg border-primary/20"
          : "hover:shadow-md border-border"
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          {title}
          <span
            className={`rounded-full px-2 py-1 text-xs transition-all duration-200 ${
              isOver
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={setNodeRef}
          className={`space-y-3 min-h-[200px] transition-all duration-200 ${
            isOver ? "bg-primary/5 rounded-lg p-2" : ""
          }`}
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} tagColors={tagColors} />
            ))}
          </SortableContext>
          {tasks.length === 0 && (
            <div
              className={`flex items-center justify-center h-32 text-sm border-2 border-dashed rounded-lg transition-all duration-200 ${
                isOver
                  ? "border-primary text-primary bg-primary/10 border-solid shadow-inner"
                  : "border-muted text-muted-foreground hover:border-muted-foreground/50"
              }`}
            >
              {isOver ? (
                <div className="text-center">
                  <div className="font-medium">Drop here!</div>
                  <div className="text-xs opacity-75">Release to add task</div>
                </div>
              ) : (
                "Solte aqui"
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
