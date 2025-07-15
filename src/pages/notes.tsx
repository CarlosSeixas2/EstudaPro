import { useState } from "react";
import type { Project } from "@/types/types";
import { ProjectsListTemplate } from "@/templates/projects-list-template";
import { ProjectNotesTemplate } from "@/templates/project-notes-template";

export default function NotesPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Handler para quando um projeto é selecionado na lista
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  // Handler para voltar da visualização de notas para a lista de projetos
  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  return (
    <div className="p-4 md:p-4 h-full">
      {selectedProject ? (
        // Se um projeto está selecionado, renderiza o template de notas
        <ProjectNotesTemplate
          project={selectedProject}
          onBack={handleBackToProjects}
        />
      ) : (
        // Caso contrário, renderiza o template com a lista de projetos
        <ProjectsListTemplate onProjectSelect={handleProjectSelect} />
      )}
    </div>
  );
}
