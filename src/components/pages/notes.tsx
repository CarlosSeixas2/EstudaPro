import { useState } from "react";
import { ProjectsPage } from "@/components/pages/projectspage";
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
    <>
      {selectedProject ? (
        <ProjectNotesPage
          project={selectedProject}
          onBack={handleBackToProjects}
        />
      ) : (
        <ProjectsPage onProjectSelect={handleProjectSelect} />
      )}
    </>
  );
}
