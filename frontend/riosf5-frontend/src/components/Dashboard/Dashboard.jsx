import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap, 
  Award,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Globe,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts'

// Dados simulados para gráficos
const crescimentoMensal = [
  { mes: 'Jan', empresas: 12, usuarios: 1200, treinamentos: 45 },
  { mes: 'Fev', empresas: 15, usuarios: 1350, treinamentos: 52 },
  { mes: 'Mar', empresas: 18, usuarios: 1580, treinamentos: 61 },
  { mes: 'Abr', empresas: 22, usuarios: 1820, treinamentos: 68 },
  { mes: 'Mai', empresas: 24, usuarios: 1947, treinamentos: 75 },
  { mes: 'Jun', empresas: 28, usuarios: 2156, treinamentos: 84 }
]

const statusTreinamentos = [
  { name: 'Concluídos', value: 68, color: '#10B981' },
  { name: 'Em Andamento', value: 24, color: '#3B82F6' },
  { name: 'Pendentes', value: 8, color: '#F59E0B' }
]

const performanceEmpresas = [
  { nome: 'TechCorp', conclusao: 92, usuarios: 156, certificados: 142 },
  { nome: 'IndustriaABC', conclusao: 87, usuarios: 89, certificados: 78 },
  { nome: 'ConsultoriaXYZ', conclusao: 94, usuarios: 67, certificados: 63 },
  { nome: 'RiosF5', conclusao: 98, usuarios: 45, certificados: 44 }
]

const atividadesRecentes = [
  {
    id: 1,
    tipo: 'treinamento',
    titulo: 'Novo treinamento "Segurança no Trabalho" foi concluído',
    usuario: 'João Silva - TechCorp',
    tempo: '2 min atrás',
    icon: GraduationCap,
    color: 'text-green-600'
  },
  {
    id: 2,
    tipo: 'certificado',
    titulo: 'Certificado emitido para "Qualidade e Processos"',
    usuario: 'Maria Santos - IndustriaABC',
    tempo: '15 min atrás',
    icon: Award,
    color: 'text-blue-600'
  },
  {
    id: 3,
    tipo: 'empresa',
    titulo: 'Nova empresa cadastrada no sistema',
    usuario: 'Consultoria Premium Ltda',
    tempo: '1 hora atrás',
    icon: Building2,
    color: 'text-purple-600'
  },
  {
    id: 4,
    tipo: 'usuario',
    titulo: 'Novo usuário cadastrado',
    usuario: 'Carlos Oliveira - ConsultoriaXYZ',
    tempo: '2 horas atrás',
    icon: Users,
    color: 'text-orange-600'
  },
  {
    id: 5,
    tipo: 'alerta',
    titulo: 'Backup automático realizado com sucesso',
    usuario: 'Sistema',
    tempo: '3 horas atrás',
    icon: Shield,
    color: 'text-gray-600'
  }
]

