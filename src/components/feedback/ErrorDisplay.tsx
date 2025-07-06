import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertCircle,
  FileX,
  Settings,
  RotateCcw,
  X,
  Info,
  Download,
  Upload,
} from 'lucide-react'

export function ErrorDisplay() {
  const [state, send] = useFoliadorStore()

  // Obtener error del contexto
  const error = state.context.error
  const currentState = state.value

  // Si no hay error, no mostrar nada
  if (!error) {
    return null
  }

  // Categorizar el tipo de error
  const categorizeError = (errorMessage: string) => {
    const message = errorMessage.toLowerCase()

    if (
      message.includes('archivo') ||
      message.includes('file') ||
      message.includes('pdf')
    ) {
      return {
        type: 'file',
        title: 'Error de Archivo',
        description: 'Problema con el archivo PDF',
        icon: <FileX className="h-5 w-5" />,
        color: 'red',
        suggestions: [
          'Verifica que el archivo sea un PDF válido',
          'Asegúrate de que el archivo no esté corrupto',
          'Intenta con un archivo más pequeño',
        ],
      }
    }

    if (
      message.includes('configuración') ||
      message.includes('config') ||
      message.includes('settings')
    ) {
      return {
        type: 'config',
        title: 'Error de Configuración',
        description: 'Problema con la configuración de foliado',
        icon: <Settings className="h-5 w-5" />,
        color: 'orange',
        suggestions: [
          'Revisa la configuración de posición',
          'Verifica los valores de numeración',
          'Ajusta la configuración de apariencia',
        ],
      }
    }

    if (
      message.includes('procesamiento') ||
      message.includes('process') ||
      message.includes('processing')
    ) {
      return {
        type: 'processing',
        title: 'Error de Procesamiento',
        description: 'Error durante el procesamiento del PDF',
        icon: <Download className="h-5 w-5" />,
        color: 'purple',
        suggestions: [
          'El archivo puede ser muy grande',
          'Verifica que el PDF no esté protegido',
          'Intenta con una configuración más simple',
        ],
      }
    }

    if (
      message.includes('red') ||
      message.includes('network') ||
      message.includes('conexión')
    ) {
      return {
        type: 'network',
        title: 'Error de Conexión',
        description: 'Problema de conectividad',
        icon: <Upload className="h-5 w-5" />,
        color: 'blue',
        suggestions: [
          'Verifica tu conexión a internet',
          'Intenta nuevamente en unos momentos',
          'Contacta soporte si el problema persiste',
        ],
      }
    }

    // Error genérico
    return {
      type: 'general',
      title: 'Error General',
      description: 'Ocurrió un error inesperado',
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'gray',
      suggestions: [
        'Intenta recargar la página',
        'Verifica que todos los campos estén completos',
        'Contacta soporte técnico',
      ],
    }
  }

  const errorInfo = categorizeError(error)

  // Función para manejar reintento
  const handleRetry = () => {
    send({ type: 'CLEAR_ERROR' })
  }

  // Función para manejar limpiar error
  const handleClearError = () => {
    send({ type: 'CLEAR_ERROR' })
  }

  // Función para manejar reinicio completo
  const handleReset = () => {
    send({ type: 'RESET' })
  }

  return (
    <Card className="w-full border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {errorInfo.icon}
            <span className="text-red-800">{errorInfo.title}</span>
          </div>
          <Badge
            variant="destructive"
            className="text-xs bg-red-100 text-red-800 border-red-200"
          >
            {errorInfo.type.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mensaje de error principal */}
        <Alert variant="destructive" className="border-red-300 bg-red-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>

        {/* Descripción del tipo de error */}
        <div className="text-sm text-red-700 bg-red-100 p-3 rounded-lg">
          <div className="font-medium mb-1">{errorInfo.description}</div>
          <div className="text-xs text-red-600">
            Este error puede ser causado por varios factores. Revisa las
            sugerencias a continuación.
          </div>
        </div>

        {/* Sugerencias de solución */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-red-800 flex items-center space-x-1">
            <Info className="h-4 w-4" />
            <span>Sugerencias para resolver:</span>
          </div>
          <ul className="space-y-1">
            {errorInfo.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm text-red-700 flex items-start space-x-2"
              >
                <span className="text-red-500 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          {/* Botón Reintentar */}
          <Button
            onClick={handleRetry}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 border-red-300 text-red-700 hover:bg-red-100"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reintentar</span>
          </Button>

          {/* Botón Limpiar Error */}
          <Button
            onClick={handleClearError}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-red-600 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
            <span>Limpiar Error</span>
          </Button>

          {/* Botón Reiniciar (solo para errores graves) */}
          {errorInfo.type === 'general' && (
            <Button
              onClick={handleReset}
              variant="destructive"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reiniciar Todo</span>
            </Button>
          )}
        </div>

        {/* Información adicional según el tipo de error */}
        {errorInfo.type === 'file' && (
          <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
            <div className="font-medium">Información del archivo:</div>
            <div>• Tamaño máximo recomendado: 50MB</div>
            <div>• Formatos soportados: PDF</div>
            <div>• El archivo no debe estar protegido con contraseña</div>
          </div>
        )}

        {errorInfo.type === 'config' && (
          <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
            <div className="font-medium">Configuración recomendada:</div>
            <div>• Posición: Valores entre -10 y 10 cm</div>
            <div>• Tamaño de fuente: Entre 8 y 72 puntos</div>
            <div>• Número inicial: Entre 1 y 9999</div>
          </div>
        )}

        {errorInfo.type === 'processing' && (
          <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
            <div className="font-medium">Optimización de procesamiento:</div>
            <div>• Reduce el tamaño del archivo si es posible</div>
            <div>• Simplifica la configuración de numeración</div>
            <div>• Cierra otras aplicaciones para liberar memoria</div>
          </div>
        )}

        {/* Estado actual */}
        <div className="text-xs text-red-600 text-center">
          Estado actual: <span className="font-medium">{currentState}</span>
        </div>
      </CardContent>
    </Card>
  )
}
