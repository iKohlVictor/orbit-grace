import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { UsersProvider } from "./contexts/UsersContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import Index from "./pages/Index";
import SystemPage from "./pages/SystemPage";
import UsersPage from "./pages/UsersPage";
import UserDetailPage from "./pages/UserDetailPage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound";

const AssinaturasPage = React.lazy(() => import("./pages/AssinaturasPage"));
const EnviarAssinaturaPage = React.lazy(() => import("./pages/EnviarAssinaturaPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UsersProvider>
        <NotificationsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Carregando...</div>}>
              <Routes>
                <Route element={<AppShell />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/contratos/assinaturas" element={<AssinaturasPage />} />
                  <Route path="/contratos/assinaturas/enviar" element={<EnviarAssinaturaPage />} />
                  <Route path="/contratos/*" element={<SystemPage />} />
                  <Route path="/clientes/*" element={<SystemPage />} />
                  <Route path="/logistica/*" element={<SystemPage />} />
                  <Route path="/barter/*" element={<SystemPage />} />
                  <Route path="/usuarios" element={<UsersPage />} />
                  <Route path="/usuarios/:userId" element={<UserDetailPage />} />
                  <Route path="/notificacoes" element={<NotificationsPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </NotificationsProvider>
      </UsersProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
