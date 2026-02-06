import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Award,
  RotateCcw,
  Play,
  ArrowLeft,
  ArrowRight,
  Target,
  Zap,
  Heart,
  Shield
} from 'lucide-react'

export default function TesteDISC({ onVoltar, onConcluir }) {
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState({})
  const [testeIniciado, setTesteIniciado] = useState(false)
  const [testeConcluido, setTesteConcluido] = useState(false)
  const [resultado, setResultado] = useState(null)

  const questoes = [
    {
      id: 1,
      pergunta: 'Em uma reunião de trabalho, você geralmente:',
      opcoes: [
        { texto: 'Toma a liderança e dirige a discussão', tipo: 'D' },
        { texto: 'Motiva e envolve todos os participantes', tipo: 'I' },
        { texto: 'Ouve atentamente e oferece apoio', tipo: 'S' },
        { texto: 'Analisa os dados e faz perguntas detalhadas', tipo: 'C' }
      ]
    },
    {
      id: 2,
      pergunta: 'Quando enfrenta um problema difícil, sua primeira reação é:',
      opcoes: [
        { texto: 'Agir rapidamente para resolver', tipo: 'D' },
        { texto: 'Buscar ideias criativas e inovadoras', tipo: 'I' },
        { texto: 'Procurar ajuda e trabalhar em equipe', tipo: 'S' },
        { texto: 'Pesquisar e analisar todas as opções', tipo: 'C' }
      ]
    },
    {
      id: 3,
      pergunta: 'Seu ambiente de trabalho ideal seria:',
      opcoes: [
        { texto: 'Dinâmico e com desafios constantes', tipo: 'D' },
        { texto: 'Colaborativo e cheio de energia', tipo: 'I' },
        { texto: 'Estável e harmonioso', tipo: 'S' },
        { texto: 'Organizado e estruturado', tipo: 'C' }
      ]
    },
    {
      id: 4,
      pergunta: 'Ao tomar decisões importantes, você:',
      opcoes: [
        { texto: 'Decide rapidamente baseado na intuição', tipo: 'D' },
        { texto: 'Consulta outras pessoas e busca consenso', tipo: 'I' },
        { texto: 'Considera o impacto em todos os envolvidos', tipo: 'S' },
        { texto: 'Analisa cuidadosamente todos os dados', tipo: 'C' }
      ]
    },
    {
      id: 5,
      pergunta: 'Em situações de conflito, você tende a:',
      opcoes: [
        { texto: 'Confrontar diretamente o problema', tipo: 'D' },
        { texto: 'Tentar mediar e encontrar soluções criativas', tipo: 'I' },
        { texto: 'Evitar o conflito e buscar harmonia', tipo: 'S' },
        { texto: 'Analisar objetivamente os fatos', tipo: 'C' }
      ]
    },
    {
      id: 6,
      pergunta: 'Sua maior motivação no trabalho é:',
      opcoes: [
        { texto: 'Alcançar resultados e vencer desafios', tipo: 'D' },
        { texto: 'Reconhecimento e interação social', tipo: 'I' },
        { texto: 'Estabilidade e relacionamentos positivos', tipo: 'S' },
        { texto: 'Precisão e qualidade no trabalho', tipo: 'C' }
      ]
    },
    {
      id: 7,
      pergunta: 'Quando trabalha em equipe, você:',
      opcoes: [
        { texto: 'Assume naturalmente a liderança', tipo: 'D' },
        { texto: 'Mantém o moral alto e motiva os outros', tipo: 'I' },
        { texto: 'Oferece suporte e cooperação', tipo: 'S' },
        { texto: 'Garante que tudo seja feito corretamente', tipo: 'C' }
      ]
    },
    {
      id: 8,
      pergunta: 'Seu estilo de comunicação é:',
      opcoes: [
        { texto: 'Direto e objetivo', tipo: 'D' },
        { texto: 'Entusiástico e expressivo', tipo: 'I' },
        { texto: 'Calmo e paciente', tipo: 'S' },
        { texto: 'Preciso e detalhado', tipo: 'C' }
      ]
    },
    {
      id: 9,
      pergunta: 'Diante de mudanças, você:',
      opcoes: [
        { texto: 'Abraça rapidamente as mudanças', tipo: 'D' },
        { texto: 'Vê as mudanças como oportunidades', tipo: 'I' },
        { texto: 'Prefere mudanças graduais e planejadas', tipo: 'S' },
        { texto: 'Analisa cuidadosamente os riscos', tipo: 'C' }
      ]
    },
    {
      id: 10,
      pergunta: 'Seu maior medo profissional é:',
      opcoes: [
        { texto: 'Perder o controle ou autoridade', tipo: 'D' },
        { texto: 'Ser rejeitado ou ignorado', tipo: 'I' },
        { texto: 'Conflitos e instabilidade', tipo: 'S' },
        { texto: 'Cometer erros ou ser criticado', tipo: 'C' }
      ]
    },
    {
      id: 11,
      pergunta: 'Ao apresentar um projeto, você:',
      opcoes: [
        { texto: 'Foca nos resultados e benefícios', tipo: 'D' },
        { texto: 'Usa histórias e exemplos envolventes', tipo: 'I' },
        { texto: 'Enfatiza a colaboração e consenso', tipo: 'S' },
        { texto: 'Apresenta dados e análises detalhadas', tipo: 'C' }
      ]
    },
    {
      id: 12,
      pergunta: 'Seu ritmo de trabalho preferido é:',
      opcoes: [
        { texto: 'Rápido e intenso', tipo: 'D' },
        { texto: 'Variado e estimulante', tipo: 'I' },
        { texto: 'Constante e previsível', tipo: 'S' },
        { texto: 'Metódico e cuidadoso', tipo: 'C' }
      ]
    },
    {
      id: 13,
      pergunta: 'Para você, sucesso significa:',
      opcoes: [
        { texto: 'Atingir metas e superar obstáculos', tipo: 'D' },
        { texto: 'Ser reconhecido e admirado', tipo: 'I' },
        { texto: 'Manter relacionamentos harmoniosos', tipo: 'S' },
        { texto: 'Fazer um trabalho de alta qualidade', tipo: 'C' }
      ]
    },
    {
      id: 14,
      pergunta: 'Quando recebe feedback, você:',
      opcoes: [
        { texto: 'Quer saber como melhorar os resultados', tipo: 'D' },
        { texto: 'Aprecia o reconhecimento positivo', tipo: 'I' },
        { texto: 'Valoriza feedback construtivo e gentil', tipo: 'S' },
        { texto: 'Prefere feedback específico e detalhado', tipo: 'C' }
      ]
    },
    {
      id: 15,
      pergunta: 'Em situações de pressão, você:',
      opcoes: [
        { texto: 'Mantém o foco e toma decisões rápidas', tipo: 'D' },
        { texto: 'Busca apoio e mantém o otimismo', tipo: 'I' },
        { texto: 'Procura estabilizar a situação', tipo: 'S' },
        { texto: 'Analisa cuidadosamente antes de agir', tipo: 'C' }
      ]
    }
  ]

  const iniciarTeste = () => {
    setTesteIniciado(true)
    setQuestaoAtual(0)
    setRespostas({})
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
    // Calcular pontuações para cada tipo DISC
    const pontuacoes = { D: 0, I: 0, S: 0, C: 0 }
    
    Object.entries(respostas).forEach(([questaoIndex, opcaoIndex]) => {
      const questao = questoes[parseInt(questaoIndex)]
      const opcao = questao.opcoes[opcaoIndex]
      pontuacoes[opcao.tipo]++
    })

    // Calcular porcentagens
    const total = questoes.length
    const porcentagens = {
      D: Math.round((pontuacoes.D / total) * 100),
      I: Math.round((pontuacoes.I / total) * 100),
      S: Math.round((pontuacoes.S / total) * 100),
      C: Math.round((pontuacoes.C / total) * 100)
    }

    // Determinar perfil dominante
    const perfilDominante = Object.entries(porcentagens).reduce((a, b) => 
      porcentagens[a[0]] > porcentagens[b[0]] ? a : b
    )[0]

    // Determinar perfil secundário
    const porcentagensOrdenadas = Object.entries(porcentagens)
      .sort(([,a], [,b]) => b - a)
    const perfilSecundario = porcentagensOrdenadas[1][0]

    const resultadoFinal = {
      pontuacoes,
      porcentagens,
      perfilDominante,
      perfilSecundario,
      perfilCompleto: `${perfilDominante}${perfilSecundario}`,
      descricao: getDescricaoPerfil(perfilDominante),
      caracteristicas: getCaracteristicas(perfilDominante),
      fortalezas: getFortalezas(perfilDominante),
      desafios: getDesafios(perfilDominante),
      dicasDesenvolvimento: getDicasDesenvolvimento(perfilDominante)
    }

    setResultado(resultadoFinal)
    setTesteConcluido(true)
    
    if (onConcluir) {
      onConcluir(resultadoFinal)
    }
  }

  const getDescricaoPerfil = (perfil) => {
    const descricoes = {
      D: 'Dominante - Você é orientado para resultados, direto e gosta de assumir o controle. Toma decisões rapidamente e não tem medo de desafios.',
      I: 'Influente - Você é sociável, otimista e gosta de trabalhar com pessoas. É comunicativo e tem facilidade para motivar outros.',
      S: 'Estável - Você valoriza a harmonia, é confiável e prefere ambientes estáveis. É um excelente membro de equipe e oferece apoio aos outros.',
      C: 'Consciencioso - Você é analítico, preciso e valoriza a qualidade. Gosta de trabalhar com dados e seguir procedimentos estabelecidos.'
    }
    return descricoes[perfil] || ''
  }

  const getCaracteristicas = (perfil) => {
    const caracteristicas = {
      D: ['Orientado para resultados', 'Decisivo', 'Competitivo', 'Direto', 'Independente'],
      I: ['Sociável', 'Otimista', 'Comunicativo', 'Entusiástico', 'Persuasivo'],
      S: ['Paciente', 'Leal', 'Cooperativo', 'Estável', 'Confiável'],
      C: ['Analítico', 'Preciso', 'Sistemático', 'Cauteloso', 'Detalhista']
    }
    return caracteristicas[perfil] || []
  }

  const getFortalezas = (perfil) => {
    const fortalezas = {
      D: ['Liderança natural', 'Tomada de decisão rápida', 'Foco em resultados', 'Aceita desafios', 'Iniciativa'],
      I: ['Habilidades de comunicação', 'Motivação de equipes', 'Criatividade', 'Networking', 'Otimismo'],
      S: ['Trabalho em equipe', 'Estabilidade emocional', 'Lealdade', 'Paciência', 'Apoio aos outros'],
      C: ['Atenção aos detalhes', 'Qualidade do trabalho', 'Análise crítica', 'Organização', 'Precisão']
    }
    return fortalezas[perfil] || []
  }

  const getDesafios = (perfil) => {
    const desafios = {
      D: ['Pode ser impaciente', 'Dificuldade em delegar', 'Pode ignorar detalhes', 'Resistente a críticas'],
      I: ['Pode ser desorganizado', 'Dificuldade com detalhes', 'Pode ser superficial', 'Evita conflitos'],
      S: ['Resistente a mudanças', 'Dificuldade em dizer não', 'Pode evitar confrontos', 'Lento para decidir'],
      C: ['Pode ser perfeccionista', 'Lento para decidir', 'Resistente a mudanças', 'Crítico demais']
    }
    return desafios[perfil] || []
  }

  const getDicasDesenvolvimento = (perfil) => {
    const dicas = {
      D: ['Pratique a paciência', 'Desenvolva habilidades de escuta', 'Aprenda a delegar', 'Considere o impacto nas pessoas'],
      I: ['Melhore a organização', 'Foque nos detalhes', 'Desenvolva follow-up', 'Pratique a escuta ativa'],
      S: ['Pratique assertividade', 'Aceite mudanças gradualmente', 'Desenvolva autoconfiança', 'Aprenda a expressar opiniões'],
      C: ['Pratique flexibilidade', 'Acelere tomada de decisões', 'Desenvolva habilidades sociais', 'Aceite "bom o suficiente"']
    }
    return dicas[perfil] || []
  }

  const getPerfilIcon = (perfil) => {
    const icons = {
      D: <Target className="h-6 w-6" />,
      I: <Zap className="h-6 w-6" />,
      S: <Heart className="h-6 w-6" />,
      C: <Shield className="h-6 w-6" />
    }
    return icons[perfil] || <Users className="h-6 w-6" />
  }

  const getPerfilColor = (perfil) => {
    const colors = {
      D: 'text-red-600 bg-red-100',
      I: 'text-yellow-600 bg-yellow-100',
      S: 'text-green-600 bg-green-100',
      C: 'text-blue-600 bg-blue-100'
    }
    return colors[perfil] || 'text-gray-600 bg-gray-100'
  }

  const getPerfilNome = (perfil) => {
    const nomes = {
      D: 'Dominante',
      I: 'Influente',
      S: 'Estável',
      C: 'Consciencioso'
    }
    return nomes[perfil] || perfil
  }

  if (!testeIniciado) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 mr-3 text-blue-600" />
              Avaliação DISC
            </h1>
            <p className="text-gray-600">Descubra seu perfil comportamental</p>
          </div>
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sobre o Teste DISC</CardTitle>
            <CardDescription>
              Entenda seu estilo comportamental e como você interage com outros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">O que é o DISC?</h3>
                <p className="text-sm text-gray-600">
                  O DISC é uma ferramenta de avaliação comportamental que identifica quatro estilos principais de personalidade. 
                  Cada pessoa possui uma combinação única desses estilos, com um ou dois sendo dominantes.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Target className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600">Dominante (D)</h4>
                      <p className="text-xs text-gray-600">Orientado para resultados e controle</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-600">Influente (I)</h4>
                      <p className="text-xs text-gray-600">Sociável e comunicativo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600">Estável (S)</h4>
                      <p className="text-xs text-gray-600">Cooperativo e confiável</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600">Consciencioso (C)</h4>
                      <p className="text-xs text-gray-600">Analítico e preciso</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informações do Teste</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    {questoes.length} questões comportamentais
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    Tempo estimado: 10-15 minutos
                  </li>
                  <li className="flex items-center">
                    <Users className="h-4 w-4 text-purple-600 mr-2" />
                    Análise completa do perfil
                  </li>
                  <li className="flex items-center">
                    <Award className="h-4 w-4 text-yellow-600 mr-2" />
                    Relatório detalhado com dicas
                  </li>
                </ul>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Dica:</h4>
                  <p className="text-sm text-blue-700">
                    Responda com base em como você realmente age, não como gostaria de agir. 
                    Seja honesto para obter um resultado mais preciso.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={iniciarTeste} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Iniciar Avaliação DISC
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
            <h1 className="text-3xl font-bold text-gray-900">Seu Perfil DISC</h1>
            <p className="text-gray-600">Resultado da sua avaliação comportamental</p>
          </div>
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Perfil Principal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Seu Perfil Dominante</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getPerfilColor(resultado.perfilDominante)}`}>
              {getPerfilIcon(resultado.perfilDominante)}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{resultado.perfilDominante}</h2>
              <p className="text-xl text-gray-600">{getPerfilNome(resultado.perfilDominante)}</p>
              <Badge className="mt-2 text-lg px-4 py-2">
                {resultado.porcentagens[resultado.perfilDominante]}%
              </Badge>
            </div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {resultado.descricao}
            </p>
          </CardContent>
        </Card>

        {/* Gráfico de Porcentagens */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição do seu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(resultado.porcentagens).map(([tipo, porcentagem]) => (
                <div key={tipo} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getPerfilColor(tipo)}`}>
                        {getPerfilIcon(tipo)}
                      </div>
                      <span className="font-semibold">{tipo} - {getPerfilNome(tipo)}</span>
                    </div>
                    <span className="font-bold">{porcentagem}%</span>
                  </div>
                  <Progress value={porcentagem} className="w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Características e Fortalezas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Suas Fortalezas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resultado.fortalezas.map((fortaleza, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    {fortaleza}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Áreas de Desenvolvimento</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resultado.desafios.map((desafio, index) => (
                  <li key={index} className="flex items-center">
                    <Target className="h-4 w-4 text-orange-600 mr-2" />
                    {desafio}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Características Principais */}
        <Card>
          <CardHeader>
            <CardTitle>Características Principais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {resultado.caracteristicas.map((caracteristica, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {caracteristica}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dicas de Desenvolvimento */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas para Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {resultado.dicasDesenvolvimento.map((dica, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <span>{dica}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Certificado */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Avaliação Concluída!
            </h3>
            <p className="text-green-700 mb-4">
              Você completou com sucesso a avaliação DISC e pode gerar seu certificado.
            </p>
            <Button variant="outline" className="border-green-600 text-green-600">
              <Award className="h-4 w-4 mr-2" />
              Gerar Certificado
            </Button>
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
          <h1 className="text-2xl font-bold text-gray-900">Avaliação DISC</h1>
          <p className="text-gray-600">
            Questão {questaoAtual + 1} de {questoes.length}
          </p>
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

      <Card>
        <CardHeader>
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Questão {questao.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-6 text-center">{questao.pergunta}</h2>
            
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
                    <span>{opcao.texto}</span>
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
                  Finalizar Avaliação
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

      {/* Navegação rápida */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progresso das Questões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-15 gap-2">
            {questoes.map((_, index) => (
              <button
                key={index}
                onClick={() => setQuestaoAtual(index)}
                className={`w-8 h-8 rounded border text-xs font-medium ${
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

