import React, { useState } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  Building2,
  Shield,
  Key,
  Eye,
  EyeOff,
  Filter
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'

// Dados simulados para demonstração
const usuariosSimulados = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@techcorp.com',
    telefone: '(11) 99999-9999',
    empresa: 'TechCorp Ltda',
    perfil: 'Usuário',
    status: 'Ativo',
    ultimoAcesso: '2024-01-27 10:30:00',
    treinamentos: 5,
    certificados: 3
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@industriaabc.com',
    telefone: '(11) 88888-8888',
    empresa: 'Indústria ABC S.A.',
    perfil: 'Consultor',
    status: 'Ativo',
    ultimoAcesso: '2024-01-27 09:15:00',
    treinamentos: 8,
    certificados: 6
  },
  {
    id: 3,
    nome: 'Carlos Oliveira',
    email: 'carlos@consultoriaxyz.com',
    telefone: '(11) 77777-7777',
    empresa: 'Consultoria XYZ',
    perfil: 'Administrador',
    status: 'Inativo',
    ultimoAcesso: '2024-01-25 14:20:00',
    treinamentos: 12,
    certificados: 10
  },
  {
    id: 4,
    nome: 'Ana Costa',
    email: 'ana@techcorp.com',
    telefone: '(11) 66666-6666',
    empresa: 'TechCorp Ltda',
    perfil: 'Usuário',
    status: 'Bloqueado',
    ultimoAcesso: '2024-01-20 16:45:00',
    treinamentos: 2,
    certificados: 1
  }
]

const empresasDisponiveis = [
  'TechCorp Ltda',
  'Indústria ABC S.A.',
  'Consultoria XYZ',
  'RiosF5 Consultoria'
]

const perfisDisponiveis = [
  'Usuário',
  'Consultor', 
  'Administrador',
  'Super Admin'
]

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(usuariosSimulados)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    perfil: '',
    senha: '',
    status: 'Ativo'
  })

  // Filtrar usuários baseado no termo de busca
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Estatísticas
  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.status === 'Ativo').length,
    inativos: usuarios.filter(u => u.status === 'Inativo').length,
    bloqueados: usuarios.filter(u => u.status === 'Bloqueado').length
  }

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUser(usuario)
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        empresa: usuario.empresa,
        perfil: usuario.perfil,
        senha: '',
        status: usuario.status
      })
    } else {
      setEditingUser(null)
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        empresa: '',
        perfil: '',
        senha: '',
        status: 'Ativo'
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setShowPassword(false)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      // Editar usuário existente
      setUsuarios(usuarios.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData, ultimoAcesso: new Date().toLocaleString() }
          : u
      ))
    } else {
      // Criar novo usuário
      const novoUsuario = {
        id: Math.max(...usuarios.map(u => u.id)) + 1,
        ...formData,
        ultimoAcesso: 'Nunca',
        treinamentos: 0,
        certificados: 0
      }
      setUsuarios([...usuarios, novoUsuario])
    }
    handleCloseModal()
  }

  const handleDeleteUser = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsuarios(usuarios.filter(u => u.id !== id))
    }
  }

  const handleToggleStatus = (id) => {
    setUsuarios(usuarios.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'Ativo' ? 'Inativo' : 'Ativo'
        return { ...u, status: newStatus }
      }
      return u
    }))
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Ativo': 'bg-green-100 text-green-800',
      'Inativo': 'bg-gray-100 text-gray-800',
      'Bloqueado': 'bg-red-100 text-red-800'
    }
    return variants[status] || 'bg-gray-100 text-gray-800'
  }

  const getPerfilBadge = (perfil) => {
    const variants = {
      'Super Admin': 'bg-purple-100 text-purple-800',
      'Administrador': 'bg-blue-100 text-blue-800',
      'Consultor': 'bg-orange-100 text-orange-800',
      'Usuário': 'bg-gray-100 text-gray-800'
    }
    return variants[perfil] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestão de Usuários</h1>
          <p className="text-slate-600 mt-1">Gerencie usuários cadastrados no sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-slate-600 mt-1">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
            <p className="text-xs text-slate-600 mt-1">Aproveitamento: 80%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
            <UserX className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inativos}</div>
            <p className="text-xs text-slate-600 mt-1">Reativação pendente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Bloqueados</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.bloqueados}</div>
            <p className="text-xs text-slate-600 mt-1">Revisão necessária</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Visualize e gerencie todos os usuários cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, email ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Tabela de Usuários */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Treinamentos</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFiltrados.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {usuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{usuario.nome}</div>
                          <div className="text-sm text-slate-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {usuario.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-slate-600">
                        <Building2 className="w-4 h-4 mr-2" />
                        {usuario.empresa}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPerfilBadge(usuario.perfil)}>
                        {usuario.perfil}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(usuario.status)}>
                        {usuario.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{usuario.treinamentos} concluídos</div>
                        <div className="text-slate-500">{usuario.certificados} certificados</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {usuario.ultimoAcesso}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(usuario.id)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          {usuario.status === 'Ativo' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(usuario)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(usuario.id)}
                          className="text-red-600 hover:text-red-900"
                        >
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

      {/* Modal de Cadastro/Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? 'Atualize as informações do usuário' : 'Preencha os dados para criar um novo usuário'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usuario@empresa.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa</Label>
                <Select value={formData.empresa} onValueChange={(value) => setFormData({...formData, empresa: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresasDisponiveis.map((empresa) => (
                      <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="perfil">Perfil de Acesso</Label>
                <Select value={formData.perfil} onValueChange={(value) => setFormData({...formData, perfil: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {perfisDisponiveis.map((perfil) => (
                      <SelectItem key={perfil} value={perfil}>{perfil}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">
                {editingUser ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
              </Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  placeholder={editingUser ? "Digite a nova senha" : "Digite a senha"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700">
              {editingUser ? 'Atualizar' : 'Criar'} Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