const alertasImportantes = [
  {
    id: 1,
    tipo: 'warning',
    titulo: 'Certificados próximos ao vencimento',
    descricao: '12 certificados vencem nos próximos 30 dias',
    acao: 'Verificar',
    urgencia: 'média'
  },
  {
    id: 2,
    tipo: 'info',
    titulo: 'Atualização de sistema disponível',
    descricao: 'Nova versão 2.1.0 com melhorias de segurança',
    acao: 'Atualizar',
    urgencia: 'baixa'
  },
  {
    id: 3,
    tipo: 'success',
    titulo: 'Meta mensal atingida',
    descricao: '150% da meta de treinamentos concluídos',
    acao: 'Ver relatório',
    urgencia: 'baixa'
  }
]

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const stats = {
    empresas: { total: 28, crescimento: 16.7, trend: 'up' },
    usuarios: { total: 2156, crescimento: 12.3, trend: 'up' },
    treinamentos: { total: 84, crescimento: 8.9, trend: 'up' },
    certificados: { total: 1847, crescimento: -2.1, trend: 'down' },
    conclusao: { total: 87.5, crescimento: 5.2, trend: 'up' },
    satisfacao: { total: 4.8, crescimento: 2.1, trend: 'up' }
  }

  const StatCard = ({ title, value, change, trend, icon: Icon, color, suffix = '' }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}{suffix}</div>
        <div className="flex items-center mt-1">
          {trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
          )}
          <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-slate-500 ml-1">vs mês anterior</span>
        </div>
      </CardContent>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${
        trend === 'up' ? 'bg-green-500' : 'bg-red-500'
      } opacity-20`} />
    </Card>
  )

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Visão geral do sistema RiosF5</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Período: 30 dias
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total de Empresas"
          value={stats.empresas.total}
          change={stats.empresas.crescimento}
          trend={stats.empresas.trend}
          icon={Building2}
          color="text-blue-600"
        />
        <StatCard
          title="Usuários Ativos"
          value={stats.usuarios.total.toLocaleString()}
          change={stats.usuarios.crescimento}
          trend={stats.usuarios.trend}
          icon={Users}
          color="text-green-600"
        />
        <StatCard
          title="Treinamentos"
          value={stats.treinamentos.total}
          change={stats.treinamentos.crescimento}
          trend={stats.treinamentos.trend}
          icon={GraduationCap}
          color="text-purple-600"
        />
        <StatCard
          title="Certificados"
          value={stats.certificados.total.toLocaleString()}
          change={stats.certificados.crescimento}
          trend={stats.certificados.trend}
          icon={Award}
          color="text-orange-600"
        />
        <StatCard
          title="Taxa de Conclusão"
          value={stats.conclusao.total}
          change={stats.conclusao.crescimento}
          trend={stats.conclusao.trend}
          icon={Target}
          color="text-emerald-600"
          suffix="%"
        />
        <StatCard
          title="Satisfação"
          value={stats.satisfacao.total}
          change={stats.satisfacao.crescimento}
          trend={stats.satisfacao.trend}
          icon={Zap}
          color="text-yellow-600"
          suffix="/5"
        />
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crescimento Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Crescimento Mensal
            </CardTitle>
            <CardDescription>
              Evolução de empresas, usuários e treinamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={crescimentoMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="usuarios" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="treinamentos" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="empresas" 
                  stackId="1" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status dos Treinamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-green-600" />
              Status dos Treinamentos
            </CardTitle>
            <CardDescription>
              Distribuição por status de conclusão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="60%" height={200}>
                <RechartsPieChart>
                  <Tooltip />
                  <RechartsPieChart data={statusTreinamentos} cx="50%" cy="50%" outerRadius={80}>
                    {statusTreinamentos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {statusTreinamentos.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance das Empresas e Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance das Empresas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              Performance das Empresas
            </CardTitle>
            <CardDescription>
              Taxa de conclusão de treinamentos por empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceEmpresas.map((empresa, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{empresa.nome}</div>
                      <div className="text-sm text-slate-500">
                        {empresa.usuarios} usuários • {empresa.certificados} certificados
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium text-slate-900">{empresa.conclusao}%</div>
                      <div className="text-xs text-slate-500">conclusão</div>
                    </div>
                    <Progress value={empresa.conclusao} className="w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-600" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atividadesRecentes.map((atividade) => {
                const Icon = atividade.icon
                return (
                  <div key={atividade.id} className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className={`p-1 rounded-full bg-slate-100`}>
                      <Icon className={`w-3 h-3 ${atividade.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 line-clamp-2">
                        {atividade.titulo}
                      </p>
                      <p className="text-xs text-slate-500">{atividade.usuario}</p>
                      <p className="text-xs text-slate-400">{atividade.tempo}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            Alertas e Notificações
          </CardTitle>
          <CardDescription>
            Itens que requerem sua atenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alertasImportantes.map((alerta) => (
              <div key={alerta.id} className={`p-4 rounded-lg border-l-4 ${
                alerta.tipo === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                alerta.tipo === 'info' ? 'border-blue-500 bg-blue-50' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{alerta.titulo}</h4>
                  <Badge variant={
                    alerta.urgencia === 'alta' ? 'destructive' :
                    alerta.urgencia === 'média' ? 'default' :
                    'secondary'
                  }>
                    {alerta.urgencia}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3">{alerta.descricao}</p>
                <Button size="sm" variant="outline" className="w-full">
                  {alerta.acao}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

