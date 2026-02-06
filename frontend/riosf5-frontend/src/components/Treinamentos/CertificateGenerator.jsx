import { useState } from 'react'
import { 
  Award, 
  Download, 
  Share2, 
  Calendar, 
  User, 
  Building2,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'

export default function CertificateGenerator({ 
  usuario, 
  treinamento, 
  estatisticas, 
  onDownload, 
  onShare 
}) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateCertificate = async () => {
    setIsGenerating(true)
    
    try {
      // Simula geração do certificado
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // TODO: Implementar geração real do PDF
      const certificateData = {
        id: `CERT-${Date.now()}`,
        usuario: usuario.nome,
        empresa: usuario.empresa,
        treinamento: treinamento.titulo,
        instrutor: treinamento.instrutor,
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        cargaHoraria: treinamento.duracao,
        aproveitamento: estatisticas.averageAttention,
        validadeAte: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
      }
      
      onDownload?.(certificateData)
    } catch (error) {
      console.error('Erro ao gerar certificado:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerateCertificate = () => {
    return estatisticas.approved && 
           estatisticas.completionPercentage >= (treinamento.aproveitamentoMinimo || 80) &&
           estatisticas.averageAttention >= 70
  }

  return (
    <Card className="riosf5-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-6 w-6 mr-2 text-primary" />
          Certificado de Conclusão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview do Certificado */}
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Award className="h-16 w-16 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-primary">
              CERTIFICADO DE CONCLUSÃO
            </h2>
            
            <div className="space-y-2 text-muted-foreground">
              <p>Certificamos que</p>
              <p className="text-xl font-semibold text-foreground">
                {usuario?.nome || 'Nome do Usuário'}
              </p>
              <p>concluiu com aproveitamento o treinamento</p>
              <p className="text-lg font-semibold text-foreground">
                {treinamento?.titulo || 'Nome do Treinamento'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Empresa:</span>
                </div>
                <p className="text-muted-foreground">{usuario?.empresa || 'Nome da Empresa'}</p>
              </div>
              
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Instrutor:</span>
                </div>
                <p className="text-muted-foreground">{treinamento?.instrutor || 'Nome do Instrutor'}</p>
              </div>
              
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Data de Emissão:</span>
                </div>
                <p className="text-muted-foreground">{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Carga Horária:</span>
                </div>
                <p className="text-muted-foreground">{treinamento?.duracao || '45 min'}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-muted-foreground/20">
              <p className="text-xs text-muted-foreground">
                Certificado ID: CERT-{Date.now().toString().slice(-8)}
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas de Aproveitamento */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {estatisticas?.completionPercentage?.toFixed(1) || '0'}%
            </div>
            <div className="text-sm text-muted-foreground">Conclusão</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {estatisticas?.averageAttention || '0'}%
            </div>
            <div className="text-sm text-muted-foreground">Atenção Média</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.floor((estatisticas?.watchTime || 0) / 60)}min
            </div>
            <div className="text-sm text-muted-foreground">Tempo Assistido</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {estatisticas?.totalPauses || '0'}
            </div>
            <div className="text-sm text-muted-foreground">Pausas</div>
          </div>
        </div>

        {/* Status de Aprovação */}
        <div className="flex items-center justify-center space-x-2">
          {canGenerateCertificate() ? (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-1" />
              Aprovado para Certificação
            </Badge>
          ) : (
            <Badge variant="destructive">
              <Award className="h-4 w-4 mr-1" />
              Não Atende aos Critérios
            </Badge>
          )}
        </div>

        {/* Critérios de Aprovação */}
        <div className="space-y-2 text-sm">
          <h4 className="font-medium">Critérios de Aprovação:</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>Conclusão mínima:</span>
              <span className={`font-medium ${
                (estatisticas?.completionPercentage || 0) >= (treinamento?.aproveitamentoMinimo || 80) 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {treinamento?.aproveitamentoMinimo || 80}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Atenção mínima:</span>
              <span className={`font-medium ${
                (estatisticas?.averageAttention || 0) >= 70 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                70%
              </span>
            </div>
            {treinamento?.reconhecimentoFacial && (
              <div className="flex items-center justify-between">
                <span>Reconhecimento facial:</span>
                <span className="font-medium text-green-600">Ativo</span>
              </div>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex space-x-2">
          <Button
            onClick={generateCertificate}
            disabled={!canGenerateCertificate() || isGenerating}
            className="flex-1 riosf5-button"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Gerando...' : 'Baixar Certificado'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onShare?.()}
            disabled={!canGenerateCertificate()}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {!canGenerateCertificate() && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p className="font-medium mb-1">Para gerar o certificado:</p>
            <ul className="list-disc list-inside space-y-1">
              {(estatisticas?.completionPercentage || 0) < (treinamento?.aproveitamentoMinimo || 80) && (
                <li>Complete pelo menos {treinamento?.aproveitamentoMinimo || 80}% do treinamento</li>
              )}
              {(estatisticas?.averageAttention || 0) < 70 && (
                <li>Mantenha atenção média de pelo menos 70%</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

