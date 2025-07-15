import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { TaskTag } from "@/types/types";

interface FilterDropdownProps {
  selectedTags: TaskTag[];
  onFilterChange: (tag: TaskTag, checked: boolean) => void;
  tagColors: Record<TaskTag, string>;
}

export const FilterDropdown = ({
  selectedTags,
  onFilterChange,
  tagColors,
}: FilterDropdownProps) => {
  const allTags = Object.keys(tagColors) as TaskTag[];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative ml-2">
          <Filter className="h-4 w-4 mr-2" />
          Filtro
          {selectedTags.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              {selectedTags.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filtrar por Tag</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allTags.map((tag) => (
          <DropdownMenuCheckboxItem
            key={tag}
            checked={selectedTags.includes(tag)}
            onCheckedChange={(checked) => onFilterChange(tag, !!checked)}
          >
            {tag}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
