import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project, Task, TaskStatus, TaskTag } from "@/types/types";

interface ProjectSidebarProps {
  isOpen: boolean;
  project?: Project;
  tasks: Task[];
  tagColors: Record<TaskTag, string>;
}

export const ProjectSidebar = ({
  isOpen,
  project,
  tasks,
  tagColors,
}: ProjectSidebarProps) => {
  if (!project) return null;

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status).length;
  const doneTasks = getTasksByStatus("Feito");
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? "w-80" : "w-0 overflow-hidden"
      }`}
    >
      <Card className="h-fit sticky top-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                project.color || "bg-gray-400"
              }`}
            />
            {project.name}
          </CardTitle>
          {project.description && (
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Estatísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total de Tarefas</span>
                <Badge variant="outline">{totalTasks}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pendente</span>
                <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                  {getTasksByStatus("todo")}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Em andamento</span>
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                  {getTasksByStatus("in-progress")}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Feito</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                  {doneTasks}
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">Progresso</h3>
            <div className="flex justify-between text-sm">
              <span>Concluído</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(tagColors).map((tag) => {
                const count = tasks.filter((task) => task.tag === tag).length;
                return count > 0 ? (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className={`text-xs ${tagColors[tag as TaskTag]}`}
                  >
                    {tag}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
