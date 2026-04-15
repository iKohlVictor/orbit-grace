import { useState, useMemo } from "react";
import { Send, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockSignatures, type SignatureStatus } from "@/data/mock-signatures";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell,
} from "recharts";

const statusConfig: Record<SignatureStatus, { label: string; className: string }> = {
  enviado: { label: "Enviado", className: "bg-blue-100 text-blue-800 border-blue-200" },
  aguardando: { label: "Aguardando", className: "bg-amber-100 text-amber-800 border-amber-200" },
  concluido: { label: "Concluído", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  rejeitado: { label: "Rejeitado", className: "bg-red-100 text-red-800 border-red-200" },
};

function MiniBarChart({ value, total, color }: { value: number; total: number; color: string }) {
  const data = [{ v: value }, { v: total - value }];
  return (
    <ResponsiveContainer width={60} height={32}>
      <BarChart data={data} layout="vertical" barCategoryGap={0}>
        <Bar dataKey="v" radius={[4, 4, 4, 4]}>
          <Cell fill={color} />
          <Cell fill="hsl(var(--muted))" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function AssinaturasPage() {
  const [titular, setTitular] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tipo, setTipo] = useState("all");
  const [criadoPor, setCriadoPor] = useState("all");
  const [status, setStatus] = useState("all");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const filtered = useMemo(() => {
    return mockSignatures.filter((doc) => {
      if (titular && !doc.titular.toLowerCase().includes(titular.toLowerCase())) return false;
      if (codigo && !doc.codigoDocumento.toLowerCase().includes(codigo.toLowerCase())) return false;
      if (tipo !== "all" && doc.tipo !== tipo) return false;
      if (criadoPor !== "all" && doc.criadoPor !== criadoPor) return false;
      if (status !== "all" && doc.status !== status) return false;
      if (dataInicio && doc.criadoEm < dataInicio) return false;
      if (dataFim && doc.criadoEm > dataFim) return false;
      return true;
    });
  }, [titular, codigo, tipo, criadoPor, status, dataInicio, dataFim]);

  const counts = useMemo(() => {
    const enviados = mockSignatures.filter((d) => d.status === "enviado").length;
    const aguardando = mockSignatures.filter((d) => d.status === "aguardando").length;
    const concluidos = mockSignatures.filter((d) => d.status === "concluido").length;
    return { enviados, aguardando, concluidos, total: mockSignatures.length };
  }, []);

  const tipos = [...new Set(mockSignatures.map((d) => d.tipo))];
  const criadores = [...new Set(mockSignatures.map((d) => d.criadoPor))];

  return (
    <div className="p-4 md:p-8 lg:p-10 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assinaturas</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os documentos enviados para assinatura
          </p>
        </div>
        <Button className="gap-2">
          <Send className="h-4 w-4" />
          Enviar para Assinatura
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enviados</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-2xl font-bold">{counts.enviados}</span>
            <MiniBarChart value={counts.enviados} total={counts.total} color="hsl(217, 91%, 60%)" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-2xl font-bold">{counts.aguardando}</span>
            <MiniBarChart value={counts.aguardando} total={counts.total} color="hsl(38, 92%, 50%)" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluídos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-2xl font-bold">{counts.concluidos}</span>
            <MiniBarChart value={counts.concluidos} total={counts.total} color="hsl(160, 84%, 39%)" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <Input placeholder="Titular" value={titular} onChange={(e) => setTitular(e.target.value)} />
            <Input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {tipos.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={criadoPor} onValueChange={setCriadoPor}>
              <SelectTrigger><SelectValue placeholder="Criado por" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {criadores.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} placeholder="De" />
            <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} placeholder="Até" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filial</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Clifor</TableHead>
                <TableHead>Nº Contrato</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum documento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((doc) => {
                  const sc = statusConfig[doc.status];
                  return (
                    <TableRow key={doc.id} className="cursor-pointer">
                      <TableCell className="font-medium">{doc.filial}</TableCell>
                      <TableCell>{doc.nome}</TableCell>
                      <TableCell>{doc.tipo}</TableCell>
                      <TableCell>{doc.clifor}</TableCell>
                      <TableCell>{doc.numeroContrato}</TableCell>
                      <TableCell>{new Date(doc.atualizadoEm).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
                      </TableCell>
                      <TableCell>{new Date(doc.criadoEm).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
