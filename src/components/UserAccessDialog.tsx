import { useState } from "react";
import { systems } from "@/data/systems";
import { type MockUser, type SystemRole, roleLabels } from "@/data/mock-users";
import { UserRoleBadge } from "./UserRoleBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface UserAccessDialogProps {
  user: MockUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: MockUser) => void;
}

export function UserAccessDialog({ user, open, onOpenChange, onSave }: UserAccessDialogProps) {
  const [accesses, setAccesses] = useState(user?.accesses ?? []);

  // Sync state when user changes
  const handleOpenChange = (val: boolean) => {
    if (val && user) setAccesses([...user.accesses]);
    onOpenChange(val);
  };

  const updateRole = (systemId: string, role: SystemRole) => {
    setAccesses((prev) =>
      prev.map((a) => (a.systemId === systemId ? { ...a, role } : a))
    );
  };

  const handleSave = () => {
    if (!user) return;
    onSave({ ...user, accesses });
    onOpenChange(false);
    toast.success(`Permissões de ${user.name} atualizadas.`);
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Gerenciar Acessos</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3 py-2">
          {systems.map((sys) => {
            const access = accesses.find((a) => a.systemId === sys.id);
            const currentRole = access?.role ?? null;
            return (
              <div
                key={sys.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="h-8 w-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `hsl(var(${sys.colorVar}) / 0.12)` }}
                  >
                    <sys.icon
                      className="h-4 w-4"
                      style={{ color: `hsl(var(${sys.colorVar}))` }}
                    />
                  </div>
                  <span className="text-sm font-medium truncate">{sys.shortName}</span>
                </div>

                <Select
                  value={currentRole ?? "none"}
                  onValueChange={(val) =>
                    updateRole(sys.id, val === "none" ? null : (val as SystemRole))
                  }
                >
                  <SelectTrigger className="w-[160px] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem acesso</SelectItem>
                    <SelectItem value="admin">{roleLabels.admin}</SelectItem>
                    <SelectItem value="editor">{roleLabels.editor}</SelectItem>
                    <SelectItem value="viewer">{roleLabels.viewer}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
