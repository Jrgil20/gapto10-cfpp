import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Evaluation, Subject } from '../types'

interface EvaluationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (evaluation: Omit<Evaluation, 'id'>) => void
  subject: Subject
  evaluation?: Evaluation
  defaultMaxPoints: number
}

interface MultipleEvaluation {
  weight: string
  date: string
}

export function EvaluationDialog({
  open,
  onOpenChange,
  onSave,
  subject,
  evaluation,
  defaultMaxPoints
}: EvaluationDialogProps) {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [weight, setWeight] = useState('')
  const [maxPoints, setMaxPoints] = useState(defaultMaxPoints.toString())
  const [section, setSection] = useState<'theory' | 'practice' | undefined>(undefined)
  const [isMultiple, setIsMultiple] = useState(false)
  const [multipleCount, setMultipleCount] = useState('2')
  const [sameWeight, setSameWeight] = useState(true)
  const [multipleEvals, setMultipleEvals] = useState<MultipleEvaluation[]>([])

  useEffect(() => {
    if (open) {
      if (evaluation) {
        setName(evaluation.name)
        setDate(evaluation.date)
        setWeight(evaluation.weight.toString())
        setMaxPoints(evaluation.maxPoints.toString())
        setSection(evaluation.section)
        setIsMultiple(false)
        setMultipleCount('2')
        setSameWeight(true)
        setMultipleEvals([])
      } else {
        setName('')
        setDate('')
        setWeight('')
        setMaxPoints(defaultMaxPoints.toString())
        setSection(undefined)
        setIsMultiple(false)
        setMultipleCount('2')
        setSameWeight(true)
        setMultipleEvals([])
      }
    }
  }, [open, evaluation, defaultMaxPoints])

  useEffect(() => {
    if (isMultiple && !evaluation) {
      const count = parseInt(multipleCount) || 2
      const defaultDate = date || new Date().toISOString().split('T')[0]
      setMultipleEvals((current) => {
        const newEvals = Array.from({ length: count }, (_, i) => {
          const existingEval = current[i]
          return {
            weight: existingEval?.weight || weight || '',
            date: existingEval?.date || defaultDate
          }
        })
        return newEvals
      })
    }
  }, [isMultiple, multipleCount, date, evaluation])

  useEffect(() => {
    if (isMultiple && sameWeight && !evaluation && weight) {
      setMultipleEvals((current) =>
        current.map((eval_) => ({ ...eval_, weight }))
      )
    }
  }, [weight, sameWeight, isMultiple, evaluation])

  const updateMultipleEval = (index: number, field: 'weight' | 'date', value: string) => {
    setMultipleEvals((current) =>
      current.map((eval_, i) => (i === index ? { ...eval_, [field]: value } : eval_))
    )
  }

  const handleSave = () => {
    if (!name.trim() || !maxPoints) return
    
    const maxPointsNum = parseFloat(maxPoints)
    if (maxPointsNum <= 0) return

    if (isMultiple && !evaluation) {
      const count = parseInt(multipleCount) || 2
      
      for (let i = 0; i < count; i++) {
        const evalWeight = sameWeight ? weight : multipleEvals[i]?.weight
        const evalDate = multipleEvals[i]?.date || date || new Date().toISOString().split('T')[0]
        
        if (!evalWeight) continue
        
        const weightNum = parseFloat(evalWeight)
        if (weightNum <= 0) continue

        onSave({
          name: `${name.trim()} ${i + 1}`,
          date: evalDate,
          weight: weightNum,
          maxPoints: maxPointsNum,
          section: subject.hasSplit ? section : undefined
        })
      }
    } else {
      if (!weight) return
      
      const weightNum = parseFloat(weight)
      if (weightNum <= 0) return

      onSave({
        name: name.trim(),
        date: date || new Date().toISOString().split('T')[0],
        weight: weightNum,
        maxPoints: maxPointsNum,
        obtainedPoints: evaluation?.obtainedPoints,
        section: subject.hasSplit ? section : undefined
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
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
              placeholder="Ej: Examen Parcial"
            />
          </div>

          {!evaluation && (
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
              <Checkbox
                id="is-multiple"
                checked={isMultiple}
                onCheckedChange={(checked) => setIsMultiple(checked as boolean)}
              />
              <Label htmlFor="is-multiple" className="cursor-pointer">
                Crear múltiples evaluaciones del mismo tipo
              </Label>
            </div>
          )}

          {isMultiple && !evaluation && (
            <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex flex-col gap-2">
                <Label htmlFor="multiple-count">Cantidad de evaluaciones</Label>
                <Input
                  id="multiple-count"
                  type="number"
                  value={multipleCount}
                  onChange={(e) => setMultipleCount(e.target.value)}
                  min="2"
                  max="10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="same-weight"
                  checked={sameWeight}
                  onCheckedChange={(checked) => setSameWeight(checked as boolean)}
                />
                <Label htmlFor="same-weight" className="cursor-pointer">
                  Mismo porcentaje para todas
                </Label>
              </div>
            </div>
          )}

          {!isMultiple && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="eval-date">Fecha</Label>
              <Input
                id="eval-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-4">
            {(!isMultiple || sameWeight) && (
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
            )}
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

          {isMultiple && !evaluation && !sameWeight && (
            <div className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/30">
              <Label className="font-semibold">Configuración individual</Label>
              {multipleEvals.map((eval_, index) => (
                <div key={index} className="flex flex-col gap-2 p-3 border rounded-lg bg-card">
                  <Label className="text-sm font-medium">{name || 'Evaluación'} {index + 1}</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`weight-${index}`} className="text-xs">Peso (%)</Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        value={eval_.weight}
                        onChange={(e) => updateMultipleEval(index, 'weight', e.target.value)}
                        placeholder="30"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`date-${index}`} className="text-xs">Fecha</Label>
                      <Input
                        id={`date-${index}`}
                        type="date"
                        value={eval_.date}
                        onChange={(e) => updateMultipleEval(index, 'date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isMultiple && !evaluation && sameWeight && (
            <div className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/30">
              <Label className="font-semibold">Fechas individuales</Label>
              {multipleEvals.map((eval_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <Label htmlFor={`date-${index}`} className="text-sm">{name || 'Evaluación'} {index + 1}</Label>
                  <Input
                    id={`date-${index}`}
                    type="date"
                    value={eval_.date}
                    onChange={(e) => updateMultipleEval(index, 'date', e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

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
