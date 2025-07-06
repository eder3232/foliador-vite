import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  FileText,
  Settings,
  Download,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export function ProgressIndicator() {
  const [state] = useFoliadorStore()

  // Obtener estado actual y progreso
  const currentState = state.value
  const progress = state.context.progress || 0
  const error = state.context.error

  // Determinar el paso actual y su descripción
  const getCurrentStep = () => {
    if (currentState === 'uploading') {
      return {
        step: 1,
        totalSteps: 4,
        title: 'Subiendo archivo',
        description: 'Cargando el archivo PDF al sistema...',
        icon: <FileText className="h-4 w-4" />,
        color: 'blue',
      }
    }

    if (currentState === 'configuring') {
      return {
        step: 2,
        totalSteps: 4,
        title: 'Configurando foliado',
        description: 'Aplicando configuración de numeración...',
        icon: <Settings className="h-4 w-4" />,
        color: 'purple',
      }
    }

    if (currentState === 'processing') {
      return {
        step: 3,
        totalSteps: 4,
        title: 'Procesando PDF',
        description: 'Aplicando folios al documento...',
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        color: 'blue',
      }
    }

    if (currentState === 'completed') {
      return {
        step: 4,
        totalSteps: 4,
        title: 'Completado',
        description: 'El PDF ha sido procesado exitosamente',
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'green',
      }
    }

    if (currentState === 'error') {
      return {
        step: 0,
        totalSteps: 4,
        title: 'Error',
        description: error || 'Ocurrió un error durante el procesamiento',
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'red',
      }
    }

    return {
      step: 0,
      totalSteps: 4,
      title: 'Listo',
      description: 'Preparado para procesar',
      icon: <FileText className="h-4 w-4" />,
      color: 'gray',
    }
  }

  const currentStep = getCurrentStep()
  const progressPercentage =
    currentStep.step > 0 ? (currentStep.step / currentStep.totalSteps) * 100 : 0

  // Solo mostrar si hay actividad o está en un estado de procesamiento
  const shouldShow = [
    'uploading',
    'configuring',
    'processing',
    'completed',
    'error',
  ].includes(currentState as string)

  if (!shouldShow) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {currentStep.icon}
            <span>Progreso del Procesamiento</span>
          </div>
          <Badge
            variant={currentStep.color === 'red' ? 'destructive' : 'default'}
            className={`text-xs ${
              currentStep.color === 'green'
                ? 'bg-green-100 text-green-800'
                : currentStep.color === 'red'
                ? 'bg-red-100 text-red-800'
                : currentStep.color === 'purple'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {currentStep.step}/{currentStep.totalSteps}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de progreso principal */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium">{currentStep.title}</span>
            <span className="text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className={`h-2 ${
              currentStep.color === 'green'
                ? 'bg-green-100'
                : currentStep.color === 'red'
                ? 'bg-red-100'
                : currentStep.color === 'purple'
                ? 'bg-purple-100'
                : 'bg-blue-100'
            }`}
          />
        </div>

        {/* Descripción del paso actual */}
        <div className="text-sm text-gray-600">{currentStep.description}</div>

        {/* Progreso detallado durante procesamiento */}
        {currentState === 'processing' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span>Progreso interno:</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1 bg-gray-100" />
          </div>
        )}

        {/* Pasos del proceso */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div
            className={`text-center p-2 rounded ${
              currentStep.step >= 1
                ? 'bg-blue-50 text-blue-700'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            <FileText className="h-3 w-3 mx-auto mb-1" />
            <div>Subir</div>
          </div>
          <div
            className={`text-center p-2 rounded ${
              currentStep.step >= 2
                ? 'bg-purple-50 text-purple-700'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            <Settings className="h-3 w-3 mx-auto mb-1" />
            <div>Configurar</div>
          </div>
          <div
            className={`text-center p-2 rounded ${
              currentStep.step >= 3
                ? 'bg-blue-50 text-blue-700'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            <Loader2 className="h-3 w-3 mx-auto mb-1" />
            <div>Procesar</div>
          </div>
          <div
            className={`text-center p-2 rounded ${
              currentStep.step >= 4
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            <Download className="h-3 w-3 mx-auto mb-1" />
            <div>Completar</div>
          </div>
        </div>

        {/* Información adicional según el estado */}
        {currentState === 'processing' && (
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
            <div className="font-medium">Procesando página por página...</div>
            <div>
              Esto puede tomar unos momentos dependiendo del tamaño del archivo.
            </div>
          </div>
        )}

        {currentState === 'completed' && (
          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
            <div className="font-medium">¡Procesamiento completado!</div>
            <div>El PDF está listo para descargar.</div>
          </div>
        )}

        {currentState === 'error' && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            <div className="font-medium">Error en el procesamiento</div>
            <div>
              {error || 'Ocurrió un error inesperado. Intenta nuevamente.'}
            </div>
          </div>
        )}

        {/* Tiempo estimado (simulado) */}
        {currentState === 'processing' && (
          <div className="text-xs text-gray-500 text-center">
            Tiempo estimado:{' '}
            {progress < 30
              ? '2-3 minutos'
              : progress < 70
              ? '1-2 minutos'
              : 'Menos de 1 minuto'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
