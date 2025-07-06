import { assign, fromPromise, setup } from 'xstate'
import { firmarPdf } from '../utils/foliadorPDF'
import type { ConfigManagerContext } from './ConfigManager'

export const pdfProcessorMachine = setup({
  types: {
    context: {} as {
      progress: number
      error: string | null
      processedPdf: Uint8Array | null
      file: File | null
      config: ConfigManagerContext | null
    },
    events: {} as
      | { type: 'START_PROCESSING'; file: File; config: ConfigManagerContext }
      | { type: 'CANCEL_PROCESSING' }
      | { type: 'UPDATE_PROGRESS'; progress: number }
      | { type: 'PROCESSING_ERROR'; error: string },
  },
  actors: {
    processPdf: fromPromise(
      async ({
        input,
      }: {
        input: { file: File; config: ConfigManagerContext }
      }) => {
        console.log('Iniciando procesamiento del PDF...')

        try {
          // Simular progreso inicial
          await new Promise((resolve) => setTimeout(resolve, 100))

          // Usar la función de foliado desde utils
          const processedPdfBytes = await firmarPdf(input.file, input.config)

          console.log('PDF procesado exitosamente')
          return processedPdfBytes
        } catch (error) {
          console.error('Error en procesamiento:', error)
          throw new Error(
            `Error al procesar PDF: ${
              error instanceof Error ? error.message : 'Error desconocido'
            }`
          )
        }
      }
    ),
  },
  actions: {
    setProgress: assign({
      progress: ({ event }) => {
        if (event.type === 'UPDATE_PROGRESS') {
          return event.progress
        }
        return 0
      },
    }),
    setError: assign({
      error: ({ event }) => {
        if (event.type === 'PROCESSING_ERROR') {
          return event.error
        }
        return null
      },
    }),
    setProcessedPdf: assign({
      processedPdf: ({ event }) => {
        if ('output' in event) {
          return event.output as Uint8Array
        }
        return null
      },
    }),
    saveFileAndConfig: assign({
      file: ({ event }) =>
        event.type === 'START_PROCESSING' ? event.file : null,
      config: ({ event }) =>
        event.type === 'START_PROCESSING' ? event.config : null,
    }),
    clearError: assign({
      error: null,
    }),
    resetProcessor: assign({
      progress: 0,
      error: null,
      processedPdf: null,
      file: null,
      config: null,
    }),
  },
}).createMachine({
  id: 'pdfProcessor',
  initial: 'idle',
  context: {
    progress: 0,
    error: null,
    processedPdf: null,
    file: null,
    config: null,
  },
  states: {
    idle: {
      on: {
        START_PROCESSING: {
          target: 'processing',
          actions: ['saveFileAndConfig'],
        },
      },
    },
    processing: {
      invoke: {
        src: 'processPdf',
        input: ({ context }) => {
          console.log('Enviando archivo y configuración al actor:', {
            file: context.file?.name,
            config: context.config,
          })
          return {
            file: context.file!,
            config: context.config!,
          }
        },
        onDone: {
          target: 'completed',
          actions: ['setProcessedPdf'],
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) => {
              const error = event.error as Error
              return error?.message || 'Error desconocido en el procesamiento'
            },
          }),
        },
      },
      on: {
        CANCEL_PROCESSING: {
          target: 'idle',
          actions: ['resetProcessor'],
        },
      },
    },
    completed: {
      type: 'final',
    },
    error: {
      on: {
        START_PROCESSING: {
          target: 'processing',
          actions: ['saveFileAndConfig', 'clearError'],
        },
      },
    },
  },
})
