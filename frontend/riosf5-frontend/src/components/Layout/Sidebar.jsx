import { useState } from 'react'
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Calendar,
  CheckSquare,
  ClipboardList,
  Settings,
  ChevronLeft,
  Menu,
  Smartphone,
  Leaf,
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import logoRios from '../../assets/rios_f5_consultoria_logo.jpeg'

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'Treinamentos', icon: GraduationCap, path: '/treinamentos' },
  { title: 'Documentos', icon: FileText, path: '/documentos' },
  { title: 'Agenda', icon: Calendar, path: '/agenda' },
  { title: 'CheckList', icon: CheckSquare, path: '/checklist' },
  { title: 'Testes', icon: ClipboardList, path: '/testes' },
  { title: 'Formulário', icon: FileText, path: '/formulario' },
  { title: 'Rio', icon: FileText, path: '/rio' },

  // ESG deve aparecer na aba lateral
  { title: 'ESG', icon: Leaf, path: '/esg' },

  { title: 'Mobile', icon: Smartphone, path: '/mobile' },
  { title: 'Configurações', icon: Settings, path: '/configuracoes' },
]

export default function Sidebar({ collapsed, onToggle, currentPage, onNavigate }) {
  const [sidebarState, setSidebarState] = useState('expanded') // 'expanded', 'collapsed', 'minimized'

  const handleItemClick = (path) => {
    onNavigate(path)
  }

  const handleLogoClick = () => {
    onNavigate('/dashboard')
  }

  const handleToggle = () => {
    if (sidebarState === 'expanded') {
      setSidebarState('collapsed')
    } else if (sidebarState === 'collapsed') {
      setSidebarState('minimized')
    } else {
      setSidebarState('expanded')
    }
  }

  const getSidebarWidth = () => {
    switch (sidebarState) {
      case 'expanded':
        return 'w-64'
      case 'collapsed':
        return 'w-16'
      case 'minimized':
        return 'w-0'
      default:
        return 'w-64'
    }
  }

  return (
    <div
      className={`riosf5-sidebar h-screen transition-all duration-300 ${getSidebarWidth()} flex flex-col overflow-hidden bg-blue-900 text-white border-r border-slate-200 shadow-sm`}
    >
      {/* Header */}
      <div className="p-6 border-b border-blue-800 bg-blue-900 text-white">
        <div className="flex items-center justify-between">
          {sidebarState === 'expanded' && (
            <div
              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              <img
                src={logoRios}
                alt="RiosF5"
                className="h-16 w-16 object-contain rounded transition-all duration-300 hover:scale-110"
              />
            </div>
          )}

          {sidebarState !== 'minimized' && (
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="text-white hover:bg-blue-800 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-180"
                title={sidebarState === 'expanded' ? 'Recolher sidebar' : 'Minimizar completamente'}
              >
                <ChevronLeft
                  className={`h-4 w-4 transition-transform duration-300 ${
                    sidebarState === 'collapsed' ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </div>
          )}

          {sidebarState === 'collapsed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogoClick}
              className="text-white hover:bg-blue-800 hover:text-white p-1 transition-all duration-300 hover:scale-110 hover:rotate-6"
              title="Ir para Dashboard"
            >
              <img
                src={logoRios}
                alt="RiosF5"
                className="h-8 w-8 object-contain rounded transition-all duration-300"
              />
            </Button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      {sidebarState !== 'minimized' && (
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.path

            return (
              <button
                key={item.path}
                onClick={() => handleItemClick(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 group transform hover:scale-105 hover:shadow-lg ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-white hover:bg-blue-800 hover:text-white'
                }`}
                title={sidebarState === 'collapsed' ? item.title : ''}
              >
                <Icon
                  className={`h-5 w-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 ${
                    isActive ? 'text-white animate-pulse' : 'text-white group-hover:text-white'
                  }`}
                />

                {sidebarState === 'expanded' && <span className="font-medium text-sm">{item.title}</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* Botão para reabrir quando minimizado */}
      {sidebarState === 'minimized' && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
          <Button
            variant="default"
            size="sm"
            onClick={handleToggle}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg rounded-l-none shadow-lg"
            title="Expandir sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
