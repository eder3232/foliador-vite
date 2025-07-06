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
