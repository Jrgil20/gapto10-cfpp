import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Evaluation, Subject } from '../types'

interface EvaluationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (evaluation: Omit<Evaluation, 'id'>) => void
  subject: Subject
  evaluation?: Evaluation
  defaultMaxPoints: number
}

export function EvaluationDialog({
  open,
  onOpenChange,
  onSave,
  subject,
  evaluation,
  defaultMaxPoints
}: EvaluationDialogProps) {
  const [name, setName] = useState(evaluation?.name || '')
  const [date, setDate] = useState(evaluation?.date || '')
  const [weight, setWeight] = useState(evaluation?.weight?.toString() || '')
  const [maxPoints, setMaxPoints] = useState(evaluation?.maxPoints?.toString() || defaultMaxPoints.toString())
  const [section, setSection] = useState<'theory' | 'practice' | undefined>(evaluation?.section)

  const handleSave = () => {
    if (!name.trim() || !weight || !maxPoints) return

    const weightNum = parseFloat(weight)
    const maxPointsNum = parseFloat(maxPoints)

    if (weightNum <= 0 || maxPointsNum <= 0) return

    onSave({
      name: name.trim(),
      date: date || new Date().toISOString().split('T')[0],
      weight: weightNum,
      maxPoints: maxPointsNum,
      obtainedPoints: evaluation?.obtainedPoints,
      section: subject.hasSplit ? section : undefined
    })

    setName('')
    setDate('')
    setWeight('')
    setMaxPoints(defaultMaxPoints.toString())
    setSection(undefined)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{evaluation ? 'Editar Evaluación' : 'Nueva Evaluación'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="eval-name">Nombre de la evaluación</Label>
            <Input
              id="eval-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Examen Parcial 1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="eval-date">Fecha</Label>
            <Input
              id="eval-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="eval-weight">Peso (%)</Label>
              <Input
                id="eval-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ej: 30"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="eval-max-points">Puntos máximos</Label>
              <Input
                id="eval-max-points"
                type="number"
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
                placeholder="20"
                min="1"
                step="0.5"
              />
            </div>
          </div>

          {subject.hasSplit && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="eval-section">Sección</Label>
              <Select value={section} onValueChange={(v) => setSection(v as 'theory' | 'practice')}>
                <SelectTrigger id="eval-section">
                  <SelectValue placeholder="Selecciona sección" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theory">Teoría</SelectItem>
                  <SelectItem value="practice">Práctica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
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
