import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Config, RoundingType } from '../types'

interface ConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: Config
  onSave: (config: Config) => void
}

export function ConfigDialog({ open, onOpenChange, config, onSave }: ConfigDialogProps) {
  const [defaultMaxPoints, setDefaultMaxPoints] = useState(config.defaultMaxPoints.toString())
  const [percentagePerPoint, setPercentagePerPoint] = useState(config.percentagePerPoint.toString())
  const [passingPercentage, setPassingPercentage] = useState(config.passingPercentage.toString())
  const [showJsonInExportImport, setShowJsonInExportImport] = useState(config.showJsonInExportImport ?? false)
  const [roundingType, setRoundingType] = useState<RoundingType>(config.roundingType || 'standard')

  // Actualizar estado cuando cambia el config
  useEffect(() => {
    setDefaultMaxPoints(config.defaultMaxPoints.toString())
    setPercentagePerPoint(config.percentagePerPoint.toString())
    setPassingPercentage(config.passingPercentage.toString())
    setShowJsonInExportImport(config.showJsonInExportImport ?? false)
    setRoundingType(config.roundingType || 'standard')
  }, [config])

  const handleSave = () => {
    const maxPoints = parseFloat(defaultMaxPoints)
    const perPoint = parseFloat(percentagePerPoint)
    const passing = parseFloat(passingPercentage)

    if (maxPoints > 0 && perPoint > 0 && passing > 0 && passing <= 100) {
      onSave({
        defaultMaxPoints: maxPoints,
        percentagePerPoint: perPoint,
        passingPercentage: passing,
        showJsonInExportImport,
        roundingType
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
          <DialogDescription>
            Ajusta los parámetros de cálculo de notas
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="default-max-points">Puntos máximos por defecto</Label>
            <Input
              id="default-max-points"
              type="number"
              value={defaultMaxPoints}
              onChange={(e) => setDefaultMaxPoints(e.target.value)}
              min="1"
              step="0.5"
            />
            <p className="text-xs text-muted-foreground">
              Valor predeterminado para nuevas evaluaciones
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="percentage-per-point">Porcentaje por punto</Label>
            <Input
              id="percentage-per-point"
              type="number"
              value={percentagePerPoint}
              onChange={(e) => setPercentagePerPoint(e.target.value)}
              min="0.1"
              step="0.1"
            />
            <p className="text-xs text-muted-foreground">
              Cada X% representa un punto en la nota final
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="passing-percentage">Porcentaje mínimo para aprobar</Label>
            <Input
              id="passing-percentage"
              type="number"
              value={passingPercentage}
              onChange={(e) => setPassingPercentage(e.target.value)}
              min="1"
              max="100"
              step="1"
            />
            <p className="text-xs text-muted-foreground">
              Porcentaje mínimo requerido para aprobar una materia
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rounding-type">Tipo de redondeo</Label>
            <Select value={roundingType} onValueChange={(value) => setRoundingType(value as RoundingType)}>
              <SelectTrigger id="rounding-type">
                <SelectValue placeholder="Selecciona el tipo de redondeo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Estándar (redondeo normal)</SelectItem>
                <SelectItem value="floor">Piso (redondeo hacia abajo)</SelectItem>
                <SelectItem value="ceil">Techo (redondeo hacia arriba)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Método de redondeo para cálculos de notas finales. Algunas universidades requieren piso o techo en lugar de redondeo estándar. Por ejemplo, con piso, 14.7 puntos se redondea a 14; con techo, se redondea a 15; con estándar, se redondea a 15.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
            <Checkbox
              id="show-json"
              checked={showJsonInExportImport}
              onCheckedChange={(checked) => setShowJsonInExportImport(checked as boolean)}
            />
            <Label htmlFor="show-json" className="cursor-pointer">
              Mostrar JSON en exportar/importar
            </Label>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            Si está activo, se mostrará el JSON directamente en lugar del resumen visual
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
