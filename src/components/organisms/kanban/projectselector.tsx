import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import type { Project } from "@/types/types";

interface ProjectSelectorProps {
  projects: Project[];
  currentProjectId: string;
  onProjectChange: (projectId: string) => void;
}

export function ProjectSelector({
  projects,
  currentProjectId,
  onProjectChange,
}: ProjectSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentProject = projects.find((p) => p.id === currentProjectId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-transparent"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentProject?.color}`} />
            <span className="truncate">{currentProject?.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={() => {
                    onProjectChange(project.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-2 h-2 rounded-full ${project.color}`} />
                    <span className="truncate">{project.name}</span>
                  </div>
                  <Check
                    className={`ml-auto h-4 w-4 ${
                      project.id === currentProjectId
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
