import { setup, assign } from 'xstate'
import type { ActorRefFrom } from 'xstate'
import { fileManagerMachine } from './FileManager'
import { configManagerMachine } from './ConfigManager'
import { pdfProcessorMachine } from './Processor'

interface PdfFolioOrchestratorContext {
  error: string | null
  progress: number
  fileManager: ActorRefFrom<typeof fileManagerMachine> | null
  configManager: ActorRefFrom<typeof configManagerMachine> | null
  processor: ActorRefFrom<typeof pdfProcessorMachine> | null
}

// Tipos específicos para cada sección de configuración
type PositionConfigUpdate = {
  cornerVertical?: 'top' | 'bottom'
  cornerHorizontal?: 'left' | 'right'
  positionX?: number
  positionY?: number
  rotation?: number
  randomnessX?: number
  randomnessY?: number
  randomnessRotation?: number
}

type AppearanceConfigUpdate = {
  color?: string
  transparency?: number
  fontSize?: number
}

type NumberingConfigUpdate = {
  startNumber?: number
  direction?: 'first' | 'last'
  numberingType?: 'numbers' | 'letters' | 'mixed'
  zeroPadding?: number
}

type PdfFolioOrchestratorEvents =
  | { type: 'fileManager.UPLOAD_FILE'; file: File }
  | { type: 'fileManager.VALIDATE' }
  | { type: 'fileManager.CLEAR_ERROR' }
  | { type: 'fileManager.VALIDATION_ERROR'; error: string }
  | {
      type: 'configManager.UPDATE_CONFIG'
      config: {
        reset?: boolean
        position?: PositionConfigUpdate
        appearance?: AppearanceConfigUpdate
        numbering?: NumberingConfigUpdate
      }
    }
  | { type: 'START_PROCESSING' }
  | { type: 'CANCEL_PROCESSING' }
  | { type: 'DOWNLOAD_PDF' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTART_AFTER_COMPLETE' }
  | { type: 'UPDATE_PROGRESS'; progress: number }
  | { type: 'RESET' }

export const pdfFolioOrchestrator = setup({
  types: {
    context: {} as PdfFolioOrchestratorContext,
    events: {} as PdfFolioOrchestratorEvents,
  },
  actors: {
    fileManager: fileManagerMachine,
    configManager: configManagerMachine,
    processor: pdfProcessorMachine,
  },
  actions: {
    resetAll: assign({
      error: null,
    }),
    uploadFile: ({ context, event }) => {
      if (event.type === 'fileManager.UPLOAD_FILE') {
        context.fileManager?.send({
          type: 'UPLOAD_FILE',
          file: event.file,
        })
      }
    },
    updateConfig: ({ context, event }) => {
      if (event.type === 'configManager.UPDATE_CONFIG') {
        // Manejar reset
        if (event.config.reset) {
          context.configManager?.send({ type: 'RESET_CONFIG' })
          return
        }

        // Actualizar posición si se proporciona y no está vacío
        if (
          event.config.position &&
          Object.keys(event.config.position).length > 0
        ) {
          context.configManager?.send({
            type: 'UPDATE_POSITION',
            config: event.config.position,
          })
        }

        // Actualizar apariencia si se proporciona y no está vacío
        if (
          event.config.appearance &&
          Object.keys(event.config.appearance).length > 0
        ) {
          context.configManager?.send({
            type: 'UPDATE_APPEARANCE',
            config: event.config.appearance,
          })
        }

        // Actualizar numeración si se proporciona y no está vacío
        if (
          event.config.numbering &&
          Object.keys(event.config.numbering).length > 0
        ) {
          context.configManager?.send({
            type: 'UPDATE_NUMBERING',
            config: event.config.numbering,
          })
        }
      }
    },
    startProcessing: ({ context }) => {
      const file = context.fileManager?.getSnapshot().context.file
      const config = context.configManager?.getSnapshot().context

      if (file && config) {
        context.processor?.send({
          type: 'START_PROCESSING',
          file,
          config,
        })
      }
    },
    cancelProcessing: ({ context }) => {
      context.processor?.send({ type: 'CANCEL_PROCESSING' })
    },
    downloadPdf: ({ context }) => {
      const processedPdf = context.processor?.getSnapshot().context.processedPdf
      if (processedPdf) {
        // Crear blob y descargar
        const blob = new Blob([processedPdf], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'pdf-foliado.pdf'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    },
    clearError: assign({
      error: null,
    }),
    restartAfterComplete: assign({
      error: null,
    }),
    updateProgress: assign({
      progress: ({ event }) => {
        if (event.type === 'UPDATE_PROGRESS') {
          return event.progress
        }
        return 0
      },
    }),
  },
  guards: {
    isFileReady: ({ context }) => {
      return context.fileManager?.getSnapshot().matches('ready') ?? false
    },
    isConfigReady: ({ context }) => {
      return context.configManager?.getSnapshot().matches('ready') ?? false
    },
    canStartProcessing: ({ context }) => {
      const file = context.fileManager?.getSnapshot().context.file
      const config = context.configManager?.getSnapshot().context
      return !!(file && config)
    },
  },
}).createMachine({
  id: 'pdfFolioOrchestrator',
  initial: 'idle',
  context: ({ spawn }) => ({
    error: null,
    progress: 0,
    fileManager: spawn('fileManager'),
    configManager: spawn('configManager'),
    processor: spawn('processor'),
  }),
  states: {
    idle: {
      on: {
        'fileManager.UPLOAD_FILE': {
          target: 'uploading',
          actions: ['uploadFile'],
        },
      },
    },
    uploading: {
      on: {
        'fileManager.UPLOAD_FILE': {
          actions: ['uploadFile'],
        },
      },
      always: [
        {
          guard: 'isFileReady',
          target: 'configuring',
        },
      ],
    },
    configuring: {
      on: {
        'configManager.UPDATE_CONFIG': {
          actions: ['updateConfig'],
        },
        START_PROCESSING: {
          guard: 'canStartProcessing',
          target: 'processing',
          actions: ['startProcessing'],
        },
      },
      always: [
        {
          guard: 'isConfigReady',
          target: 'ready',
        },
      ],
    },
    ready: {
      on: {
        'configManager.UPDATE_CONFIG': {
          target: 'configuring',
          actions: ['updateConfig'],
        },
        START_PROCESSING: {
          guard: 'canStartProcessing',
          target: 'processing',
          actions: ['startProcessing'],
        },
        RESET: {
          target: 'idle',
          actions: ['resetAll'],
        },
      },
    },
    processing: {
      on: {
        CANCEL_PROCESSING: {
          target: 'ready',
          actions: ['cancelProcessing'],
        },
        UPDATE_PROGRESS: {
          actions: ['updateProgress'],
        },
      },
      always: [
        {
          guard: ({ context }) => {
            const processorState = context.processor?.getSnapshot()
            return processorState?.matches('completed') ?? false
          },
          target: 'completed',
        },
        {
          guard: ({ context }) => {
            const processorState = context.processor?.getSnapshot()
            return processorState?.matches('error') ?? false
          },
          target: 'error',
          actions: assign({
            error: ({ context }) => {
              const processorState = context.processor?.getSnapshot()
              return processorState?.context.error || 'Error desconocido'
            },
          }),
        },
      ],
    },
    completed: {
      on: {
        DOWNLOAD_PDF: {
          actions: ['downloadPdf'],
        },
        RESTART_AFTER_COMPLETE: {
          target: 'idle',
          actions: ['restartAfterComplete'],
        },
        RESET: {
          target: 'idle',
          actions: ['resetAll'],
        },
      },
    },
    error: {
      on: {
        CLEAR_ERROR: {
          target: 'ready',
          actions: ['clearError'],
        },
        RESET: {
          target: 'idle',
          actions: ['resetAll'],
        },
      },
    },
  },
})
