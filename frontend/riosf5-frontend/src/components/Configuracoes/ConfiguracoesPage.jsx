import React, { useState } from 'react'
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  FileText, 
  DollarSign, 
  BookOpen,
  Activity,
  Key,
  Lock,
  Eye,
  EyeOff,
  Save,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Building2,
  Mail,
  Phone,
  Globe,
  Server,
  HardDrive,
  Wifi,
  Zap,
  Bell,
  Calendar,
  BarChart3,
  ArrowLeft,
  Sparkles,
  UserPlus,
  Ban,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Progress } from '@/components/ui/progress.jsx'

// Dados simulados para demonstração
const empresasData = [
  {
    id: 1,
    nome: 'TechCorp Ltda',
    cnpj: '12.345.678/0001-90',
    plano: 'Premium',
    valorContrato: 2500.00,
    quantidadeUsuarios: 156,
    limiteUsuarios: 200,
    inicioContrato: '2024-01-15',
    tempoContrato: 12, // meses
    diaVencimento: 15,
    proximoVencimento: '2024-02-15',
    status: 'ativo',
    diasAtraso: 0,
    email: 'contato@techcorp.com',
    telefone: '(11) 98765-4321'
  },
  {
    id: 2,
    nome: 'Indústria ABC S.A.',
    cnpj: '98.765.432/0001-10',
    plano: 'Empresarial',
    valorContrato: 4800.00,
    quantidadeUsuarios: 89,
    limiteUsuarios: 150,
    inicioContrato: '2023-12-10',
    tempoContrato: 24,
    diaVencimento: 10,
    proximoVencimento: '2024-02-12', // próximo dia útil
    status: 'pendente',
    diasAtraso: 3,
    email: 'financeiro@industriaabc.com',
    telefone: '(11) 3456-7890'
  },
  {
    id: 3,
    nome: 'Consultoria XYZ',
    cnpj: '11.222.333/0001-44',
    plano: 'Básico',
    valorContrato: 890.00,
    quantidadeUsuarios: 67,
    limiteUsuarios: 100,
    inicioContrato: '2023-11-30',
    tempoContrato: 6,
    diaVencimento: 30,
    proximoVencimento: '2024-01-30',
    status: 'vencido',
    diasAtraso: 10,
    email: 'admin@consultoriaxyz.com',
    telefone: '(11) 2345-6789'
  },
  {
    id: 4,
    nome: 'Empresa Bloqueada Ltda',
    cnpj: '55.666.777/0001-88',
    plano: 'Básico',
    valorContrato: 890.00,
    quantidadeUsuarios: 45,
    limiteUsuarios: 50,
    inicioContrato: '2023-10-01',
    tempoContrato: 12,
    diaVencimento: 1,
    proximoVencimento: '2024-02-01',
    status: 'bloqueado',
    diasAtraso: 30,
    email: 'contato@empresabloqueada.com',
    telefone: '(11) 9999-8888'
  }
]

const usuariosData = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao.silva@techcorp.com',
    empresa: 'TechCorp Ltda',
    empresaId: 1,
    perfil: 'Administrador',
    status: 'ativo',
    ultimoAcesso: '2024-01-27 14:30',
    dataCriacao: '2024-01-15',
    permissoes: ['dashboard', 'usuarios', 'treinamentos', 'documentos', 'agenda']
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria.santos@techcorp.com',
    empresa: 'TechCorp Ltda',
    empresaId: 1,
    perfil: 'Usuário',
    status: 'ativo',
    ultimoAcesso: '2024-01-27 10:15',
    dataCriacao: '2024-01-15',
    permissoes: ['dashboard', 'treinamentos']
  },
  {
    id: 3,
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@industriaabc.com',
    empresa: 'Indústria ABC S.A.',
    empresaId: 2,
    perfil: 'Consultor',
    status: 'ativo',
    ultimoAcesso: '2024-01-26 16:45',
    dataCriacao: '2023-12-10',
    permissoes: ['dashboard', 'treinamentos', 'documentos', 'agenda']
  },
  {
    id: 4,
    nome: 'Ana Costa',
    email: 'ana.costa@consultoriaxyz.com',
    empresa: 'Consultoria XYZ',
    empresaId: 3,
    perfil: 'Usuário',
    status: 'inativo',
    ultimoAcesso: '2024-01-20 09:30',
    dataCriacao: '2023-11-30',
    permissoes: ['dashboard', 'treinamentos']
  }
]

