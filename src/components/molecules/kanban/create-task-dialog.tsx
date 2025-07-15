import { useState } from "react";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { TaskStatus, TaskTag } from "@/pages/tasks"; // Idealmente, mova os tipos para `src/types`

interface CreateTaskDialogProps {
  onTaskCreate: (task: {
    title: string;
    description?: string;
    status: TaskStatus;
    tag?: TaskTag;
  }) => void;
  disabled: boolean;
}

export const CreateTaskDialog = ({
  onTaskCreate,
  disabled,
}: CreateTaskDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    tag: "" as TaskTag | "",
  });

  const handleCreate = () => {
    if (!newTask.title.trim()) return;
    onTaskCreate({
      ...newTask,
      tag: newTask.tag || undefined,
    });
    setIsOpen(false);
    setNewTask({ title: "", description: "", status: "todo", tag: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={newTask.status}
              onValueChange={(v: TaskStatus) =>
                setNewTask((p) => ({ ...p, status: v }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Pendente</SelectItem>
                <SelectItem value="in-progress">Em andamento</SelectItem>
                <SelectItem value="Feito">Feito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tag">Tag (Opcional)</Label>
            <Select
              value={newTask.tag}
              onValueChange={(v: TaskTag) =>
                setNewTask((p) => ({ ...p, tag: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Bug">Bug</SelectItem>
                <SelectItem value="Feature">Feature</SelectItem>
                <SelectItem value="Enhancement">Melhoria</SelectItem>
                <SelectItem value="Documentation">Documentação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Criar Tarefa</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
