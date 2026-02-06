import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { UsersProvider } from "./contexts/UsersContext";
import Index from "./pages/Index";
import SystemPage from "./pages/SystemPage";
import UsersPage from "./pages/UsersPage";
import UserDetailPage from "./pages/UserDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UsersProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Index />} />
              <Route path="/contratos/*" element={<SystemPage />} />
              <Route path="/clientes/*" element={<SystemPage />} />
              <Route path="/logistica/*" element={<SystemPage />} />
              <Route path="/barter/*" element={<SystemPage />} />
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/usuarios/:userId" element={<UserDetailPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UsersProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
