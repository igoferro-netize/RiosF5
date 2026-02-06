import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Award,
  RotateCcw,
  Play,
  Pause,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

export default function TesteQI({ onVoltar, onConcluir }) {
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState({})
  const [tempoRestante, setTempoRestante] = useState(3600) // 60 minutos em segundos
  const [testeIniciado, setTesteIniciado] = useState(false)
  const [testeConcluido, setTesteConcluido] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [pausado, setPausado] = useState(false)

  const questoes = [
    {
      id: 1,
      tipo: 'logica',
      pergunta: 'Qual número vem a seguir na sequência: 2, 4, 8, 16, ?',
      opcoes: ['24', '32', '30', '28'],
      resposta: 1, // índice da resposta correta
      dificuldade: 'fácil'
    },
    {
      id: 2,
      tipo: 'verbal',
      pergunta: 'Qual palavra NÃO pertence ao grupo?',
      opcoes: ['Carro', 'Bicicleta', 'Avião', 'Casa'],
      resposta: 3,
      dificuldade: 'fácil'
    },
    {
      id: 3,
      tipo: 'espacial',
      pergunta: 'Se você virar um cubo 90° para a direita, qual face ficará na frente?',
      opcoes: ['A face que estava em cima', 'A face que estava à esquerda', 'A face que estava atrás', 'A face que estava embaixo'],
      resposta: 1,
      dificuldade: 'médio'
    },
    {
      id: 4,
      tipo: 'numérica',
      pergunta: 'Se 3x + 7 = 22, qual é o valor de x?',
      opcoes: ['3', '5', '7', '9'],
      resposta: 1,
      dificuldade: 'médio'
    },
    {
      id: 5,
      tipo: 'logica',
      pergunta: 'Todos os gatos são animais. Alguns animais são selvagens. Logo:',
      opcoes: [
        'Todos os gatos são selvagens',
        'Alguns gatos podem ser selvagens',
        'Nenhum gato é selvagem',
        'Todos os animais selvagens são gatos'
      ],
      resposta: 1,
      dificuldade: 'médio'
    },
    {
      id: 6,
      tipo: 'padrões',
      pergunta: 'Complete a sequência: A1, C3, E5, G7, ?',
      opcoes: ['H8', 'I9', 'J10', 'K11'],
      resposta: 1,
      dificuldade: 'médio'
    },
    {
      id: 7,
      tipo: 'verbal',
      pergunta: 'Qual é o antônimo de "efêmero"?',
      opcoes: ['Duradouro', 'Rápido', 'Pequeno', 'Frágil'],
      resposta: 0,
      dificuldade: 'difícil'
    },
    {
      id: 8,
      tipo: 'numérica',
      pergunta: 'Qual é o próximo número primo após 17?',
      opcoes: ['18', '19', '20', '21'],
      resposta: 1,
      dificuldade: 'difícil'
    },
    {
      id: 9,
      tipo: 'logica',
      pergunta: 'Se é verdade que "Todos os A são B" e "Alguns B são C", qual conclusão é válida?',
      opcoes: [
        'Todos os A são C',
        'Alguns A são C',
        'Nenhum A é C',
        'Não é possível concluir'
      ],
      resposta: 3,
      dificuldade: 'difícil'
    },
    {
      id: 10,
      tipo: 'espacial',
      pergunta: 'Quantos cubos pequenos são necessários para formar um cubo 4x4x4?',
      opcoes: ['16', '32', '48', '64'],
      resposta: 3,
      dificuldade: 'difícil'
    }
  ]

  useEffect(() => {
    let interval = null
    if (testeIniciado && !pausado && !testeConcluido && tempoRestante > 0) {
      interval = setInterval(() => {
        setTempoRestante(tempo => {
          if (tempo <= 1) {
            finalizarTeste()
            return 0
          }
          return tempo - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [testeIniciado, pausado, testeConcluido, tempoRestante])

  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  const iniciarTeste = () => {
    setTesteIniciado(true)
    setQuestaoAtual(0)
    setRespostas({})
    setTempoRestante(3600)
    setTesteConcluido(false)
    setResultado(null)
  }

  const selecionarResposta = (opcaoIndex) => {
    setRespostas({
      ...respostas,
      [questaoAtual]: opcaoIndex
    })
  }

  const proximaQuestao = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(questaoAtual + 1)
    }
  }

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1)
    }
  }

  const finalizarTeste = () => {
    const acertos = questoes.reduce((acc, questao, index) => {
      return acc + (respostas[index] === questao.resposta ? 1 : 0)
    }, 0)

    const porcentagem = Math.round((acertos / questoes.length) * 100)
    const tempoGasto = 3600 - tempoRestante
    
    // Cálculo do QI baseado na porcentagem de acertos
    let qi = 100 // QI médio
    if (porcentagem >= 90) qi = 140
    else if (porcentagem >= 80) qi = 130
    else if (porcentagem >= 70) qi = 120
    else if (porcentagem >= 60) qi = 110
    else if (porcentagem >= 50) qi = 100
    else if (porcentagem >= 40) qi = 90
    else if (porcentagem >= 30) qi = 80
    else qi = 70

    const resultadoFinal = {
      acertos,
      total: questoes.length,
      porcentagem,
      qi,
      tempoGasto: Math.floor(tempoGasto / 60),
      classificacao: getClassificacaoQI(qi)
    }

    setResultado(resultadoFinal)
    setTesteConcluido(true)
    
    if (onConcluir) {
      onConcluir(resultadoFinal)
    }
  }

  const getClassificacaoQI = (qi) => {
    if (qi >= 140) return 'Superdotado'
    if (qi >= 130) return 'Muito Superior'
    if (qi >= 120) return 'Superior'
    if (qi >= 110) return 'Acima da Média'
    if (qi >= 90) return 'Média'
    if (qi >= 80) return 'Abaixo da Média'
    return 'Limítrofe'
  }

  const getTipoQuestao = (tipo) => {
    const tipos = {
      'logica': 'Raciocínio Lógico',
      'verbal': 'Habilidade Verbal',
      'espacial': 'Raciocínio Espacial',
      'numérica': 'Habilidade Numérica',
      'padrões': 'Reconhecimento de Padrões'
    }
    return tipos[tipo] || tipo
  }

  const getDificuldadeColor = (dificuldade) => {
    switch (dificuldade) {
      case 'fácil': return 'bg-green-100 text-green-800'
      case 'médio': return 'bg-yellow-100 text-yellow-800'
      case 'difícil': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!testeIniciado) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="h-8 w-8 mr-3 text-blue-600" />
              Teste de QI Completo
            </h1>
            <p className="text-gray-600">Avaliação completa de inteligência</p>
          </div>
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Instruções do Teste</CardTitle>
            <CardDescription>
              Leia atentamente antes de iniciar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informações Gerais</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    {questoes.length} questões de múltipla escolha
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    Tempo limite: 60 minutos
                  </li>
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 text-purple-600 mr-2" />
                    Avalia diferentes tipos de inteligência
                  </li>
                  <li className="flex items-center">
                    <Award className="h-4 w-4 text-yellow-600 mr-2" />
                    Certificado para pontuação ≥ 70%
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Tipos de Questões</h3>
                <div className="space-y-2">
                  <Badge className="bg-blue-100 text-blue-800">Raciocínio Lógico</Badge>
                  <Badge className="bg-green-100 text-green-800">Habilidade Verbal</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Raciocínio Espacial</Badge>
                  <Badge className="bg-orange-100 text-orange-800">Habilidade Numérica</Badge>
                  <Badge className="bg-pink-100 text-pink-800">Reconhecimento de Padrões</Badge>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Dicas Importantes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Leia cada questão com atenção</li>
                <li>• Você pode voltar e revisar suas respostas</li>
                <li>• Gerencie bem o seu tempo</li>
                <li>• Em caso de dúvida, escolha a melhor opção</li>
                <li>• O teste pode ser pausado se necessário</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button onClick={iniciarTeste} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Iniciar Teste de QI
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (testeConcluido && resultado) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resultado do Teste de QI</h1>
            <p className="text-gray-600">Sua avaliação foi concluída</p>
          </div>
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Seu QI</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {resultado.qi}
              </div>
              <Badge className="text-lg px-4 py-2">
                {resultado.classificacao}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Acertos:</span>
                <span className="font-semibold">{resultado.acertos}/{resultado.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Porcentagem:</span>
                <span className="font-semibold">{resultado.porcentagem}%</span>
              </div>
              <div className="flex justify-between">
                <span>Tempo gasto:</span>
                <span className="font-semibold">{resultado.tempoGasto} minutos</span>
              </div>
              <Progress value={resultado.porcentagem} className="w-full" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interpretação do Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Faixas de QI:</h4>
                  <div className="space-y-1 text-sm">
                    <div>140+: Superdotado</div>
                    <div>130-139: Muito Superior</div>
                    <div>120-129: Superior</div>
                    <div>110-119: Acima da Média</div>
                    <div>90-109: Média</div>
                    <div>80-89: Abaixo da Média</div>
                    <div>70-79: Limítrofe</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Seu Desempenho:</h4>
                  <p className="text-sm text-gray-600">
                    {resultado.qi >= 120 
                      ? "Excelente desempenho! Você demonstrou habilidades cognitivas superiores."
                      : resultado.qi >= 110
                      ? "Bom desempenho! Suas habilidades estão acima da média."
                      : resultado.qi >= 90
                      ? "Desempenho na média. Continue desenvolvendo suas habilidades."
                      : "Há espaço para melhoria. Considere praticar mais exercícios de raciocínio."
                    }
                  </p>
                </div>
              </div>

              {resultado.porcentagem >= 70 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Award className="h-6 w-6 text-green-600 mr-2" />
                    <div>
                      <h4 className="font-semibold text-green-800">Parabéns!</h4>
                      <p className="text-green-700">Você atingiu a pontuação mínima e pode gerar seu certificado.</p>
                    </div>
                  </div>
                  <Button className="mt-3" variant="outline">
                    <Award className="h-4 w-4 mr-2" />
                    Gerar Certificado
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button onClick={iniciarTeste} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Refazer Teste
          </Button>
          <Button onClick={onVoltar}>
            Finalizar
          </Button>
        </div>
      </div>
    )
  }

  const questao = questoes[questaoAtual]
  const progresso = ((questaoAtual + 1) / questoes.length) * 100

  return (
    <div className="p-6 space-y-6">
      {/* Header com progresso */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teste de QI</h1>
          <p className="text-gray-600">
            Questão {questaoAtual + 1} de {questoes.length}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-lg font-mono">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            {formatarTempo(tempoRestante)}
          </div>
          <Button
            variant="outline"
            onClick={() => setPausado(!pausado)}
          >
            {pausado ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progresso</span>
          <span>{Math.round(progresso)}%</span>
        </div>
        <Progress value={progresso} className="w-full" />
      </div>

      {pausado && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <Pause className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-semibold text-yellow-800">Teste Pausado</h3>
            <p className="text-yellow-700">Clique em play para continuar</p>
          </CardContent>
        </Card>
      )}

      {!pausado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Badge className={getDificuldadeColor(questao.dificuldade)}>
                  {questao.dificuldade}
                </Badge>
                <Badge variant="outline" className="ml-2">
                  {getTipoQuestao(questao.tipo)}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                ID: {questao.id}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">{questao.pergunta}</h2>
              
              <div className="space-y-3">
                {questao.opcoes.map((opcao, index) => (
                  <button
                    key={index}
                    onClick={() => selecionarResposta(index)}
                    className={`w-full p-4 text-left border rounded-lg transition-colors ${
                      respostas[questaoAtual] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        respostas[questaoAtual] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {respostas[questaoAtual] === index && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{opcao}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={questaoAnterior}
                disabled={questaoAtual === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <div className="flex space-x-2">
                {questaoAtual === questoes.length - 1 ? (
                  <Button
                    onClick={finalizarTeste}
                    disabled={Object.keys(respostas).length < questoes.length}
                  >
                    Finalizar Teste
                  </Button>
                ) : (
                  <Button
                    onClick={proximaQuestao}
                    disabled={respostas[questaoAtual] === undefined}
                  >
                    Próxima
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navegação rápida */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Navegação Rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questoes.map((_, index) => (
              <button
                key={index}
                onClick={() => setQuestaoAtual(index)}
                className={`w-10 h-10 rounded border text-sm font-medium ${
                  index === questaoAtual
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : respostas[index] !== undefined
                    ? 'border-green-500 bg-green-100 text-green-800'
                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span>Atual</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border border-green-500 rounded mr-2"></div>
              <span>Respondida</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-2"></div>
              <span>Não respondida</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

