import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, Trash2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const DOCUMENT_TYPES = [
  { value: "contrato_compra", label: "Contrato de Compra" },
  { value: "contrato_venda", label: "Contrato de Venda" },
  { value: "aditivo", label: "Aditivo Contratual" },
  { value: "distrato", label: "Distrato" },
  { value: "procuracao", label: "Procuração" },
  { value: "outros", label: "Outros" },
];

// Custom fields per document type
const CUSTOM_FIELDS: Record<string, { key: string; label: string; type: "text" | "date" | "number" }[]> = {
  contrato_compra: [
    { key: "produto", label: "Produto", type: "text" },
    { key: "safra", label: "Safra", type: "text" },
    { key: "volume", label: "Volume (ton)", type: "number" },
  ],
  contrato_venda: [
    { key: "produto", label: "Produto", type: "text" },
    { key: "safra", label: "Safra", type: "text" },
    { key: "volume", label: "Volume (ton)", type: "number" },
  ],
  aditivo: [
    { key: "contratoOriginal", label: "Nº Contrato Original", type: "text" },
    { key: "motivoAditivo", label: "Motivo do Aditivo", type: "text" },
  ],
  distrato: [
    { key: "contratoOriginal", label: "Nº Contrato Original", type: "text" },
    { key: "motivoDistrato", label: "Motivo do Distrato", type: "text" },
  ],
  procuracao: [
    { key: "outorgante", label: "Outorgante", type: "text" },
    { key: "validade", label: "Validade", type: "date" },
  ],
};

interface Signatory {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipoAssinatura: "eletronica" | "certificado_digital";
}

function createEmptySignatory(): Signatory {
  return {
    id: crypto.randomUUID(),
    nome: "",
    email: "",
    telefone: "",
    tipoAssinatura: "eletronica",
  };
}

export default function EnviarAssinaturaPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Form fields
  const [titular, setTitular] = useState("");
  const [clifor, setClifor] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  // Signatories
  const [signatories, setSignatories] = useState<Signatory[]>([createEmptySignatory()]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Formato inválido", description: "Selecione um arquivo PDF.", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "O tamanho máximo é 20MB.", variant: "destructive" });
      return;
    }
    setPdfFile(file);
    setPdfUrl(URL.createObjectURL(file));
  }, [toast]);

  const addSignatory = () => setSignatories((prev) => [...prev, createEmptySignatory()]);

  const removeSignatory = (id: string) => {
    if (signatories.length <= 1) return;
    setSignatories((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSignatory = (id: string, field: keyof Signatory, value: string) => {
    setSignatories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleTypeChange = (value: string) => {
    setTipoDocumento(value);
    setCustomFields({});
  };

  const handleSubmit = () => {
    if (!pdfFile) {
      toast({ title: "Documento obrigatório", description: "Selecione um PDF.", variant: "destructive" });
      return;
    }
    if (!titular || !tipoDocumento) {
      toast({ title: "Campos obrigatórios", description: "Preencha titular e tipo de documento.", variant: "destructive" });
      return;
    }
    const invalidSigner = signatories.find((s) => !s.nome || !s.email);
    if (invalidSigner) {
      toast({ title: "Assinante incompleto", description: "Preencha nome e email de todos os assinantes.", variant: "destructive" });
      return;
    }
    toast({ title: "Documento enviado", description: "O documento foi enviado para assinatura com sucesso." });
    navigate("/contratos/assinaturas");
  };

  const currentCustomFields = CUSTOM_FIELDS[tipoDocumento] || [];

  // Step: if no PDF selected, show upload screen
  if (!pdfFile) {
    return (
      <div className="p-4 md:p-8 lg:p-10 w-full space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/contratos/assinaturas")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Enviar para Assinatura</h1>
            <p className="text-muted-foreground text-sm">Selecione o documento PDF que deseja enviar</p>
          </div>
        </div>

        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="rounded-full bg-muted p-6">
              <Upload className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-medium">Arraste o arquivo ou clique para selecionar</p>
              <p className="text-sm text-muted-foreground">Formato aceito: PDF — Tamanho máximo: 20MB</p>
            </div>
            <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
              <FileText className="h-4 w-4" />
              Selecionar PDF
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form with PDF preview
  return (
    <div className="p-4 md:p-8 lg:p-10 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/contratos/assinaturas")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Enviar para Assinatura</h1>
            <p className="text-muted-foreground text-sm">{pdfFile.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setPdfFile(null); setPdfUrl(null); }}>
            Trocar PDF
          </Button>
          <Button onClick={handleSubmit}>Enviar para Assinatura</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Preview */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full border-0"
                style={{ height: "calc(100vh - 260px)", minHeight: 500 }}
                title="PDF Preview"
              />
            )}
          </CardContent>
        </Card>

        {/* Form */}
        <div className="space-y-6">
          {/* Document info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações do Documento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titular *</Label>
                  <Input placeholder="Nome do titular" value={titular} onChange={(e) => setTitular(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Clifor</Label>
                  <Input placeholder="Código Clifor" value={clifor} onChange={(e) => setClifor(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nº Contrato</Label>
                  <Input placeholder="Número do contrato" value={numeroContrato} onChange={(e) => setNumeroContrato(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Documento *</Label>
                  <Select value={tipoDocumento} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom fields based on type */}
              {currentCustomFields.length > 0 && (
                <>
                  <Separator />
                  <p className="text-sm font-medium text-muted-foreground">Campos adicionais</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentCustomFields.map((cf) => (
                      <div key={cf.key} className="space-y-2">
                        <Label>{cf.label}</Label>
                        <Input
                          type={cf.type === "number" ? "number" : cf.type === "date" ? "date" : "text"}
                          placeholder={cf.label}
                          value={customFields[cf.key] || ""}
                          onChange={(e) => setCustomFields((prev) => ({ ...prev, [cf.key]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Signatories */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Assinantes</CardTitle>
              <Button variant="outline" size="sm" onClick={addSignatory} className="gap-1">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {signatories.map((signer, idx) => (
                <div key={signer.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Assinante {idx + 1}</span>
                    {signatories.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeSignatory(signer.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nome *</Label>
                      <Input
                        placeholder="Nome completo"
                        value={signer.nome}
                        onChange={(e) => updateSignatory(signer.id, "nome", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Email *</Label>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={signer.email}
                        onChange={(e) => updateSignatory(signer.id, "email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Telefone</Label>
                      <Input
                        placeholder="(00) 00000-0000"
                        value={signer.telefone}
                        onChange={(e) => updateSignatory(signer.id, "telefone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tipo de Assinatura</Label>
                      <RadioGroup
                        value={signer.tipoAssinatura}
                        onValueChange={(v) => updateSignatory(signer.id, "tipoAssinatura", v)}
                        className="flex gap-4 pt-1.5"
                      >
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="eletronica" id={`ele-${signer.id}`} />
                          <Label htmlFor={`ele-${signer.id}`} className="text-xs font-normal cursor-pointer">Eletrônica</Label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="certificado_digital" id={`cert-${signer.id}`} />
                          <Label htmlFor={`cert-${signer.id}`} className="text-xs font-normal cursor-pointer">Certificado Digital</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
