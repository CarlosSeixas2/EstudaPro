import { TasksPageHeader } from "@/components/organisms/kanban/tasks-page-header";
import { ProjectSidebar } from "@/components/organisms/kanban/project-sidebar";
import { KanbanBoard } from "@/components/organisms/kanban/kanban-board";
import { ProjectSelector } from "@/components/organisms/kanban/projectselector";
import { FilterDropdown } from "@/components/molecules/kanban/filter-dropdown";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import type { Project, Task, TaskStatus, TaskTag } from "@/types/types";

interface TasksPageTemplateProps {
  // Estados
  projects: Project[];
  currentProjectId: string | null;
  tasks: Task[];
  isSidebarOpen: boolean;
  activeTask: Task | null;
  selectedTags: TaskTag[];
  tagColors: Record<TaskTag, string>;

  // Handlers
  onSidebarToggle: () => void;
  onProjectCreate: (project: any) => void;
  onTaskCreate: (task: any) => void;
  onProjectChange: (projectId: string) => void;
  onFilterChange: (tag: TaskTag, checked: boolean) => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export const TasksPageTemplate = ({
  projects,
  currentProjectId,
  tasks,
  isSidebarOpen,
  activeTask,
  selectedTags,
  tagColors,
  onSidebarToggle,
  onProjectCreate,
  onTaskCreate,
  onProjectChange,
  onFilterChange,
  onTaskStatusChange,
  onDragStart,
  onDragEnd,
}: TasksPageTemplateProps) => {
  const currentProject = projects.find((p) => p.id === currentProjectId);
  const currentProjectTasks = tasks.filter(
    (task) => task.projectId === currentProjectId
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TasksPageHeader
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={onSidebarToggle}
        onProjectCreate={onProjectCreate}
        onTaskCreate={onTaskCreate}
        isProjectSelected={!!currentProjectId}
      />
      <main className="mx-auto px-4 py-6 flex-1 w-full">
        <div className="flex gap-6 h-full">
          <ProjectSidebar
            isOpen={isSidebarOpen}
            project={currentProject}
            tasks={currentProjectTasks}
            tagColors={tagColors}
          />
          <div className="flex-1 flex flex-col gap-4">
            {currentProjectId ? (
              <>
                <div className="flex items-center justify-end">
                  <ProjectSelector
                    projects={projects}
                    currentProjectId={currentProjectId}
                    onProjectChange={onProjectChange}
                  />
                  <FilterDropdown
                    selectedTags={selectedTags}
                    onFilterChange={onFilterChange}
                    tagColors={tagColors}
                  />
                </div>
                <div className="flex flex-row gap-4">
                  <KanbanBoard
                    tasks={currentProjectTasks.filter(
                      (task) =>
                        selectedTags.length === 0 ||
                        (task.tag && selectedTags.includes(task.tag))
                    )}
                    onTaskStatusChange={onTaskStatusChange}
                    activeTask={activeTask}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    tagColors={tagColors}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-center text-muted-foreground bg-muted/30 rounded-lg">
                <p>Selecione um projeto para começar ou crie um novo.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
