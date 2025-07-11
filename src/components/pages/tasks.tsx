import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { KanbanColumn } from "@/components/organisms/kanban/kanbancolumn";

export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskTag =
  | "Design"
  | "Bug"
  | "Feature"
  | "Enhancement"
  | "Documentation";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  tag?: TaskTag;
  createdAt: Date;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design landing page mockup",
    description:
      "Create wireframes and high-fidelity mockups for the new landing page",
    status: "todo",
    tag: "Design",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Fix authentication bug",
    description: "Users are unable to log in with Google OAuth",
    status: "in-progress",
    tag: "Bug",
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "Implement dark mode",
    description: "Add theme toggle functionality across the application",
    status: "done",
    tag: "Feature",
    createdAt: new Date("2024-01-13"),
  },
  {
    id: "4",
    title: "Update API documentation",
    description: "Document new endpoints and update existing ones",
    status: "todo",
    tag: "Documentation",
    createdAt: new Date("2024-01-12"),
  },
];

const columns = [
  { id: "todo", title: "To Do", status: "todo" as TaskStatus },
  {
    id: "in-progress",
    title: "In Progress",
    status: "in-progress" as TaskStatus,
  },
  { id: "done", title: "Done", status: "done" as TaskStatus },
];

const tagColors: Record<TaskTag, string> = {
  Design:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Bug: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Feature: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Enhancement:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Documentation:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    tag: "" as TaskTag | "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || undefined,
      status: newTask.status,
      tag: newTask.tag || undefined,
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, task]);
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      tag: "",
    });
    setIsCreateDialogOpen(false);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Project Board
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your tasks efficiently
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter task description (optional)"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newTask.status}
                        onValueChange={(value: TaskStatus) =>
                          setNewTask((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tag">Tag (Optional)</Label>
                      <Select
                        value={newTask.tag}
                        onValueChange={(value: TaskTag) =>
                          setNewTask((prev) => ({ ...prev, tag: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Bug">Bug</SelectItem>
                          <SelectItem value="Feature">Feature</SelectItem>
                          <SelectItem value="Enhancement">
                            Enhancement
                          </SelectItem>
                          <SelectItem value="Documentation">
                            Documentation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTask}>Create Task</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="container mx-auto px-4 py-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
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
              <Card className="w-80 opacity-90 rotate-3 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm leading-tight">
                      {activeTask.title}
                    </h3>
                  </div>
                  {activeTask.tag && (
                    <Badge
                      variant="secondary"
                      className={`w-fit text-xs ${tagColors[activeTask.tag]}`}
                    >
                      {activeTask.tag}
                    </Badge>
                  )}
                </CardHeader>
                {activeTask.description && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {activeTask.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
