import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface BreadcrumbContextType {
  projectCrumb: { name: string; path: string } | null;
  setProjectCrumb: (project: { name: string; path: string } | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

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

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};
