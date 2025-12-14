import { useState } from 'react'
import { Subject, CalculationResult, CalculationMode, Config, Evaluation } from '../types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import { Plus, Calendar, Percent, PencilSimple, Trash, Question } from '@phosphor-icons/react'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'
import { validateWeights, percentageToPoints } from '../lib/calculations'
import { ProgressVisualization } from './ProgressVisualization'
import { HistoricalChart } from './HistoricalChart'

interface SubjectViewProps {
  subject: Subject
  calculation: CalculationResult
  config: Config
  onAddEvaluation: () => void
  onEditEvaluation: (evaluation: Evaluation) => void
  onDeleteEvaluation: (evaluationId: string) => void
  onUpdateNote: (evaluationId: string, points: number | undefined) => void
  calculationMode: CalculationMode
  onCalculationModeChange: (mode: CalculationMode) => void
}

export function SubjectView({
  subject,
  calculation,
  config,
  onAddEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
  onUpdateNote,
  calculationMode,
  onCalculationModeChange
}: SubjectViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [evaluationToDelete, setEvaluationToDelete] = useState<Evaluation | null>(null)
  
  const validation = validateWeights(subject)
  
  const getRequiredNote = (evalId: string) => {
    const req = calculation.requiredNotes.find(r => r.evaluationId === evalId)
    if (!req) return null
    return req[calculationMode]
  }

  const formatNote = (points: number, maxPoints: number) => {
    return `${points.toFixed(1)}/${maxPoints}`
  }

  const evaluatedWeight = subject.evaluations
    .filter(e => e.obtainedPoints !== undefined)
    .reduce((sum, e) => sum + e.weight, 0)

  const evaluatedTheoryWeight = subject.evaluations
    .filter(e => e.obtainedPoints !== undefined && e.section === 'theory')
    .reduce((sum, e) => sum + e.weight, 0)

  const evaluatedPracticeWeight = subject.evaluations
    .filter(e => e.obtainedPoints !== undefined && e.section === 'practice')
    .reduce((sum, e) => sum + e.weight, 0)

  const hasCompletedEvaluations = subject.evaluations.some(
    e => e.obtainedPoints !== undefined && e.date
  )

  const handleDeleteClick = (evaluation: Evaluation) => {
    setEvaluationToDelete(evaluation)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (evaluationToDelete) {
      onDeleteEvaluation(evaluationToDelete.id)
      setDeleteDialogOpen(false)
      setEvaluationToDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold">{subject.name}</h1>
            {subject.hasSplit && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge variant="outline" className="text-xs">
                  Teoría {subject.theoryWeight}%
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Práctica {subject.practiceWeight}%
                </Badge>
              </div>
            )}
          </div>
          <Button onClick={onAddEvaluation} className="w-full sm:w-auto">
            <Plus className="mr-2" />
            Agregar Evaluación
          </Button>
        </div>

        {!validation.isValid && (
          <Alert variant="destructive">
            <AlertDescription>{validation.message}</AlertDescription>
          </Alert>
        )}

        <ProgressVisualization
          subject={subject}
          config={config}
          currentPercentage={calculation.currentPercentage}
          currentTheoryPercentage={calculation.currentTheoryPercentage}
          currentPracticePercentage={calculation.currentPracticePercentage}
          evaluatedWeight={evaluatedWeight}
          evaluatedTheoryWeight={evaluatedTheoryWeight}
          evaluatedPracticeWeight={evaluatedPracticeWeight}
        />

        {hasCompletedEvaluations && (
          <HistoricalChart subject={subject} config={config} />
        )}
      </div>

      {subject.evaluations.length > 0 && (
        <Tabs value={calculationMode} onValueChange={(v) => onCalculationModeChange(v as CalculationMode)}>
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="pessimistic" className="flex items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Pesimista</span>
              <span className="sm:hidden">Pesim.</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full p-0.5 hover:bg-muted/50 transition-colors hidden sm:block"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Question size={14} className="text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-semibold mb-1">Modo Pesimista</p>
                  <p className="text-xs">
                    Calcula la nota mínima necesaria para aprobar. Asume que obtendrás el mínimo en todas las evaluaciones restantes.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="normal" className="flex items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-sm py-2 px-1 sm:px-3">
              Normal
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full p-0.5 hover:bg-muted/50 transition-colors hidden sm:block"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Question size={14} className="text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-semibold mb-1">Modo Normal</p>
                  <p className="text-xs">
                    Proyecta basándose en tu rendimiento actual. Considera tu promedio y el peso de cada evaluación.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="optimistic" className="flex items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Optimista</span>
              <span className="sm:hidden">Optim.</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full p-0.5 hover:bg-muted/50 transition-colors hidden sm:block"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Question size={14} className="text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-semibold mb-1">Modo Optimista</p>
                  <p className="text-xs">
                    Calcula para alcanzar una meta ambiciosa. Asume que obtendrás buenas notas en las evaluaciones restantes.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={calculationMode} className="mt-3 sm:mt-4">
            <div className="flex flex-col gap-2 sm:gap-3">
              {[...subject.evaluations]
                .sort((a, b) => {
                  // Ordenar por fecha (las que no tienen fecha van al final)
                  if (!a.date && !b.date) return 0
                  if (!a.date) return 1
                  if (!b.date) return -1
                  return new Date(a.date).getTime() - new Date(b.date).getTime()
                })
                .map((evaluation) => (
                <Card key={evaluation.id} className="p-3 sm:p-4">
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{evaluation.name}</h3>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onEditEvaluation(evaluation)}
                            >
                              <PencilSimple size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(evaluation)}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                          {evaluation.date && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="sm:hidden" />
                              <Calendar size={14} className="hidden sm:block" />
                              <span className="hidden sm:inline">{new Date(evaluation.date).toLocaleDateString()}</span>
                              <span className="sm:hidden">{new Date(evaluation.date).toLocaleDateString('es', { day: '2-digit', month: '2-digit' })}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Percent size={12} className="sm:hidden" />
                            <Percent size={14} className="hidden sm:block" />
                            {evaluation.weight}%
                          </div>
                          {evaluation.section && (
                            <Badge variant="secondary" className="text-xs py-0 px-1.5">
                              {evaluation.section === 'theory' ? 'T' : 'P'}
                              <span className="hidden sm:inline">{evaluation.section === 'theory' ? 'eoría' : 'ráctica'}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Nota Obtenida</span>
                        <Input
                          type="number"
                          placeholder={`0-${evaluation.maxPoints}`}
                          value={evaluation.obtainedPoints ?? ''}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value === '') {
                              onUpdateNote(evaluation.id, undefined)
                            } else {
                              const num = parseFloat(value)
                              if (num >= 0 && num <= evaluation.maxPoints) {
                                onUpdateNote(evaluation.id, num)
                              }
                            }
                          }}
                          className="font-data"
                          step="0.5"
                          min="0"
                          max={evaluation.maxPoints}
                        />
                      </div>

                      {evaluation.obtainedPoints === undefined && getRequiredNote(evaluation.id) !== null && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">Nota Necesaria</span>
                          <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
                            <span className="font-data font-semibold text-primary">
                              {formatNote(getRequiredNote(evaluation.id)!, evaluation.maxPoints)}
                            </span>
                          </div>
                        </div>
                      )}

                      {evaluation.obtainedPoints !== undefined && (
                        <>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Porcentaje Obtenido</span>
                            <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
                              <span className="font-data font-semibold">
                                {((evaluation.obtainedPoints / evaluation.maxPoints) * evaluation.weight).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Puntos Obtenidos</span>
                            <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
                              <span className="font-data font-semibold text-accent">
                                {percentageToPoints(
                                  (evaluation.obtainedPoints / evaluation.maxPoints) * evaluation.weight,
                                  config.percentagePerPoint,
                                  config.roundingType
                                )} pts
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {subject.evaluations.length === 0 && (
        <Card className="p-6 sm:p-8 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">No hay evaluaciones registradas</p>
          <Button onClick={onAddEvaluation} variant="outline" className="w-full sm:w-auto">
            <Plus className="mr-2" />
            Agregar primera evaluación
          </Button>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evaluación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la evaluación
              {evaluationToDelete && <strong className="block mt-1">&quot;{evaluationToDelete.name}&quot;</strong>}
              de esta materia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
