import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tooltip,
  ListSubheader
} from '@mui/material';

import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// ============================
// TabPanel
// ============================
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`formularios-tabpanel-${index}`}
      aria-labelledby={`formularios-tab-${index}`}
      {...other}
      style={{ paddingTop: 20 }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

// ============================
// LocalStorage helpers
// ============================
const LS_TEMPLATES_KEY = 'templates_formularios_v1';
const LS_DOCS_KEY = 'documentos_formularios_v1';

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

// ============================
// Templates padrão + novos
// ============================
const DEFAULT_TEMPLATES = [
  // --------------------------
  // ENTREGA - FARDAMENTO
  // --------------------------
  {
    id: 'entrega-fardamento',
    nome: 'Termo de Entrega - Fardamento',
    tipo: 'entrega',
    categoria: 'Entrega de Material',
    isDefault: true,
    conteudo: `# TERMO DE ENTREGA E RESPONSABILIDADE
## FARDAMENTO E UNIFORMES

---

**EMPRESA:** {empresa}  
**CNPJ:** [CNPJ_EMPRESA]  
**ENDEREÇO:** [ENDERECO_EMPRESA]

**COLABORADOR:** {motorista}  
**CPF:** [CPF_MOTORISTA]  
**MATRÍCULA:** [MATRICULA]  
**CARGO:** [CARGO]  
**DATA DE ADMISSÃO:** [DATA_ADMISSAO]

---

## ITENS ENTREGUES

Por meio deste termo, declaro ter recebido da empresa {empresa} os seguintes itens de fardamento:

### UNIFORMES
- [ ] **02 (duas) Camisas** - Tamanho: ____ - Marca: ____ - Estado: NOVO
- [ ] **02 (duas) Calças** - Tamanho: ____ - Marca: ____ - Estado: NOVO
- [ ] **01 (uma) Jaqueta** - Tamanho: ____ - Marca: ____ - Estado: NOVO
- [ ] **01 (um) Colete Refletivo** - Tamanho: ____ - Estado: NOVO
- [ ] **01 (um) Boné/Chapéu** - Tamanho: ____ - Estado: NOVO
- [ ] **02 (dois) Pares de Meias** - Tamanho: ____ - Estado: NOVO
- [ ] **01 (um) Par de Calçados** - Tamanho: ____ - Marca: ____ - Estado: NOVO

**VALOR TOTAL ESTIMADO:** R$ [VALOR_TOTAL]

---

## COMPROMISSOS E RESPONSABILIDADES

Pelo presente termo, **DECLARO** e **ME COMPROMETO** a:

1. **Utilizar o uniforme** exclusivamente durante o horário de trabalho e nas dependências da empresa ou em serviços externos autorizados;
2. **Zelar pela conservação** e limpeza dos uniformes, mantendo-os em bom estado;
3. **Não realizar alterações** no uniforme sem autorização prévia da empresa;
4. **Portar o uniforme completo** conforme as normas da empresa, incluindo crachá de identificação;
5. **Devolver todos os itens** em caso de desligamento, nas mesmas condições em que foram recebidos, considerando o desgaste natural;
6. **Comunicar imediatamente** qualquer dano, perda ou necessidade de reposição;
7. **Não ceder ou emprestar** os uniformes a terceiros;
8. **Responsabilizar-me financeiramente** pela reposição em caso de:
   - Perda ou extravio por negligência
   - Danos causados por mau uso
   - Não devolução no desligamento

---

## AUTORIZAÇÃO DE DESCONTO

Autorizo expressamente a empresa {empresa} a descontar de minha remuneração ou verbas rescisórias os valores correspondentes aos itens não devolvidos ou danificados por minha culpa, conforme Art. 462 da CLT.

---

**Local e Data:** __________________, {data}

_______________________________________  
**Assinatura do Colaborador**  
{motorista}  
CPF: [CPF_MOTORISTA]

_______________________________________  
**Assinatura do Responsável pela Entrega**  
Nome: [NOME_RESPONSAVEL]  
Cargo: [CARGO_RESPONSAVEL]

_______________________________________  
**Testemunha**  
Nome: [NOME_TESTEMUNHA]  
CPF: [CPF_TESTEMUNHA]`
  },

  // --------------------------
  // ENTREGA - EPI
  // --------------------------
  {
    id: 'entrega-epi',
    nome: 'Termo de Entrega - EPI (Equipamentos de Proteção Individual)',
    tipo: 'entrega',
    categoria: 'Entrega de Material',
    isDefault: true,
    conteudo: `# TERMO DE ENTREGA E RESPONSABILIDADE
## EQUIPAMENTOS DE PROTEÇÃO INDIVIDUAL (EPI)

---

**EMPRESA:** {empresa}  
**CNPJ:** [CNPJ_EMPRESA]  
**ENDEREÇO:** [ENDERECO_EMPRESA]

**COLABORADOR:** {motorista}  
**CPF:** [CPF_MOTORISTA]  
**MATRÍCULA:** [MATRICULA]  
**CARGO:** [CARGO]  
**FUNÇÃO:** Motorista de Veículo: {veiculo}

---

## EQUIPAMENTOS DE PROTEÇÃO INDIVIDUAL ENTREGUES

Conforme NR-06, declaro ter recebido gratuitamente da empresa {empresa} os seguintes EPIs:

| Item | Descrição | CA | Qtd | Validade | Estado |
|------|-----------|----|----|----------|--------|
| 01 | Capacete de Segurança | _____ | 01 | ____/____ | NOVO |
| 02 | Óculos de Proteção | _____ | 01 | ____/____ | NOVO |
| 03 | Luvas de Segurança | _____ | 02 | ____/____ | NOVO |
| 04 | Calçado de Segurança | _____ | 01 | ____/____ | NOVO |
| 05 | Colete Refletivo | _____ | 02 | ____/____ | NOVO |
| 06 | Protetor Auricular | _____ | 01 | ____/____ | NOVO |
| 07 | Máscara PFF2 | _____ | 10 | ____/____ | NOVO |
| 08 | Capa de Chuva | _____ | 01 | ____/____ | NOVO |

---

## OBRIGAÇÕES DO COLABORADOR (NR-06)

Comprometo-me a usar os EPIs, cuidar, conservar, comunicar danos e devolver no desligamento.

---

**Local e Data:** __________________, {data}

_______________________________________  
**Assinatura do Colaborador**  
{motorista}

_______________________________________  
**Responsável pela Entrega**  
Nome: [NOME_RESPONSAVEL]

_______________________________________  
**Testemunha**  
Nome: [NOME_TESTEMUNHA]`
  },

  // --------------------------
  // ENTREGA - FERRAMENTAS
  // --------------------------
  {
    id: 'entrega-ferramentas',
    nome: 'Termo de Entrega - Ferramentas e Equipamentos',
    tipo: 'entrega',
    categoria: 'Entrega de Material',
    isDefault: true,
    conteudo: `# TERMO DE ENTREGA E RESPONSABILIDADE
## FERRAMENTAS E EQUIPAMENTOS DE TRABALHO

---

**EMPRESA:** {empresa}  
**COLABORADOR:** {motorista}  
**VEÍCULO VINCULADO:** {veiculo}  
**DATA:** {data}

---

Declaro ter recebido da empresa {empresa} as ferramentas e equipamentos descritos abaixo, comprometendo-me com guarda, conservação, uso adequado e devolução no desligamento.

---

**Local e Data:** __________________, {data}

_______________________________________  
**Assinatura do Colaborador**  
{motorista}

_______________________________________  
**Responsável pela Entrega**  
[NOME_RESPONSAVEL]`
  },

  // --------------------------
  // DESCONTO
  // --------------------------
  {
    id: 'desconto-colaborador',
    nome: 'Autorização para Desconto de Colaborador',
    tipo: 'desconto',
    categoria: 'Desconto',
    isDefault: true,
    conteudo: `# AUTORIZAÇÃO PARA DESCONTO EM FOLHA DE PAGAMENTO
**Fundamentado no Art. 462 da CLT**

---

**EMPRESA:** {empresa}  
**COLABORADOR:** {motorista}  
**VEÍCULO VINCULADO:** {veiculo}  
**DATA:** {data}

---

## IDENTIFICAÇÃO DO DÉBITO

**Tipo de Débito:** {tipo_debito}  
**Descrição:** {descricao_debito}  
**Valor Total:** R$ {valor}  
**Data da Ocorrência:** {data_ocorrencia}  
**Local:** {local}

---

## FORMA DE PAGAMENTO

- Parcelado em **{n_parcelas} parcela(s)** de R$ {valor_parcela}.

---

Declaro ciência e autorizo o desconto conforme acima.

**Local e Data:** __________________, {data}

_______________________________________  
**Assinatura do Colaborador**  
{motorista}`
  },

  // --------------------------
  // PUNIÇÃO
  // --------------------------
  {
    id: 'aplicacao-punicao',
    nome: 'Aplicação de Punição Disciplinar',
    tipo: 'punicao',
    categoria: 'Punição',
    isDefault: true,
    conteudo: `# NOTIFICAÇÃO DE APLICAÇÃO DE MEDIDA DISCIPLINAR

**EMPRESA:** {empresa}  
**COLABORADOR:** {motorista}  
**DATA:** {data}

---

**Medida aplicada:** {tipo_punicao}

### FATO
**Data:** {data_ocorrencia}  
**Hora:** {hora_ocorrencia}  
**Local:** {local}

**Descrição:**
{descricao_fato}

**Norma violada:**
{norma_violada}

---

**Local e Data:** __________________, {data}

_______________________________________  
**Assinatura do Colaborador**  
{motorista}

_______________________________________  
**Gestor/RH**  
[NOME_RESPONSAVEL]`
  },

  // ==========================
  // NOVOS TEMPLATES
  // ==========================

  // Cultura e Conformidade
  {
    id: 'cultura-termo-missao-visao-valores',
    nome: 'Termo de Ciência de Missão, Visão e Valores',
    tipo: 'cultura',
    categoria: 'Cultura e Conformidade',
    isDefault: true,
    conteudo: `# TERMO DE CIÊNCIA
## MISSÃO, VISÃO E VALORES

**EMPRESA:** {empresa}  
**COLABORADOR:** {motorista}  
**DATA:** {data}

---

### MISSÃO
{missao}

### VISÃO
{visao}

### VALORES
{valores}

---

Declaro que recebi, li e compreendi os princípios acima e comprometo-me a cumpri-los.

**Local e Data:** __________________, {data}

_______________________________________  
**Assinatura do Colaborador**  
{motorista}

_______________________________________  
**Representante da Empresa**  
[NOME_RESPONSAVEL]`
  },
  {
    id: 'cultura-acordo-politica-interna',
    nome: 'Acordo de Reconhecimento de Política Interna',
    tipo: 'cultura',
    categoria: 'Cultura e Conformidade',
    isDefault: true,
    conteudo: `# ACORDO DE RECONHECIMENTO DE POLÍTICA INTERNA

**EMPRESA:** {empresa}  
**COLABORADOR:** {motorista}  
**DATA:** {data}

---

Declaro ciência e concordância com as Políticas Internas da empresa {empresa}.

**Políticas/Documentos:**  
{politicas_internas}

---

Comprometo-me a cumprir as regras e reconheço que descumprimentos podem gerar medidas disciplinares.

**Local e Data:** __________________, {data}

_______________________________________  
**Assinatura do Colaborador**  
{motorista}

_______________________________________  
**Representante da Empresa**  
[NOME_RESPONSAVEL]`
  },

  // Processos e Estrutura
  {
    id: 'processos-mapeamento-pop',
    nome: 'Formulário de Mapeamento de Processos (POP)',
    tipo: 'processos',
    categoria: 'Processos e Estrutura',
    isDefault: true,
    conteudo: `# FORMULÁRIO DE MAPEAMENTO DE PROCESSOS (POP)

**EMPRESA/ÁREA:** {empresa}  
**PROCESSO:** {nome_processo}  
**CÓDIGO POP:** {codigo_pop}  
**VERSÃO:** {versao_pop}  
**DATA:** {data}

---

## OBJETIVO
{objetivo_processo}

## ESCOPO
- Início: {inicio_processo}
- Fim: {fim_processo}

## RESPONSÁVEIS
- Dono do processo: {dono_processo}
- Executores: {executores}
- Aprovador: {aprovador}

## ENTRADAS
{entradas}

## SAÍDAS
{saidas}

## PASSO A PASSO
{passo_a_passo}

## KPIs
{indicadores}

## RISCOS E CONTROLES
{riscos_controles}

---

**Elaborado por:** {elaborado_por}  
**Aprovado por:** {aprovado_por}`
  },
  {
    id: 'estrutura-atualizacao-organograma',
    nome: 'Atualização de Estrutura (Organograma)',
    tipo: 'estrutura',
    categoria: 'Processos e Estrutura',
    isDefault: true,
    conteudo: `# FORMULÁRIO DE ATUALIZAÇÃO DE ESTRUTURA (ORGANOGRAMA)

**EMPRESA:** {empresa}  
**SOLICITANTE:** {solicitante}  
**DATA:** {data}

---

## MOTIVO DA ALTERAÇÃO
{motivo_alteracao}

## ESTRUTURA ATUAL
{estrutura_atual}

## ESTRUTURA PROPOSTA
{estrutura_proposta}

## IMPACTOS
- Pessoas: {impacto_pessoas}
- Custos: {impacto_custos}
- Processos: {impacto_processos}

---

Aprovações:

Gestor: ____________________  Data: ____/____/____  
RH/DP: _____________________  Data: ____/____/____`
  },

  // RH
  {
    id: 'rh-requisicao-pessoal',
    nome: 'Requisição de Pessoal (RH)',
    tipo: 'rh',
    categoria: 'Requisição de Pessoal',
    isDefault: true,
    conteudo: `# REQUISIÇÃO DE PESSOAL (RH)

**EMPRESA:** {empresa}  
**SOLICITANTE (GESTOR):** {solicitante}  
**ÁREA/SETOR:** {setor}  
**DATA:** {data}

---

## DADOS DA VAGA
- Cargo: {cargo}
- Quantidade: {qtd_vagas}
- Tipo: {tipo_vaga}
- Motivo: {motivo_vaga}
- Regime: {regime}

## PERFIL
- Escolaridade: {escolaridade}
- Experiência: {experiencia}
- Competências: {competencias}
- Jornada/Escala: {jornada}
- Local: {local_trabalho}
- Faixa salarial: {faixa_salarial}

## PRAZO
- Admissão desejada: {data_admissao_desejada}
- Urgência: {urgencia}

---

Aprovações:

Gestor: ____________________  Data: ____/____/____  
RH: ________________________  Data: ____/____/____`
  }
];

// ============================
// Dialogs (Editor de Template e Editor de Documento)
// ============================
function TemplateEditorDialog({
  open,
  mode, // 'create' | 'edit'
  initialTemplate,
  onClose,
  onSave,
  onSaveAsNew
}) {
  const [tpl, setTpl] = useState(
    initialTemplate || {
      nome: '',
      tipo: 'outros',
      categoria: 'Outros',
      conteudo: '',
      isDefault: false
    }
  );

  useEffect(() => {
    setTpl(
      initialTemplate || {
        nome: '',
        tipo: 'outros',
        categoria: 'Outros',
        conteudo: '',
        isDefault: false
      }
    );
  }, [initialTemplate, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTpl((prev) => ({ ...prev, [name]: value }));
  };

  const canSave = tpl.nome?.trim() && tpl.conteudo?.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Novo Template' : 'Editar Template'}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nome do formulário"
              name="nome"
              value={tpl.nome}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Tipo</InputLabel>
              <Select
                label="Tipo"
                name="tipo"
                value={tpl.tipo}
                onChange={handleChange}
              >
                <MenuItem value="entrega">Entrega</MenuItem>
                <MenuItem value="desconto">Desconto</MenuItem>
                <MenuItem value="punicao">Punição</MenuItem>
                <MenuItem value="cultura">Cultura</MenuItem>
                <MenuItem value="processos">Processos</MenuItem>
                <MenuItem value="estrutura">Estrutura</MenuItem>
                <MenuItem value="rh">RH</MenuItem>
                <MenuItem value="outros">Outros</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Categoria"
              name="categoria"
              value={tpl.categoria}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 1 }}>
              Use placeholders no texto, por exemplo: <strong>{'{empresa}'}</strong>,{' '}
              <strong>{'{motorista}'}</strong>, <strong>{'{data}'}</strong>.
              Você pode criar quantos campos quiser — se não existir no formulário, vai aparecer como [NOME_DO_CAMPO].
            </Alert>

            <TextField
              fullWidth
              label="Conteúdo do Template"
              name="conteudo"
              value={tpl.conteudo}
              onChange={handleChange}
              multiline
              minRows={14}
              margin="dense"
              placeholder="# TÍTULO\n\nConteúdo..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        {mode === 'edit' && (
          <Tooltip title="Salvar como novo (duplica este template)">
            <Button
              startIcon={<ContentCopyIcon />}
              onClick={() => onSaveAsNew?.(tpl)}
              disabled={!canSave}
              variant="outlined"
            >
              Salvar como novo
            </Button>
          </Tooltip>
        )}

        <Button
          startIcon={<SaveIcon />}
          onClick={() => onSave?.(tpl)}
          disabled={!canSave}
          variant="contained"
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DocumentEditorDialog({ open, title, value, onChange, onClose, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title || 'Editar Documento'}</DialogTitle>
      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 1 }}>
          Esta edição altera o texto final do documento (o que será salvo e impresso).
        </Alert>
        <TextField
          fullWidth
          multiline
          minRows={18}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Conteúdo do documento..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onSave}>
          Salvar alterações
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ============================
// Componente principal
// ============================
const Formularios = () => {
  const [tabValue, setTabValue] = useState(0);

  // templates (editáveis)
  const [templates, setTemplates] = useState(() => {
    const raw = localStorage.getItem(LS_TEMPLATES_KEY);
    return raw ? safeJsonParse(raw, DEFAULT_TEMPLATES) : DEFAULT_TEMPLATES;
  });

  // documentos gerados (editáveis)
  const [documentosSalvos, setDocumentosSalvos] = useState(() => {
    const raw = localStorage.getItem(LS_DOCS_KEY);
    return raw ? safeJsonParse(raw, []) : [];
  });

  useEffect(() => {
    localStorage.setItem(LS_TEMPLATES_KEY, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(LS_DOCS_KEY, JSON.stringify(documentosSalvos));
  }, [documentosSalvos]);

  // seleção
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  // Debug - remova depois que funcionar
  useEffect(() => {
    console.log('selectedTemplateId:', selectedTemplateId);
    console.log('selectedTemplate:', selectedTemplate);
  }, [selectedTemplateId, selectedTemplate]);

  // form data (inclui campos adicionais dos novos templates)
  const [formData, setFormData] = useState({
    empresa: '',
    motorista: '',
    veiculo: '',
    data: new Date().toLocaleDateString('pt-BR'),

    // desconto
    tipo_debito: '',
    descricao_debito: '',
    valor: '',
    data_ocorrencia: '',
    local: '',
    n_parcelas: 1,
    valor_parcela: '',

    // punição
    tipo_punicao: '',
    descricao_fato: '',
    hora_ocorrencia: '',
    norma_violada: '',

    // cultura
    missao: '',
    visao: '',
    valores: '',
    politicas_internas: '',

    // processos
    nome_processo: '',
    codigo_pop: '',
    versao_pop: '',
    objetivo_processo: '',
    inicio_processo: '',
    fim_processo: '',
    dono_processo: '',
    executores: '',
    aprovador: '',
    entradas: '',
    saidas: '',
    passo_a_passo: '',
    indicadores: '',
    riscos_controles: '',
    elaborado_por: '',
    aprovado_por: '',

    // estrutura
    solicitante: '',
    motivo_alteracao: '',
    estrutura_atual: '',
    estrutura_proposta: '',
    impacto_pessoas: '',
    impacto_custos: '',
    impacto_processos: '',

    // rh
    setor: '',
    cargo: '',
    qtd_vagas: '',
    tipo_vaga: '',
    motivo_vaga: '',
    regime: '',
    escolaridade: '',
    experiencia: '',
    competencias: '',
    jornada: '',
    local_trabalho: '',
    faixa_salarial: '',
    data_admissao_desejada: '',
    urgencia: ''
  });

  const [previewContent, setPreviewContent] = useState('');
  const [finalDocContent, setFinalDocContent] = useState('');
  const [docEdited, setDocEdited] = useState(false);

  // dialogs: template editor
  const [tplEditorOpen, setTplEditorOpen] = useState(false);
  const [tplEditorMode, setTplEditorMode] = useState('create'); // create|edit
  const [tplEditorInitial, setTplEditorInitial] = useState(null);

  // dialogs: document editor (geração)
  const [docEditorOpen, setDocEditorOpen] = useState(false);

  // dialogs: view/edit saved document
  const [savedDocViewOpen, setSavedDocViewOpen] = useState(false);
  const [savedDocEditOpen, setSavedDocEditOpen] = useState(false);
  const [activeSavedDoc, setActiveSavedDoc] = useState(null);
  const [activeSavedDocContent, setActiveSavedDocContent] = useState('');

  // Dados simulados (em produção, viriam da API)
  const empresas = ['Transportes ABC Ltda', 'Logística XYZ S.A.', 'Entregas Rápidas ME'];
  const motoristas = [
    { id: 1, nome: 'Expedito Nascimento de Araújo', cnh: '123456789', cpf: '000.000.000-00' },
    { id: 2, nome: 'João Silva', cnh: '987654321', cpf: '111.111.111-11' },
    { id: 3, nome: 'Maria Souza', cnh: '456789123', cpf: '222.222.222-22' }
  ];
  const veiculos = [
    { id: 1, placa: 'NOQ-0907', modelo: 'Volkswagen Delivery' },
    { id: 2, placa: 'ABC-1234', modelo: 'Fiat Uno' },
    { id: 3, placa: 'XYZ-5678', modelo: 'Volkswagen Gol' }
  ];

  // ============================
  // Merge preview (template + formData)
  // ============================
  useEffect(() => {
    if (!selectedTemplate) {
      setPreviewContent('');
      if (!docEdited) setFinalDocContent('');
      return;
    }

    let content = selectedTemplate.conteudo;

    // substitui {campos}
    Object.keys(formData).forEach((key) => {
      const regex = new RegExp(`{${key}}`, 'g');
      content = content.replace(regex, formData[key] || `[${key.toUpperCase()}]`);
    });

    // motorista (CPF/CNH)
    if (formData.motorista) {
      const mot = motoristas.find((m) => m.nome === formData.motorista);
      if (mot) {
        content = content.replace(/\[CPF_MOTORISTA\]/g, mot.cpf);
        content = content.replace(/\[NUMERO_CNH\]/g, mot.cnh);
      }
    }

    // veículo (já chega pronto do select, mas garantimos)
    if (formData.veiculo) {
      const v = veiculos.find((vv) => `${vv.placa} (${vv.modelo})` === formData.veiculo);
      if (v) content = content.replace(/{veiculo}/g, `${v.placa} (${v.modelo})`);
    }

    setPreviewContent(content);

    // se usuário não editou manualmente, finalDoc acompanha preview
    if (!docEdited) setFinalDocContent(content);
  }, [formData, selectedTemplate]); // eslint-disable-line

  // ============================
  // Handlers
  // ============================
  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // cálculo de parcelas
      if (name === 'valor' || name === 'n_parcelas') {
        const valorNum = parseFloat(name === 'valor' ? value : newData.valor) || 0;
        const parcelas = parseInt(name === 'n_parcelas' ? value : newData.n_parcelas, 10) || 1;
        newData.valor_parcela = parcelas > 0 ? (valorNum / parcelas).toFixed(2) : '';
      }

      return newData;
    });
  };

  const handleTemplateChange = (e) => {
    const id = e.target.value;
    setSelectedTemplateId(id);

    // reset edição manual do doc quando troca template
    setDocEdited(false);
    setFinalDocContent('');
    
    // Garante que estamos na aba de geração
    setTabValue(0);
  };

  const limparCampos = () => {
    setFormData((prev) => ({
      ...prev,
      empresa: '',
      motorista: '',
      veiculo: '',
      data: new Date().toLocaleDateString('pt-BR'),

      tipo_debito: '',
      descricao_debito: '',
      valor: '',
      data_ocorrencia: '',
      local: '',
      n_parcelas: 1,
      valor_parcela: '',

      tipo_punicao: '',
      descricao_fato: '',
      hora_ocorrencia: '',
      norma_violada: '',

      missao: '',
      visao: '',
      valores: '',
      politicas_internas: '',

      nome_processo: '',
      codigo_pop: '',
      versao_pop: '',
      objetivo_processo: '',
      inicio_processo: '',
      fim_processo: '',
      dono_processo: '',
      executores: '',
      aprovador: '',
      entradas: '',
      saidas: '',
      passo_a_passo: '',
      indicadores: '',
      riscos_controles: '',
      elaborado_por: '',
      aprovado_por: '',

      solicitante: '',
      motivo_alteracao: '',
      estrutura_atual: '',
      estrutura_proposta: '',
      impacto_pessoas: '',
      impacto_custos: '',
      impacto_processos: '',

      setor: '',
      cargo: '',
      qtd_vagas: '',
      tipo_vaga: '',
      motivo_vaga: '',
      regime: '',
      escolaridade: '',
      experiencia: '',
      competencias: '',
      jornada: '',
      local_trabalho: '',
      faixa_salarial: '',
      data_admissao_desejada: '',
      urgencia: ''
    }));
    setSelectedTemplateId('');
    setPreviewContent('');
    setFinalDocContent('');
    setDocEdited(false);
  };

  const handleSaveDocument = () => {
    if (!selectedTemplate) return alert('Selecione um template primeiro!');
    if (!finalDocContent?.trim()) return alert('Gere/edite o documento antes de salvar.');

    const novoDoc = {
      id: Date.now(),
      templateId: selectedTemplate.id,
      templateNome: selectedTemplate.nome,
      empresa: formData.empresa,
      motorista: formData.motorista,
      veiculo: formData.veiculo,
      data: formData.data,
      conteudo: finalDocContent,
      createdAt: Date.now()
    };

    setDocumentosSalvos((prev) => [novoDoc, ...prev]);
    alert('Documento salvo com sucesso!');
  };

  const handlePrintContent = (contentToPrint) => {
    if (!contentToPrint?.trim()) return alert('Nada para imprimir.');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Documento</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 13px; }
          </style>
        </head>
        <body>
          <pre>${escapeHtml(contentToPrint)}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintCurrent = () => handlePrintContent(finalDocContent);

  const handleExportPDF = () => {
    alert('Exportar PDF: use Imprimir e "Salvar como PDF" (por enquanto).');
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm('Deseja realmente excluir este documento?')) {
      setDocumentosSalvos((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  // ============================
  // Templates CRUD
  // ============================
  const openCreateTemplate = () => {
    setTplEditorMode('create');
    setTplEditorInitial(null);
    setTplEditorOpen(true);
  };

  const openEditTemplate = (template) => {
    setTplEditorMode('edit');
    setTplEditorInitial(template);
    setTplEditorOpen(true);
  };

  const saveTemplate = (tpl) => {
    if (tplEditorMode === 'create') {
      const newTpl = {
        ...tpl,
        id: `tpl-${Date.now()}`,
        isDefault: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setTemplates((prev) => [newTpl, ...prev]);
      setTplEditorOpen(false);
      return;
    }

    // edit
    const id = tplEditorInitial?.id;
    if (!id) return;

    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...tpl, updatedAt: Date.now() } : t))
    );

    // se estiver editando o template selecionado, regen doc
    if (selectedTemplateId === id) {
      setDocEdited(false);
    }

    setTplEditorOpen(false);
  };

  const saveTemplateAsNew = (tpl) => {
    const newTpl = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      nome: `${tpl.nome} (cópia)`,
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setTemplates((prev) => [newTpl, ...prev]);
    setTplEditorOpen(false);
  };

  const deleteTemplate = (template) => {
    if (template.isDefault) {
      alert('Não é permitido excluir um template padrão. Duplique e edite.');
      return;
    }
    if (!window.confirm(`Excluir o template "${template.nome}"?`)) return;

    setTemplates((prev) => prev.filter((t) => t.id !== template.id));

    if (selectedTemplateId === template.id) {
      setSelectedTemplateId('');
      setPreviewContent('');
      setFinalDocContent('');
      setDocEdited(false);
    }
  };

  // ============================
  // Documentos salvos: ver/editar
  // ============================
  const openViewSavedDoc = (doc) => {
    setActiveSavedDoc(doc);
    setSavedDocViewOpen(true);
  };

  const openEditSavedDoc = (doc) => {
    setActiveSavedDoc(doc);
    setActiveSavedDocContent(doc.conteudo || '');
    setSavedDocEditOpen(true);
  };

  const saveEditedSavedDoc = () => {
    if (!activeSavedDoc) return;

    setDocumentosSalvos((prev) =>
      prev.map((d) =>
        d.id === activeSavedDoc.id ? { ...d, conteudo: activeSavedDocContent } : d
      )
    );
    setSavedDocEditOpen(false);
    setActiveSavedDoc(null);
    setActiveSavedDocContent('');
  };

  // ============================
  // UI helpers
  // ============================
  const templateLabel = selectedTemplate ? selectedTemplate.nome : 'Visualização do Documento';

  const showDescontoFields = selectedTemplateId === 'desconto-colaborador';
  const showPunicaoFields = selectedTemplateId === 'aplicacao-punicao';
  const showCulturaFields =
    selectedTemplateId === 'cultura-termo-missao-visao-valores' ||
    selectedTemplateId === 'cultura-acordo-politica-interna';
  const showProcessosFields = selectedTemplateId === 'processos-mapeamento-pop';
  const showEstruturaFields = selectedTemplateId === 'estrutura-atualizacao-organograma';
  const showRhFields = selectedTemplateId === 'rh-requisicao-pessoal';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <ArticleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gerenciamento de Formulários
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreateTemplate}>
            Novo Template
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="Geração de Documentos" />
          <Tab label="Documentos Gerados" />
          <Tab label="Templates / Formulários" />
        </Tabs>
      </Paper>

      {/* ===========================
          TAB 1: GERAÇÃO
         =========================== */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* ESQUERDA */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Seleção de Formulário
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Formulário</InputLabel>
                <Select
                  value={selectedTemplateId}
                  label="Tipo de Formulário"
                  onChange={handleTemplateChange}
                  renderValue={(selected) => {
                    const t = templates.find((x) => x.id === selected);
                    return t ? `${t.nome}${t.isDefault ? '' : ' (custom)'}` : 'Selecione...';
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione...</em>
                  </MenuItem>

                  {Array.from(
                    templates.reduce((acc, t) => {
                      const key = t.categoria || 'Outros';
                      if (!acc.has(key)) acc.set(key, []);
                      acc.get(key).push(t);
                      return acc;
                    }, new Map())
                  ).map(([cat, list]) => (
                    [
                      <ListSubheader key={`sub-${cat}`} disableSticky sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {cat.toUpperCase()}
                      </ListSubheader>,
                      ...list.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                          {t.nome} {t.isDefault ? '' : '(custom)'}
                        </MenuItem>
                      ))
                    ]
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Empresa</InputLabel>
                <Select name="empresa" value={formData.empresa} label="Empresa" onChange={handleFormChange}>
                  {empresas.map((emp, idx) => (
                    <MenuItem key={idx} value={emp}>
                      {emp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Motorista/Colaborador</InputLabel>
                <Select
                  name="motorista"
                  value={formData.motorista}
                  label="Motorista/Colaborador"
                  onChange={handleFormChange}
                >
                  {motoristas.map((mot) => (
                    <MenuItem key={mot.id} value={mot.nome}>
                      {mot.nome} (CNH: {mot.cnh})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Veículo</InputLabel>
                <Select name="veiculo" value={formData.veiculo} label="Veículo" onChange={handleFormChange}>
                  {veiculos.map((veic) => (
                    <MenuItem key={veic.id} value={`${veic.placa} (${veic.modelo})`}>
                      {veic.placa} ({veic.modelo})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Campos específicos - DESCONTO */}
              {showDescontoFields && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Dados do Desconto
                  </Typography>

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Tipo de Débito"
                    name="tipo_debito"
                    value={formData.tipo_debito}
                    onChange={handleFormChange}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Descrição do Débito"
                    name="descricao_debito"
                    multiline
                    rows={2}
                    value={formData.descricao_debito}
                    onChange={handleFormChange}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Valor Total (R$)"
                    name="valor"
                    type="number"
                    value={formData.valor}
                    onChange={handleFormChange}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Data da Ocorrência"
                    name="data_ocorrencia"
                    type="date"
                    value={formData.data_ocorrencia}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Local"
                    name="local"
                    value={formData.local}
                    onChange={handleFormChange}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Número de Parcelas"
                    name="n_parcelas"
                    type="number"
                    value={formData.n_parcelas}
                    onChange={handleFormChange}
                    InputProps={{ inputProps: { min: 1, max: 12 } }}
                  />

                  {formData.valor_parcela && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Valor da parcela: R$ {formData.valor_parcela}
                    </Alert>
                  )}
                </Box>
              )}

              {/* Campos específicos - PUNIÇÃO */}
              {showPunicaoFields && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Dados da Punição
                  </Typography>

                  <FormControl fullWidth margin="dense" size="small">
                    <InputLabel>Tipo de Punição</InputLabel>
                    <Select
                      name="tipo_punicao"
                      value={formData.tipo_punicao}
                      label="Tipo de Punição"
                      onChange={handleFormChange}
                    >
                      <MenuItem value="Advertência Verbal">Advertência Verbal</MenuItem>
                      <MenuItem value="Advertência Escrita">Advertência Escrita</MenuItem>
                      <MenuItem value="Suspensão">Suspensão</MenuItem>
                      <MenuItem value="Notificação">Notificação</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Data da Ocorrência"
                    name="data_ocorrencia"
                    type="date"
                    value={formData.data_ocorrencia}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Hora da Ocorrência"
                    name="hora_ocorrencia"
                    type="time"
                    value={formData.hora_ocorrencia}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Local"
                    name="local"
                    value={formData.local}
                    onChange={handleFormChange}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Descrição do Fato"
                    name="descricao_fato"
                    multiline
                    rows={3}
                    value={formData.descricao_fato}
                    onChange={handleFormChange}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Norma Violada"
                    name="norma_violada"
                    value={formData.norma_violada}
                    onChange={handleFormChange}
                  />
                </Box>
              )}

              {/* Campos - CULTURA */}
              {showCulturaFields && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Cultura e Conformidade
                  </Typography>

                  {selectedTemplateId === 'cultura-termo-missao-visao-valores' && (
                    <>
                      <TextField
                        fullWidth
                        margin="dense"
                        size="small"
                        label="Missão"
                        name="missao"
                        multiline
                        rows={2}
                        value={formData.missao}
                        onChange={handleFormChange}
                      />
                      <TextField
                        fullWidth
                        margin="dense"
                        size="small"
                        label="Visão"
                        name="visao"
                        multiline
                        rows={2}
                        value={formData.visao}
                        onChange={handleFormChange}
                      />
                      <TextField
                        fullWidth
                        margin="dense"
                        size="small"
                        label="Valores"
                        name="valores"
                        multiline
                        rows={3}
                        value={formData.valores}
                        onChange={handleFormChange}
                      />
                    </>
                  )}

                  {selectedTemplateId === 'cultura-acordo-politica-interna' && (
                    <TextField
                      fullWidth
                      margin="dense"
                      size="small"
                      label="Políticas Internas (lista ou texto)"
                      name="politicas_internas"
                      multiline
                      rows={5}
                      value={formData.politicas_internas}
                      onChange={handleFormChange}
                    />
                  )}
                </Box>
              )}

              {/* Campos - PROCESSOS (POP) */}
              {showProcessosFields && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f3e5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Mapeamento de Processos (POP)
                  </Typography>

                  <TextField fullWidth margin="dense" size="small" label="Nome do Processo" name="nome_processo" value={formData.nome_processo} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Código POP" name="codigo_pop" value={formData.codigo_pop} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Versão" name="versao_pop" value={formData.versao_pop} onChange={handleFormChange} />

                  <TextField fullWidth margin="dense" size="small" label="Objetivo" name="objetivo_processo" multiline rows={2} value={formData.objetivo_processo} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Início do processo" name="inicio_processo" value={formData.inicio_processo} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Fim do processo" name="fim_processo" value={formData.fim_processo} onChange={handleFormChange} />

                  <TextField fullWidth margin="dense" size="small" label="Dono do processo" name="dono_processo" value={formData.dono_processo} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Executores" name="executores" value={formData.executores} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Aprovador" name="aprovador" value={formData.aprovador} onChange={handleFormChange} />

                  <TextField fullWidth margin="dense" size="small" label="Entradas" name="entradas" multiline rows={2} value={formData.entradas} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Saídas" name="saidas" multiline rows={2} value={formData.saidas} onChange={handleFormChange} />

                  <TextField fullWidth margin="dense" size="small" label="Passo a passo" name="passo_a_passo" multiline rows={4} value={formData.passo_a_passo} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="KPIs/Indicadores" name="indicadores" multiline rows={2} value={formData.indicadores} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Riscos e Controles" name="riscos_controles" multiline rows={2} value={formData.riscos_controles} onChange={handleFormChange} />

                  <TextField fullWidth margin="dense" size="small" label="Elaborado por" name="elaborado_por" value={formData.elaborado_por} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Aprovado por" name="aprovado_por" value={formData.aprovado_por} onChange={handleFormChange} />
                </Box>
              )}

              {/* Campos - ESTRUTURA */}
              {showEstruturaFields && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Atualização de Estrutura (Organograma)
                  </Typography>

                  <TextField fullWidth margin="dense" size="small" label="Solicitante" name="solicitante" value={formData.solicitante} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Motivo da alteração" name="motivo_alteracao" multiline rows={2} value={formData.motivo_alteracao} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Estrutura atual" name="estrutura_atual" multiline rows={3} value={formData.estrutura_atual} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Estrutura proposta" name="estrutura_proposta" multiline rows={3} value={formData.estrutura_proposta} onChange={handleFormChange} />

                  <TextField fullWidth margin="dense" size="small" label="Impacto em pessoas" name="impacto_pessoas" value={formData.impacto_pessoas} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Impacto em custos" name="impacto_custos" value={formData.impacto_custos} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Impacto em processos" name="impacto_processos" value={formData.impacto_processos} onChange={handleFormChange} />
                </Box>
              )}

              {/* Campos - RH */}
              {showRhFields && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#fffde7', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Requisição de Pessoal (RH)
                  </Typography>

                  <TextField fullWidth margin="dense" size="small" label="Solicitante (Gestor)" name="solicitante" value={formData.solicitante} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Setor" name="setor" value={formData.setor} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Cargo" name="cargo" value={formData.cargo} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Qtd. vagas" name="qtd_vagas" value={formData.qtd_vagas} onChange={handleFormChange} />

                  <TextField fullWidth margin="dense" size="small" label="Tipo de vaga" name="tipo_vaga" value={formData.tipo_vaga} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Motivo" name="motivo_vaga" value={formData.motivo_vaga} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Regime" name="regime" value={formData.regime} onChange={handleFormChange} />

                  <TextField fullWidth margin="dense" size="small" label="Escolaridade" name="escolaridade" value={formData.escolaridade} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Experiência" name="experiencia" value={formData.experiencia} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Competências" name="competencias" multiline rows={2} value={formData.competencias} onChange={handleFormChange} />

                  <TextField fullWidth margin="dense" size="small" label="Jornada/Escala" name="jornada" value={formData.jornada} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Local de trabalho" name="local_trabalho" value={formData.local_trabalho} onChange={handleFormChange} />
                  <TextField fullWidth margin="dense" size="small" label="Faixa salarial" name="faixa_salarial" value={formData.faixa_salarial} onChange={handleFormChange} />

                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    label="Data admissão desejada"
                    name="data_admissao_desejada"
                    type="date"
                    value={formData.data_admissao_desejada}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField fullWidth margin="dense" size="small" label="Urgência" name="urgencia" value={formData.urgencia} onChange={handleFormChange} />
                </Box>
              )}

              {/* Ações */}
              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveDocument}
                  disabled={!selectedTemplateId}
                  fullWidth
                >
                  Salvar Documento
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrintCurrent}
                  disabled={!selectedTemplateId}
                >
                  Imprimir
                </Button>
              </Box>

              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button
                  variant="text"
                  onClick={() => {
                    if (!selectedTemplate) return;
                    setDocEditorOpen(true);
                  }}
                  disabled={!selectedTemplateId}
                  startIcon={<EditIcon />}
                  fullWidth
                >
                  Editar Documento (texto final)
                </Button>
              </Box>

              <Button variant="text" onClick={limparCampos} fullWidth sx={{ mt: 1 }}>
                Limpar Campos
              </Button>

              {/* editar template selecionado */}
              {selectedTemplate && (
                <Button
                  variant="outlined"
                  onClick={() => openEditTemplate(selectedTemplate)}
                  fullWidth
                  sx={{ mt: 1 }}
                  startIcon={<EditIcon />}
                >
                  Editar Template Selecionado
                </Button>
              )}
            </Paper>

            {/* Info do Motorista */}
            {formData.motorista && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Dados do Colaborador
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 100,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      <strong>Nome:</strong> {formData.motorista}
                    </Typography>
                    <Typography variant="body2">
                      <strong>CNH:</strong> {motoristas.find((m) => m.nome === formData.motorista)?.cnh}
                    </Typography>
                    <Typography variant="body2">
                      <strong>CPF:</strong> {motoristas.find((m) => m.nome === formData.motorista)?.cpf}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Validade:</strong> 15/06/2026
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* DIREITA */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{templateLabel}</Typography>
                <Box>
                  <Tooltip title="Imprimir (texto final)">
                    <span>
                      <IconButton onClick={handlePrintCurrent} disabled={!selectedTemplateId}>
                        <PrintIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Exportar PDF (via imprimir)">
                    <span>
                      <IconButton onClick={handleExportPDF} disabled={!selectedTemplateId}>
                        <DownloadIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Editar documento final">
                    <span>
                      <IconButton
                        onClick={() => selectedTemplate && setDocEditorOpen(true)}
                        disabled={!selectedTemplateId}
                      >
                        <EditIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Alert severity={docEdited ? 'warning' : 'info'} sx={{ mb: 2 }}>
                {docEdited
                  ? 'Você editou manualmente o texto final. Alterações nos campos não substituirão o texto automaticamente.'
                  : 'O documento está sendo montado automaticamente a partir do template e dos campos.'}
              </Alert>

              <Box
                sx={{
                  bgcolor: 'grey.50',
                  p: 3,
                  minHeight: 600,
                  maxHeight: 700,
                  overflow: 'auto',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '13px',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1
                }}
              >
                {(finalDocContent || previewContent) ||
                  'Selecione um formulário e preencha os dados para visualizar o documento'}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ===========================
          TAB 2: DOCUMENTOS GERADOS
         =========================== */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Documentos Gerados
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {documentosSalvos.length === 0 ? (
            <Alert severity="info">Nenhum documento salvo ainda. Gere documentos na aba anterior.</Alert>
          ) : (
            <Grid container spacing={2}>
              {documentosSalvos.map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" component="div" noWrap>
                        {doc.templateNome || doc.template}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Data: {doc.data}
                      </Typography>
                      <Typography variant="body2" noWrap>
                        Empresa: {doc.empresa}
                      </Typography>
                      <Typography variant="body2" noWrap>
                        Colaborador: {doc.motorista}
                      </Typography>
                      <Typography variant="body2" noWrap>
                        Veículo: {doc.veiculo}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button size="small" startIcon={<VisibilityIcon />} onClick={() => openViewSavedDoc(doc)}>
                        Ver
                      </Button>
                      <Button size="small" startIcon={<EditIcon />} onClick={() => openEditSavedDoc(doc)}>
                        Editar
                      </Button>
                      <Button size="small" startIcon={<PrintIcon />} onClick={() => handlePrintContent(doc.conteudo)}>
                        Imprimir
                      </Button>
                      <IconButton size="small" color="error" onClick={() => handleDeleteDocument(doc.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </TabPanel>

      {/* ===========================
          TAB 3: TEMPLATES
         =========================== */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Templates / Formulários</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateTemplate}>
              Novo Template
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {templates.map((t) => (
              <Grid item xs={12} md={6} key={t.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {t.nome} {t.isDefault ? '' : '(custom)'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categoria: {t.categoria} | Tipo: {t.tipo}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }} noWrap>
                      ID: {t.id}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => openEditTemplate(t)}>
                      Editar
                    </Button>

                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => {
                        // duplicar rápido
                        const newTpl = {
                          ...t,
                          id: `tpl-${Date.now()}`,
                          nome: `${t.nome} (cópia)`,
                          isDefault: false,
                          createdAt: Date.now(),
                          updatedAt: Date.now()
                        };
                        setTemplates((prev) => [newTpl, ...prev]);
                        alert('Template duplicado!');
                      }}
                    >
                      Duplicar
                    </Button>

                    <IconButton size="small" color="error" onClick={() => deleteTemplate(t)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            Dica: para criar "outros formulários", clique em <strong>Novo Template</strong> e use placeholders como{' '}
            <strong>{'{empresa}'}</strong>, <strong>{'{motorista}'}</strong>, <strong>{'{data}'}</strong>.
          </Alert>
        </Paper>
      </TabPanel>

      {/* ===========================
          Dialog: Editar Documento final (geração)
         =========================== */}
      <DocumentEditorDialog
        open={docEditorOpen}
        title="Editar Documento (texto final)"
        value={finalDocContent}
        onChange={(v) => {
          setFinalDocContent(v);
          setDocEdited(true);
        }}
        onClose={() => setDocEditorOpen(false)}
        onSave={() => setDocEditorOpen(false)}
      />

      {/* ===========================
          Dialog: Template editor
         =========================== */}
      <TemplateEditorDialog
        open={tplEditorOpen}
        mode={tplEditorMode}
        initialTemplate={tplEditorInitial}
        onClose={() => setTplEditorOpen(false)}
        onSave={saveTemplate}
        onSaveAsNew={saveTemplateAsNew}
      />

      {/* ===========================
          Dialog: Ver documento salvo
         =========================== */}
      <Dialog open={savedDocViewOpen} onClose={() => setSavedDocViewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Visualizar Documento</DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              bgcolor: 'grey.50',
              p: 2,
              minHeight: 400,
              whiteSpace: 'pre-wrap',
              border: '1px solid #eee',
              borderRadius: 1,
              fontFamily: 'Courier New, monospace',
              fontSize: 13
            }}
          >
            {activeSavedDoc?.conteudo || ''}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSavedDocViewOpen(false)}>Fechar</Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => handlePrintContent(activeSavedDoc?.conteudo)}
          >
            Imprimir
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setSavedDocViewOpen(false);
              if (activeSavedDoc) openEditSavedDoc(activeSavedDoc);
            }}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===========================
          Dialog: Editar documento salvo
         =========================== */}
      <DocumentEditorDialog
        open={savedDocEditOpen}
        title="Editar Documento Salvo"
        value={activeSavedDocContent}
        onChange={setActiveSavedDocContent}
        onClose={() => setSavedDocEditOpen(false)}
        onSave={saveEditedSavedDoc}
      />
    </Box>
  );
};

export default Formularios;