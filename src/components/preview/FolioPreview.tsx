import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  RotateCw,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useState } from 'react'
import numerosEnLetras from '@/utils/numerosEnLetras'
import { transparencyToOpacity } from '@/utils/transparencyUtils'

interface FolioPreviewProps {
  className?: string
}

export function FolioPreview({ className = '' }: FolioPreviewProps) {
  const [state] = useFoliadorStore()
  const [showPreview, setShowPreview] = useState(true)

  // Obtener configuración actual
  const config = state.context.configManager?.getSnapshot().context
  const pdfFile = state.context.fileManager?.getSnapshot().context.file

  // Si no hay archivo o configuración, no mostrar nada
  if (!pdfFile || !config) {
    return null
  }

  // Función para generar el texto del folio según la configuración
  const generateFolioText = (pageNumber: number) => {
    const startNumber = config?.startNumber || 1
    const numberingType = config?.numberingType || 'numbers'
    const zeroPadding = config?.zeroPadding || 6
    const direction = config?.direction || 'first'

    // Calcular número de página según dirección
    let folioNumber = startNumber
    if (direction === 'first') {
      folioNumber = startNumber + pageNumber - 1
    } else {
      // Para dirección 'last', necesitaríamos el total de páginas
      // Por ahora asumimos que es ascendente
      folioNumber = startNumber + pageNumber - 1
    }

    // Generar texto según tipo de numeración
    if (numberingType === 'numbers') {
      return folioNumber.toString().padStart(zeroPadding, '0')
    } else if (numberingType === 'letters') {
      // Usar el archivo numerosEnLetras.ts para conversión precisa
      if (folioNumber >= 0 && folioNumber <= 600) {
        return (
          numerosEnLetras[folioNumber as keyof typeof numerosEnLetras] ||
          folioNumber.toString()
        )
      }
      return folioNumber.toString()
    } else if (numberingType === 'mixed') {
      // Alternar entre números y letras
      if (pageNumber % 2 === 1) {
        return folioNumber.toString().padStart(zeroPadding, '0')
      } else {
        // Usar el archivo numerosEnLetras.ts para conversión precisa
        if (folioNumber >= 0 && folioNumber <= 600) {
          return (
            numerosEnLetras[folioNumber as keyof typeof numerosEnLetras] ||
            folioNumber.toString()
          )
        }
        return folioNumber.toString()
      }
    }

    return folioNumber.toString()
  }

  // Función para obtener la posición del folio
  const getFolioPosition = () => {
    const cornerVertical = config?.cornerVertical || 'top'
    const cornerHorizontal = config?.cornerHorizontal || 'left'
    const x = config?.positionX || 0
    const y = config?.positionY || 0
    const rotation = config?.rotation || 0

    // Construir esquina combinando vertical y horizontal
    const corner = `${cornerVertical}-${cornerHorizontal}` as
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'

    // Mapear esquinas a posiciones CSS
    const cornerPositions = {
      'top-left': { top: '1rem', left: '1rem' },
      'top-right': { top: '1rem', right: '1rem' },
      'bottom-left': { bottom: '1rem', left: '1rem' },
      'bottom-right': { bottom: '1rem', right: '1rem' },
    }

    const basePosition = cornerPositions[corner] || cornerPositions['top-left']

    return {
      ...basePosition,
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
    }
  }

  // Función para obtener el icono de la esquina
  const getCornerIcon = () => {
    const cornerVertical = config?.cornerVertical || 'top'
    const cornerHorizontal = config?.cornerHorizontal || 'left'
    const corner = `${cornerVertical}-${cornerHorizontal}` as
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'

    switch (corner) {
      case 'top-left':
        return <CornerUpLeft className="h-3 w-3" />
      case 'top-right':
        return <CornerUpRight className="h-3 w-3" />
      case 'bottom-left':
        return <CornerDownLeft className="h-3 w-3" />
      case 'bottom-right':
        return <CornerDownRight className="h-3 w-3" />
      default:
        return <CornerUpLeft className="h-3 w-3" />
    }
  }

  // Obtener estilos del folio
  const folioStyles = {
    position: 'absolute' as const,
    ...getFolioPosition(),
    backgroundColor: config?.color || '#000000',
    opacity: transparencyToOpacity(config?.transparency || 100), // Usar función de utilidad
    fontSize: `${config?.fontSize || 12}px`,
    color: '#ffffff', // Texto blanco para contraste con el fondo de color
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: 'bold',
    zIndex: 1000,
    pointerEvents: 'none' as const,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }

  // Obtener texto del folio para la página actual (ejemplo: página 1)
  const folioText = generateFolioText(1)

  return (
    <div className={`relative ${className}`}>
      {/* Controles de preview */}
      <Card className="absolute top-2 left-2 z-50 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-1 text-xs hover:bg-gray-100 p-1 rounded"
            >
              {showPreview ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              <span>Preview</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Vista previa del folio */}
      {showPreview && (
        <div
          style={folioStyles}
          className="transition-all duration-300 ease-in-out"
        >
          <div className="flex items-center space-x-1">
            {getCornerIcon()}
            <span>{folioText}</span>
            {config?.rotation !== 0 && <RotateCw className="h-3 w-3" />}
          </div>
        </div>
      )}

      {/* Información de configuración */}
      <Card className="absolute bottom-2 right-2 z-50 bg-white/90 backdrop-blur-sm max-w-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium">
            Configuración Actual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Esquina:</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {`${config?.cornerVertical || 'top'}-${
                  config?.cornerHorizontal || 'left'
                }`}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Color:</span>
              <div
                className="inline-block w-4 h-4 ml-1 rounded border"
                style={{
                  backgroundColor: config?.color || '#000000',
                }}
              />
            </div>
            <div>
              <span className="font-medium">Tipo:</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {config?.numberingType || 'numbers'}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Inicio:</span>
              <span className="ml-1">{config?.startNumber || 1}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <div>
              Posición: X: {config?.positionX || 0}px, Y:{' '}
              {config?.positionY || 0}px
            </div>
            <div>Rotación: {config?.rotation || 0}°</div>
            <div>Transparencia: {config?.transparency || 100}%</div>
            <div>Tamaño: {config?.fontSize || 12}px</div>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores de posición */}
      {showPreview && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Líneas guía */}
          <div className="absolute top-0 left-0 w-full h-px bg-blue-400/30" />
          <div className="absolute top-0 left-0 w-px h-full bg-blue-400/30" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-blue-400/30" />
          <div className="absolute top-0 right-0 w-px h-full bg-blue-400/30" />

          {/* Marcadores de esquinas */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      )}
    </div>
  )
}
