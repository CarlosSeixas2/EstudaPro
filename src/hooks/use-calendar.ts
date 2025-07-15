import { useState, useMemo, useCallback } from "react";
import {
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
  isSameWeek,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarTask, ViewMode, TaskCategory } from "@/types/types";

const initialTasks: CalendarTask[] = [
  {
    id: "1",
    name: "Reunião com Cliente A",
    description: "Discussão do projeto X",
    category: "Reuniões",
    assignedTo: { date: format(addDays(new Date(), 1), "yyyy-MM-dd"), time: 9 },
  },
  {
    id: "2",
    name: "Desenvolver Feature B",
    description: "Implementar nova funcionalidade",
    category: "Tarefas",
    assignedTo: {
      date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      time: 14,
    },
  },
  {
    id: "3",
    name: "Planejamento Semanal",
    description: "Reunião de equipe para planejar a semana",
    category: "Reuniões",
    assignedTo: { date: format(new Date(), "yyyy-MM-dd"), time: 10 },
  },
  {
    id: "4",
    name: "Enviar Relatório Mensal",
    description: "Preparar e enviar relatório de progresso",
    category: "Tarefas",
    assignedTo: null,
  },
  {
    id: "5",
    name: "Evento de Lançamento",
    description: "Participar do evento de lançamento do produto",
    category: "Eventos",
    assignedTo: {
      date: format(addDays(new Date(), 4), "yyyy-MM-dd"),
      time: 16,
    },
  },
  {
    id: "6",
    name: "Revisar Código",
    description: "Revisão de pull requests",
    category: "Tarefas",
    assignedTo: null,
  },
  {
    id: "7",
    name: "Almoço com Equipe",
    description: "Almoço de integração",
    category: "Reuniões",
    assignedTo: {
      date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
      time: 12,
    },
  },
];

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [tasks, setTasks] = useState<CalendarTask[]>(initialTasks);
  const [activeCategory, setActiveCategory] = useState<TaskCategory>("Todas");

  const getWeekDays = useCallback((date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, []);

  const getMonthDays = useCallback((date: Date) => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, []);

  const hours = useMemo(() => {
    return Array.from({ length: 13 }).map((_, i) => i + 8); // 08h to 20h
  }, []);

  const visibleDays = useMemo(() => {
    if (viewMode === "week") {
      return getWeekDays(currentDate);
    } else if (viewMode === "day") {
      return [startOfDay(currentDate)];
    } else {
      // month
      return getMonthDays(currentDate);
    }
  }, [currentDate, viewMode, getWeekDays, getMonthDays]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeCategory === "Todas") return true;
      return task.category === activeCategory;
    });
  }, [tasks, activeCategory]);

  const tasksForCurrentView = useMemo(() => {
    return filteredTasks.filter((task) => {
      if (!task.assignedTo) return false;
      const taskDate = new Date(task.assignedTo.date);

      if (viewMode === "day") {
        return isSameDay(taskDate, currentDate);
      } else if (viewMode === "week") {
        return isSameWeek(taskDate, currentDate, { weekStartsOn: 1 });
      } else {
        // month
        return isSameMonth(taskDate, currentDate);
      }
    });
  }, [filteredTasks, currentDate, viewMode]);

  const unassignedTasks = useMemo(() => {
    return filteredTasks.filter((task) => !task.assignedTo);
  }, [filteredTasks]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setViewMode("day");
  }, []);

  const goToNext = useCallback(() => {
    if (viewMode === "week") {
      setCurrentDate((prev) => addWeeks(prev, 1));
    } else if (viewMode === "day") {
      setCurrentDate((prev) => addDays(prev, 1));
    } else {
      // month
      setCurrentDate((prev) => addMonths(prev, 1));
    }
  }, [viewMode]);

  const goToPrevious = useCallback(() => {
    if (viewMode === "week") {
      setCurrentDate((prev) => subWeeks(prev, 1));
    } else if (viewMode === "day") {
      setCurrentDate((prev) => addDays(prev, -1));
    } else {
      // month
      setCurrentDate((prev) => subMonths(prev, 1));
    }
  }, [viewMode]);

  const addTask = useCallback(
    (name: string, description: string, category: TaskCategory) => {
      const newTask: CalendarTask = {
        id: String(tasks.length + 1),
        name,
        description,
        category,
        assignedTo: null,
      };
      setTasks((prev) => [...prev, newTask]);
    },
    [tasks.length]
  );

  const updateTaskPosition = useCallback(
    (taskId: string, newDate: string | null, newTime: number | null) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                assignedTo:
                  newDate && newTime !== null
                    ? { date: newDate, time: newTime }
                    : null,
              }
            : task
        )
      );
    },
    []
  );

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    tasks: filteredTasks,
    tasksForCurrentView,
    unassignedTasks,
    activeCategory,
    setActiveCategory,
    getWeekDays,
    getMonthDays,
    hours,
    visibleDays,
    goToToday,
    goToNext,
    goToPrevious,
    addTask,
    updateTaskPosition,
    format,
    ptBR,
  };
}
