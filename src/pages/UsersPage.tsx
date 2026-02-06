import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreHorizontal,
  Settings2,
  ChevronDown,
  ChevronRight,
  MapPin,
  Power,
  Filter,
} from "lucide-react";
import { systems } from "@/data/systems";
import {
  mockUsers,
  mockBranches,
  mockRegionals,
  type MockUser,
} from "@/data/mock-users";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

function UserExpandedRow({ user }: { user: MockUser }) {
  const activeAccesses = user.accesses.filter((a) => a.role);

  if (activeAccesses.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-muted-foreground">
        Este usuário não possui acesso a nenhum sistema.
      </div>
    );
  }

  return (
    <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
      {activeAccesses.map((access) => {
        const sys = systems.find((s) => s.id === access.systemId);
        if (!sys) return null;

        const branchesByRegional = mockRegionals
          .map((regional) => {
            const branches = mockBranches.filter(
              (b) =>
                b.regionalId === regional.id &&
                access.branches.includes(b.id)
            );
            return { regional, branches };
          })
          .filter((g) => g.branches.length > 0);

        return (
          <div key={access.systemId} className="rounded-md border overflow-hidden">
            <div
              className="flex items-center gap-2 px-3 py-2 border-b"
              style={{
                backgroundColor: `hsl(var(${sys.colorVar}) / 0.06)`,
              }}
            >
              <sys.icon
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: `hsl(var(${sys.colorVar}))` }}
              />
              <span className="text-sm font-medium">{sys.name}</span>
              <UserRoleBadge
                role={access.role}
                systemId={sys.id}
                className="ml-auto"
              />
            </div>
            <div className="px-3 py-2 space-y-1.5">
              {branchesByRegional.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhuma filial selecionada
                </p>
              ) : (
                branchesByRegional.map(({ regional, branches }) => (
                  <div key={regional.id}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {regional.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-4">
                      {branches.map((b) => (
                        <Badge
                          key={b.id}
                          variant="secondary"
                          className="text-[10px] font-normal"
                        >
                          {b.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<MockUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Filters
  const [filterSystem, setFilterSystem] = useState<string>("all");
  const [filterRegional, setFilterRegional] = useState<string>("all");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Toggle status modal
  const [toggleTarget, setToggleTarget] = useState<MockUser | null>(null);

  const availableBranches =
    filterRegional === "all"
      ? mockBranches
      : mockBranches.filter((b) => b.regionalId === filterRegional);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || u.status === filterStatus;

    const matchesSystem =
      filterSystem === "all" ||
      u.accesses.some((a) => a.systemId === filterSystem && a.role);

    const matchesRegional =
      filterRegional === "all" ||
      u.accesses.some((a) =>
        a.role &&
        a.branches.some((bId) => {
          const branch = mockBranches.find((b) => b.id === bId);
          return branch?.regionalId === filterRegional;
        })
      );

    const matchesBranch =
      filterBranch === "all" ||
      u.accesses.some(
        (a) => a.role && a.branches.includes(filterBranch)
      );

    return matchesSearch && matchesStatus && matchesSystem && matchesRegional && matchesBranch;
  });

  const toggleExpand = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedUser((prev) => (prev === userId ? null : userId));
  };

  const confirmToggleStatus = () => {
    if (!toggleTarget) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === toggleTarget.id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
    toast.success(
      toggleTarget.status === "active"
        ? `${toggleTarget.name} foi desativado.`
        : `${toggleTarget.name} foi ativado.`
    );
    setToggleTarget(null);
  };

  const hasActiveFilters =
    filterSystem !== "all" ||
    filterRegional !== "all" ||
    filterBranch !== "all" ||
    filterStatus !== "all";

  const clearFilters = () => {
    setFilterSystem("all");
    setFilterRegional("all");
    setFilterBranch("all");
    setFilterStatus("all");
  };

  const totalCols = 3 + systems.length + 1;

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

        {/* Search + Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <Select value={filterSystem} onValueChange={setFilterSystem}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas plataformas</SelectItem>
                {systems.map((sys) => (
                  <SelectItem key={sys.id} value={sys.id}>
                    {sys.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRegional} onValueChange={(val) => {
              setFilterRegional(val);
              setFilterBranch("all");
            }}>
              <SelectTrigger className="h-8 w-[150px] text-xs">
                <SelectValue placeholder="Regional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas regionais</SelectItem>
                {mockRegionals.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="h-8 w-[170px] text-xs">
                <SelectValue placeholder="Filial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas filiais</SelectItem>
                {availableBranches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground"
                onClick={clearFilters}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]" />
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
                const isExpanded = expandedUser === user.id;

                return (
                  <>
                    <TableRow
                      key={user.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/usuarios/${user.id}`)}
                    >
                      <TableCell className="px-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => toggleExpand(user.id, e)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
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
                            <UserRoleBadge role={access?.role ?? null} systemId={sys.id} />
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
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setToggleTarget(user);
                              }}
                              className="gap-2"
                            >
                              <Power className="h-4 w-4" />
                              {user.status === "active" ? "Desativar" : "Ativar"} Usuário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <AnimatePresence>
                      {isExpanded && (
                        <TableRow key={`${user.id}-detail`}>
                          <TableCell colSpan={totalCols} className="p-0 border-b">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-muted/20"
                            >
                              <UserExpandedRow user={user} />
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={totalCols}
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

      {/* Confirmation modal */}
      <AlertDialog
        open={!!toggleTarget}
        onOpenChange={(open) => !open && setToggleTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleTarget?.status === "active"
                ? "Desativar usuário"
                : "Ativar usuário"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja{" "}
              {toggleTarget?.status === "active" ? "desativar" : "ativar"}{" "}
              <strong>{toggleTarget?.name}</strong>? {toggleTarget?.status === "active"
                ? "O usuário perderá o acesso a todos os sistemas."
                : "O usuário voltará a ter acesso aos sistemas configurados."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              {toggleTarget?.status === "active" ? "Desativar" : "Ativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
