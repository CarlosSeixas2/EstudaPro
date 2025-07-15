import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./taskcard";
import type { Task, TaskStatus, TaskTag } from "@/types/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Zap, ListTodo } from "lucide-react";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  tagColors: Record<TaskTag, string>;
}

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-red-500/5 dark:bg-red-900/10 border-red-500/10",
  "in-progress": "bg-yellow-500/5 dark:bg-yellow-900/10 border-yellow-500/10",
  Feito:
    "bg-green-100 dark:bg-green-900/20 border-green-100 dark:border-green-800/50",
};

// 2. Mapeamento do status para o componente do ícone
const statusIcons: Record<TaskStatus, React.ElementType> = {
  todo: ListTodo,
  "in-progress": Zap,
  Feito: CheckCircle2,
};

export function KanbanColumn({
  title,
  status,
  tasks,
  tagColors,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // 3. Seleciona o ícone correto com base no status
  const Icon = statusIcons[status];

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        statusColors[status],
        isOver
          ? "ring-2 ring-primary ring-opacity-50 scale-[1.02] shadow-lg"
          : "hover:shadow-md"
      )}
    >
      <CardHeader className="pb-3">
        {/* 4. Adiciona o ícone ao título da coluna */}
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
          </div>
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
          className={`space-y-3 min-h-[200px] transition-all duration-200 rounded-lg ${
            isOver ? "bg-primary/5 p-2" : ""
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
                "Solte o item aqui"
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
