import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Subject } from '../types'

interface SubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (subject: Omit<Subject, 'id' | 'evaluations'>) => void
  subject?: Subject
}

export function SubjectDialog({ open, onOpenChange, onSave, subject }: SubjectDialogProps) {
  const [name, setName] = useState(subject?.name || '')
  const [hasSplit, setHasSplit] = useState(subject?.hasSplit || false)
  const [theoryWeight, setTheoryWeight] = useState(subject?.theoryWeight?.toString() || '70')
  const [practiceWeight, setPracticeWeight] = useState(subject?.practiceWeight?.toString() || '30')

  const handleSave = () => {
    if (!name.trim()) return

    const theory = hasSplit ? parseFloat(theoryWeight) : undefined
    const practice = hasSplit ? parseFloat(practiceWeight) : undefined

    if (hasSplit && (!theory || !practice || theory + practice !== 100)) {
      return
    }

    onSave({
      name: name.trim(),
      hasSplit,
      theoryWeight: theory,
      practiceWeight: practice
    })

    setName('')
    setHasSplit(false)
    setTheoryWeight('70')
    setPracticeWeight('30')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subject ? 'Editar Materia' : 'Nueva Materia'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="subject-name">Nombre de la materia</Label>
            <Input
              id="subject-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Matemáticas"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="has-split">División Teoría/Práctica</Label>
            <Switch
              id="has-split"
              checked={hasSplit}
              onCheckedChange={setHasSplit}
            />
          </div>

          {hasSplit && (
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="theory-weight">Peso Teoría (%)</Label>
                <Input
                  id="theory-weight"
                  type="number"
                  value={theoryWeight}
                  onChange={(e) => {
                    setTheoryWeight(e.target.value)
                    setPracticeWeight((100 - parseFloat(e.target.value || '0')).toString())
                  }}
                  min="0"
                  max="100"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="practice-weight">Peso Práctica (%)</Label>
                <Input
                  id="practice-weight"
                  type="number"
                  value={practiceWeight}
                  onChange={(e) => {
                    setPracticeWeight(e.target.value)
                    setTheoryWeight((100 - parseFloat(e.target.value || '0')).toString())
                  }}
                  min="0"
                  max="100"
                />
              </div>
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
