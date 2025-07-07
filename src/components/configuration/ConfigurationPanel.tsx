import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { PositionConfig } from './PositionConfig'
import { AppearanceConfig } from './AppearanceConfig'
import { NumberingConfig } from './NumberingConfig'
import { Button } from '@/components/ui/button'

export function ConfigurationPanel() {
  const [state, send] = useFoliadorStore()

  // Determinar el estado actual
  const isConfiguring = state.matches('configuring')
  const isReady = state.matches('ready')
  const isProcessing = state.matches('processing')
  const isCompleted = state.matches('completed')

  // Obtener información del archivo
  const file = state.context.fileManager?.getSnapshot().context.file
  const progress = state.context.progress

  // Función para obtener el estado y color del StatusIndicator
  const getStatusInfo = () => {
    if (isConfiguring) {
      return {
        icon: Settings,
        text: 'Configurando',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      }
    }
    if (isReady) {
      return {
        icon: CheckCircle,
        text: 'Listo para procesar',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      }
    }
    if (isProcessing) {
      return {
        icon: Clock,
        text: 'Procesando',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      }
    }
    if (isCompleted) {
      return {
        icon: CheckCircle,
        text: 'Completado',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      }
    }
    return {
      icon: AlertCircle,
      text: 'Error',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header de configuración */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configuración del Foliado
        </h3>

        {/* StatusIndicator */}
        <div
          className={`p-3 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
        >
          <div className="flex items-center">
            <StatusIcon className={`h-5 w-5 mr-2 ${statusInfo.color}`} />
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Botón para editar configuración cuando está completado */}
        {isCompleted && (
          <div className="mt-3">
            <Button
              onClick={() => send({ type: 'EDIT_CONFIG' })}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Editar Configuración
            </Button>
          </div>
        )}
      </div>

      {/* Información del archivo */}
      {file && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">Archivo cargado</h4>
          <p className="text-sm text-blue-700 truncate">{file.name}</p>
          <p className="text-xs text-blue-600">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {/* Progress indicator durante procesamiento */}
      {isProcessing && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Procesando PDF</h4>
          <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
            <div
              className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-yellow-700">{progress}% completado</p>
        </div>
      )}

      {/* Contenedor scrolleable para configuraciones */}
      <div className="space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
        {/* PositionConfig component */}
        <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Posición del Folio
          </h4>
          <PositionConfig />
        </div>

        {/* AppearanceConfig component */}
        <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Apariencia
          </h4>
          <AppearanceConfig />
        </div>

        {/* NumberingConfig component */}
        <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Numeración
          </h4>
          <div className="text-sm text-gray-500 mb-3">
            Define cómo se numerarán las páginas
          </div>
          <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
            <NumberingConfig />
          </div>
        </div>

        {/* ActionButtons component */}

        {/* <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-sm transition-shadow">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Acciones
          </h4>
          <div className="space-y-2">
            <div className="bg-white rounded p-3 text-xs text-gray-600">
              <p>• Procesar PDF</p>
              <p>• Descargar resultado</p>
              <p>• Cancelar procesamiento</p>
              <p>• Nuevo archivo</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Información adicional */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            💡 <strong>Consejo:</strong> Los cambios se reflejan en tiempo real
            en la vista previa
          </p>
          <p>
            ⚡ <strong>Procesamiento:</strong> El PDF se procesa página por
            página
          </p>
          <p>
            📱 <strong>Responsive:</strong> El folio se adapta al tamaño del PDF
          </p>
        </div>
      </div>
    </div>
  )
}
