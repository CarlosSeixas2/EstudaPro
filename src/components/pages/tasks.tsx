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
import { Plus, PanelLeftClose, PanelLeft, FolderPlus } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { KanbanColumn } from "@/components/organisms/kanban/kanbancolumn";
import { ProjectSelector } from "@/components/organisms/kanban/projectselector";

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
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of the company website",
    color: "bg-blue-500",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    name: "Mobile App",
    description: "Development of the mobile application",
    color: "bg-green-500",
    createdAt: new Date("2024-01-08"),
  },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design landing page mockup",
    description:
      "Create wireframes and high-fidelity mockups for the new landing page",
    status: "todo",
    tag: "Design",
    createdAt: new Date("2024-01-15"),
    projectId: "1",
  },
  {
    id: "2",
    title: "Fix authentication bug",
    description: "Users are unable to log in with Google OAuth",
    status: "in-progress",
    tag: "Bug",
    createdAt: new Date("2024-01-14"),
    projectId: "1",
  },
  {
    id: "3",
    title: "Implement dark mode",
    description: "Add theme toggle functionality across the application",
    status: "done",
    tag: "Feature",
    createdAt: new Date("2024-01-13"),
    projectId: "1",
  },
  {
    id: "4",
    title: "Setup React Native project",
    description: "Initialize the mobile app project structure",
    status: "todo",
    tag: "Feature",
    createdAt: new Date("2024-01-12"),
    projectId: "2",
  },
  {
    id: "5",
    title: "Design mobile UI components",
    description: "Create reusable UI components for the mobile app",
    status: "in-progress",
    tag: "Design",
    createdAt: new Date("2024-01-11"),
    projectId: "2",
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

const projectColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
];

export default function KanbanBoard() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [currentProjectId, setCurrentProjectId] = useState<string>(
    initialProjects[0].id
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    tag: "" as TaskTag | "",
  });
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    color: projectColors[0],
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const currentProject = projects.find((p) => p.id === currentProjectId);
  const currentProjectTasks = tasks.filter(
    (task) => task.projectId === currentProjectId
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = currentProjectTasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    // Se não há zona de drop válida, não faz nada (mantém o card na posição original)
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Verifica se o destino é um status válido
    const validStatuses: TaskStatus[] = ["todo", "in-progress", "done"];
    if (!validStatuses.includes(newStatus)) {
      return; // Não faz nada se não for um status válido
    }

    // Só atualiza se o status realmente mudou
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
      projectId: currentProjectId,
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

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description || undefined,
      color: newProject.color,
      createdAt: new Date(),
    };

    setProjects((prev) => [...prev, project]);
    setCurrentProjectId(project.id);
    setNewProject({
      name: "",
      description: "",
      color: projectColors[0],
    });
    setIsCreateProjectDialogOpen(false);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return currentProjectTasks.filter((task) => task.status === status);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto px-4 py-4 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Project Board
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your projects and tasks efficiently
                </p>
              </div>
              <ProjectSelector
                projects={projects}
                currentProjectId={currentProjectId}
                onProjectChange={setCurrentProjectId}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeft className="h-4 w-4" />
                )}
              </Button>
              <Dialog
                open={isCreateProjectDialogOpen}
                onOpenChange={setIsCreateProjectDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={newProject.name}
                        onChange={(e) =>
                          setNewProject((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        value={newProject.description}
                        onChange={(e) =>
                          setNewProject((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter project description (optional)"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Project Color</Label>
                      <div className="flex gap-2 mt-2">
                        {projectColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full ${color} ${
                              newProject.color === color
                                ? "ring-2 ring-offset-2 ring-foreground"
                                : ""
                            }`}
                            onClick={() =>
                              setNewProject((prev) => ({ ...prev, color }))
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateProjectDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateProject}>
                        Create Project
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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

      {/* Kanban Board with Sidebar */}
      <main className="mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div
            className={`transition-all duration-300 ${
              isSidebarOpen ? "w-80" : "w-0 overflow-hidden"
            }`}
          >
            <Card className="h-fit sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${currentProject?.color}`}
                  />
                  {currentProject?.name}
                </CardTitle>
                {currentProject?.description && (
                  <p className="text-sm text-muted-foreground">
                    {currentProject.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Task Statistics */}
                <div>
                  <h3 className="font-medium mb-3">Task Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Tasks
                      </span>
                      <Badge variant="outline">
                        {currentProjectTasks.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        To Do
                      </span>
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        {getTasksByStatus("todo").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        In Progress
                      </span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {getTasksByStatus("in-progress").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Done
                      </span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {getTasksByStatus("done").length}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <h3 className="font-medium mb-3">Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span>
                        {currentProjectTasks.length > 0
                          ? Math.round(
                              (getTasksByStatus("done").length /
                                currentProjectTasks.length) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            currentProjectTasks.length > 0
                              ? (getTasksByStatus("done").length /
                                  currentProjectTasks.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tag Distribution */}
                <div>
                  <h3 className="font-medium mb-3">Tags</h3>
                  <div className="space-y-2">
                    {Object.keys(tagColors).map((tag) => {
                      const count = currentProjectTasks.filter(
                        (task) => task.tag === tag
                      ).length;
                      return count > 0 ? (
                        <div
                          key={tag}
                          className="flex justify-between items-center"
                        >
                          <Badge
                            variant="secondary"
                            className={`text-xs ${tagColors[tag as TaskTag]}`}
                          >
                            {tag}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {count}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="font-medium mb-3">Recent Tasks</h3>
                  <div className="space-y-2">
                    {currentProjectTasks
                      .sort(
                        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                      )
                      .slice(0, 3)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="text-sm p-2 bg-muted rounded-md"
                        >
                          <div className="font-medium truncate">
                            {task.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {task.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* All Projects */}
                <div>
                  <h3 className="font-medium mb-3">All Projects</h3>
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setCurrentProjectId(project.id)}
                        className={`w-full text-left p-2 rounded-md transition-colors ${
                          project.id === currentProjectId
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${project.color}`}
                          />
                          <span className="text-sm font-medium truncate">
                            {project.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground ml-4">
                          {
                            tasks.filter((t) => t.projectId === project.id)
                              .length
                          }{" "}
                          tasks
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Kanban Board */}
          <div className="flex-1">
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
                  <Card className="w-80 opacity-95 rotate-2 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm leading-tight">
                          {activeTask.title}
                        </h3>
                      </div>
                      {activeTask.tag && (
                        <Badge
                          variant="secondary"
                          className={`w-fit text-xs ${
                            tagColors[activeTask.tag]
                          }`}
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
          </div>
        </div>
      </main>
    </div>
  );
}
