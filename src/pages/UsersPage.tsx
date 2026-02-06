import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, Settings2 } from "lucide-react";
import { systems } from "@/data/systems";
import { mockUsers, type MockUser } from "@/data/mock-users";
import { UserRoleBadge } from "@/components/UserRoleBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersPage() {
  const navigate = useNavigate();
  const [users] = useState<MockUser[]>(mockUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 lg:p-10 w-full">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Usuários</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gerencie os acessos dos usuários entre os sistemas
            </p>
          </div>
          <Button
            className="gap-2 shrink-0"
            size="sm"
            onClick={() => navigate("/usuarios/novo")}
          >
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">Usuário</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                {systems.map((sys) => (
                  <TableHead key={sys.id} className="text-center min-w-[120px]">
                    <div className="flex items-center justify-center gap-1.5">
                      <sys.icon
                        className="h-3.5 w-3.5"
                        style={{ color: `hsl(var(${sys.colorVar}))` }}
                      />
                      <span>{sys.shortName}</span>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => {
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);

                return (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/usuarios/${user.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {user.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    {systems.map((sys) => {
                      const access = user.accesses.find(
                        (a) => a.systemId === sys.id
                      );
                      return (
                        <TableCell key={sys.id} className="text-center">
                          <UserRoleBadge role={access?.role ?? null} />
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/usuarios/${user.id}`);
                            }}
                            className="gap-2"
                          >
                            <Settings2 className="h-4 w-4" />
                            Gerenciar Acessos
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3 + systems.length}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
