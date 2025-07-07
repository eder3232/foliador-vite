import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'
import numerosEnLetras from './numerosEnLetras'
import { initialSeparation } from './initialSeparation'
import { transparencyToOpacity } from './transparencyUtils'

interface ConfigManagerContext {
  // Posicionamiento
  cornerVertical: 'top' | 'bottom'
  cornerHorizontal: 'left' | 'right'
  positionX: number
  positionY: number
  rotation: number
  randomnessX: number
  randomnessY: number
  randomnessRotation: number
  // Apariencia
  color: string
  transparency: number
  fontSize: number
  // Numeración
  startNumber: number
  direction: 'first' | 'last'
  numberingType: 'numbers' | 'letters' | 'mixed'
  zeroPadding: number
}

/**
 * Firma un PDF agregando numeración en cada página según la configuración.
 * @param file Archivo PDF original (File o Uint8Array)
 * @param config Configuración completa del ConfigManager
 * @returns Uint8Array del PDF firmado
 */
export async function firmarPdf(
  file: File | Uint8Array,
  config: ConfigManagerContext
): Promise<Uint8Array> {
  // Leer el archivo como Uint8Array si es File
  let pdfBytes: Uint8Array
  if (file instanceof File) {
    pdfBytes = new Uint8Array(await file.arrayBuffer())
  } else {
    pdfBytes = file
  }

  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Convertir color hex a rgb
  const rgbColor = hexToRgb(config.color)

  // Calcular opacidad (0-1) desde transparencia (0-100)
  const opacity = transparencyToOpacity(config.transparency)

  // Generar números de folio según dirección
  const folioNumbers = generateFolioNumbers(
    config.startNumber,
    pages.length,
    config.numberingType,
    config.zeroPadding,
    config.direction
  )

  // Separaciones fijas en centímetros (convertir a puntos: 1cm = 28.35 puntos)
  const BASE_SEPARATION_X = initialSeparation.x * 28.35 // 3cm horizontal desde la esquina
  const BASE_SEPARATION_Y = initialSeparation.y * 28.35 // 2cm vertical desde la esquina

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const pageWidth = page.getWidth()
    const pageHeight = page.getHeight()

    // Calcular posición base según esquina con separación fija
    let baseX: number
    let baseY: number

    // Aplicar separación base según la esquina seleccionada
    if (config.cornerVertical === 'top') {
      baseY = pageHeight - BASE_SEPARATION_Y
    } else {
      baseY = BASE_SEPARATION_Y
    }

    if (config.cornerHorizontal === 'left') {
      baseX = BASE_SEPARATION_X
    } else {
      baseX = pageWidth - BASE_SEPARATION_X
    }

    // Aplicar ajustes adicionales de posición (en centímetros)
    const adjustmentX = config.positionX * 28.35 // Convertir cm a puntos
    const adjustmentY = config.positionY * 28.35 // Convertir cm a puntos

    // Aplicar aleatoriedad (en centímetros)
    const randomX = (Math.random() - 0.5) * config.randomnessX * 28.35 // Convertir cm a puntos
    const randomY = (Math.random() - 0.5) * config.randomnessY * 28.35 // Convertir cm a puntos
    const randomRotation = (Math.random() - 0.5) * config.randomnessRotation // Ya está en grados

    const finalX = baseX + adjustmentX + randomX
    const finalY = baseY + adjustmentY + randomY
    const finalRotation = config.rotation + randomRotation

    // Dibujar el número de folio
    if (config.numberingType === 'mixed') {
      // Para mixed: dibujar número arriba y letra abajo, ambos centrados
      const folioData = folioNumbers[i] as { numero: string; letra: string }
      const currentNumber = folioData.numero
      const currentLetter = folioData.letra

      // Número arriba
      page.drawText(currentNumber, {
        x: finalX,
        y: finalY + config.fontSize * 0.5, // Un poco arriba
        size: config.fontSize,
        font,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity: opacity,
        rotate: degrees(finalRotation),
      })

      // Letra abajo
      page.drawText(currentLetter, {
        x: finalX,
        y: finalY - config.fontSize * 0.5, // Un poco abajo
        size: config.fontSize,
        font,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity: opacity,
        rotate: degrees(finalRotation),
      })
    } else {
      // Para numbers y letters: dibujar solo un texto
      page.drawText(folioNumbers[i] as string, {
        x: finalX,
        y: finalY,
        size: config.fontSize,
        font,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity: opacity,
        rotate: degrees(finalRotation),
      })
    }
  }

  const signedPdfBytes = await pdfDoc.save()
  return signedPdfBytes
}

// Utilidad para convertir color hex a rgb (0-1)
function hexToRgb(hex: string) {
  const match = hex.replace('#', '').match(/.{1,2}/g)
  if (!match) return { r: 0, g: 0, b: 0 }
  const [r, g, b] = match.map((x) => parseInt(x, 16) / 255)
  return { r, g, b }
}

// Generar números de folio según el tipo y dirección
function generateFolioNumbers(
  startNumber: number,
  totalPages: number,
  numberingType: 'numbers' | 'letters' | 'mixed',
  zeroPadding: number,
  direction: 'first' | 'last'
): (string | { numero: string; letra: string })[] {
  const numbers: (string | { numero: string; letra: string })[] = []

  for (let i = 0; i < totalPages; i++) {
    // Calcular número de folio según dirección
    let folioNumber: number
    if (direction === 'first') {
      // Numeración ascendente: página 1 = startNumber, página 2 = startNumber + 1, etc.
      folioNumber = startNumber + i
    } else {
      // Numeración descendente: última página = startNumber, penúltima = startNumber + 1, etc.
      folioNumber = startNumber + (totalPages - 1 - i)
    }

    switch (numberingType) {
      case 'numbers':
        numbers.push(folioNumber.toString().padStart(zeroPadding, '0'))
        break
      case 'letters':
        numbers.push(numberToLetters(folioNumber))
        break
      case 'mixed':
        // En modo mixto, siempre mostrar número arriba y letra abajo
        const numero = folioNumber.toString().padStart(zeroPadding, '0')
        const letra = numberToLetters(folioNumber)
        numbers.push({ numero, letra })
        break
    }
  }

  return numbers
}

// Convertir número a letras usando el archivo numeros-en-letras
function numberToLetters(num: number): string {
  if (num in numerosEnLetras) {
    return numerosEnLetras[num as keyof typeof numerosEnLetras]
  }
  return '' // Retorna string vacío si el número no está en el rango (0-500)
}
