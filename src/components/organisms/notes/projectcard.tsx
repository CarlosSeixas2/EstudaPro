import { Calendar, FileText } from "lucide-react";
import type { Project } from "@/types/types";

interface ProjectCardProps {
  project: Project;
  noteCount: number;
  onClick: () => void;
}

export function ProjectCard({ project, noteCount, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div
        className="h-32 bg-muted flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${project.imageUrl})` }}
      >
        {!project.imageUrl && (
          <FileText className="h-12 w-12 text-muted-foreground" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {project.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{noteCount} anotações</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{project.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