const perfisAcesso = [
  {
    id: 1,
    nome: 'Super Administrador',
    descricao: 'Acesso total ao sistema',
    usuarios: 1,
    permissoes: ['dashboard', 'empresas', 'usuarios', 'treinamentos', 'configuracoes', 'financeiro', 'logs', 'backup', 'mobile']
  },
  {
    id: 2,
    nome: 'Administrador',
    descricao: 'Gerenciamento de empresa e usuários',
    usuarios: 8,
    permissoes: ['dashboard', 'usuarios', 'treinamentos', 'documentos', 'agenda']
  },
  {
    id: 3,
    nome: 'Consultor',
    descricao: 'Criação e gestão de treinamentos',
    usuarios: 15,
    permissoes: ['dashboard', 'treinamentos', 'documentos', 'agenda']
  },
  {
    id: 4,
    nome: 'Usuário',
    descricao: 'Acesso básico aos treinamentos',
    usuarios: 2131,
    permissoes: ['dashboard', 'treinamentos']
  }
]

const logsAtividades = [
  {
    id: 1,
    usuario: 'João Silva',
    acao: 'Login realizado',
    ip: '192.168.1.100',
    timestamp: '2024-01-27 10:30:15',
    status: 'sucesso'
  },
  {
    id: 2,
    usuario: 'Maria Santos',
    acao: 'Treinamento concluído: Segurança no Trabalho',
    ip: '192.168.1.101',
    timestamp: '2024-01-27 10:25:42',
    status: 'sucesso'
  },
  {
    id: 3,
    usuario: 'Admin',
    acao: 'Tentativa de login falhada',
    ip: '192.168.1.102',
    timestamp: '2024-01-27 10:20:18',
    status: 'erro'
  },
  {
    id: 4,
    usuario: 'Sistema',
    acao: 'Backup automático executado',
    ip: 'localhost',
    timestamp: '2024-01-27 03:00:00',
    status: 'sucesso'
  }
]

const backupsRealizados = [
  {
    id: 1,
    nome: 'backup_completo_20240127.zip',
    tipo: 'Completo',
    tamanho: '2.5 GB',
    data: '2024-01-27 03:00:00',
    status: 'Concluído'
  },
  {
    id: 2,
    nome: 'backup_incremental_20240126.zip',
    tipo: 'Incremental',
    tamanho: '450 MB',
    data: '2024-01-26 03:00:00',
    status: 'Concluído'
  },
  {
    id: 3,
    nome: 'backup_completo_20240125.zip',
    tipo: 'Completo',
    tamanho: '2.3 GB',
    data: '2024-01-25 03:00:00',
    status: 'Concluído'
  }
]

