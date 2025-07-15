export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
}

export const noteColors = [
  "bg-yellow-200 dark:bg-yellow-900/50",
  "bg-blue-200 dark:bg-blue-900/50",
  "bg-green-200 dark:bg-green-900/50",
  "bg-purple-200 dark:bg-purple-900/50",
  "bg-red-200 dark:bg-red-900/50",
  "bg-indigo-200 dark:bg-indigo-900/50",
];

export const projectColors = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-red-500 to-red-600",
  "bg-gradient-to-br from-yellow-500 to-yellow-600",
  "bg-gradient-to-br from-indigo-500 to-indigo-600",
  "bg-gradient-to-br from-pink-500 to-pink-600",
  "bg-gradient-to-br from-teal-500 to-teal-600",
];

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface ScheduledItem extends Subject {
  uniqueId: string;
}

export interface Schedule {
  [day: string]: ScheduledItem[];
}
