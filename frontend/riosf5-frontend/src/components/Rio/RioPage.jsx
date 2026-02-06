import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog.jsx'
import { 
  Plus, Search, Filter, Waves, Edit, Trash2, Eye, Download, Upload, Calendar, User, MapPin, 
  Droplets, Thermometer, Activity, BarChart3, CheckCircle2, LayoutList, TrendingUp, 
  AlertTriangle, FileText, Share2, BrainCircuit, TowerControl, Printer, FileSpreadsheet, 
  Mail, MessageCircle, Settings, Grid3x3, List, ArrowUpDown, MessageSquare, Image as ImageIcon,
  Users, Clock, AlertCircle, ChevronDown, LineChart
} from 'lucide-react'

export default function RioPage({ initialTab }) {
  const [abaSelecionada, setAbaSelecionada] = useState('relatorios')
  const [dialogNovoEstrategico, setDialogNovoEstrategico] = useState(false)
  const [dialogNovoTemplate, setDialogNovoTemplate] = useState(false)
  const [dialogCompartilhar, setDialogCompartilhar] = useState(false)
  const [dialogTarefa, setDialogTarefa] = useState(false)
  const [dialogComentario, setDialogComentario] = useState(false)
  const [dialogImagem, setDialogImagem] = useState(false)
  const [dialogFiltro, setDialogFiltro] = useState(false)
  const [visualizacao, setVisualizacao] = useState('tabela') // 'tabela' ou 'lista'
  const [ordenacao, setOrdenacao] = useState({ coluna: '', direcao: 'asc' })
  
  // Estados para novo estratégico
  const [titulo, setTitulo] = useState('')
  const [itens, setItens] = useState([])
  const [itemAtual, setItemAtual] = useState({ nome: '', temas: [] })
  
  useEffect(() => {
    if (initialTab === 0) setAbaSelecionada('relatorios')
    if (initialTab === 1) setAbaSelecionada('tarefas')
    if (initialTab === 2) setAbaSelecionada('templates')
  }, [initialTab])

  const estrategicos = [
    { id: 1, titulo: 'Metas Manutenções', item: 'Frota', meta: '95%', realizado: '92%', status: 'em-andamento', tendencia: 'up', prazo: '30/06/2025', responsavel: 'Oscar Maia' },
    { id: 2, titulo: 'Qualidade Hídrica', item: 'Índice de Pureza', meta: '98%', realizado: '99%', status: 'concluido', tendencia: 'up', prazo: '15/05/2025', responsavel: 'Maria Silva' },
    { id: 3, titulo: 'Manutenção Preventiva', item: 'Bombas Estação A', meta: '100%', realizado: '85%', status: 'atrasado', tendencia: 'down', prazo: '20/04/2025', responsavel: 'João Santos' },
    { id: 4, titulo: 'Consumo Energético', item: 'KWh/m³', meta: '0.45', realizado: '0.48', status: 'pendente', tendencia: 'stable', prazo: '31/05/2025', responsavel: 'Ana Costa' }
  ]

  const tarefas = [
    { id: 1, fato: 'Manutenção Preventiva Mar/2025', causa: 'Não foi parado o carro', acao: 'Agendar parada imediata', prazo: '30/06/2025', responsavel: 'Oscar Maia', valor: 'Sem custo', criticidade: 'Alta', status: 'em-andamento', resultado: '', estrategico: 'Metas Manutenções' },
    { id: 2, fato: 'Faturamento fev/25', causa: 'Queda nas vendas', acao: 'Intensificar marketing', prazo: '15/05/2025', responsavel: 'Maria Silva', valor: 'R$ 5.000,00', criticidade: 'Média', status: 'concluido', resultado: 'Meta alcançada', estrategico: 'Qualidade Hídrica' },
    { id: 3, fato: 'Manutenção Corretiva jan/25', causa: 'Falha no equipamento', acao: 'Substituir peça', prazo: '20/04/2025', responsavel: 'João Santos', valor: 'R$ 2.500,00', criticidade: 'Baixa', status: 'atrasado', resultado: '', estrategico: 'Manutenção Preventiva' }
  ]

  const templates = [
    { id: 1, nome: 'Meta Setor Operacional', descricao: 'Template padrão para metas operacionais', itens: 3, dataCriacao: '15/03/2025' },
    { id: 2, nome: 'Metas Manutenções Frota', descricao: 'Controle de manutenções preventivas e corretivas', itens: 3, dataCriacao: '10/03/2025' },
    { id: 3, nome: 'Faturamento Mensal', descricao: 'Acompanhamento de faturamento por período', itens: 5, dataCriacao: '05/03/2025' }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'concluido': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Concluído</Badge>
      case 'em-andamento': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Em Andamento</Badge>
      case 'atrasado': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Atrasado</Badge>
      case 'pendente': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Pendente</Badge>
      case 'nao-iniciado': return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">Não Iniciado</Badge>
      case 'parado': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">Parado</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  const getCriticidadeBadge = (criticidade) => {
    switch (criticidade) {
      case 'Alta': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Alta</Badge>
      case 'Média': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Média</Badge>
      case 'Baixa': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Baixa</Badge>
      default: return <Badge>{criticidade}</Badge>
    }
  }

  const ordenarTabela = (coluna) => {
    const novaDirecao = ordenacao.coluna === coluna && ordenacao.direcao === 'asc' ? 'desc' : 'asc'
    setOrdenacao({ coluna, direcao: novaDirecao })
  }

  const adicionarItem = () => {
    if (itemAtual.nome) {
      setItens([...itens, itemAtual])
      setItemAtual({ nome: '', temas: [] })
    }
  }

  const adicionarTema = (itemIndex) => {
    const novosItens = [...itens]
    novosItens[itemIndex].temas.push({
      tipoTabela: 'mes', // mes, ano, dia
      periodoInicio: '',
      periodoFim: '',
      descricoes: []
    })
    setItens(novosItens)
  }

  const adicionarDescricao = (itemIndex, temaIndex) => {
    const novosItens = [...itens]
    novosItens[itemIndex].temas[temaIndex].descricoes.push({
      descricao: '',
      tipo: 'percentual', // percentual, valor, data
      meta: '',
      valores: {}
    })
    setItens(novosItens)
  }

  // Barra de ferramentas comum para todas as abas
  const BarraFerramentas = () => (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar..." className="pl-10 border-slate-200" />
      </div>
      
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <Button variant="outline" size="sm" onClick={() => setDialogFiltro(true)}>
          <Filter className="h-4 w-4 mr-2" /> Filtros
        </Button>
        
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" /> Imprimir
        </Button>
        
        <Select>
          <SelectTrigger className="w-[140px] h-9">
            <Download className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Exportar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="excel">Excel</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm" onClick={() => setDialogCompartilhar(true)}>
          <Share2 className="h-4 w-4 mr-2" /> Compartilhar
        </Button>
        
        <Button variant="secondary" size="sm" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
          <BrainCircuit className="h-4 w-4 mr-2" /> IA Insights
        </Button>
        
        <Button variant="outline" size="sm" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
          <TowerControl className="h-4 w-4 mr-2" /> Torre de Controle
        </Button>
        
        <Select value={visualizacao} onValueChange={setVisualizacao}>
          <SelectTrigger className="w-[120px] h-9">
            <Settings className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tabela"><Grid3x3 className="h-4 w-4 inline mr-2" />Tabela</SelectItem>
            <SelectItem value="lista"><List className="h-4 w-4 inline mr-2" />Lista</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Waves className="h-8 w-8 text-blue-600" />
            Monitoramento Estratégico
          </h1>
          <p className="text-slate-500">Gestão de indicadores e metas de recursos hídricos</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setDialogNovoEstrategico(true)}>
            <Plus className="h-4 w-4 mr-2" /> Novo Estratégico
          </Button>
          {abaSelecionada === 'templates' && (
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setDialogNovoTemplate(true)}>
              <Plus className="h-4 w-4 mr-2" /> Novo Template
            </Button>
          )}
        </div>
      </div>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-200/50 p-1">
          <TabsTrigger value="relatorios">
            <BarChart3 className="h-4 w-4 mr-2" /> Relatórios
          </TabsTrigger>
          <TabsTrigger value="tarefas">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Tarefas
          </TabsTrigger>
          <TabsTrigger value="templates">
            <LayoutList className="h-4 w-4 mr-2" /> Templates
          </TabsTrigger>
        </TabsList>

        {/* ABA 1: RELATÓRIOS */}
        <TabsContent value="relatorios" className="space-y-6 mt-6">
          {/* Mini Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Total de Estratégicos</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-bold text-slate-800">12</span>
                  <BarChart3 className="h-8 w-8 text-blue-500 opacity-20" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Metas Alcançadas</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-bold text-slate-800">85%</span>
                  <TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Tarefas Pendentes</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-bold text-slate-800">8</span>
                  <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-red-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Itens Críticos</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-bold text-slate-800">2</span>
                  <AlertTriangle className="h-8 w-8 text-red-500 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barra de Ferramentas */}
          <BarraFerramentas />

          {/* Tabela de Relatórios */}
          {visualizacao === 'tabela' ? (
            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('titulo')}>
                        <div className="flex items-center gap-2">
                          Estratégico / Item <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('meta')}>
                        <div className="flex items-center gap-2">
                          Meta <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('realizado')}>
                        <div className="flex items-center gap-2">
                          Realizado <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('prazo')}>
                        <div className="flex items-center gap-2">
                          Prazo <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('responsavel')}>
                        <div className="flex items-center gap-2">
                          Responsável <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('status')}>
                        <div className="flex items-center gap-2">
                          Status <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="p-4 font-semibold text-sm text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {estrategicos.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 cursor-pointer" onClick={() => alert('Abrir gráfico comparativo')}>
                          <div className="font-bold text-slate-800 hover:text-blue-600">{item.titulo}</div>
                          <div className="text-xs text-slate-500">{item.item}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{item.meta}</td>
                        <td className="p-4">
                          <span className={`font-bold ${
                            item.tendencia === 'up' ? 'text-green-600' : 
                            item.tendencia === 'down' ? 'text-red-600' : 
                            'text-slate-600'
                          }`}>
                            {item.realizado}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{item.prazo}</td>
                        <td className="p-4 text-sm text-slate-600">{item.responsavel}</td>
                        <td className="p-4">{getStatusBadge(item.status)}</td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="Visualizar">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600" title="Gráfico">
                              <LineChart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600" onClick={() => setDialogTarefa(true)} title="Tarefa">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600" onClick={() => setDialogComentario(true)} title="Comentário">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600" onClick={() => setDialogImagem(true)} title="Imagem">
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            // Visualização em Lista
            <div className="space-y-4">
              {estrategicos.map((item) => (
                <Card key={item.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-800 cursor-pointer hover:text-blue-600" onClick={() => alert('Abrir gráfico comparativo')}>
                          {item.titulo}
                        </h3>
                        <p className="text-sm text-slate-500">{item.item}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                          <div><span className="text-slate-500">Meta:</span> <span className="font-semibold">{item.meta}</span></div>
                          <div><span className="text-slate-500">Realizado:</span> <span className={`font-semibold ${item.tendencia === 'up' ? 'text-green-600' : item.tendencia === 'down' ? 'text-red-600' : 'text-slate-600'}`}>{item.realizado}</span></div>
                          <div><span className="text-slate-500">Prazo:</span> <span className="font-semibold">{item.prazo}</span></div>
                          <div><span className="text-slate-500">Responsável:</span> <span className="font-semibold">{item.responsavel}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        {getStatusBadge(item.status)}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm"><LineChart className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => setDialogTarefa(true)}><CheckCircle2 className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => setDialogComentario(true)}><MessageSquare className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => setDialogImagem(true)}><ImageIcon className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ABA 2: TAREFAS */}
        <TabsContent value="tarefas" className="space-y-6 mt-6">
          {/* Mini Dashboard Tarefas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Total</p>
                <span className="text-3xl font-bold text-slate-800">18</span>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Concluídas</p>
                <span className="text-3xl font-bold text-slate-800">8</span>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Em Andamento</p>
                <span className="text-3xl font-bold text-slate-800">5</span>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Atrasadas</p>
                <span className="text-3xl font-bold text-slate-800">3</span>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Críticas</p>
                <span className="text-3xl font-bold text-slate-800">2</span>
              </CardContent>
            </Card>
          </div>

          {/* Barra de Ferramentas */}
          <BarraFerramentas />

          {/* Tabela de Tarefas */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('fato')}>
                      <div className="flex items-center gap-2">Fato <ArrowUpDown className="h-4 w-4" /></div>
                    </th>
                    <th className="p-4 font-semibold text-sm">Causa</th>
                    <th className="p-4 font-semibold text-sm">Ação</th>
                    <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('prazo')}>
                      <div className="flex items-center gap-2">Prazo <ArrowUpDown className="h-4 w-4" /></div>
                    </th>
                    <th className="p-4 font-semibold text-sm">Responsável</th>
                    <th className="p-4 font-semibold text-sm">Valor</th>
                    <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('criticidade')}>
                      <div className="flex items-center gap-2">Criticidade <ArrowUpDown className="h-4 w-4" /></div>
                    </th>
                    <th className="p-4 font-semibold text-sm cursor-pointer hover:bg-slate-700" onClick={() => ordenarTabela('status')}>
                      <div className="flex items-center gap-2">Status <ArrowUpDown className="h-4 w-4" /></div>
                    </th>
                    <th className="p-4 font-semibold text-sm">Estratégico</th>
                    <th className="p-4 font-semibold text-sm text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tarefas.map((tarefa) => (
                    <tr key={tarefa.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-800 max-w-[200px]">{tarefa.fato}</td>
                      <td className="p-4 text-sm text-slate-600 max-w-[150px]">{tarefa.causa}</td>
                      <td className="p-4 text-sm text-slate-600 max-w-[200px]">{tarefa.acao}</td>
                      <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{tarefa.prazo}</td>
                      <td className="p-4 text-sm text-slate-600">{tarefa.responsavel}</td>
                      <td className="p-4 text-sm font-medium text-slate-700">{tarefa.valor}</td>
                      <td className="p-4">{getCriticidadeBadge(tarefa.criticidade)}</td>
                      <td className="p-4">{getStatusBadge(tarefa.status)}</td>
                      <td className="p-4 text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => setAbaSelecionada('relatorios')}>
                        {tarefa.estrategico}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600" title="Comentário">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ABA 3: TEMPLATES */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          {/* Mini Dashboard Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-purple-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Templates Disponíveis</p>
                <span className="text-3xl font-bold text-slate-800">{templates.length}</span>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Templates em Uso</p>
                <span className="text-3xl font-bold text-slate-800">8</span>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500 uppercase">Criados Este Mês</p>
                <span className="text-3xl font-bold text-slate-800">2</span>
              </CardContent>
            </Card>
          </div>

          {/* Barra de Ferramentas */}
          <BarraFerramentas />

          {/* Grid de Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="shadow-sm border-slate-200 hover:shadow-lg transition-all hover:border-blue-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {template.nome}
                  </CardTitle>
                  <CardDescription>{template.descricao}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Itens:</span>
                      <span className="font-semibold text-slate-700">{template.itens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Data Criação:</span>
                      <span className="font-semibold text-slate-700">{template.dataCriacao}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="sm">
                      <Eye className="h-4 w-4 mr-2" /> Usar Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOG: NOVO ESTRATÉGICO */}
      <Dialog open={dialogNovoEstrategico} onOpenChange={setDialogNovoEstrategico}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Plus className="h-6 w-6 text-blue-600" />
              Novo Estratégico
            </DialogTitle>
            <DialogDescription>
              Crie um novo estratégico com itens e temas para monitoramento
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Título do Estratégico */}
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-base font-semibold">Título do Estratégico</Label>
              <Input 
                id="titulo" 
                placeholder="Ex: Metas Manutenções, Qualidade Hídrica..." 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* Itens */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Itens</Label>
                <Button variant="outline" size="sm" onClick={adicionarItem}>
                  <Plus className="h-4 w-4 mr-2" /> Novo Item
                </Button>
              </div>

              {/* Item Atual em Edição */}
              {itemAtual.nome || itens.length === 0 ? (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="nomeItem">Nome do Item</Label>
                      <Input 
                        id="nomeItem" 
                        placeholder="Ex: Frota, Bombas, Estação A..."
                        value={itemAtual.nome}
                        onChange={(e) => setItemAtual({...itemAtual, nome: e.target.value})}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold">Temas / Tabelas</Label>
                        <Button variant="secondary" size="sm" onClick={() => adicionarTema(itens.length)}>
                          <Plus className="h-4 w-4 mr-2" /> Novo Tema
                        </Button>
                      </div>

                      {itemAtual.temas.map((tema, temaIndex) => (
                        <Card key={temaIndex} className="bg-white">
                          <CardContent className="pt-4 space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <Label>Tipo de Período</Label>
                                <Select defaultValue="mes">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="dia">Por Dia</SelectItem>
                                    <SelectItem value="mes">Por Mês</SelectItem>
                                    <SelectItem value="ano">Por Ano</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Período Início</Label>
                                <Input type="month" />
                              </div>
                              <div>
                                <Label>Período Fim</Label>
                                <Input type="month" />
                              </div>
                            </div>

                            {/* Descrições/Linhas da Tabela */}
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">Descrições</Label>
                              {tema.descricoes.map((desc, descIndex) => (
                                <div key={descIndex} className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded border">
                                  <Input placeholder="Descrição" className="col-span-1" />
                                  <Select defaultValue="percentual">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="percentual">Percentual (%)</SelectItem>
                                      <SelectItem value="valor">Valor (R$)</SelectItem>
                                      <SelectItem value="data">Data/Período</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input placeholder="Meta" className="col-span-1" />
                                </div>
                              ))}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => adicionarDescricao(itens.length, temaIndex)}
                              >
                                <Plus className="h-4 w-4 mr-2" /> Nova Descrição
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Itens Já Adicionados */}
              {itens.map((item, index) => (
                <Card key={index} className="border-green-200 bg-green-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800">{item.nome}</h4>
                        <p className="text-sm text-slate-500">{item.temas.length} tema(s) configurado(s)</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogNovoEstrategico(false)}>
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              alert('Estratégico criado com sucesso!')
              setDialogNovoEstrategico(false)
            }}>
              Salvar Estratégico
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: NOVO TEMPLATE */}
      <Dialog open={dialogNovoTemplate} onOpenChange={setDialogNovoTemplate}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-600" />
              Novo Template
            </DialogTitle>
            <DialogDescription>
              Crie um template reutilizável para facilitar o lançamento de dados
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="nomeTemplate">Nome do Template</Label>
              <Input id="nomeTemplate" placeholder="Ex: Meta Setor Operacional" />
            </div>
            <div>
              <Label htmlFor="descTemplate">Descrição</Label>
              <Textarea id="descTemplate" placeholder="Descreva o objetivo deste template..." rows={3} />
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-slate-600">Configure os itens e estrutura do template da mesma forma que um estratégico. Este template poderá ser reutilizado na aba Templates.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogNovoTemplate(false)}>Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700">Criar Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: COMPARTILHAR */}
      <Dialog open={dialogCompartilhar} onOpenChange={setDialogCompartilhar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              Compartilhar
            </DialogTitle>
            <DialogDescription>Escolha como deseja compartilhar este conteúdo</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <MessageCircle className="h-8 w-8 text-green-600" />
                <span>WhatsApp</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Mail className="h-8 w-8 text-blue-600" />
                <span>E-mail</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destinatario">Destinatário</Label>
              <Input id="destinatario" placeholder="Digite o contato ou e-mail" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem (opcional)</Label>
              <Textarea id="mensagem" placeholder="Adicione uma mensagem..." rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogCompartilhar(false)}>Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: NOVA TAREFA */}
      <Dialog open={dialogTarefa} onOpenChange={setDialogTarefa}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-orange-600" />
              Nova Tarefa / Plano de Ação
            </DialogTitle>
            <DialogDescription>Crie uma tarefa detalhada com responsáveis e prazos</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fato">Fato</Label>
                <Input id="fato" placeholder="Ex: Manutenção Preventiva Mar/2025" />
              </div>
              <div>
                <Label htmlFor="causa">Causa</Label>
                <Input id="causa" placeholder="Ex: Não foi parado o carro" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="acao">Ação</Label>
              <Textarea id="acao" placeholder="Descreva a ação a ser tomada..." rows={3} />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prazoInicio">Prazo Início</Label>
                <Input id="prazoInicio" type="date" />
              </div>
              <div>
                <Label htmlFor="prazoFim">Prazo Fim</Label>
                <Input id="prazoFim" type="date" />
              </div>
              <div>
                <Label htmlFor="valor">Valor</Label>
                <Input id="valor" placeholder="Ex: R$ 5.000,00 ou Sem custo" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="responsavel">Responsável</Label>
                <Select>
                  <SelectTrigger id="responsavel">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oscar">Oscar Maia</SelectItem>
                    <SelectItem value="maria">Maria Silva</SelectItem>
                    <SelectItem value="joao">João Santos</SelectItem>
                    <SelectItem value="ana">Ana Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="criticidade">Criticidade</Label>
                <Select>
                  <SelectTrigger id="criticidade">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="statusTarefa">Status</Label>
                <Select>
                  <SelectTrigger id="statusTarefa">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao-iniciado">Não Iniciado</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                    <SelectItem value="parado">Parado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="resultado">Resultado</Label>
              <Textarea id="resultado" placeholder="Explicar resultado após conclusão..." rows={3} />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Etapas Adicionais</Label>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Etapa
                </Button>
              </div>
              <p className="text-sm text-slate-500">Adicione etapas quando a tarefa depender de múltiplas ações ou pessoas</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogTarefa(false)}>Cancelar</Button>
            <Button className="bg-orange-600 hover:bg-orange-700">Criar Tarefa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: COMENTÁRIO */}
      <Dialog open={dialogComentario} onOpenChange={setDialogComentario}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Adicionar Comentário
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="comentario">Comentário</Label>
              <Textarea id="comentario" placeholder="Digite seu comentário..." rows={5} />
            </div>
            
            <div>
              <Label>Anexar Arquivo (opcional)</Label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" /> Escolher Arquivo
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogComentario(false)}>Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Salvar Comentário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: INSERIR IMAGEM */}
      <Dialog open={dialogImagem} onOpenChange={setDialogImagem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-indigo-600" />
              Inserir Imagem ou Arquivo
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-2">Clique para fazer upload ou arraste arquivos aqui</p>
              <p className="text-xs text-slate-400">PNG, JPG, PDF, DOC (max. 10MB)</p>
            </div>
            
            <div>
              <Label htmlFor="descricaoImagem">Descrição (opcional)</Label>
              <Input id="descricaoImagem" placeholder="Adicione uma descrição para a imagem..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogImagem(false)}>Cancelar</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Inserir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: FILTRO INTELIGENTE */}
      <Dialog open={dialogFiltro} onOpenChange={setDialogFiltro}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              Filtros Inteligentes
            </DialogTitle>
            <DialogDescription>Refine sua busca com filtros avançados</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Criticidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data Início</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Data Fim</Label>
                <Input type="date" />
              </div>
            </div>
            
            <div>
              <Label>Responsável</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="oscar">Oscar Maia</SelectItem>
                  <SelectItem value="maria">Maria Silva</SelectItem>
                  <SelectItem value="joao">João Santos</SelectItem>
                  <SelectItem value="ana">Ana Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Meta</Label>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Condição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maior">Maior que</SelectItem>
                    <SelectItem value="menor">Menor que</SelectItem>
                    <SelectItem value="igual">Igual a</SelectItem>
                    <SelectItem value="entre">Entre</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Valor" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogFiltro(false)}>Limpar Filtros</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Aplicar Filtros</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
