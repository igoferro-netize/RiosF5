import React, { useMemo, useState } from 'react'
import {
  Apple,
  PlayCircle,
  ArrowLeft,
  LayoutDashboard,
  GraduationCap,
  FileText,
  Calendar,
  CheckSquare,
  ClipboardList,
  Leaf,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'

export default function MobilePage({
  onExitMobile,
  onNavigate,
  mobileRoute,
  renderMobileContent,
  allowedRoutes = [],
}) {
  const [platform, setPlatform] = useState('ios')

  const menuItems = useMemo(
    () => [
      { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { title: 'Treinamentos', icon: GraduationCap, path: '/treinamentos' },
      { title: 'Documentos', icon: FileText, path: '/documentos' },
      { title: 'Agenda', icon: Calendar, path: '/agenda' },
      { title: 'CheckList', icon: CheckSquare, path: '/checklist' },
      { title: 'Testes', icon: ClipboardList, path: '/testes' },
      { title: 'Formulário', icon: FileText, path: '/formulario' },
      { title: 'Rio', icon: FileText, path: '/rio' },
      { title: 'ESG', icon: Leaf, path: '/esg' },
      { title: 'Perfil', icon: User, path: '/perfil' },
    ],
    []
  )

  const allowed = useMemo(() => new Set(allowedRoutes), [allowedRoutes])
  const safeMenu = useMemo(() => menuItems.filter(i => !allowed.size || allowed.has(i.path)), [menuItems, allowed])

  const MobileTopBar = () => (
    <div className="h-12 bg-blue-900 text-white flex items-center justify-between px-4">
      <div className="text-xs opacity-90">9:41</div>
      <div className="text-xs font-semibold">
        {safeMenu.find(i => i.path === mobileRoute)?.title || 'App'}
      </div>
      <div className="text-xs opacity-90">100%</div>
    </div>
  )

  const MobileMenu = () => (
    <div className="p-3 space-y-2">
      {safeMenu.map((item) => {
        const Icon = item.icon
        const active = item.path === mobileRoute
        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`w-full text-left px-3 py-2 rounded-xl border transition ${
              active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-blue-700'}`} />
                <span className="text-sm font-semibold">{item.title}</span>
              </div>
              <span className={`text-xs ${active ? 'text-white/80' : 'text-slate-400'}`}>Abrir</span>
            </div>
          </button>
        )
      })}
    </div>
  )

  // Conteúdo real do sistema dentro do frame (sem Sidebar/Header desktop)
  const MobileAppArea = () => (
    <div className="h-full bg-gradient-to-br from-blue-50 to-slate-50 overflow-y-auto">
      <MobileTopBar />
      <div className="p-3">
        {/* Menu do app (modo usuário) */}
        <div className="mb-3">
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Menu</div>
          <MobileMenu />
        </div>

        {/* Tela real renderizada */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <div className="text-sm font-semibold text-slate-700">
              {safeMenu.find(i => i.path === mobileRoute)?.title || 'Tela'}
            </div>
          </div>

          {/* IMPORTANTE:
              aqui renderiza o conteúdo real (Dashboard, Checklist, ESG etc.)
              sem o header/sidebar desktop
           */}
          <div className="p-3">
            {renderMobileContent()}
          </div>
        </div>
      </div>
    </div>
  )

  const PhoneFrameIOS = () => (
    <div className="relative">
      <div className="w-80 h-[620px] bg-black rounded-[3rem] p-4 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10" />
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
          <MobileAppArea />
        </div>
      </div>
    </div>
  )

  const PhoneFrameAndroid = () => (
    <div className="relative">
      <div className="w-80 h-[620px] bg-slate-800 rounded-3xl p-3 shadow-2xl">
        <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
          <MobileAppArea />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900 flex items-center justify-center">
            <div className="w-24 h-1 bg-white/80 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header fora do celular (modo desktop) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onExitMobile} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Sair do modo mobile</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Modo Mobile (Simulador)</h1>
            <p className="text-slate-600 mt-1">
              Rodando o sistema dentro de um frame de celular (sem Sidebar/Header do desktop)
            </p>
          </div>
        </div>
      </div>

      {/* Seleção iOS / Android */}
      <Tabs value={platform} onValueChange={setPlatform}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="ios">
            <Apple className="w-4 h-4 mr-2" />
            iOS
          </TabsTrigger>
          <TabsTrigger value="android">
            <PlayCircle className="w-4 h-4 mr-2" />
            Android
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Visualização iOS</CardTitle>
                  <CardDescription>Simulador com navegação e telas reais</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
                  <PhoneFrameIOS />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Atalho de navegação</CardTitle>
                  <CardDescription>Você está em: {mobileRoute}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  No modo mobile, o usuário só acessa telas de operação (consulta, anexar e baixar).
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="android" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Visualização Android</CardTitle>
                  <CardDescription>Simulador com navegação e telas reais</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
                  <PhoneFrameAndroid />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Atalho de navegação</CardTitle>
                  <CardDescription>Você está em: {mobileRoute}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  No modo mobile, o menu abre as mesmas rotas liberadas (inclui ESG).
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
