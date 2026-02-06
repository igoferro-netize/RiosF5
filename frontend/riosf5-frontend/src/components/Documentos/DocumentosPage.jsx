import { useState, useMemo, useRef, useEffect } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import QRCode from 'qrcode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import {
  Car,
  Plus, Search, FileText, Edit, Trash2, Download, User, Building, Folder, FolderOpen,
  AlertTriangle, Clock, Share, List, MoreVertical, Lock, Shield,
  Settings, Home, Briefcase, Grid3X3,
  FileImage, FileVideo, Music, Menu, Eye, FolderPlus, FileSignature, Award,
  ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
  AlertCircle, FileCheck, Hourglass, Users, MapPin, Palette, Type,
  FileUp, MessageCircle, Key, UserCog, Star, Heart, CheckCircle, XCircle, Clock4,
  Mail, QrCode, FilePieChart, History, Send, RefreshCw, Bell, BellRing
} from 'lucide-react'

/* =========================
   Helper: seleção por cor
========================= */
const selectionByColor = (cor) => {
  const map = {
    blue:   { ring: 'ring-blue-600',   bg: 'bg-blue-100',   text: 'text-blue-800' },
    green:  { ring: 'ring-green-600',  bg: 'bg-green-100',  text: 'text-green-800' },
    orange: { ring: 'ring-orange-600', bg: 'bg-orange-100', text: 'text-orange-800' },
    red:    { ring: 'ring-red-600',    bg: 'bg-red-100',    text: 'text-red-800' },
    purple: { ring: 'ring-purple-600', bg: 'bg-purple-100', text: 'text-purple-800' },
    yellow: { ring: 'ring-yellow-600', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    indigo: { ring: 'ring-indigo-600', bg: 'bg-indigo-100', text: 'text-indigo-800' },
    pink:   { ring: 'ring-pink-600',   bg: 'bg-pink-100',   text: 'text-pink-800' },
    gray:   { ring: 'ring-gray-600',   bg: 'bg-gray-100',   text: 'text-gray-800' }
  }
  return map[cor] || map.gray
}

/* =========================
   TreeView (Sidebar)
========================= */
const TreeItem = ({
  pasta,
  nivel = 0,
  onSelect,
  pastaSelecionadaId,
  onEdit,
  onDelete,
  onAddSubpasta,
  expandidas,
  toggleExpand,
  getIconComponent
}) => {
  const isExpanded = expandidas.has(pasta.id)
  const isSelected = pastaSelecionadaId === pasta.id
  const hasChildren = pasta.children && pasta.children.length > 0

  const sizeByLevel = (n) => {
    if (n === 0) return 'text-sm py-1.5'
    if (n === 1) return 'text-xs py-1'
    return 'text-[11px] py-0.5'
  }

  const iconSizeByLevel = (n) => {
    if (n === 0) return 'h-4 w-4'
    if (n === 1) return 'h-3.5 w-3.5'
    return 'h-3 w-3'
  }

  const sel = selectionByColor(pasta.cor)

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 hover:bg-gray-100 cursor-pointer rounded group ${sizeByLevel(nivel)} ${
          isSelected ? `${sel.bg} ${sel.text}` : ''
        }`}
        style={{ paddingLeft: `${nivel * 14 + 8}px` }}
        onDoubleClick={() => toggleExpand(pasta.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleExpand(pasta.id)
            }}
            className="p-0 hover:bg-gray-200 rounded"
            title={isExpanded ? 'Recolher' : 'Expandir'}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-3" />
        )}

        <div className="flex items-center gap-1 flex-1 min-w-0 w-full" onClick={() => onSelect(pasta)}>
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className={`${iconSizeByLevel(nivel)} flex-shrink-0`} />
            ) : (
              <Folder className={`${iconSizeByLevel(nivel)} flex-shrink-0`} />
            )
          ) : (
            getIconComponent(pasta.icon, `${iconSizeByLevel(nivel)} flex-shrink-0`)
          )}

          <TextoDuasLinhas text={pasta.nome} limit={25} />
          <span className="text-xs text-gray-500 flex-shrink-0">
            ({pasta.documentos || 0} docs | {pasta.subpastas || 0} sub)
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 ml-auto opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onAddSubpasta(pasta)
              }}
            >
              <FolderPlus className="h-3 w-3 mr-2" />
              Nova Subpasta
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onEdit(pasta)
              }}
            >
              <Edit className="h-3 w-3 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete(pasta.id)
              }}
              className="text-red-600"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {pasta.children.map((child) => (
            <TreeItem
              key={child.id}
              pasta={child}
              nivel={nivel + 1}
              onSelect={onSelect}
              pastaSelecionadaId={pastaSelecionadaId}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubpasta={onAddSubpasta}
              expandidas={expandidas}
              toggleExpand={toggleExpand}
              getIconComponent={getIconComponent}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* =========================
   Breadcrumb
========================= */
const Breadcrumb = ({ caminhoPastas, pastas, onNavigate }) => {
  if (!caminhoPastas || caminhoPastas.length === 0) return null

  const caminhoObjs = caminhoPastas
    .map((id) => pastas.find((p) => p.id === id))
    .filter(Boolean)

  return (
    <div className="flex items-center gap-1 text-sm flex-wrap">
      <button onClick={() => onNavigate([])} className="flex items-center gap-1 hover:text-blue-600 text-gray-600">
        <Home className="h-3 w-3" />
      </button>

      {caminhoObjs.map((p, idx) => (
        <div key={p.id} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <button
            onClick={() => onNavigate(caminhoPastas.slice(0, idx + 1))}
            className={`hover:text-blue-600 ${idx === caminhoObjs.length - 1 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
          >
            {p.nome}
          </button>
        </div>
      ))}
    </div>
  )
}

/* =========================
   Componente para pastas primárias
========================= */
const PastaPrimaria = ({
  pasta,
  selecionada,
  onClick,
  getIconComponent,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddSubpasta,
  onDownload,
  onShare
}) => {
  const getPastaColor = (cor) => {
    const cores = {
      blue: 'border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100',
      green: 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100',
      orange: 'border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100',
      red: 'border-red-400 bg-red-50 text-red-700 hover:bg-red-100',
      purple: 'border-purple-400 bg-purple-50 text-purple-700 hover:bg-purple-100',
      yellow: 'border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      indigo: 'border-indigo-400 bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
      pink: 'border-pink-400 bg-pink-50 text-pink-700 hover:bg-pink-100',
      gray: 'border-gray-400 bg-gray-50 text-gray-700 hover:bg-gray-100'
    }
    return cores[cor] || cores.gray
  }

  const sel = selectionByColor(pasta.cor)

  return (
    <div
      className={`p-4 mt-2 mb-2 mx-2 rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer flex-shrink-0 w-64 ${getPastaColor(pasta.cor)} ${
        selecionada ? `ring-4 ${sel.ring} shadow-2xl scale-105 z-10 ring-offset-2 ring-offset-white` : ''
      }`}
      onClick={onClick}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onToggleExpand()
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-shrink-0">
          {getIconComponent(pasta.icon, 'h-8 w-8')}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm">
            <TextoDuasLinhas text={pasta.nome} limit={25} />
          </h3>
          <p className="text-xs opacity-75">{pasta.descricao || 'Sem descrição'}</p>
          <div className="mt-2 flex gap-2">
            <span className="text-[10px] bg-white/50 px-1.5 py-0.5 rounded-full font-medium">
              {pasta.documentos || 0} docs
            </span>
            <span className="text-[10px] bg-white/50 px-1.5 py-0.5 rounded-full font-medium">
              {pasta.subpastas || 0} sub
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
          {pasta.subpastas > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onToggleExpand()
              }}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAddSubpasta(pasta) }}>
                <FolderPlus className="h-3 w-3 mr-2" />
                Nova Subpasta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload(pasta) }}>
                <Download className="h-3 w-3 mr-2" />
                Baixar Pasta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(pasta) }}>
                <Share className="h-3 w-3 mr-2" />
                Compartilhar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(pasta) }}>
                <Edit className="h-3 w-3 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(pasta.id) }} className="text-red-600">
                <Trash2 className="h-3 w-3 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

/* =========================
   Subpasta Item (até 4 níveis)
========================= */
const SubpastaItem = ({
  pasta,
  selecionada,
  onClick,
  getIconComponent,
  nivel = 1,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddSubpasta,
  onDownload,
  onShare
}) => {
  const getPastaColorTransparente = (cor) => {
    const cores = {
      blue: 'border-blue-300 bg-blue-50/50 text-blue-600 hover:bg-blue-50',
      green: 'border-green-300 bg-green-50/50 text-green-600 hover:bg-green-50',
      orange: 'border-orange-300 bg-orange-50/50 text-orange-600 hover:bg-orange-50',
      red: 'border-red-300 bg-red-50/50 text-red-600 hover:bg-red-50',
      purple: 'border-purple-300 bg-purple-50/50 text-purple-600 hover:bg-purple-50',
      yellow: 'border-yellow-300 bg-yellow-50/50 text-yellow-600 hover:bg-yellow-50',
      indigo: 'border-indigo-300 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-50',
      pink: 'border-pink-300 bg-pink-50/50 text-pink-600 hover:bg-pink-50',
      gray: 'border-gray-300 bg-gray-50/50 text-gray-600 hover:bg-gray-50'
    }
    return cores[cor] || cores.gray
  }

  const indentacao = nivel * 32
  const sel = selectionByColor(pasta.cor)

  return (
    <div
      className={`p-3 rounded-md border cursor-pointer transition-all hover:shadow-lg ${getPastaColorTransparente(pasta.cor)} ${
        selecionada ? `ring-2 ${sel.ring} ${sel.bg} ${sel.text} shadow-lg ring-offset-2 ring-offset-white` : ''
      }`}
      style={{ marginLeft: `${indentacao}px` }}
      onClick={onClick}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onToggleExpand()
      }}
    >
      <div className="flex items-center gap-2 w-full">

        {/* Esquerda: seta + ícone + nome + badge */}
        <div className="flex items-center gap-2 min-w-0">
          {pasta.subpastas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onToggleExpand()
              }}
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          )}

          {getIconComponent(pasta.icon, 'h-5 w-5')}

          <span className="font-medium text-sm">
            <TextoDuasLinhas text={pasta.nome} limit={20} />
          </span>

          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600 font-medium flex-shrink-0">
            ({pasta.documentos || 0} docs | {pasta.subpastas || 0} sub)
          </span>
        </div>

        {/* Direita: menu fixo */}
        <div className="ml-auto flex items-center flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAddSubpasta(pasta) }}>
                <FolderPlus className="h-3 w-3 mr-2" />
                Nova Subpasta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload(pasta) }}>
                <Download className="h-3 w-3 mr-2" />
                Baixar Pasta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(pasta) }}>
                <Share className="h-3 w-3 mr-2" />
                Compartilhar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(pasta) }}>
                <Edit className="h-3 w-3 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(pasta.id) }} className="text-red-600">
                <Trash2 className="h-3 w-3 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

/* =========================
   Dashboard Card
========================= */
const DashboardCard = ({ titulo, valor, icone: Icon, cor, ativo, onClick }) => {
  const coresMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
    orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
  }

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${ativo ? 'ring-2 ring-blue-500 shadow-md' : ''} ${coresMap[cor]}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium">{titulo}</span>
        </div>
      </div>
      <div className="text-3xl font-bold">{valor}</div>
    </div>
  )
}

/* =========================
   Helper: Quebra texto em até 2 linhas
========================= */
const TextoDuasLinhas = ({ text, limit = 25, className = "" }) => {
  const t = String(text ?? "")
  const l1 = t.slice(0, limit)
  const l2 = t.slice(limit, limit * 2)

  return (
    <span className={`whitespace-normal break-words leading-4 ${className}`}>
      {t.length <= limit ? (
        l1
      ) : (
        <>
          {l1}
          <br />
          {l2}
        </>
      )}
    </span>
  )
}

