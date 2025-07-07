import { ActionButtons } from '../actions/ActionButtons'
import { ConfigurationPanel } from '../configuration/ConfigurationPanel'
import { PdfPreview } from '../preview/PdfPreview'

interface MainLayoutProps {
  children?: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="space-y-6">
      {/* ActionButtons - Barra de acciones */}
      <ActionButtons />

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ConfigurationPanel - Columna izquierda */}
        <div className="lg:col-span-1">
          <ConfigurationPanel />
        </div>

        {/* PdfPreview - Columna derecha */}
        <div className="lg:col-span-2">
          <PdfPreview />
        </div>
      </div>

      {/* Children para contenido adicional */}
      {children}
    </div>
  )
}
