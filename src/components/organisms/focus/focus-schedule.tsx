import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ScheduleItem {
  time: string;
  task: string;
}

const initialSchedule: ScheduleItem[] = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // Das 8h às 19h
  return { time: `${String(hour).padStart(2, "0")}:00`, task: "" };
});

export function FocusSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [editing, setEditing] = useState<string | null>(null);

  const handleTaskChange = (time: string, newTask: string) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.time === time ? { ...item, task: newTask } : item
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronograma do Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {schedule.map(({ time, task }) => (
            <div
              key={time}
              className="flex items-center gap-4 p-2 rounded-md transition-colors hover:bg-muted/50"
            >
              <div className="font-mono text-sm text-muted-foreground w-16">
                {time}
              </div>
              <div className="flex-1" onClick={() => setEditing(time)}>
                {editing === time ? (
                  <Input
                    value={task}
                    onChange={(e) => handleTaskChange(time, e.target.value)}
                    onBlur={() => setEditing(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditing(null)}
                    autoFocus
                    className="h-8"
                  />
                ) : (
                  <div className="h-8 flex items-center text-sm">
                    {task || (
                      <span className="text-muted-foreground/70">
                        Clique para adicionar uma tarefa...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
