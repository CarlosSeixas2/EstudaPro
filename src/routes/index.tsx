import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layouts";
import Home from "../components/pages/home";
import { ThemeProvider } from "@/components/theme-provider";
import Timeline from "@/components/pages/timeline";
import Tasks from "@/components/pages/tasks";
import Notes from "@/components/pages/notes";
import Focus from "@/components/pages/focus";
import Assistant from "@/components/pages/assistant";

function MainRoutes() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
