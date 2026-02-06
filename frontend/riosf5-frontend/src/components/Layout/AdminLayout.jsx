import { useMemo, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Dashboard from '../Dashboard/Dashboard'
import EmpresasPage from '../Empresas/EmpresasPage'
import TreinamentosPage from '../Treinamentos/TreinamentosPage'
import UsuariosPage from '../Usuarios/UsuariosPage'
import ConfiguracoesPage from '../Configuracoes/ConfiguracoesPage'
import FormularioPage from '../Formulario/FormularioPage'
import RioPage from '../Rio/RioPage'
import ChecklistPage from '../Checklist/ChecklistPage'
import DocumentosPage from '../Documentos/DocumentosPage'
import AgendaPage from '../Agenda/AgendaPage'
import MobilePage from '../Mobile/MobilePage'
import TestesPage from '../Testes/TestesPage'
import PerfilPage from '../Perfil/PerfilPage'
import ESGPage from '../ESG/ESGPage'

export default function AdminLayout({ user, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  /**
   * currentPage = rota “desktop”
   * mobileRoute = rota “rodando dentro do celular”
   */
  const [currentPage, setCurrentPage] = useState('/dashboard')
  const [mobileRoute, setMobileRoute] = useState('/dashboard')

  const isMobileMode = currentPage === '/mobile'

  // Rotas liberadas no modo usuário (Mobile) — inclui ESG
  const allowedInMobileMode = useMemo(
    () =>
      new Set([
        '/dashboard',
        '/treinamentos',
        '/documentos',
        '/agenda',
        '/checklist',
        '/testes',
        '/formulario',
        '/rio',
        '/perfil',
        '/esg',
      ]),
    []
  )

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  const handleNavigation = (path) => {
    // Se está no modo mobile, NÃO troca o desktop — troca somente a tela dentro do celular
    if (isMobileMode) {
      if (!allowedInMobileMode.has(path)) return
      setMobileRoute(path)
      return
    }

    // Navegação normal (desktop)
    setCurrentPage(path)

    // Quando entrar no /mobile, inicia o “celular” no dashboard
    if (path === '/mobile') {
      setMobileRoute('/dashboard')
    }
  }

  const renderDesktopPage = () => {
    switch (currentPage) {
      case '/dashboard':
        return <Dashboard />
      case '/empresas':
        return <EmpresasPage />
      case '/usuarios':
        return <UsuariosPage />
      case '/treinamentos':
        return <TreinamentosPage />
      case '/documentos':
        return <DocumentosPage />
      case '/agenda':
        return <AgendaPage />
      case '/checklist':
        return <ChecklistPage />
      case '/testes':
        return <TestesPage />
      case '/formulario':
        return <FormularioPage />
      case '/rio':
        return <RioPage />
      case '/perfil':
        return <PerfilPage />
      case '/esg':
        return <ESGPage onNavigate={handleNavigation} />
      case '/configuracoes':
        return <ConfiguracoesPage />
      default:
        return <Dashboard />
    }
  }

  const renderMobileInnerPage = () => {
    // Só conteúdo, sem sidebar/header do desktop
    switch (mobileRoute) {
      case '/dashboard':
        return <Dashboard />
      case '/treinamentos':
        return <TreinamentosPage />
      case '/documentos':
        return <DocumentosPage />
      case '/agenda':
        return <AgendaPage />
      case '/checklist':
        return <ChecklistPage />
      case '/testes':
        return <TestesPage />
      case '/formulario':
        return <FormularioPage />
      case '/rio':
        return <RioPage />
      case '/perfil':
        return <PerfilPage />
      case '/esg':
        return <ESGPage onNavigate={handleNavigation} />
      default:
        return <Dashboard />
    }
  }

  // ====== MODO MOBILE: só mostra o “desenho do celular” com o app rodando dentro ======
  if (isMobileMode) {
    return (
      <div className="h-screen bg-slate-50">
        <MobilePage
          // Navegação do menu do celular
          onNavigate={handleNavigation}
          // Página “rodando” dentro do celular
          mobileRoute={mobileRoute}
          // Render do conteúdo dentro do celular
          renderMobileContent={renderMobileInnerPage}
          // Sair do modo mobile e voltar pro desktop
          onExitMobile={() => setCurrentPage('/dashboard')}
          allowedRoutes={[...allowedInMobileMode]}
        />
      </div>
    )
  }

  // ====== DESKTOP NORMAL ======
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={onLogout}
          onNavigate={setCurrentPage}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50">{renderDesktopPage()}</main>
      </div>
    </div>
  )
}
