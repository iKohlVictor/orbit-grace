import { systems } from "./systems";

export type SystemRole = "admin" | "editor" | "viewer" | null;

export interface UserAccess {
  systemId: string;
  role: SystemRole;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
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

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "Carlos Silva",
    email: "carlos.silva@graodireto.com",
    status: "active",
    lastLogin: "2026-02-06T10:30:00",
    accesses: [
      { systemId: "contratos", role: "admin" },
      { systemId: "clientes", role: "admin" },
      { systemId: "logistica", role: "viewer" },
      { systemId: "barter", role: "editor" },
    ],
  },
  {
    id: "2",
    name: "Ana Ferreira",
    email: "ana.ferreira@graodireto.com",
    status: "active",
    lastLogin: "2026-02-05T14:20:00",
    accesses: [
      { systemId: "contratos", role: "editor" },
      { systemId: "clientes", role: "admin" },
      { systemId: "logistica", role: null },
      { systemId: "barter", role: null },
    ],
  },
  {
    id: "3",
    name: "João Mendes",
    email: "joao.mendes@graodireto.com",
    status: "active",
    lastLogin: "2026-02-04T09:15:00",
    accesses: [
      { systemId: "contratos", role: null },
      { systemId: "clientes", role: "viewer" },
      { systemId: "logistica", role: "admin" },
      { systemId: "barter", role: null },
    ],
  },
  {
    id: "4",
    name: "Maria Oliveira",
    email: "maria.oliveira@graodireto.com",
    status: "inactive",
    lastLogin: "2026-01-20T16:00:00",
    accesses: [
      { systemId: "contratos", role: "viewer" },
      { systemId: "clientes", role: null },
      { systemId: "logistica", role: null },
      { systemId: "barter", role: "viewer" },
    ],
  },
  {
    id: "5",
    name: "Pedro Santos",
    email: "pedro.santos@graodireto.com",
    status: "active",
    lastLogin: "2026-02-06T08:45:00",
    accesses: [
      { systemId: "contratos", role: "admin" },
      { systemId: "clientes", role: "editor" },
      { systemId: "logistica", role: "editor" },
      { systemId: "barter", role: "admin" },
    ],
  },
  {
    id: "6",
    name: "Luciana Costa",
    email: "luciana.costa@graodireto.com",
    status: "active",
    lastLogin: "2026-02-03T11:30:00",
    accesses: [
      { systemId: "contratos", role: null },
      { systemId: "clientes", role: "viewer" },
      { systemId: "logistica", role: "viewer" },
      { systemId: "barter", role: null },
    ],
  },
];
