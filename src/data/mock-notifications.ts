export type NotificationType = "user_action" | "business_event";

export interface AppNotification {
  id: string;
  type: NotificationType;
  systemId: string | null; // null = global
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
}

export const mockNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "user_action",
    systemId: null,
    title: "Novo usuário cadastrado",
    description: "Carlos Silva foi adicionado ao sistema com perfil Administrador.",
    read: false,
    createdAt: "2026-02-06T10:15:00",
  },
  {
    id: "n2",
    type: "business_event",
    systemId: "contratos",
    title: "Contrato próximo do vencimento",
    description: "O contrato #CT-2024-0892 vence em 3 dias. Ação necessária.",
    read: false,
    createdAt: "2026-02-06T09:30:00",
  },
  {
    id: "n3",
    type: "business_event",
    systemId: "logistica",
    title: "Entrega atrasada",
    description: "A entrega #LG-4521 para Sinop está 2 dias atrasada.",
    read: false,
    createdAt: "2026-02-06T08:45:00",
  },
  {
    id: "n4",
    type: "user_action",
    systemId: "clientes",
    title: "Permissão alterada",
    description: "Ana Ferreira agora é Administradora no módulo Clientes.",
    read: true,
    createdAt: "2026-02-05T16:20:00",
  },
  {
    id: "n5",
    type: "business_event",
    systemId: "barter",
    title: "Nova operação barter aprovada",
    description: "Operação #BT-0312 de troca de soja por fertilizantes foi aprovada.",
    read: true,
    createdAt: "2026-02-05T14:10:00",
  },
  {
    id: "n6",
    type: "user_action",
    systemId: null,
    title: "Usuário desativado",
    description: "Maria Oliveira foi desativada do sistema.",
    read: true,
    createdAt: "2026-02-05T11:00:00",
  },
  {
    id: "n7",
    type: "business_event",
    systemId: "contratos",
    title: "Contrato aprovado",
    description: "Contrato #CT-2024-0910 foi aprovado pela gerência regional.",
    read: true,
    createdAt: "2026-02-04T17:30:00",
  },
  {
    id: "n8",
    type: "business_event",
    systemId: "logistica",
    title: "Rota otimizada",
    description: "Nova rota sugerida para entregas em Uberlândia economiza 15% no frete.",
    read: false,
    createdAt: "2026-02-04T13:00:00",
  },
  {
    id: "n9",
    type: "user_action",
    systemId: "contratos",
    title: "Aprovação pendente",
    description: "Pedro Santos solicitou acesso ao perfil Gerência Nacional.",
    read: false,
    createdAt: "2026-02-04T10:45:00",
  },
  {
    id: "n10",
    type: "business_event",
    systemId: "barter",
    title: "Insumo com estoque baixo",
    description: "Estoque de fertilizantes NPK abaixo do mínimo na filial Rio Verde.",
    read: false,
    createdAt: "2026-02-03T15:20:00",
  },
];
