import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface BreadcrumbContextType {
  projectCrumb: { name: string; path: string } | null;
  setProjectCrumb: (project: { name: string; path: string } | null) => void;
}

export const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [projectCrumb, setProjectCrumb] = useState<{
    name: string;
    path: string;
  } | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ projectCrumb, setProjectCrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
