import { useState, useEffect } from 'react'
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
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
  DialogTrigger,
} from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'

// Dados simulados para demonstração
const empresasSimuladas = [
  {
    id: 1,
    nome: 'TechCorp Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@techcorp.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    situacao: 'ativa',
    dataContrato: '2024-01-15',
    vencimentoContrato: '2025-01-15',
    maxUsuarios: 50,
    usuariosAtivos: 35,
    valorMensal: 2500.00,
    situacaoFinanceira: 'em_dia'
  },
  {
    id: 2,
    nome: 'Indústria ABC S.A.',
    cnpj: '98.765.432/0001-10',
    email: 'admin@industriaabc.com.br',
    telefone: '(11) 88888-8888',
    endereco: 'Av. Industrial, 456 - São Paulo/SP',
    situacao: 'ativa',
    dataContrato: '2023-06-10',
    vencimentoContrato: '2024-06-10',
    maxUsuarios: 100,
    usuariosAtivos: 87,
    valorMensal: 4500.00,
    situacaoFinanceira: 'pendente'
  },
  {
    id: 3,
    nome: 'Consultoria XYZ',
    cnpj: '11.222.333/0001-44',
    email: 'info@consultoriaxyz.com',
    telefone: '(11) 77777-7777',
    endereco: 'Rua Comercial, 789 - São Paulo/SP',
    situacao: 'inativa',
    dataContrato: '2023-03-20',
    vencimentoContrato: '2024-03-20',
    maxUsuarios: 25,
    usuariosAtivos: 0,
    valorMensal: 1500.00,
    situacaoFinanceira: 'inadimplente'
  }
]

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState(empresasSimuladas)
  const [filteredEmpresas, setFilteredEmpresas] = useState(empresasSimuladas)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    maxUsuarios: '',
    valorMensal: '',
    vencimentoContrato: ''
  })

  // Filtrar empresas baseado na busca
  useEffect(() => {
    const filtered = empresas.filter(empresa =>
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.cnpj.includes(searchTerm) ||
      empresa.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmpresas(filtered)
  }, [searchTerm, empresas])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleAddEmpresa = () => {
    setEditingEmpresa(null)
    setFormData({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      maxUsuarios: '',
      valorMensal: '',
      vencimentoContrato: ''
    })
    setIsDialogOpen(true)
  }

  const handleEditEmpresa = (empresa) => {
    setEditingEmpresa(empresa)
    setFormData({
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      email: empresa.email,
      telefone: empresa.telefone,
      endereco: empresa.endereco,
      maxUsuarios: empresa.maxUsuarios.toString(),
      valorMensal: empresa.valorMensal.toString(),
      vencimentoContrato: empresa.vencimentoContrato
    })
    setIsDialogOpen(true)
  }

  const handleSaveEmpresa = async () => {
    setLoading(true)
    
    try {
      // TODO: Implementar chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingEmpresa) {
        // Atualizar empresa existente
        setEmpresas(prev => prev.map(emp => 
          emp.id === editingEmpresa.id 
            ? { ...emp, ...formData, maxUsuarios: parseInt(formData.maxUsuarios), valorMensal: parseFloat(formData.valorMensal) }
            : emp
        ))
      } else {
        // Adicionar nova empresa
        const novaEmpresa = {
          id: Date.now(),
          ...formData,
          maxUsuarios: parseInt(formData.maxUsuarios),
          valorMensal: parseFloat(formData.valorMensal),
          situacao: 'ativa',
          dataContrato: new Date().toISOString().split('T')[0],
          usuariosAtivos: 0,
          situacaoFinanceira: 'em_dia'
        }
        setEmpresas(prev => [...prev, novaEmpresa])
      }
      
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Erro ao salvar empresa:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmpresa = async (empresaId) => {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      setLoading(true)
      try {
        // TODO: Implementar chamada para API
        await new Promise(resolve => setTimeout(resolve, 500))
        setEmpresas(prev => prev.filter(emp => emp.id !== empresaId))
      } catch (error) {
        console.error('Erro ao excluir empresa:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const getSituacaoBadge = (situacao) => {
    const variants = {
      ativa: { variant: 'default', icon: CheckCircle, text: 'Ativa' },
      inativa: { variant: 'secondary', icon: XCircle, text: 'Inativa' },
      suspensa: { variant: 'destructive', icon: AlertCircle, text: 'Suspensa' }
    }
    
    const config = variants[situacao] || variants.inativa
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    )
  }

  const getSituacaoFinanceiraBadge = (situacao) => {
    const variants = {
      em_dia: { variant: 'default', text: 'Em dia', color: 'text-green-500' },
      pendente: { variant: 'secondary', text: 'Pendente', color: 'text-yellow-500' },
      inadimplente: { variant: 'destructive', text: 'Inadimplente', color: 'text-red-500' }
    }
    
    const config = variants[situacao] || variants.pendente
    
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Building2 className="h-8 w-8 mr-3 text-primary" />
            Gestão de Empresas
          </h1>
          <p className="text-muted-foreground">Gerencie empresas cadastradas no sistema</p>
        </div>
        
        <Button onClick={handleAddEmpresa} className="riosf5-button">
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="riosf5-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Empresas</p>
                <p className="text-2xl font-bold text-foreground">{empresas.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-chart-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="riosf5-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Empresas Ativas</p>
                <p className="text-2xl font-bold text-foreground">
                  {empresas.filter(e => e.situacao === 'ativa').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="riosf5-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold text-foreground">
                  {empresas.reduce((acc, emp) => acc + emp.usuariosAtivos, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="riosf5-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {empresas.filter(e => e.situacao === 'ativa').reduce((acc, emp) => acc + emp.valorMensal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="riosf5-card">
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>Visualize e gerencie todas as empresas cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, CNPJ ou email..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Financeiro</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{empresa.nome}</div>
                        <div className="text-sm text-muted-foreground">{empresa.cnpj}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{empresa.email}</div>
                        <div className="text-sm text-muted-foreground">{empresa.telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {empresa.usuariosAtivos} / {empresa.maxUsuarios}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(empresa.usuariosAtivos / empresa.maxUsuarios) * 100}%` }}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getSituacaoBadge(empresa.situacao)}
                    </TableCell>
                    <TableCell>
                      <div>
                        {getSituacaoFinanceiraBadge(empresa.situacaoFinanceira)}
                        <div className="text-sm text-muted-foreground mt-1">
                          R$ {empresa.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(empresa.vencimentoContrato).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEmpresa(empresa)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEmpresa(empresa.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
            </DialogTitle>
            <DialogDescription>
              {editingEmpresa 
                ? 'Atualize as informações da empresa.' 
                : 'Preencha os dados para cadastrar uma nova empresa.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
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
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contato@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                placeholder="Endereço completo da empresa"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUsuarios">Máx. Usuários</Label>
                <Input
                  id="maxUsuarios"
                  type="number"
                  value={formData.maxUsuarios}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUsuarios: e.target.value }))}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
                <Input
                  id="valorMensal"
                  type="number"
                  step="0.01"
                  value={formData.valorMensal}
                  onChange={(e) => setFormData(prev => ({ ...prev, valorMensal: e.target.value }))}
                  placeholder="2500.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vencimentoContrato">Vencimento</Label>
                <Input
                  id="vencimentoContrato"
                  type="date"
                  value={formData.vencimentoContrato}
                  onChange={(e) => setFormData(prev => ({ ...prev, vencimentoContrato: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEmpresa} disabled={loading} className="riosf5-button">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

