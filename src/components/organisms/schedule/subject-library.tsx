import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";
import type { Subject } from "@/types/types";
import { DraggableSubject } from "@/components/molecules/draggable-subject";

interface SubjectLibraryProps {
  subjects: Subject[];
  onAdd: () => void;
  onEdit: (subject: Subject) => void;
  onRemove: (id: string) => void;
}

export function SubjectLibrary({
  subjects,
  onAdd,
  onEdit,
  onRemove,
}: SubjectLibraryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Biblioteca de Matérias
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {subjects.map((subject) => (
          <DraggableSubject
            key={subject.id}
            subject={subject}
            onEdit={() => onEdit(subject)}
            onRemove={() => onRemove(subject.id)}
          />
        ))}
        <Button
          variant="outline"
          className="w-full h-full min-h-[58px]"
          onClick={onAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova
        </Button>
      </CardContent>
    </Card>
  );
}
