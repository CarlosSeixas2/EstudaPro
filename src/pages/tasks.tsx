import { useEffect, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Plus,
  PanelLeftClose,
  PanelLeft,
  FolderPlus,
  Loader2,
  Filter, // Ícone de Filtro importado
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // Componentes de Dropdown
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

export type TaskStatus = "todo" | "in-progress" | "Feito";
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

const columns = [
  { id: "todo", title: "Pendente", status: "todo" as TaskStatus },
  {
    id: "in-progress",
    title: "Em andamento",
    status: "in-progress" as TaskStatus,
  },
  { id: "Feito", title: "Feito", status: "Feito" as TaskStatus },
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
  "bg-gray-500",
  "bg-orange-500",
];

export default function KanbanBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);

  // --- NOVO: Estado para os filtros de tags ---
  const [selectedTags, setSelectedTags] = useState<TaskTag[]>([]);

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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, tasksResponse] = await Promise.all([
          fetch("http://localhost:3001/projects_kanban"),
          fetch("http://localhost:3001/tasks"),
        ]);

        if (!projectsResponse.ok || !tasksResponse.ok) {
          throw new Error("Falha ao buscar dados do servidor.");
        }

        const projectsData = (await projectsResponse.json()).map(
          (p: any, index: number) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            color: p.color || projectColors[index % projectColors.length],
          })
        );
        const tasksData = (await tasksResponse.json()).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
        }));

        setProjects(projectsData);
        setTasks(tasksData);

        if (projectsData.length > 0) {
          setCurrentProjectId(projectsData[0].id);
        }
      } catch (err: any) {
        setError(
          "Não foi possível conectar ao servidor. Verifique se o `json-server` está rodando."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentProject = projects.find((p) => p.id === currentProjectId);

  // Tarefas do projeto atual
  const currentProjectTasks = tasks.filter(
    (task) => task.projectId === currentProjectId
  );

  // --- NOVO: Lógica de filtragem ---
  // Aplica o filtro de tags sobre as tarefas do projeto atual
  const filteredTasks = currentProjectTasks.filter(
    (task) =>
      selectedTags.length === 0 || (task.tag && selectedTags.includes(task.tag))
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Busca a tarefa na lista filtrada
    const task = filteredTasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    const validStatuses: TaskStatus[] = ["todo", "in-progress", "Feito"];
    if (!validStatuses.includes(newStatus as TaskStatus)) {
      return;
    }

    const validatedStatus = newStatus as TaskStatus;
    const originalTask = tasks.find((task) => task.id === taskId);
    if (!originalTask || originalTask.status === validatedStatus) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: validatedStatus } : task
      )
    );

    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: validatedStatus }),
    }).catch(() => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, status: originalTask.status } : task
        )
      );
    });
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !currentProjectId) return;

    const taskData = {
      ...newTask,
      projectId: currentProjectId,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error("Falha ao criar a tarefa.");

      const createdTask = await response.json();
      setTasks((prev) => [
        ...prev,
        { ...createdTask, createdAt: new Date(createdTask.createdAt) },
      ]);
      setNewTask({ title: "", description: "", status: "todo", tag: "" });
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;

    const projectData = {
      ...newProject,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3001/projects_kanban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error("Falha ao criar o projeto.");

      const createdProject = await response.json();
      // Atualiza o estado dos projetos, adicionando o novo projeto
      setProjects((prev) => [
        ...prev,
        { ...createdProject, createdAt: new Date(createdProject.createdAt) },
      ]);
      // Define o projeto recém-criado como o projeto atual
      setCurrentProjectId(createdProject.id);
      // Limpa o formulário de criação de projeto
      setNewProject({ name: "", description: "", color: projectColors[0] });
      // Fecha o diálogo de criação de projeto
      setIsCreateProjectDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // --- ATUALIZADO: Usa a lista de tarefas filtrada ---
  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  // --- NOVO: Função para lidar com a mudança de filtros ---
  const handleTagFilterChange = (tag: TaskTag, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, tag] : prev.filter((t) => t !== tag)
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto px-4 py-4 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Tarefas</h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie seus projetos e tarefas com eficiência
                </p>
              </div>
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
                          <SelectItem value="todo">Pendente</SelectItem>
                          <SelectItem value="in-progress">
                            Em andamento
                          </SelectItem>
                          <SelectItem value="Feito">Feito</SelectItem>
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

      <main className="mx-auto px-4 py-6">
        <div className="flex gap-6">
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
                <div>
                  <h3 className="font-medium mb-3">Estatísticas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total de Tarefas
                      </span>
                      <Badge variant="outline">
                        {currentProjectTasks.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Pendente
                      </span>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                        {getTasksByStatus("todo").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Em andamento
                      </span>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                        {getTasksByStatus("in-progress").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Feito
                      </span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                        {getTasksByStatus("Feito").length}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Progresso</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Concluido</span>
                      <span>
                        {currentProjectTasks.length > 0
                          ? Math.round(
                              (getTasksByStatus("Feito").length /
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
                              ? (getTasksByStatus("Feito").length /
                                  currentProjectTasks.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

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
              </CardContent>
            </Card>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-end">
              <ProjectSelector
                projects={projects}
                currentProjectId={currentProjectId || ""}
                onProjectChange={(projectId) => {
                  setCurrentProjectId(projectId);
                  setSelectedTags([]);
                }}
              />

              {/* Filtro de Tags */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtro
                    {selectedTags.length > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                        {selectedTags.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por Tag</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.keys(tagColors).map((tag) => (
                    <DropdownMenuCheckboxItem
                      key={tag}
                      checked={selectedTags.includes(tag as TaskTag)}
                      onCheckedChange={(checked) =>
                        handleTagFilterChange(tag as TaskTag, checked)
                      }
                    >
                      {tag}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

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
        </div>
      </main>
    </div>
  );
}
