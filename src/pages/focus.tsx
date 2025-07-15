import { useState } from "react";
import { PomodoroTimer } from "@/components/organisms/focus/pomodorotimer";
import { PomodoroLog } from "@/components/organisms/focus/pomodorolog";

export interface LogEntry {
  id: number;
  description: string;
}

export default function Focus() {
  const [log, setLog] = useState<LogEntry[]>([]);

  // Adiciona uma nova entrada vazia ao log quando um ciclo de foco termina
  const handleSessionComplete = () => {
    setLog((prevLog) => [...prevLog, { id: Date.now(), description: "" }]);
  };

  // Atualiza a descrição de uma entrada de log existente
  const handleUpdateLog = (id: number, description: string) => {
    setLog((prevLog) =>
      prevLog.map((entry) =>
        entry.id === id ? { ...entry, description } : entry
      )
    );
  };

  return (
    <div className="p-4 md:p-4 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Modo Foco</h1>
        <p className="text-muted-foreground">
          Use o Pomodoro para manter o foco e registre seu progresso.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cronômetro */}
        <div className="lg:col-span-1 flex justify-center">
          <PomodoroTimer onSessionComplete={handleSessionComplete} />
        </div>

        {/* Registros */}
        <div className="lg:col-span-2">
          <PomodoroLog log={log} onUpdateLog={handleUpdateLog} />
        </div>
      </div>
    </div>
  );
}
