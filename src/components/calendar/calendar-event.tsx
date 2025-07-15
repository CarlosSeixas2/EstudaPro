import type { CalendarEvent as Event } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

interface CalendarEventProps {
  event: Event;
}

export function CalendarEventComponent({ event }: CalendarEventProps) {
  return (
    <Badge
      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-sm"
      style={{ backgroundColor: event.color }}
    >
      {event.time !== "Dia Inteiro" && <span>{event.time}</span>}
      <span className="truncate">{event.title}</span>
    </Badge>
  );
}
