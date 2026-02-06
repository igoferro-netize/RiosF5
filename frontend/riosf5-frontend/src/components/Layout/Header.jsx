import { useState } from 'react'
import { 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import logoRios from '../../assets/rios_f5_consultoria_logo.jpeg'

export default function Header({ user, onToggleSidebar, onLogout, onNavigate }) {
  const [notifications] = useState([
    { id: 1, title: 'Novo treinamento disponível', time: '5 min' },
    { id: 2, title: 'Empresa XYZ cadastrada', time: '1 hora' },
    { id: 3, title: 'Certificado gerado', time: '2 horas' }
  ])

  return (
    <header className="bg-blue-900 border-b border-blue-950 h-16 flex items-center justify-between px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden text-white hover:bg-blue-500/20"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img 
            src={logoRios} 
            alt="RiosF5" 
            className="h-12 w-12 object-contain rounded transition-all duration-300 hover:scale-110"
          />
          <div className="hidden md:block">
            <h1 className="text-white font-semibold text-lg">Sistema RiosF5</h1>
            <p className="text-blue-100 text-sm">Treinamento e Controle de Documentos</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-white hover:bg-blue-500/20">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs border-2 border-blue-600">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white border border-slate-200 shadow-lg">
            <DropdownMenuLabel className="text-slate-800">Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 hover:bg-slate-50">
                <div className="font-medium text-slate-800">{notification.title}</div>
                <div className="text-sm text-slate-600">{notification.time} atrás</div>
              </DropdownMenuItem>
            ))}
            {notifications.length === 0 && (
              <DropdownMenuItem disabled className="text-slate-500">
                Nenhuma notificação
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-blue-500/20">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white">{user?.nome || 'Usuário'}</div>
                <div className="text-xs text-blue-100 capitalize">{user?.perfil || 'admin'}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg">
            <DropdownMenuLabel className="text-slate-800">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onNavigate && onNavigate('/perfil')}
              className="text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onNavigate && onNavigate('/configuracoes')}
              className="text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

