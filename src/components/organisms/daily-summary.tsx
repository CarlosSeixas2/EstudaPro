import { Target, Clock, BookCheck } from "lucide-react";
import { DailySummaryCard } from "@/components/molecules/daily-summary-card";

// Reutilizando a interface definida na página
interface SummaryData {
  tasksToday: number;
  tasksCompleted: number;
  focusMinutes: number;
  notesCreated?: number;
}

interface DailySummaryProps {
  summary: SummaryData;
}

export const DailySummary = ({ summary }: DailySummaryProps) => {
  const progress =
    summary.tasksToday > 0
      ? (summary.tasksCompleted / summary.tasksToday) * 100
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DailySummaryCard
        title="Tarefas de Hoje"
        icon={Target}
        value={`${summary.tasksCompleted}/${summary.tasksToday}`}
        footer={`${progress.toFixed(0)}% concluído`}
        progress={progress}
      />
      <DailySummaryCard
        title="Minutos Focados"
        icon={Clock}
        value={summary.focusMinutes}
        footer="Sessões de estudo"
      />
      <DailySummaryCard
        title="Anotações Criadas"
        icon={BookCheck}
        value={`+${summary.notesCreated || 0}`}
        footer="Na última semana"
      />
    </div>
  );
};
