import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  BookCheck,
  Target,
  NotebookText,
  Pin,
  Loader2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

//================================================================//
//  TIP: Idealmente, cada um dos componentes abaixo estaria       //
//  em seu próprio arquivo dentro de `src/components/atoms`,      //
//  `molecules`, ou `organisms` para seguir o Atomic Design.      //
//  Estão todos aqui para facilitar a visualização da página.     //
//================================================================//

// --- ATOM: Frase Motivacional ---
const MotivationalPhrase = ({ phrase }: { phrase: string }) => (
  <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft">
    <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Sparkles className="h-5 w-5" />
    </div>
    <h4 className="font-semibold text-card-foreground">Pílula de Motivação</h4>
    <p className="mt-2 text-sm text-muted-foreground italic">"{phrase}"</p>
  </div>
);

// --- ORGANISM: Resumo do Dia ---
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
          <div className="text-2xl font-bold">+3</div>
          <p className="text-xs text-muted-foreground">Na última semana</p>
        </CardContent>
      </Card>
    </div>
  );
};

// --- ORGANISM: Lista de Itens (Tarefas ou Anotações) ---
const ItemListCard = ({
  title,
  items,
  icon: Icon,
  emptyText,
  type,
}: {
  title: string;
  items: DashboardData["tasks"] | DashboardData["notes"];
  icon: React.ElementType;
  emptyText: string;
  type: "task" | "note";
}) => (
  <Card className="flex flex-col">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base">
        <Icon className="h-5 w-5" />
        <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-1">
      {items.length > 0 ? (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-4 transition-colors hover:bg-muted/50 p-2 rounded-lg cursor-pointer"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                {type === "task"
                  ? (item as DashboardData["tasks"][0]).time.substring(0, 2)
                  : (item as DashboardData["notes"][0]).subject.substring(0, 1)}
              </div>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.subject}{" "}
                  {type === "task" &&
                    `às ${(item as DashboardData["tasks"][0]).time}`}
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

// --- INTERFACE DE DADOS ---
interface DashboardData {
  user: { name: string };
  summary: { tasksToday: number; tasksCompleted: number; focusMinutes: number };
  tasks: { id: number; title: string; time: string; subject: string }[];
  notes: { id: number; title: string; subject: string }[];
  phrases: { id: number; text: string }[];
}

// --- COMPONENTE DE PÁGINA ---
export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Para testes, se o servidor não estiver rodando, use dados mockados após um erro
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

        const [user, summary, tasks, notes, phrases] = await Promise.all(
          responses.map((res) => res.json())
        );

        setData({ user, summary, tasks, notes, phrases });
      } catch (err: any) {
        setError(
          "Não foi possível conectar ao servidor. Verifique se o `json-server` está rodando na porta 3001."
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
    <div className="flex flex-1 flex-col gap-6 lg:gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Olá, {data.user.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) de volta, aqui está o seu resumo do dia.
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-6 lg:gap-8">
        <DailySummary summary={data.summary} />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <ItemListCard
            title="Próximas Sessões de Estudo"
            items={data.tasks}
            icon={Pin}
            emptyText="Nenhuma sessão agendada para hoje."
            type="task"
          />
          <ItemListCard
            title="Anotações Recentes"
            items={data.notes}
            icon={NotebookText}
            emptyText="Nenhuma anotação recente."
            type="note"
          />
        </div>

        <MotivationalPhrase phrase={randomPhrase} />
      </main>
    </div>
  );
}
