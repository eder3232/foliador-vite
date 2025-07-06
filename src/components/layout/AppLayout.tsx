import { useFoliadorStore } from '@/store/useFoliadorStore'
import { FileUploadSection } from '../file-upload/FileUploadSection'
import { MainLayout } from './MainLayout'
import {
  StatusIndicator,
  CompactStatusIndicator,
} from '../feedback/StatusIndicator'
import { ErrorDisplay } from '../feedback/ErrorDisplay'
import { ProgressIndicator } from '../feedback/ProgressIndicator'
import { LoadingSpinner } from '../feedback/LoadingSpinner'

export function AppLayout() {
  const [state] = useFoliadorStore()

  // Determinar el estado actual de la máquina
  const isIdle = state.matches('idle')
  const isUploading = state.matches('uploading')
  const isConfiguring = state.matches('configuring')
  const isReady = state.matches('ready')
  const isProcessing = state.matches('processing')
  const isCompleted = state.matches('completed')
  const isError = state.matches('error')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Foliador PDF
            </h1>
            {/* StatusIndicator compacto en el header */}
            <CompactStatusIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estado: idle - Mostrar FileUploadSection */}
        {(isIdle || isUploading) && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <FileUploadSection />
            {isUploading && (
              <div className="w-full max-w-md">
                <LoadingSpinner
                  size="large"
                  text="Subiendo archivo PDF..."
                  variant="pulse"
                />
              </div>
            )}
          </div>
        )}

        {/* Estados: configuring, ready, processing, completed - Mostrar MainLayout */}
        {(isConfiguring || isReady || isProcessing || isCompleted) && (
          <div className="space-y-6">
            {/* StatusIndicator completo */}
            <StatusIndicator />

            {/* ProgressIndicator durante procesamiento */}
            {isProcessing && <ProgressIndicator />}

            {/* MainLayout con configuración y preview */}
            <MainLayout />
          </div>
        )}

        {/* Estado: error - Mostrar ErrorDisplay */}
        {isError && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-2xl">
              <ErrorDisplay />
            </div>
          </div>
        )}
      </main>

      {/* Debug Info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-sm">
          <div>Estado: {state.value}</div>
          <div>Progreso: {state.context.progress}%</div>
          {state.context.error && <div>Error: {state.context.error}</div>}
        </div>
      )}
    </div>
  )
}
