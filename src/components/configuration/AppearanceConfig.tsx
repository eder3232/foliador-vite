import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Eye, Type } from 'lucide-react'

export function AppearanceConfig() {
  const [state, send] = useFoliadorStore()

  // Obtener configuración actual
  const config = state.context.configManager?.getSnapshot().context

  // Función para actualizar configuración de apariencia
  const updateAppearance = (updates: any) => {
    send({
      type: 'configManager.UPDATE_CONFIG',
      config: {
        appearance: {
          ...config,
          ...updates,
        },
      },
    })
  }

  // Función para manejar cambios en sliders
  const handleSliderChange = (value: number[], field: string) => {
    updateAppearance({ [field]: value[0] })
  }

  // Función para manejar cambios en inputs
  const handleInputChange = (value: string, field: string) => {
    if (field === 'color') {
      updateAppearance({ [field]: value })
    } else {
      const numValue = parseFloat(value) || 0
      updateAppearance({ [field]: numValue })
    }
  }

  return (
    <div className="space-y-4">
      {/* Color */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Color del Folio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Color del Texto</Label>
            <div className="flex items-center space-x-3">
              <Input
                type="color"
                value={config?.color || '#000000'}
                onChange={(e) => handleInputChange(e.target.value, 'color')}
                className="w-16 h-10 p-1 border rounded cursor-pointer"
              />
              <Input
                type="text"
                value={config?.color || '#000000'}
                onChange={(e) => handleInputChange(e.target.value, 'color')}
                className="flex-1 h-8 text-xs font-mono"
                placeholder="#000000"
              />
            </div>
            <div className="text-xs text-gray-500">
              Selecciona el color del texto del folio
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transparencia */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Transparencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">
                Nivel de Transparencia
              </Label>
              <span className="text-xs text-gray-500">
                {config?.transparency || 0}%
              </span>
            </div>
            <Slider
              value={[config?.transparency || 0]}
              onValueChange={(value) =>
                handleSliderChange(value, 'transparency')
              }
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <Input
              type="number"
              value={config?.transparency || 0}
              onChange={(e) =>
                handleInputChange(e.target.value, 'transparency')
              }
              step={1}
              min={0}
              max={100}
              className="h-8 text-xs"
              placeholder="0"
            />
            <div className="text-xs text-gray-500">
              0% = Completamente opaco, 100% = Completamente transparente
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tamaño de Fuente */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Type className="h-4 w-4 mr-2" />
            Tamaño de Fuente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Tamaño del Texto</Label>
              <span className="text-xs text-gray-500">
                {config?.fontSize || 12} pt
              </span>
            </div>
            <Slider
              value={[config?.fontSize || 12]}
              onValueChange={(value) => handleSliderChange(value, 'fontSize')}
              max={72}
              min={6}
              step={1}
              className="w-full"
            />
            <Input
              type="number"
              value={config?.fontSize || 12}
              onChange={(e) => handleInputChange(e.target.value, 'fontSize')}
              step={1}
              min={6}
              max={72}
              className="h-8 text-xs"
              placeholder="12"
            />
            <div className="text-xs text-gray-500">
              Tamaño de la fuente en puntos (6-72 pt)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview del Folio */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Vista Previa</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-20 border rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: '#f8f9fa',
              backgroundImage: `
                linear-gradient(45deg, #e9ecef 25%, transparent 25%), 
                linear-gradient(-45deg, #e9ecef 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #e9ecef 75%), 
                linear-gradient(-45deg, transparent 75%, #e9ecef 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          >
            <div
              className="text-center"
              style={{
                color: config?.color || '#000000',
                fontSize: `${config?.fontSize || 12}px`,
                opacity: 1 - (config?.transparency || 0) / 100,
                transform: 'rotate(0deg)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <div className="font-bold">001</div>
              <div className="text-xs opacity-75">Ejemplo</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Vista previa del folio con la configuración actual
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="text-xs text-gray-500 space-y-1 p-3 bg-gray-50 rounded-lg">
        <p>
          • <strong>Color:</strong> Usa formato hexadecimal (#RRGGBB)
        </p>
        <p>
          • <strong>Transparencia:</strong> 0% = opaco, 100% = transparente
        </p>
        <p>
          • <strong>Tamaño:</strong> 6-72 puntos (pt)
        </p>
        <p>
          • <strong>Preview:</strong> Muestra cómo se verá el folio
        </p>
      </div>
    </div>
  )
}
