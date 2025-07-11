import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { useBreadcrumb } from "@/contexts/breadcrumbcontext";

const breadcrumbNameMap: { [key: string]: string } = {
  schedule: "Cronograma",
  tasks: "Tarefas",
  notes: "Anotações",
  "focus-mode": "Modo Foco",
  assistant: "Ajudante IA",
};

export default function AppBreadcrumb() {
  const location = useLocation();
  const { projectCrumb } = useBreadcrumb();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Início</BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.length > 0 && <BreadcrumbSeparator />}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const name =
            breadcrumbNameMap[value] ||
            value.charAt(0).toUpperCase() + value.slice(1);

          if (isLast && value === "notes" && projectCrumb) {
            return (
              <React.Fragment key={to}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={to}>{name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{projectCrumb.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={to}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={to}>{name}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
