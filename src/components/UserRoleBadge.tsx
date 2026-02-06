import { type SystemRole, getRoleLabel } from "@/data/mock-users";
import { cn } from "@/lib/utils";
import { Shield, X } from "lucide-react";

interface UserRoleBadgeProps {
  role: SystemRole;
  systemId?: string;
  className?: string;
}

export function UserRoleBadge({ role, systemId, className }: UserRoleBadgeProps) {
  if (!role) {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground", className)}>
        <X className="h-3 w-3" />
        Sem acesso
      </span>
    );
  }

  const label = systemId ? getRoleLabel(systemId, role) : role;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary", className)}>
      <Shield className="h-3 w-3" />
      {label}
    </span>
  );
}
