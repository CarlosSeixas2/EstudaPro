import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Category, EventCategory } from "@/lib/data";

interface CalendarFilterDropdownProps {
  categories: Category[];
  selectedCategory: EventCategory | "all";
  onCategoryChange: (category: EventCategory | "all") => void;
}

export function CalendarFilterDropdown({
  categories,
  selectedCategory,
  onCategoryChange,
}: CalendarFilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtro
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filtrar por Categoria</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedCategory}
          onValueChange={(value) =>
            onCategoryChange(value as EventCategory | "all")
          }
        >
          <DropdownMenuRadioItem
            value="all"
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="w-3 h-3 rounded-full bg-muted-foreground" />
            <span>Todas</span>
          </DropdownMenuRadioItem>
          {categories.map((category) => (
            <DropdownMenuRadioItem
              key={category.id}
              value={category.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
