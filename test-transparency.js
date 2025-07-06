// Función de conversión corregida
function transparencyToOpacity(transparency) {
  const clampedTransparency = Math.max(0, Math.min(100, transparency || 100))
  const opacity = clampedTransparency / 100
  return Math.max(0, Math.min(1, opacity))
}

function opacityToTransparency(opacity) {
  const clampedOpacity = Math.max(0, Math.min(1, opacity || 1))
  const transparency = clampedOpacity * 100
  return Math.max(0, Math.min(100, transparency))
}

// Prueba de la conversión
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
