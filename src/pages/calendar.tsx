import * as React from "react";
import { addMonths, subMonths } from "date-fns";

import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { TaskList } from "@/components/calendar/task-list";
import {
  categories,
  mockEvents,
  type EventCategory,
  type ViewMode,
} from "@/lib/data";
import { CalendarFilterDropdown } from "@/components/calendar/calendar-filter-dropdown";

export default function ChronosCalendarPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date(2025, 4, 1));
  const [viewMode, setViewMode] = React.useState<ViewMode>("month");
  const [selectedCategory, setSelectedCategory] = React.useState<
    EventCategory | "all"
  >("all");

  const handleTodayClick = () => {
    setCurrentDate(new Date());
    setViewMode("month");
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleCategorySelect = (category: EventCategory | "all") => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <CalendarHeader
        currentDate={currentDate}
        onTodayClick={handleTodayClick}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        viewMode={viewMode}
        onViewChange={handleViewChange}
      >
        <CalendarFilterDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategorySelect}
        />
      </CalendarHeader>

      <div className="flex-1 overflow-auto p-4">
        {viewMode === "month" ? (
          <CalendarGrid
            currentDate={currentDate}
            events={mockEvents}
            selectedCategory={selectedCategory}
          />
        ) : (
          <TaskList
            events={mockEvents}
            filterPeriod={viewMode}
            selectedCategory={selectedCategory}
          />
        )}
      </div>
    </div>
  );
}
