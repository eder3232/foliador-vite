import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RotateCcw, Move, Shuffle } from 'lucide-react'

export function PositionConfig() {
  const [state, send] = useFoliadorStore()

  // Obtener configuración actual
  const config = state.context.configManager?.getSnapshot().context

  // Función para actualizar configuración de posición
  const updatePosition = (updates: any) => {
    send({
      type: 'configManager.UPDATE_CONFIG',
      config: {
        position: {
          ...config,
          ...updates,
        },
      },
    })
  }

  // Función para manejar cambios en sliders
  const handleSliderChange = (value: number[], field: string) => {
    updatePosition({ [field]: value[0] })
  }

  // Función para manejar cambios en inputs
  const handleInputChange = (value: string, field: string) => {
    const numValue = parseFloat(value) || 0
    updatePosition({ [field]: numValue })
  }

  return (
    <div className="space-y-4">
      {/* Esquinas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Move className="h-4 w-4 mr-2" />
            Esquina del Folio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Esquina Vertical */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Posición Vertical</Label>
            <div className="flex space-x-2">
              <Button
                variant={
                  config?.cornerVertical === 'top' ? 'default' : 'outline'
                }
                size="sm"
                className="flex-1"
                onClick={() => updatePosition({ cornerVertical: 'top' })}
              >
                Superior
              </Button>
              <Button
                variant={
                  config?.cornerVertical === 'bottom' ? 'default' : 'outline'
                }
                size="sm"
                className="flex-1"
                onClick={() => updatePosition({ cornerVertical: 'bottom' })}
              >
                Inferior
              </Button>
            </div>
          </div>

          {/* Esquina Horizontal */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Posición Horizontal</Label>
            <div className="flex space-x-2">
              <Button
                variant={
                  config?.cornerHorizontal === 'left' ? 'default' : 'outline'
                }
                size="sm"
                className="flex-1"
                onClick={() => updatePosition({ cornerHorizontal: 'left' })}
              >
                Izquierda
              </Button>
              <Button
                variant={
                  config?.cornerHorizontal === 'right' ? 'default' : 'outline'
                }
                size="sm"
                className="flex-1"
                onClick={() => updatePosition({ cornerHorizontal: 'right' })}
              >
                Derecha
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ajuste de Posición */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Move className="h-4 w-4 mr-2" />
            Ajuste de Posición
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Posición X */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Posición X</Label>
              <span className="text-xs text-gray-500">
                {config?.positionX || 0} cm
              </span>
            </div>
            <Slider
              value={[config?.positionX || 0]}
              onValueChange={(value) => handleSliderChange(value, 'positionX')}
              max={10}
              min={-10}
              step={0.1}
              className="w-full"
            />
            <Input
              type="number"
              value={config?.positionX || 0}
              onChange={(e) => handleInputChange(e.target.value, 'positionX')}
              step={0.1}
              className="h-8 text-xs"
              placeholder="0.0"
            />
          </div>

          {/* Posición Y */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Posición Y</Label>
              <span className="text-xs text-gray-500">
                {config?.positionY || 0} cm
              </span>
            </div>
            <Slider
              value={[config?.positionY || 0]}
              onValueChange={(value) => handleSliderChange(value, 'positionY')}
              max={10}
              min={-10}
              step={0.1}
              className="w-full"
            />
            <Input
              type="number"
              value={config?.positionY || 0}
              onChange={(e) => handleInputChange(e.target.value, 'positionY')}
              step={0.1}
              className="h-8 text-xs"
              placeholder="0.0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rotación */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <RotateCcw className="h-4 w-4 mr-2" />
            Rotación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Ángulo de Rotación</Label>
              <span className="text-xs text-gray-500">
                {config?.rotation || 0}°
              </span>
            </div>
            <Slider
              value={[config?.rotation || 0]}
              onValueChange={(value) => handleSliderChange(value, 'rotation')}
              max={360}
              min={0}
              step={1}
              className="w-full"
            />
            <Input
              type="number"
              value={config?.rotation || 0}
              onChange={(e) => handleInputChange(e.target.value, 'rotation')}
              step={1}
              className="h-8 text-xs"
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Aleatoriedad */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Shuffle className="h-4 w-4 mr-2" />
            Aleatoriedad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Aleatoriedad X */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Aleatoriedad X</Label>
              <span className="text-xs text-gray-500">
                {config?.randomnessX || 0} cm
              </span>
            </div>
            <Slider
              value={[config?.randomnessX || 0]}
              onValueChange={(value) =>
                handleSliderChange(value, 'randomnessX')
              }
              max={5}
              min={0}
              step={0.1}
              className="w-full"
            />
            <Input
              type="number"
              value={config?.randomnessX || 0}
              onChange={(e) => handleInputChange(e.target.value, 'randomnessX')}
              step={0.1}
              className="h-8 text-xs"
              placeholder="0.0"
            />
          </div>

          {/* Aleatoriedad Y */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Aleatoriedad Y</Label>
              <span className="text-xs text-gray-500">
                {config?.randomnessY || 0} cm
              </span>
            </div>
            <Slider
              value={[config?.randomnessY || 0]}
              onValueChange={(value) =>
                handleSliderChange(value, 'randomnessY')
              }
              max={5}
              min={0}
              step={0.1}
              className="w-full"
            />
            <Input
              type="number"
              value={config?.randomnessY || 0}
              onChange={(e) => handleInputChange(e.target.value, 'randomnessY')}
              step={0.1}
              className="h-8 text-xs"
              placeholder="0.0"
            />
          </div>

          {/* Aleatoriedad Rotación */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">
                Aleatoriedad Rotación
              </Label>
              <span className="text-xs text-gray-500">
                {config?.randomnessRotation || 0}°
              </span>
            </div>
            <Slider
              value={[config?.randomnessRotation || 0]}
              onValueChange={(value) =>
                handleSliderChange(value, 'randomnessRotation')
              }
              max={30}
              min={0}
              step={1}
              className="w-full"
            />
            <Input
              type="number"
              value={config?.randomnessRotation || 0}
              onChange={(e) =>
                handleInputChange(e.target.value, 'randomnessRotation')
              }
              step={1}
              className="h-8 text-xs"
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="text-xs text-gray-500 space-y-1 p-3 bg-gray-50 rounded-lg">
        <p>
          • <strong>Esquina:</strong> Define la esquina base del folio
        </p>
        <p>
          • <strong>Ajuste:</strong> Desplazamiento desde la esquina base
        </p>
        <p>
          • <strong>Rotación:</strong> Ángulo en grados (0-360°)
        </p>
        <p>
          • <strong>Aleatoriedad:</strong> Variación aleatoria para cada página
        </p>
      </div>
    </div>
  )
}
