import { ClipLoader, PulseLoader, BeatLoader, SyncLoader } from 'react-spinners'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  variant?: 'clip' | 'pulse' | 'beat' | 'sync'
  className?: string
  color?: string
}

export function LoadingSpinner({
  size = 'medium',
  text = 'Cargando...',
  variant = 'clip',
  className = '',
  color = '#3b82f6', // blue-500
}: LoadingSpinnerProps) {
  // Configurar tamaños
  const sizeConfig = {
    small: {
      spinner: 16,
      text: 'text-xs',
      padding: 'p-2',
    },
    medium: {
      spinner: 24,
      text: 'text-sm',
      padding: 'p-4',
    },
    large: {
      spinner: 32,
      text: 'text-base',
      padding: 'p-6',
    },
  }

  const config = sizeConfig[size]

  // Renderizar el spinner según la variante
  const renderSpinner = () => {
    const commonProps = {
      size: config.spinner,
      color: color,
      loading: true,
    }

    switch (variant) {
      case 'clip':
        return <ClipLoader {...commonProps} />
      case 'pulse':
        return <PulseLoader {...commonProps} size={config.spinner / 3} />
      case 'beat':
        return <BeatLoader {...commonProps} size={config.spinner / 3} />
      case 'sync':
        return <SyncLoader {...commonProps} size={config.spinner / 3} />
      default:
        return <ClipLoader {...commonProps} />
    }
  }

  return (
    <Card className={cn('w-full bg-white/80 backdrop-blur-sm', className)}>
      <CardContent
        className={cn(
          'flex flex-col items-center justify-center space-y-3',
          config.padding
        )}
      >
        {/* Spinner */}
        <div className="flex items-center justify-center">
          {renderSpinner()}
        </div>

        {/* Texto descriptivo */}
        {text && (
          <div
            className={cn('text-center text-gray-600 font-medium', config.text)}
          >
            {text}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componentes especializados para diferentes contextos
export function FileUploadSpinner() {
  return (
    <LoadingSpinner
      size="large"
      text="Subiendo archivo PDF..."
      variant="pulse"
      color="#8b5cf6" // purple-500
    />
  )
}

export function ProcessingSpinner() {
  return (
    <LoadingSpinner
      size="large"
      text="Procesando PDF..."
      variant="beat"
      color="#3b82f6" // blue-500
    />
  )
}

export function ConfigSpinner() {
  return (
    <LoadingSpinner
      size="medium"
      text="Aplicando configuración..."
      variant="sync"
      color="#10b981" // emerald-500
    />
  )
}

export function DownloadSpinner() {
  return (
    <LoadingSpinner
      size="medium"
      text="Preparando descarga..."
      variant="clip"
      color="#f59e0b" // amber-500
    />
  )
}

export function CompactSpinner({ text }: { text?: string }) {
  return (
    <LoadingSpinner
      size="small"
      text={text}
      variant="clip"
      className="bg-transparent border-0 shadow-none"
    />
  )
}

export function FullScreenSpinner({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-96 bg-white shadow-xl">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <LoadingSpinner
            size="large"
            text={text || 'Procesando...'}
            variant="beat"
            className="bg-transparent border-0 shadow-none"
          />
        </CardContent>
      </Card>
    </div>
  )
}
