import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainRoutes from "./routes/index.tsx";
import { BreadcrumbProvider } from "@/contexts/breadcrumbcontext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BreadcrumbProvider>
      <MainRoutes />
    </BreadcrumbProvider>
  </StrictMode>
);
