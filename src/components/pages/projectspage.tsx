import { useState, useEffect } from "react";
import { Search, Loader2, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/organisms/notes/projectcard";
import { ProjectDialog } from "@/components/organisms/notes/projectdialog";
import type { Project, Note } from "@/types/types";

interface ProjectsPageProps {
  onProjectSelect: (project: Project) => void;
}

export function ProjectsPage({ onProjectSelect }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  // Fetch data from db.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, notesResponse] = await Promise.all([
          fetch("http://localhost:3001/projects"),
          fetch("http://localhost:3001/notes"),
        ]);
        const projectsData = await projectsResponse.json();
        const notesData = await notesResponse.json();
        setProjects(
          projectsData.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
          }))
        );
        setNotes(notesData);
      } catch (error) {
        console.error("Falha ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProject = async (
    projectData: Omit<Project, "id" | "createdAt">
  ) => {
    try {
      const response = await fetch("http://localhost:3001/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectData,
          createdAt: new Date().toISOString(),
        }),
      });
      const newProject = await response.json();
      setProjects((prev) => [
        ...prev,
        { ...newProject, createdAt: new Date(newProject.createdAt) },
      ]);
    } catch (error) {
      console.error("Falha ao salvar projeto:", error);
    }
  };

  const getNotesCount = (projectId: string) => {
    return notes.filter((note) => note.projectId === projectId).length;
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">
            Seus projetos e anotações organizados.
          </p>
        </div>
        <Button onClick={() => setIsProjectDialogOpen(true)}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </header>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar projetos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <main className="flex-1 overflow-y-auto">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                noteCount={getNotesCount(project.id)}
                onClick={() => onProjectSelect(project)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
          </div>
        )}
      </main>
      <ProjectDialog
        isOpen={isProjectDialogOpen}
        onClose={() => setIsProjectDialogOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
}
