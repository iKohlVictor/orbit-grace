export type SystemRole = string | null;

export interface UserAccess {
  systemId: string;
  role: SystemRole;
  branches: string[];
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  document?: string;
  avatar?: string;
  status: "active" | "inactive";
  accesses: UserAccess[];
  lastLogin: string;
}

export interface SystemRoleOption {
  value: string;
  label: string;
}

export const systemRoles: Record<string, SystemRoleOption[]> = {
  contratos: [
    { value: "filial", label: "Filial" },
    { value: "gerencia_regional", label: "Gerência Regional" },
    { value: "gerencia_nacional", label: "Gerência Nacional" },
    { value: "gerencia_gbs", label: "Gerência GBS" },
    { value: "admin", label: "Administrador" },
    { value: "analise_doc", label: "Análise de Documentação" },
  ],
  clientes: [
    { value: "filial", label: "Filial" },
    { value: "regional", label: "Regional" },
    { value: "nacional", label: "Nacional" },
    { value: "especialista", label: "Especialista" },
    { value: "key_account", label: "KeyAccount" },
    { value: "admin", label: "Administrador" },
  ],
  logistica: [
    { value: "filial", label: "Filial" },
    { value: "regional", label: "Regional" },
    { value: "nacional", label: "Nacional" },
    { value: "troca_notas", label: "Troca Notas" },
    { value: "admin", label: "Administrador" },
    { value: "logistico", label: "Logístico" },
  ],
  barter: [
    { value: "filial", label: "Filial" },
    { value: "regional", label: "Regional" },
    { value: "nacional", label: "Nacional" },
    { value: "mesa", label: "Mesa" },
    { value: "admin", label: "Administrador" },
    { value: "especialista", label: "Especialista" },
  ],
};

export function getRoleLabel(systemId: string, role: SystemRole): string {
  if (!role) return "Sem acesso";
  const roles = systemRoles[systemId];
  return roles?.find((r) => r.value === role)?.label ?? role;
}

export interface Branch {
  id: string;
  name: string;
  regionalId: string;
}

export interface Regional {
  id: string;
  name: string;
}

export const mockRegionals: Regional[] = [
  { id: "centro-oeste", name: "Centro-Oeste" },
  { id: "sudeste", name: "Sudeste" },
  { id: "norte", name: "Norte" },
  { id: "nordeste", name: "Nordeste" },
];

export const mockBranches: Branch[] = [
  { id: "matriz", name: "Matriz - Goiânia", regionalId: "centro-oeste" },
  { id: "rioverde", name: "Rio Verde", regionalId: "centro-oeste" },
  { id: "uberlandia", name: "Uberlândia", regionalId: "sudeste" },
  { id: "sinop", name: "Sinop", regionalId: "norte" },
  { id: "luisEduardo", name: "Luís Eduardo Magalhães", regionalId: "nordeste" },
];

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "Carlos Silva",
    email: "carlos.silva@graodireto.com",
    phone: "(62) 99999-1234",
    document: "123.456.789-00",
    status: "active",
    lastLogin: "2026-02-06T10:30:00",
    accesses: [
      { systemId: "contratos", role: "admin", branches: ["matriz", "rioverde"] },
      { systemId: "clientes", role: "admin", branches: ["matriz"] },
      { systemId: "logistica", role: "logistico", branches: ["matriz", "sinop"] },
      { systemId: "barter", role: "mesa", branches: ["rioverde"] },
    ],
  },
  {
    id: "2",
    name: "Ana Ferreira",
    email: "ana.ferreira@graodireto.com",
    phone: "(62) 98888-5678",
    status: "active",
    lastLogin: "2026-02-05T14:20:00",
    accesses: [
      { systemId: "contratos", role: "filial", branches: ["matriz"] },
      { systemId: "clientes", role: "admin", branches: ["matriz", "uberlandia"] },
      { systemId: "logistica", role: null, branches: [] },
      { systemId: "barter", role: null, branches: [] },
    ],
  },
  {
    id: "3",
    name: "João Mendes",
    email: "joao.mendes@graodireto.com",
    phone: "(66) 97777-9012",
    status: "active",
    lastLogin: "2026-02-04T09:15:00",
    accesses: [
      { systemId: "contratos", role: null, branches: [] },
      { systemId: "clientes", role: "viewer", branches: ["sinop"] },
      { systemId: "logistica", role: "admin", branches: ["sinop", "rioverde", "matriz"] },
      { systemId: "barter", role: null, branches: [] },
    ],
  },
  {
    id: "4",
    name: "Maria Oliveira",
    email: "maria.oliveira@graodireto.com",
    phone: "(77) 96666-3456",
    document: "987.654.321-00",
    status: "inactive",
    lastLogin: "2026-01-20T16:00:00",
    accesses: [
      { systemId: "contratos", role: "viewer", branches: ["luisEduardo"] },
      { systemId: "clientes", role: null, branches: [] },
      { systemId: "logistica", role: null, branches: [] },
      { systemId: "barter", role: "viewer", branches: ["luisEduardo"] },
    ],
  },
  {
    id: "5",
    name: "Pedro Santos",
    email: "pedro.santos@graodireto.com",
    phone: "(62) 95555-7890",
    document: "111.222.333-44",
    status: "active",
    lastLogin: "2026-02-06T08:45:00",
    accesses: [
      { systemId: "contratos", role: "admin", branches: ["matriz", "rioverde", "uberlandia"] },
      { systemId: "clientes", role: "editor", branches: ["matriz"] },
      { systemId: "logistica", role: "editor", branches: ["rioverde", "sinop"] },
      { systemId: "barter", role: "admin", branches: ["matriz", "luisEduardo"] },
    ],
  },
  {
    id: "6",
    name: "Luciana Costa",
    email: "luciana.costa@graodireto.com",
    phone: "(34) 94444-1122",
    status: "active",
    lastLogin: "2026-02-03T11:30:00",
    accesses: [
      { systemId: "contratos", role: null, branches: [] },
      { systemId: "clientes", role: "viewer", branches: ["uberlandia"] },
      { systemId: "logistica", role: "viewer", branches: ["uberlandia"] },
      { systemId: "barter", role: null, branches: [] },
    ],
  },
];
