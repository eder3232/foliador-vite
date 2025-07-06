import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { useFoliadorStore } from '@/store/useFoliadorStore'

export function FileUploadSection() {
  const [state, send] = useFoliadorStore()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        send({ type: 'fileManager.UPLOAD_FILE', file })
      }
    },
    [send]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf'],
      },
      multiple: false,
      disabled: state.matches('uploading'),
    })

  const isUploading = state.matches('uploading')
  const hasError = state.context.error

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mensaje de error si existe */}
      {hasError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{hasError}</span>
          </div>
        </div>
      )}

      {/* Área de drop */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            isDragActive && !isDragReject
              ? 'border-blue-400 bg-blue-50'
              : isDragReject
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {/* Icono */}
        <div className="mb-4">
          {isUploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          ) : isDragReject ? (
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
          )}
        </div>

        {/* Texto principal */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isUploading
            ? 'Procesando archivo...'
            : isDragReject
            ? 'Archivo no válido'
            : isDragActive
            ? 'Suelta el archivo aquí'
            : 'Subir archivo PDF'}
        </h3>

        {/* Texto secundario */}
        <p className="text-sm text-gray-500 mb-4">
          {isUploading
            ? 'Validando archivo PDF...'
            : isDragReject
            ? 'Solo se permiten archivos PDF'
            : isDragActive
            ? 'El archivo será procesado automáticamente'
            : 'Arrastra y suelta un archivo PDF aquí, o haz clic para seleccionar'}
        </p>

        {/* Botón de selección */}
        {!isUploading && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <FileText className="h-4 w-4 mr-2" />
            Seleccionar archivo
          </button>
        )}

        {/* Información adicional */}
        <div className="mt-4 text-xs text-gray-400">
          <p>Formatos soportados: PDF</p>
          <p>Tamaño máximo: 50MB</p>
        </div>
      </div>

      {/* Información del archivo si se ha subido */}
      {state.context.fileManager?.getSnapshot().context.file && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <p className="text-green-800 font-medium">
                {state.context.fileManager.getSnapshot().context.file?.name}
              </p>
              <p className="text-green-600 text-sm">
                Archivo cargado correctamente
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
