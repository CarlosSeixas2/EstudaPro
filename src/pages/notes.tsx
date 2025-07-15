import { useState } from "react";
import { ProjectsPage } from "@/pages/projectspage";
import type { Project } from "@/types/types";
import ProjectNotesPage from "./projectnotespage";

export default function HierarchicalNotes() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  return (
    <div className="p-4 md:p-4">
      {selectedProject ? (
        <ProjectNotesPage
          project={selectedProject}
          onBack={handleBackToProjects}
        />
      ) : (
        <ProjectsPage onProjectSelect={handleProjectSelect} />
      )}
    </div>
  );
}
