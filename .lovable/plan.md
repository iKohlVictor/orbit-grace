
## Plano: Módulo de Assinaturas de Documentos

O sistema "Documentos" ja existe no `systems.ts` e as rotas ja estao no `App.tsx`. Faltam os arquivos de pagina e dados mock.

### O que sera criado

**1. Dados mock (`src/data/mock-signatures.ts`)**
- Interface `SignatureDocument` com campos: id, filial, nome, tipo, clifor, numeroContrato, criadoPor, titular, codigoDocumento, status (enviado/aguardando/concluido/rejeitado), criadoEm, atualizadoEm
- ~20 registros mock variados

**2. Pagina de Assinaturas (`src/pages/AssinaturasPage.tsx`)**
- **3 cards de metricas** no topo com contadores: Enviados, Aguardando Assinatura, Concluidos (com mini graficos usando Recharts)
- **Barra de filtros** com: Titular, Codigo do documento, Tipo de documento, Criado por, Status, Intervalo de criacao (date range)
- **Tabela** com colunas: Filial, Nome, Tipo, Clifor, N Contrato, Atualizado em, Status (badge colorido), Criado em
- **Botao "Enviar para Assinatura"** no topo direito, por enquanto navega para uma rota placeholder

### Padrao visual
- Reutiliza componentes existentes: Card, Table, Button, Input, Select, Badge
- Segue o mesmo estilo das outras paginas (UsersPage como referencia)
- Cor do sistema documentos ja definida (`--system-documentos`)

### Arquivos modificados
- `src/data/mock-signatures.ts` (novo)
- `src/pages/AssinaturasPage.tsx` (novo)
