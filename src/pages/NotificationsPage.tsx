import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, UserCog, TrendingUp, CheckCheck, Trash2, ChevronDown } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";
import { systems } from "@/data/systems";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { AppNotification } from "@/data/mock-notifications";

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  if (type === "user_action") return <UserCog className="h-5 w-5 text-blue-500 shrink-0" />;
  return <TrendingUp className="h-5 w-5 text-amber-500 shrink-0" />;
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const [filterType, setFilterType] = useState<string>("");
  const [filterSystem, setFilterSystem] = useState<string>("");
  const [filterRead, setFilterRead] = useState<string>("");

  const filtered = notifications.filter((n) => {
    if (filterType && n.type !== filterType) return false;
    if (filterSystem && n.systemId !== filterSystem) return false;
    if (filterRead === "unread" && n.read) return false;
    if (filterRead === "read" && !n.read) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 lg:p-10 w-full">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notificações
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unreadCount > 0 ? `${unreadCount} não lida(s)` : "Todas lidas"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative min-w-[140px]">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none cursor-pointer"
            >
              <option value="">Todos os tipos</option>
              <option value="user_action">Ações de usuários</option>
              <option value="business_event">Eventos de negócio</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative min-w-[140px]">
            <select
              value={filterSystem}
              onChange={(e) => setFilterSystem(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none cursor-pointer"
            >
              <option value="">Todos os sistemas</option>
              {systems.map((sys) => (
                <option key={sys.id} value={sys.id}>{sys.shortName}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative min-w-[120px]">
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none cursor-pointer"
            >
              <option value="">Todas</option>
              <option value="unread">Não lidas</option>
              <option value="read">Lidas</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* List */}
        <div className="rounded-lg border bg-card divide-y">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhuma notificação encontrada.</p>
            </div>
          ) : (
            filtered.map((n) => {
              const sys = n.systemId ? systems.find((s) => s.id === n.systemId) : null;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 px-4 py-4 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <NotificationIcon type={n.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {sys && (
                        <Badge variant="outline" className="text-[10px] h-5" style={{ borderColor: `hsl(var(${sys.colorVar}))`, color: `hsl(var(${sys.colorVar}))` }}>
                          {sys.shortName}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[10px] h-5">
                        {n.type === "user_action" ? "Usuário" : "Negócio"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(n.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        {" · "}
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.read && (
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => markAsRead(n.id)}>
                        Marcar como lida
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteNotification(n.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
