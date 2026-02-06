import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'

import TesteQI from './TesteQI.jsx'
import TesteDISC from './TesteDISC.jsx'

import {
  Plus,
  Search,
  FileText,
  Edit,
  Trash2,
  Eye,
  Download,
  Award,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Target,
  Brain,
  Play,
  RotateCcw,
  Clock
} from 'lucide-react'

/**
 * Runner genérico para “testes criados”
 * - Suporta: Múltipla Escolha, Verdadeiro/Falso, Dissertativa
 * - Tempo opcional
 * - Calcula % apenas das questões objetivas (MC e VF). Dissertativa fica como “não avaliada”.
 */
function RealizarTesteGenerico({ teste, onVoltar, onSalvarResultado }) {
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState({})
  const [tempoRestante, setTempoRestante] = useState(() =>
    teste.temControle ? (Number(teste.tempoLimite || 0) * 60) : 0
  )

  const questoes = teste.questoesDetalhadas || []

  useEffect(() => {
    if (!teste.temControle) return
    if (tempoRestante <= 0) return

    const t = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          // Auto-finaliza
          finalizar()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teste.temControle, tempoRestante])

  const formatarTempo = (segundos) => {
    const m = Math.floor(segundos / 60)
    const s = segundos % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const setResposta = (questaoId, valor) => {
    setRespostas(prev => ({ ...prev, [questaoId]: valor }))
  }

  const finalizar = () => {
    const objetivas = questoes.filter(q => q.tipo !== 'Dissertativa')
    let acertos = 0
    let erros = 0

    const respostasDetalhadas = questoes.map(q => {
      const resp = respostas[q.id]
      let correto = null

      if (q.tipo !== 'Dissertativa') {
        correto = resp === q.respostaCorreta
        if (correto) acertos++
        else erros++
      }

      return {
        questaoId: q.id,
        pergunta: q.pergunta,
        tipo: q.tipo,
        respostaUsuario: resp ?? '',
        respostaCorreta: q.respostaCorreta ?? '',
        correto,
        explicacao: q.explicacao || ''
      }
    })

    const pontuacao = objetivas.length > 0 ? Math.round((acertos / objetivas.length) * 100) : 0
    const status = pontuacao >= Number(teste.pontuacaoMinima || 0) ? 'Aprovado' : 'Reprovado'

    const resultado = {
      testeId: teste.id,
      testeTitulo: teste.titulo,
      usuario: 'Usuário Atual',
      pontuacao,
      acertos,
      erros,
      totalObjetivas: objetivas.length,
      totalQuestoes: questoes.length,
      status,
      data: new Date().toISOString().split('T')[0],
      tempoMin: teste.temControle ? (Number(teste.tempoLimite) - Math.floor(tempoRestante / 60)) : null,
      certificadoGerado: status === 'Aprovado' && !!teste.certificado,
      declaracaoGerada: !!teste.declaracao,
      respostasDetalhadas
    }

    onSalvarResultado(resultado)
  }

  const q = questoes[questaoAtual]
  if (!q) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Este teste não possui questões configuradas.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={onVoltar}>Voltar</Button>
        </div>
      </div>
    )
  }

  const progresso = Math.round(((questaoAtual + 1) / questoes.length) * 100)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{teste.titulo}</h1>
          <p className="text-gray-600">Questão {questaoAtual + 1} de {questoes.length}</p>
          {teste.instrucoes && (
            <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">{teste.instrucoes}</p>
          )}
        </div>

        {teste.temControle && (
          <div className="text-right">
            <div className={`text-2xl font-bold ${tempoRestante < 300 ? 'text-red-600' : 'text-blue-600'}`}>
              <Clock className="inline h-5 w-5 mr-2" />
              {formatarTempo(tempoRestante)}
            </div>
            <div className="text-sm text-gray-600">Tempo restante</div>
          </div>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progresso}%` }} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{q.pergunta}</CardTitle>
          <CardDescription>Tipo: {q.tipo}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.tipo === 'Múltipla Escolha' && (q.opcoes || []).filter(Boolean).map((op, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={respostas[q.id] === op}
                onChange={() => setResposta(q.id, op)}
              />
              <span>{op}</span>
            </label>
          ))}

          {q.tipo === 'Verdadeiro/Falso' && ['Verdadeiro', 'Falso'].map((op) => (
            <label key={op} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={respostas[q.id] === op}
                onChange={() => setResposta(q.id, op)}
              />
              <span>{op}</span>
            </label>
          ))}

          {q.tipo === 'Dissertativa' && (
            <Textarea
              rows={6}
              value={respostas[q.id] || ''}
              onChange={(e) => setResposta(q.id, e.target.value)}
              placeholder="Digite sua resposta..."
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={questaoAtual === 0}
          onClick={() => setQuestaoAtual(v => Math.max(0, v - 1))}
        >
          Anterior
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={finalizar}>
            Finalizar
          </Button>
          <Button
            onClick={() => {
              if (questaoAtual < questoes.length - 1) setQuestaoAtual(v => v + 1)
              else finalizar()
            }}
          >
            {questaoAtual === questoes.length - 1 ? 'Concluir' : 'Próxima'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function TestesPage() {
  const [testes, setTestes] = useState([
    {
      id: 1,
      titulo: 'Teste de QI Completo',
      descricao: 'Avaliação completa de inteligência',
      categoria: 'Inteligência',
      tipo: 'QI',
      tempoLimite: 60,
      temControle: true,
      pontuacaoMinima: 70,
      tentativasPermitidas: 1,
      status: 'Ativo',
      participantes: 156,
      dataCriacao: '2024-01-15',
      certificado: true,
      declaracao: false,
      instrucoes: 'Responda com atenção. Você pode navegar entre questões.'
    },
    {
      id: 2,
      titulo: 'Avaliação DISC',
      descricao: 'Teste de perfil comportamental DISC',
      categoria: 'Comportamento',
      tipo: 'DISC',
      tempoLimite: 30,
      temControle: false,
      pontuacaoMinima: 0,
      tentativasPermitidas: 1,
      status: 'Ativo',
      participantes: 89,
      dataCriacao: '2024-02-01',
      certificado: true,
      declaracao: true,
      instrucoes: 'Responda conforme você age no dia a dia.'
    }
  ])

  const [resultados, setResultados] = useState([])

  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroCategoria, setFiltroCategoria] = useState('todos')
  const [busca, setBusca] = useState('')
  const [abaSelecionada, setAbaSelecionada] = useState('testes')

  // “roteamento interno” (sem react-router)
  const [tela, setTela] = useState('lista') // lista | form | qi | disc | generico | resultado
  const [testeSelecionado, setTesteSelecionado] = useState(null)
  const [resultadoAtual, setResultadoAtual] = useState(null)

  // Form de criação/edição
  const [modoEdicao, setModoEdicao] = useState(false)
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    tipo: 'Múltipla Escolha',
    status: 'Rascunho',
    tentativasPermitidas: 1,
    temControle: true,
    tempoLimite: 30,
    pontuacaoMinima: 70,
    certificado: true,
    declaracao: false,
    modeloCertificado: 'padrao',
    instrucoes: '',
    materialApoio: '',
    questoesDetalhadas: []
  })

  // Form de questão
  const [qForm, setQForm] = useState({
    pergunta: '',
    tipo: 'Múltipla Escolha',
    opcoes: ['', '', '', ''],
    respostaCorreta: '',
    explicacao: ''
  })

  const statusOptions = ['Ativo', 'Inativo', 'Rascunho']
  const categorias = ['Inteligência', 'Comportamento', 'Conhecimento', 'Técnico', 'Segurança']
  const tiposTeste = ['QI', 'DISC', 'Múltipla Escolha', 'Verdadeiro/Falso', 'Dissertativa']

  const testesFiltrados = useMemo(() => {
    return testes.filter(teste => {
      const matchBusca =
        teste.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        (teste.descricao || '').toLowerCase().includes(busca.toLowerCase())
      const matchStatus = filtroStatus === 'todos' || teste.status === filtroStatus
      const matchCategoria = filtroCategoria === 'todos' || teste.categoria === filtroCategoria
      return matchBusca && matchStatus && matchCategoria
    })
  }, [testes, busca, filtroStatus, filtroCategoria])

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
      case 'Dissertativa': return <FileText className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const calcularTaxaAprovacao = (testeId) => {
    const r = resultados.filter(x => x.testeId === testeId)
    if (r.length === 0) return 0
    return Math.round((r.filter(x => x.status === 'Aprovado').length / r.length) * 100)
  }

  const calcularMediaPontuacao = (testeId) => {
    const r = resultados.filter(x => x.testeId === testeId)
    if (r.length === 0) return 0
    return Math.round(r.reduce((acc, v) => acc + (v.pontuacao || 0), 0) / r.length)
  }

  // ======= AÇÕES PRINCIPAIS =======

  const abrirCriacao = () => {
    setModoEdicao(false)
    setForm({
      titulo: '',
      descricao: '',
      categoria: '',
      tipo: 'Múltipla Escolha',
      status: 'Rascunho',
      tentativasPermitidas: 1,
      temControle: true,
      tempoLimite: 30,
      pontuacaoMinima: 70,
      certificado: true,
      declaracao: false,
      modeloCertificado: 'padrao',
      instrucoes: '',
      materialApoio: '',
      questoesDetalhadas: []
    })
    setQForm({
      pergunta: '',
      tipo: 'Múltipla Escolha',
      opcoes: ['', '', '', ''],
      respostaCorreta: '',
      explicacao: ''
    })
    setTela('form')
  }

  const abrirEdicao = (teste) => {
    setModoEdicao(true)
    setTesteSelecionado(teste)
    setForm({
      ...teste,
      questoesDetalhadas: teste.questoesDetalhadas || []
    })
    setTela('form')
  }

  const salvarTeste = () => {
    if (!form.titulo || !form.categoria) {
      alert('Preencha Título e Categoria.')
      return
    }
    // se não for QI/DISC, exige ao menos 1 questão criada
    if (!['QI', 'DISC'].includes(form.tipo) && (form.questoesDetalhadas || []).length === 0) {
      alert('Adicione pelo menos 1 questão (para testes criados).')
      return
    }

    if (modoEdicao && testeSelecionado) {
      setTestes(prev => prev.map(t => t.id === testeSelecionado.id ? { ...form, id: testeSelecionado.id } : t))
    } else {
      const novo = {
        ...form,
        id: (testes.reduce((m, t) => Math.max(m, t.id), 0) + 1),
        participantes: 0,
        dataCriacao: new Date().toISOString().split('T')[0]
      }
      setTestes(prev => [...prev, novo])
    }

    setTela('lista')
    setAbaSelecionada('testes')
  }

  const excluirTeste = (id) => {
    if (!confirm('Tem certeza que deseja excluir este teste?')) return
    setTestes(prev => prev.filter(t => t.id !== id))
  }

  const iniciarTeste = (teste) => {
    setTesteSelecionado(teste)

    if (teste.tipo === 'QI') setTela('qi')
    else if (teste.tipo === 'DISC') setTela('disc')
    else setTela('generico')
  }

  const salvarResultado = (resultado) => {
    const novo = { ...resultado, id: (resultados.length + 1), tentativa: 1 }
    setResultados(prev => [...prev, novo])
    setResultadoAtual(novo)
    setTela('resultado')
    setAbaSelecionada('resultados')
  }

  const gerarCertificadoOuDeclaracao = () => {
    // aqui você liga na sua API para gerar PDF etc.
    alert('Aqui você conecta na geração real do PDF (certificado/declaração).')
  }

  // ======= QUESTÕES DO FORM =======
  const addQuestao = () => {
    if (!qForm.pergunta) {
      alert('Digite a pergunta.')
      return
    }

    if (qForm.tipo === 'Múltipla Escolha') {
      const ops = (qForm.opcoes || []).filter(Boolean)
      if (ops.length < 2) {
        alert('Adicione pelo menos 2 opções.')
        return
      }
      if (!qForm.respostaCorreta) {
        alert('Selecione a resposta correta.')
        return
      }
    }

    if (qForm.tipo === 'Verdadeiro/Falso') {
      if (!qForm.respostaCorreta) {
        alert('Selecione a resposta correta (Verdadeiro/Falso).')
        return
      }
    }

    const nova = {
      id: (form.questoesDetalhadas?.length || 0) + 1,
      pergunta: qForm.pergunta,
      tipo: qForm.tipo,
      opcoes: qForm.tipo === 'Múltipla Escolha' ? qForm.opcoes : [],
      respostaCorreta: qForm.tipo === 'Dissertativa' ? '' : qForm.respostaCorreta,
      explicacao: qForm.explicacao || ''
    }

    setForm(prev => ({
      ...prev,
      questoesDetalhadas: [...(prev.questoesDetalhadas || []), nova]
    }))

    setQForm({
      pergunta: '',
      tipo: 'Múltipla Escolha',
      opcoes: ['', '', '', ''],
      respostaCorreta: '',
      explicacao: ''
    })
  }

  const removerQuestao = (id) => {
    setForm(prev => ({
      ...prev,
      questoesDetalhadas: (prev.questoesDetalhadas || []).filter(q => q.id !== id)
    }))
  }

  // ======= TELAS =======

  if (tela === 'qi') {
    return (
      <TesteQI
        onVoltar={() => setTela('lista')}
        onConcluir={(res) => {
          // transforma o resultado do TesteQI no padrão de “resultado”
          salvarResultado({
            testeId: testeSelecionado.id,
            testeTitulo: testeSelecionado.titulo,
            usuario: 'Usuário Atual',
            pontuacao: res.porcentagem,
            acertos: res.acertos,
            erros: (res.total - res.acertos),
            status: res.porcentagem >= testeSelecionado.pontuacaoMinima ? 'Aprovado' : 'Reprovado',
            data: new Date().toISOString().split('T')[0],
            tempoMin: res.tempoGasto ?? null,
            certificadoGerado: (res.porcentagem >= testeSelecionado.pontuacaoMinima) && !!testeSelecionado.certificado,
            declaracaoGerada: !!testeSelecionado.declaracao,
            respostasDetalhadas: [] // seu TesteQI hoje não expõe detalhado; se quiser, eu adapto
          })
        }}
      />
    )
  }

  if (tela === 'disc') {
    return (
      <TesteDISC
        onVoltar={() => setTela('lista')}
        onConcluir={(res) => {
          // DISC não é “certo/errado”, então pontuação pode ser 100 e status aprovado sempre (ou regra sua)
          salvarResultado({
            testeId: testeSelecionado.id,
            testeTitulo: testeSelecionado.titulo,
            usuario: 'Usuário Atual',
            pontuacao: 100,
            acertos: null,
            erros: null,
            status: 'Concluído',
            data: new Date().toISOString().split('T')[0],
            tempoMin: null,
            certificadoGerado: !!testeSelecionado.certificado,
            declaracaoGerada: !!testeSelecionado.declaracao,
            respostasDetalhadas: []
          })
        }}
      />
    )
  }

  if (tela === 'generico') {
    return (
      <RealizarTesteGenerico
        teste={testeSelecionado}
        onVoltar={() => setTela('lista')}
        onSalvarResultado={salvarResultado}
      />
    )
  }

  if (tela === 'resultado' && resultadoAtual) {
    const aprovado = resultadoAtual.status === 'Aprovado'
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <Card className={`border ${aprovado ? 'border-green-300' : 'border-red-300'}`}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {aprovado ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-red-600" />}
              {resultadoAtual.status}
            </CardTitle>
            <CardDescription>{resultadoAtual.testeTitulo}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-600">Pontuação</div>
                <div className="text-2xl font-bold">{resultadoAtual.pontuacao ?? '-'}%</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-600">Acertos</div>
                <div className="text-2xl font-bold">{resultadoAtual.acertos ?? '-'}</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-600">Erros</div>
                <div className="text-2xl font-bold">{resultadoAtual.erros ?? '-'}</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-600">Tempo</div>
                <div className="text-2xl font-bold">{resultadoAtual.tempoMin ?? '-'} min</div>
              </div>
            </div>

            {(resultadoAtual.respostasDetalhadas || []).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Relatório de Questões</CardTitle>
                  <CardDescription>Mostra o que você respondeu e o gabarito</CardDescription>
                </CardHeader>
                <CardContent className="max-h-80 overflow-auto space-y-3">
                  {resultadoAtual.respostasDetalhadas.map((r, idx) => (
                    <div key={idx} className="border rounded p-3">
                      <div className="font-semibold">{idx + 1}. {r.pergunta}</div>
                      <div className="text-sm mt-2">
                        <div><span className="font-medium">Sua resposta:</span> {r.respostaUsuario || '—'}</div>
                        {r.correto === false && (
                          <div><span className="font-medium">Correta:</span> {r.respostaCorreta}</div>
                        )}
                        {r.correto === true && <div className="text-green-600 font-medium">Correta</div>}
                        {r.correto === null && <div className="text-gray-600">Não avaliada automaticamente (dissertativa)</div>}
                        {r.explicacao && <div className="text-gray-600 mt-2"><span className="font-medium">Explicação:</span> {r.explicacao}</div>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap gap-2">
              {(resultadoAtual.certificadoGerado || resultadoAtual.declaracaoGerada) && (
                <Button onClick={gerarCertificadoOuDeclaracao}>
                  <Award className="h-4 w-4 mr-2" />
                  Baixar Certificado/Declaração
                </Button>
              )}
              <Button variant="outline" onClick={() => { setTela('lista'); setAbaSelecionada('testes') }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Fazer outro teste
              </Button>
              <Button variant="outline" onClick={abrirCriacao}>
                <Plus className="h-4 w-4 mr-2" />
                Criar novo teste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ======= FORMULÁRIO =======
  if (tela === 'form') {
    const isSistema = (form.tipo === 'QI' || form.tipo === 'DISC')

    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{modoEdicao ? 'Editar Teste' : 'Novo Teste'}</h1>
            <p className="text-gray-600">Crie teste com itens, tempo, certificado e relatório</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTela('lista')}>Voltar</Button>
            <Button onClick={salvarTeste}>Salvar</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuração</CardTitle>
            <CardDescription>Campos agora estão ligados ao estado (digitação funciona)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input value={form.titulo} onChange={(e) => setForm(p => ({ ...p, titulo: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm(p => ({ ...p, categoria: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm(p => ({ ...p, descricao: e.target.value }))} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Instruções (opcional)</Label>
              <Textarea value={form.instrucoes} onChange={(e) => setForm(p => ({ ...p, instrucoes: e.target.value }))} rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(v) => setForm(p => ({ ...p, tipo: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tiposTeste.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tentativas</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.tentativasPermitidas}
                  onChange={(e) => setForm(p => ({ ...p, tentativasPermitidas: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tempo?</Label>
                <Select
                  value={form.temControle ? 'sim' : 'nao'}
                  onValueChange={(v) => setForm(p => ({ ...p, temControle: v === 'sim' }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Com tempo</SelectItem>
                    <SelectItem value="nao">Sem tempo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tempo (min)</Label>
                <Input
                  type="number"
                  min={1}
                  disabled={!form.temControle}
                  value={form.tempoLimite}
                  onChange={(e) => setForm(p => ({ ...p, tempoLimite: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Mínimo aprovação (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.pontuacaoMinima}
                  onChange={(e) => setForm(p => ({ ...p, pontuacaoMinima: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.certificado}
                  onChange={(e) => setForm(p => ({ ...p, certificado: e.target.checked }))}
                />
                <span>Gerar certificado</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.declaracao}
                  onChange={(e) => setForm(p => ({ ...p, declaracao: e.target.checked }))}
                />
                <span>Gerar declaração</span>
              </label>
            </div>

            <div className="space-y-2">
              <Label>Material de apoio (link ou texto)</Label>
              <Textarea
                value={form.materialApoio}
                onChange={(e) => setForm(p => ({ ...p, materialApoio: e.target.value }))}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {!isSistema && (
          <Card>
            <CardHeader>
              <CardTitle>Questões do teste</CardTitle>
              <CardDescription>Crie itens com perguntas e respostas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pergunta</Label>
                <Textarea value={qForm.pergunta} onChange={(e) => setQForm(p => ({ ...p, pergunta: e.target.value }))} rows={3} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de questão</Label>
                  <Select
                    value={qForm.tipo}
                    onValueChange={(v) => setQForm(p => ({
                      ...p,
                      tipo: v,
                      respostaCorreta: '',
                      opcoes: v === 'Múltipla Escolha' ? ['', '', '', ''] : []
                    }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Múltipla Escolha">Múltipla Escolha</SelectItem>
                      <SelectItem value="Verdadeiro/Falso">Verdadeiro/Falso</SelectItem>
                      <SelectItem value="Dissertativa">Dissertativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Resposta correta</Label>

                  {qForm.tipo === 'Múltipla Escolha' && (
                    <Select value={qForm.respostaCorreta} onValueChange={(v) => setQForm(p => ({ ...p, respostaCorreta: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione a correta" /></SelectTrigger>
                      <SelectContent>
                        {(qForm.opcoes || []).filter(Boolean).map((op, idx) => (
                          <SelectItem key={idx} value={op}>{op}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {qForm.tipo === 'Verdadeiro/Falso' && (
                    <Select value={qForm.respostaCorreta} onValueChange={(v) => setQForm(p => ({ ...p, respostaCorreta: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Verdadeiro">Verdadeiro</SelectItem>
                        <SelectItem value="Falso">Falso</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {qForm.tipo === 'Dissertativa' && (
                    <div className="text-sm text-gray-600">Dissertativa não tem gabarito automático.</div>
                  )}
                </div>
              </div>

              {qForm.tipo === 'Múltipla Escolha' && (
                <div className="space-y-2">
                  <Label>Opções</Label>
                  {(qForm.opcoes || []).map((op, idx) => (
                    <Input
                      key={idx}
                      value={op}
                      placeholder={`Opção ${idx + 1}`}
                      onChange={(e) => {
                        const arr = [...qForm.opcoes]
                        arr[idx] = e.target.value
                        setQForm(p => ({ ...p, opcoes: arr }))
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label>Explicação (aparece no relatório)</Label>
                <Textarea value={qForm.explicacao} onChange={(e) => setQForm(p => ({ ...p, explicacao: e.target.value }))} rows={2} />
              </div>

              <Button onClick={addQuestao}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar questão
              </Button>

              <div className="pt-4 space-y-2">
                <div className="font-semibold">Questões adicionadas: {(form.questoesDetalhadas || []).length}</div>
                {(form.questoesDetalhadas || []).length === 0 ? (
                  <div className="text-sm text-gray-600">Nenhuma questão adicionada ainda.</div>
                ) : (
                  <div className="space-y-2">
                    {form.questoesDetalhadas.map((q) => (
                      <div key={q.id} className="border rounded p-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{q.id}. {q.pergunta}</div>
                          <div className="text-sm text-gray-600">Tipo: {q.tipo}</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removerQuestao(q.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // ======= LISTA =======
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testes e Avaliações</h1>
          <p className="text-gray-600">Criar testes, realizar testes e gerar resultados</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button onClick={abrirCriacao}>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                    <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Categoria" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testesFiltrados.map((teste) => (
              <Card key={teste.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center">
                        {getTipoIcon(teste.tipo)}
                        <span className="ml-2">{teste.titulo}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">{teste.descricao}</CardDescription>
                    </div>

                    <Badge className={getStatusColor(teste.status)}>
                      {getStatusIcon(teste.status)}
                      <span className="ml-1">{teste.status}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Questões:</span>
                      <div className="font-semibold">
                        {teste.tipo === 'QI' ? 'Sistema' : teste.tipo === 'DISC' ? 'Sistema' : (teste.questoesDetalhadas?.length || 0)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Tempo:</span>
                      <div className="font-semibold">
                        {teste.temControle ? `${teste.tempoLimite} min` : 'Sem tempo'}
                      </div>
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

                  <div className="text-sm flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{teste.participantes || 0} participantes</span>
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
                      <span className="text-gray-600">Aprovação:</span>
                      <div className="font-semibold text-green-600">{calcularTaxaAprovacao(teste.id)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Média:</span>
                      <div className="font-semibold text-blue-600">{calcularMediaPontuacao(teste.id)}%</div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => iniciarTeste(teste)}
                      disabled={teste.status !== 'Ativo'}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Iniciar
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => abrirEdicao(teste)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => excluirTeste(teste.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
              <CardDescription>Relatórios após conclusão dos testes</CardDescription>
            </CardHeader>
            <CardContent>
              {resultados.length === 0 ? (
                <div className="text-gray-600">Nenhum resultado ainda.</div>
              ) : (
                <div className="space-y-3">
                  {resultados.slice().reverse().map((r) => (
                    <div key={r.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{r.usuario}</div>
                        <div className="text-sm text-gray-600">{r.testeTitulo}</div>
                        <div className="text-xs text-gray-500">
                          {r.data} • Tentativa {r.tentativa}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold">{(r.pontuacao ?? '-')}{r.pontuacao != null ? '%' : ''}</div>
                        <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificados" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificados</CardTitle>
              <CardDescription>Disponível quando aprovado (ou quando configurado)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resultados.filter(r => r.certificadoGerado || r.declaracaoGerada).length === 0 ? (
                  <div className="text-gray-600">Nenhum certificado/declaração disponível ainda.</div>
                ) : (
                  resultados.filter(r => r.certificadoGerado || r.declaracaoGerada).map((r) => (
                    <div key={r.id} className="border rounded p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{r.usuario}</div>
                        <div className="text-sm text-gray-600">{r.testeTitulo}</div>
                      </div>
                      <Button variant="outline" onClick={gerarCertificadoOuDeclaracao}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
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
                    <p className="text-2xl font-bold">{testes.reduce((acc, t) => acc + (t.participantes || 0), 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Aprovados</p>
                    <p className="text-2xl font-bold">{resultados.filter(r => r.status === 'Aprovado').length}</p>
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
                    <p className="text-2xl font-bold">{resultados.filter(r => r.certificadoGerado).length}</p>
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
