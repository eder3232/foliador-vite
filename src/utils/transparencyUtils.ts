/**
 * Utilidades para manejar la conversión entre transparencia y opacidad
 *
 * Transparencia: 0 = transparente, 100 = opaco
 * Opacidad: 0 = transparente, 1 = opaco
 */

/**
 * Convierte un valor de transparencia (0-100) a opacidad (0-1)
 * @param transparency Valor de transparencia de 0 a 100
 * @returns Valor de opacidad de 0 a 1
 */
export function transparencyToOpacity(transparency: number): number {
  // Validar que el valor esté en el rango correcto
  const clampedTransparency = Math.max(0, Math.min(100, transparency || 100))

  // Convertir: transparencia 0 = opacidad 0, transparencia 100 = opacidad 1
  // Ambos valores representan lo mismo: 0 = transparente, 100/1 = opaco
  const opacity = clampedTransparency / 100

  // Asegurar que el resultado esté en el rango 0-1
  return Math.max(0, Math.min(1, opacity))
}

/**
 * Convierte un valor de opacidad (0-1) a transparencia (0-100)
 * @param opacity Valor de opacidad de 0 a 1
 * @returns Valor de transparencia de 0 a 100
 */
export function opacityToTransparency(opacity: number): number {
  // Validar que el valor esté en el rango correcto
  const clampedOpacity = Math.max(0, Math.min(1, opacity || 1))

  // Convertir: opacidad 0 = transparencia 0, opacidad 1 = transparencia 100
  // Ambos valores representan lo mismo: 0 = transparente, 1/100 = opaco
  const transparency = clampedOpacity * 100

  // Asegurar que el resultado esté en el rango 0-100
  return Math.max(0, Math.min(100, transparency))
}

/**
 * Valida y normaliza un valor de transparencia
 * @param transparency Valor de transparencia a validar
 * @param defaultValue Valor por defecto si el input es inválido
 * @returns Valor de transparencia normalizado (0-100)
 */
export function normalizeTransparency(
  transparency: number,
  defaultValue: number = 100
): number {
  if (typeof transparency !== 'number' || isNaN(transparency)) {
    return defaultValue
  }
  return Math.max(0, Math.min(100, transparency))
}

/**
 * Función de prueba para verificar la conversión
 * Solo para desarrollo/debug
 */
export function testTransparencyConversion() {
  console.log('=== Prueba de Conversión Transparencia ↔ Opacidad ===')

  const testCases = [0, 25, 50, 75, 100]

  testCases.forEach((transparency) => {
    const opacity = transparencyToOpacity(transparency)
    const backToTransparency = opacityToTransparency(opacity)

    console.log(
      `Transparencia: ${transparency} → Opacidad: ${opacity} → Transparencia: ${backToTransparency}`
    )

    if (transparency !== backToTransparency) {
      console.error(`❌ Error: ${transparency} !== ${backToTransparency}`)
    } else {
      console.log(`✅ Correcto`)
    }
  })

  console.log('=== Fin de Prueba ===')
}

// Constantes para conversión de unidades (consistentes entre preview y PDF)
export const UNITS = {
  // 1 cm = 28.35 puntos (estándar PDF)
  CM_TO_POINTS: 28.35,
  // Para pantalla: 1 punto = 1.33 píxeles (asumiendo 96 DPI)
  POINTS_TO_PIXELS: 1.33,
  // Factor directo de cm a píxeles para pantalla
  CM_TO_PIXELS: 28.35 * 1.33,
}

/**
 * Convierte centímetros a píxeles para la previsualización
 */
export function cmToPixels(cm: number): number {
  return cm * UNITS.CM_TO_PIXELS
}

/**
 * Convierte centímetros a puntos para el PDF
 */
export function cmToPoints(cm: number): number {
  return cm * UNITS.CM_TO_POINTS
}

/**
 * Calcula la posición base según la esquina seleccionada
 * (lógica para PDF - sistema de coordenadas bottom-left)
 */
export function calculateBasePosition(
  cornerVertical: 'top' | 'bottom',
  cornerHorizontal: 'left' | 'right',
  pageWidth: number,
  pageHeight: number,
  separationX: number,
  separationY: number
) {
  let baseX: number
  let baseY: number

  // Posición vertical (lógica para PDF - bottom-left)
  if (cornerVertical === 'top') {
    baseY = pageHeight - separationY
  } else {
    baseY = separationY
  }

  // Posición horizontal
  if (cornerHorizontal === 'left') {
    baseX = separationX
  } else {
    baseX = pageWidth - separationX
  }

  return { baseX, baseY }
}

/**
 * Calcula la posición base según la esquina seleccionada
 * (lógica para CSS overlay - sistema de coordenadas top-left)
 */
export function calculateBasePositionCSS(
  cornerVertical: 'top' | 'bottom',
  cornerHorizontal: 'left' | 'right',
  pageWidth: number,
  pageHeight: number,
  separationX: number,
  separationY: number
) {
  let baseX: number
  let baseY: number

  // Posición vertical (lógica para CSS - top-left)
  if (cornerVertical === 'top') {
    baseY = separationY
  } else {
    baseY = pageHeight - separationY
  }

  // Posición horizontal (igual que PDF)
  if (cornerHorizontal === 'left') {
    baseX = separationX
  } else {
    baseX = pageWidth - separationX
  }

  return { baseX, baseY }
}
