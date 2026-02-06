import React, { useState } from 'react'
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter,
  Play,
  Clock,
  Users,
  Award,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  ArrowLeft,
  FileText,
  Video,
  Camera
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Switch } from '@/components/ui/switch.jsx'
import VideoPlayerAdvanced from './VideoPlayerAdvanced.jsx'

// Componente Dashboard Card Colorido
const DashboardCard = ({ titulo, valor, icone: Icon, cor, ativo, onClick }) => {
  const coresMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
    orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
    green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
  }

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        ativo ? 'ring-2 ring-blue-500 shadow-md' : ''
      } ${coresMap[cor]}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium">{titulo}</span>
        </div>
      </div>
      <div className="text-3xl font-bold">{valor}</div>
    </div>
  )
}

// Dados simulados para treinamentos
const treinamentosSimulados = [
  {
    id: 1,
    titulo: 'Segurança no Trabalho',
    descricao: 'Curso completo sobre normas de segurança e prevenção de acidentes no ambiente de trabalho.',
    categoria: 'Segurança',
    nivel: 'Básico',
    duracao: '45 min',
    instrutor: 'João Silva',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    imagem: 'https://via.placeholder.com/300x150?text=Segurança+no+Trabalho',
    avaliacao: 4.8,
    totalParticipantes: 156,
    progresso: 92,
    status: 'Ativo',
    configuracoes: {
      reconhecimentoFacial: true,
      certificado: true,
      aproveitamentoMinimo: 80,
      tentativasMaximas: 3,
      testeObrigatorio: true,
      notaMinima: 70
    },
    materiais: [
      { nome: 'Manual de Segurança.pdf', tipo: 'pdf', tamanho: '2.5 MB', url: '#' },
      { nome: 'Checklist de Segurança.xlsx', tipo: 'excel', tamanho: '1.2 MB', url: '#' }
    ]
  },
  {
    id: 2,
    titulo: 'Qualidade e Processos',
    descricao: 'Metodologias de qualidade e otimização de processos organizacionais.',
    categoria: 'Qualidade',
    nivel: 'Intermediário',
    duracao: '60 min',
    instrutor: 'Maria Santos',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    imagem: 'https://via.placeholder.com/300x150?text=Qualidade+e+Processos',
    avaliacao: 4.5,
    totalParticipantes: 89,
    progresso: 65,
    status: 'Ativo',
    configuracoes: {
      reconhecimentoFacial: true,
      certificado: true,
      aproveitamentoMinimo: 75,
      tentativasMaximas: 2,
      testeObrigatorio: true,
      notaMinima: 75
    },
    materiais: [
      { nome: 'Guia de Qualidade.pdf', tipo: 'pdf', tamanho: '3.1 MB', url: '#' }
    ]
  },
  {
    id: 3,
    titulo: 'Integração de Novos Funcionários',
    descricao: 'Programa de integração completo para novos colaboradores.',
    categoria: 'Integração',
    nivel: 'Básico',
    duracao: '30 min',
    instrutor: 'Carlos Oliveira',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    imagem: 'https://via.placeholder.com/300x150?text=Integração+de+Novos+Funcionários',
    avaliacao: 4.9,
    totalParticipantes: 0,
    progresso: 0,
    status: 'Rascunho',
    configuracoes: {
      reconhecimentoFacial: false,
      certificado: false,
      aproveitamentoMinimo: 70,
      tentativasMaximas: 5,
      testeObrigatorio: false,
      notaMinima: 60
    },
    materiais: []
  }
]