export default function ConfiguracoesPage({ onBack, onAnalyzeScreen }) {
  const [activeTab, setActiveTab] = useState('geral')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState(null)
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  
  // Estados para configurações
  const [configGeral, setConfigGeral] = useState({
    nomeEmpresa: 'RiosF5 Consultoria',
    email: 'contato@riosf5.com',
    telefone: '(11) 99999-9999',
    endereco: 'São Paulo, SP',
    website: 'https://riosf5.com',
    logo: '/assets/rios_f5_consultoria_logo.jpeg'
  })

  const [configSeguranca, setConfigSeguranca] = useState({
    senhaMinima: 8,
    exigirMaiuscula: true,
    exigirNumero: true,
    exigirCaracterEspecial: true,
    tentativasMaximas: 3,
    bloqueioTempo: 30,
    sessaoExpira: 480,
    autenticacao2FA: false
  })

  const [configAPI, setConfigAPI] = useState({
    rateLimit: 1000,
    timeout: 30,
    versao: 'v1.0',
    documentacao: true,
    logs: true,
    cache: true
  })

  const [configFinanceiro, setConfigFinanceiro] = useState({
    diasVencimento: 30,
    jurosAtraso: 2.0,
    multaAtraso: 10.0,
    descontoAntecipado: 5.0,
    emailCobranca: true,
    notificacaoVencimento: 7,
    ajusteVencimentoDiaUtil: true
  })

  const handleOpenModal = (type, data = null) => {
    setModalType(type)
    if (type === 'empresa-edit' && data) {
      setSelectedEmpresa(data)
    }
    if (type === 'usuario-edit' && data) {
      setSelectedUsuario(data)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalType('')
    setSelectedEmpresa(null)
    setSelectedUsuario(null)
  }

  const handleSaveConfig = () => {
    // Aqui salvaria as configurações no backend
    console.log('Configurações salvas')
    handleCloseModal()
  }

  const handleBackup = (tipo) => {
    console.log(`Iniciando backup ${tipo}`)
    // Implementar lógica de backup
  }

  const handleDownloadBackup = (backup) => {
    console.log(`Baixando backup: ${backup.nome}`)
    // Implementar download
  }

  const handleBloquearEmpresa = (empresaId) => {
    console.log(`Bloqueando empresa ${empresaId}`)
    // Implementar bloqueio
  }

  const handleLiberarEmpresa = (empresaId) => {
    console.log(`Liberando empresa ${empresaId}`)
    // Implementar liberação
  }

  const handleEnviarNotificacao = (empresaId) => {
    console.log(`Enviando notificação para empresa ${empresaId}`)
    // Implementar envio de notificação
  }

  const getStatusBadge = (status) => {
    const variants = {
      'sucesso': 'bg-green-100 text-green-800',
      'erro': 'bg-red-100 text-red-800',
      'aviso': 'bg-yellow-100 text-yellow-800',
      'ativo': 'bg-green-100 text-green-800',
      'pendente': 'bg-yellow-100 text-yellow-800',
      'vencido': 'bg-red-100 text-red-800',
      'bloqueado': 'bg-gray-100 text-gray-800',
      'inativo': 'bg-gray-100 text-gray-800',
      'Concluído': 'bg-green-100 text-green-800'
    }
    return variants[status] || 'bg-gray-100 text-gray-800'
  }

  const calcularDiaVencimentoUtil = (dia, mes, ano) => {
    // Lógica simplificada - em produção, usar biblioteca de datas
    // e considerar feriados
    const data = new Date(ano, mes - 1, dia)
    const diaSemana = data.getDay()
    
    // Se cair no sábado (6), move para segunda (2 dias)
    if (diaSemana === 6) {
      data.setDate(data.getDate() + 2)
    }
    // Se cair no domingo (0), move para segunda (1 dia)
    else if (diaSemana === 0) {
      data.setDate(data.getDate() + 1)
    }
    
    return data.toISOString().split('T')[0]
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com botões de Voltar e Análise Inteligente */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configurações do Sistema</h1>
            <p className="text-slate-600 mt-1">Gerencie todas as configurações e controles do RiosF5</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={onAnalyzeScreen}
            className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Análise Inteligente</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Tabs de Configuração */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="perfis">Perfis</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="documentacao">Docs</TabsTrigger>
        </TabsList>

        {/* Aba Geral */}
        <TabsContent value="geral" className="space-y-6">
          {/* Conteúdo mantido igual ao original... */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>Configure as informações básicas da sua empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                  <Input
                    id="nomeEmpresa"
                    value={configGeral.nomeEmpresa}
                    onChange={(e) => setConfigGeral({...configGeral, nomeEmpresa: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Principal</Label>
                  <Input
                    id="email"
                    type="email"
                    value={configGeral.email}
                    onChange={(e) => setConfigGeral({...configGeral, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={configGeral.telefone}
                    onChange={(e) => setConfigGeral({...configGeral, telefone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={configGeral.website}
                    onChange={(e) => setConfigGeral({...configGeral, website: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={configGeral.endereco}
                  onChange={(e) => setConfigGeral({...configGeral, endereco: e.target.value})}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Configurações gerais de funcionamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-slate-500">Receber notificações importantes por email</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Backup Automático</Label>
                  <p className="text-sm text-slate-500">Realizar backup automático diariamente</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Logs Detalhados</Label>
                  <p className="text-sm text-slate-500">Registrar todas as atividades do sistema</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA EMPRESAS - NOVA */}
        <TabsContent value="empresas" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Gerenciamento de Empresas</h3>
              <p className="text-sm text-slate-600">Controle de empresas cadastradas e contratos</p>
            </div>
            <Button onClick={() => handleOpenModal('empresa-add')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Empresa
            </Button>
          </div>

          {/* Filtros e Busca */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar empresa por nome ou CNPJ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select defaultValue="todos">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                    <SelectItem value="bloqueado">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Empresas */}
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Usuários</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empresasData.map((empresa) => (
                      <TableRow key={empresa.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{empresa.nome}</div>
                            <div className="text-sm text-slate-500">{empresa.cnpj}</div>
                          </div>
                        </TableCell>
                        <TableCell>{empresa.plano}</TableCell>
                        <TableCell>R$ {empresa.valorContrato.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{empresa.quantidadeUsuarios}/{empresa.limiteUsuarios}</span>
                            <Progress 
                              value={(empresa.quantidadeUsuarios / empresa.limiteUsuarios) * 100} 
                              className="w-16 h-2" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{empresa.proximoVencimento}</div>
                            {empresa.diasAtraso > 0 && (
                              <div className="text-red-600 text-xs">{empresa.diasAtraso} dias de atraso</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(empresa.status)}>
                            {empresa.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenModal('empresa-edit', empresa)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEnviarNotificacao(empresa.id)}
                              title="Enviar notificação"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            {empresa.status === 'bloqueado' ? (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleLiberarEmpresa(empresa.id)}
                                title="Liberar acesso"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleBloquearEmpresa(empresa.id)}
                                title="Bloquear acesso"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Financeiras */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">R$ 8.190,00</div>
                <p className="text-xs text-slate-500 mt-1">4 empresas ativas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Pendente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">R$ 4.800,00</div>
                <p className="text-xs text-slate-500 mt-1">1 empresa</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Vencido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">R$ 1.780,00</div>
                <p className="text-xs text-slate-500 mt-1">2 empresas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">357</div>
                <p className="text-xs text-slate-500 mt-1">De 500 disponíveis</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABA USUÁRIOS - NOVA */}
        <TabsContent value="usuarios" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Gerenciamento de Usuários</h3>
              <p className="text-sm text-slate-600">Controle de usuários por empresa</p>
            </div>
            <Button onClick={() => handleOpenModal('usuario-add')} className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>

          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar usuário por nome ou email..."
                    className="pl-10"
                  />
                </div>
                <Select defaultValue="todas">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas empresas</SelectItem>
                    {empresasData.map(emp => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>{emp.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue="todos">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="consultor">Consultor</SelectItem>
                    <SelectItem value="usuario">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Usuários */}
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosData.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{usuario.nome}</div>
                            <div className="text-sm text-slate-500">{usuario.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{usuario.empresa}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{usuario.perfil}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{usuario.ultimoAcesso}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(usuario.status)}>
                            {usuario.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenModal('usuario-edit', usuario)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Key className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              {usuario.status === 'ativo' ? (
                                <Ban className="w-4 h-4 text-red-600" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Perfis de Acesso */}
        <TabsContent value="perfis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfis de Acesso</CardTitle>
              <CardDescription>Gerencie os perfis e permissões de usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {perfisAcesso.map((perfil) => (
                  <div key={perfil.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{perfil.nome}</h4>
                        <p className="text-sm text-slate-500">{perfil.descricao}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-slate-400">{perfil.usuarios} usuários</span>
                          <div className="flex space-x-1">
                            {perfil.permissoes.slice(0, 3).map((perm, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                            {perfil.permissoes.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{perfil.permissoes.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Users className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button onClick={() => handleOpenModal('perfil')} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Perfil de Acesso
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Segurança - Mantida do original */}
        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Políticas de Senha</CardTitle>
              <CardDescription>Configure os requisitos de segurança para senhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senhaMinima">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="senhaMinima"
                    type="number"
                    min="6"
                    max="20"
                    value={configSeguranca.senhaMinima}
                    onChange={(e) => setConfigSeguranca({...configSeguranca, senhaMinima: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tentativas">Tentativas Máximas de Login</Label>
                  <Input
                    id="tentativas"
                    type="number"
                    min="3"
                    max="10"
                    value={configSeguranca.tentativasMaximas}
                    onChange={(e) => setConfigSeguranca({...configSeguranca, tentativasMaximas: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Exigir Letra Maiúscula</Label>
                    <p className="text-sm text-slate-500">Senha deve conter ao menos uma letra maiúscula</p>
                  </div>
                  <Switch 
                    checked={configSeguranca.exigirMaiuscula}
                    onCheckedChange={(checked) => setConfigSeguranca({...configSeguranca, exigirMaiuscula: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Exigir Número</Label>
                    <p className="text-sm text-slate-500">Senha deve conter ao menos um número</p>
                  </div>
                  <Switch 
                    checked={configSeguranca.exigirNumero}
                    onCheckedChange={(checked) => setConfigSeguranca({...configSeguranca, exigirNumero: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Exigir Caractere Especial</Label>
                    <p className="text-sm text-slate-500">Senha deve conter ao menos um caractere especial</p>
                  </div>
                  <Switch 
                    checked={configSeguranca.exigirCaracterEspecial}
                    onCheckedChange={(checked) => setConfigSeguranca({...configSeguranca, exigirCaracterEspecial: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticação de Dois Fatores (2FA)</Label>
                    <p className="text-sm text-slate-500">Exigir verificação adicional no login</p>
                  </div>
                  <Switch 
                    checked={configSeguranca.autenticacao2FA}
                    onCheckedChange={(checked) => setConfigSeguranca({...configSeguranca, autenticacao2FA: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Sessão</CardTitle>
              <CardDescription>Controle o tempo e comportamento das sessões de usuário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessaoExpira">Expiração da Sessão (minutos)</Label>
                  <Input
                    id="sessaoExpira"
                    type="number"
                    min="30"
                    max="1440"
                    value={configSeguranca.sessaoExpira}
                    onChange={(e) => setConfigSeguranca({...configSeguranca, sessaoExpira: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloqueioTempo">Tempo de Bloqueio (minutos)</Label>
                  <Input
                    id="bloqueioTempo"
                    type="number"
                    min="5"
                    max="120"
                    value={configSeguranca.bloqueioTempo}
                    onChange={(e) => setConfigSeguranca({...configSeguranca, bloqueioTempo: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Logs - Mantida do original */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Atividades</CardTitle>
              <CardDescription>Monitore todas as atividades realizadas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por usuário, ação ou IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logsAtividades.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.usuario}</TableCell>
                        <TableCell>{log.acao}</TableCell>
                        <TableCell className="text-slate-500">{log.ip}</TableCell>
                        <TableCell className="text-slate-500">{log.timestamp}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(log.status)}>
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Backup - Mantida do original */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Backup</CardTitle>
                <CardDescription>Realize backup manual dos dados do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleBackup('completo')} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Backup Completo
                </Button>
                <Button 
                  onClick={() => handleBackup('incremental')} 
                  variant="outline" 
                  className="w-full"
                >
                  <HardDrive className="w-4 h-4 mr-2" />
                  Backup Incremental
                </Button>
                <Button 
                  onClick={() => handleBackup('configuracoes')} 
                  variant="outline" 
                  className="w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Backup de Configurações
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Backup</CardTitle>
                <CardDescription>Configure o backup automático</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Backup Automático Diário</Label>
                    <p className="text-sm text-slate-500">Executar às 03:00</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Backup Semanal Completo</Label>
                    <p className="text-sm text-slate-500">Domingos às 02:00</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label>Retenção de Backups (dias)</Label>
                  <Input type="number" defaultValue="30" min="7" max="365" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backups Realizados</CardTitle>
              <CardDescription>Histórico de backups e opções de restauração</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Arquivo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backupsRealizados.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell className="font-medium">{backup.nome}</TableCell>
                        <TableCell>{backup.tipo}</TableCell>
                        <TableCell>{backup.tamanho}</TableCell>
                        <TableCell>{backup.data}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(backup.status)}>
                            {backup.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadBackup(backup)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Upload className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba API - Mantida do original */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da API</CardTitle>
              <CardDescription>Configure os parâmetros de funcionamento da API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rateLimit">Rate Limit (req/hora)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={configAPI.rateLimit}
                    onChange={(e) => setConfigAPI({...configAPI, rateLimit: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout (segundos)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={configAPI.timeout}
                    onChange={(e) => setConfigAPI({...configAPI, timeout: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Documentação Pública</Label>
                    <p className="text-sm text-slate-500">Disponibilizar documentação da API</p>
                  </div>
                  <Switch 
                    checked={configAPI.documentacao}
                    onCheckedChange={(checked) => setConfigAPI({...configAPI, documentacao: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Logs de API</Label>
                    <p className="text-sm text-slate-500">Registrar todas as chamadas da API</p>
                  </div>
                  <Switch 
                    checked={configAPI.logs}
                    onCheckedChange={(checked) => setConfigAPI({...configAPI, logs: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache de Respostas</Label>
                    <p className="text-sm text-slate-500">Ativar cache para melhor performance</p>
                  </div>
                  <Switch 
                    checked={configAPI.cache}
                    onCheckedChange={(checked) => setConfigAPI({...configAPI, cache: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chaves de API</CardTitle>
              <CardDescription>Gerencie as chaves de acesso à API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Chave Principal</h4>
                    <p className="text-sm text-slate-500 font-mono">riosf5_***************************</p>
                    <p className="text-xs text-slate-400">Criada em 15/01/2024</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Gerar Nova Chave
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Financeiro - Atualizada */}
        <TabsContent value="financeiro" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>Configure parâmetros de cobrança e pagamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diasVencimento">Dias para Vencimento</Label>
                  <Input
                    id="diasVencimento"
                    type="number"
                    value={configFinanceiro.diasVencimento}
                    onChange={(e) => setConfigFinanceiro({...configFinanceiro, diasVencimento: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificacaoVencimento">Notificar X dias antes</Label>
                  <Input
                    id="notificacaoVencimento"
                    type="number"
                    value={configFinanceiro.notificacaoVencimento}
                    onChange={(e) => setConfigFinanceiro({...configFinanceiro, notificacaoVencimento: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jurosAtraso">Juros por Atraso (%/mês)</Label>
                  <Input
                    id="jurosAtraso"
                    type="number"
                    step="0.1"
                    value={configFinanceiro.jurosAtraso}
                    onChange={(e) => setConfigFinanceiro({...configFinanceiro, jurosAtraso: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="multaAtraso">Multa por Atraso (%)</Label>
                  <Input
                    id="multaAtraso"
                    type="number"
                    step="0.1"
                    value={configFinanceiro.multaAtraso}
                    onChange={(e) => setConfigFinanceiro({...configFinanceiro, multaAtraso: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Email de Cobrança Automática</Label>
                  <p className="text-sm text-slate-500">Enviar lembretes de vencimento</p>
                </div>
                <Switch 
                  checked={configFinanceiro.emailCobranca}
                  onCheckedChange={(checked) => setConfigFinanceiro({...configFinanceiro, emailCobranca: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Ajustar Vencimento para Dia Útil</Label>
                  <p className="text-sm text-slate-500">Se vencimento cair em feriado/fim de semana, ajustar para próximo dia útil</p>
                </div>
                <Switch 
                  checked={configFinanceiro.ajusteVencimentoDiaUtil}
                  onCheckedChange={(checked) => setConfigFinanceiro({...configFinanceiro, ajusteVencimentoDiaUtil: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Em Dia</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">1</div>
                <p className="text-sm text-slate-600">empresa(s)</p>
                <p className="text-sm font-medium mt-2">R$ 2.500,00/mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span>Pendente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">1</div>
                <p className="text-sm text-slate-600">empresa(s)</p>
                <p className="text-sm font-medium mt-2">R$ 4.800,00/mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span>Vencido/Bloqueado</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">2</div>
                <p className="text-sm text-slate-600">empresa(s)</p>
                <p className="text-sm font-medium mt-2">R$ 1.780,00/mês</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Documentação - Mantida do original */}
        <TabsContent value="documentacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentação do Sistema</CardTitle>
              <CardDescription>Acesse manuais, guias e documentação técnica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Manual do Usuário</h4>
                      <p className="text-sm text-slate-500">Guia completo para usuários finais</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">Manual do Administrador</h4>
                      <p className="text-sm text-slate-500">Configuração e gestão do sistema</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Server className="w-8 h-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Documentação da API</h4>
                      <p className="text-sm text-slate-500">Referência técnica da API REST</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                    <div>
                      <h4 className="font-medium">Solução de Problemas</h4>
                      <p className="text-sm text-slate-500">FAQ e resolução de problemas comuns</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
              <CardDescription>Versão atual e informações técnicas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Versão do Sistema</Label>
                  <p className="text-lg font-semibold">RiosF5 v2.1.0</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Última Atualização</Label>
                  <p className="text-lg font-semibold">27/01/2024</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Licença</Label>
                  <p className="text-lg font-semibold">Empresarial</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Suporte</Label>
                  <p className="text-lg font-semibold">Premium</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para criação/edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'perfil' && 'Novo Perfil de Acesso'}
              {modalType === 'empresa-add' && 'Nova Empresa'}
              {modalType === 'empresa-edit' && 'Editar Empresa'}
              {modalType === 'usuario-add' && 'Novo Usuário'}
              {modalType === 'usuario-edit' && 'Editar Usuário'}
            </DialogTitle>
            <DialogDescription>
              {modalType === 'perfil' && 'Configure as permissões para o novo perfil'}
              {modalType === 'empresa-add' && 'Cadastre uma nova empresa no sistema'}
              {modalType === 'empresa-edit' && 'Atualize os dados da empresa'}
              {modalType === 'usuario-add' && 'Adicione um novo usuário'}
              {modalType === 'usuario-edit' && 'Atualize os dados do usuário'}
            </DialogDescription>
          </DialogHeader>
          
          {/* Form Perfil */}
          {modalType === 'perfil' && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nomePerfil">Nome do Perfil</Label>
                <Input id="nomePerfil" placeholder="Ex: Gerente de Treinamentos" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricaoPerfil">Descrição</Label>
                <Textarea id="descricaoPerfil" placeholder="Descreva as responsabilidades deste perfil" />
              </div>
              <div className="space-y-2">
                <Label>Permissões</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Dashboard', 'Empresas', 'Usuários', 'Treinamentos', 'Documentos', 'Configurações'].map((perm) => (
                    <label key={perm} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Empresa */}
          {(modalType === 'empresa-add' || modalType === 'empresa-edit') && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                  <Input 
                    id="nomeEmpresa" 
                    defaultValue={selectedEmpresa?.nome}
                    placeholder="Nome completo" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input 
                    id="cnpj" 
                    defaultValue={selectedEmpresa?.cnpj}
                    placeholder="00.000.000/0000-00" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    defaultValue={selectedEmpresa?.email}
                    placeholder="contato@empresa.com" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    defaultValue={selectedEmpresa?.telefone}
                    placeholder="(00) 00000-0000" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plano">Plano</Label>
                  <Select defaultValue={selectedEmpresa?.plano?.toLowerCase() || "basico"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="empresarial">Empresarial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorContrato">Valor Contrato (R$)</Label>
                  <Input 
                    id="valorContrato" 
                    type="number"
                    defaultValue={selectedEmpresa?.valorContrato}
                    step="0.01"
                    placeholder="0.00" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limiteUsuarios">Limite Usuários</Label>
                  <Input 
                    id="limiteUsuarios" 
                    type="number"
                    defaultValue={selectedEmpresa?.limiteUsuarios}
                    placeholder="100" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tempoContrato">Tempo Contrato (meses)</Label>
                  <Input 
                    id="tempoContrato" 
                    type="number"
                    defaultValue={selectedEmpresa?.tempoContrato}
                    placeholder="12" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diaVencimento">Dia Vencimento</Label>
                  <Input 
                    id="diaVencimento" 
                    type="number"
                    min="1"
                    max="31"
                    defaultValue={selectedEmpresa?.diaVencimento}
                    placeholder="15" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Usuário */}
          {(modalType === 'usuario-add' || modalType === 'usuario-edit') && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nomeUsuario">Nome Completo</Label>
                <Input 
                  id="nomeUsuario" 
                  defaultValue={selectedUsuario?.nome}
                  placeholder="Nome do usuário" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailUsuario">Email</Label>
                <Input 
                  id="emailUsuario" 
                  type="email"
                  defaultValue={selectedUsuario?.email}
                  placeholder="usuario@empresa.com" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresaUsuario">Empresa</Label>
                  <Select defaultValue={selectedUsuario?.empresaId?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresasData.map(emp => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>{emp.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perfilUsuario">Perfil</Label>
                  <Select defaultValue={selectedUsuario?.perfil?.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrador">Administrador</SelectItem>
                      <SelectItem value="consultor">Consultor</SelectItem>
                      <SelectItem value="usuario">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {modalType === 'usuario-add' && (
                <div className="space-y-2">
                  <Label htmlFor="senhaUsuario">Senha</Label>
                  <Input 
                    id="senhaUsuario" 
                    type="password"
                    placeholder="Senha temporária" 
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig} className="bg-blue-600 hover:bg-blue-700">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
