import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { LogEntry } from "@/pages/focus";

interface PomodoroLogProps {
  log: LogEntry[];
  onUpdateLog: (id: number, description: string) => void;
}

export function PomodoroLog({ log, onUpdateLog }: PomodoroLogProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (entry: LogEntry) => {
    setEditingId(entry.id);
    setEditText(entry.description);
  };

  const handleSave = (id: number) => {
    onUpdateLog(id, editText);
    setEditingId(null);
    setEditText("");
  };

  if (log.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registro de Foco</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            Complete um ciclo de foco para começar a registrar suas atividades.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Foco</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {log.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-2 rounded-md bg-muted/50"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold">
                {index + 1}
              </div>
              <div className="flex-1" onClick={() => handleEdit(entry)}>
                {editingId === entry.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSave(entry.id)
                      }
                      autoFocus
                      className="h-9"
                    />
                    <Button
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleSave(entry.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm h-9 flex items-center cursor-pointer">
                    {entry.description || (
                      <span className="text-muted-foreground/80">
                        Clique para descrever o que você fez...
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
