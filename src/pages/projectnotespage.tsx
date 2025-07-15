import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Loader2,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteDialog } from "@/components/organisms/notes/notedialog";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import type { Project, Note } from "@/types/types";
import { cn } from "@/lib/utils";

interface ProjectNotesPageProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectNotesPage({
  project,
  onBack,
}: ProjectNotesPageProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | undefined>();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { setProjectCrumb } = useBreadcrumb();

  useEffect(() => {
    if (project) {
      setProjectCrumb({ name: project.name, path: `/notes/${project.id}` });
    }
    return () => setProjectCrumb(null);
  }, [project, setProjectCrumb]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!project) return;
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/notes?projectId=${project.id}`
        );
        const data = await response.json();

        // Correctly map and convert dates before setting any state
        const notesWithDates = data
          .map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) }))
          .sort(
            (a: Note, b: Note) => b.createdAt.getTime() - a.createdAt.getTime()
          );

        setNotes(notesWithDates);

        if (notesWithDates.length > 0) {
          setSelectedNote(notesWithDates[0]);
        } else {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error("Falha ao buscar anotações:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [project.id]);

  const handleSaveNote = async (
    noteData: Omit<Note, "id" | "createdAt" | "color">
  ) => {
    const notePayload = {
      ...noteData,
      createdAt: new Date().toISOString(),
      projectId: project.id,
    };

    try {
      let savedNote: Note;
      if (currentNote) {
        const response = await fetch(
          `http://localhost:3001/notes/${currentNote.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...notePayload, id: currentNote.id }),
          }
        );
        savedNote = await response.json();
        const updatedNote = {
          ...savedNote,
          createdAt: new Date(savedNote.createdAt),
        };
        setNotes(notes.map((n) => (n.id === savedNote.id ? updatedNote : n)));
        setSelectedNote(updatedNote);
      } else {
        const response = await fetch("http://localhost:3001/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notePayload),
        });
        savedNote = await response.json();
        const newNote = {
          ...savedNote,
          createdAt: new Date(savedNote.createdAt),
        };
        setNotes((prev) => [newNote, ...prev]);
        setSelectedNote(newNote);
      }
    } catch (error) {
      console.error("Falha ao salvar anotação:", error);
    }
    setCurrentNote(undefined);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Tem certeza de que deseja excluir esta anotação?"))
      return;
    try {
      await fetch(`http://localhost:3001/notes/${noteId}`, {
        method: "DELETE",
      });
      const updatedNotes = notes.filter((n) => n.id !== noteId);
      setNotes(updatedNotes);

      if (selectedNote?.id === noteId) {
        setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
      }
    } catch (error) {
      console.error("Falha ao deletar anotação:", error);
    }
  };

  const openNoteDialog = (note?: Note) => {
    setCurrentNote(note);
    setIsNoteDialogOpen(true);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6 flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${project.imageUrl})` }}
          >
            {!project.imageUrl && (
              <span className="text-muted-foreground font-bold">
                {project.name[0]}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>
        <Button onClick={() => openNoteDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Anotação
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Notes List */}
        <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar anotações..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <button
                  key={note.id}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    selectedNote?.id === note.id
                      ? "bg-primary/10 text-primary-foreground"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedNote(note)}
                >
                  <h3 className="font-semibold truncate">{note.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {note.content.replace(/<[^>]+>/g, "").substring(0, 80)}...
                  </p>
                </button>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nenhuma anotação.
              </p>
            )}
          </div>
        </div>

        {/* Note Content */}
        <div className="md:col-span-2 lg:col-span-3 overflow-y-auto">
          {selectedNote ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold">
                      {selectedNote.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">
                      Criado em: {selectedNote.createdAt.toLocaleDateString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openNoteDialog(selectedNote)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="min-h-screen flex flex-col items-center justify-center h-full text-center bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Selecione ou crie uma anotação
                </h3>
                <p className="text-sm text-muted-foreground">
                  Comece a organizar suas ideias.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <NoteDialog
        isOpen={isNoteDialogOpen}
        onClose={() => setIsNoteDialogOpen(false)}
        onSave={handleSaveNote}
        note={currentNote}
        projectId={project.id}
      />
    </div>
  );
}
