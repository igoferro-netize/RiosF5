import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Calendar,
  User,
  Car,
  FileText,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Save,
  Camera,
  MapPin,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

export default function ChecklistPage() {
  // --- ESTADOS PRINCIPAIS ---
  const [abaSelecionada, setAbaSelecionada] = useState('checklists')
  const [view, setView] = useState('lista') // 'lista', 'novo_checklist', 'executando_checklist', 'novo_modelo'
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroVeiculo, setFiltroVeiculo] = useState('todos')

  // --- DADOS ---
  const [checklists, setChecklists] = useState([
    { id: 1, titulo: 'Checklist Diário de Veículo', veiculo: 'ABC-1234', motorista: 'João Silva', data: '2024-03-15', status: 'Concluído', itensVerificados: 15, totalItens: 15, observacoes: 'Veículo em perfeitas condições' },
    { id: 2, titulo: 'Inspeção de Segurança', veiculo: 'DEF-5678', motorista: 'Maria Santos', data: '2024-03-14', status: 'Pendente', itensVerificados: 8, totalItens: 12, observacoes: 'Aguardando verificação dos freios' }
  ])

  const [modelos, setModelos] = useState([
    { id: 1, nome: 'Checklist Diário Padrão', categoria: 'Manutenção', itens: [
      { id: 101, nome: 'Nível de Óleo', descricao: 'Verificar vareta de óleo', critico: true },
      { id: 102, nome: 'Luzes e Faróis', descricao: 'Testar todos os comandos', critico: false },
      { id: 103, nome: 'Pneus', descricao: 'Verificar pressão e sulcos', critico: true }
    ], ativo: true, dataCriacao: '2024-01-15' }
  ])

  const veiculos = ['ABC-1234', 'DEF-5678', 'GHI-9012', 'JKL-3456']

  // --- ESTADOS DE FORMULÁRIO ---
  const [novoModelo, setNovoModelo] = useState({ nome: '', descricao: '', itens: [] })
  const [novoItem, setNovoItem] = useState({ nome: '', descricao: '', critico: false })
  const [checklistExecucao, setChecklistExecucao] = useState({
    modeloId: '', veiculo: '', motorista: '', km: '', respostas: [], passo: 0
  })

  // --- FUNÇÕES DE FILTRO ---
  const checklistsFiltrados = checklists.filter(checklist => {
    const matchBusca = checklist.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                      checklist.veiculo.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || checklist.status === filtroStatus
    return matchBusca && matchStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído': return 'bg-green-100 text-green-800'
      case 'Pendente': return 'bg-yellow-100 text-yellow-800'
      case 'Com Problemas': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // --- LÓGICA DE MODELO ---
  const adicionarItemAoModelo = () => {
    if (!novoItem.nome) return
    setNovoModelo({ ...novoModelo, itens: [...novoModelo.itens, { ...novoItem, id: Date.now() }] })
    setNovoItem({ nome: '', descricao: '', critico: false })
  }

  const salvarModelo = () => {
    const modeloFinal = { ...novoModelo, id: Date.now(), ativo: true, dataCriacao: new Date().toISOString().split('T')[0] }
    setModelos([...modelos, modeloFinal])
    setView('lista')
    setAbaSelecionada('modelos')
  }

  // --- LÓGICA DE EXECUÇÃO DE CHECKLIST ---
  const iniciarChecklist = () => {
    const modelo = modelos.find(m => m.id.toString() === checklistExecucao.modeloId)
    if (!modelo) return
    setChecklistExecucao({
      ...checklistExecucao,
      respostas: modelo.itens.map(item => ({ itemId: item.id, status: 'conforme', obs: '' })),
      passo: 1
    })
  }

  const finalizarChecklist = () => {
    const modelo = modelos.find(m => m.id.toString() === checklistExecucao.modeloId)
    const novoCheck = {
      id: Date.now(),
      titulo: modelo.nome,
      veiculo: checklistExecucao.veiculo,
      motorista: checklistExecucao.motorista,
      data: new Date().toISOString().split('T')[0],
      status: 'Concluído',
      itensVerificados: modelo.itens.length,
      totalItens: modelo.itens.length,
      observacoes: 'Checklist realizado via sistema'
    }
    setChecklists([novoCheck, ...checklists])
    setView('lista')
    setAbaSelecionada('checklists')
  }

  // --- RENDERIZAÇÃO DE TELAS ---

  if (view === 'novo_modelo') {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setView('lista')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
          <h1 className="text-2xl font-bold">Criar Novo Modelo</h1>
          <Button onClick={salvarModelo}><Save className="mr-2 h-4 w-4" /> Salvar Modelo</Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Informações do Modelo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Modelo</Label>
              <Input value={novoModelo.nome} onChange={e => setNovoModelo({...novoModelo, nome: e.target.value})} placeholder="Ex: Inspeção Semanal" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={novoModelo.descricao} onChange={e => setNovoModelo({...novoModelo, descricao: e.target.value})} placeholder="Instruções gerais..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Itens de Verificação</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-b pb-4">
              <div className="space-y-2">
                <Label>Nome do Item</Label>
                <Input value={novoItem.nome} onChange={e => setNovoItem({...novoItem, nome: e.target.value})} placeholder="Ex: Freios" />
              </div>
              <div className="space-y-2">
                <Label>Descrição/Instrução</Label>
                <Input value={novoItem.descricao} onChange={e => setNovoItem({...novoItem, descricao: e.target.value})} placeholder="Verificar desgaste..." />
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <Checkbox id="critico" checked={novoItem.critico} onCheckedChange={val => setNovoItem({...novoItem, critico: val})} />
                <Label htmlFor="critico">Item Crítico</Label>
                <Button variant="outline" size="sm" onClick={adicionarItemAoModelo} className="ml-auto"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="space-y-2">
              {novoModelo.itens.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.nome} {item.critico && <Badge variant="destructive" className="ml-2">Crítico</Badge>}</p>
                    <p className="text-sm text-gray-500">{item.descricao}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setNovoModelo({...novoModelo, itens: novoModelo.itens.filter((_, i) => i !== idx)})}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (view === 'executando_checklist') {
    const modelo = modelos.find(m => m.id.toString() === checklistExecucao.modeloId)
    return (
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setView('lista')}><ArrowLeft className="mr-2 h-4 w-4" /> Cancelar</Button>
          <h1 className="text-2xl font-bold">{modelo?.nome}</h1>
          <div className="text-sm font-medium">Passo {checklistExecucao.passo + 1} de 2</div>
        </div>

        {checklistExecucao.passo === 0 ? (
          <Card>
            <CardHeader><CardTitle>Dados Iniciais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Veículo</Label>
                <Select onValueChange={val => setChecklistExecucao({...checklistExecucao, veiculo: val})}>
                  <SelectTrigger><SelectValue placeholder="Selecione o veículo" /></SelectTrigger>
                  <SelectContent>{veiculos.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Motorista</Label>
                <Input value={checklistExecucao.motorista} onChange={e => setChecklistExecucao({...checklistExecucao, motorista: e.target.value})} placeholder="Nome do condutor" />
              </div>
              <div className="space-y-2">
                <Label>KM Atual</Label>
                <Input type="number" value={checklistExecucao.km} onChange={e => setChecklistExecucao({...checklistExecucao, km: e.target.value})} placeholder="00000" />
              </div>
              <Button className="w-full" onClick={iniciarChecklist}>Próximo Passo <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {modelo?.itens.map((item, idx) => (
              <Card key={item.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg">{item.nome}</h3>
                    {item.critico && <Badge variant="destructive">Crítico</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{item.descricao}</p>
                  <RadioGroup 
                    defaultValue="conforme" 
                    className="flex space-x-4"
                    onValueChange={val => {
                      const res = [...checklistExecucao.respostas]
                      res[idx].status = val
                      setChecklistExecucao({...checklistExecucao, respostas: res})
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conforme" id={`c-${idx}`} />
                      <Label htmlFor={`c-${idx}`}>Conforme</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao_conforme" id={`nc-${idx}`} />
                      <Label htmlFor={`nc-${idx}`}>Não Conforme</Label>
                    </div>
                  </RadioGroup>
                  <Input placeholder="Observação (opcional)" onChange={e => {
                    const res = [...checklistExecucao.respostas]
                    res[idx].obs = e.target.value
                    setChecklistExecucao({...checklistExecucao, respostas: res})
                  }} />
                </CardContent>
              </Card>
            ))}
            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1" onClick={() => setChecklistExecucao({...checklistExecucao, passo: 0})}><ChevronLeft className="mr-2 h-4 w-4" /> Voltar</Button>
              <Button className="flex-1" onClick={finalizarChecklist}>Finalizar Checklist <CheckCircle className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CheckList</h1>
          <p className="text-gray-600">Gerencie checklists de veículos e equipamentos</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setView('novo_modelo')} variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Novo Modelo
          </Button>
          <Button onClick={() => {
            setChecklistExecucao({ modeloId: '', veiculo: '', motorista: '', km: '', respostas: [], passo: 0 })
            setView('executando_checklist')
          }}>
            <Plus className="h-4 w-4 mr-2" /> Novo Checklist
          </Button>
        </div>
      </div>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <TabsList>
          <TabsTrigger value="checklists">Checklists Realizados</TabsTrigger>
          <TabsTrigger value="modelos">Modelos</TabsTrigger>
        </TabsList>

        <TabsContent value="checklists" className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Buscar checklists..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-10" />
                </div>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Status</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checklistsFiltrados.map(checklist => (
              <Card key={checklist.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className={getStatusColor(checklist.status)}>{checklist.status}</Badge>
                    <span className="text-sm text-gray-500">{checklist.data}</span>
                  </div>
                  <CardTitle className="text-lg mt-2">{checklist.titulo}</CardTitle>
                  <CardDescription className="flex items-center"><Car className="h-3 w-3 mr-1" /> {checklist.veiculo}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-gray-600 mb-2"><User className="h-3 w-3 mr-1" /> {checklist.motorista}</div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(checklist.itensVerificados/checklist.totalItens)*100}%` }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-500">{checklist.itensVerificados}/{checklist.totalItens} itens</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-2">
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modelos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modelos.map(modelo => (
              <Card key={modelo.id}>
                <CardHeader>
                  <div className="flex justify-between"><Badge variant="outline">{modelo.categoria}</Badge></div>
                  <CardTitle className="text-lg mt-2">{modelo.nome}</CardTitle>
                  <CardDescription>{modelo.itens.length} itens de verificação</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


