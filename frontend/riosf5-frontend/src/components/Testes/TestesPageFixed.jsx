import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Calendar,
  User,
  Building,
  Award,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Target,
  Brain,
  Zap,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Timer,
  Trophy
} from 'lucide-react'

export default function TestesPageFixed() {
  const [testes, setTestes] = useState([
    {
      id: 1,
      titulo: 'Teste de QI Completo',
      descricao: 'Avaliação completa de inteligência com 40 questões',
      categoria: 'Inteligência',
      tipo: 'QI',
      questoes: 40,
      tempoLimite: 60,
      pontuacaoMinima: 70,
      tentativasPermitidas: 1,
      status: 'Ativo',
      participantes: 156,
      dataCriacao: '2024-01-15',
      certificado: true
    },
    {
      id: 2,
      titulo: 'Avaliação DISC',
      descricao: 'Teste de perfil comportamental DISC',
      categoria: 'Comportamento',
      tipo: 'DISC',
      questoes: 28,
      tempoLimite: 30,
      pontuacaoMinima: 80,
      tentativasPermitidas: 2,
      status: 'Ativo',
      participantes: 89,
      dataCriacao: '2024-02-01',
      certificado: true
    },
    {
      id: 3,
      titulo: 'Teste de Conhecimentos Gerais',
      descricao: 'Avaliação de conhecimentos gerais e cultura',
      categoria: 'Conhecimento',
      tipo: 'Múltipla Escolha',
      questoes: 50,
      tempoLimite: 45,
      pontuacaoMinima: 60,
      tentativasPermitidas: 3,
      status: 'Ativo',
      participantes: 23,
      dataCriacao: '2024-03-01',
      certificado: false
    }
  ])

  const [resultados, setResultados] = useState([
    {
      id: 1,
      testeId: 1,
      usuario: 'João Silva',
      pontuacao: 85,
      tempo: 45,
      status: 'Aprovado',
      data: '2024-03-10',
      tentativa: 1,
      certificadoGerado: true
    },
    {
      id: 2,
      testeId: 2,
      usuario: 'Maria Santos',
      pontuacao: 92,
      tempo: 28,
      status: 'Aprovado',
      data: '2024-03-12',
      tentativa: 1,
      certificadoGerado: true
    },
    {
      id: 3,
      testeId: 1,
      usuario: 'Carlos Oliveira',
      pontuacao: 65,
      tempo: 60,
      status: 'Reprovado',
      data: '2024-03-14',
      tentativa: 1,
      certificadoGerado: false
    }
  ])

  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroCategoria, setFiltroCategoria] = useState('todos')
  const [busca, setBusca] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [abaSelecionada, setAbaSelecionada] = useState('testes')
  const [testeAtivo, setTesteAtivo] = useState(null)
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState({})
  const [tempoRestante, setTempoRestante] = useState(0)
  const [testeIniciado, setTesteIniciado] = useState(false)

  const statusOptions = ['Ativo', 'Inativo', 'Rascunho']
  const categorias = ['Inteligência', 'Comportamento', 'Conhecimento', 'Técnico', 'Segurança']
  const tiposTeste = ['QI', 'DISC', 'Múltipla Escolha', 'Verdadeiro/Falso', 'Dissertativo']

  // Questões de exemplo para os testes
  const questoesTeste = {
    1: [ // Teste de QI
      {
        id: 1,
        pergunta: "Qual é o próximo número na sequência: 2, 4, 8, 16, ?",
        opcoes: ["24", "32", "30", "28"],
        resposta: "32"
      },
      {
        id: 2,
        pergunta: "Se todos os gatos são animais e alguns animais são selvagens, então:",
        opcoes: [
          "Todos os gatos são selvagens",
          "Alguns gatos podem ser selvagens",
          "Nenhum gato é selvagem",
          "Todos os animais são gatos"
        ],
        resposta: "Alguns gatos podem ser selvagens"
      },
      {
        id: 3,
        pergunta: "Complete a analogia: Livro está para Biblioteca assim como Quadro está para:",
        opcoes: ["Museu", "Pintura", "Arte", "Moldura"],
        resposta: "Museu"
      }
    ],
    2: [ // Teste DISC
      {
        id: 1,
        pergunta: "Em uma reunião de trabalho, você prefere:",
        opcoes: [
          "Liderar a discussão e tomar decisões rápidas",
          "Influenciar outros com entusiasmo e ideias criativas",
          "Manter a harmonia e apoiar as decisões do grupo",
          "Analisar dados e apresentar fatos precisos"
        ],
        resposta: null // DISC não tem resposta certa
      },
      {
        id: 2,
        pergunta: "Quando enfrenta um problema, você tende a:",
        opcoes: [
          "Agir rapidamente para resolver",
          "Buscar apoio e opiniões de outros",
          "Seguir procedimentos estabelecidos",
          "Pesquisar e analisar todas as opções"
        ],
        resposta: null
      }
    ],
    3: [ // Conhecimentos Gerais
      {
        id: 1,
        pergunta: "Qual é a capital do Brasil?",
        opcoes: ["São Paulo", "Rio de Janeiro", "Brasília", "Belo Horizonte"],
        resposta: "Brasília"
      },
      {
        id: 2,
        pergunta: "Quem escreveu 'Dom Casmurro'?",
        opcoes: ["José de Alencar", "Machado de Assis", "Clarice Lispector", "Jorge Amado"],
        resposta: "Machado de Assis"
      }
    ]
  }

  useEffect(() => {
    let timer
    if (testeIniciado && tempoRestante > 0) {
      timer = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            finalizarTeste()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [testeIniciado, tempoRestante])

  const testesFiltrados = testes.filter(teste => {
    const matchBusca = teste.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                      teste.descricao.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || teste.status === filtroStatus
    const matchCategoria = filtroCategoria === 'todos' || teste.categoria === filtroCategoria
    
    return matchBusca && matchStatus && matchCategoria
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800'
      case 'Inativo': return 'bg-gray-100 text-gray-800'
      case 'Rascunho': return 'bg-yellow-100 text-yellow-800'
      case 'Aprovado': return 'bg-green-100 text-green-800'
      case 'Reprovado': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ativo': return <CheckCircle className="h-4 w-4" />
      case 'Inativo': return <XCircle className="h-4 w-4" />
      case 'Rascunho': return <Edit className="h-4 w-4" />
      case 'Aprovado': return <CheckCircle className="h-4 w-4" />
      case 'Reprovado': return <XCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'QI': return <Brain className="h-5 w-5" />
      case 'DISC': return <Users className="h-5 w-5" />
      case 'Múltipla Escolha': return <Target className="h-5 w-5" />
      case 'Verdadeiro/Falso': return <CheckCircle className="h-5 w-5" />
      case 'Dissertativo': return <FileText className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const handleIniciarTeste = (teste) => {
    setTesteAtivo(teste)
    setQuestaoAtual(0)
    setRespostas({})
    setTempoRestante(teste.tempoLimite * 60) // converter para segundos
    setTesteIniciado(true)
  }

  const handleResposta = (questaoId, resposta) => {
    setRespostas(prev => ({
      ...prev,
      [questaoId]: resposta
    }))
  }

  const proximaQuestao = () => {
    const questoes = questoesTeste[testeAtivo.id] || []
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(prev => prev + 1)
    } else {
      finalizarTeste()
    }
  }

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(prev => prev - 1)
    }
  }

  const finalizarTeste = () => {
    const questoes = questoesTeste[testeAtivo.id] || []
    let pontuacao = 0
    
    if (testeAtivo.tipo !== 'DISC') {
      // Calcular pontuação para testes com respostas certas
      questoes.forEach(questao => {
        if (respostas[questao.id] === questao.resposta) {
          pontuacao += 1
        }
      })
      pontuacao = Math.round((pontuacao / questoes.length) * 100)
    } else {
      // Para DISC, simular uma pontuação
      pontuacao = 85
    }

    const novoResultado = {
      id: resultados.length + 1,
      testeId: testeAtivo.id,
      usuario: 'Usuário Atual',
      pontuacao,
      tempo: testeAtivo.tempoLimite - Math.floor(tempoRestante / 60),
      status: pontuacao >= testeAtivo.pontuacaoMinima ? 'Aprovado' : 'Reprovado',
      data: new Date().toISOString().split('T')[0],
      tentativa: 1,
      certificadoGerado: pontuacao >= testeAtivo.pontuacaoMinima && testeAtivo.certificado
    }

    setResultados(prev => [...prev, novoResultado])
    setTesteAtivo(null)
    setTesteIniciado(false)
    setAbaSelecionada('resultados')
  }

  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  const calcularTaxaAprovacao = (testeId) => {
    const resultadosTeste = resultados.filter(r => r.testeId === testeId)
    if (resultadosTeste.length === 0) return 0
    const aprovados = resultadosTeste.filter(r => r.status === 'Aprovado').length
    return Math.round((aprovados / resultadosTeste.length) * 100)
  }

  const calcularMediaPontuacao = (testeId) => {
    const resultadosTeste = resultados.filter(r => r.testeId === testeId)
    if (resultadosTeste.length === 0) return 0
    const soma = resultadosTeste.reduce((acc, r) => acc + r.pontuacao, 0)
    return Math.round(soma / resultadosTeste.length)
  }

  // Renderizar interface do teste ativo
  if (testeAtivo && testeIniciado) {
    const questoes = questoesTeste[testeAtivo.id] || []
    const questao = questoes[questaoAtual]

    if (!questao) {
      return (
        <div className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Questões não encontradas para este teste.
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header do Teste */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{testeAtivo.titulo}</h1>
              <p className="text-gray-600">
                Questão {questaoAtual + 1} de {questoes.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {formatarTempo(tempoRestante)}
              </div>
              <div className="text-sm text-gray-600">Tempo restante</div>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((questaoAtual + 1) / questoes.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questão */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {questao.pergunta}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questao.opcoes.map((opcao, index) => (
                <label 
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`questao-${questao.id}`}
                    value={opcao}
                    checked={respostas[questao.id] === opcao}
                    onChange={() => handleResposta(questao.id, opcao)}
                    className="text-blue-600"
                  />
                  <span>{opcao}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navegação */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={questaoAnterior}
            disabled={questaoAtual === 0}
          >
            Anterior
          </Button>
          
          <div className="space-x-2">
            <Button variant="outline" onClick={finalizarTeste}>
              Finalizar Teste
            </Button>
            <Button onClick={proximaQuestao}>
              {questaoAtual === questoes.length - 1 ? 'Finalizar' : 'Próxima'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (mostrarFormulario) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Teste</h1>
            <p className="text-gray-600">Crie um novo teste ou avaliação</p>
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
            <CardTitle>Configuração do Teste</CardTitle>
            <CardDescription>
              Configure as informações e regras do teste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título do Teste</Label>
                <Input
                  id="titulo"
                  placeholder="Digite o título do teste"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
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
                placeholder="Descreva o teste e seus objetivos"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Teste</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposTeste.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="questoes">Número de Questões</Label>
                <Input
                  id="questoes"
                  type="number"
                  placeholder="Ex: 40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tempo">Tempo Limite (min)</Label>
                <Input
                  id="tempo"
                  type="number"
                  placeholder="Ex: 60"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pontuacaoMinima">Pontuação Mínima (%)</Label>
                <Input
                  id="pontuacaoMinima"
                  type="number"
                  placeholder="Ex: 70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tentativas">Tentativas Permitidas</Label>
                <Input
                  id="tentativas"
                  type="number"
                  placeholder="Ex: 1"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="certificado" className="rounded" />
              <Label htmlFor="certificado">Gerar certificado para aprovados</Label>
            </div>

            <div className="flex space-x-4">
              <Button onClick={() => {
                // Simular criação de teste
                const novoTeste = {
                  id: testes.length + 1,
                  titulo: 'Novo Teste',
                  descricao: 'Teste criado pelo usuário',
                  categoria: 'Conhecimento',
                  tipo: 'Múltipla Escolha',
                  questoes: 10,
                  tempoLimite: 30,
                  pontuacaoMinima: 70,
                  tentativasPermitidas: 1,
                  status: 'Ativo',
                  participantes: 0,
                  dataCriacao: new Date().toISOString().split('T')[0],
                  certificado: true
                }
                setTestes(prev => [...prev, novoTeste])
                setMostrarFormulario(false)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Teste
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurações Avançadas
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
          <h1 className="text-3xl font-bold text-gray-900">Testes e Avaliações</h1>
          <p className="text-gray-600">Plataforma completa de testes com certificados</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button onClick={() => setMostrarFormulario(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Teste
          </Button>
        </div>
      </div>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <TabsList>
          <TabsTrigger value="testes">Testes Disponíveis</TabsTrigger>
          <TabsTrigger value="resultados">Resultados</TabsTrigger>
          <TabsTrigger value="certificados">Certificados</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="testes" className="space-y-6">
          {/* Filtros e Busca */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar testes..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos Status</SelectItem>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas Categorias</SelectItem>
                      {categorias.map(categoria => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Testes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testesFiltrados.map((teste) => (
              <Card key={teste.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center">
                        {getTipoIcon(teste.tipo)}
                        <span className="ml-2">{teste.titulo}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {teste.descricao}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(teste.status)}>
                      {getStatusIcon(teste.status)}
                      <span className="ml-1">{teste.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Questões:</span>
                        <div className="font-semibold">{teste.questoes}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Tempo:</span>
                        <div className="font-semibold">{teste.tempoLimite} min</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Mín. Aprovação:</span>
                        <div className="font-semibold">{teste.pontuacaoMinima}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Tentativas:</span>
                        <div className="font-semibold">{teste.tentativasPermitidas}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{teste.participantes} participantes</span>
                      </div>
                      {teste.certificado && (
                        <Badge variant="secondary">
                          <Award className="h-3 w-3 mr-1" />
                          Certificado
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Taxa de Aprovação:</span>
                        <div className="font-semibold text-green-600">
                          {calcularTaxaAprovacao(teste.id)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Média:</span>
                        <div className="font-semibold text-blue-600">
                          {calcularMediaPontuacao(teste.id)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleIniciarTeste(teste)}
                        disabled={teste.status !== 'Ativo'}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Iniciar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados dos Testes</CardTitle>
              <CardDescription>
                Histórico de resultados e desempenho dos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Usuário</th>
                      <th className="text-left p-2">Teste</th>
                      <th className="text-left p-2">Pontuação</th>
                      <th className="text-left p-2">Tempo</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Data</th>
                      <th className="text-left p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((resultado) => {
                      const teste = testes.find(t => t.id === resultado.testeId)
                      return (
                        <tr key={resultado.id} className="border-b">
                          <td className="p-2">{resultado.usuario}</td>
                          <td className="p-2">{teste?.titulo}</td>
                          <td className="p-2">
                            <span className={`font-semibold ${
                              resultado.pontuacao >= (teste?.pontuacaoMinima || 70) 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {resultado.pontuacao}%
                            </span>
                          </td>
                          <td className="p-2">{resultado.tempo} min</td>
                          <td className="p-2">
                            <Badge className={getStatusColor(resultado.status)}>
                              {getStatusIcon(resultado.status)}
                              <span className="ml-1">{resultado.status}</span>
                            </Badge>
                          </td>
                          <td className="p-2">{resultado.data}</td>
                          <td className="p-2">
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {resultado.certificadoGerado && (
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificados" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificados Emitidos</CardTitle>
              <CardDescription>
                Gerenciamento de certificados gerados automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Certificados Disponíveis</h3>
                <p className="text-gray-600 mb-4">
                  Os certificados são gerados automaticamente para usuários aprovados
                </p>
                <Button>
                  <Award className="h-4 w-4 mr-2" />
                  Ver Certificados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Testes</p>
                    <p className="text-2xl font-bold">{testes.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Participantes</p>
                    <p className="text-2xl font-bold">
                      {testes.reduce((acc, teste) => acc + teste.participantes, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Aprovados</p>
                    <p className="text-2xl font-bold">
                      {resultados.filter(r => r.status === 'Aprovado').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Certificados</p>
                    <p className="text-2xl font-bold">
                      {resultados.filter(r => r.certificadoGerado).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

