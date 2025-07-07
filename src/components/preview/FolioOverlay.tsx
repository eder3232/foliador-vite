import { useFoliadorStore } from '@/store/useFoliadorStore'
import { initialSeparation } from '@/utils/initialSeparation'
import numerosEnLetras from '@/utils/numerosEnLetras'
import { transparencyToOpacity } from '@/utils/transparencyUtils'

interface FolioOverlayProps {
  currentPage: number
  totalPages: number
  scale: number
  pageWidth: number
  pageHeight: number
}

export function FolioOverlay({
  currentPage,
  totalPages,
  scale,
  pageWidth,
  pageHeight,
}: FolioOverlayProps) {
  const [state] = useFoliadorStore()

  // Obtener configuración actual
  const config = state.context.configManager?.getSnapshot().context

  // Si no hay configuración, no mostrar nada
  if (!config) {
    return null
  }

  // Función para obtener número en letras
  const getNumberInLetters = (num: number): string => {
    if (num > 600) return num.toString()
    return (
      numerosEnLetras[num as keyof typeof numerosEnLetras] || num.toString()
    )
  }

  // Función para generar el texto del folio
  const generateFolioText = (pageNumber: number) => {
    const startNumber = config?.startNumber || 1
    const numberingType = config?.numberingType || 'numbers'
    const zeroPadding = config?.zeroPadding || 6
    const direction = config?.direction || 'first'

    // Calcular número de folio según dirección
    let folioNumber = startNumber
    if (direction === 'first') {
      // Numeración ascendente: página 1 = startNumber, página 2 = startNumber + 1, etc.
      folioNumber = startNumber + pageNumber - 1
    } else {
      // Numeración descendente: última página = startNumber, penúltima = startNumber + 1, etc.
      folioNumber = startNumber + (totalPages - pageNumber)
    }

    // Generar texto según tipo de numeración
    if (numberingType === 'numbers') {
      return folioNumber.toString().padStart(zeroPadding, '0')
    } else if (numberingType === 'letters') {
      return getNumberInLetters(folioNumber)
    } else if (numberingType === 'mixed') {
      // En modo mixto, retornar objeto con número y letra
      const numero = folioNumber.toString().padStart(zeroPadding, '0')
      const letra = getNumberInLetters(folioNumber)
      return { numero, letra }
    }

    return folioNumber.toString()
  }

  // Función para calcular la posición del folio
  const calculateFolioPosition = () => {
    const cornerVertical = config?.cornerVertical || 'top'
    const cornerHorizontal = config?.cornerHorizontal || 'right'
    const positionX = config?.positionX || 0
    const positionY = config?.positionY || 0
    const rotation = config?.rotation || 0

    // Convertir separación inicial de cm a píxeles (aproximadamente 37.8 píxeles por cm)
    const SEPARATION_X_PX = initialSeparation.x * 37.8
    const SEPARATION_Y_PX = initialSeparation.y * 37.8

    // Calcular posición base según la esquina
    let baseX = 0
    let baseY = 0

    if (cornerVertical === 'top') {
      baseY = SEPARATION_Y_PX
    } else {
      baseY = pageHeight - SEPARATION_Y_PX
    }

    if (cornerHorizontal === 'left') {
      baseX = SEPARATION_X_PX
    } else {
      baseX = pageWidth - SEPARATION_X_PX
    }

    // Aplicar ajustes de posición (convertir de cm a píxeles)
    const adjustedX = baseX + positionX * 37.8
    const adjustedY = baseY + positionY * 37.8

    // Aplicar zoom
    const scaledX = adjustedX * scale
    const scaledY = adjustedY * scale

    return {
      left: `${scaledX}px`,
      top: `${scaledY}px`,
      transform: `rotate(${rotation}deg)`,
    }
  }

  // Obtener estilos del folio
  const folioStyles = {
    position: 'absolute' as const,
    ...calculateFolioPosition(),
    backgroundColor: config?.color || '#000000',
    opacity: transparencyToOpacity(config?.transparency || 0),
    fontSize: `${(config?.fontSize || 12) * scale}px`,
    color: '#ffffff',
    padding: `${4 * scale}px ${8 * scale}px`,
    borderRadius: `${2 * scale}px`,
    fontWeight: 'bold',
    zIndex: 1000,
    pointerEvents: 'none' as const,
    boxShadow: `0 ${2 * scale}px ${8 * scale}px rgba(0, 0, 0, 0.3)`,
    border: `${1 * scale}px solid rgba(255, 255, 255, 0.2)`,
    whiteSpace: 'nowrap' as const,
    lineHeight: '1.2',
  }

  // Generar texto del folio
  const folioText = generateFolioText(currentPage)

  // Renderizar según el tipo de numeración
  if (typeof folioText === 'object' && folioText.numero && folioText.letra) {
    // Modo mixto: número arriba, letra abajo
    return (
      <div
        style={folioStyles}
        className="transition-all duration-300 ease-in-out"
      >
        <div className="text-center">
          <div className="font-mono font-bold leading-none">
            {folioText.numero}
          </div>
          <div className="text-xs leading-none mt-1">{folioText.letra}</div>
        </div>
      </div>
    )
  } else {
    // Modo números o letras
    return (
      <div
        style={folioStyles}
        className="transition-all duration-300 ease-in-out"
      >
        {folioText as string}
      </div>
    )
  }
}
