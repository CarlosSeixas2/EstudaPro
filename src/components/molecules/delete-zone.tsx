import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export function DeleteZone() {
  const { setNodeRef, isOver } = useDroppable({ id: "delete-zone" });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-destructive/50 text-destructive/80 transition-all duration-300 ease-in-out",
        "h-10", // Set a fixed height
        isOver
          ? "w-64 bg-destructive/10 border-solid text-destructive font-bold" // Expanded and styled for hover
          : "w-52" // Default width
      )}
    >
      <Trash2
        className={cn(
          "h-5 w-5 transition-transform duration-300",
          isOver && "scale-125" // Enlarge the icon on hover
        )}
      />
      <span className="text-sm">
        {isOver ? "Solte para remover!" : "Arraste para remover"}
      </span>
    </div>
  );
}
