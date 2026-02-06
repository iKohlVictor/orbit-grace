export type SystemRole = "admin" | "editor" | "viewer" | null;

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

export const roleLabels: Record<string, string> = {
  admin: "Administrador",
  editor: "Editor",
  viewer: "Visualizador",
};

export const roleColors: Record<string, string> = {
  admin: "bg-destructive/10 text-destructive",
  editor: "bg-accent/20 text-accent-foreground",
  viewer: "bg-secondary text-secondary-foreground",
};

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
      { systemId: "logistica", role: "viewer", branches: ["matriz", "sinop"] },
      { systemId: "barter", role: "editor", branches: ["rioverde"] },
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
      { systemId: "contratos", role: "editor", branches: ["matriz"] },
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
