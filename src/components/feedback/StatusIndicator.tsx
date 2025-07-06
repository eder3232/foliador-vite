import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Clock,
  Settings,
  CheckCircle,
  Loader2,
  AlertCircle,
  FileText,
  Upload,
  Play,
} from 'lucide-react'

export function StatusIndicator() {
  const [state] = useFoliadorStore()

  // Obtener estado actual de la máquina
  const currentState = state.value
  const error = state.context.error

  // Configuración de estados
  const getStatusConfig = () => {
    switch (currentState) {
      case 'idle':
        return {
          icon: <FileText className="h-4 w-4" />,
          title: 'Listo',
          description: 'Preparado para subir un archivo PDF',
          color: 'gray',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
        }

      case 'uploading':
        return {
          icon: <Upload className="h-4 w-4 animate-pulse" />,
          title: 'Subiendo archivo',
          description: 'Cargando el archivo PDF al sistema',
          color: 'blue',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
        }

      case 'configuring':
        return {
          icon: <Settings className="h-4 w-4" />,
          title: 'Configurando',
          description: 'Ajustando opciones de foliado',
          color: 'purple',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
        }

      case 'ready':
        return {
          icon: <Play className="h-4 w-4" />,
          title: 'Listo para procesar',
          description: 'Archivo cargado y configuración lista',
          color: 'green',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
        }

      case 'processing':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          title: 'Procesando',
          description: 'Aplicando folios al PDF',
          color: 'blue',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
        }

      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          title: 'Completado',
          description: 'PDF procesado exitosamente',
          color: 'green',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
        }

      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          title: 'Error',
          description: error || 'Ocurrió un error en el procesamiento',
          color: 'red',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
        }

      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          title: 'Desconocido',
          description: 'Estado no reconocido',
          color: 'gray',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
        }
    }
  }

  const statusConfig = getStatusConfig()

  // Obtener información adicional del contexto
  const hasFile = !!state.context.fileManager?.getSnapshot().context.file
  const hasConfig = !!state.context.configManager?.getSnapshot().context
  const progress = state.context.progress || 0

  return (
    <Card
      className={`w-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          {/* Estado principal */}
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}
            >
              {statusConfig.icon}
            </div>
            <div>
              <div className={`font-medium ${statusConfig.textColor}`}>
                {statusConfig.title}
              </div>
              <div className={`text-sm ${statusConfig.textColor} opacity-80`}>
                {statusConfig.description}
              </div>
            </div>
          </div>

          {/* Badge de estado */}
          <Badge
            variant={statusConfig.color === 'red' ? 'destructive' : 'secondary'}
            className={`${
              statusConfig.color === 'green'
                ? 'bg-green-100 text-green-800 border-green-200'
                : statusConfig.color === 'red'
                ? 'bg-red-100 text-red-800 border-red-200'
                : statusConfig.color === 'purple'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : statusConfig.color === 'blue'
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-gray-100 text-gray-800 border-gray-200'
            }`}
          >
            {currentState.toUpperCase()}
          </Badge>
        </div>

        {/* Información adicional */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Estado del archivo */}
            <div className="flex items-center space-x-2">
              <FileText
                className={`h-3 w-3 ${
                  hasFile ? 'text-green-600' : 'text-gray-400'
                }`}
              />
              <span className={hasFile ? 'text-green-600' : 'text-gray-500'}>
                {hasFile ? 'Archivo cargado' : 'Sin archivo'}
              </span>
            </div>

            {/* Estado de configuración */}
            <div className="flex items-center space-x-2">
              <Settings
                className={`h-3 w-3 ${
                  hasConfig ? 'text-green-600' : 'text-gray-400'
                }`}
              />
              <span className={hasConfig ? 'text-green-600' : 'text-gray-500'}>
                {hasConfig ? 'Configurado' : 'Sin configurar'}
              </span>
            </div>
          </div>

          {/* Progreso durante procesamiento */}
          {currentState === 'processing' && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Progreso:</span>
                <span className="font-medium text-blue-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Información de error */}
          {currentState === 'error' && error && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <div className="text-xs text-red-600">
                <span className="font-medium">Error:</span> {error}
              </div>
            </div>
          )}

          {/* Acciones disponibles */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {currentState === 'idle' && 'Sube un archivo PDF para comenzar'}
              {currentState === 'uploading' &&
                'Espera mientras se carga el archivo'}
              {currentState === 'configuring' &&
                'Ajusta la configuración de foliado'}
              {currentState === 'ready' &&
                'Haz clic en "Procesar" para continuar'}
              {currentState === 'processing' &&
                'El procesamiento está en curso'}
              {currentState === 'completed' &&
                'El PDF está listo para descargar'}
              {currentState === 'error' &&
                'Revisa el error y intenta nuevamente'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente compacto para espacios reducidos
export function CompactStatusIndicator() {
  const [state] = useFoliadorStore()
  const currentState = state.value
  const error = state.context.error

  const getCompactConfig = () => {
    switch (currentState) {
      case 'idle':
        return {
          icon: <FileText className="h-3 w-3" />,
          color: 'text-gray-500',
        }
      case 'uploading':
        return {
          icon: <Upload className="h-3 w-3 animate-pulse" />,
          color: 'text-blue-500',
        }
      case 'configuring':
        return {
          icon: <Settings className="h-3 w-3" />,
          color: 'text-purple-500',
        }
      case 'ready':
        return { icon: <Play className="h-3 w-3" />, color: 'text-green-500' }
      case 'processing':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          color: 'text-blue-500',
        }
      case 'completed':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          color: 'text-green-500',
        }
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          color: 'text-red-500',
        }
      default:
        return { icon: <Clock className="h-3 w-3" />, color: 'text-gray-500' }
    }
  }

  const config = getCompactConfig()

  return (
    <div className={`flex items-center space-x-2 text-xs ${config.color}`}>
      {config.icon}
      <span className="font-medium capitalize">{currentState}</span>
      {error && <span className="text-red-500">•</span>}
    </div>
  )
}
