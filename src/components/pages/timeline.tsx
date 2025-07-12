import React, { useState, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, BookOpen, Trash2, Edit, GripVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface ScheduledItem extends Subject {
  uniqueId: string;
}

interface Schedule {
  [day: string]: ScheduledItem[];
}

const initialSubjects: Subject[] = [
  { id: "math", name: "Matemática", color: "#3b82f6" },
  { id: "bio", name: "Biologia", color: "#22c55e" },
  { id: "hist", name: "História", color: "#f97316" },
  { id: "phys", name: "Física", color: "#8b5cf6" },
  { id: "chem", name: "Química", color: "#ec4899" },
  { id: "writ", name: "Redação", color: "#f43f5e" },
];

const daysOfWeek = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

// --- COMPONENTES VISUAIS ---

const LibrarySubject: React.FC<{
  subject: Subject;
  onEdit: () => void;
  onRemove: () => void;
}> = ({ subject, onEdit, onRemove }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-${subject.id}`,
    data: { subject, fromLibrary: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "group/libitem relative flex items-center gap-3 p-2.5 rounded-lg bg-background border cursor-grab active:cursor-grabbing transition-all duration-200",
        isDragging && "opacity-50 shadow-lg scale-105"
      )}
    >
      <div
        className="w-5 h-5 rounded-md flex-shrink-0"
        style={{ backgroundColor: subject.color }}
      />
      <span className="font-medium text-sm flex-1 truncate">
        {subject.name}
      </span>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-0.5 opacity-0 group-hover/libitem:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const SortableScheduledItem: React.FC<{
  item: ScheduledItem;
  onRemove: () => void;
  onEdit: () => void;
}> = ({ item, onRemove, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.uniqueId, data: { item, fromLibrary: false } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/item relative flex items-center gap-3 p-2.5 rounded-lg bg-card border shadow-sm touch-none",
        isDragging && "opacity-60"
      )}
    >
      <div
        className="w-2 h-8 rounded-full"
        style={{ backgroundColor: item.color }}
      />
      <span className="font-semibold text-sm flex-1">{item.name}</span>
      <div className="flex items-center">
        <div className="absolute inset-y-0 right-10 flex items-center pr-2 gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div
          {...listeners}
          {...attributes}
          className="p-2 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

const DayColumn: React.FC<{
  day: string;
  items: ScheduledItem[];
  onEdit: (subject: Subject) => void;
  onRemove: (uniqueId: string) => void;
}> = ({ day, items, onEdit, onRemove }) => {
  const { setNodeRef, isOver } = useDroppable({ id: day });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "flex flex-col min-h-[350px] transition-colors duration-200",
        isOver ? "bg-primary/5" : "bg-muted/30"
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-base font-bold">{day}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 p-2">
        <SortableContext
          items={items.map((i) => i.uniqueId)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableScheduledItem
              key={item.uniqueId}
              item={item}
              onEdit={() => onEdit(item)}
              onRemove={() => onRemove(item.uniqueId)}
            />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg p-4">
            Arraste uma matéria aqui
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function StudyPlannerPage() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem("studyPlannerSubjects_v2");
      return saved ? JSON.parse(saved) : initialSubjects;
    } catch {
      return initialSubjects;
    }
  });

  const [schedule, setSchedule] = useState<Schedule>(() => {
    const initialSchedule: Schedule = {};
    daysOfWeek.forEach((day) => {
      initialSchedule[day] = [];
    });
    try {
      const saved = localStorage.getItem("studyPlannerSchedule_v2");
      const parsed = saved ? JSON.parse(saved) : {};
      daysOfWeek.forEach((day) => {
        initialSchedule[day] = parsed[day] || [];
      });
      return initialSchedule;
    } catch {
      return initialSchedule;
    }
  });

  const [activeItem, setActiveItem] = useState<Subject | ScheduledItem | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    localStorage.setItem("studyPlannerSubjects_v2", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("studyPlannerSchedule_v2", JSON.stringify(schedule));
  }, [schedule]);

  // NOVO: Função auxiliar para encontrar o container (dia da semana) de um item.
  const findContainer = (id: string | number) => {
    if (id.toString().startsWith("lib-")) {
      return "library";
    }
    for (const day of daysOfWeek) {
      if (schedule[day].some((item) => item.uniqueId === id)) {
        return day;
      }
    }
    // Se o ID for o nome de um dia (quando soltamos em uma coluna vazia)
    if (daysOfWeek.includes(id.toString())) {
      return id.toString();
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = active.data.current?.subject || active.data.current?.item;
    setActiveItem(item);
  };

  // NOVO: Lógica de Drag and Drop completamente reescrita
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    // Caso 1: Reordenando itens dentro do mesmo dia
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
    }
    // Caso 2: Movendo itens entre containers diferentes (dia -> dia, ou biblioteca -> dia)
    else if (activeContainer !== overContainer) {
      setSchedule((prev) => {
        const newSchedule = { ...prev };
        const sourceItems =
          activeContainer === "library" ? [] : newSchedule[activeContainer];
        const destinationItems = newSchedule[overContainer];

        let draggedItem: ScheduledItem;

        // Se vem da biblioteca
        if (active.data.current?.fromLibrary) {
          const subject = active.data.current.subject as Subject;
          draggedItem = { ...subject, uniqueId: `item-${Date.now()}` };
        } else {
          // Se vem de outro dia
          const itemIndex = sourceItems.findIndex(
            (i) => i.uniqueId === activeId
          );
          if (itemIndex === -1) return prev; // item não encontrado, abortar
          draggedItem = sourceItems[itemIndex];
          // Remover do container de origem
          newSchedule[activeContainer] = sourceItems.filter(
            (i) => i.uniqueId !== activeId
          );
        }

        // Adicionar ao container de destino
        const overIndex = destinationItems.findIndex(
          (i) => i.uniqueId === overId
        );
        const newIndex = overIndex !== -1 ? overIndex : destinationItems.length; // se soltar na coluna, insere no fim

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
    // CORREÇÃO: Lógica de exclusão garantida.
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

  const handleClearSchedule = () => {
    setIsClearDialogOpen(true);
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
      const newSubject: Subject = {
        id: `subject-${Date.now()}`,
        name,
        color,
      };
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
          <Button variant="destructive" onClick={handleClearSchedule}>
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Cronograma
          </Button>
        </header>

        {/* // LAYOUT: Estrutura principal alterada para flex-col */}
        <main className="flex flex-col gap-8">
          {/* // LAYOUT: Cronograma vem primeiro */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {daysOfWeek.map((day) => (
                <DayColumn
                  key={day}
                  day={day}
                  items={schedule[day] || []}
                  onEdit={handleOpenDialog}
                  onRemove={handleRemoveFromSchedule}
                />
              ))}
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Biblioteca de Matérias
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {subjects.map((subject) => (
                  <LibrarySubject
                    key={subject.id}
                    subject={subject}
                    onEdit={() => handleOpenDialog(subject)}
                    onRemove={() => handleRemoveSubject(subject.id)}
                  />
                ))}
                <Button
                  variant="outline"
                  className="w-full h-full min-h-[58px]"
                  onClick={() => handleOpenDialog()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova
                </Button>
              </CardContent>
            </Card>
          </div>
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
    </DndContext>
  );
}

const SubjectDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
  subject: Subject | null;
}> = ({ isOpen, onClose, onSave, subject }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");

  useEffect(() => {
    if (isOpen) {
      setName(subject?.name || "");
      setColor(subject?.color || "#3b82f6");
    }
  }, [isOpen, subject]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, color);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subject ? "Editar Matéria" : "Nova Matéria"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Ex: Cálculo I"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Cor</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <div
                      className="w-5 h-5 rounded-md border mr-2"
                      style={{ backgroundColor: color }}
                    />
                    <span>{color}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-0">
                  <HexColorPicker color={color} onChange={setColor} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
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
};
