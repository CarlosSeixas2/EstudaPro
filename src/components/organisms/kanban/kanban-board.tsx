import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "@/components/organisms/kanban/kanbancolumn";
import { TaskCard } from "@/components/organisms/kanban/taskcard";
import type { Task, TaskStatus, TaskTag } from "@/types/types";

const columns = [
  { id: "todo", title: "Pendente", status: "todo" as TaskStatus },
  {
    id: "in-progress",
    title: "Em andamento",
    status: "in-progress" as TaskStatus,
  },
  { id: "Feito", title: "Feito", status: "Feito" as TaskStatus },
];

interface KanbanBoardProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  activeTask: Task | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  tagColors: Record<TaskTag, string>;
}

export const KanbanBoard = ({
  tasks,
  onTaskStatusChange,
  activeTask,
  onDragStart,
  onDragEnd,
  tagColors,
}: KanbanBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            status={column.status}
            tasks={getTasksByStatus(column.status)}
            tagColors={tagColors}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} tagColors={tagColors} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
