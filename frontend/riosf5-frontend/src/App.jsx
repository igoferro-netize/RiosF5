import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react'
import AdminLayout from './components/Layout/AdminLayout'
import logoRios from './assets/rios_f5_consultoria_logo.jpeg'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  // Aplicar tema claro por padrão e verificar autenticação
  useEffect(() => {
    // Aplicar tema claro
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
    
    const token = localStorage.getItem('riosf5_token')
    const userData = localStorage.getItem('riosf5_user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('riosf5_token')
        localStorage.removeItem('riosf5_user')
      }
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    try {
      // Verificar credenciais do usuário master
      if (email === 'riosf5consultoria@gmail.com' && senha === 'Adminrios123') {
        const userData = {
          id: 1,
          nome: 'Super Administrador',
          email: email,
          tipo: 'super_admin',
          perfil: 'Super Administrador',
          permissoes: ['dashboard', 'empresas', 'usuarios', 'treinamentos', 'configuracoes', 'financeiro', 'logs', 'backup', 'mobile']
        }
        
        // Salvar dados
        localStorage.setItem('riosf5_token', 'token_super_admin')
        localStorage.setItem('riosf5_user', JSON.stringify(userData))
        
        setUser(userData)
        setIsAuthenticated(true)
      } else if (email && senha) {
        // Login para outros usuários (simulado)
        const userData = {
          id: 2,
          nome: 'Usuário RiosF5',
          email: email,
          tipo: 'usuario',
          perfil: 'Usuário',
          permissoes: ['dashboard', 'treinamentos']
        }
        
        localStorage.setItem('riosf5_token', 'token_usuario')
        localStorage.setItem('riosf5_user', JSON.stringify(userData))
        
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        setErro('Email ou senha incorretos')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setErro('Erro de conexão com o servidor')
    } finally {
      setCarregando(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('riosf5_token')
    localStorage.removeItem('riosf5_user')
    setUser(null)
    setIsAuthenticated(false)
    setEmail('')
    setSenha('')
  }

  const handleEsqueceuSenha = () => {
    // TODO: Implementar recuperação de senha
    alert('Funcionalidade de recuperação de senha em desenvolvimento')
  }

  // Se autenticado, mostrar layout administrativo
  if (isAuthenticated) {
    return <AdminLayout user={user} onLogout={handleLogout} />
  }

  // Caso contrário, mostrar tela de login com tema claro
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Efeito de fundo com partículas suaves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-100/30 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 riosf5-card shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src={logoRios} 
              alt="RiosF5 Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Bem-vindo ao RiosF5
            </CardTitle>
            <CardDescription className="text-slate-600">
              Sistema de Treinamento e Controle de Documentos
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 riosf5-input border-slate-200 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-slate-700 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="pl-10 pr-10 riosf5-input border-slate-200 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200">
                {erro}
              </div>
            )}

            {/* Botão de Login */}
            <Button
              type="submit"
              className="w-full riosf5-button bg-blue-600 hover:bg-blue-700 text-white"
              disabled={carregando}
            >
              {carregando ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Entrar</span>
                </div>
              )}
            </Button>

            {/* Link Esqueceu Senha */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleEsqueceuSenha}
                className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
