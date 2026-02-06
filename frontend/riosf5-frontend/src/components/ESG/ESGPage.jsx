import React, { useState, useMemo } from "react";
import {
  Leaf, Users, ShieldCheck, BarChart3, Calculator, FileText, 
  TrendingUp, Building2, Settings, ChevronRight, Home,
  Zap, Droplet, Trash2, Factory, Truck, AlertTriangle,
  CheckCircle2, Target, Award, Brain, Database, FileSpreadsheet,
  Download, Plus, Search, Filter, Calendar, DollarSign,
  LineChart, PieChart, Activity, Briefcase, UserPlus, Shield
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import {
  LineChart as RechartsLine, Line, BarChart as RechartsBar, Bar,
  PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

/**
 * =====================================================
 * CONSTANTES E DADOS MOCK
 * =====================================================
 */

const COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  pink: "#ec4899"
};

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// Fatores de emissão (exemplo simplificado)
const EMISSION_FACTORS = {
  diesel: 2.68,        // kg CO2/litro
  gasoline: 2.31,      // kg CO2/litro
  ethanol: 1.52,       // kg CO2/litro
  electricity: 0.075,  // kg CO2/kWh (Brasil)
  gas: 1.98,           // kg CO2/m³
  air_travel: 0.255,   // kg CO2/km
  waste_landfill: 0.5, // kg CO2/kg resíduo
  water: 0.001         // kg CO2/m³
};

// Dados mock de empresas (para modo consultoria)
const MOCK_COMPANIES = [
  {
    id: 1,
    name: "Transportadora LogMax",
    segment: "Logística",
    employees: 450,
    esgScore: 72,
    status: "Ativo"
  },
  {
    id: 2,
    name: "Indústria GreenTech",
    segment: "Indústria",
    employees: 850,
    esgScore: 85,
    status: "Ativo"
  },
  {
    id: 3,
    name: "Comércio EcoRetail",
    segment: "Varejo",
    employees: 320,
    esgScore: 68,
    status: "Em Implementação"
  }
];

/**
 * =====================================================
 * UTILITÁRIOS E CALCULADORAS
 * =====================================================
 */

const calculateCO2Emissions = (data) => {
  let total = 0;
  
  // Escopo 1 - Emissões diretas
  if (data.fleet) {
    data.fleet.forEach(vehicle => {
      const factor = EMISSION_FACTORS[vehicle.fuelType] || 2.5;
      total += (vehicle.kmTraveled * vehicle.consumption / 100) * factor;
    });
  }
  
  if (data.gas) total += data.gas * EMISSION_FACTORS.gas;
  
  // Escopo 2 - Energia
  if (data.electricity) total += data.electricity * EMISSION_FACTORS.electricity;
  
  // Escopo 3 - Indireto
  if (data.airTravel) total += data.airTravel * EMISSION_FACTORS.air_travel;
  if (data.waste) total += data.waste * EMISSION_FACTORS.waste_landfill;
  if (data.water) total += data.water * EMISSION_FACTORS.water;
  
  return (total / 1000).toFixed(2); // Retorna em toneladas
};

const calculateWasteMetrics = (wasteData) => {
  const total = wasteData.reduce((sum, w) => sum + w.weight, 0);
  const recycled = wasteData.filter(w => w.destination === 'Reciclagem').reduce((sum, w) => sum + w.weight, 0);
  const recyclingRate = total > 0 ? ((recycled / total) * 100).toFixed(1) : 0;
  
  return { total, recycled, recyclingRate };
};

const calculateESGScore = (metrics) => {
  // Algoritmo ponderado de score ESG
  const { environmental, social, governance } = metrics;
  
  const eScore = (environmental.co2Reduction * 0.3 + environmental.wasteRecycling * 0.4 + environmental.energyEfficiency * 0.3);
  const sScore = (social.trainingCompletion * 0.25 + social.diversity * 0.25 + social.safetyScore * 0.3 + social.satisfaction * 0.2);
  const gScore = (governance.complianceRate * 0.4 + governance.transparencyScore * 0.3 + governance.supplierESG * 0.3);
  
  const overall = (eScore * 0.35 + sScore * 0.35 + gScore * 0.3);
  
  return {
    overall: Math.round(overall),
    environmental: Math.round(eScore),
    social: Math.round(sScore),
    governance: Math.round(gScore)
  };
};

const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const exportToPDF = (reportData, filename) => {
  // Simulação - integrar com jsPDF ou API backend
  console.log('Gerando PDF:', reportData);
  alert(`Relatório "${filename}" gerado com sucesso!\n\nIntegre com jsPDF ou backend para gerar PDF real.`);
};

/**
 * =====================================================
 * COMPONENTE PRINCIPAL - DASHBOARD ESG
 * =====================================================
 */

const ESGManagementSystem = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [selectedCompany, setSelectedCompany] = useState(MOCK_COMPANIES[0]);
  const [isConsultancyMode, setIsConsultancyMode] = useState(false);

  // Estados de dados (em produção, vir de API/banco)
  const [environmentalData, setEnvironmentalData] = useState({
    co2Emissions: 245.8,
    co2Target: 180,
    energyConsumption: 45620,
    waterConsumption: 3240,
    wasteGenerated: 12400,
    wasteRecycled: 7688,
    fleet: [
      { id: 1, plate: "ABC-1234", type: "Caminhão", fuelType: "diesel", kmTraveled: 8500, consumption: 28 },
      { id: 2, plate: "XYZ-5678", type: "Van", fuelType: "gasoline", kmTraveled: 4200, consumption: 12 }
    ]
  });

  const [socialData, setSocialData] = useState({
    employees: 450,
    trainingHours: 2340,
    diversityRate: 42,
    accidents: 3,
    satisfactionScore: 8.2
  });

  const [governanceData, setGovernanceData] = useState({
    policies: 12,
    audits: 4,
    nonCompliances: 2,
    supplierESGRate: 68
  });

  // Dados históricos para gráficos
  const historicalData = [
    { month: 'Jan', co2: 280, waste: 13200, training: 85, compliance: 92 },
    { month: 'Fev', co2: 275, waste: 12800, training: 88, compliance: 93 },
    { month: 'Mar', co2: 265, waste: 12500, training: 90, compliance: 94 },
    { month: 'Abr', co2: 260, waste: 12600, training: 89, compliance: 95 },
    { month: 'Mai', co2: 250, waste: 12200, training: 92, compliance: 94 },
    { month: 'Jun', co2: 246, waste: 12400, training: 91, compliance: 96 }
  ];

  // Cálculo de métricas consolidadas
  const metrics = useMemo(() => {
    const wasteMetrics = calculateWasteMetrics([
      { weight: environmentalData.wasteRecycled, destination: 'Reciclagem' },
      { weight: environmentalData.wasteGenerated - environmentalData.wasteRecycled, destination: 'Aterro' }
    ]);

    return {
      environmental: {
        co2Reduction: Math.min(100, ((environmentalData.co2Target / environmentalData.co2Emissions) * 100)),
        wasteRecycling: parseFloat(wasteMetrics.recyclingRate),
        energyEfficiency: 75 // Exemplo
      },
      social: {
        trainingCompletion: 91,
        diversity: socialData.diversityRate,
        safetyScore: 95,
        satisfaction: (socialData.satisfactionScore / 10) * 100
      },
      governance: {
        complianceRate: 96,
        transparencyScore: 88,
        supplierESG: governanceData.supplierESGRate
      }
    };
  }, [environmentalData, socialData, governanceData]);

  const esgScores = useMemo(() => calculateESGScore(metrics), [metrics]);

  /**
   * =====================================================
   * RENDERIZAÇÃO DE MÓDULOS
   * =====================================================
   */

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header com Score Geral */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-90" />
              <p className="text-sm font-medium opacity-90">Score ESG Geral</p>
              <h2 className="text-5xl font-bold mt-2">{esgScores.overall}</h2>
              <Progress value={esgScores.overall} className="h-2 mt-4 bg-blue-300" />
              <p className="text-xs mt-2 opacity-75">
                {esgScores.overall >= 80 ? '✨ Excelente' : esgScores.overall >= 60 ? '✓ Bom' : '⚠ Atenção necessária'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium">Ambiental (E)</p>
                <h3 className="text-3xl font-bold mt-1">{esgScores.environmental}</h3>
                <p className="text-xs text-slate-500 mt-2">Emissões, resíduos, consumo</p>
              </div>
              <Leaf className="h-10 w-10 text-green-500 opacity-20" />
            </div>
            <Progress value={esgScores.environmental} className="h-2 mt-4" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium">Social (S)</p>
                <h3 className="text-3xl font-bold mt-1">{esgScores.social}</h3>
                <p className="text-xs text-slate-500 mt-2">Pessoas, segurança, diversidade</p>
              </div>
              <Users className="h-10 w-10 text-blue-500 opacity-20" />
            </div>
            <Progress value={esgScores.social} className="h-2 mt-4" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium">Governança (G)</p>
                <h3 className="text-3xl font-bold mt-1">{esgScores.governance}</h3>
                <p className="text-xs text-slate-500 mt-2">Compliance, ética, transparência</p>
              </div>
              <ShieldCheck className="h-10 w-10 text-purple-500 opacity-20" />
            </div>
            <Progress value={esgScores.governance} className="h-2 mt-4" />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Tendência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Evolução de Emissões de CO₂ (tCO₂e)
            </CardTitle>
            <CardDescription>Redução progressiva nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="co2" stroke={COLORS.success} fillOpacity={1} fill="url(#colorCO2)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Indicadores Consolidados
            </CardTitle>
            <CardDescription>Compliance, treinamento e gestão de resíduos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsBar data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="training" fill={COLORS.primary} name="Treinamento %" />
                <Bar dataKey="compliance" fill={COLORS.purple} name="Compliance %" />
              </RechartsBar>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Ação Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveModule("environmental")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">CO₂ Total</p>
                <p className="text-2xl font-bold">{environmentalData.co2Emissions} <span className="text-sm text-slate-400">tCO₂e</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveModule("environmental")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Taxa Reciclagem</p>
                <p className="text-2xl font-bold">{metrics.environmental.wasteRecycling}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveModule("social")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Acidentes</p>
                <p className="text-2xl font-bold">{socialData.accidents} <span className="text-sm text-slate-400">no mês</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveModule("governance")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Compliance</p>
                <p className="text-2xl font-bold">{metrics.governance.complianceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Ações Sugeridas pela IA */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-amber-500" />
            Sugestões Inteligentes de IA
          </CardTitle>
          <CardDescription>Análise automática dos seus dados ESG</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {environmentalData.co2Emissions > environmentalData.co2Target && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Emissões acima da meta</p>
                    <p className="text-sm text-red-700 mt-1">
                      Você está {((environmentalData.co2Emissions / environmentalData.co2Target - 1) * 100).toFixed(1)}% acima da meta de CO₂.
                      Sugestão: otimize rotas da frota e considere migrar para combustíveis mais limpos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {metrics.environmental.wasteRecycling < 70 && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex gap-3">
                  <Trash2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">Melhore a taxa de reciclagem</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Com {metrics.environmental.wasteRecycling}% de reciclagem, você pode economizar até R$ 15.000/ano melhorando a segregação de resíduos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Oportunidade de economia</p>
                  <p className="text-sm text-green-700 mt-1">
                    Instalando painéis solares, você pode reduzir 30% da conta de energia e diminuir {(environmentalData.energyConsumption * 0.3 * EMISSION_FACTORS.electricity / 1000).toFixed(1)} tCO₂e/ano.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEnvironmentalModule = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Módulo Ambiental (E)</h2>
          <p className="text-slate-500">Gestão de emissões, resíduos, consumo de recursos naturais e frota</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Calculator className="h-4 w-4 mr-2" />
          Calculadora de CO₂
        </Button>
      </div>

      <Tabs defaultValue="emissions" className="w-full">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="emissions">
            <Factory className="h-4 w-4 mr-2" />
            Emissões
          </TabsTrigger>
          <TabsTrigger value="waste">
            <Trash2 className="h-4 w-4 mr-2" />
            Resíduos
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Droplet className="h-4 w-4 mr-2" />
            Recursos
          </TabsTrigger>
          <TabsTrigger value="fleet">
            <Truck className="h-4 w-4 mr-2" />
            Frota
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emissions" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-500 font-medium">Escopo 1 (Direto)</p>
                <h3 className="text-3xl font-bold mt-1">156.2 <span className="text-base text-slate-400">tCO₂e</span></h3>
                <p className="text-xs text-slate-500 mt-2">Combustão e processos</p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="secondary">Frota: 142 t</Badge>
                  <Badge variant="secondary">Gás: 14.2 t</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-500 font-medium">Escopo 2 (Energia)</p>
                <h3 className="text-3xl font-bold mt-1">68.4 <span className="text-base text-slate-400">tCO₂e</span></h3>
                <p className="text-xs text-slate-500 mt-2">Eletricidade comprada</p>
                <div className="mt-3">
                  <Badge variant="secondary">45.620 kWh/mês</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-500 font-medium">Escopo 3 (Indireto)</p>
                <h3 className="text-3xl font-bold mt-1">21.2 <span className="text-base text-slate-400">tCO₂e</span></h3>
                <p className="text-xs text-slate-500 mt-2">Cadeia de valor</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">Viagens</Badge>
                  <Badge variant="secondary">Resíduos</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventário de Emissões - Detalhamento</CardTitle>
              <CardDescription>Acompanhe suas fontes de emissão por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={[
                        { name: 'Escopo 1', value: 156.2, color: COLORS.success },
                        { name: 'Escopo 2', value: 68.4, color: COLORS.primary },
                        { name: 'Escopo 3', value: 21.2, color: COLORS.purple }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Escopo 1', value: 156.2, color: COLORS.success },
                        { name: 'Escopo 2', value: 68.4, color: COLORS.primary },
                        { name: 'Escopo 3', value: 21.2, color: COLORS.purple }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-700">Ações de Redução Recomendadas</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Meta de Redução</p>
                          <p className="text-xs text-green-700 mt-1">Reduzir 26% até 2030 (alinhado ao Acordo de Paris)</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border rounded-lg">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Migrar para energia renovável</p>
                          <p className="text-xs text-slate-600 mt-1">Potencial de reduzir 100% do Escopo 2 (-68.4 tCO₂e/ano)</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border rounded-lg">
                      <div className="flex items-start gap-2">
                        <Truck className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Otimizar logística</p>
                          <p className="text-xs text-slate-600 mt-1">Reduzir 15% no Escopo 1 via eficiência de rota (-21.3 tCO₂e/ano)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Inventário GEE
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waste" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Resíduos (PNRS)</CardTitle>
              <CardDescription>Controle completo de geração, destinação e reciclagem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <p className="text-sm text-slate-500 font-medium">Gerado Total</p>
                  <h3 className="text-2xl font-bold mt-1">{environmentalData.wasteGenerated} <span className="text-base text-slate-400">kg</span></h3>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-green-600 font-medium">Reciclado</p>
                  <h3 className="text-2xl font-bold mt-1 text-green-700">{environmentalData.wasteRecycled} <span className="text-base text-green-500">kg</span></h3>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Taxa de Reciclagem</p>
                  <h3 className="text-2xl font-bold mt-1 text-blue-700">{metrics.environmental.wasteRecycling}%</h3>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Tipo de Resíduo</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Peso (kg)</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Destinação</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Operador</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">MTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3">Papel/Papelão</td>
                      <td className="px-4 py-3 font-medium">2.450</td>
                      <td className="px-4 py-3"><Badge className="bg-green-100 text-green-700">Reciclagem</Badge></td>
                      <td className="px-4 py-3 text-slate-600">Cooperativa EcoVida</td>
                      <td className="px-4 py-3"><Button variant="ghost" size="sm">📄 Ver</Button></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3">Plástico</td>
                      <td className="px-4 py-3 font-medium">3.820</td>
                      <td className="px-4 py-3"><Badge className="bg-green-100 text-green-700">Reciclagem</Badge></td>
                      <td className="px-4 py-3 text-slate-600">ReciclaMax Ltda</td>
                      <td className="px-4 py-3"><Button variant="ghost" size="sm">📄 Ver</Button></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3">Orgânico</td>
                      <td className="px-4 py-3 font-medium">4.100</td>
                      <td className="px-4 py-3"><Badge className="bg-amber-100 text-amber-700">Compostagem</Badge></td>
                      <td className="px-4 py-3 text-slate-600">Fazenda Composta</td>
                      <td className="px-4 py-3"><Button variant="ghost" size="sm">📄 Ver</Button></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3">Rejeito</td>
                      <td className="px-4 py-3 font-medium">2.030</td>
                      <td className="px-4 py-3"><Badge variant="secondary">Aterro Sanitário</Badge></td>
                      <td className="px-4 py-3 text-slate-600">CTR Ambiental</td>
                      <td className="px-4 py-3"><Button variant="ghost" size="sm">📄 Ver</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Registro
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PNRS
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Energia Elétrica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Consumo Mensal</span>
                      <span className="font-bold">{environmentalData.energyConsumption.toLocaleString()} kWh</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1">75% da meta de eficiência</p>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-sm font-medium text-amber-900">Custo estimado</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">
                      R$ {(environmentalData.energyConsumption * 0.65).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <ResponsiveContainer width="100%" height={150}>
                    <RechartsLine data={historicalData.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="co2" stroke={COLORS.warning} strokeWidth={2} />
                    </RechartsLine>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  Água
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Consumo Mensal</span>
                      <span className="font-bold">{environmentalData.waterConsumption.toLocaleString()} m³</span>
                    </div>
                    <Progress value={82} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1">82% da meta de eficiência</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Custo estimado</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      R$ {(environmentalData.waterConsumption * 12.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <span className="text-sm text-slate-600">Reuso de água</span>
                      <Badge variant="secondary">28%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <span className="text-sm text-slate-600">Captação pluvial</span>
                      <Badge variant="secondary">320 m³</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    Gestão de Frota & Emissões
                  </CardTitle>
                  <CardDescription>Integração com seu sistema de frotas (diferencial competitivo)</CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Veículo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Placa</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Tipo</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Combustível</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">KM Rodado</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Consumo</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">CO₂ Gerado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {environmentalData.fleet.map(vehicle => {
                      const liters = (vehicle.kmTraveled * vehicle.consumption) / 100;
                      const co2 = (liters * EMISSION_FACTORS[vehicle.fuelType] / 1000).toFixed(2);
                      
                      return (
                        <tr key={vehicle.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium">{vehicle.plate}</td>
                          <td className="px-4 py-3">{vehicle.type}</td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary" className="uppercase text-xs">
                              {vehicle.fuelType}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">{vehicle.kmTraveled.toLocaleString()} km</td>
                          <td className="px-4 py-3">{vehicle.consumption} L/100km</td>
                          <td className="px-4 py-3 font-bold text-green-700">{co2} tCO₂e</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">Sugestão de Otimização</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Migrando 30% da frota para veículos elétricos, você pode reduzir <strong>46.8 tCO₂e/ano</strong> e 
                      economizar aproximadamente <strong>R$ 85.000</strong> em combustível. ROI estimado: 3.2 anos.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Continua no próximo bloco...

  /**
   * RENDERIZAÇÃO PRINCIPAL
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-sm z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">ESG Manager</h1>
              <p className="text-xs text-slate-500">Sistema Completo</p>
            </div>
          </div>

          {isConsultancyMode && (
            <div className="mb-6 p-3 bg-purple-50 border border-purple-100 rounded-lg">
              <p className="text-xs font-medium text-purple-900 mb-2">Modo Consultoria</p>
              <Select value={selectedCompany.id.toString()} onValueChange={(val) => {
                const company = MOCK_COMPANIES.find(c => c.id === parseInt(val));
                if (company) setSelectedCompany(company);
              }}>
                <SelectTrigger className="bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_COMPANIES.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'environmental', label: 'Ambiental (E)', icon: Leaf },
              { id: 'social', label: 'Social (S)', icon: Users },
              { id: 'governance', label: 'Governança (G)', icon: ShieldCheck },
              { id: 'indicators', label: 'Indicadores', icon: BarChart3 },
              { id: 'reports', label: 'Relatórios', icon: FileText },
              { id: 'implementation', label: 'Implementação', icon: Target },
              { id: 'consultancy', label: 'Consultorias', icon: Briefcase }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                    activeModule === item.id
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-green-600" />
              <p className="text-xs font-bold text-green-900">Score ESG</p>
            </div>
            <p className="text-3xl font-bold text-green-700">{esgScores.overall}</p>
            <Progress value={esgScores.overall} className="h-1.5 mt-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeModule === 'dashboard' && renderDashboard()}
        {activeModule === 'environmental' && renderEnvironmentalModule()}
        {activeModule === 'social' && (
          <div className="text-center py-20">
            <Users className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Módulo Social (S)</h3>
            <p className="text-slate-500">Em construção: Treinamentos, diversidade, acidentes, clima organizacional</p>
          </div>
        )}
        {activeModule === 'governance' && (
          <div className="text-center py-20">
            <ShieldCheck className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Módulo Governança (G)</h3>
            <p className="text-slate-500">Em construção: Políticas, contratos, compliance, auditorias</p>
          </div>
        )}
        {activeModule === 'indicators' && (
          <div className="text-center py-20">
            <BarChart3 className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Indicadores & Dashboards</h3>
            <p className="text-slate-500">Em construção: KPIs personalizados, comparativos, benchmarking</p>
          </div>
        )}
        {activeModule === 'reports' && (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Gerador de Relatórios</h3>
            <p className="text-slate-500">Em construção: IFRS S1/S2, CSPS 01/02, GRI, SASB, PNRS</p>
          </div>
        )}
        {activeModule === 'implementation' && (
          <div className="text-center py-20">
            <Target className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Guia de Implementação ESG</h3>
            <p className="text-slate-500">Em construção: Diagnóstico, cronograma, checklist inteligente</p>
          </div>
        )}
        {activeModule === 'consultancy' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Gestão de Consultorias</h2>
                <p className="text-slate-500">Gerencie múltiplas empresas clientes em um único painel</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsConsultancyMode(!isConsultancyMode)}>
                  {isConsultancyMode ? 'Desativar Modo' : 'Ativar Modo Consultoria'}
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_COMPANIES.map(company => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedCompany(company)}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-800">{company.name}</h3>
                        <p className="text-sm text-slate-500">{company.segment}</p>
                      </div>
                      <Badge variant={company.status === 'Ativo' ? 'default' : 'secondary'}>
                        {company.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Score ESG</span>
                        <span className="text-2xl font-bold text-blue-600">{company.esgScore}</span>
                      </div>
                      <Progress value={company.esgScore} className="h-2" />

                      <div className="pt-3 border-t flex justify-between text-sm">
                        <span className="text-slate-600">Colaboradores</span>
                        <span className="font-medium">{company.employees}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4" size="sm">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      Acessar Painel
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ESGManagementSystem;
