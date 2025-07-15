import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

import type { CalendarEvent, EventCategory } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CalendarEventComponent } from "./calendar-event";

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedCategory: EventCategory | "all";
}

export function CalendarGrid({
  currentDate,
  events,
  selectedCategory,
}: CalendarGridProps) {
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(startOfCurrentMonth, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(endOfCurrentMonth, { weekStartsOn: 0 }); // Saturday

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDayNumberColor = (day: Date) => {
    if (isToday(day)) {
      return "text-white bg-primary rounded-full w-6 h-6 flex items-center justify-center";
    }
    return "text-muted-foreground";
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground border-b pb-2">
        {dayNames.map((dayName) => (
          <div key={dayName}>{dayName}</div>
        ))}
      </div>
      <div className="grid h-full grid-cols-7 grid-rows-[repeat(6,minmax(120px,1fr))]">
        {days.map((day, index) => {
          const dayEvents = events
            .filter(
              (event) =>
                isSameDay(event.date, day) &&
                (selectedCategory === "all" ||
                  event.category === selectedCategory)
            )
            .sort((a, b) => a.time.localeCompare(b.time));

          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={index}
              className={cn(
                "relative border-b border-r p-2 flex flex-col",
                !isCurrentMonth && "bg-muted/30"
              )}
            >
              <div className="flex justify-end">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    getDayNumberColor(day)
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1.5 overflow-y-auto">
                {dayEvents.map((event) => (
                  <CalendarEventComponent key={event.id} event={event} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
