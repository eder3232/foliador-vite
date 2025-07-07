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
import { Sparkles, FileText } from 'lucide-react'

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
          <div className="flex justify-between items-center h-20">
            {/* Logo y marca */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">eder3232</h1>
                  <p className="text-sm text-gray-600 -mt-1">
                    Tecnología para un mundo mejor
                  </p>
                </div>
              </div>

              {/* Separador */}
              <div className="w-px h-8 bg-gray-300"></div>

              {/* Referencia al foliador */}
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-medium text-gray-700">
                  Foliador PDF
                </span>
              </div>
            </div>

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
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-sm">
          <div>Estado: {state.value}</div>
          <div>Progreso: {state.context.progress}%</div>
          {state.context.error && <div>Error: {state.context.error}</div>}
        </div>
      )} */}
    </div>
  )
}
