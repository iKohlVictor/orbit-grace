export type SignatureStatus = "enviado" | "aguardando" | "concluido" | "rejeitado";

export interface SignatureDocument {
  id: string;
  filial: string;
  nome: string;
  tipo: string;
  clifor: string;
  numeroContrato: string;
  codigoDocumento: string;
  criadoPor: string;
  titular: string;
  status: SignatureStatus;
  criadoEm: string;
  atualizadoEm: string;
}

export const mockSignatures: SignatureDocument[] = [
  { id: "1", filial: "Matriz SP", nome: "Contrato de Compra - Soja", tipo: "Contrato", clifor: "Agro Sul Ltda", numeroContrato: "CT-2024-001", codigoDocumento: "DOC-001", criadoPor: "Maria Silva", titular: "João Oliveira", status: "concluido", criadoEm: "2024-01-10", atualizadoEm: "2024-01-15" },
  { id: "2", filial: "Filial GO", nome: "Aditivo Contratual", tipo: "Aditivo", clifor: "Cereais Norte SA", numeroContrato: "CT-2024-002", codigoDocumento: "DOC-002", criadoPor: "Carlos Souza", titular: "Ana Costa", status: "aguardando", criadoEm: "2024-01-12", atualizadoEm: "2024-01-12" },
  { id: "3", filial: "Filial MT", nome: "Contrato de Venda - Milho", tipo: "Contrato", clifor: "Grãos Brasil Ltda", numeroContrato: "CT-2024-003", codigoDocumento: "DOC-003", criadoPor: "Fernanda Lima", titular: "Pedro Santos", status: "enviado", criadoEm: "2024-01-14", atualizadoEm: "2024-01-14" },
  { id: "4", filial: "Matriz SP", nome: "Distrato Comercial", tipo: "Distrato", clifor: "AgroMax Comércio", numeroContrato: "CT-2024-004", codigoDocumento: "DOC-004", criadoPor: "Ricardo Alves", titular: "Juliana Pereira", status: "rejeitado", criadoEm: "2024-01-15", atualizadoEm: "2024-01-18" },
  { id: "5", filial: "Filial PR", nome: "Contrato de Compra - Trigo", tipo: "Contrato", clifor: "Cooperativa Oeste", numeroContrato: "CT-2024-005", codigoDocumento: "DOC-005", criadoPor: "Maria Silva", titular: "João Oliveira", status: "concluido", criadoEm: "2024-01-18", atualizadoEm: "2024-01-22" },
  { id: "6", filial: "Filial GO", nome: "Termo de Garantia", tipo: "Termo", clifor: "Fazenda Boa Vista", numeroContrato: "CT-2024-006", codigoDocumento: "DOC-006", criadoPor: "Carlos Souza", titular: "Ana Costa", status: "aguardando", criadoEm: "2024-01-20", atualizadoEm: "2024-01-20" },
  { id: "7", filial: "Filial MT", nome: "Contrato de Venda - Soja", tipo: "Contrato", clifor: "Trading Global SA", numeroContrato: "CT-2024-007", codigoDocumento: "DOC-007", criadoPor: "Fernanda Lima", titular: "Pedro Santos", status: "enviado", criadoEm: "2024-01-22", atualizadoEm: "2024-01-22" },
  { id: "8", filial: "Matriz SP", nome: "Aditivo de Prazo", tipo: "Aditivo", clifor: "Agro Sul Ltda", numeroContrato: "CT-2024-008", codigoDocumento: "DOC-008", criadoPor: "Ricardo Alves", titular: "Juliana Pereira", status: "concluido", criadoEm: "2024-01-25", atualizadoEm: "2024-02-01" },
  { id: "9", filial: "Filial PR", nome: "Contrato Barter", tipo: "Contrato", clifor: "Insumos Centro Ltda", numeroContrato: "CT-2024-009", codigoDocumento: "DOC-009", criadoPor: "Maria Silva", titular: "João Oliveira", status: "aguardando", criadoEm: "2024-01-28", atualizadoEm: "2024-01-28" },
  { id: "10", filial: "Filial GO", nome: "Minuta Padrão Compra", tipo: "Minuta", clifor: "Cereais Norte SA", numeroContrato: "CT-2024-010", codigoDocumento: "DOC-010", criadoPor: "Carlos Souza", titular: "Ana Costa", status: "enviado", criadoEm: "2024-02-01", atualizadoEm: "2024-02-01" },
  { id: "11", filial: "Filial MT", nome: "Contrato de Compra - Algodão", tipo: "Contrato", clifor: "Fibras do Cerrado", numeroContrato: "CT-2024-011", codigoDocumento: "DOC-011", criadoPor: "Fernanda Lima", titular: "Pedro Santos", status: "concluido", criadoEm: "2024-02-03", atualizadoEm: "2024-02-08" },
  { id: "12", filial: "Matriz SP", nome: "Termo Aditivo Volume", tipo: "Aditivo", clifor: "AgroMax Comércio", numeroContrato: "CT-2024-012", codigoDocumento: "DOC-012", criadoPor: "Ricardo Alves", titular: "Juliana Pereira", status: "aguardando", criadoEm: "2024-02-05", atualizadoEm: "2024-02-05" },
  { id: "13", filial: "Filial PR", nome: "Contrato de Venda - Café", tipo: "Contrato", clifor: "Exporta Grãos SA", numeroContrato: "CT-2024-013", codigoDocumento: "DOC-013", criadoPor: "Maria Silva", titular: "João Oliveira", status: "enviado", criadoEm: "2024-02-08", atualizadoEm: "2024-02-08" },
  { id: "14", filial: "Filial GO", nome: "Distrato por Inadimplência", tipo: "Distrato", clifor: "Fazenda Boa Vista", numeroContrato: "CT-2024-014", codigoDocumento: "DOC-014", criadoPor: "Carlos Souza", titular: "Ana Costa", status: "rejeitado", criadoEm: "2024-02-10", atualizadoEm: "2024-02-14" },
  { id: "15", filial: "Filial MT", nome: "Contrato de Compra - Sorgo", tipo: "Contrato", clifor: "Grãos Brasil Ltda", numeroContrato: "CT-2024-015", codigoDocumento: "DOC-015", criadoPor: "Fernanda Lima", titular: "Pedro Santos", status: "concluido", criadoEm: "2024-02-12", atualizadoEm: "2024-02-18" },
  { id: "16", filial: "Matriz SP", nome: "Aditivo Preço Fixo", tipo: "Aditivo", clifor: "Trading Global SA", numeroContrato: "CT-2024-016", codigoDocumento: "DOC-016", criadoPor: "Ricardo Alves", titular: "Juliana Pereira", status: "aguardando", criadoEm: "2024-02-15", atualizadoEm: "2024-02-15" },
  { id: "17", filial: "Filial PR", nome: "Contrato de Venda - Feijão", tipo: "Contrato", clifor: "Cooperativa Oeste", numeroContrato: "CT-2024-017", codigoDocumento: "DOC-017", criadoPor: "Maria Silva", titular: "João Oliveira", status: "enviado", criadoEm: "2024-02-18", atualizadoEm: "2024-02-18" },
  { id: "18", filial: "Filial GO", nome: "Termo de Compromisso", tipo: "Termo", clifor: "Insumos Centro Ltda", numeroContrato: "CT-2024-018", codigoDocumento: "DOC-018", criadoPor: "Carlos Souza", titular: "Ana Costa", status: "concluido", criadoEm: "2024-02-20", atualizadoEm: "2024-02-25" },
  { id: "19", filial: "Filial MT", nome: "Contrato Exportação", tipo: "Contrato", clifor: "Exporta Grãos SA", numeroContrato: "CT-2024-019", codigoDocumento: "DOC-019", criadoPor: "Fernanda Lima", titular: "Pedro Santos", status: "aguardando", criadoEm: "2024-02-22", atualizadoEm: "2024-02-22" },
  { id: "20", filial: "Matriz SP", nome: "Minuta Venda Internacional", tipo: "Minuta", clifor: "AgroMax Comércio", numeroContrato: "CT-2024-020", codigoDocumento: "DOC-020", criadoPor: "Ricardo Alves", titular: "Juliana Pereira", status: "enviado", criadoEm: "2024-02-25", atualizadoEm: "2024-02-25" },
];
