import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { Project } from "@/types/types";
import { ImageUp, X } from "lucide-react";

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, "id" | "createdAt">) => void;
  project?: Project;
}

export function ProjectDialog({
  isOpen,
  onClose,
  onSave,
  project,
}: ProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: project?.name || "",
        description: project?.description || "",
        imageUrl: project?.imageUrl || "",
      });
    }
  }, [isOpen, project]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {project ? "Editar Projeto" : "Novo Projeto"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nome do projeto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            placeholder="Descrição (opcional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />
          <div>
            <label className="text-sm font-medium">Imagem de Capa</label>
            <div className="mt-2">
              <Input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="image-upload"
                className="group cursor-pointer w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors bg-muted/50"
              >
                {formData.imageUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData((prev) => ({ ...prev, imageUrl: "" }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageUp className="mx-auto h-8 w-8 group-hover:text-primary" />
                    <p className="text-xs mt-1">
                      Clique para enviar uma imagem
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
