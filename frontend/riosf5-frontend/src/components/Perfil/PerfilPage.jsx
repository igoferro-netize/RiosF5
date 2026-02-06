import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  Upload,
  Download,
  Trash2,
  Edit,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  Globe,
  Lock,
  Key,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

export default function PerfilPage() {
  const [abaSelecionada, setAbaSelecionada] = useState('perfil')
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: 'Administrador RiosF5',
    email: 'riosf5consultoria@gmail.com',
    telefone: '(11) 99999-9999',
    cargo: 'Administrador do Sistema',
    departamento: 'TI',
    empresa: 'RiosF5 Consultoria',
    endereco: 'São Paulo, SP',
    bio: 'Administrador responsável pelo sistema RiosF5 de treinamento e controle de documentos.',
    dataAdmissao: '2024-01-15',
    avatar: null
  })

  const [configuracoes, setConfiguracoes] = useState({
    tema: 'claro',
    idioma: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    notificacoes: {
      email: true,
      push: true,
      sms: false,
      desktop: true
    },
    privacidade: {
      perfilPublico: false,
      mostrarEmail: false,
      mostrarTelefone: false,
      permitirMensagens: true
    },
    seguranca: {
      autenticacaoDoisFatores: false,
      loginUnicoDispositivo: false,
      logoutAutomatico: 30,
      senhaExpira: 90
    },
    interface: {
      sidebarColapsada: false,
      animacoes: true,
      sons: true,
      densidade: 'normal'
    }
  })

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const handleSalvarPerfil = () => {
    // Implementar salvamento do perfil
    console.log('Salvando perfil:', dadosUsuario)
    setEditandoPerfil(false)
    // Mostrar notificação de sucesso
  }

  const handleAlterarSenha = () => {
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!')
      return
    }
    if (novaSenha.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres!')
      return
    }
    // Implementar alteração de senha
    console.log('Alterando senha')
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
    // Mostrar notificação de sucesso
  }

  const handleUploadAvatar = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDadosUsuario({
          ...dadosUsuario,
          avatar: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSalvarConfiguracoes = () => {
    // Implementar salvamento das configurações
    console.log('Salvando configurações:', configuracoes)
    // Mostrar notificação de sucesso
  }

  const handleExportarDados = () => {
    // Implementar exportação de dados
    console.log('Exportando dados do usuário')
  }

  const handleExcluirConta = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      // Implementar exclusão da conta
      console.log('Excluindo conta')
    }
  }

  const estatisticasUsuario = {
    testesRealizados: 15,
    certificadosObtidos: 8,
    treinamentosConcluidos: 12,
    documentosAcessados: 45,
    tempoNoSistema: '6 meses',
    ultimoAcesso: '2024-03-15 14:30'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perfil do Usuário</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportarDados}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
          <Button onClick={handleSalvarPerfil}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Gerencie suas informações básicas de perfil
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setEditandoPerfil(!editandoPerfil)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editandoPerfil ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {dadosUsuario.avatar ? (
                      <img 
                        src={dadosUsuario.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-blue-600" />
                    )}
                  </div>
                  {editandoPerfil && (
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadAvatar}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{dadosUsuario.nome}</h3>
                  <p className="text-gray-600">{dadosUsuario.cargo}</p>
                  <Badge variant="outline">{dadosUsuario.departamento}</Badge>
                </div>
              </div>

              {/* Campos do Perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={dadosUsuario.nome}
                    onChange={(e) => setDadosUsuario({...dadosUsuario, nome: e.target.value})}
                    disabled={!editandoPerfil}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={dadosUsuario.email}
                      onChange={(e) => setDadosUsuario({...dadosUsuario, email: e.target.value})}
                      disabled={!editandoPerfil}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="telefone"
                      value={dadosUsuario.telefone}
                      onChange={(e) => setDadosUsuario({...dadosUsuario, telefone: e.target.value})}
                      disabled={!editandoPerfil}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="cargo"
                      value={dadosUsuario.cargo}
                      onChange={(e) => setDadosUsuario({...dadosUsuario, cargo: e.target.value})}
                      disabled={!editandoPerfil}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select 
                    value={dadosUsuario.departamento} 
                    onValueChange={(value) => setDadosUsuario({...dadosUsuario, departamento: value})}
                    disabled={!editandoPerfil}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TI">Tecnologia da Informação</SelectItem>
                      <SelectItem value="RH">Recursos Humanos</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Operacional">Operacional</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={dadosUsuario.empresa}
                    onChange={(e) => setDadosUsuario({...dadosUsuario, empresa: e.target.value})}
                    disabled={!editandoPerfil}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="endereco"
                    value={dadosUsuario.endereco}
                    onChange={(e) => setDadosUsuario({...dadosUsuario, endereco: e.target.value})}
                    disabled={!editandoPerfil}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={dadosUsuario.bio}
                  onChange={(e) => setDadosUsuario({...dadosUsuario, bio: e.target.value})}
                  disabled={!editandoPerfil}
                  rows={3}
                  placeholder="Conte um pouco sobre você..."
                />
              </div>

              {editandoPerfil && (
                <div className="flex space-x-4">
                  <Button onClick={handleSalvarPerfil}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  <Button variant="outline" onClick={() => setEditandoPerfil(false)}>
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          {/* Configurações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Personalize sua experiência no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select 
                    value={configuracoes.tema} 
                    onValueChange={(value) => setConfiguracoes({
                      ...configuracoes, 
                      tema: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claro">
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 mr-2" />
                          Claro
                        </div>
                      </SelectItem>
                      <SelectItem value="escuro">
                        <div className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                          Escuro
                        </div>
                      </SelectItem>
                      <SelectItem value="auto">
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          Automático
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select 
                    value={configuracoes.idioma} 
                    onValueChange={(value) => setConfiguracoes({
                      ...configuracoes, 
                      idioma: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Fuso Horário</Label>
                  <Select 
                    value={configuracoes.timezone} 
                    onValueChange={(value) => setConfiguracoes({
                      ...configuracoes, 
                      timezone: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Densidade da Interface</Label>
                  <Select 
                    value={configuracoes.interface.densidade} 
                    onValueChange={(value) => setConfiguracoes({
                      ...configuracoes, 
                      interface: {...configuracoes.interface, densidade: value}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compacta">Compacta</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="espaçosa">Espaçosa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Preferências de Interface</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sidebar Colapsada por Padrão</Label>
                    <p className="text-sm text-gray-600">Iniciar com a barra lateral recolhida</p>
                  </div>
                  <Switch
                    checked={configuracoes.interface.sidebarColapsada}
                    onCheckedChange={(checked) => setConfiguracoes({
                      ...configuracoes,
                      interface: {...configuracoes.interface, sidebarColapsada: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animações</Label>
                    <p className="text-sm text-gray-600">Habilitar animações na interface</p>
                  </div>
                  <Switch
                    checked={configuracoes.interface.animacoes}
                    onCheckedChange={(checked) => setConfiguracoes({
                      ...configuracoes,
                      interface: {...configuracoes.interface, animacoes: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sons do Sistema</Label>
                    <p className="text-sm text-gray-600">Reproduzir sons para notificações</p>
                  </div>
                  <Switch
                    checked={configuracoes.interface.sons}
                    onCheckedChange={(checked) => setConfiguracoes({
                      ...configuracoes,
                      interface: {...configuracoes.interface, sons: checked}
                    })}
                  />
                </div>
              </div>

              <Button onClick={handleSalvarConfiguracoes}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          {/* Alteração de Senha */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senhaAtual">Senha Atual</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="senhaAtual"
                    type={mostrarSenha ? "text" : "password"}
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="novaSenha"
                    type={mostrarSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmarSenha"
                    type={mostrarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button onClick={handleAlterarSenha}>
                <Shield className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          {/* Configurações de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Configure opções avançadas de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                </div>
                <Switch
                  checked={configuracoes.seguranca.autenticacaoDoisFatores}
                  onCheckedChange={(checked) => setConfiguracoes({
                    ...configuracoes,
                    seguranca: {...configuracoes.seguranca, autenticacaoDoisFatores: checked}
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login Único por Dispositivo</Label>
                  <p className="text-sm text-gray-600">Permitir login em apenas um dispositivo</p>
                </div>
                <Switch
                  checked={configuracoes.seguranca.loginUnicoDispositivo}
                  onCheckedChange={(checked) => setConfiguracoes({
                    ...configuracoes,
                    seguranca: {...configuracoes.seguranca, loginUnicoDispositivo: checked}
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logout Automático (minutos)</Label>
                <Select 
                  value={configuracoes.seguranca.logoutAutomatico.toString()} 
                  onValueChange={(value) => setConfiguracoes({
                    ...configuracoes,
                    seguranca: {...configuracoes.seguranca, logoutAutomatico: parseInt(value)}
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                    <SelectItem value="0">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Expiração da Senha (dias)</Label>
                <Select 
                  value={configuracoes.seguranca.senhaExpira.toString()} 
                  onValueChange={(value) => setConfiguracoes({
                    ...configuracoes,
                    seguranca: {...configuracoes.seguranca, senhaExpira: parseInt(value)}
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                    <SelectItem value="180">180 dias</SelectItem>
                    <SelectItem value="0">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Canais de Notificação</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-gray-600">Receber notificações no seu email</p>
                  </div>
                  <Switch
                    checked={configuracoes.notificacoes.email}
                    onCheckedChange={(checked) => setConfiguracoes({
                      ...configuracoes,
                      notificacoes: {...configuracoes.notificacoes, email: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-gray-600">Notificações no navegador</p>
                  </div>
                  <Switch
                    checked={configuracoes.notificacoes.push}
                    onCheckedChange={(checked) => setConfiguracoes({
                      ...configuracoes,
                      notificacoes: {...configuracoes.notificacoes, push: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por SMS</Label>
                    <p className="text-sm text-gray-600">Receber SMS para alertas importantes</p>
                  </div>
                  <Switch
                    checked={configuracoes.notificacoes.sms}
                    onCheckedChange={(checked) => setConfiguracoes({
                      ...configuracoes,
                      notificacoes: {...configuracoes.notificacoes, sms: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Desktop</Label>
                    <p className="text-sm text-gray-600">Notificações na área de trabalho</p>
                  </div>
                  <Switch
                    checked={configuracoes.notificacoes.desktop}
                    onCheckedChange={(checked) => setConfiguracoes({
                      ...configuracoes,
                      notificacoes: {...configuracoes.notificacoes, desktop: checked}
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Testes Realizados</p>
                    <p className="text-2xl font-bold">{estatisticasUsuario.testesRealizados}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Certificados</p>
                    <p className="text-2xl font-bold">{estatisticasUsuario.certificadosObtidos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Treinamentos</p>
                    <p className="text-2xl font-bold">{estatisticasUsuario.treinamentosConcluidos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tempo no Sistema:</span>
                  <span className="font-semibold">{estatisticasUsuario.tempoNoSistema}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Último Acesso:</span>
                  <span className="font-semibold">{estatisticasUsuario.ultimoAcesso}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documentos Acessados:</span>
                  <span className="font-semibold">{estatisticasUsuario.documentosAcessados}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zona de Perigo */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
              <CardDescription>
                Ações irreversíveis que afetam sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Excluir Conta</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Esta ação excluirá permanentemente sua conta e todos os dados associados. 
                      Esta ação não pode ser desfeita.
                    </p>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="mt-3"
                      onClick={handleExcluirConta}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Conta
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