/* =========================
   Componente Aprovação Card
========================= */
const AprovacaoCard = ({ documento, usuarioAtual, onVisualizar, onReenviar, getIconComponent }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprovado': return 'bg-green-500 text-white'
      case 'Reprovado': return 'bg-red-500 text-white'
      case 'Pendente': return 'bg-yellow-500 text-white'
      case 'Em análise': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getProgresso = () => {
    const total = documento.aprovadores?.length || 0
    const aprovados = documento.historicoAprovacao?.filter(h => h.status === 'Aprovado').length || 0
    return total > 0 ? Math.round((aprovados / total) * 100) : 0
  }

  return (
    <Card className="hover:shadow-md transition-shadow relative">
      {documento.aprovadores?.some(a => a.email === usuarioAtual?.email) && 
       !documento.historicoAprovacao?.some(h => h.email === usuarioAtual?.email) && (
        <div className="absolute -top-2 -right-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIconComponent(documento.icon, 'h-5 w-5 text-blue-600')}
            <div>
              <h4 className="font-medium text-sm">{documento.nome}</h4>
              <p className="text-xs text-gray-500">Criado: {new Date(documento.dataCriacao).toLocaleDateString()}</p>
            </div>
          </div>
          <Badge className={`text-xs ${getStatusColor(documento.statusAprovacao)}`}>
            {documento.statusAprovacao}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progresso</span>
            <span>{getProgresso()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all" 
              style={{ width: `${getProgresso()}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Aprovadores:</p>
          <div className="space-y-1">
            {documento.aprovadores?.map((aprovador, idx) => {
              const historico = documento.historicoAprovacao?.find(h => h.email === aprovador.email)
              return (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-gray-500" />
                    <span>{aprovador.nome}</span>
                  </div>
                  {historico ? (
                    <Badge className={`text-[10px] ${getStatusColor(historico.status)}`}>
                      {historico.status}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">Pendente</Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={() => onVisualizar(documento)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Visualizar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0"
            onClick={() => onReenviar(documento)}
            title="Reenviar convite"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* =========================
   Componente Visualização Aprovação
========================= */
const VisualizacaoAprovacao = ({ documento, onClose, onAprovar, usuarioAtual }) => {
  const [comentario, setComentario] = useState('')
  const [acao, setAcao] = useState('') // Começar vazio para forçar seleção
  const [assinatura, setAssinatura] = useState('')

  const historicoAtual = documento.historicoAprovacao?.find(
    h => h.email === usuarioAtual?.email
  )

  const podeAprovar = () => {
    const souAprovador = documento.aprovadores?.some(a => a.email === usuarioAtual?.email)
    const jaAprovei = documento.historicoAprovacao?.some(h => h.email === usuarioAtual?.email)
    
    if (!souAprovador || jaAprovei) return false
    
    if (documento.fluxoAprovacao?.sequencial) {
      // Encontrar minha posição na lista
      const minhaPosicao = documento.aprovadores?.findIndex(a => a.email === usuarioAtual?.email)
      if (minhaPosicao === 0) return true // Primeiro da lista
      
      // Verificar se todos anteriores aprovaram
      const anteriores = documento.aprovadores?.slice(0, minhaPosicao)
      const todosAnterioresAprovaram = anteriores?.every(aprovador => 
        documento.historicoAprovacao?.some(h => 
          h.email === aprovador.email && h.status === 'Aprovado'
        )
      )
      
      return todosAnterioresAprovaram
    }
    
    return true // Se não é sequencial, pode aprovar a qualquer momento
  }

  const handleSubmit = () => {
    if (!acao) {
      alert('Por favor, selecione uma ação (Aprovar, Reprovar ou Em análise)')
      return
    }

    if (!assinatura.trim()) {
      alert('Por favor, insira sua assinatura')
      return
    }

    // Usar status diretamente com as strings corretas
    const statusMap = {
      'aprovado': 'Aprovado',
      'reprovado': 'Reprovado',
      'em_analise': 'Em análise'
    }

    onAprovar({
      documentoId: documento.id,
      aprovadorId: usuarioAtual.id,
      aprovadorNome: usuarioAtual.nome,
      aprovadorEmail: usuarioAtual.email,
      status: statusMap[acao] || acao, // Usar o mapeamento
      comentario,
      assinatura,
      data: new Date().toISOString()
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Aprovação de Documento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cabeçalho */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">{documento.nome}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Tipo:</span>
                <span className="ml-2 font-medium">{documento.tipo}</span>
              </div>
              <div>
                <span className="text-gray-600">Criado em:</span>
                <span className="ml-2 font-medium">
                  {new Date(documento.dataCriacao).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Fornecedor:</span>
                <span className="ml-2 font-medium">{documento.fornecedorNome}</span>
              </div>
              <div>
                <span className="text-gray-600">Valor:</span>
                <span className="ml-2 font-medium">{documento.valorContrato || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Progresso */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Progresso da Aprovação</h4>
            <div className="space-y-3">
              {documento.aprovadores?.map((aprovador, idx) => {
                const historico = documento.historicoAprovacao?.find(h => h.email === aprovador.email)
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{aprovador.nome}</p>
                        <p className="text-xs text-gray-500">{aprovador.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {historico ? (
                        <>
                          <Badge className={getStatusColor(historico.status)}>
                            {historico.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(historico.data).toLocaleDateString()}
                          </p>
                        </>
                      ) : (
                        <Badge variant="outline">Aguardando</Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Histórico */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Histórico de Aprovações</h4>
            {documento.historicoAprovacao?.length > 0 ? (
              <div className="space-y-2">
                {documento.historicoAprovacao.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <div className={`p-1 rounded ${item.status === 'Aprovado' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {item.status === 'Aprovado' ? 
                        <CheckCircle className="h-4 w-4 text-green-600" /> : 
                        <XCircle className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.aprovadorNome}</p>
                      <p className="text-sm text-gray-600">{item.comentario || 'Sem comentário'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.data).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma aprovação registrada ainda</p>
            )}
          </div>

          {/* Ação do usuário atual */}
          {historicoAtual ? (
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Você já aprovou este documento</h4>
              </div>
              <p className="text-sm">
                Status: <span className="font-medium">{historicoAtual.status}</span>
              </p>
              {historicoAtual.comentario && (
                <p className="text-sm mt-1">Comentário: {historicoAtual.comentario}</p>
              )}
              <p className="text-xs text-gray-600 mt-2">
                Data: {new Date(historicoAtual.data).toLocaleString()}
              </p>
            </div>
          ) : podeAprovar() ? (
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium mb-3">Sua Aprovação</h4>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Ação *</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      type="button"
                      variant={acao === 'aprovado' ? 'default' : 'outline'}
                      onClick={() => setAcao('aprovado')}
                      className={`h-10 ${acao === 'aprovado' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      type="button"
                      variant={acao === 'reprovado' ? 'default' : 'outline'}
                      onClick={() => setAcao('reprovado')}
                      className={`h-10 ${acao === 'reprovado' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reprovar
                    </Button>
                    <Button
                      type="button"
                      variant={acao === 'em_analise' ? 'default' : 'outline'}
                      onClick={() => setAcao('em_analise')}
                      className={`h-10 ${acao === 'em_analise' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    >
                      <Clock4 className="h-4 w-4 mr-2" />
                      Em análise
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Comentário (opcional)</Label>
                  <Textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Digite um comentário sobre sua decisão..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Assinatura *</Label>
                  <Input
                    value={assinatura}
                    onChange={(e) => setAssinatura(e.target.value)}
                    placeholder="Digite sua assinatura para confirmar"
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sua assinatura será registrada no documento
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1" 
                    disabled={!assinatura.trim() || !acao}
                  >
                    Confirmar {acao === 'aprovado' ? 'Aprovação' : acao === 'reprovado' ? 'Reprovação' : 'Análise'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border rounded-lg bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock4 className="h-5 w-5 text-yellow-600" />
                <h4 className="font-medium">Aguardando aprovação anterior</h4>
              </div>
              <p className="text-sm mt-1">
                Sua aprovação será solicitada após a conclusão das aprovações anteriores.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DocumentosPageCompleto() {
  /* =========================
     Estados principais
  ========================= */
  const [documentos, setDocumentos] = useState([
    {
      id: 1,
      nome: 'CRLV - ABC1234',
      tipo: 'Veículo',
      status: 'Ativo',
      dataVencimento: '2024-12-30',
      pastaId: 1,
      icon: 'car',
      protegido: true,
      senha: '123456',
      controlado: false,
      selecionado: false,
      fornecedorNome: 'DETRAN-SP',
      fornecedorTipo: 'Órgão Público',
      fornecedorCnpjCpf: '46.374.500/0001-19',
      fornecedorResponsavel: 'João Silva',
      localizacaoFisica: 'Arquivo Central - Gaveta A1',
      alertaLGPD: false,
      diasParaVencimento: 30,
      observacoes: 'Documento do veículo da frota - Protegido por senha',
      arquivo: '/documentos_teste/crlv_abc1234.pdf',
      requerAprovacao: true,
      statusAprovacao: 'Aprovado',
      aprovadores: [
        { id: 1, nome: 'Maria Silva', email: 'maria.silva@empresa.com', ordem: 1 },
        { id: 2, nome: 'Carlos Santos', email: 'carlos.santos@empresa.com', ordem: 2 }
      ],
      historicoAprovacao: [
        {
          id: 1,
          aprovadorId: 1,
          aprovadorNome: 'Maria Silva',
          aprovadorEmail: 'maria.silva@empresa.com',
          status: 'Aprovado',
          comentario: 'Documento em conformidade',
          assinatura: 'Maria Silva',
          data: '2024-01-15T10:30:00',
          ordem: 1
        },
        {
          id: 2,
          aprovadorId: 2,
          aprovadorNome: 'Carlos Santos',
          aprovadorEmail: 'carlos.santos@empresa.com',
          status: 'Aprovado',
          comentario: 'Aprovado para uso',
          assinatura: 'Carlos Santos',
          data: '2024-01-16T14:20:00',
          ordem: 2
        }
      ],
      dataCriacao: '2024-01-10T09:00:00',
      criadoPor: 'admin@empresa.com'
    },
    {
      id: 4,
      nome: 'CRLV - ABC-ABC',
      tipo: 'Veículo',
      status: 'Pendente',
      dataVencimento: '2026-12-31',
      pastaId: 1,
      icon: 'car',
      protegido: true,
      senha: 'crlv123',
      controlado: true,
      selecionado: false,
      fornecedorNome: 'DETRAN-SP',
      fornecedorTipo: 'Órgão Público',
      fornecedorCnpjCpf: '46.374.500/0001-19',
      fornecedorResponsavel: 'João Silva',
      localizacaoFisica: 'Arquivo Central - Gaveta A2',
      alertaLGPD: false,
      diasParaVencimento: 365,
      observacoes: 'Exemplo de CRLV para teste de aprovação',
      arquivo: '/documentos_teste/crlv_abc.pdf',
      requerAprovacao: true,
      statusAprovacao: 'Pendente',
      aprovadores: [
        { id: 1, nome: 'cnh_joao', email: 'cnh_joao@exemplo.com', ordem: 1, token: 'token-cnh-joao' }
      ],
      historicoAprovacao: [],
      dataCriacao: new Date().toISOString(),
      criadoPor: 'admin@empresa.com'
    },
    {
      id: 3,
      nome: 'Contrato TechSoft',
      tipo: 'Contrato',
      status: 'Pendente',
      dataVencimento: '2025-03-15',
      pastaId: 4,
      icon: 'building',
      controlado: true,
      alertaLGPD: true,
      diasParaVencimento: 15,
      fornecedorNome: 'TechSoft Soluções LTDA',
      fornecedorTipo: 'Pessoa Jurídica',
      fornecedorCnpjCpf: '12.345.678/0001-90',
      fornecedorResponsavel: 'Carlos Santos',
      valorContrato: 'R$ 15.000,00',
      localizacaoFisica: 'Jurídico - Pasta Contratos 2024',
      observacoes: 'Contrato de TI - Aguardando aprovação',
      arquivo: '/documentos_teste/contrato_techsoft.pdf',
      requerAprovacao: true,
      statusAprovacao: 'Em análise',
      fluxoAprovacao: {
        sequencial: true
      },
      aprovadores: [
        { id: 1, nome: 'Ana Oliveira', email: 'ana.oliveira@empresa.com', ordem: 1 },
        { id: 2, nome: 'Roberto Lima', email: 'roberto.lima@empresa.com', ordem: 2 },
        { id: 3, nome: 'Patricia Santos', email: 'patricia.santos@empresa.com', ordem: 3 }
      ],
      historicoAprovacao: [
        {
          id: 1,
          aprovadorId: 1,
          aprovadorNome: 'Ana Oliveira',
          aprovadorEmail: 'ana.oliveira@empresa.com',
          status: 'Aprovado',
          comentario: 'Cláusulas comerciais OK',
          assinatura: 'Ana Oliveira',
          data: '2024-02-01T11:15:00',
          ordem: 1
        },
        {
          id: 2,
          aprovadorId: 2,
          aprovadorNome: 'Roberto Lima',
          aprovadorEmail: 'roberto.lima@empresa.com',
          status: 'Em análise',
          comentario: 'Analisando aspectos jurídicos',
          assinatura: 'Roberto Lima',
          data: '2024-02-02T15:45:00',
          ordem: 2
        }
      ],
      alertasVencimento: {
        destinatarios: ['juridico@empresa.com', 'financeiro@empresa.com'],
        diasAntecedencia: 60
      },
      dataCriacao: '2024-01-30T14:00:00',
      criadoPor: 'juridico@empresa.com'
    }
  ])

  const [pastas, setPastas] = useState([
    { id: 1, nome: 'Veículos', parentId: null, icon: 'car', cor: 'blue', descricao: 'Documentos da frota', documentos: 1 },
    { id: 2, nome: 'Funcionários', parentId: null, icon: 'user', cor: 'green', descricao: 'Documentos pessoais', documentos: 0 },
    { id: 3, nome: 'Empresa', parentId: null, icon: 'building', cor: 'orange', descricao: 'Documentos corporativos', documentos: 0 },
    { id: 4, nome: 'Contratos', parentId: null, icon: 'fileText', cor: 'purple', descricao: 'Contratos comerciais', documentos: 1 },
    { id: 5, nome: 'Certidões', parentId: null, icon: 'shield', cor: 'yellow', descricao: 'Certidões oficiais', documentos: 0 },
    { id: 6, nome: 'Financeiro', parentId: null, icon: 'folder', cor: 'red', descricao: 'Gestão financeira', documentos: 0 },
    { id: 7, nome: 'Jurídico', parentId: null, icon: 'folder', cor: 'blue', descricao: 'Processos legais', documentos: 0 },
    { id: 8, nome: 'TI', parentId: null, icon: 'folder', cor: 'green', descricao: 'Ativos tecnológicos', documentos: 0 }
  ])

  const [tiposDocumento, setTiposDocumento] = useState([
    { id: 1, nome: 'Veículo', icon: 'car', cor: 'blue', editavel: true },
    { id: 2, nome: 'Funcionário', icon: 'user', cor: 'green', editavel: true },
    { id: 3, nome: 'Empresa', icon: 'building', cor: 'orange', editavel: true },
    { id: 4, nome: 'Contrato', icon: 'building', cor: 'purple', editavel: true },
    { id: 5, nome: 'Certidão', icon: 'shield', cor: 'yellow', editavel: true },
    { id: 6, nome: 'ISO', icon: 'shield', cor: 'indigo', editavel: true }
  ])

  const [iconesPasta, setIconesPasta] = useState([
    { id: 1, nome: 'Pasta', icon: 'folder', editavel: false },
    { id: 2, nome: 'Veículo', icon: 'car', editavel: false },
    { id: 3, nome: 'Usuário', icon: 'user', editavel: false },
    { id: 4, nome: 'Empresa', icon: 'building', editavel: false },
    { id: 5, nome: 'Segurança', icon: 'shield', editavel: false },
    { id: 6, nome: 'Estrela', icon: 'star', editavel: false },
    { id: 7, nome: 'Coração', icon: 'heart', editavel: false },
    { id: 8, nome: 'Casa', icon: 'home', editavel: false },
    { id: 9, nome: 'Maleta', icon: 'briefcase', editavel: false },
    { id: 10, nome: 'Imagem', icon: 'fileImage', editavel: false },
    { id: 11, nome: 'Vídeo', icon: 'fileVideo', editavel: false },
    { id: 12, nome: 'Música', icon: 'music', editavel: false }
  ])

  /* =========================
     Estados para Aprovações
  ========================= */
  const [usuarioAtual, setUsuarioAtual] = useState({
    id: 2,
    nome: 'Roberto Lima',
    email: 'roberto.lima@empresa.com',
    role: 'aprovador'
  })

  const [modoAprovacao, setModoAprovacao] = useState(false)
  const [documentoParaAprovacao, setDocumentoParaAprovacao] = useState(null)
  const [filtroAprovacao, setFiltroAprovacao] = useState('pendentes')
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      tipo: 'aprovação',
      mensagem: 'Novo documento para aprovação: Contrato TechSoft',
      documentoId: 3,
      data: '2024-02-01T10:00:00',
      lida: false
    },
    {
      id: 2,
      tipo: 'lembrete',
      mensagem: 'Aprovação pendente há 2 dias',
      documentoId: 3,
      data: '2024-02-03T09:00:00',
      lida: false
    }
  ])

  /* =========================
     Estados de interface
  ========================= */
  const [caminhoPastas, setCaminhoPastas] = useState([])
  const pastaSelecionadaId = caminhoPastas[caminhoPastas.length - 1] ?? null

  const [expandidas, setExpandidas] = useState(new Set([]))
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [documentosSelecionados, setDocumentosSelecionados] = useState([])
  const [modoVisualizacao, setModoVisualizacao] = useState('list')
  const [dashboardAtivo, setDashboardAtivo] = useState(null)
  const [mostrarPastas, setMostrarPastas] = useState(true)

  const scrollContainerRef = useRef(null)
  const [mostrarSetaEsquerda, setMostrarSetaEsquerda] = useState(false)
  const [mostrarSetaDireita, setMostrarSetaDireita] = useState(false)

  const [sortColumn, setSortColumn] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)

  const [mostrarFormularioPasta, setMostrarFormularioPasta] = useState(false)
  const [mostrarFormularioDocumento, setMostrarFormularioDocumento] = useState(false)
  const [mostrarCompartilhamento, setMostrarCompartilhamento] = useState(false)
  const [mostrarValidacaoSenha, setMostrarValidacaoSenha] = useState(false)
  const [mostrarAlertaLGPD, setMostrarAlertaLGPD] = useState(false)
  const [mostrarGerenciarTipos, setMostrarGerenciarTipos] = useState(false)
  const [mostrarGerenciarIcones, setMostrarGerenciarIcones] = useState(false)

  const [editandoPasta, setEditandoPasta] = useState(null)
  const [editandoDocumento, setEditandoDocumento] = useState(null)
  const [editandoTipo, setEditandoTipo] = useState(null)
  const [editandoIcone, setEditandoIcone] = useState(null)
  const [documentoParaAcao, setDocumentoParaAcao] = useState(null)
  const [acaoPendente, setAcaoPendente] = useState('')
  const [senhaDigitada, setSenhaDigitada] = useState('')
  const [etapaFormulario, setEtapaFormulario] = useState(1)

  /* =========================
     Confirmação (Dialog reutilizável)
  ========================= */
  const [confirmacao, setConfirmacao] = useState({
    open: false,
    titulo: 'Confirmar ação',
    descricao: '',
    labelConfirmar: 'Confirmar',
    labelCancelar: 'Cancelar',
    varianteConfirmar: 'default',
    onConfirm: null
  })

  const abrirConfirmacao = ({
    titulo = 'Confirmar ação',
    descricao = '',
    labelConfirmar = 'Confirmar',
    labelCancelar = 'Cancelar',
    varianteConfirmar = 'default',
    onConfirm
  }) => {
    setConfirmacao({ open: true, titulo, descricao, labelConfirmar, labelCancelar, varianteConfirmar, onConfirm })
  }

  const fecharConfirmacao = () => {
    setConfirmacao((prev) => ({ ...prev, open: false, onConfirm: null }))
  }

  const [formPasta, setFormPasta] = useState({
    nome: '',
    descricao: '',
    cor: 'blue',
    icon: 'folder',
    parentId: null
  })

  const [formDocumento, setFormDocumento] = useState({
    nome: '',
    tipo: '',
    pastaId: null,
    dataVencimento: '',
    localizacaoFisica: '',
    localizacaoResponsavel: '',
    protegido: false,
    controlado: false,
    alertaLGPD: false,
    senha: '',
    fornecedorNome: '',
    fornecedorTipo: '',
    fornecedorCnpjCpf: '',
    fornecedorEmail: '',
    fornecedorTelefone: '',
    fornecedorResponsavel: '',
    valorContrato: '',
    observacoes: '',
    arquivo: null,
    requerAprovacao: false,
    fluxoAprovacao: {
      sequencial: false,
      aprovadores: []
    },
    alertasVencimento: {
      destinatarios: [''],
      diasAntecedencia: 30
    },
    mensagemLGPD: 'Este documento contém informações sensíveis protegidas pela LGPD. O acesso é registrado e monitorado.'
  })

  const [formTipoDocumento, setFormTipoDocumento] = useState({
    nome: '',
    icon: 'fileText',
    cor: 'gray'
  })

  const [formIconePasta, setFormIconePasta] = useState({
    nome: '',
    icon: 'folder'
  })

  const [emailsCompartilhamento, setEmailsCompartilhamento] = useState([''])
  const [whatsappsCompartilhamento, setWhatsappsCompartilhamento] = useState([''])
  const [opcaoEnvio, setOpcaoEnvio] = useState('email')
  const [mensagemCompartilhamento, setMensagemCompartilhamento] = useState('')
  const [formatoCompartilhamento, setFormatoCompartilhamento] = useState('original')
  const [compactarArquivos, setCompactarArquivos] = useState(false)

  /* =========================
     Abrir documento via URL com token
  ========================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const modo = params.get("modo")
    const docId = params.get("docId")
    const token = params.get("token")

    if (modo === "aprovacoes") setModoAprovacao(true)

    if (docId && token) {
      const doc = documentos.find((d) => String(d.id) === String(docId))
      if (!doc) return

      const aprovador = doc.aprovadores?.find((a) => a.token === token)
      if (!aprovador) {
        alert("Token inválido ou expirado para aprovação.")
        return
      }

      // ✅ Se for sequencial, impede abrir "para aprovar" se ainda não for a vez
      // (o modal já exibe "aguardando aprovação anterior", então aqui só abre mesmo)
      setDocumentoParaAprovacao(doc)
      setModoAprovacao(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentos])

  /* =========================
     Funções de Aprovação
  ========================= */
  const enviarEmailAprovacao = (documento, aprovador, isReenvio = false) => {
    const assunto = isReenvio
      ? `Reenvio: Documento para aprovação - ${documento.nome}`
      : `Novo documento para aprovação - ${documento.nome}`

    const baseUrl = window.location.origin
    const linkAprovacao = `${baseUrl}/documentos?modo=aprovacoes&docId=${documento.id}&token=${encodeURIComponent(
      aprovador.token
    )}`

    const sequencialMsg = documento?.fluxoAprovacao?.sequencial
      ? "ATENÇÃO: Esta aprovação é SEQUENCIAL. Você só poderá aprovar quando chegar a sua vez."
      : "Você pode aprovar este documento a qualquer momento."

    const mensagem = `
Prezado(a) ${aprovador.nome},

${isReenvio ? "Reenvio do convite para aprovação do documento:" : "Você foi incluído(a) como aprovador(a) do documento:"}

Documento: ${documento.nome}
Tipo: ${documento.tipo}
Fornecedor: ${documento.fornecedorNome}
Valor: ${documento.valorContrato || "N/A"}
Criado em: ${new Date(documento.dataCriacao).toLocaleDateString()}

${sequencialMsg}

Acesse pelo link abaixo (token individual):
${linkAprovacao}

Atenciosamente,
Sistema de Gestão de Documentos
    `.trim()

    // ✅ Aqui você integra com backend/email real.
    // Neste exemplo mantém a simulação:
    console.log(`EMAIL -> ${aprovador.email}\nAssunto: ${assunto}\n\n${mensagem}`)
    alert(`Email ${isReenvio ? "REENVIADO" : "ENVIADO"} para: ${aprovador.email}`)
  }

  const enviarNotificacaoProximoAprovador = (documento, aprovadorAnterior, proximoAprovador) => {
    const assunto = `Sua vez de aprovar - ${documento.nome}`
    const baseUrl = window.location.origin

    const linkAprovacao = `${baseUrl}/documentos?modo=aprovacoes&docId=${documento.id}&token=${encodeURIComponent(
      proximoAprovador.token
    )}`

    const mensagem = `
Prezado(a) ${proximoAprovador.nome},

O aprovador anterior (${aprovadorAnterior.nome}) aprovou o documento "${documento.nome}".

Agora é a sua vez de revisar e decidir.

Link (token individual):
${linkAprovacao}

Atenciosamente,
Sistema de Gestão de Documentos
    `.trim()

    console.log(`EMAIL -> ${proximoAprovador.email}\nAssunto: ${assunto}\n\n${mensagem}`)
    alert(`Notificação enviada para: ${proximoAprovador.email}`)
  }

  const handleAprovarDocumento = async (dadosAprovacao) => {
    const documentoIndex = documentos.findIndex(d => d.id === dadosAprovacao.documentoId)
    if (documentoIndex === -1) return

    const documento = documentos[documentoIndex]
    
    // Mapeamento de status - corrigir para usar o valor do formulário diretamente
    const statusFormatado = dadosAprovacao.status // Já vem formatado do componente

    const novoHistorico = {
      id: documento.historicoAprovacao?.length + 1 || 1,
      ...dadosAprovacao,
      status: statusFormatado,
      ordem: documento.historicoAprovacao?.length + 1 || 1
    }

    const novoDocumento = {
      ...documento,
      historicoAprovacao: [...(documento.historicoAprovacao || []), novoHistorico]
    }

    // Atualizar status geral do documento
    const algumReprovado = novoDocumento.historicoAprovacao?.some(h => h.status === 'Reprovado')
    const todosAprovados = novoDocumento.aprovadores?.every(aprovador => 
      novoDocumento.historicoAprovacao?.some(h => 
        h.email === aprovador.email && h.status === 'Aprovado'
      )
    )
    const emAnalise = novoDocumento.historicoAprovacao?.some(h => h.status === 'Em análise')

    if (algumReprovado) {
      novoDocumento.statusAprovacao = 'Reprovado'
      novoDocumento.status = 'Reprovado'
    } else if (todosAprovados) {
      novoDocumento.statusAprovacao = 'Aprovado'
      novoDocumento.status = 'Ativo'
    } else if (emAnalise) {
      novoDocumento.statusAprovacao = 'Em análise'
      novoDocumento.status = 'Pendente'
    } else {
      novoDocumento.statusAprovacao = 'Pendente'
      novoDocumento.status = 'Pendente'
    }

    // Atualizar documento
    setDocumentos(prev => prev.map((d, idx) => idx === documentoIndex ? novoDocumento : d))
    
    // Fechar modal
    setDocumentoParaAprovacao(null)
    
    // Mostrar mensagem baseada na ação
    const mensagens = {
      'Aprovado': 'Documento aprovado com sucesso!',
      'Reprovado': 'Documento reprovado.',
      'Em análise': 'Documento marcado como em análise.'
    }
    
    alert(mensagens[statusFormatado] || 'Aprovação registrada com sucesso!')
  }

  const handleReenviarConvite = (documento) => {
    const aprovadores = documento.aprovadores || []
    const historico = documento.historicoAprovacao || []

    const pendentes = aprovadores.filter((a) => !historico.some((h) => h.aprovadorEmail === a.email))

    if (!pendentes.length) {
      alert("Nenhum aprovador pendente para reenviar convite.")
      return
    }

    if (documento.fluxoAprovacao?.sequencial) {
      // primeiro pendente na ordem
      const atual = pendentes.sort((a, b) => (a.ordem || 0) - (b.ordem || 0))[0]
      enviarEmailAprovacao(documento, atual, true)
      return
    }

    // não sequencial: reenviar para todos pendentes
    pendentes.forEach((a) => enviarEmailAprovacao(documento, a, true))
  }

  const buildValidationUrl = (documento) => {
    const base = import.meta?.env?.VITE_DOC_VALIDATION_BASE_URL || `${window.location.origin}/validar`
    return `${base}?docId=${encodeURIComponent(documento.id)}`
  }

  const gerarRodapeTexto = (documento) => {
    const aprovados = (documento.historicoAprovacao || []).filter((h) => h.status === "Aprovado")
    const ultimoAprovador = aprovados[aprovados.length - 1]

    if (documento.requerAprovacao && documento.statusAprovacao === "Aprovado" && ultimoAprovador) {
      return `DOCUMENTO CONTROLADO • Aprovado por ${ultimoAprovador.aprovadorNome} (${ultimoAprovador.aprovadorEmail}) em ${new Date(
        ultimoAprovador.data
      ).toLocaleString()} • ID ${documento.id}`
    }

    if (documento.requerAprovacao) {
      return `DOCUMENTO CONTROLADO • Status: ${documento.statusAprovacao || "Pendente"} • ID ${documento.id}`
    }

    return `DOCUMENTO CONTROLADO • ID ${documento.id}`
  }

  const gerarPdfControladoComRodapeEQr = async (documento, urlPdfOriginal) => {
    const rodape = gerarRodapeTexto(documento)
    const validationUrl = buildValidationUrl(documento)

    const res = await fetch(urlPdfOriginal)
    const bytes = await res.arrayBuffer()

    const pdfDoc = await PDFDocument.load(bytes)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const qrDataUrl = await QRCode.toDataURL(validationUrl, { margin: 1, width: 160 })
    const qrBytes = await (await fetch(qrDataUrl)).arrayBuffer()
    const qrImg = await pdfDoc.embedPng(qrBytes)

    const pages = pdfDoc.getPages()

    pages.forEach((page) => {
      const { width, height } = page.getSize()

      const margin = 18
      const qrSize = 48

      // faixa do rodapé
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height: 62,
        color: rgb(1, 1, 1),
        opacity: 0.96
      })

      page.drawText(rodape, {
        x: margin,
        y: 44,
        size: 8,
        font,
        color: rgb(0.25, 0.25, 0.25),
        maxWidth: width - margin * 2 - (qrSize + 10)
      })

      page.drawText(`Validação: ${validationUrl}`, {
        x: margin,
        y: 30,
        size: 7,
        font,
        color: rgb(0.35, 0.35, 0.35)
      })

      page.drawImage(qrImg, {
        x: width - margin - qrSize,
        y: 10,
        width: qrSize,
        height: qrSize
      })
    })

    const outBytes = await pdfDoc.save()
    const blob = new Blob([outBytes], { type: "application/pdf" })
    return URL.createObjectURL(blob)
  }

  /* =========================
     Utilitários
  ========================= */
  const construirArvore = (pastasList) => {
    const map = {}
    const raizes = []
    pastasList.forEach((p) => (map[p.id] = { ...p, children: [] }))
    pastasList.forEach((p) => {
      if (p.parentId && map[p.parentId]) map[p.parentId].children.push(map[p.id])
      else if (!p.parentId) raizes.push(map[p.id])
    })
    return raizes
  }

  const arvorePastas = useMemo(() => construirArvore(pastas), [pastas])

  const obterIdsSubpastas = (pastaId) => {
    const ids = [pastaId]
    const adicionarFilhos = (id) => {
      const filhos = pastas.filter((p) => p.parentId === id)
      filhos.forEach((filho) => {
        ids.push(filho.id)
        adicionarFilhos(filho.id)
      })
    }
    adicionarFilhos(pastaId)
    return ids
  }

  const selecionarPastaNoNivel = (pastaId, nivel) => {
    setCaminhoPastas((prev) => [...prev.slice(0, nivel), pastaId])
    setDashboardAtivo(null)
  }

  const limparSelecaoPastas = () => {
    setCaminhoPastas([])
    setDashboardAtivo(null)
  }

  const toggleExpand = (pastaId) => {
    setExpandidas((prev) => {
      const novo = new Set(prev)
      if (novo.has(pastaId)) novo.delete(pastaId)
      else novo.add(pastaId)
      return novo
    })
  }

  const handleClickDashboard = (tipo) => {
    if (dashboardAtivo === tipo) setDashboardAtivo(null)
    else {
      setDashboardAtivo(tipo)
      limparSelecaoPastas()
    }
  }

  const normalizeText = (t) =>
    (t || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  /* =========================
     Scroll das Pastas (horizontal)
  ========================= */
  const scrollPastas = (direcao) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direcao === 'direita' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const verificarScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setMostrarSetaEsquerda(scrollLeft > 0)
      setMostrarSetaDireita(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  /* =========================
     Filtro + Ordenação
  ========================= */
  const handleSort = (col) => {
    if (sortColumn === col) setSortAsc(!sortAsc)
    else {
      setSortColumn(col)
      setSortAsc(true)
    }
  }

  const renderSortIndicator = (col) => {
    if (sortColumn !== col) return null
    return sortAsc ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />
  }

  const calcularMetricas = () => {
    let docsParaAnalisar = documentos

    if (pastaSelecionadaId) {
      const idsValidos = obterIdsSubpastas(pastaSelecionadaId)
      docsParaAnalisar = documentos.filter((d) => idsValidos.includes(d.pastaId))
    }

    return {
      total: docsParaAnalisar.length,
      vencidos: docsParaAnalisar.filter((d) => d.status === 'Vencido').length,
      vencendo: docsParaAnalisar.filter((d) => d.status === 'Vencendo').length,
      pendentes: docsParaAnalisar.filter((d) => d.requerAprovacao && d.status === 'Pendente').length,
      paraAprovacao: docsParaAnalisar.filter(d => 
        d.requerAprovacao && 
        d.aprovadores?.some(a => a.email === usuarioAtual.email) &&
        !d.historicoAprovacao?.some(h => h.email === usuarioAtual.email)
      ).length
    }
  }

  const metricas = calcularMetricas()

  /* =========================
     Documentos para Aprovação
  ========================= */
  const documentosParaAprovacao = useMemo(() => {
    return documentos.filter(doc => {
      if (!doc.requerAprovacao) return false
      
      const meuHistorico = doc.historicoAprovacao?.find(h => h.email === usuarioAtual.email)
      const souAprovador = doc.aprovadores?.some(a => a.email === usuarioAtual.email)
      
      if (!souAprovador) return false
      
      if (filtroAprovacao === 'pendentes') {
        return !meuHistorico
      } else if (filtroAprovacao === 'meus') {
        return meuHistorico
      } else if (filtroAprovacao === 'todos') {
        return true
      }
      return false
    })
  }, [documentos, usuarioAtual.email, filtroAprovacao])

  let documentosFiltrados = documentos.filter((doc) => {
    const buscaNorm = normalizeText(busca)

    const atendeBusca =
      !busca ||
      normalizeText(doc.nome).includes(buscaNorm) ||
      normalizeText(doc.fornecedorNome).includes(buscaNorm) ||
      normalizeText(doc.tipo).includes(buscaNorm)

    const atendeTipo = filtroTipo === 'todos' || doc.tipo === filtroTipo
    const atendeStatus = filtroStatus === 'todos' || doc.status === filtroStatus

    if (dashboardAtivo === 'vencidos' && doc.status !== 'Vencido') return false
    if (dashboardAtivo === 'vencendo' && doc.status !== 'Vencendo') return false
    if (dashboardAtivo === 'pendentes' && (!doc.requerAprovacao || doc.status !== 'Pendente')) return false

    if (pastaSelecionadaId) {
      const idsValidos = obterIdsSubpastas(pastaSelecionadaId)
      if (!idsValidos.includes(doc.pastaId)) return false
    }

    return atendeBusca && atendeTipo && atendeStatus
  })

  if (sortColumn) {
    documentosFiltrados = [...documentosFiltrados].sort((a, b) => {
      const getVal = (item, c) => {
        if (c === 'dataVencimento') return item[c] || ''
        return (item[c] || '').toString().toLowerCase()
      }
      const va = getVal(a, sortColumn)
      const vb = getVal(b, sortColumn)
      if (sortColumn === 'dataVencimento') {
        const da = va ? new Date(va) : new Date(0)
        const db = vb ? new Date(vb) : new Date(0)
        return sortAsc ? da - db : db - da
      }
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }

  /* =========================
     Ícones / cores
  ========================= */
  const getIconComponent = (iconName, className = 'h-4 w-4') => {
    const icons = {
      car: Car,
      user: User,
      building: Building,
      shield: Shield,
      folder: Folder,
      star: Star,
      heart: Heart,
      home: Home,
      briefcase: Briefcase,
      fileImage: FileImage,
      fileVideo: FileVideo,
      music: Music,
      fileText: FileText,
      fileCheck: FileCheck,
      award: Award,
      fileSignature: FileSignature,
      users: Users,
      mapPin: MapPin,
      settings: Settings,
      palette: Palette,
      type: Type,
      grid3x3: Grid3X3,
      menu: Menu,
      eye: Eye,
      folderPlus: FolderPlus,
      fileUp: FileUp,
      messageCircle: MessageCircle,
      key: Key,
      userCog: UserCog,
      checkCircle: CheckCircle,
      xCircle: XCircle,
      clock4: Clock4,
      mail: Mail,
      qrCode: QrCode,
      filePieChart: FilePieChart,
      history: History,
      send: Send,
      refreshCw: RefreshCw
    }
    const IconComponent = icons[iconName] || FileText
    return <IconComponent className={className} />
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo':
      case 'Aprovado':
        return 'bg-green-500 text-white'
      case 'Vencido':
      case 'Reprovado':
        return 'bg-red-500 text-white'
      case 'Vencendo':
        return 'bg-yellow-500 text-white'
      case 'Pendente':
        return 'bg-orange-500 text-white'
      case 'Em análise':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getTipoColor = (tipo) => {
    const tipoEncontrado = tiposDocumento.find((t) => t.nome === tipo)
    if (tipoEncontrado) {
      const cores = {
        blue: 'bg-blue-500 text-white',
        green: 'bg-green-500 text-white',
        orange: 'bg-orange-500 text-white',
        red: 'bg-red-500 text-white',
        purple: 'bg-purple-500 text-white',
        yellow: 'bg-yellow-600 text-white',
        indigo: 'bg-indigo-500 text-white',
        pink: 'bg-pink-500 text-white',
        gray: 'bg-gray-500 text-white'
      }
      return cores[tipoEncontrado.cor] || 'bg-gray-500 text-white'
    }
    return 'bg-gray-500 text-white'
  }

  const formatarDataVencimento = (data) => {
    if (!data) return 'N/A'
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const renderAlertaVencimento = (dias) => {
    if (dias === null || dias === undefined) return null
    if (dias < 0) {
      return (
        <div className="flex items-center text-red-600 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Vencido há {Math.abs(dias)} dias
        </div>
      )
    } else if (dias <= 30) {
      return (
        <div className="flex items-center text-yellow-600 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Vence em {dias} dias
        </div>
      )
    }
    return null
  }

  /* =========================
     Seleção em lote
  ========================= */
  const handleSelecionarDocumento = (id, checked) => {
    setDocumentosSelecionados((prev) => (checked ? [...prev, id] : prev.filter((docId) => docId !== id)))
  }

  const handleSelecionarTodos = (checked) => {
    if (checked) setDocumentosSelecionados(documentosFiltrados.map((d) => d.id))
    else setDocumentosSelecionados([])
  }

  /* =========================
     CRUD Pastas
  ========================= */
  const handleAbrirFormularioPasta = (parent = null) => {
    const parentId = typeof parent === 'object' ? parent?.id : parent
    const parentObj = parentId ? pastas.find(p => p.id === parentId) : null

    if (parentId) {
      let nivel = 1
      let atual = pastas.find((p) => p.id === parentId)
      while (atual && atual.parentId) {
        nivel++
        atual = pastas.find((p) => p.id === atual.parentId)
      }
      if (nivel >= 4) {
        alert('Erro: Limite de 4 níveis de subpastas atingido.')
        return
      }
    }

    setEditandoPasta(null)
    setFormPasta({
      nome: '',
      descricao: '',
      cor: parentObj?.cor || 'blue',
      icon: 'folder',
      parentId: parentId || null
    })
    setMostrarFormularioPasta(true)
  }

  const handleEditarPasta = (pasta) => {
    setEditandoPasta(pasta)
    setFormPasta({
      nome: pasta.nome,
      descricao: pasta.descricao,
      cor: pasta.cor,
      icon: pasta.icon,
      parentId: pasta.parentId
    })
    setMostrarFormularioPasta(true)
  }

  const salvarPasta = () => {
    if (!formPasta.nome.trim()) {
      alert('Nome da pasta é obrigatório.')
      return
    }

    if (editandoPasta) {
      setPastas((prev) => prev.map((p) => (p.id === editandoPasta.id ? { ...p, ...formPasta } : p)))
    } else {
      const parentObj = formPasta.parentId ? pastas.find(p => p.id === formPasta.parentId) : null
      const corFinal = parentObj?.cor || formPasta.cor

      const novaPasta = {
        id: Math.max(...pastas.map((p) => p.id), 0) + 1,
        ...formPasta,
        cor: corFinal,
        documentos: 0
      }
      setPastas((prev) => [...prev, novaPasta])

      if (formPasta.parentId) {
        setExpandidas((prev) => {
          const novo = new Set(prev)
          novo.add(formPasta.parentId)
          return novo
        })
      }
    }

    setMostrarFormularioPasta(false)
    setEditandoPasta(null)
  }

  const excluirPasta = (id) => {
    const pasta = pastas.find((p) => p.id === id)
    const nome = pasta?.nome || `ID ${id}`

    abrirConfirmacao({
      titulo: 'Excluir pasta?',
      descricao: `A pasta "${nome}" será excluída junto com subpastas e documentos. Esta ação não pode ser desfeita.`,
      labelConfirmar: 'Excluir',
      varianteConfirmar: 'destructive',
      onConfirm: () => {
        const idsParaExcluir = obterIdsSubpastas(id)
        setPastas((prev) => prev.filter((p) => !idsParaExcluir.includes(p.id)))
        setDocumentos((prev) => prev.filter((d) => !idsParaExcluir.includes(d.pastaId)))

        if (pastaSelecionadaId && idsParaExcluir.includes(pastaSelecionadaId)) limparSelecaoPastas()
      }
    })
  }

  const baixarPasta = (pasta) => {
    const idsValidos = obterIdsSubpastas(pasta.id)
    const docs = documentos.filter((d) => idsValidos.includes(d.pastaId))

    if (docs.length === 0) {
      alert('Nenhum documento nesta pasta para baixar.')
      return
    }

    abrirConfirmacao({
      titulo: 'Baixar pasta?',
      descricao: `Deseja baixar "${pasta.nome}" com ${docs.length} arquivo(s) (incluindo subpastas)?`,
      labelConfirmar: 'Baixar',
      onConfirm: () => {
        docs.forEach((d) => {
          if (d?.arquivo) {
            // Adicionar rodape com informações de aprovação
            const rodape = d.requerAprovacao ? gerarDocumentoComRodape(d) : ''
            console.log(`Baixando ${d.nome} com rodape:\n${rodape}`)
            
            const link = document.createElement('a')
            link.href = d.arquivo
            link.download = d.nome
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      }
    })
  }

  const compartilharPasta = (pasta) => {
    const idsValidos = obterIdsSubpastas(pasta.id)
    const docs = documentos.filter((d) => idsValidos.includes(d.pastaId))

    if (docs.length === 0) {
      alert('Nenhum documento nesta pasta para compartilhar.')
      return
    }

    abrirConfirmacao({
      titulo: 'Compartilhar pasta?',
      descricao: `Deseja compartilhar "${pasta.nome}" com ${docs.length} arquivo(s) (incluindo subpastas)?`,
      labelConfirmar: 'Continuar',
      onConfirm: () => {
        setDocumentoParaAcao({
          tipo: 'PASTA',
          nome: `Pasta: ${pasta.nome}`,
          pastaId: pasta.id,
          arquivos: docs.map(d => ({ id: d.id, nome: d.nome, arquivo: d.arquivo }))
        })
        setMostrarCompartilhamento(true)
      }
    })
  }

  /* =========================
     Ações Documento
  ========================= */
  const validarSenhaDocumento = (documento, acao) => {
    if (documento.protegido && documento.senha) {
      setDocumentoParaAcao(documento)
      setAcaoPendente(acao)
      setMostrarValidacaoSenha(true)
      setSenhaDigitada('')
    } else {
      executarAcaoDocumento(documento, acao)
    }
  }

  const executarAcaoDocumento = async (documento, acao) => {
    if (documento.alertaLGPD && (acao === 'visualizar' || acao === 'download')) {
      setDocumentoParaAcao(documento)
      setAcaoPendente(acao)
      setMostrarAlertaLGPD(true)
      return
    }

    switch (acao) {
      case "visualizar":
        if (documento.arquivo) {
          const precisaControlar = documento.controlado || documento.requerAprovacao
          const ehPdf = String(documento.arquivo).toLowerCase().includes(".pdf")

          if (precisaControlar && ehPdf) {
            try {
              const urlControlada = await gerarPdfControladoComRodapeEQr(documento, documento.arquivo)
              window.open(urlControlada, "_blank")
            } catch (e) {
              console.error(e)
              alert("Não foi possível gerar a versão controlada do PDF. Abrindo original.")
              window.open(documento.arquivo, "_blank")
            }
            return
          }

          window.open(documento.arquivo, "_blank")
        }
        break

      case "download":
        if (documento.arquivo) {
          const precisaControlar = documento.controlado || documento.requerAprovacao
          const ehPdf = String(documento.arquivo).toLowerCase().includes(".pdf")

          let urlFinal = documento.arquivo
          if (precisaControlar && ehPdf) {
            try {
              urlFinal = await gerarPdfControladoComRodapeEQr(documento, documento.arquivo)
            } catch (e) {
              console.error(e)
              alert("Não foi possível gerar a versão controlada do PDF. Baixando original.")
            }
          }

          const link = document.createElement("a")
          link.href = urlFinal
          link.download = documento.nome?.toLowerCase().includes(".pdf") ? documento.nome : `${documento.nome}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
        break

      case 'compartilhar':
        setDocumentoParaAcao(documento)
        setMostrarCompartilhamento(true)
        break
      default:
        break
    }
  }

  const confirmarSenha = () => {
    if (senhaDigitada === documentoParaAcao?.senha) {
      setMostrarValidacaoSenha(false)
      executarAcaoDocumento(documentoParaAcao, acaoPendente)
    } else {
      alert('Senha incorreta!')
    }
  }

  const confirmarLGPD = () => {
    setMostrarAlertaLGPD(false)
    executarAcaoDocumento(documentoParaAcao, acaoPendente)
  }

  /* =========================
     CRUD Documento
  ========================= */
  const editarDocumento = (documento) => {
    setEditandoDocumento(documento)
    setFormDocumento({
      nome: documento.nome || '',
      tipo: documento.tipo || '',
      pastaId: documento.pastaId || null,
      dataVencimento: documento.dataVencimento || '',
      localizacaoFisica: documento.localizacaoFisica || '',
      localizacaoResponsavel: documento.localizacaoResponsavel || '',
      protegido: documento.protegido || false,
      controlado: documento.controlado || false,
      alertaLGPD: documento.alertaLGPD || false,
      senha: documento.senha || '',
      fornecedorNome: documento.fornecedorNome || '',
      fornecedorTipo: documento.fornecedorTipo || '',
      fornecedorCnpjCpf: documento.fornecedorCnpjCpf || '',
      fornecedorEmail: documento.fornecedorEmail || '',
      fornecedorTelefone: documento.fornecedorTelefone || '',
      fornecedorResponsavel: documento.fornecedorResponsavel || '',
      valorContrato: documento.valorContrato || '',
      observacoes: documento.observacoes || '',
      arquivo: null,
      requerAprovacao: documento.requerAprovacao || false,
      fluxoAprovacao: documento.fluxoAprovacao || { sequencial: false, aprovadores: [] },
      alertasVencimento: documento.alertasVencimento || { destinatarios: [''], diasAntecedencia: 30 },
      mensagemLGPD: documento.mensagemLGPD || 'Este documento contém informações sensíveis protegidas pela LGPD.'
    })
    setMostrarFormularioDocumento(true)
    setEtapaFormulario(1)
  }

  const excluirDocumento = (id) => {
    const doc = documentos.find((d) => d.id === id)
    const nome = doc?.nome || `ID ${id}`

    abrirConfirmacao({
      titulo: 'Excluir documento?',
      descricao: `O documento "${nome}" será removido. Esta ação não pode ser desfeita.`,
      labelConfirmar: 'Excluir',
      varianteConfirmar: 'destructive',
      onConfirm: () => {
        setDocumentos((prev) => prev.filter((d) => d.id !== id))
      }
    })
  }

  const resetarFormularioDocumento = () => {
    setFormDocumento({
      nome: '',
      tipo: '',
      pastaId: null,
      dataVencimento: '',
      localizacaoFisica: '',
      localizacaoResponsavel: '',
      protegido: false,
      controlado: false,
      alertaLGPD: false,
      senha: '',
      fornecedorNome: '',
      fornecedorTipo: '',
      fornecedorCnpjCpf: '',
      fornecedorEmail: '',
      fornecedorTelefone: '',
      fornecedorResponsavel: '',
      valorContrato: '',
      observacoes: '',
      arquivo: null,
      requerAprovacao: false,
      fluxoAprovacao: { sequencial: false, aprovadores: [] },
      alertasVencimento: { destinatarios: [''], diasAntecedencia: 30 },
      mensagemLGPD: 'Este documento contém informações sensíveis protegidas pela LGPD.'
    })
    setEtapaFormulario(1)
  }

  const salvarDocumento = () => {
    if (!formDocumento.nome.trim()) {
      alert('Nome do documento é obrigatório.')
      return
    }

    if (!formDocumento.tipo) {
      alert('Tipo do documento é obrigatório.')
      return
    }

    const calcularStatus = (dataVencimento) => {
      if (!dataVencimento) return 'Ativo'
      const hoje = new Date()
      const vencimento = new Date(dataVencimento)
      const diffTime = vencimento - hoje
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays < 0) return 'Vencido'
      if (diffDays <= 30) return 'Vencendo'
      return 'Ativo'
    }

    const calcularDias = (dataVencimento) => {
      if (!dataVencimento) return null
      const hoje = new Date()
      const vencimento = new Date(dataVencimento)
      const diffTime = vencimento - hoje
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const pastaIdNum = formDocumento.pastaId ? parseInt(formDocumento.pastaId) : null

    if (editandoDocumento) {
      const atualizado = {
        ...editandoDocumento,
        ...formDocumento,
        pastaId: pastaIdNum,
        status: formDocumento.requerAprovacao ? 'Pendente' : calcularStatus(formDocumento.dataVencimento),
        diasParaVencimento: calcularDias(formDocumento.dataVencimento),
        icon: tiposDocumento.find((t) => t.nome === formDocumento.tipo)?.icon || editandoDocumento.icon || 'fileText'
      }
      setDocumentos((prev) => prev.map((d) => (d.id === atualizado.id ? atualizado : d)))
      setEditandoDocumento(null)
      alert('Documento atualizado com sucesso!')
    } else {
      const novoDocumento = {
        id: Math.max(...documentos.map((d) => d.id), 0) + 1,
        ...formDocumento,
        pastaId: pastaIdNum,
        status: formDocumento.requerAprovacao ? 'Pendente' : calcularStatus(formDocumento.dataVencimento),
        diasParaVencimento: calcularDias(formDocumento.dataVencimento),
        selecionado: false,
        icon: tiposDocumento.find((t) => t.nome === formDocumento.tipo)?.icon || 'fileText',
        dataCriacao: new Date().toISOString(),
        criadoPor: usuarioAtual.email,
        statusAprovacao: formDocumento.requerAprovacao ? 'Pendente' : 'N/A',
        historicoAprovacao: []
      }

      // Se requer aprovação, enviar emails para aprovadores
      if (formDocumento.requerAprovacao && formDocumento.fluxoAprovacao.aprovadores.length > 0) {
        novoDocumento.aprovadores = formDocumento.fluxoAprovacao.aprovadores.map((ap, idx) => ({
          id: idx + 1,
          nome: ap.nome,
          email: ap.email,
          ordem: idx + 1,
          token: (crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`).toString()
        }))

        // ✅ Convite inicial:
        // - Se SEQUENCIAL: só o 1º recebe agora
        // - Se NÃO SEQUENCIAL: todos recebem agora
        if (novoDocumento.fluxoAprovacao?.sequencial) {
          const primeiro = novoDocumento.aprovadores[0]
          if (primeiro) enviarEmailAprovacao(novoDocumento, primeiro)
        } else {
          novoDocumento.aprovadores.forEach((aprovador) => enviarEmailAprovacao(novoDocumento, aprovador))
        }
      }

      setDocumentos((prev) => [...prev, novoDocumento])
      alert('Documento salvo com sucesso!' + (formDocumento.requerAprovacao ? ' Emails de aprovação enviados.' : ''))
    }

    resetarFormularioDocumento()
    setMostrarFormularioDocumento(false)
  }

  /* =========================
     Aprovadores + alertas
  ========================= */
  const adicionarAprovador = () => {
    setFormDocumento((prev) => ({
      ...prev,
      fluxoAprovacao: {
        ...prev.fluxoAprovacao,
        aprovadores: [...prev.fluxoAprovacao.aprovadores, { nome: '', email: '' }]
      }
    }))
  }

  const removerAprovador = (idx) => {
    setFormDocumento((prev) => ({
      ...prev,
      fluxoAprovacao: {
        ...prev.fluxoAprovacao,
        aprovadores: prev.fluxoAprovacao.aprovadores.filter((_, i) => i !== idx)
      }
    }))
  }

  const atualizarAprovador = (idx, campo, valor) => {
    setFormDocumento((prev) => ({
      ...prev,
      fluxoAprovacao: {
        ...prev.fluxoAprovacao,
        aprovadores: prev.fluxoAprovacao.aprovadores.map((a, i) => (i === idx ? { ...a, [campo]: valor } : a))
      }
    }))
  }

  const adicionarDestinatarioAlerta = () => {
    setFormDocumento((prev) => ({
      ...prev,
      alertasVencimento: {
        ...prev.alertasVencimento,
        destinatarios: [...prev.alertasVencimento.destinatarios, '']
      }
    }))
  }

  const removerDestinatarioAlerta = (idx) => {
    setFormDocumento((prev) => ({
      ...prev,
      alertasVencimento: {
        ...prev.alertasVencimento,
        destinatarios: prev.alertasVencimento.destinatarios.filter((_, i) => i !== idx)
      }
    }))
  }

  const atualizarDestinatarioAlerta = (idx, valor) => {
    setFormDocumento((prev) => ({
      ...prev,
      alertasVencimento: {
        ...prev.alertasVencimento,
        destinatarios: prev.alertasVencimento.destinatarios.map((d, i) => (i === idx ? valor : d))
      }
    }))
  }

  /* =========================
     Tipos
  ========================= */
  const adicionarTipoDocumento = () => {
    if (!formTipoDocumento.nome.trim()) {
      alert('Nome do tipo é obrigatório.')
      return
    }

    const novoTipo = {
      id: Math.max(...tiposDocumento.map((t) => t.id), 0) + 1,
      ...formTipoDocumento,
      editavel: true
    }
    setTiposDocumento((prev) => [...prev, novoTipo])
    setFormTipoDocumento({ nome: '', icon: 'fileText', cor: 'gray' })
    setEditandoTipo(null)
    alert('Tipo de documento adicionado com sucesso!')
  }

  const editarTipoDocumento = (tipo) => {
    setEditandoTipo(tipo)
    setFormTipoDocumento({ nome: tipo.nome, icon: tipo.icon, cor: tipo.cor })
  }

  const salvarEdicaoTipo = () => {
    if (!formTipoDocumento.nome.trim()) {
      alert('Nome do tipo é obrigatório.')
      return
    }
    setTiposDocumento((prev) => prev.map((t) => (t.id === editandoTipo.id ? { ...t, ...formTipoDocumento } : t)))
    setEditandoTipo(null)
    setFormTipoDocumento({ nome: '', icon: 'fileText', cor: 'gray' })
    alert('Tipo de documento atualizado com sucesso!')
  }

  const excluirTipoDocumento = (id) => {
    if (confirm('Tem certeza que deseja excluir este tipo?')) {
      setTiposDocumento((prev) => prev.filter((t) => t.id !== id))
      alert('Tipo de documento excluído com sucesso!')
    }
  }

  /* =========================
     Ícones
  ========================= */
  const adicionarIconePasta = () => {
    if (!formIconePasta.nome.trim()) {
      alert('Nome do ícone é obrigatório.')
      return
    }

    const novoIcone = {
      id: Math.max(...iconesPasta.map((i) => i.id), 0) + 1,
      ...formIconePasta,
      editavel: true
    }
    setIconesPasta((prev) => [...prev, novoIcone])
    setFormIconePasta({ nome: '', icon: 'folder' })
    setEditandoIcone(null)
    alert('Ícone adicionado com sucesso!')
  }

  const editarIconePasta = (icone) => {
    setEditandoIcone(icone)
    setFormIconePasta({ nome: icone.nome, icon: icone.icon })
  }

  const salvarEdicaoIcone = () => {
    if (!formIconePasta.nome.trim()) {
      alert('Nome do ícone é obrigatório.')
      return
    }
    setIconesPasta((prev) => prev.map((i) => (i.id === editandoIcone.id ? { ...i, ...formIconePasta } : i)))
    setEditandoIcone(null)
    setFormIconePasta({ nome: '', icon: 'folder' })
    alert('Ícone atualizado com sucesso!')
  }

  const excluirIconePasta = (id) => {
    if (confirm('Tem certeza que deseja excluir este ícone?')) {
      setIconesPasta((prev) => prev.filter((i) => i.id !== id))
      alert('Ícone excluído com sucesso!')
    }
  }

  /* =========================
     Compartilhamento
  ========================= */
  const processarCompartilhamento = () => {
    const emailsValidos = emailsCompartilhamento.filter((e) => e.trim() && e.includes('@'))
    const whatsappsValidos = whatsappsCompartilhamento.filter((w) => w.trim())

    if (opcaoEnvio === 'email' && emailsValidos.length === 0) {
      alert('Adicione pelo menos um e-mail válido.')
      return
    }
    if (opcaoEnvio === 'whatsapp' && whatsappsValidos.length === 0) {
      alert('Adicione pelo menos um WhatsApp válido.')
      return
    }

    const alvo = documentoParaAcao?.tipo === 'PASTA'
      ? `${documentoParaAcao.nome} (${documentoParaAcao.arquivos?.length || 0} arquivo(s))`
      : documentoParaAcao
        ? (documentoParaAcao.nome || 'Item')
        : `Documentos selecionados (${documentosSelecionados.length})`

    let mensagemFinal = `Compartilhando: ${alvo}\n\n${mensagemCompartilhamento}`

    if (compactarArquivos) mensagemFinal += '\n\nArquivos compactados em ZIP.'
    if (formatoCompartilhamento === 'pdf') mensagemFinal += '\n\nConvertidos para PDF.'

    // Se for documento com aprovação, adicionar informações
    if (documentoParaAcao?.requerAprovacao) {
      mensagemFinal += `\n\n=== INFORMAÇÕES DE APROVAÇÃO ===\n`
      mensagemFinal += `Status: ${documentoParaAcao.statusAprovacao}\n`
      mensagemFinal += `Aprovadores: ${documentoParaAcao.aprovadores?.map(a => a.nome).join(', ') || 'Nenhum'}\n`
      mensagemFinal += `Última atualização: ${new Date().toLocaleDateString()}`
    }

    abrirConfirmacao({
      titulo: 'Confirmar compartilhamento?',
      descricao: alvo,
      labelConfirmar: 'Enviar',
      onConfirm: () => {
        if (opcaoEnvio === 'whatsapp') {
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagemFinal)}`
          window.open(whatsappUrl, '_blank')
          alert(`Envie para: ${whatsappsValidos.join(', ')}`)
        } else {
          alert(`Enviado por e-mail para: ${emailsValidos.join(', ')}\n\n${mensagemFinal}`)
        }

        setMostrarCompartilhamento(false)
        setEmailsCompartilhamento([''])
        setWhatsappsCompartilhamento([''])
        setMensagemCompartilhamento('')
      }
    })
    return
  }

  const baixarMultiplos = () => {
    const docs = documentos.filter((d) => documentosSelecionados.includes(d.id))
    if (docs.length === 0) {
      alert('Selecione documentos para baixar.')
      return
    }
    abrirConfirmacao({
      titulo: 'Baixar documentos selecionados?',
      descricao: `Você vai baixar ${docs.length} arquivo(s).`,
      labelConfirmar: 'Baixar',
      onConfirm: () => {
        docs.forEach((d) => {
          if (d?.arquivo) {
            // Adicionar rodape se for controlado ou requer aprovação
            const rodape = (d.controlado || d.requerAprovacao) ? gerarDocumentoComRodape(d) : ''
            console.log(`Baixando ${d.nome} com rodape:\n${rodape}`)
            
            const link = document.createElement('a')
            link.href = d.arquivo
            link.download = d.nome
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      }
    })
  }

  const pastasRaiz = pastas.filter((p) => !p.parentId)

  /* =========================
     Render recursivo subpastas (até 4 níveis)
  ========================= */
  const renderSubpastasRecursivo = (parentId, nivel) => {
    if (nivel > 4) return null

    const filhos = pastas.filter((p) => p.parentId === parentId)
    if (filhos.length === 0) return null

    return (
      <div className="mt-2 space-y-2">
        {filhos.map((p) => {
          const expanded = expandidas.has(p.id)
          const filhosCount = pastas.filter((x) => x.parentId === p.id).length

          return (
            <div key={p.id}>
              <SubpastaItem
                pasta={{
                  ...p,
                  documentos: documentos.filter((d) => d.pastaId === p.id).length,
                  subpastas: filhosCount
                }}
                selecionada={caminhoPastas[nivel] === p.id}
                onClick={() => selecionarPastaNoNivel(p.id, nivel)}
                getIconComponent={(name, cls) => getIconComponent(name, cls)}
                nivel={nivel}
                isExpanded={expanded}
                onToggleExpand={() => toggleExpand(p.id)}
                onEdit={handleEditarPasta}
                onDelete={excluirPasta}
                onAddSubpasta={handleAbrirFormularioPasta}
                onDownload={baixarPasta}
                onShare={compartilharPasta}
              />

              {expanded && renderSubpastasRecursivo(p.id, nivel + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  /* =========================
     Detecção de subpastas abertas (para recolhimento dinâmico)
  ========================= */
  const temSubpastasAbertas = useMemo(() => {
    return [...expandidas].some((id) => pastas.some((p) => p.parentId === id))
  }, [expandidas, pastas])

  /* =========================
     Render Painel de Aprovações
  ========================= */
  const renderPainelAprovacoes = () => {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header do Painel de Aprovações */}
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModoAprovacao(false)}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar para Documentos
              </Button>
              <div>
                <h1 className="text-lg font-bold">Painel de Aprovações</h1>
                <p className="text-sm text-gray-600">Gerencie as aprovações de documentos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium">{usuarioAtual.nome}</p>
                <p className="text-xs text-gray-500">{usuarioAtual.email}</p>
              </div>
              <div className="relative">
                <Button size="sm" variant="outline" className="relative">
                  <BellRing className="h-4 w-4" />
                  {notificacoes.filter(n => !n.lida).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Button
                variant={filtroAprovacao === 'pendentes' ? 'default' : 'outline'}
                onClick={() => setFiltroAprovacao('pendentes')}
                className="h-8"
              >
                <Clock4 className="h-4 w-4 mr-1" />
                Pendentes ({documentosParaAprovacao.filter(d => 
                  !d.historicoAprovacao?.some(h => h.email === usuarioAtual.email)
                ).length})
              </Button>
              <Button
                variant={filtroAprovacao === 'meus' ? 'default' : 'outline'}
                onClick={() => setFiltroAprovacao('meus')}
                className="h-8"
              >
                <History className="h-4 w-4 mr-1" />
                Meus Históricos
              </Button>
              <Button
                variant={filtroAprovacao === 'todos' ? 'default' : 'outline'}
                onClick={() => setFiltroAprovacao('todos')}
                className="h-8"
              >
                <FilePieChart className="h-4 w-4 mr-1" />
                Todas Aprovações
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="bg-white border-b px-4 py-3">
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Para Aprovação</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {documentosParaAprovacao.filter(d => 
                        !d.historicoAprovacao?.some(h => h.email === usuarioAtual.email)
                      ).length}
                    </p>
                  </div>
                  <FileCheck className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Aprovados por Mim</p>
                    <p className="text-2xl font-bold text-green-900">
                      {documentosParaAprovacao.filter(d => 
                        d.historicoAprovacao?.some(h => 
                          h.email === usuarioAtual.email && h.status === 'Aprovado'
                        )
                      ).length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700">Em Análise</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {documentosParaAprovacao.filter(d => 
                        d.historicoAprovacao?.some(h => 
                          h.email === usuarioAtual.email && h.status === 'Em análise'
                        )
                      ).length}
                    </p>
                  </div>
                  <Clock4 className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="p-4 bg-red-50 border-red-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">Reprovados por Mim</p>
                    <p className="text-2xl font-bold text-red-900">
                      {documentosParaAprovacao.filter(d => 
                        d.historicoAprovacao?.some(h => 
                          h.email === usuarioAtual.email && h.status === 'Reprovado'
                        )
                      ).length}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lista de Documentos para Aprovação */}
        <div className="flex-1 overflow-y-auto p-4">
          {documentosParaAprovacao.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum documento para aprovação
              </h3>
              <p className="text-gray-600">
                {filtroAprovacao === 'pendentes' 
                  ? 'Você não tem documentos pendentes de aprovação no momento.'
                  : 'Nenhum documento encontrado com os filtros atuais.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentosParaAprovacao.map((documento) => (
                <AprovacaoCard
                  key={documento.id}
                  documento={documento}
                  usuarioAtual={usuarioAtual}
                  onVisualizar={() => setDocumentoParaAprovacao(documento)}
                  onReenviar={() => {
                    const meuAprovador = documento.aprovadores?.find(a => a.email === usuarioAtual?.email)
                    if (meuAprovador) {
                      handleReenviarConvite(documento, meuAprovador)
                    }
                  }}
                  getIconComponent={getIconComponent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  /* =========================
     Render Principal
  ========================= */
  if (modoAprovacao) {
    return (
      <>
        {renderPainelAprovacoes()}
        
        {/* Modal de Visualização/Aprovação */}
        {documentoParaAprovacao && (
          <VisualizacaoAprovacao
            documento={documentoParaAprovacao}
            onClose={() => setDocumentoParaAprovacao(null)}
            onAprovar={handleAprovarDocumento}
            usuarioAtual={usuarioAtual}
          />
        )}
      </>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-2 py-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSidebarAberta(!sidebarAberta)} className="h-6 w-6 p-0">
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-sm font-semibold">Gestão de Documentos</h1>
          </div>

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-6 text-xs px-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Criar
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Criar / Gerenciar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAbrirFormularioPasta(pastaSelecionadaId)}>
                  <FolderPlus className="h-3 w-3 mr-2" />
                  Nova Pasta
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setEditandoDocumento(null)
                    resetarFormularioDocumento()
                    setMostrarFormularioDocumento(true)
                  }}
                >
                  <FileText className="h-3 w-3 mr-2" />
                  Novo Documento
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setModoAprovacao(true)}>
                  <FileCheck className="h-3 w-3 mr-2" />
                  Painel de Aprovações
                  {metricas.paraAprovacao > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {metricas.paraAprovacao}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setMostrarGerenciarTipos(true)}>
                  <Settings className="h-3 w-3 mr-2" />
                  Gerenciar Tipos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMostrarGerenciarIcones(true)}>
                  <Palette className="h-3 w-3 mr-2" />
                  Gerenciar Ícones
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarAberta && (
          <div className="w-64 bg-white border-r flex flex-col flex-shrink-0">
            <div className="p-2 border-b bg-gray-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">DIRETÓRIO</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAbrirFormularioPasta(null)}
                className="h-5 w-5 p-0"
                title="Nova Pasta Raiz"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-1">
              {arvorePastas.map((p) => (
                <TreeItem
                  key={p.id}
                  pasta={p}
                  onSelect={(pasta) => {
                    const novoCaminho = []
                    let atual = pasta
                    while (atual) {
                      novoCaminho.unshift(atual.id)
                      atual = pastas.find((x) => x.id === atual.parentId)
                    }
                    setCaminhoPastas(novoCaminho)
                    setDashboardAtivo(null)
                  }}
                  pastaSelecionadaId={pastaSelecionadaId}
                  onEdit={handleEditarPasta}
                  onDelete={excluirPasta}
                  onAddSubpasta={handleAbrirFormularioPasta}
                  expandidas={expandidas}
                  toggleExpand={toggleExpand}
                  getIconComponent={getIconComponent}
                />
              ))}
            </div>
          </div>
        )}

        {/* Área Principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb + filtros */}
          <div className="bg-white border-b px-4 py-2 flex flex-col gap-2">
            {/* Linha 1: breadcrumb */}
            <div className="flex items-center">
              <Breadcrumb caminhoPastas={caminhoPastas} pastas={pastas} onNavigate={setCaminhoPastas} />
            </div>

            {/* Linha 2: filtros com contorno */}
            <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  placeholder="Buscar documentos..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="h-8 text-xs pl-7 w-full border"
                />
              </div>

              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Tipos</SelectItem>
                  {tiposDocumento.map((t) => (
                    <SelectItem key={t.id} value={t.nome}>
                      {t.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                  <SelectItem value="Vencendo">Vencendo</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded overflow-hidden bg-white">
                <Button
                  size="sm"
                  variant={modoVisualizacao === 'list' ? 'default' : 'outline'}
                  onClick={() => setModoVisualizacao('list')}
                  className="h-7 w-8 p-0 rounded-none border-0"
                >
                  <List className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={modoVisualizacao === 'grid' ? 'default' : 'outline'}
                  onClick={() => setModoVisualizacao('grid')}
                  className="h-7 w-8 p-0 rounded-none border-0"
                >
                  <Grid3X3 className="h-3 w-3" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setMostrarPastas(!mostrarPastas)}
                className="h-8 text-xs px-2 bg-white"
              >
                <Folder className="h-3 w-3 mr-1" />
                {mostrarPastas ? 'Ocultar' : 'Mostrar'} Pastas
              </Button>
            </div>
          </div>

          {/* Dashboard de Métricas */}
          <div className="bg-white border-b px-4 py-3">
            <div className="grid grid-cols-5 gap-3">
              <DashboardCard
                titulo="Total"
                valor={metricas.total}
                icone={FileText}
                cor="blue"
                ativo={dashboardAtivo === 'total'}
                onClick={() => handleClickDashboard('total')}
              />
              <DashboardCard
                titulo="Vencidos"
                valor={metricas.vencidos}
                icone={AlertTriangle}
                cor="red"
                ativo={dashboardAtivo === 'vencidos'}
                onClick={() => handleClickDashboard('vencidos')}
              />
              <DashboardCard
                titulo="Vencendo"
                valor={metricas.vencendo}
                icone={Clock}
                cor="yellow"
                ativo={dashboardAtivo === 'vencendo'}
                onClick={() => handleClickDashboard('vencendo')}
              />
              <DashboardCard
                titulo="Pendentes"
                valor={metricas.pendentes}
                icone={Hourglass}
                cor="orange"
                ativo={dashboardAtivo === 'pendentes'}
                onClick={() => handleClickDashboard('pendentes')}
              />
              <DashboardCard
                titulo="Para Aprovar"
                valor={metricas.paraAprovacao}
                icone={FileCheck}
                cor="purple"
                ativo={dashboardAtivo === 'aprovacao'}
                onClick={() => setModoAprovacao(true)}
              />
            </div>
          </div>

          {/* Área Pastas */}
          {mostrarPastas && (
            <div
              className={`bg-white border-b px-4 py-3 relative group overflow-y-auto transition-all
                ${temSubpastasAbertas ? 'max-h-[420px]' : 'max-h-[160px]'}
              `}
            >
              {mostrarSetaEsquerda && (
                <button
                  onClick={() => scrollPastas('esquerda')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
              )}

              {mostrarSetaDireita && (
                <button
                  onClick={() => scrollPastas('direita')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              )}

              <div
                ref={scrollContainerRef}
                onScroll={verificarScroll}
                onMouseEnter={verificarScroll}
                className="overflow-x-auto scrollbar-hide"
              >
                <div className="flex gap-4 pb-2 px-4 min-w-min">
                  {pastasRaiz.map((pasta) => {
                    const isSelecionada = caminhoPastas[0] === pasta.id
                    const subpastasCount = pastas.filter((p) => p.parentId === pasta.id).length
                    const isExpanded = expandidas.has(pasta.id)

                    return (
                      <div key={pasta.id} className="relative flex-shrink-0">
                        <PastaPrimaria
                          pasta={{
                            ...pasta,
                            subpastas: subpastasCount,
                            documentos: documentos.filter((d) => d.pastaId === pasta.id).length
                          }}
                          selecionada={isSelecionada}
                          onClick={() => selecionarPastaNoNivel(pasta.id, 0)}
                          getIconComponent={(name, cls) => getIconComponent(name, cls)}
                          isExpanded={isExpanded}
                          onToggleExpand={() => toggleExpand(pasta.id)}
                          onEdit={handleEditarPasta}
                          onDelete={excluirPasta}
                          onAddSubpasta={handleAbrirFormularioPasta}
                          onDownload={baixarPasta}
                          onShare={compartilharPasta}
                        />

                        {/* render recursivo até 4º nível */}
                        {isExpanded && renderSubpastasRecursivo(pasta.id, 1)}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Lista de documentos */}
          <div className="flex-1 overflow-y-auto p-2">
            {documentosSelecionados.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded p-1.5 mb-2 flex items-center justify-between">
                <span className="text-xs text-blue-900">{documentosSelecionados.length} selecionado(s)</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={baixarMultiplos} className="h-5 text-xs px-2">
                    <Download className="h-3 w-3 mr-1" />
                    Baixar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDocumentoParaAcao(null)
                      setMostrarCompartilhamento(true)
                    }}
                    className="h-5 text-xs px-2"
                  >
                    <Share className="h-3 w-3 mr-1" />
                    Compartilhar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDocumentosSelecionados([])} className="h-5 text-xs px-1">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {modoVisualizacao === 'list' ? (
              <div className="bg-white rounded border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8 p-2">
                        <Checkbox
                          className="border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          checked={documentosFiltrados.length > 0 && documentosSelecionados.length === documentosFiltrados.length}
                          onCheckedChange={handleSelecionarTodos}
                        />
                      </TableHead>
                      <TableHead className="text-xs p-2">
                        <button onClick={() => handleSort('nome')} className="flex items-center gap-1">
                          Nome {renderSortIndicator('nome')}
                        </button>
                      </TableHead>
                      <TableHead className="text-xs p-2">
                        <button onClick={() => handleSort('tipo')} className="flex items-center gap-1">
                          Tipo {renderSortIndicator('tipo')}
                        </button>
                      </TableHead>
                      <TableHead className="text-xs p-2">
                        <button onClick={() => handleSort('status')} className="flex items-center gap-1">
                          Status {renderSortIndicator('status')}
                        </button>
                      </TableHead>
                      <TableHead className="text-xs p-2">
                        <button onClick={() => handleSort('fornecedorNome')} className="flex items-center gap-1">
                          Fornecedor {renderSortIndicator('fornecedorNome')}
                        </button>
                      </TableHead>
                      <TableHead className="text-xs p-2">
                        <button onClick={() => handleSort('dataVencimento')} className="flex items-center gap-1">
                          Vencimento {renderSortIndicator('dataVencimento')}
                        </button>
                      </TableHead>
                      <TableHead className="text-xs p-2 w-16">Ações</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {documentosFiltrados.map((doc) => (
                      <TableRow key={doc.id} className="text-xs cursor-pointer" onClick={() => validarSenhaDocumento(doc, 'visualizar')}>
                        <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            className="border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            checked={documentosSelecionados.includes(doc.id)}
                            onCheckedChange={(checked) => handleSelecionarDocumento(doc.id, checked)}
                          />
                        </TableCell>

                        <TableCell className="p-2">
                          <div className="flex items-center gap-2">
                            {getIconComponent(doc.icon, 'h-4 w-4')}
                            <div>
                              <div className="font-medium">{doc.nome}</div>
                              {renderAlertaVencimento(doc.diasParaVencimento)}
                              <div className="flex gap-1 mt-0.5">
                                {doc.protegido && (
                                  <Badge variant="outline" className="text-xs py-0 px-1 h-4 border-orange-400 text-orange-700">
                                    <Lock className="h-2 w-2 mr-0.5" />
                                    Protegido
                                  </Badge>
                                )}
                                {doc.controlado && (
                                  <Badge variant="outline" className="text-xs py-0 px-1 h-4 border-purple-400 text-purple-700">
                                    <Shield className="h-2 w-2 mr-0.5" />
                                    Controlado
                                  </Badge>
                                )}
                                {doc.alertaLGPD && (
                                  <Badge variant="outline" className="text-xs py-0 px-1 h-4 border-red-400 text-red-700">
                                    <AlertCircle className="h-2 w-2 mr-0.5" />
                                    LGPD
                                  </Badge>
                                )}
                                {doc.requerAprovacao && (
                                  <Badge variant="outline" className="text-xs py-0 px-1 h-4 border-blue-400 text-blue-700">
                                    <FileCheck className="h-2 w-2 mr-0.5" />
                                    {doc.statusAprovacao}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="p-2">
                          <Badge className={`text-xs ${getTipoColor(doc.tipo)}`}>{doc.tipo}</Badge>
                        </TableCell>

                        <TableCell className="p-2">
                          <div className="flex flex-col gap-1">
                            <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </Badge>
                            {doc.requerAprovacao && (
                              <Badge variant="outline" className={`text-xs ${getStatusColor(doc.statusAprovacao)}`}>
                                {doc.statusAprovacao}
                                {doc.aprovadores?.some(a => a.email === usuarioAtual.email) && 
                                 !doc.historicoAprovacao?.some(h => h.email === usuarioAtual.email) && (
                                  <span className="ml-1 animate-pulse">•</span>
                                )}
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="p-2">{doc.fornecedorNome}</TableCell>
                        <TableCell className="p-2">{formatarDataVencimento(doc.dataVencimento)}</TableCell>

                        <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => validarSenhaDocumento(doc, 'visualizar')}>
                                <Eye className="h-3 w-3 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => validarSenhaDocumento(doc, 'download')}>
                                <Download className="h-3 w-3 mr-2" />
                                Baixar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => validarSenhaDocumento(doc, 'compartilhar')}>
                                <Share className="h-3 w-3 mr-2" />
                                Compartilhar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => editarDocumento(doc)}>
                                <Edit className="h-3 w-3 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              {doc.requerAprovacao && doc.aprovadores?.some(a => a.email === usuarioAtual.email) && (
                                <DropdownMenuItem onClick={() => {
                                  setDocumentoParaAprovacao(doc)
                                }}>
                                  <FileCheck className="h-3 w-3 mr-2" />
                                  Aprovar/Reprovar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => excluirDocumento(doc.id)} className="text-red-600">
                                <Trash2 className="h-3 w-3 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {documentosFiltrados.map((doc) => (
                  <div key={doc.id} className="bg-white border rounded p-2 hover:shadow transition-shadow">
                    <div className="flex justify-between mb-1.5">
                      <Checkbox
                        className="border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        checked={documentosSelecionados.includes(doc.id)}
                        onCheckedChange={(checked) => handleSelecionarDocumento(doc.id, checked)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-4 w-4 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => validarSenhaDocumento(doc, 'visualizar')}>
                            <Eye className="h-3 w-3 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => validarSenhaDocumento(doc, 'download')}>
                            <Download className="h-3 w-3 mr-2" />
                            Baixar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => validarSenhaDocumento(doc, 'compartilhar')}>
                            <Share className="h-3 w-3 mr-2" />
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => editarDocumento(doc)}>
                            <Edit className="h-3 w-3 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => excluirDocumento(doc.id)} className="text-red-600">
                            <Trash2 className="h-3 w-3 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="text-center mb-1.5">{getIconComponent(doc.icon, 'h-6 w-6 mx-auto text-gray-600')}</div>

                    <h3 className="text-xs font-medium text-center mb-1 truncate" title={doc.nome}>
                      {doc.nome}
                    </h3>

                    <div className="flex gap-0.5 justify-center flex-wrap mb-1">
                      <Badge className={`text-xs py-0 px-1 ${getTipoColor(doc.tipo)}`}>{doc.tipo}</Badge>
                      <Badge className={`text-xs py-0 px-1 ${getStatusColor(doc.status)}`}>{doc.status}</Badge>
                    </div>

                    {renderAlertaVencimento(doc.diasParaVencimento)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================
         Dialog Nova/Editar Pasta
      ========================= */}
      <Dialog open={mostrarFormularioPasta} onOpenChange={setMostrarFormularioPasta}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{editandoPasta ? 'Editar Pasta' : 'Nova Pasta'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label className="text-xs">Nome *</Label>
              <Input
                value={formPasta.nome}
                onChange={(e) => setFormPasta((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome da pasta"
                className="h-7 text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">Descrição</Label>
              <Textarea
                value={formPasta.descricao}
                onChange={(e) => setFormPasta((prev) => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição"
                className="text-xs"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Cor</Label>
                <Select value={formPasta.cor} onValueChange={(v) => setFormPasta((prev) => ({ ...prev, cor: v }))}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="green">Verde</SelectItem>
                    <SelectItem value="orange">Laranja</SelectItem>
                    <SelectItem value="red">Vermelho</SelectItem>
                    <SelectItem value="purple">Roxo</SelectItem>
                    <SelectItem value="yellow">Amarelo</SelectItem>
                    <SelectItem value="indigo">Índigo</SelectItem>
                    <SelectItem value="pink">Rosa</SelectItem>
                    <SelectItem value="gray">Cinza</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Ícone</Label>
                <Select value={formPasta.icon} onValueChange={(v) => setFormPasta((prev) => ({ ...prev, icon: v }))}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconesPasta.map((i) => (
                      <SelectItem key={i.id} value={i.icon}>
                        <div className="flex items-center gap-2">
                          {getIconComponent(i.icon, 'h-3 w-3')}
                          {i.nome}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setMostrarFormularioPasta(false)
                  setEditandoPasta(null)
                }}
                className="h-6 text-xs"
              >
                Cancelar
              </Button>
              <Button size="sm" onClick={salvarPasta} className="h-6 text-xs">
                {editandoPasta ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog Confirmação Reutilizável */}
      <Dialog open={confirmacao.open} onOpenChange={(v) => !v && fecharConfirmacao()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{confirmacao.titulo}</DialogTitle>
            {confirmacao.descricao ? (
              <DialogDescription className="text-sm text-gray-600 py-2">{confirmacao.descricao}</DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={fecharConfirmacao} className="h-8">
              {confirmacao.labelCancelar}
            </Button>

            <Button
              variant={confirmacao.varianteConfirmar === 'destructive' ? 'destructive' : 'default'}
              onClick={() => {
                const fn = confirmacao.onConfirm
                fecharConfirmacao()
                if (typeof fn === 'function') fn()
              }}
              className="h-8"
            >
              {confirmacao.labelConfirmar}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================
         Dialog Documento (multi-etapas)
      ========================= */}
      <Dialog open={mostrarFormularioDocumento} onOpenChange={setMostrarFormularioDocumento}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">{editandoDocumento ? 'Editar Documento' : 'Novo Documento'}</DialogTitle>
          </DialogHeader>

          <Tabs value={`etapa-${etapaFormulario}`} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="etapa-1" className="text-xs" onClick={() => setEtapaFormulario(1)}>Informações Básicas</TabsTrigger>
              <TabsTrigger value="etapa-2" className="text-xs" onClick={() => setEtapaFormulario(2)}>Fornecedor</TabsTrigger>
              <TabsTrigger value="etapa-3" className="text-xs" onClick={() => setEtapaFormulario(3)}>Aprovação</TabsTrigger>
              <TabsTrigger value="etapa-4" className="text-xs" onClick={() => setEtapaFormulario(4)}>Configurações</TabsTrigger>
            </TabsList>

            {/* ETAPA 1 */}
            <TabsContent value="etapa-1" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Nome do Documento *</Label>
                  <Input
                    value={formDocumento.nome}
                    onChange={(e) => setFormDocumento((prev) => ({ ...prev, nome: e.target.value }))}
                    placeholder="Digite o nome"
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Tipo *</Label>
                  <Select value={formDocumento.tipo} onValueChange={(v) => setFormDocumento((prev) => ({ ...prev, tipo: v }))}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDocumento.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.nome}>
                          <div className="flex items-center gap-2">
                            {getIconComponent(tipo.icon, 'h-3 w-3')}
                            {tipo.nome}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Pasta</Label>
                  <Select
                    value={formDocumento.pastaId?.toString() || ''}
                    onValueChange={(v) => setFormDocumento((prev) => ({ ...prev, pastaId: parseInt(v) }))}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Selecione uma pasta" />
                    </SelectTrigger>
                    <SelectContent>
                      {pastas.map((pasta) => (
                        <SelectItem key={pasta.id} value={pasta.id.toString()}>
                          {pasta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Data de Vencimento</Label>
                  <Input
                    type="date"
                    value={formDocumento.dataVencimento}
                    onChange={(e) => setFormDocumento((prev) => ({ ...prev, dataVencimento: e.target.value }))}
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Localização Física</Label>
                  <Input
                    value={formDocumento.localizacaoFisica}
                    onChange={(e) => setFormDocumento((prev) => ({ ...prev, localizacaoFisica: e.target.value }))}
                    placeholder="Ex: Arquivo Central - Gaveta A1"
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Responsável pela Localização</Label>
                  <Input
                    value={formDocumento.localizacaoResponsavel}
                    onChange={(e) => setFormDocumento((prev) => ({ ...prev, localizacaoResponsavel: e.target.value }))}
                    placeholder="Nome do responsável"
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Observações</Label>
                <Textarea
                  value={formDocumento.observacoes}
                  onChange={(e) => setFormDocumento((prev) => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Informações adicionais sobre o documento"
                  className="text-xs"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-xs">Arquivo</Label>
                <Input
                  type="file"
                  onChange={(e) => setFormDocumento((prev) => ({ ...prev, arquivo: e.target.files?.[0] }))}
                  className="h-8 text-xs"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <p className="text-xs text-gray-500 mt-1">Formatos aceitos: PDF, JPG, PNG, DOC, DOCX</p>
              </div>

              <div className="flex justify-end">
                <Button size="sm" onClick={() => setEtapaFormulario(2)} className="h-6 text-xs">Próximo</Button>
              </div>
            </TabsContent>

            {/* ETAPA 2 */}
            <TabsContent value="etapa-2" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Nome do Fornecedor</Label>
                  <Input
                    value={formDocumento.fornecedorNome}
                    onChange={(e) => setFormDocumento((p) => ({ ...p, fornecedorNome: e.target.value }))}
                    placeholder="Nome completo"
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Tipo de Fornecedor</Label>
                  <Select
                    value={formDocumento.fornecedorTipo}
                    onValueChange={(v) => setFormDocumento((p) => ({ ...p, fornecedorTipo: v }))}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pessoa Física">Pessoa Física</SelectItem>
                      <SelectItem value="Pessoa Jurídica">Pessoa Jurídica</SelectItem>
                      <SelectItem value="Órgão Público">Órgão Público</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">CNPJ / CPF</Label>
                  <Input
                    value={formDocumento.fornecedorCnpjCpf}
                    onChange={(e) => setFormDocumento((p) => ({ ...p, fornecedorCnpjCpf: e.target.value }))}
                    placeholder="00.000.000/0000-00"
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Nome do Responsável/Contato</Label>
                  <Input
                    value={formDocumento.fornecedorResponsavel}
                    onChange={(e) => setFormDocumento((p) => ({ ...p, fornecedorResponsavel: e.target.value }))}
                    placeholder="Nome do contato"
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">E-mail</Label>
                  <Input
                    type="email"
                    value={formDocumento.fornecedorEmail}
                    onChange={(e) => setFormDocumento((p) => ({ ...p, fornecedorEmail: e.target.value }))}
                    placeholder="email@exemplo.com"
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Telefone</Label>
                  <Input
                    value={formDocumento.fornecedorTelefone}
                    onChange={(e) => setFormDocumento((p) => ({ ...p, fornecedorTelefone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Valor do Contrato</Label>
                <Input
                  value={formDocumento.valorContrato}
                  onChange={(e) => setFormDocumento((p) => ({ ...p, valorContrato: e.target.value }))}
                  placeholder="R$ 0,00"
                  className="h-7 text-xs"
                />
              </div>

              <div className="flex justify-between">
                <Button size="sm" variant="outline" onClick={() => setEtapaFormulario(1)} className="h-6 text-xs">Anterior</Button>
                <Button size="sm" onClick={() => setEtapaFormulario(3)} className="h-6 text-xs">Próximo</Button>
              </div>
            </TabsContent>

            {/* ETAPA 3 */}
            <TabsContent value="etapa-3" className="space-y-3">
              <div className="flex items-center space-x-2 p-3 border rounded bg-gray-50">
                <Checkbox
                  id="reqAprov"
                  checked={formDocumento.requerAprovacao}
                  onCheckedChange={(v) => setFormDocumento((p) => ({ ...p, requerAprovacao: v }))}
                  className="border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="reqAprov" className="text-sm font-medium">Este documento requer aprovação</Label>
              </div>

              {formDocumento.requerAprovacao && (
                <div className="space-y-3 p-3 border rounded bg-blue-50">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="seqAprov"
                      checked={formDocumento.fluxoAprovacao.sequencial}
                      onCheckedChange={(v) => setFormDocumento((p) => ({
                        ...p,
                        fluxoAprovacao: { ...p.fluxoAprovacao, sequencial: v }
                      }))}
                      className="border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="seqAprov" className="text-xs">Aprovação sequencial (por ordem)</Label>
                  </div>

                  <div>
                    <Label className="text-xs mb-2 block">Aprovadores</Label>
                    <div className="space-y-2">
                      {formDocumento.fluxoAprovacao.aprovadores.map((aprovador, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            placeholder="Nome do aprovador"
                            value={aprovador.nome}
                            onChange={(e) => atualizarAprovador(idx, 'nome', e.target.value)}
                            className="flex-1 h-7 text-xs"
                          />
                          <Input
                            type="email"
                            placeholder="E-mail *"
                            value={aprovador.email}
                            onChange={(e) => atualizarAprovador(idx, 'email', e.target.value)}
                            className="flex-1 h-7 text-xs"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerAprovador(idx)}
                            className="h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={adicionarAprovador}
                        className="h-7 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar Aprovador
                      </Button>
                    </div>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-800">
                      Os aprovadores receberão notificações por e-mail para validar o documento.
                      {formDocumento.fluxoAprovacao.sequencial && ' A aprovação seguirá a ordem definida acima.'}
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="flex justify-between">
                <Button size="sm" variant="outline" onClick={() => setEtapaFormulario(2)} className="h-6 text-xs">Anterior</Button>
                <Button size="sm" onClick={() => setEtapaFormulario(4)} className="h-6 text-xs">Próximo</Button>
              </div>
            </TabsContent>

            {/* ETAPA 4 */}
            <TabsContent value="etapa-4" className="space-y-3">
              <div className="space-y-3 p-3 border rounded bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prot"
                    checked={formDocumento.protegido}
                    onCheckedChange={(v) => setFormDocumento((p) => ({ ...p, protegido: v }))}
                    className="border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="prot" className="text-xs">Proteger documento com senha</Label>
                </div>
                {formDocumento.protegido && (
                  <div>
                    <Label className="text-xs">Senha de Proteção</Label>
                    <Input
                      type="password"
                      value={formDocumento.senha}
                      onChange={(e) => setFormDocumento((p) => ({ ...p, senha: e.target.value }))}
                      placeholder="Digite a senha"
                      className="h-7 text-xs"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ctrl"
                    checked={formDocumento.controlado}
                    onCheckedChange={(v) => setFormDocumento((p) => ({ ...p, controlado: v }))}
                    className="border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="ctrl" className="text-xs">Documento controlado (controle de versão)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lgpd"
                    checked={formDocumento.alertaLGPD}
                    onCheckedChange={(v) => setFormDocumento((p) => ({ ...p, alertaLGPD: v }))}
                    className="border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="lgpd" className="text-xs">Contém informações sensíveis (LGPD)</Label>
                </div>

                {formDocumento.alertaLGPD && (
                  <div>
                    <Label className="text-xs">Mensagem de Alerta LGPD</Label>
                    <Textarea
                      value={formDocumento.mensagemLGPD}
                      onChange={(e) => setFormDocumento((p) => ({ ...p, mensagemLGPD: e.target.value }))}
                      placeholder="Mensagem que será exibida ao acessar o documento"
                      className="text-xs"
                      rows={2}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 p-3 border rounded bg-amber-50">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Alertas de Vencimento
                </h3>

                <div>
                  <Label className="text-xs">Dias de Antecedência para Alerta</Label>
                  <Input
                    type="number"
                    value={formDocumento.alertasVencimento.diasAntecedencia}
                    onChange={(e) => setFormDocumento((p) => ({
                      ...p,
                      alertasVencimento: {
                        ...p.alertasVencimento,
                        diasAntecedencia: parseInt(e.target.value) || 30
                      }
                    }))}
                    placeholder="30"
                    className="h-7 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs mb-2 block">E-mails para Notificação</Label>
                  <div className="space-y-2">
                    {formDocumento.alertasVencimento.destinatarios.map((email, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={email}
                          onChange={(e) => atualizarDestinatarioAlerta(idx, e.target.value)}
                          className="flex-1 h-7 text-xs"
                        />
                        {formDocumento.alertasVencimento.destinatarios.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerDestinatarioAlerta(idx)}
                            className="h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={adicionarDestinatarioAlerta}
                      className="h-7 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar E-mail
                    </Button>
                  </div>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-xs text-amber-800">
                    Os destinatários receberão alertas antes do vencimento e também serão notificados quando o documento vencer.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="flex justify-between pt-4">
                <Button size="sm" variant="outline" onClick={() => setEtapaFormulario(3)} className="h-6 text-xs">Anterior</Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMostrarFormularioDocumento(false)
                      resetarFormularioDocumento()
                    }}
                    className="h-6 text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={salvarDocumento} className="h-6 text-xs bg-blue-600 hover:bg-blue-700">
                    Salvar Documento
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Dialog Compartilhamento */}
      <Dialog open={mostrarCompartilhamento} onOpenChange={setMostrarCompartilhamento}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Compartilhar</DialogTitle>
            <DialogDescription>Compartilhe documentos via e-mail ou WhatsApp</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Select value={opcaoEnvio} onValueChange={setOpcaoEnvio}>
              <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            {opcaoEnvio === 'email' ? (
              <Input
                placeholder="E-mail"
                value={emailsCompartilhamento[0]}
                onChange={(e) => setEmailsCompartilhamento([e.target.value])}
                className="h-7 text-xs"
              />
            ) : (
              <Input
                placeholder="WhatsApp"
                value={whatsappsCompartilhamento[0]}
                onChange={(e) => setWhatsappsCompartilhamento([e.target.value])}
                className="h-7 text-xs"
              />
            )}
            <Textarea
              placeholder="Mensagem..."
              value={mensagemCompartilhamento}
              onChange={(e) => setMensagemCompartilhamento(e.target.value)}
              className="text-xs"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setMostrarCompartilhamento(false)} className="h-6 text-xs">Cancelar</Button>
              <Button size="sm" onClick={processarCompartilhamento} className="h-6 text-xs">Enviar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Validação Senha */}
      <Dialog open={mostrarValidacaoSenha} onOpenChange={setMostrarValidacaoSenha}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-sm">Documento Protegido</DialogTitle>
            <DialogDescription>Digite a senha para acessar o documento</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input type="password" value={senhaDigitada} onChange={(e) => setSenhaDigitada(e.target.value)} placeholder="Digite a senha" />
            <Button className="w-full h-8 text-xs" onClick={confirmarSenha}>Acessar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Alerta LGPD */}
      <Dialog open={mostrarAlertaLGPD} onOpenChange={setMostrarAlertaLGPD}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Alerta LGPD</DialogTitle>
            <DialogDescription>Documento contém informações sensíveis</DialogDescription>
          </DialogHeader>
          <AlertDescription className="text-xs py-4">
            {documentoParaAcao?.mensagemLGPD || 'Este documento contém dados sensíveis. O acesso é registrado.'}
          </AlertDescription>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setMostrarAlertaLGPD(false)}>Cancelar</Button>
            <Button size="sm" onClick={confirmarLGPD}>Prosseguir</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Gerenciar Tipos */}
      <Dialog open={mostrarGerenciarTipos} onOpenChange={setMostrarGerenciarTipos}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Gerenciar Tipos de Documentos</DialogTitle>
            <p className="text-sm text-gray-600">Crie, edite e organize os tipos de documentos disponíveis</p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Card className="p-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{editandoTipo ? 'Editar Tipo' : 'Novo Tipo'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nome do Tipo</Label>
                    <Input
                      placeholder="Ex: Contrato, Certificado, Manual..."
                      value={formTipoDocumento.nome}
                      onChange={(e) => setFormTipoDocumento((p) => ({ ...p, nome: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ícone</Label>
                    <Select value={formTipoDocumento.icon} onValueChange={(v) => setFormTipoDocumento((p) => ({ ...p, icon: v }))}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione um ícone" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="fileText"><div className="flex items-center gap-2"><FileText className="h-4 w-4" /> Arquivo de Texto</div></SelectItem>
                        <SelectItem value="car"><div className="flex items-center gap-2"><Car className="h-4 w-4" /> Veículo</div></SelectItem>
                        <SelectItem value="user"><div className="flex items-center gap-2"><User className="h-4 w-4" /> Usuário</div></SelectItem>
                        <SelectItem value="building"><div className="flex items-center gap-2"><Building className="h-4 w-4" /> Empresa</div></SelectItem>
                        <SelectItem value="shield"><div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Segurança</div></SelectItem>
                        <SelectItem value="briefcase"><div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Negócios</div></SelectItem>
                        <SelectItem value="fileCheck"><div className="flex items-center gap-2"><FileCheck className="h-4 w-4" /> Verificado</div></SelectItem>
                        <SelectItem value="award"><div className="flex items-center gap-2"><Award className="h-4 w-4" /> Certificado</div></SelectItem>
                        <SelectItem value="fileSignature"><div className="flex items-center gap-2"><FileSignature className="h-4 w-4" /> Assinado</div></SelectItem>
                        <SelectItem value="users"><div className="flex items-center gap-2"><Users className="h-4 w-4" /> Grupo</div></SelectItem>
                        <SelectItem value="home"><div className="flex items-center gap-2"><Home className="h-4 w-4" /> Residencial</div></SelectItem>
                        <SelectItem value="star"><div className="flex items-center gap-2"><Star className="h-4 w-4" /> Favorito</div></SelectItem>
                        <SelectItem value="heart"><div className="flex items-center gap-2"><Heart className="h-4 w-4" /> Importante</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cor</Label>
                  <div className="flex gap-2 flex-wrap">
                    {['blue', 'green', 'orange', 'red', 'purple', 'yellow', 'indigo', 'pink', 'gray'].map((cor) => (
                      <button
                        key={cor}
                        onClick={() => setFormTipoDocumento((p) => ({ ...p, cor }))}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          formTipoDocumento.cor === cor ? 'border-gray-800 scale-110 ring-2 ring-gray-400' : 'border-gray-300 hover:border-gray-500'
                        }`}
                        style={{
                          backgroundColor:
                            cor === 'blue' ? '#3B82F6' :
                            cor === 'green' ? '#10B981' :
                            cor === 'orange' ? '#F97316' :
                            cor === 'red' ? '#EF4444' :
                            cor === 'purple' ? '#A855F7' :
                            cor === 'yellow' ? '#EAB308' :
                            cor === 'indigo' ? '#6366F1' :
                            cor === 'pink' ? '#EC4899' : '#6B7280'
                        }}
                        title={cor}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  {editandoTipo && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditandoTipo(null)
                        setFormTipoDocumento({ nome: '', icon: 'fileText', cor: 'gray' })
                      }}
                      className="px-6"
                    >
                      Cancelar Edição
                    </Button>
                  )}
                  <Button onClick={editandoTipo ? salvarEdicaoTipo : adicionarTipoDocumento} className="px-6">
                    {editandoTipo ? 'Salvar Alterações' : 'Adicionar Tipo'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tipos Existentes</CardTitle>
                <p className="text-sm text-gray-600">Clique em um tipo para editá-lo</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tiposDocumento.map((tipo) => (
                    <div
                      key={tipo.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        editandoTipo?.id === tipo.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => editarTipoDocumento(tipo)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getIconComponent(tipo.icon, 'h-5 w-5')}
                          <span className="font-medium text-sm">{tipo.nome}</span>
                        </div>
                        {tipo.editavel && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              excluirTipoDocumento(tipo.id)
                            }}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{
                            backgroundColor:
                              tipo.cor === 'blue' ? '#3B82F6' :
                              tipo.cor === 'green' ? '#10B981' :
                              tipo.cor === 'orange' ? '#F97316' :
                              tipo.cor === 'red' ? '#EF4444' :
                              tipo.cor === 'purple' ? '#A855F7' :
                              tipo.cor === 'yellow' ? '#EAB308' :
                              tipo.cor === 'indigo' ? '#6366F1' :
                              tipo.cor === 'pink' ? '#EC4899' : '#6B7280'
                          }}
                        />
                        <span className="text-xs text-gray-500 capitalize">{tipo.cor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setMostrarGerenciarTipos(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Gerenciar Ícones */}
      <Dialog open={mostrarGerenciarIcones} onOpenChange={setMostrarGerenciarIcones}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Gerenciar Ícones de Pastas</DialogTitle>
            <p className="text-sm text-gray-600">Personalize os ícones disponíveis para as pastas</p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Card className="p-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{editandoIcone ? 'Editar Ícone' : 'Novo Ícone'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nome do Ícone</Label>
                    <Input
                      placeholder="Ex: Financeiro, RH, Jurídico..."
                      value={formIconePasta.nome}
                      onChange={(e) => setFormIconePasta((p) => ({ ...p, nome: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ícone</Label>
                    <Select value={formIconePasta.icon} onValueChange={(v) => setFormIconePasta((p) => ({ ...p, icon: v }))}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione um ícone" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="folder"><div className="flex items-center gap-2"><Folder className="h-4 w-4" /> Pasta</div></SelectItem>
                        <SelectItem value="car"><div className="flex items-center gap-2"><Car className="h-4 w-4" /> Veículo</div></SelectItem>
                        <SelectItem value="user"><div className="flex items-center gap-2"><User className="h-4 w-4" /> Usuário</div></SelectItem>
                        <SelectItem value="building"><div className="flex items-center gap-2"><Building className="h-4 w-4" /> Empresa</div></SelectItem>
                        <SelectItem value="shield"><div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Segurança</div></SelectItem>
                        <SelectItem value="briefcase"><div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Negócios</div></SelectItem>
                        <SelectItem value="fileCheck"><div className="flex items-center gap-2"><FileCheck className="h-4 w-4" /> Verificado</div></SelectItem>
                        <SelectItem value="award"><div className="flex items-center gap-2"><Award className="h-4 w-4" /> Certificado</div></SelectItem>
                        <SelectItem value="fileSignature"><div className="flex items-center gap-2"><FileSignature className="h-4 w-4" /> Assinado</div></SelectItem>
                        <SelectItem value="users"><div className="flex items-center gap-2"><Users className="h-4 w-4" /> Grupo</div></SelectItem>
                        <SelectItem value="home"><div className="flex items-center gap-2"><Home className="h-4 w-4" /> Residencial</div></SelectItem>
                        <SelectItem value="star"><div className="flex items-center gap-2"><Star className="h-4 w-4" /> Favorito</div></SelectItem>
                        <SelectItem value="heart"><div className="flex items-center gap-2"><Heart className="h-4 w-4" /> Importante</div></SelectItem>
                        <SelectItem value="mapPin"><div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Localização</div></SelectItem>
                        <SelectItem value="settings"><div className="flex items-center gap-2"><Settings className="h-4 w-4" /> Configurações</div></SelectItem>
                        <SelectItem value="palette"><div className="flex items-center gap-2"><Palette className="h-4 w-4" /> Design</div></SelectItem>
                        <SelectItem value="type"><div className="flex items-center gap-2"><Type className="h-4 w-4" /> Texto</div></SelectItem>
                        <SelectItem value="grid3x3"><div className="flex items-center gap-2"><Grid3X3 className="h-4 w-4" /> Grade</div></SelectItem>
                        <SelectItem value="menu"><div className="flex items-center gap-2"><Menu className="h-4 w-4" /> Menu</div></SelectItem>
                        <SelectItem value="eye"><div className="flex items-center gap-2"><Eye className="h-4 w-4" /> Visualizar</div></SelectItem>
                        <SelectItem value="folderPlus"><div className="flex items-center gap-2"><FolderPlus className="h-4 w-4" /> Nova Pasta</div></SelectItem>
                        <SelectItem value="fileUp"><div className="flex items-center gap-2"><FileUp className="h-4 w-4" /> Upload</div></SelectItem>
                        <SelectItem value="messageCircle"><div className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Mensagem</div></SelectItem>
                        <SelectItem value="key"><div className="flex items-center gap-2"><Key className="h-4 w-4" /> Chave</div></SelectItem>
                        <SelectItem value="userCog"><div className="flex items-center gap-2"><UserCog className="h-4 w-4" /> Admin</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  {editandoIcone && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditandoIcone(null)
                        setFormIconePasta({ nome: '', icon: 'folder' })
                      }}
                      className="px-6"
                    >
                      Cancelar Edição
                    </Button>
                  )}
                  <Button onClick={editandoIcone ? salvarEdicaoIcone : adicionarIconePasta} className="px-6">
                    {editandoIcone ? 'Salvar Alterações' : 'Adicionar Ícone'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ícones Existentes</CardTitle>
                <p className="text-sm text-gray-600">Clique em um ícone para editá-lo</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {iconesPasta.map((icone) => (
                    <div
                      key={icone.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        editandoIcone?.id === icone.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => editarIconePasta(icone)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getIconComponent(icone.icon, 'h-5 w-5')}
                          <span className="font-medium text-sm">{icone.nome}</span>
                        </div>
                        {icone.editavel && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              excluirIconePasta(icone.id)
                            }}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{icone.editavel ? 'Editável' : 'Padrão'}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setMostrarGerenciarIcones(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização/Aprovação */}
      {documentoParaAprovacao && (
        <VisualizacaoAprovacao
          documento={documentoParaAprovacao}
          onClose={() => setDocumentoParaAprovacao(null)}
          onAprovar={handleAprovarDocumento}
          usuarioAtual={usuarioAtual}
        />
      )}
    </div>
  )
}