export type EventCategory =
  | "work"
  | "personal"
  | "family"
  | "health"
  | "travel"
  | "social";
export type ViewMode =
  | "month"
  | "week"
  | "day"
  | "agenda"
  | "todayList"
  | "weekList"
  | "monthList"
  | "allList";

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: Date;
  category: EventCategory;
  color: string; // Agora será um código hexadecimal, ex: "#6B46C1"
}

export interface Category {
  id: EventCategory;
  name: string;
  color: string; // Cor hexadecimal para a categoria
}

export const categories: Category[] = [
  { id: "work", name: "Trabalho", color: "#8B5CF6" }, // Roxo
  { id: "personal", name: "Pessoal", color: "#EC4899" }, // Rosa
  { id: "family", name: "Família", color: "#3B82F6" }, // Azul
  { id: "health", name: "Saúde", color: "#10B981" }, // Verde
  { id: "travel", name: "Viagem", color: "#F59E0B" }, // Laranja
  { id: "social", name: "Social", color: "#EF4444" }, // Vermelho
];

const categoryColorMap = categories.reduce((acc, cat) => {
  acc[cat.id] = cat.color;
  return acc;
}, {} as Record<EventCategory, string>);

// Mock events data for May 2025
export const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Lançamento do Produto",
    time: "10:00",
    date: new Date(2025, 4, 4),
    category: "work",
    color: categoryColorMap.work,
  },
  {
    id: "2",
    title: "Consulta Dentista",
    time: "14:00", // "02:00" PM
    date: new Date(2025, 4, 6),
    category: "health",
    color: categoryColorMap.health,
  },
  {
    id: "3",
    title: "Noite de Cinema",
    time: "19:00", // "07:00" PM
    date: new Date(2025, 4, 11),
    category: "personal",
    color: categoryColorMap.personal,
  },
  {
    id: "4",
    title: "Prazo do Projeto",
    time: "17:00", // "05:00" PM
    date: new Date(2025, 4, 12),
    category: "work",
    color: categoryColorMap.work,
  },
  {
    id: "5",
    title: "Jogo de Futebol do Filho",
    time: "15:00", // "03:00" PM
    date: new Date(2025, 4, 13),
    category: "family",
    color: categoryColorMap.family,
  },
  {
    id: "6",
    title: "Jantar em Família",
    time: "18:00", // "06:00" PM
    date: new Date(2025, 4, 14),
    category: "family",
    color: categoryColorMap.family,
  },
  {
    id: "7",
    title: "Festa de Aniversário",
    time: "20:00", // "08:00" PM
    date: new Date(2025, 4, 15),
    category: "social",
    color: categoryColorMap.social,
  },
  {
    id: "8",
    title: "Consulta Médica",
    time: "09:30",
    date: new Date(2025, 4, 16),
    category: "health",
    color: categoryColorMap.health,
  },
  {
    id: "9",
    title: "Reunião de Equipe",
    time: "10:00",
    date: new Date(2025, 4, 16),
    category: "work",
    color: categoryColorMap.work,
  },
  {
    id: "10",
    title: "Sessão de Academia",
    time: "07:00",
    date: new Date(2025, 4, 16),
    category: "health",
    color: categoryColorMap.health,
  },
  {
    id: "11",
    title: "Sessão de Meditação",
    time: "06:00",
    date: new Date(2025, 4, 16),
    category: "personal",
    color: categoryColorMap.personal,
  },
  {
    id: "12",
    title: "Evento de Networking",
    time: "18:00", // "06:00" PM
    date: new Date(2025, 4, 18),
    category: "social",
    color: categoryColorMap.social,
  },
  {
    id: "13",
    title: "Viagem de Negócios",
    time: "Dia Inteiro",
    date: new Date(2025, 4, 19),
    category: "travel",
    color: categoryColorMap.travel,
  },
  {
    id: "14",
    title: "Fuga de Fim de Semana",
    time: "Dia Inteiro",
    date: new Date(2025, 4, 23),
    category: "travel",
    color: categoryColorMap.travel,
  },
  {
    id: "15",
    title: "Apresentação Cliente",
    time: "14:00", // "02:00" PM
    date: new Date(2025, 4, 11),
    category: "work",
    color: categoryColorMap.work,
  },
];
