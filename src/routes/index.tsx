import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import { ThemeProvider } from "@/components/theme-provider";
import Timeline from "@/pages/study-planner";
import Tasks from "@/pages/tasks";
import Notes from "@/pages/notes";
import Focus from "@/pages/focus";
import Assistant from "@/pages/assistant";
import MainLayout from "@/layouts";

function MainRoutes() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="EstudaPro-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/schedule" element={<Timeline />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/focus-mode" element={<Focus />} />
            <Route path="/assistant" element={<Assistant />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default MainRoutes;
