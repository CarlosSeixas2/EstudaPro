import { StudyPlannerTemplate } from "@/templates/study-planner-template";
import type { Schedule, Subject } from "@/types/types";

// Dados que podem vir de uma API, do localStorage, ou serem definidos como constantes
const initialSubjectsData: Subject[] = [
  { id: "math", name: "Matemática", color: "#3b82f6" },
  { id: "bio", name: "Biologia", color: "#22c55e" },
  { id: "hist", name: "História", color: "#f97316" },
];

const daysOfWeekData = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

// Hook para carregar dados do localStorage (exemplo)
const useScheduleData = () => {
  const getInitialSubjects = (): Subject[] => {
    try {
      const saved = localStorage.getItem("MateriasSalvas");
      return saved ? JSON.parse(saved) : initialSubjectsData;
    } catch {
      return initialSubjectsData;
    }
  };

  const getInitialSchedule = (): Schedule => {
    const initialSchedule: Schedule = {};
    daysOfWeekData.forEach((day) => {
      initialSchedule[day] = [];
    });
    try {
      const saved = localStorage.getItem("CronogramaUsuario");
      const parsed = saved ? JSON.parse(saved) : {};
      daysOfWeekData.forEach((day) => {
        initialSchedule[day] = parsed[day] || [];
      });
      return initialSchedule;
    } catch {
      return initialSchedule;
    }
  };

  return {
    subjects: getInitialSubjects(),
    schedule: getInitialSchedule(),
  };
};

export default function StudyPlannerPage() {
  const { subjects, schedule } = useScheduleData();

  return (
    <StudyPlannerTemplate
      initialSubjects={subjects}
      initialSchedule={schedule}
      daysOfWeek={daysOfWeekData}
    />
  );
}
