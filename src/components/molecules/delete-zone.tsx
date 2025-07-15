import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export function DeleteZone() {
  const { setNodeRef, isOver } = useDroppable({ id: "delete-zone" });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex items-center justify-center gap-2 p-2 rounded-lg border-2 border-dashed border-destructive/50 text-destructive/80 transition-all",
        isOver &&
          "bg-destructive/10 border-solid scale-105 text-destructive font-bold"
      )}
    >
      <span>Arraste aqui para remover</span>
    </div>
  );
}
