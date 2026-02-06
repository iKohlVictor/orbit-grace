import { Menu, Search, ChevronDown, Home, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo-grao-direto.svg";
import { systems, type SystemConfig } from "@/data/systems";
import { useNotifications } from "@/contexts/NotificationsContext";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  activeSystem: SystemConfig | null;
  onSelectSystem: (system: SystemConfig | null) => void;
  onToggleSidebar: () => void;
}

export function AppHeader({ activeSystem, onSelectSystem, onToggleSidebar }: AppHeaderProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onSelectSystem(null);
    navigate("/");
  };

  const handleSelectSystem = (sys: SystemConfig) => {
    onSelectSystem(sys);
    navigate(sys.groups[0]?.items[0]?.path ?? "/");
  };

  return (
    <header className="h-14 border-b bg-card flex items-center px-4 gap-3 shrink-0 z-30">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="shrink-0">
        <Menu className="h-5 w-5" />
      </Button>

      <button onClick={handleGoHome} className="shrink-0 flex items-center gap-2">
        <img src={logo} alt="Grão Direto" className="h-6" />
      </button>

      <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

      {/* System Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 text-sm font-medium max-w-[220px]">
            {activeSystem ? (
              <>
                <activeSystem.icon className="h-4 w-4 shrink-0" style={{ color: `hsl(var(${activeSystem.colorVar}))` }} />
                <span className="truncate">{activeSystem.shortName}</span>
              </>
            ) : (
              <>
                <Home className="h-4 w-4 shrink-0" />
                <span>Início</span>
              </>
            )}
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={handleGoHome} className="gap-2">
            <Home className="h-4 w-4" />
            Início
          </DropdownMenuItem>
          {systems.map((sys) => (
            <DropdownMenuItem key={sys.id} onClick={() => handleSelectSystem(sys)} className="gap-2">
              <sys.icon className="h-4 w-4" style={{ color: `hsl(var(${sys.colorVar}))` }} />
              {sys.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1" />

      <Button variant="ghost" size="icon" className="hidden sm:flex">
        <Search className="h-4.5 w-4.5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => navigate("/usuarios")} title="Usuários">
        <Users className="h-4.5 w-4.5" />
      </Button>
      <NotificationBell />

      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
        GD
      </div>
    </header>
  );
}
