import { format, isSameDay, isSameWeek, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { CalendarEvent, EventCategory, ViewMode } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TaskListProps {
  events: CalendarEvent[];
  filterPeriod: ViewMode;
  selectedCategory: EventCategory | "all";
}

export function TaskList({
  events,
  filterPeriod,
  selectedCategory,
}: TaskListProps) {
  const today = new Date();

  const filteredEvents = events
    .filter((event) => {
      const isCategoryMatch =
        selectedCategory === "all" || event.category === selectedCategory;

      if (!isCategoryMatch) return false;

      switch (filterPeriod) {
        case "todayList":
          return isSameDay(event.date, today);
        case "weekList":
          return isSameWeek(event.date, today, { weekStartsOn: 0 });
        case "monthList":
          return isSameMonth(event.date, today);
        case "allList":
        default:
          return true;
      }
    })
    .sort(
      (a, b) =>
        a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time)
    );

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const dateKey = format(event.date, "EEEE, dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const getTitleForFilter = (mode: ViewMode) => {
    switch (mode) {
      case "todayList":
        return "Tarefas de Hoje";
      case "weekList":
        return "Tarefas da Semana";
      case "monthList":
        return "Tarefas do Mês";
      case "allList":
        return "Todas as Tarefas";
      default:
        return "Tarefas";
    }
  };

  return (
    <div className="flex-1 p-4">
      <h2 className="mb-6 text-2xl font-bold text-primary-foreground">
        {getTitleForFilter(filterPeriod)}
      </h2>
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        {Object.keys(groupedEvents).length === 0 ? (
          <p className="text-muted-foreground">
            Nenhuma tarefa encontrada para este período.
          </p>
        ) : (
          Object.keys(groupedEvents).map((dateKey) => (
            <div key={dateKey} className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-muted-foreground capitalize">
                {dateKey}
              </h3>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupedEvents[dateKey].map((event) => (
                  <Card
                    key={event.id}
                    className={cn(
                      "relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg",
                      `border-l-4 border-${event.color}-DEFAULT`
                    )}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold text-primary-foreground">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {event.time}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Categoria: {event.category}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
