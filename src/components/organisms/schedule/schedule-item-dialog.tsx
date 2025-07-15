import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ScheduledItem } from "@/types/types";
import { useState, useEffect } from "react";

interface ScheduleItemDialogProps {
  item: ScheduledItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
}

export function ScheduleItemDialog({
  item,
  isOpen,
  onClose,
  onSave,
}: ScheduleItemDialogProps) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      setNotes(item.notes || "");
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anotações para {item.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="notes">Suas anotações ou tarefas:</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 min-h-[200px]"
            placeholder="Digite suas anotações aqui..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
