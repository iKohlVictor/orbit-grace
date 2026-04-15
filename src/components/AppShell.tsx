import { useState, useCallback, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { systems, type SystemConfig } from "@/data/systems";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function AppShell() {
  const [activeSystem, setActiveSystem] = useState<SystemConfig | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Auto-detect active system from URL
  useEffect(() => {
    const path = location.pathname;
    const matched = systems.find((s) =>
      s.groups.some((g) => g.items.some((i) => path.startsWith(i.path.split("/").slice(0, 2).join("/"))))
    );
    if (matched && matched.id !== activeSystem?.id) {
      setActiveSystem(matched);
    } else if (!matched && path === "/") {
      setActiveSystem(null);
    }
  }, [location.pathname]);

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