export default function TreinamentosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos os Cursos')
  const [dashboardAtivo, setDashboardAtivo] = useState('total')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTreinamento, setSelectedTreinamento] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' ou 'player'
  const [novoTreinamento, setNovoTreinamento] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    nivel: 'Básico',
    duracao: '',
    instrutor: '',
    videoUrl: '',
    configuracoes: {
      reconhecimentoFacial: true,
      certificado: true,
      aproveitamentoMinimo: 80,
      tentativasMaximas: 3,
      testeObrigatorio: true,
      notaMinima: 70
    }
  })

  const filteredTreinamentos = treinamentosSimulados.filter(treinamento => {
    const matchesSearch = treinamento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treinamento.instrutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treinamento.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = activeFilter === 'Todos os Cursos' || 
                         (activeFilter === 'Ativos' && treinamento.status === 'Ativo') ||
                         (activeFilter === 'Em Andamento' && treinamento.progresso > 0 && treinamento.progresso < 100) ||
                         (activeFilter === 'Concluídos' && treinamento.progresso === 100) ||
                         (activeFilter === 'Rascunhos' && treinamento.status === 'Rascunho')
    
    return matchesSearch && matchesFilter
  })

  const metricas = {
    total: treinamentosSimulados.length,
    ativos: treinamentosSimulados.filter(t => t.status === 'Ativo').length,
    andamento: treinamentosSimulados.filter(t => t.progresso > 0 && t.progresso < 100).length,
    rascunhos: treinamentosSimulados.filter(t => t.status === 'Rascunho').length
  }

  const handleClickDashboard = (tipo) => {
    setDashboardAtivo(tipo)
    setActiveFilter(tipo === 'total' ? 'Todos os Cursos' :
                   tipo === 'ativos' ? 'Ativos' :
                   tipo === 'andamento' ? 'Em Andamento' :
                   tipo === 'rascunhos' ? 'Rascunhos' : 'Todos os Cursos')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800'
      case 'Rascunho': return 'bg-yellow-100 text-yellow-800'
      case 'Inativo': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleNovoTreinamento = () => {
    setIsModalOpen(true)
  }

  const handleSalvarTreinamento = () => {
    console.log('Salvando treinamento:', novoTreinamento)
    setIsModalOpen(false)
    setNovoTreinamento({
      titulo: '',
      descricao: '',
      categoria: '',
      nivel: 'Básico',
      duracao: '',
      instrutor: '',
      videoUrl: '',
      configuracoes: {
        reconhecimentoFacial: true,
        certificado: true,
        aproveitamentoMinimo: 80,
        tentativasMaximas: 3,
        testeObrigatorio: true,
        notaMinima: 70
      }
    })
  }

  const handleAssistirTreinamento = (treinamento) => {
    setSelectedTreinamento(treinamento)
    setViewMode('player')
  }

  const handleVoltarLista = () => {
    setViewMode('list')
    setSelectedTreinamento(null)
  }

  const handleProgressoTreinamento = (progresso) => {
    console.log('Progresso do treinamento:', progresso)
  }

  const handleConcluirTreinamento = (resultado) => {
    console.log('Treinamento concluído:', resultado)
    // Aqui salvaria o resultado no backend
  }

  if (viewMode === 'player' && selectedTreinamento) {
    return (
      <div className="p-6 space-y-6">
        {/* Header do Player */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleVoltarLista}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Treinamentos
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{selectedTreinamento.titulo}</h1>
              <p className="text-slate-600">Instrutor: {selectedTreinamento.instrutor}</p>
            </div>
          </div>
        </div>

        {/* Player de Vídeo Avançado */}
        <VideoPlayerAdvanced
          videoUrl={selectedTreinamento.videoUrl}
          treinamento={selectedTreinamento}
          onProgress={handleProgressoTreinamento}
          onComplete={handleConcluirTreinamento}
          enableFaceRecognition={selectedTreinamento.configuracoes.reconhecimentoFacial}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestão de Treinamentos</h1>
          <p className="text-slate-600 mt-1">Gerencie treinamentos, vídeos e certificações</p>
        </div>
        <Button onClick={handleNovoTreinamento} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Treinamento
        </Button>
      </div>

      {/* Dashboard Colorido */}
      <div className="grid grid-cols-4 gap-4">
        <DashboardCard
          titulo="Total"
          valor={metricas.total}
          icone={GraduationCap}
          cor="blue"
          ativo={dashboardAtivo === 'total'}
          onClick={() => handleClickDashboard('total')}
        />
        <DashboardCard
          titulo="Ativos"
          valor={metricas.ativos}
          icone={Play}
          cor="green"
          ativo={dashboardAtivo === 'ativos'}
          onClick={() => handleClickDashboard('ativos')}
        />
        <DashboardCard
          titulo="Em Andamento"
          valor={metricas.andamento}
          icone={Clock}
          cor="yellow"
          ativo={dashboardAtivo === 'andamento'}
          onClick={() => handleClickDashboard('andamento')}
        />
        <DashboardCard
          titulo="Rascunhos"
          valor={metricas.rascunhos}
          icone={FileText}
          cor="orange"
          ativo={dashboardAtivo === 'rascunhos'}
          onClick={() => handleClickDashboard('rascunhos')}
        />
      </div>

      {/* Abas de Filtro + Busca na mesma linha */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          {['Todos os Cursos', 'Ativos', 'Em Andamento', 'Concluídos', 'Rascunhos'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeFilter === filter
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 text-base"
          />
        </div>
      </div>

      {/* Lista de Treinamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTreinamentos.map((treinamento) => (
          <Card 
            key={treinamento.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleAssistirTreinamento(treinamento)}
          >
            <div className="relative">
              <img
                src={treinamento.imagem}
                alt={treinamento.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={getStatusColor(treinamento.status)}>
                  {treinamento.status}
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                <Clock className="w-3 h-3 inline mr-1" />
                {treinamento.duracao}
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{treinamento.titulo}</CardTitle>
                  <CardDescription className="mt-1">
                    {treinamento.descricao}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-500 mt-2">
                <span>Instrutor: {treinamento.instrutor}</span>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {treinamento.totalParticipantes}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progresso Geral</span>
                  <span>{treinamento.progresso}% concluído</span>
                </div>
                <Progress value={treinamento.progresso} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{treinamento.categoria}</Badge>
                    <Badge variant="outline">{treinamento.nivel}</Badge>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Award className="w-4 h-4 mr-1" />
                    {treinamento.avaliacao}
                  </div>
                </div>

                {/* Indicadores de Funcionalidades */}
                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  {treinamento.configuracoes.reconhecimentoFacial && (
                    <div className="flex items-center">
                      <Camera className="w-3 h-3 mr-1" />
                      Reconhecimento Facial
                    </div>
                  )}
                  {treinamento.configuracoes.certificado && (
                    <div className="flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      Certificado
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAssistirTreinamento(treinamento)
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Assistir
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Novo Treinamento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Treinamento</DialogTitle>
            <DialogDescription>
              Configure um novo treinamento com vídeo, regras e certificação
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Treinamento</Label>
                  <Input
                    id="titulo"
                    value={novoTreinamento.titulo}
                    onChange={(e) => setNovoTreinamento({...novoTreinamento, titulo: e.target.value})}
                    placeholder="Ex: Segurança no Trabalho"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={novoTreinamento.categoria}
                    onValueChange={(value) => setNovoTreinamento({...novoTreinamento, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Segurança">Segurança</SelectItem>
                      <SelectItem value="Qualidade">Qualidade</SelectItem>
                      <SelectItem value="Integração">Integração</SelectItem>
                      <SelectItem value="Técnico">Técnico</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novoTreinamento.descricao}
                  onChange={(e) => setNovoTreinamento({...novoTreinamento, descricao: e.target.value})}
                  placeholder="Descreva o conteúdo e objetivos do treinamento..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instrutor">Instrutor</Label>
                  <Input
                    id="instrutor"
                    value={novoTreinamento.instrutor}
                    onChange={(e) => setNovoTreinamento({...novoTreinamento, instrutor: e.target.value})}
                    placeholder="Nome do instrutor"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração</Label>
                  <Input
                    id="duracao"
                    value={novoTreinamento.duracao}
                    onChange={(e) => setNovoTreinamento({...novoTreinamento, duracao: e.target.value})}
                    placeholder="Ex: 45 min"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nivel">Nível</Label>
                  <Select
                    value={novoTreinamento.nivel}
                    onValueChange={(value) => setNovoTreinamento({...novoTreinamento, nivel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Básico">Básico</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL do Vídeo</Label>
                <Input
                  id="videoUrl"
                  value={novoTreinamento.videoUrl}
                  onChange={(e) => setNovoTreinamento({...novoTreinamento, videoUrl: e.target.value})}
                  placeholder="https://exemplo.com/video.mp4"
                />
                <p className="text-xs text-slate-500">
                  Ou use o botão abaixo para fazer upload de um arquivo
                </p>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer Upload do Vídeo
                </Button>
              </div>
            </div>

            {/* Configurações de Aproveitamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Regras de Aproveitamento</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Aproveitamento Mínimo (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={novoTreinamento.configuracoes.aproveitamentoMinimo}
                    onChange={(e) => setNovoTreinamento({
                      ...novoTreinamento,
                      configuracoes: {
                        ...novoTreinamento.configuracoes,
                        aproveitamentoMinimo: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tentativas Máximas</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={novoTreinamento.configuracoes.tentativasMaximas}
                    onChange={(e) => setNovoTreinamento({
                      ...novoTreinamento,
                      configuracoes: {
                        ...novoTreinamento.configuracoes,
                        tentativasMaximas: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reconhecimento Facial</Label>
                    <p className="text-sm text-slate-500">Monitorar atenção durante o vídeo</p>
                  </div>
                  <Switch
                    checked={novoTreinamento.configuracoes.reconhecimentoFacial}
                    onCheckedChange={(checked) => setNovoTreinamento({
                      ...novoTreinamento,
                      configuracoes: {
                        ...novoTreinamento.configuracoes,
                        reconhecimentoFacial: checked
                      }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Teste Obrigatório</Label>
                    <p className="text-sm text-slate-500">Exigir teste para obter certificado</p>
                  </div>
                  <Switch
                    checked={novoTreinamento.configuracoes.testeObrigatorio}
                    onCheckedChange={(checked) => setNovoTreinamento({
                      ...novoTreinamento,
                      configuracoes: {
                        ...novoTreinamento.configuracoes,
                        testeObrigatorio: checked
                      }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Gerar Certificado</Label>
                    <p className="text-sm text-slate-500">Emitir certificado após conclusão</p>
                  </div>
                  <Switch
                    checked={novoTreinamento.configuracoes.certificado}
                    onCheckedChange={(checked) => setNovoTreinamento({
                      ...novoTreinamento,
                      configuracoes: {
                        ...novoTreinamento.configuracoes,
                        certificado: checked
                      }
                    })}
                  />
                </div>

                {novoTreinamento.configuracoes.testeObrigatorio && (
                  <div className="space-y-2">
                    <Label>Nota Mínima para Aprovação (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={novoTreinamento.configuracoes.notaMinima}
                      onChange={(e) => setNovoTreinamento({
                        ...novoTreinamento,
                        configuracoes: {
                          ...novoTreinamento.configuracoes,
                          notaMinima: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Materiais de Apoio */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Materiais de Apoio</h3>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Adicionar Material de Apoio
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarTreinamento} className="bg-blue-600 hover:bg-blue-700">
              Criar Treinamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

