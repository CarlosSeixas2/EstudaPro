import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  BookCheck,
  Target,
  NotebookText,
  Loader2,
  AlertTriangle,
  Sparkles,
  ListPlus,
} from "lucide-react";

const DailySummary = ({ summary }: { summary: DashboardData["summary"] }) => {
  const progress =
    summary.tasksToday > 0
      ? (summary.tasksCompleted / summary.tasksToday) * 100
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            Tarefas de Hoje
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`${summary.tasksCompleted}/${summary.tasksToday}`}</div>
          <p className="text-xs text-muted-foreground">
            {progress.toFixed(0)}% concluído
          </p>
          <Progress value={progress} className="mt-4 h-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            Minutos Focados
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.focusMinutes}</div>
          <p className="text-xs text-muted-foreground">Sessões de estudo</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            Anotações Criadas
            <BookCheck className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`+${
            summary.notesCreated || 3
          }`}</div>
          <p className="text-xs text-muted-foreground">Na última semana</p>
        </CardContent>
      </Card>
    </div>
  );
};

const ItemListCard = ({
  title,
  items,
  icon: Icon,
  emptyText,
  type,
}: {
  title: string;
  items: any[];
  icon: React.ElementType;
  emptyText: string;
  type: "kanbantask" | "note";
}) => {
  const getIconText = (item: any) => {
    if (type === "note") {
      // Para anotações, usa a primeira letra do título.
      return item.title?.substring(0, 1) || "?";
    }
    if (type === "kanbantask") {
      // Para tarefas do Kanban, usa a primeira letra da tag, se existir.
      return item.tag?.substring(0, 1) || "T";
    }
    return "";
  };

  const getSecondaryText = (item: any) => {
    if (type === "note") {
      // Para anotações, mostra um trecho do conteúdo.
      return item.content
        ? `${item.content.substring(0, 40)}...`
        : "Nenhum conteúdo";
    }
    if (type === "kanbantask") {
      // Para tarefas do Kanban, mostra a data de criação.
      return `Criado em: ${new Date(item.createdAt).toLocaleDateString()}`;
    }
    return "";
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {items && items.length > 0 ? (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-4 transition-colors hover:bg-muted/50 p-2 rounded-lg cursor-pointer"
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold text-xs text-center ${
                    item.tag === "Bug"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {getIconText(item)}
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {getSecondaryText(item)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
            <Icon className="h-8 w-8 mb-4" />
            <p className="text-sm">{emptyText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface KanbanTask {
  id: string;
  title: string;
  tag?: string;
  createdAt: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
}

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
      try {
        const endpoints = ["user", "summary", "tasks", "notes", "phrases"];
        const requests = endpoints.map((endpoint) =>
          fetch(`http://localhost:3001/${endpoint}`)
        );

        const responses = await Promise.all(requests);

        for (const res of responses) {
          if (!res.ok) {
            throw new Error(`Falha ao buscar dados do endpoint: ${res.url}`);
          }
        }

        const [user, summary, kanbanTasks, notes, phrases] = await Promise.all(
          responses.map((res) => res.json())
        );

        // Ordena as tarefas e pega as 3 mais recentes
        const recentKanbanTasks = kanbanTasks
          .sort(
            (a: KanbanTask, b: KanbanTask) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);

        // Pega as 3 anotações mais recentes
        const recentNotes = notes
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);

        setData({
          user,
          summary,
          kanbanTasks: recentKanbanTasks,
          notes: recentNotes,
          phrases,
        });
      } catch (err: any) {
        setError(
          "Não foi possível conectar ao servidor. Verifique se o `json-server` está rodando e o `db.json` está correto."
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
        <p className="ml-4 text-muted-foreground">
          Carregando seu dashboard...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full flex-1 items-center justify-center rounded-2xl bg-destructive/10 p-6 text-center text-destructive-foreground">
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

        {/* --- EXPLICAÇÃO: Layout de 2 colunas para os cards principais --- */}
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
            items={data.notes}
            icon={NotebookText}
            emptyText="Nenhuma anotação recente."
            type="note"
          />
        </div>
      </main>
    </div>
  );
}

// --- ATOM: Frase Motivacional (sem alterações) ---
const MotivationalPhrase = ({ phrase }: { phrase: string }) => (
  <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft">
    <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Sparkles className="h-5 w-5" />
    </div>
    <h4 className="font-semibold text-card-foreground">Pílula de Motivação</h4>
    <p className="mt-2 text-sm text-muted-foreground italic">"{phrase}"</p>
  </div>
);
