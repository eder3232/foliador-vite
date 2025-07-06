import { useFoliadorStore } from '@/store/useFoliadorStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Hash, ArrowUpDown, List, Hash as HashIcon } from 'lucide-react'
import numerosEnLetras from '@/utils/numerosEnLetras'

export function NumberingConfig() {
  const [state, send] = useFoliadorStore()

  // Obtener configuración actual
  const config = state.context.configManager?.getSnapshot().context

  // Función para actualizar configuración de numeración
  const updateNumbering = (updates: any) => {
    send({
      type: 'configManager.UPDATE_CONFIG',
      config: {
        numbering: updates,
      },
    })
  }

  // Función para manejar cambios en inputs
  const handleInputChange = (value: string, field: string) => {
    const numValue = parseInt(value) || 0
    updateNumbering({ [field]: numValue })
  }

  // Función para manejar cambios en selects
  const handleSelectChange = (value: string, field: string) => {
    updateNumbering({ [field]: value })
  }

  // Función para obtener número en letras
  const getNumberInLetters = (num: number): string => {
    if (num > 1000) return num.toString()
    return (
      numerosEnLetras[num as keyof typeof numerosEnLetras] || num.toString()
    )
  }

  return (
    <div className="space-y-4">
      {/* Número Inicial */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Hash className="h-4 w-4 mr-2" />
            Número Inicial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Número de Inicio</Label>
            <Input
              type="number"
              value={config?.startNumber || 1}
              onChange={(e) => handleInputChange(e.target.value, 'startNumber')}
              min={1}
              max={9999}
              className="h-8 text-xs"
              placeholder="1"
            />
            <div className="text-xs text-gray-500">
              Número desde el cual comenzará la numeración (1-9999)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dirección */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Dirección de Numeración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Orden de Páginas</Label>
            <div className="flex space-y-2 flex-col">
              <Button
                variant={config?.direction === 'first' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateNumbering({ direction: 'first' })}
              >
                Primera Página
              </Button>
              <Button
                variant={config?.direction === 'last' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateNumbering({ direction: 'last' })}
              >
                Última Página
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              {config?.direction === 'first'
                ? 'La numeración comenzará desde la primera página'
                : 'La numeración comenzará desde la última página'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipo de Numeración */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <List className="h-4 w-4 mr-2" />
            Tipo de Numeración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Formato de Numeración</Label>
            <Select
              value={config?.numberingType || 'numbers'}
              onValueChange={(value) =>
                handleSelectChange(value, 'numberingType')
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="numbers">
                  <div className="flex items-center">
                    <HashIcon className="h-3 w-3 mr-2" />
                    Números (1, 2, 3...)
                  </div>
                </SelectItem>
                <SelectItem value="letters">
                  <div className="flex items-center">
                    <HashIcon className="h-3 w-3 mr-2" />
                    Letras (uno, dos, tres...)
                  </div>
                </SelectItem>
                <SelectItem value="mixed">
                  <div className="flex items-center text-wrap">
                    <HashIcon className="h-3 w-3 mr-2" />
                    Mixto (número arriba, letra abajo)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500">
              {config?.numberingType === 'numbers' &&
                'Usar números arábigos (1, 2, 3...)'}
              {config?.numberingType === 'letters' &&
                'Usar números en letras (uno, dos, tres...)'}
              {config?.numberingType === 'mixed' &&
                'Mostrar número arriba y letra abajo (000001 / UNO)'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Padding de Ceros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <HashIcon className="h-4 w-4 mr-2" />
            Padding de Ceros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Cantidad de Dígitos</Label>
            <Input
              type="number"
              value={config?.zeroPadding || 6}
              onChange={(e) => handleInputChange(e.target.value, 'zeroPadding')}
              min={1}
              max={10}
              className="h-8 text-xs"
              placeholder="6"
            />
            <div className="text-xs text-gray-500">
              Número de dígitos totales (ej: 6 = 000001, 000002...)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview de Numeración */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Vista Previa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-xs text-gray-500 mb-3">
              Ejemplos de numeración con la configuración actual:
            </div>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((num) => {
                const pageNumber = (config?.startNumber || 1) + num - 1
                let displayText = ''

                if (config?.numberingType === 'numbers') {
                  displayText = pageNumber
                    .toString()
                    .padStart(config?.zeroPadding || 6, '0')
                } else if (config?.numberingType === 'letters') {
                  displayText = getNumberInLetters(pageNumber)
                } else if (config?.numberingType === 'mixed') {
                  // En modo mixto, mostrar número arriba y letra abajo
                  const numeroFormateado = pageNumber
                    .toString()
                    .padStart(config?.zeroPadding || 6, '0')

                  const letra = getNumberInLetters(pageNumber)

                  return (
                    <div
                      key={num}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs"
                    >
                      <span className="text-gray-600">Página {num}:</span>
                      <div className="text-right">
                        <div className="font-mono font-medium">
                          {numeroFormateado}
                        </div>
                        <div className="text-xs text-gray-600">{letra}</div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={num}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs"
                  >
                    <span className="text-gray-600">Página {num}:</span>
                    <span className="font-mono font-medium">{displayText}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="text-xs text-gray-500 space-y-1 p-3 bg-gray-50 rounded-lg">
        <p>
          • <strong>Número inicial:</strong> Desde qué número comenzar (1-9999)
        </p>
        <p>
          • <strong>Dirección:</strong> Primera página = ascendente, Última =
          descendente
        </p>
        <p>
          • <strong>Tipo:</strong> Números, letras o mixto (número arriba, letra
          abajo)
        </p>
        <p>
          • <strong>Padding:</strong> Cantidad de dígitos totales con ceros
        </p>
      </div>
    </div>
  )
}
