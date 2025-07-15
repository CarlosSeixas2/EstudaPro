import { useState } from "react";
import { FolderPlus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

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

interface CreateProjectDialogProps {
  onProjectCreate: (project: {
    name: string;
    description?: string;
    color: string;
  }) => void;
}

export const CreateProjectDialog = ({
  onProjectCreate,
}: CreateProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    color: projectColors[0],
  });

  const handleCreate = () => {
    if (!newProject.name.trim()) return;
    onProjectCreate(newProject);
    setIsOpen(false);
    setNewProject({ name: "", description: "", color: projectColors[0] });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderPlus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="project-name">Nome do Projeto</Label>
            <Input
              id="project-name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Ex: App de Estudos"
            />
          </div>
          <div>
            <Label htmlFor="project-description">Descrição (Opcional)</Label>
            <Textarea
              id="project-description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Descreva o objetivo do projeto"
              rows={3}
            />
          </div>
          <div>
            <Label>Cor do Projeto</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {projectColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${color} ${
                    newProject.color === color
                      ? "ring-2 ring-offset-2 ring-foreground"
                      : ""
                  }`}
                  onClick={() => setNewProject((p) => ({ ...p, color }))}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Criar Projeto</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
