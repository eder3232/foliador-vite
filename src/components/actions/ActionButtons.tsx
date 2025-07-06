import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Play,
  Download,
  X,
  FilePlus,
  RotateCcw,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export function ActionButtons() {
  const [state, send] = useFoliadorStore()

  // Obtener estado actual de la máquina
  const currentState = state.value
  const isProcessing = currentState === 'processing'
  const isCompleted = currentState === 'completed'
  const isError = currentState === 'error'
  const isReady = currentState === 'ready'
  const isIdle = currentState === 'idle'

  // Verificar si hay archivo cargado
  const hasFile = !!state.context.fileManager?.getSnapshot().context.file

  // Verificar si hay configuración válida
  const hasConfig = !!state.context.configManager?.getSnapshot().context

  // Función para manejar procesamiento
  const handleProcess = () => {
    send({ type: 'START_PROCESSING' })
  }

  // Función para manejar descarga
  const handleDownload = () => {
    send({ type: 'DOWNLOAD_PDF' })
  }

  // Función para manejar cancelación
  const handleCancel = () => {
    send({ type: 'CANCEL_PROCESSING' })
  }

  // Función para manejar nuevo archivo
  const handleNewFile = () => {
    send({ type: 'RESTART_AFTER_COMPLETE' })
  }

  // Función para manejar reintento
  const handleRetry = () => {
    send({ type: 'CLEAR_ERROR' })
  }

  // Función para manejar limpiar error
  const handleClearError = () => {
    send({ type: 'CLEAR_ERROR' })
  }

  // Determinar si el botón procesar debe estar habilitado
  const canProcess = hasFile && hasConfig && isReady

  // Determinar si el botón descargar debe estar habilitado
  const canDownload = isCompleted

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-center space-x-3">
          {/* Botón Procesar */}
          {isReady && (
            <Button
              onClick={handleProcess}
              disabled={!canProcess}
              className="flex items-center space-x-2"
              size="lg"
            >
              <Play className="h-4 w-4" />
              <span>Procesar PDF</span>
            </Button>
          )}

          {/* Botón Descargar */}
          {isCompleted && (
            <Button
              onClick={handleDownload}
              disabled={!canDownload}
              variant="default"
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Download className="h-4 w-4" />
              <span>Descargar PDF</span>
            </Button>
          )}

          {/* Botón Cancelar */}
          {isProcessing && (
            <Button
              onClick={handleCancel}
              variant="destructive"
              className="flex items-center space-x-2"
              size="lg"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </Button>
          )}

          {/* Botón Nuevo Archivo */}
          {isCompleted && (
            <Button
              onClick={handleNewFile}
              variant="outline"
              className="flex items-center space-x-2"
              size="lg"
            >
              <FilePlus className="h-4 w-4" />
              <span>Nuevo Archivo</span>
            </Button>
          )}

          {/* Botón Reintentar */}
          {isError && (
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex items-center space-x-2"
              size="lg"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reintentar</span>
            </Button>
          )}

          {/* Botón Limpiar Error */}
          {isError && (
            <Button
              onClick={handleClearError}
              variant="ghost"
              className="flex items-center space-x-2"
              size="lg"
            >
              <X className="h-4 w-4" />
              <span>Limpiar Error</span>
            </Button>
          )}

          {/* Estado de carga durante procesamiento */}
          {isProcessing && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Procesando...</span>
            </div>
          )}

          {/* Estado completado */}
          {isCompleted && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">¡Completado!</span>
            </div>
          )}

          {/* Estado de error */}
          {isError && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Error en el procesamiento
              </span>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-4 text-center">
          {!hasFile && isIdle && (
            <p className="text-sm text-gray-500">
              Sube un archivo PDF para comenzar
            </p>
          )}

          {hasFile && !hasConfig && (
            <p className="text-sm text-gray-500">
              Configura las opciones de foliado para continuar
            </p>
          )}

          {canProcess && (
            <p className="text-sm text-green-600">
              ✓ Archivo cargado y configuración lista
            </p>
          )}

          {isProcessing && (
            <p className="text-sm text-blue-600">
              Procesando el PDF con la configuración actual...
            </p>
          )}

          {isCompleted && (
            <p className="text-sm text-green-600">
              El PDF ha sido procesado exitosamente
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-600">
              Ocurrió un error durante el procesamiento
            </p>
          )}
        </div>

        {/* Botones secundarios */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          {/* Botón de configuración rápida */}
          {hasFile && !hasConfig && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => {
                // Aquí se podría abrir un modal de configuración rápida
                console.log('Abrir configuración rápida')
              }}
            >
              Configuración Rápida
            </Button>
          )}

          {/* Botón de vista previa */}
          {hasFile && hasConfig && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => {
                // Aquí se podría abrir una vista previa del resultado
                console.log('Abrir vista previa')
              }}
            >
              Vista Previa
            </Button>
          )}

          {/* Botón de ayuda */}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => {
              // Aquí se podría abrir un modal de ayuda
              console.log('Abrir ayuda')
            }}
          >
            Ayuda
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
