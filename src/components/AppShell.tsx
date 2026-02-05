import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { type SystemConfig } from "@/data/systems";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function AppShell() {
  const [activeSystem, setActiveSystem] = useState<SystemConfig | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader
        activeSystem={activeSystem}
        onSelectSystem={setActiveSystem}
        onToggleSidebar={toggleSidebar}
      />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar system={activeSystem} collapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ activeSystem, setActiveSystem }} />
        </main>
      </div>
    </div>
  );
}
