import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { type SystemConfig } from "@/data/systems";
import { useNotifications } from "@/contexts/NotificationsContext";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  system: SystemConfig | null;
  collapsed: boolean;
}

export function AppSidebar({ system, collapsed }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!system) return null;

  const sidebarWidth = collapsed ? "w-14" : "w-60";

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "h-full bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 overflow-hidden transition-[width] duration-200",
        sidebarWidth
      )}
    >
      {/* System indicator */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: `hsl(var(${system.colorVar}))` }}
            />
            <span className="text-xs font-semibold tracking-wide uppercase text-sidebar-muted truncate">
              {system.shortName}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={system.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
          >
            {system.groups.map((group) => (
              <div key={group.label} className="mb-4">
                {!collapsed && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted px-2 mb-1.5">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <button
                          onClick={() => navigate(item.path)}
                          title={collapsed ? item.title : undefined}
                          className={cn(
                            "w-full flex items-center gap-2.5 rounded-md text-sm transition-colors",
                            collapsed ? "justify-center p-2.5" : "px-2.5 py-2",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </nav>
    </motion.aside>
  );
}
