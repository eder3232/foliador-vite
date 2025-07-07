import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Loader2,
} from 'lucide-react'
import { FolioOverlay } from './FolioOverlay'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export function PdfPreview() {
  const [state] = useFoliadorStore()

  // Estado interno para navegación y zoom
  const [currentPage, setCurrentPage] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 })

  // Obtener archivo PDF del store
  const pdfFile = state.context.fileManager?.getSnapshot().context.file

  // Función para manejar carga exitosa del documento
  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
      setCurrentPage(1)
      setError(null)
      setIsLoading(false)
    },
    []
  )

  // Función para manejar errores de carga
  const onDocumentLoadError = useCallback((error: Error) => {
    setError('Error al cargar el PDF: ' + error.message)
    setIsLoading(false)
  }, [])

  // Función para manejar carga del documento
  const onDocumentLoadStart = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  // Función para manejar carga de página
  const onPageLoadSuccess = useCallback((page: any) => {
    const { width, height } = page.getViewport({ scale: 1.0 })
    setPageDimensions({ width, height })
  }, [])

  // Navegación de páginas
  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1))
  }, [numPages])

  const goToPage = useCallback(
    (pageNumber: number) => {
      const page = Math.max(1, Math.min(numPages, pageNumber))
      setCurrentPage(page)
    },
    [numPages]
  )

  // Controles de zoom
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(3.0, prev + 0.25))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(0.25, prev - 0.25))
  }, [])

  const resetZoom = useCallback(() => {
    setScale(1.0)
  }, [])

  const fitToWidth = useCallback(() => {
    // Zoom para ajustar al ancho del contenedor
    setScale(0.8) // Valor aproximado, se puede calcular dinámicamente
  }, [])

  // Si no hay archivo, mostrar mensaje
  if (!pdfFile) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay PDF cargado
          </h3>
          <p className="text-sm text-gray-500">
            Sube un archivo PDF para ver la vista previa
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Controles de navegación y zoom */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Controles de Vista
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Navegación de páginas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Label className="text-xs font-medium">Página:</Label>
                <Input
                  type="number"
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  min={1}
                  max={numPages}
                  className="w-16 h-8 text-xs"
                />
                <span className="text-xs text-gray-500">
                  de {numPages || '?'}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Controles de zoom */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.25}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Label className="text-xs font-medium">Zoom:</Label>
                <span className="text-xs font-mono min-w-[3rem]">
                  {Math.round(scale * 100)}%
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 3.0}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={resetZoom}>
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={fitToWidth}>
                Ajustar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenedor del PDF */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-4 h-full">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500 mb-2" />
                <p className="text-sm text-gray-500">Cargando PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto text-red-500 mb-2" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <div className="h-full overflow-auto flex justify-center relative">
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                onLoadStart={onDocumentLoadStart}
                loading={
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-red-500">
                      Error al cargar el PDF
                    </p>
                  </div>
                }
              >
                <div className="relative">
                  <Page
                    pageNumber={currentPage}
                    scale={scale}
                    onLoadSuccess={onPageLoadSuccess}
                    loading={
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      </div>
                    }
                    error={
                      <div className="flex items-center justify-center h-32">
                        <p className="text-sm text-red-500">
                          Error al cargar la página
                        </p>
                      </div>
                    }
                  />

                  {/* Folio Overlay */}
                  {pageDimensions.width > 0 && pageDimensions.height > 0 && (
                    <FolioOverlay
                      currentPage={currentPage}
                      totalPages={numPages}
                      scale={scale}
                      pageWidth={pageDimensions.width * scale}
                      pageHeight={pageDimensions.height * scale}
                    />
                  )}
                </div>
              </Document>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del archivo */}
      <Card className="mt-4">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>
                <strong>Archivo:</strong> {pdfFile.name}
              </span>
              <span>
                <strong>Tamaño:</strong>{' '}
                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span>
                <strong>Páginas:</strong> {numPages || '?'}
              </span>
              <span>
                <strong>Zoom:</strong> {Math.round(scale * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
