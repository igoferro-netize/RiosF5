import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Clock,
  User,
  Building,
  Bell,
  Share,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Users,
  Repeat,
  CalendarDays
} from 'lucide-react'

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // 'month', 'week', 'day'
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [abaSelecionada, setAbaSelecionada] = useState('calendario')

  const [compromissos, setCompromissos] = useState([
    {
      id: 1,
      titulo: 'Reunião de Planejamento',
      descricao: 'Reunião mensal de planejamento estratégico',
      data: '2024-03-15',
      horaInicio: '09:00',
      horaFim: '10:30',
      tipo: 'Reunião',
      prioridade: 'Alta',
      participantes: ['João Silva', 'Maria Santos'],
      local: 'Sala de Reuniões A',
      status: 'Confirmado',
      alertas: ['15 min antes', '1 dia antes'],
      recorrencia: 'Mensal'
    },
    {
      id: 2,
      titulo: 'Treinamento de Segurança',
      descricao: 'Treinamento obrigatório de segurança do trabalho',
      data: '2024-03-16',
      horaInicio: '14:00',
      horaFim: '17:00',
      tipo: 'Treinamento',
      prioridade: 'Média',
      participantes: ['Equipe Operacional'],
      local: 'Auditório Principal',
      status: 'Pendente',
      alertas: ['30 min antes', '2 horas antes'],
      recorrencia: 'Trimestral'
    },
    {
      id: 3,
      titulo: 'Vencimento Certificado ISO',
      descricao: 'Renovação do certificado ISO 9001',
      data: '2024-03-20',
      horaInicio: '08:00',
      horaFim: '08:00',
      tipo: 'Vencimento',
      prioridade: 'Crítica',
      participantes: ['Gestor Qualidade'],
      local: 'Documentos',
      status: 'Alerta',
      alertas: ['7 dias antes', '1 dia antes'],
      recorrencia: 'Anual'
    }
  ])

  const [alertas, setAlertas] = useState([
    {
      id: 1,
      compromissoId: 1,
      tipo: 'Lembrete',
      mensagem: 'Reunião de Planejamento em 15 minutos',
      dataHora: '2024-03-15T08:45:00',
      lido: false
    },
    {
      id: 2,
      compromissoId: 3,
      tipo: 'Vencimento',
      mensagem: 'Certificado ISO vence em 5 dias',
      dataHora: '2024-03-15T08:00:00',
      lido: false
    }
  ])

  const tiposCompromisso = ['Reunião', 'Treinamento', 'Vencimento', 'Evento', 'Tarefa']
  const prioridades = ['Baixa', 'Média', 'Alta', 'Crítica']
  const statusOptions = ['Confirmado', 'Pendente', 'Cancelado', 'Alerta']

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'Crítica': return 'bg-red-100 text-red-800'
      case 'Alta': return 'bg-orange-100 text-orange-800'
      case 'Média': return 'bg-yellow-100 text-yellow-800'
      case 'Baixa': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmado': return 'bg-green-100 text-green-800'
      case 'Pendente': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelado': return 'bg-gray-100 text-gray-800'
      case 'Alerta': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'Reunião': return <Users className="h-4 w-4" />
      case 'Treinamento': return <Calendar className="h-4 w-4" />
      case 'Vencimento': return <AlertTriangle className="h-4 w-4" />
      case 'Evento': return <CalendarDays className="h-4 w-4" />
      case 'Tarefa': return <CheckCircle className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const formatarHora = (hora) => {
    return hora
  }

  const gerarCalendario = () => {
    const ano = currentDate.getFullYear()
    const mes = currentDate.getMonth()
    const primeiroDia = new Date(ano, mes, 1)
    const ultimoDia = new Date(ano, mes + 1, 0)
    const diasNoMes = ultimoDia.getDate()
    const diaSemanaInicio = primeiroDia.getDay()

    const dias = []
    
    // Dias do mês anterior
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      const dia = new Date(ano, mes, -i)
      dias.push({ data: dia, outroMes: true })
    }
    
    // Dias do mês atual
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(ano, mes, dia)
      dias.push({ data, outroMes: false })
    }
    
    // Completar com dias do próximo mês
    const diasRestantes = 42 - dias.length
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const data = new Date(ano, mes + 1, dia)
      dias.push({ data, outroMes: true })
    }
    
    return dias
  }

  const getCompromissosData = (data) => {
    const dataStr = data.toISOString().split('T')[0]
    return compromissos.filter(c => c.data === dataStr)
  }

  const handleNovoCompromisso = () => {
    setMostrarFormulario(true)
  }

  const handleEditarCompromisso = (id) => {
    console.log('Editar compromisso:', id)
    // Implementar edição
  }

  const handleExcluirCompromisso = (id) => {
    if (confirm('Tem certeza que deseja excluir este compromisso?')) {
      setCompromissos(compromissos.filter(c => c.id !== id))
    }
  }

  const handleCompartilharCompromisso = (id) => {
    console.log('Compartilhar compromisso:', id)
    // Implementar compartilhamento
  }

  const handleMarcarLido = (alertaId) => {
    setAlertas(alertas.map(a => 
      a.id === alertaId ? { ...a, lido: true } : a
    ))
  }

  const navegarMes = (direcao) => {
    const novaData = new Date(currentDate)
    novaData.setMonth(currentDate.getMonth() + direcao)
    setCurrentDate(novaData)
  }

  const alertasNaoLidos = alertas.filter(a => !a.lido)

  if (mostrarFormulario) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Compromisso</h1>
            <p className="text-gray-600">Agende um novo compromisso ou evento</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setMostrarFormulario(false)}
          >
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Compromisso</CardTitle>
            <CardDescription>
              Configure as informações do compromisso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Digite o título do compromisso"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCompromisso.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o compromisso"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  defaultValue={selectedDate.toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaInicio">Hora Início</Label>
                <Input
                  id="horaInicio"
                  type="time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaFim">Hora Fim</Label>
                <Input
                  id="horaFim"
                  type="time"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {prioridades.map(prioridade => (
                      <SelectItem key={prioridade} value={prioridade}>
                        {prioridade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  placeholder="Local do compromisso"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="participantes">Participantes</Label>
              <Input
                id="participantes"
                placeholder="Nomes dos participantes (separados por vírgula)"
              />
            </div>

            <div className="flex space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Salvar Compromisso
              </Button>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Configurar Alertas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600">Calendário dinâmico com alertas e compromissos</p>
        </div>
        <div className="flex space-x-2">
          {alertasNaoLidos.length > 0 && (
            <Button variant="outline" className="relative">
              <Bell className="h-4 w-4 mr-2" />
              Alertas
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                {alertasNaoLidos.length}
              </Badge>
            </Button>
          )}
          <Button onClick={handleNovoCompromisso}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Compromisso
          </Button>
        </div>
      </div>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <TabsList>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
          <TabsTrigger value="compromissos">Compromissos</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="calendario" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendário */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => navegarMes(-1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                        Hoje
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navegarMes(1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                      <div key={dia} className="p-2 text-center font-semibold text-gray-600">
                        {dia}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {gerarCalendario().map((item, index) => {
                      const compromissosData = getCompromissosData(item.data)
                      const isToday = item.data.toDateString() === new Date().toDateString()
                      const isSelected = item.data.toDateString() === selectedDate.toDateString()
                      
                      return (
                        <div
                          key={index}
                          className={`p-2 min-h-[80px] border rounded cursor-pointer transition-colors ${
                            item.outroMes 
                              ? 'bg-gray-50 text-gray-400' 
                              : isToday 
                                ? 'bg-blue-100 border-blue-300' 
                                : isSelected
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-white hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedDate(item.data)}
                        >
                          <div className="font-medium text-sm">
                            {item.data.getDate()}
                          </div>
                          <div className="space-y-1 mt-1">
                            {compromissosData.slice(0, 2).map(compromisso => (
                              <div
                                key={compromisso.id}
                                className={`text-xs p-1 rounded truncate ${getPrioridadeColor(compromisso.prioridade)}`}
                              >
                                {compromisso.titulo}
                              </div>
                            ))}
                            {compromissosData.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{compromissosData.length - 2} mais
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Painel Lateral */}
            <div className="space-y-6">
              {/* Compromissos do Dia */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Compromissos - {formatarData(selectedDate)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCompromissosData(selectedDate).map(compromisso => (
                      <div key={compromisso.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{compromisso.titulo}</h4>
                          <Badge className={getPrioridadeColor(compromisso.prioridade)}>
                            {compromisso.prioridade}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatarHora(compromisso.horaInicio)} - {formatarHora(compromisso.horaFim)}
                          </div>
                          {compromisso.local && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {compromisso.local}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {getCompromissosData(selectedDate).length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">
                        Nenhum compromisso para esta data
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Alertas Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Alertas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {alertasNaoLidos.slice(0, 3).map(alerta => (
                      <div key={alerta.id} className="border rounded-lg p-2 bg-yellow-50">
                        <p className="text-sm font-medium">{alerta.mensagem}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(alerta.dataHora).toLocaleString('pt-BR')}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => handleMarcarLido(alerta.id)}
                        >
                          Marcar como lido
                        </Button>
                      </div>
                    ))}
                    {alertasNaoLidos.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">
                        Nenhum alerta pendente
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compromissos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compromissos.map((compromisso) => (
              <Card key={compromisso.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center">
                        {getTipoIcon(compromisso.tipo)}
                        <span className="ml-2">{compromisso.titulo}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {compromisso.descricao}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getPrioridadeColor(compromisso.prioridade)}>
                        {compromisso.prioridade}
                      </Badge>
                      <Badge className={getStatusColor(compromisso.status)}>
                        {compromisso.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatarData(compromisso.data)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatarHora(compromisso.horaInicio)} - {formatarHora(compromisso.horaFim)}
                    </div>
                    {compromisso.local && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {compromisso.local}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {compromisso.participantes.join(', ')}
                    </div>
                    {compromisso.recorrencia && (
                      <div className="flex items-center">
                        <Repeat className="h-4 w-4 mr-2" />
                        {compromisso.recorrencia}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditarCompromisso(compromisso.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCompartilharCompromisso(compromisso.id)}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExcluirCompromisso(compromisso.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Alertas</CardTitle>
              <CardDescription>
                Configure alertas para compromissos e vencimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertas.map((alerta) => {
                  const compromisso = compromissos.find(c => c.id === alerta.compromissoId)
                  return (
                    <div key={alerta.id} className={`border rounded-lg p-4 ${alerta.lido ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{alerta.mensagem}</h4>
                          <p className="text-sm text-gray-600">
                            Compromisso: {compromisso?.titulo}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(alerta.dataHora).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={alerta.lido ? 'secondary' : 'default'}>
                            {alerta.lido ? 'Lido' : 'Não lido'}
                          </Badge>
                          {!alerta.lido && (
                            <Button 
                              size="sm" 
                              onClick={() => handleMarcarLido(alerta.id)}
                            >
                              Marcar como lido
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios da Agenda</CardTitle>
              <CardDescription>
                Gere relatórios sobre compromissos e produtividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Relatório Mensal
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Compromissos por Tipo
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Histórico de Alertas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

