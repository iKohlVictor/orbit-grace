import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, ChevronDown, ChevronRight, X, Building2 } from "lucide-react";
import { systems } from "@/data/systems";
import { maskPhone, maskCpfCnpj } from "@/lib/masks";
import {
  mockUsers,
  mockBranches,
  mockRegionals,
  systemRoles,
  getRoleLabel,
  type MockUser,
  type SystemRole,
  type UserAccess,
} from "@/data/mock-users";
import { UserRoleBadge } from "@/components/UserRoleBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

function emptyAccesses(): UserAccess[] {
  return systems.map((s) => ({ systemId: s.id, role: null, branches: [] }));
}

function emptyUser(): Omit<MockUser, "id"> {
  return {
    name: "",
    email: "",
    phone: "",
    document: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    accesses: emptyAccesses(),
  };
}

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isNew = userId === "novo";

  const [form, setForm] = useState<Omit<MockUser, "id"> & { id?: string }>(
    () => {
      if (isNew) return emptyUser();
      const found = mockUsers.find((u) => u.id === userId);
      return found ? { ...found, accesses: found.accesses.map((a) => ({ ...a, branches: [...a.branches] })) } : emptyUser();
    }
  );

  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);

  const updateField = <K extends keyof MockUser>(key: K, value: MockUser[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateAccess = (systemId: string, updates: Partial<UserAccess>) => {
    setForm((prev) => ({
      ...prev,
      accesses: prev.accesses.map((a) =>
        a.systemId === systemId ? { ...a, ...updates } : a
      ),
    }));
  };

  const toggleBranch = (systemId: string, branchId: string) => {
    setForm((prev) => ({
      ...prev,
      accesses: prev.accesses.map((a) => {
        if (a.systemId !== systemId) return a;
        const has = a.branches.includes(branchId);
        return {
          ...a,
          branches: has
            ? a.branches.filter((b) => b !== branchId)
            : [...a.branches, branchId],
        };
      }),
    }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Nome e email são obrigatórios.");
      return;
    }
    toast.success(isNew ? "Usuário criado com sucesso." : "Usuário atualizado com sucesso.");
    navigate("/usuarios");
  };

  const toggleExpand = (sysId: string) =>
    setExpandedSystem((prev) => (prev === sysId ? null : sysId));

  return (
    <div className="p-4 md:p-8 lg:p-10 w-full">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/usuarios")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold">
              {isNew ? "Novo Usuário" : "Editar Usuário"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isNew
                ? "Preencha os dados e configure os acessos"
                : "Atualize os dados e permissões"}
            </p>
          </div>
        </div>

        {/* Basic info */}
        <section className="rounded-lg border bg-card p-5 mb-6">
          <h2 className="font-display text-base font-semibold mb-4">
            Dados Pessoais
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome completo"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={form.phone}
                onChange={(e) => updateField("phone", maskPhone(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="document">Documento (opcional)</Label>
              <Input
                id="document"
                placeholder="CPF ou CNPJ"
                value={form.document ?? ""}
                onChange={(e) => updateField("document", maskCpfCnpj(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5 pt-4 border-t">
            <Switch
              id="status"
              checked={form.status === "active"}
              onCheckedChange={(v) =>
                updateField("status", v ? "active" : "inactive")
              }
            />
            <Label htmlFor="status" className="cursor-pointer">
              Usuário ativo
            </Label>
          </div>
        </section>

        {/* Systems access */}
        <section className="rounded-lg border bg-card p-5 mb-6">
          <h2 className="font-display text-base font-semibold mb-4">
            Acessos por Sistema
          </h2>
          <div className="space-y-3">
            {systems.map((sys) => {
              const access = form.accesses.find((a) => a.systemId === sys.id);
              const isExpanded = expandedSystem === sys.id;
              const hasAccess = access?.role !== null && access?.role !== undefined;

              return (
                <div
                  key={sys.id}
                  className="rounded-lg border overflow-hidden"
                >
                  {/* System row */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(sys.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div
                      className="h-9 w-9 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `hsl(var(${sys.colorVar}) / 0.12)`,
                      }}
                    >
                      <sys.icon
                        className="h-4.5 w-4.5"
                        style={{ color: `hsl(var(${sys.colorVar}))` }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{sys.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <UserRoleBadge role={access?.role ?? null} systemId={sys.id} />
                        {hasAccess && access!.branches.length > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            · {access!.branches.length} filial(is)
                          </span>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t space-y-4">
                          {/* Role select */}
                          <div className="space-y-1.5">
                            <Label className="text-xs">Perfil</Label>
                            <Select
                              value={access?.role ?? "none"}
                              onValueChange={(val) =>
                                updateAccess(sys.id, {
                                  role:
                                    val === "none"
                                      ? null
                                      : (val as SystemRole),
                                  ...(val === "none" ? { branches: [] } : {}),
                                })
                              }
                            >
                              <SelectTrigger className="h-9 w-full sm:w-[200px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Sem acesso</SelectItem>
                                <SelectItem value="admin">
                                  {roleLabels.admin}
                                </SelectItem>
                                <SelectItem value="editor">
                                  {roleLabels.editor}
                                </SelectItem>
                                <SelectItem value="viewer">
                                  {roleLabels.viewer}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Regionals & Branches */}
                          {hasAccess && (
                            <div className="space-y-3">
                              <Label className="text-xs flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5" />
                                Regionais e Filiais com acesso
                              </Label>
                              {mockRegionals.map((regional) => {
                                const regionalBranches = mockBranches.filter(
                                  (b) => b.regionalId === regional.id
                                );
                                const selectedInRegional = regionalBranches.filter(
                                  (b) => access?.branches.includes(b.id)
                                );
                                const allSelected =
                                  regionalBranches.length > 0 &&
                                  selectedInRegional.length === regionalBranches.length;
                                const someSelected =
                                  selectedInRegional.length > 0 && !allSelected;

                                const toggleAllRegional = () => {
                                  const branchIds = regionalBranches.map((b) => b.id);
                                  setForm((prev) => ({
                                    ...prev,
                                    accesses: prev.accesses.map((a) => {
                                      if (a.systemId !== sys.id) return a;
                                      if (allSelected) {
                                        return {
                                          ...a,
                                          branches: a.branches.filter(
                                            (id) => !branchIds.includes(id)
                                          ),
                                        };
                                      }
                                      return {
                                        ...a,
                                        branches: [
                                          ...new Set([...a.branches, ...branchIds]),
                                        ],
                                      };
                                    }),
                                  }));
                                };

                                return (
                                  <div
                                    key={regional.id}
                                    className="rounded-md border overflow-hidden"
                                  >
                                    <label className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                                      <Checkbox
                                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                                        onCheckedChange={toggleAllRegional}
                                      />
                                      <span className="text-sm font-medium">
                                        {regional.name}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground ml-auto">
                                        {selectedInRegional.length}/{regionalBranches.length}
                                      </span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
                                      {regionalBranches.map((branch) => {
                                        const checked =
                                          access?.branches.includes(branch.id) ?? false;
                                        return (
                                          <label
                                            key={branch.id}
                                            className="flex items-center gap-2.5 rounded px-3 py-2 cursor-pointer hover:bg-muted/40 transition-colors"
                                          >
                                            <Checkbox
                                              checked={checked}
                                              onCheckedChange={() =>
                                                toggleBranch(sys.id, branch.id)
                                              }
                                            />
                                            <span className="text-sm">
                                              {branch.name}
                                            </span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                              {access!.branches.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                  Selecione ao menos uma filial.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/usuarios")}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {isNew ? "Criar Usuário" : "Salvar Alterações"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
