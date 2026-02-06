import React, { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  Eye,
  EyeOff,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Award,
  Download,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'

export default function VideoPlayerAdvanced({ 
  videoUrl, 
  treinamento, 
  onProgress, 
  onComplete,
  enableFaceRecognition = true 
}) {
  // Estados do player
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  
  // Estados do reconhecimento facial
  const [faceDetectionActive, setFaceDetectionActive] = useState(enableFaceRecognition)
  const [attentionScore, setAttentionScore] = useState(0)
  const [faceDetected, setFaceDetected] = useState(false)
  const [awayFromScreen, setAwayFromScreen] = useState(false)
  const [attentionWarnings, setAttentionWarnings] = useState(0)
  
  // Estados de progresso e certificação
  const [watchedPercentage, setWatchedPercentage] = useState(0)
  const [canTakeTest, setCanTakeTest] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [certificateAvailable, setCertificateAvailable] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  
  // Refs
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const playerRef = useRef(null)
  
  // Dados simulados do teste
  const [testQuestions] = useState([
    {
      id: 1,
      question: "Qual é o principal objetivo da segurança no trabalho?",
      options: [
        "Aumentar a produtividade",
        "Prevenir acidentes e proteger a saúde dos trabalhadores",
        "Reduzir custos operacionais",
        "Melhorar a imagem da empresa"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Quais são os EPIs básicos para trabalho em altura?",
      options: [
        "Capacete e luvas",
        "Cinto de segurança e capacete",
        "Capacete, cinto de segurança e calçado de segurança",
        "Apenas cinto de segurança"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "Em caso de emergência, qual deve ser a primeira ação?",
      options: [
        "Ligar para o supervisor",
        "Avaliar a situação e garantir a própria segurança",
        "Tentar resolver o problema sozinho",
        "Ignorar se não for grave"
      ],
      correct: 1
    }
  ])
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [testScore, setTestScore] = useState(0)

  // Inicializar reconhecimento facial
  useEffect(() => {
    if (faceDetectionActive) {
      initializeFaceDetection()
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [faceDetectionActive])

  // Atualizar progresso do vídeo
  useEffect(() => {
    if (duration > 0) {
      const percentage = (currentTime / duration) * 100
      setWatchedPercentage(percentage)
      
      // Verificar se pode fazer o teste (assistiu pelo menos 80%)
      if (percentage >= 80 && !canTakeTest) {
        setCanTakeTest(true)
      }
      
      // Callback de progresso
      if (onProgress) {
        onProgress({
          currentTime,
          duration,
          percentage,
          attentionScore,
          canTakeTest: percentage >= 80
        })
      }
    }
  }, [currentTime, duration, attentionScore, onProgress])

  const initializeFaceDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      })
      streamRef.current = stream
      
      // Simular detecção facial (em produção, usaria bibliotecas como face-api.js)
      const faceDetectionInterval = setInterval(() => {
        // Simulação de detecção facial
        const detected = Math.random() > 0.3 // 70% chance de detectar rosto
        setFaceDetected(detected)
        
        if (detected) {
          setAwayFromScreen(false)
          setAttentionScore(prev => Math.min(prev + 1, 100))
        } else {
          setAwayFromScreen(true)
          setAttentionWarnings(prev => prev + 1)
          
          // Pausar vídeo se não detectar rosto por muito tempo
          if (attentionWarnings > 10 && isPlaying) {
            handlePause()
          }
        }
      }, 1000)
      
      return () => clearInterval(faceDetectionInterval)
    } catch (error) {
      console.error('Erro ao inicializar reconhecimento facial:', error)
      setFaceDetectionActive(false)
    }
  }

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, currentTime - 10)
    }
  }

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, currentTime + 10)
    }
  }

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleTestAnswer = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const submitTest = () => {
    let correct = 0
    testQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correct++
      }
    })
    
    const score = (correct / testQuestions.length) * 100
    setTestScore(score)
    setTestCompleted(true)
    
    // Se passou no teste (>= 70%), libera certificado
    if (score >= 70) {
      setCertificateAvailable(true)
    }
    
    setShowTestModal(false)
    
    if (onComplete) {
      onComplete({
        watchedPercentage,
        attentionScore,
        testScore: score,
        passed: score >= 70
      })
    }
  }

  const downloadCertificate = () => {
    // Em produção, geraria um PDF real
    const certificateData = {
      studentName: "Usuário Atual",
      courseName: treinamento?.titulo || "Curso de Treinamento",
      completionDate: new Date().toLocaleDateString(),
      score: testScore,
      instructor: treinamento?.instrutor || "Instrutor"
    }
    
    console.log('Baixando certificado:', certificateData)
    alert('Certificado baixado com sucesso!')
  }

  return (
    <div className="space-y-6">
      {/* Player de Vídeo */}
      <div ref={playerRef} className="relative bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Controles do Player */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Barra de Progresso */}
          <div className="mb-4">
            <Slider
              value={[duration ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>
          
          {/* Controles */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isPlaying ? handlePause : handlePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={skipBackward}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={skipForward}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                <div className="w-20">
                  <Slider
                    value={[volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
              
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Velocidade de Reprodução */}
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                className="bg-black/50 text-white text-sm rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Indicador de Reconhecimento Facial */}
        {faceDetectionActive && (
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${faceDetected ? 'bg-green-500' : 'bg-red-500'}`} />
            <Camera className="w-5 h-5 text-white" />
            {awayFromScreen && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                Olhe para a tela!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Painel de Monitoramento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Progresso do Vídeo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={watchedPercentage} className="h-2" />
              <p className="text-sm text-slate-600">
                {watchedPercentage.toFixed(1)}% assistido
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Nível de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={attentionScore} className="h-2" />
              <p className="text-sm text-slate-600">
                {attentionScore}% de atenção
              </p>
              {attentionWarnings > 0 && (
                <p className="text-xs text-orange-600">
                  {attentionWarnings} avisos de distração
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Certificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {!canTakeTest && (
                <Badge variant="outline">
                  Assista 80% para fazer o teste
                </Badge>
              )}
              
              {canTakeTest && !testCompleted && (
                <Button
                  onClick={() => setShowTestModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Fazer Teste
                </Button>
              )}
              
              {testCompleted && !certificateAvailable && (
                <Badge variant="destructive">
                  Nota insuficiente: {testScore.toFixed(1)}%
                </Badge>
              )}
              
              {certificateAvailable && (
                <Button
                  onClick={downloadCertificate}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Certificado
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Treinamento */}
      {treinamento && (
        <Card>
          <CardHeader>
            <CardTitle>{treinamento.titulo}</CardTitle>
            <CardDescription>
              Instrutor: {treinamento.instrutor} • Duração: {treinamento.duracao}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">{treinamento.descricao}</p>
            
            {/* Materiais de Apoio */}
            {treinamento.materiais && treinamento.materiais.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Materiais de Apoio:</h4>
                <div className="space-y-2">
                  {treinamento.materiais.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-sm">{material.nome}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal do Teste */}
      <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Teste de Conhecimento</DialogTitle>
            <DialogDescription>
              Responda às questões para obter seu certificado
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {testQuestions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <h4 className="font-medium">
                  {index + 1}. {question.question}
                </h4>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionIndex}
                        onChange={() => handleTestAnswer(question.id, optionIndex)}
                        className="rounded"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={submitTest}
              disabled={Object.keys(selectedAnswers).length < testQuestions.length}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Enviar Respostas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

