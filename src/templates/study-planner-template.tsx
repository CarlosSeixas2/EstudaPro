import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Schedule, ScheduledItem, Subject } from "@/types/types";
import { DeleteZone } from "@/components/molecules/delete-zone";
import { DayColumn } from "@/components/organisms/schedule/day-column";
import { SubjectLibrary } from "@/components/organisms/schedule/subject-library";
import { SubjectDialog } from "@/components/organisms/schedule/subject-dialog";
import { ScheduleItemDialog } from "@/components/organisms/schedule/schedule-item-dialog"; // Import the new dialog

interface StudyPlannerTemplateProps {
  initialSubjects: Subject[];
  initialSchedule: Schedule;
  daysOfWeek: string[];
}

export function StudyPlannerTemplate({
  initialSubjects,
  initialSchedule,
  daysOfWeek,
}: StudyPlannerTemplateProps) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule);

  const [activeItem, setActiveItem] = useState<Subject | ScheduledItem | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  // State for the new dialog
  const [selectedItem, setSelectedItem] = useState<ScheduledItem | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Efeito para salvar matérias no localStorage
  useEffect(() => {
    localStorage.setItem("MateriasSalvas", JSON.stringify(subjects));
  }, [subjects]);

  // Efeito para salvar o cronograma no localStorage
  useEffect(() => {
    localStorage.setItem("CronogramaUsuario", JSON.stringify(schedule));
  }, [schedule]);

  const findContainer = (id: string | number) => {
    if (id.toString().startsWith("lib-")) return "library";
    if (id === "delete-zone") return "delete-zone";
    for (const day of daysOfWeek) {
      if (schedule[day].some((item) => item.uniqueId === id)) return day;
    }
    if (daysOfWeek.includes(id.toString())) return id.toString();
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = active.data.current?.subject || active.data.current?.item;
    setActiveItem(item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (overId === "delete-zone") {
      if (!active.data.current?.fromLibrary) {
        handleRemoveFromSchedule(activeId as string);
      }
      return;
    }

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || overContainer === "delete-zone")
      return;

    if (activeContainer === overContainer && activeContainer !== "library") {
      setSchedule((prev) => {
        const newSchedule = { ...prev };
        const items = newSchedule[activeContainer];
        const oldIndex = items.findIndex((i) => i.uniqueId === activeId);
        const newIndex = items.findIndex((i) => i.uniqueId === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          newSchedule[activeContainer] = arrayMove(items, oldIndex, newIndex);
        }
        return newSchedule;
      });
    } else if (activeContainer !== overContainer) {
      setSchedule((prev) => {
        const newSchedule = { ...prev };
        const sourceItems =
          activeContainer === "library" ? [] : newSchedule[activeContainer];
        const destinationItems = newSchedule[overContainer];

        let draggedItem: ScheduledItem;

        if (active.data.current?.fromLibrary) {
          const subject = active.data.current.subject as Subject;
          draggedItem = { ...subject, uniqueId: `item-${Date.now()}` };
        } else {
          const itemIndex = sourceItems.findIndex(
            (i) => i.uniqueId === activeId
          );
          if (itemIndex === -1) return prev;
          draggedItem = sourceItems[itemIndex];
          newSchedule[activeContainer] = sourceItems.filter(
            (i) => i.uniqueId !== activeId
          );
        }

        const overIndex = destinationItems.findIndex(
          (i) => i.uniqueId === overId
        );
        const newIndex = overIndex !== -1 ? overIndex : destinationItems.length;

        newSchedule[overContainer] = [
          ...destinationItems.slice(0, newIndex),
          draggedItem,
          ...destinationItems.slice(newIndex),
        ];

        return newSchedule;
      });
    }
  };

  const handleRemoveFromSchedule = (uniqueId: string) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      for (const day in newSchedule) {
        newSchedule[day] = newSchedule[day].filter(
          (item) => item.uniqueId !== uniqueId
        );
      }
      return newSchedule;
    });
  };

  const confirmClearSchedule = () => {
    const clearedSchedule: Schedule = {};
    daysOfWeek.forEach((day) => {
      clearedSchedule[day] = [];
    });
    setSchedule(clearedSchedule);
    setIsClearDialogOpen(false);
  };

  const handleOpenDialog = (subject: Subject | null = null) => {
    setEditingSubject(subject);
    setIsDialogOpen(true);
  };

  const handleSaveSubject = (name: string, color: string) => {
    if (editingSubject) {
      const updatedSubjects = subjects.map((s) =>
        s.id === editingSubject.id ? { ...s, name, color } : s
      );
      setSubjects(updatedSubjects);

      setSchedule((prev) => {
        const newSchedule = { ...prev };
        for (const day in newSchedule) {
          newSchedule[day] = newSchedule[day].map((item) =>
            item.id === editingSubject.id ? { ...item, name, color } : item
          );
        }
        return newSchedule;
      });
    } else {
      const newSubject: Subject = { id: `subject-${Date.now()}`, name, color };
      setSubjects([...subjects, newSubject]);
    }
  };

  const handleRemoveSubject = (id: string) => {
    if (
      window.confirm(
        "Remover esta matéria também a removerá de todo o cronograma. Deseja continuar?"
      )
    ) {
      setSubjects(subjects.filter((s) => s.id !== id));
      setSchedule((prev) => {
        const newSchedule = { ...prev };
        for (const day in newSchedule) {
          newSchedule[day] = newSchedule[day].filter((item) => item.id !== id);
        }
        return newSchedule;
      });
    }
  };

  // Handler for opening the item dialog
  const handleItemDoubleClick = (item: ScheduledItem) => {
    setSelectedItem(item);
    setIsItemDialogOpen(true);
  };

  // Handler for saving notes from the dialog
  const handleSaveNotes = (notes: string) => {
    if (!selectedItem) return;

    const updatedSchedule = { ...schedule };
    for (const day in updatedSchedule) {
      updatedSchedule[day] = updatedSchedule[day].map((item) =>
        item.uniqueId === selectedItem.uniqueId ? { ...item, notes } : item
      );
    }
    setSchedule(updatedSchedule);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="p-4 md:p-6 lg:p-8 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Planejador de Estudos
            </h1>
            <p className="text-muted-foreground">
              Arraste as matérias para organizar sua semana.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DeleteZone />
            <Button
              variant="destructive"
              onClick={() => setIsClearDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Cronograma
            </Button>
          </div>
        </header>

        <main className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {daysOfWeek.map((day) => (
              <DayColumn
                key={day}
                day={day}
                items={schedule[day] || []}
                onItemDoubleClick={handleItemDoubleClick}
              />
            ))}
          </div>

          <SubjectLibrary
            subjects={subjects}
            onAdd={() => handleOpenDialog()}
            onEdit={handleOpenDialog}
            onRemove={handleRemoveSubject}
          />
        </main>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-background border shadow-2xl cursor-grabbing">
            <div
              className="w-5 h-5 rounded-md"
              style={{ backgroundColor: activeItem.color }}
            />
            <span className="font-medium">{activeItem.name}</span>
          </div>
        ) : null}
      </DragOverlay>

      <SubjectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveSubject}
        subject={editingSubject}
      />

      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar Cronograma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja limpar todo o cronograma? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsClearDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearSchedule}>
              Limpar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Render the new dialog */}
      <ScheduleItemDialog
        item={selectedItem}
        isOpen={isItemDialogOpen}
        onClose={() => setIsItemDialogOpen(false)}
        onSave={handleSaveNotes}
      />
    </DndContext>
  );
}
