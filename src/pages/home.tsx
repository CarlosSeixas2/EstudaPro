import { useEffect, useState } from "react";
import { NotebookText, ListPlus, Loader2, AlertTriangle } from "lucide-react";

import { MotivationalPhrase } from "@/components/atoms/motivational-phrase";
import { DailySummary } from "@/components/organisms/daily-summary";
import { ItemListCard } from "@/components/organisms/item-list-card";
import type { KanbanTask, Note } from "@/types/types";

interface DashboardData {
  user: { name: string };
  summary: {
    tasksToday: number;
    tasksCompleted: number;
    focusMinutes: number;
    notesCreated?: number;
  };
  kanbanTasks: KanbanTask[];
  notes: Note[];
  phrases: { id: number; text: string }[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const endpoints = ["user", "summary", "tasks", "notes", "phrases"];
        const requests = endpoints.map((endpoint) =>
          fetch(`http://localhost:3001/${endpoint}`)
        );

        const responses = await Promise.all(requests);

        for (const res of responses) {
          if (!res.ok) {
            throw new Error(`Falha ao buscar dados: ${res.url}`);
          }
        }

        const [user, summary, kanbanTasks, notes, phrases] = await Promise.all(
          responses.map((res) => res.json())
        );

        const sortAndSlice = (items: any[], count: number) =>
          items
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, count);

        setData({
          user,
          summary,
          kanbanTasks: sortAndSlice(kanbanTasks, 3),
          notes: sortAndSlice(notes, 3),
          phrases,
        });
      } catch (err: any) {
        setError(
          "Não foi possível conectar ao servidor. Verifique o `json-server`."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full flex-1 items-center justify-center rounded-2xl bg-destructive/10 p-6 text-center">
        <AlertTriangle className="mr-4 h-8 w-8 text-destructive" />
        <div>
          <h2 className="font-bold text-destructive">Ocorreu um Erro</h2>
          <p className="text-destructive/80">
            {error || "Não foi possível carregar os dados."}
          </p>
        </div>
      </div>
    );
  }

  const randomPhrase =
    data.phrases[Math.floor(Math.random() * data.phrases.length)]?.text ||
    "Comece com um passo de cada vez.";

  return (
    <div className="p-4 md:p-4 flex flex-1 flex-col gap-6 lg:gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Olá, {data.user.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) de volta, aqui está o seu resumo do dia.
        </p>
      </header>

      <MotivationalPhrase phrase={randomPhrase} />

      <main className="flex flex-1 flex-col gap-6 lg:gap-8">
        <DailySummary summary={data.summary} />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <ItemListCard
            title="Atividade Recente no Kanban"
            items={data.kanbanTasks}
            icon={ListPlus}
            emptyText="Nenhuma tarefa recente no Kanban."
            type="kanbantask"
          />
          <ItemListCard
            title="Anotações Recentes"
            items={data.notes.map((note) => ({
              ...note,
              createdAt:
                typeof note.createdAt === "string"
                  ? note.createdAt
                  : note.createdAt.toISOString(),
            }))}
            icon={NotebookText}
            emptyText="Nenhuma anotação recente."
            type="note"
          />
        </div>
      </main>
    </div>
  );
}
