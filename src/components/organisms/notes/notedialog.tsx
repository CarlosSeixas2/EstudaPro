import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/organisms/notes/richtexteditor";
import type { Note } from "@/types/types";

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, "id" | "createdAt" | "color">) => void;
  note?: Note;
  projectId: string;
}

export function NoteDialog({
  isOpen,
  onClose,
  onSave,
  note,
  projectId,
}: NoteDialogProps) {
  const [formData, setFormData] = useState({
    title: note?.title || "",
    content: note?.content || "",
    projectId,
  });

  // Reset form when note changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: note?.title || "",
        content: note?.content || "",
        projectId,
      });
    }
  }, [isOpen, note, projectId]);

  const handleSave = useCallback(() => {
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  }, [formData, onSave, onClose]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, title: e.target.value }));
    },
    []
  );

  const handleContentChange = useCallback((content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {note ? "Editar Anotação" : "Nova Anotação"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <Input
            placeholder="Título da anotação"
            className="text-lg font-semibold"
            value={formData.title}
            onChange={handleTitleChange}
          />
          <div className="flex-1 overflow-hidden">
            <RichTextEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Comece a escrever sua anotação..."
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-end w-full">
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="secondary">Fechar</Button>
            </DialogClose>
            <Button onClick={handleSave}>Salvar e Fechar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
