import {
  FileText,
  Users,
  Truck,
  ArrowLeftRight,
  FolderOpen,
  FilePlus,
  FileSearch,
  FileCheck,
  UserPlus,
  UserCheck,
  Building2,
  Contact,
  MapPin,
  Route,
  Calendar,
  PackageCheck,
  BarChart3,
  Repeat,
  Wheat,
  TrendingUp,
  FileSignature,
  PenTool,
  Library,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export interface SystemMenuItem {
  title: string;
  icon: LucideIcon;
  path: string;
}

export interface SystemMenuGroup {
  label: string;
  items: SystemMenuItem[];
}

export interface SystemConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  colorVar: string;
  groups: SystemMenuGroup[];
}

export const systems: SystemConfig[] = [
  {
    id: "contratos",
    name: "Gestão de Contratos",
    shortName: "Contratos",
    description: "Gerencie todos os contratos de compra e venda de grãos",
    icon: FileText,
    colorVar: "--system-contratos",
    groups: [
      {
        label: "Contratos",
        items: [
          { title: "Todos os Contratos", icon: FolderOpen, path: "/contratos" },
          { title: "Novo Contrato", icon: FilePlus, path: "/contratos/novo" },
          { title: "Em Análise", icon: FileSearch, path: "/contratos/analise" },
          { title: "Aprovados", icon: FileCheck, path: "/contratos/aprovados" },
        ],
      },
      {
        label: "Relatórios",
        items: [
          { title: "Dashboard", icon: BarChart3, path: "/contratos/dashboard" },
        ],
      },
    ],
  },
  {
    id: "clientes",
    name: "Gestão de Clientes",
    shortName: "Clientes",
    description: "Cadastro e acompanhamento de clientes e produtores",
    icon: Users,
    colorVar: "--system-clientes",
    groups: [
      {
        label: "Clientes",
        items: [
          { title: "Todos os Clientes", icon: Contact, path: "/clientes" },
          { title: "Novo Cliente", icon: UserPlus, path: "/clientes/novo" },
          { title: "Ativos", icon: UserCheck, path: "/clientes/ativos" },
          { title: "Empresas", icon: Building2, path: "/clientes/empresas" },
        ],
      },
    ],
  },
  {
    id: "logistica",
    name: "Planejamento Logístico",
    shortName: "Logística",
    description: "Planeje rotas, entregas e acompanhe o transporte de cargas",
    icon: Truck,
    colorVar: "--system-logistica",
    groups: [
      {
        label: "Operações",
        items: [
          { title: "Mapa de Rotas", icon: MapPin, path: "/logistica/rotas" },
          { title: "Planejamento", icon: Route, path: "/logistica/planejamento" },
          { title: "Agenda", icon: Calendar, path: "/logistica/agenda" },
          { title: "Entregas", icon: PackageCheck, path: "/logistica/entregas" },
        ],
      },
    ],
  },
  {
    id: "barter",
    name: "Barter",
    shortName: "Barter",
    description: "Operações de troca de insumos por produção agrícola",
    icon: ArrowLeftRight,
    colorVar: "--system-barter",
    groups: [
      {
        label: "Operações",
        items: [
          { title: "Operações Barter", icon: Repeat, path: "/barter" },
          { title: "Insumos", icon: Wheat, path: "/barter/insumos" },
          { title: "Posições", icon: TrendingUp, path: "/barter/posicoes" },
        ],
      },
    ],
  },
  {
    id: "documentos",
    name: "Gestão de Documentos",
    shortName: "Documentos",
    description: "Assinaturas, biblioteca e minutas de documentos",
    icon: FileSignature,
    colorVar: "--system-documentos",
    groups: [
      {
        label: "Documentos",
        items: [
          { title: "Assinaturas", icon: PenTool, path: "/documentos/assinaturas" },
          { title: "Biblioteca", icon: Library, path: "/documentos/biblioteca" },
          { title: "Minutas", icon: ScrollText, path: "/documentos/minutas" },
        ],
      },
    ],
  },
];
