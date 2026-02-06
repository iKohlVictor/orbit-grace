import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { type SystemConfig } from "@/data/systems";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Power,
  Pencil,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { systems } from "@/data/systems";
import {
  mockBranches,
  mockRegionals,
  type MockUser,
} from "@/data/mock-users";
import { useUsers } from "@/contexts/UsersContext";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
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
  const { activeSystem } = useOutletContext<{ activeSystem: SystemConfig | null }>();
  const { users, updateUser } = useUsers();
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const [filterSystem, setFilterSystem] = useState(activeSystem?.id ?? "");
  const [filterRegional, setFilterRegional] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [toggleTarget, setToggleTarget] = useState<MockUser | null>(null);

  const availableBranches =
    filterRegional
      ? mockBranches.filter((b) => b.regionalId === filterRegional)
      : mockBranches;

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !filterStatus || u.status === filterStatus;

    const matchesSystem =
      !filterSystem ||
      u.accesses.some((a) => a.systemId === filterSystem && a.role);

    const matchesRegional =
      !filterRegional ||
      u.accesses.some((a) =>
        a.role &&
        a.branches.some((bId) => {
          const branch = mockBranches.find((b) => b.id === bId);
          return branch?.regionalId === filterRegional;
        })
      );

    const matchesBranch =
      !filterBranch ||
      u.accesses.some((a) => a.role && a.branches.includes(filterBranch));

    return matchesSearch && matchesStatus && matchesSystem && matchesRegional && matchesBranch;
  });

  // Pagination
  const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Reset page when filters change
  const resetPage = () => setCurrentPage(1);

  const toggleExpand = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedUser((prev) => (prev === userId ? null : userId));
  };

  const confirmToggleStatus = () => {
    if (!toggleTarget) return;
    const newStatus = toggleTarget.status === "active" ? "inactive" : "active";
    updateUser(toggleTarget.id, { status: newStatus });
    toast.success(
      toggleTarget.status === "active"
        ? `${toggleTarget.name} foi desativado.`
        : `${toggleTarget.name} foi ativado.`
    );
    setToggleTarget(null);
  };

  const hasActiveFilters =
    !!filterSystem || !!filterRegional || !!filterBranch || !!filterStatus;

  const clearFilters = () => {
    setFilterSystem("");
    setFilterRegional("");
    setFilterBranch("");
    setFilterStatus("");
    resetPage();
  };

  const totalCols = 3 + systems.length + 1;

  return (
    <TooltipProvider>
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

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              />
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={filterSystem}
                onChange={(e) => { setFilterSystem(e.target.value); resetPage(); }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
              >
                <option value="">Plataforma</option>
                {systems.map((sys) => (
                  <option key={sys.id} value={sys.id}>
                    {sys.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={filterRegional}
                onChange={(e) => {
                  setFilterRegional(e.target.value);
                  setFilterBranch("");
                  resetPage();
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
              >
                <option value="">Regional</option>
                {mockRegionals.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={filterBranch}
                onChange={(e) => { setFilterBranch(e.target.value); resetPage(); }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
              >
                <option value="">Filial</option>
                {availableBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative min-w-[120px]">
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); resetPage(); }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
              >
                <option value="">Status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
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
                  <TableHead className="w-[100px] text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((user) => {
                  const initials = user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);
                  const isExpanded = expandedUser === user.id;

                  return (
                    <>
                      <TableRow key={user.id}>
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
                          <div className="flex items-center justify-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => navigate(`/usuarios/${user.id}`)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setToggleTarget(user)}
                                >
                                  <Power className={`h-4 w-4 ${user.status === "active" ? "text-destructive" : "text-green-600"}`} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.status === "active" ? "Desativar" : "Ativar"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
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

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Exibindo</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="h-8 rounded-md border border-input bg-background px-2 pr-7 text-sm appearance-none cursor-pointer"
                  >
                    {PAGE_SIZE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" />
                </div>
                <span>
                  — {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} de {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage(1)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 font-medium text-foreground">
                  {safePage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>

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
                <strong>{toggleTarget?.name}</strong>?{" "}
                {toggleTarget?.status === "active"
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
    </TooltipProvider>
  );
}
