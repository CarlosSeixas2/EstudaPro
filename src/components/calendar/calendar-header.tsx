import { ChevronLeft, ChevronRight, LayoutGrid, ListTodo } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ViewMode } from "@/lib/data";
import React from "react";

interface CalendarHeaderProps {
  currentDate: Date;
  onTodayClick: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  children?: React.ReactNode;
}

export function CalendarHeader({
  currentDate,
  onTodayClick,
  onPrevMonth,
  onNextMonth,
  viewMode,
  onViewChange,
  children,
}: CalendarHeaderProps) {
  const formattedMonthYear = format(currentDate, "MMMM yyyy", { locale: ptBR });

  return (
    <header className="w-full flex h-16 shrink-0 items-center justify-between border-b border-border px-4 py-2">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Calendário</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={onTodayClick}
          className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Hoje
        </Button>
        <Button variant="ghost" size="icon" onClick={onPrevMonth}>
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Mês Anterior</span>
        </Button>
        <span className="min-w-[120px] text-center text-sm font-medium capitalize">
          {formattedMonthYear}
        </span>
        <Button variant="ghost" size="icon" onClick={onNextMonth}>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Próximo Mês</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={viewMode === "month" ? "month" : "list"}
          onValueChange={(value) => {
            if (value === "month") {
              onViewChange("month");
            } else if (value === "list") {
              onViewChange("allList"); // Default to allList when switching to list view
            }
          }}
          className="hidden md:flex"
        >
          <ToggleGroupItem value="month" aria-label="Toggle month view">
            <LayoutGrid className="h-4 w-4" />
            Mês
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Toggle agenda view">
            <ListTodo className="h-4 w-4" />
            Agenda
          </ToggleGroupItem>
        </ToggleGroup>
        {children}
      </div>
    </header>
  );
}
