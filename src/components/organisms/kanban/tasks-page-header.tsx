import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "@/components/molecules/kanban/create-project-dialog";
import { CreateTaskDialog } from "@/components/molecules/kanban/create-task-dialog";

interface TasksPageHeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  onProjectCreate: (project: any) => void;
  onTaskCreate: (task: any) => void;
  isProjectSelected: boolean;
}

export const TasksPageHeader = ({
  isSidebarOpen,
  onSidebarToggle,
  onProjectCreate,
  onTaskCreate,
  isProjectSelected,
}: TasksPageHeaderProps) => {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto px-4 py-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tarefas</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie seus projetos e tarefas com eficiência.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onSidebarToggle}
              title={isSidebarOpen ? "Esconder sidebar" : "Mostrar sidebar"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
            <CreateProjectDialog onProjectCreate={onProjectCreate} />
            <CreateTaskDialog
              onTaskCreate={onTaskCreate}
              disabled={!isProjectSelected}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
