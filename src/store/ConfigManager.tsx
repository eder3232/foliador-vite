import { assign, setup } from 'xstate'

// Tipos de configuración
type PositionConfig = {
  cornerVertical: 'top' | 'bottom'
  cornerHorizontal: 'left' | 'right'
  positionX: number
  positionY: number
  rotation: number
  randomnessX: number
  randomnessY: number
  randomnessRotation: number
}

type AppearanceConfig = {
  color: string
  transparency: number
  fontSize: number
}

type NumberingConfig = {
  startNumber: number
  direction: 'first' | 'last'
  numberingType: 'numbers' | 'letters' | 'mixed'
  zeroPadding: number
}

// Interfaces para el contexto
interface PositionContext {
  // Posicionamiento
  cornerVertical: 'top' | 'bottom'
  cornerHorizontal: 'left' | 'right'
  // Posición base: separación fija de 3cm vertical y 4cm horizontal desde la esquina
  // Estos valores son ajustes adicionales en centímetros desde ese punto base
  positionX: number // Ajuste horizontal en centímetros desde la posición base
  positionY: number // Ajuste vertical en centímetros desde la posición base
  rotation: number // Rotación en grados sexagesimales
  // Aleatoriedad máxima permitida en centímetros/grados
  randomnessX: number // Máximo desplazamiento horizontal aleatorio en centímetros
  randomnessY: number // Máximo desplazamiento vertical aleatorio en centímetros
  randomnessRotation: number // Máxima rotación aleatoria en grados sexagesimales
}

interface AppearanceContext {
  // Apariencia
  color: string
  transparency: number
  fontSize: number
}

interface NumberingContext {
  // Numeración
  startNumber: number
  direction: 'first' | 'last'
  numberingType: 'numbers' | 'letters' | 'mixed'
  zeroPadding: number
}

// Unión de interfaces para el contexto completo
export type ConfigManagerContext = PositionContext &
  AppearanceContext &
  NumberingContext

// Tipo para los eventos de configuración
type ConfigEvents =
  | { type: 'UPDATE_POSITION'; config: Partial<PositionConfig> }
  | { type: 'UPDATE_APPEARANCE'; config: Partial<AppearanceConfig> }
  | { type: 'UPDATE_NUMBERING'; config: Partial<NumberingConfig> }
  | { type: 'RESET_CONFIG' }

export const configManagerMachine = setup({
  types: {
    context: {} as ConfigManagerContext,
    events: {} as ConfigEvents,
  },
  actions: {
    updatePosition: assign({
      cornerVertical: ({ event, context }) => {
        if (
          event.type === 'UPDATE_POSITION' &&
          event.config.cornerVertical !== undefined
        ) {
          return event.config.cornerVertical
        }
        return context.cornerVertical
      },
      cornerHorizontal: ({ event, context }) => {
        if (
          event.type === 'UPDATE_POSITION' &&
          event.config.cornerHorizontal !== undefined
        ) {
          return event.config.cornerHorizontal
        }
        return context.cornerHorizontal
      },
      positionX: ({ event, context }) => {
        if (
          event.type === 'UPDATE_POSITION' &&
          event.config.positionX !== undefined
        ) {
          return event.config.positionX
        }
        return context.positionX
      },
      positionY: ({ event, context }) => {
        if (
          event.type === 'UPDATE_POSITION' &&
          event.config.positionY !== undefined
        ) {
          return event.config.positionY
        }
        return context.positionY
      },
      rotation: ({ event, context }) => {
        if (
          event.type === 'UPDATE_POSITION' &&
          event.config.rotation !== undefined
        ) {
          return event.config.rotation
        }
        return context.rotation
      },
      randomnessX: ({ event, context }) => {
        if (
          event.type === 'UPDATE_POSITION' &&
          event.config.randomnessX !== undefined
        ) {
          return event.config.randomnessX
        }
        return context.randomnessX
      },
      randomnessY: ({ event, context }) => {
        if (
          event.type === 'UPDATE_POSITION' &&
          event.config.randomnessY !== undefined
        ) {
          return event.config.randomnessY
        }
        return context.randomnessY
      },
      randomnessRotation: ({ event, context }) => {
        if (
          event.type === 'UPDATE_POSITION' &&
          event.config.randomnessRotation !== undefined
        ) {
          return event.config.randomnessRotation
        }
        return context.randomnessRotation
      },
    }),
    updateAppearance: assign({
      color: ({ event, context }) => {
        if (
          event.type === 'UPDATE_APPEARANCE' &&
          event.config.color !== undefined
        ) {
          return event.config.color
        }
        return context.color
      },
      transparency: ({ event, context }) => {
        if (
          event.type === 'UPDATE_APPEARANCE' &&
          event.config.transparency !== undefined
        ) {
          return event.config.transparency
        }
        return context.transparency
      },
      fontSize: ({ event, context }) => {
        if (
          event.type === 'UPDATE_APPEARANCE' &&
          event.config.fontSize !== undefined
        ) {
          return event.config.fontSize
        }
        return context.fontSize
      },
    }),
    updateNumbering: assign({
      startNumber: ({ event, context }) => {
        if (
          event.type === 'UPDATE_NUMBERING' &&
          event.config.startNumber !== undefined
        ) {
          return event.config.startNumber
        }
        return context.startNumber
      },
      direction: ({ event, context }) => {
        if (
          event.type === 'UPDATE_NUMBERING' &&
          event.config.direction !== undefined
        ) {
          return event.config.direction
        }
        return context.direction
      },
      numberingType: ({ event, context }) => {
        if (
          event.type === 'UPDATE_NUMBERING' &&
          event.config.numberingType !== undefined
        ) {
          return event.config.numberingType
        }
        return context.numberingType
      },
      zeroPadding: ({ event, context }) => {
        if (
          event.type === 'UPDATE_NUMBERING' &&
          event.config.zeroPadding !== undefined
        ) {
          return event.config.zeroPadding
        }
        return context.zeroPadding
      },
    }),
    resetConfig: assign({
      // Reset a valores por defecto
      cornerVertical: 'top',
      cornerHorizontal: 'right',
      positionX: 0,
      positionY: 0,
      rotation: 0,
      randomnessX: 0,
      randomnessY: 0,
      randomnessRotation: 0,
      color: '#000000',
      transparency: 100, // 100 = completamente opaco
      fontSize: 12,
      startNumber: 1,
      direction: 'first',
      numberingType: 'numbers',
      zeroPadding: 6,
    }),
  },
}).createMachine({
  id: 'configManager',
  initial: 'ready',
  context: {
    // Valores por defecto
    cornerVertical: 'top',
    cornerHorizontal: 'right',
    positionX: 0,
    positionY: 0,
    rotation: 0,
    randomnessX: 0,
    randomnessY: 0,
    randomnessRotation: 0,
    color: '#000000',
    transparency: 0, // 100 = completamente opaco
    fontSize: 12,
    startNumber: 1,
    direction: 'first',
    numberingType: 'numbers',
    zeroPadding: 6,
  },
  states: {
    ready: {
      on: {
        UPDATE_POSITION: {
          actions: ['updatePosition'],
        },
        UPDATE_APPEARANCE: {
          actions: ['updateAppearance'],
        },
        UPDATE_NUMBERING: {
          actions: ['updateNumbering'],
        },
        RESET_CONFIG: {
          actions: ['resetConfig'],
        },
      },
    },
  },
})
