import { type SystemRole, roleLabels, roleColors } from "@/data/mock-users";
import { cn } from "@/lib/utils";
import { Shield, Pen, Eye, X } from "lucide-react";

const roleIcons: Record<string, React.ElementType> = {
  admin: Shield,
  editor: Pen,
  viewer: Eye,
};

interface UserRoleBadgeProps {
  role: SystemRole;
  className?: string;
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  if (!role) {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground", className)}>
        <X className="h-3 w-3" />
        Sem acesso
      </span>
    );
  }

  const Icon = roleIcons[role];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", roleColors[role], className)}>
      <Icon className="h-3 w-3" />
      {roleLabels[role]}
    </span>
  );
}
