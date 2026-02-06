import { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Eye,
  EyeOff,
  Camera,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.jsx'

export default function VideoPlayer({
  videoUrl,
  treinamento,
  onProgress,
  onComplete,
  reconhecimentoFacial = false
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)

  // Estados do rastreamento ocular
  const [eyeTrackingActive, setEyeTrackingActive] = useState(false)
  const [lookingAtScreen, setLookingAtScreen] = useState(false)
  const [attentionScore, setAttentionScore] = useState(100)
  const [pausedForInattention, setPausedForInattention] = useState(false)
  const attentionIntervalRef = useRef(null)
  const progressIntervalRef = useRef(null)

  // Dados de progresso
  const [watchTime, setWatchTime] = useState(0)
  const [totalPauses, setTotalPauses] = useState(0)
  const [timeWatchingScreen, setTimeWatchingScreen] = useState(0)
  const [pausesForInattention, setPausesForInattention] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', handleVideoEnd)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [])

  // Lógica de rastreamento ocular com WebGazer.js
  useEffect(() => {
    if (!reconhecimentoFacial || !eyeTrackingActive) {
      if (window.webgazer) {
        window.webgazer.pause()
        window.webgazer.clearData()
      }
      clearInterval(attentionIntervalRef.current)
      return
    }

    if (window.webgazer) {
      window.webgazer.setRegression('ridge')
        .setTracker('clmtrackr')
        .begin()
        .showPredictionPoints(false)
        .showVideoPreview(false)

      window.webgazer.setGazeListener((data, elapsedTime) => {
        if (data == null) {
          setLookingAtScreen(false)
          return
        }

        const x = data.x // gaze x coordinate
        const y = data.y // gaze y coordinate

        const videoElement = videoRef.current
        if (videoElement) {
          const videoRect = videoElement.getBoundingClientRect()
          const isLooking = (
            x >= videoRect.left &&
            x <= videoRect.right &&
            y >= videoRect.top &&
            y <= videoRect.bottom
          )
          setLookingAtScreen(isLooking)
        }
      })

      // Atualiza o score de atenção a cada segundo
      attentionIntervalRef.current = setInterval(() => {
        setAttentionScore(prevScore => {
          if (lookingAtScreen) {
            return Math.min(100, prevScore + 1) // Aumenta o score se estiver olhando
          } else {
            return Math.max(0, prevScore - 2) // Diminui o score se não estiver olhando
          }
        })
      }, 1000)

    } else {
      console.warn('WebGazer.js não carregado. Verifique a inclusão do script.')
    }

    return () => {
      if (window.webgazer) {
        window.webgazer.pause()
        window.webgazer.clearData()
      }
      clearInterval(attentionIntervalRef.current)
    }
  }, [reconhecimentoFacial, eyeTrackingActive, lookingAtScreen])

  // Pausa o vídeo se a atenção cair muito
  useEffect(() => {
    if (isPlaying && attentionScore < 50 && !pausedForInattention) {
      handlePause()
      setPausedForInattention(true)
      setPausesForInattention(prev => prev + 1)
      setTimeout(() => setPausedForInattention(false), 3000)
    }
  }, [attentionScore, isPlaying, pausedForInattention])

  // Atualiza tempo assistido e tempo olhando para a tela
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setWatchTime(prev => prev + 1)
        if (lookingAtScreen) {
          setTimeWatchingScreen(prev => prev + 1)
        }
        
        // Enviar progresso para o backend a cada 10 segundos
        if (watchTime % 10 === 0) {
          sendProgressToBackend()
        }
      }, 1000)
      
      return () => clearInterval(progressIntervalRef.current)
    }
  }, [isPlaying, lookingAtScreen, watchTime])

  const sendProgressToBackend = async () => {
    if (!treinamento?.id) return

    try {
      const token = localStorage.getItem('token')
      const averageAttention = timeWatchingScreen > 0 ? (timeWatchingScreen / watchTime) * 100 : 0

      await fetch(`/api/treinamentos/${treinamento.id}/progresso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tempo_assistido: watchTime,
          porcentagem_concluida: duration ? (currentTime / duration) * 100 : 0,
          tempo_olhando_tela: timeWatchingScreen,
          score_atencao_medio: averageAttention,
          pausas_por_desatencao: pausesForInattention
        })
      })
    } catch (error) {
      console.error('Erro ao enviar progresso:', error)
    }
  }

  const handlePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }

  const handlePlay = () => {
    const video = videoRef.current
    if (!video) return

    video.play()
    setIsPlaying(true)

    // Ativa rastreamento ocular se habilitado
    if (reconhecimentoFacial) {
      setEyeTrackingActive(true)
    }
  }

  const handlePause = () => {
    const video = videoRef.current
    if (!video) return

    video.pause()
    setIsPlaying(false)
    setTotalPauses(prev => prev + 1)
    setEyeTrackingActive(false)
    
    // Enviar progresso quando pausar
    sendProgressToBackend()
  }

  const handleSeek = (value) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const handleSkip = (seconds) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
  }

  const handlePlaybackRateChange = (rate) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
  }

  const handleFullscreen = () => {
    const container = videoRef.current?.parentElement
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleVideoEnd = async () => {
    setIsPlaying(false)
    setEyeTrackingActive(false)

    // Finalizar treinamento no backend
    try {
      const token = localStorage.getItem('token')
      const averageAttention = timeWatchingScreen > 0 ? (timeWatchingScreen / watchTime) * 100 : 0

      const response = await fetch(`/api/treinamentos/${treinamento.id}/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tempo_assistido: watchTime,
          tempo_olhando_tela: timeWatchingScreen,
          score_atencao_medio: averageAttention,
          pausas_por_desatencao: pausesForInattention
        })
      })

      const result = await response.json()
      
      // Calcular estatísticas finais
      const completionPercentage = (currentTime / duration) * 100
      const finalStats = {
        completionPercentage,
        watchTime,
        timeWatchingScreen,
        totalPauses,
        pausesForInattention,
        averageAttention,
        approved: result.aprovado || false,
        canTakeTest: result.pode_fazer_teste || false
      }

      onComplete?.(finalStats)
    } catch (error) {
      console.error('Erro ao finalizar treinamento:', error)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0
  const attentionPercentage = watchTime > 0 ? (timeWatchingScreen / watchTime) * 100 : 0

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        />

        {/* Overlay de rastreamento ocular */}
        {reconhecimentoFacial && eyeTrackingActive && (
          <div className="absolute top-4 right-4 space-y-2">
            <Card className="bg-black/80 border-none">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 text-white text-sm">
                  <Camera className="h-4 w-4" />
                  <span>Rastreamento Ativo</span>
                  {lookingAtScreen ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-white">
                    <span>Atenção:</span>
                    <span className={attentionScore >= 70 ? 'text-green-500' : 'text-red-500'}>
                      {attentionScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                    <div
                      className={`h-1 rounded-full ${attentionScore >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${attentionScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alerta de desatenção */}
        {pausedForInattention && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Card className="bg-red-900/90 border-red-500">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">
                  Atenção Necessária
                </h3>
                <p className="text-red-200 text-sm">
                  O vídeo foi pausado. Mantenha o foco na tela para continuar.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controles do Player */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Barra de Progresso */}
            <div className="mb-4">
              <Slider
                value={[progressPercentage]}
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
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSkip(-10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSkip(10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Velocidade</p>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <Button
                          key={rate}
                          variant={playbackRate === rate ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handlePlaybackRateChange(rate)}
                        >
                          {rate}x
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estatísticas de Progresso */}
      <div className="p-4 bg-muted/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Progresso:</span>
            <div className="font-medium">{progressPercentage.toFixed(1)}%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Tempo assistido:</span>
            <div className="font-medium">{Math.floor(watchTime / 60)}min {watchTime % 60}s</div>
          </div>
          <div>
            <span className="text-muted-foreground">Pausas:</span>
            <div className="font-medium">{totalPauses}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Atenção:</span>
            <div className={`font-medium ${attentionPercentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
              {attentionPercentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



