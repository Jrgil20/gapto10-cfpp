import { Subject, CalculationResult, CalculationMode, Config } from '../types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import { Alert, AlertDescription } from './ui/alert'
import { Plus, Calendar, Percent, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { validateWeights } from '../lib/calculations'

interface SubjectViewProps {
  subject: Subject
  calculation: CalculationResult
  config: Config
  onAddEvaluation: () => void
  onUpdateNote: (evaluationId: string, points: number | undefined) => void
  calculationMode: CalculationMode
  onCalculationModeChange: (mode: CalculationMode) => void
}

export function SubjectView({
  subject,
  calculation,
  config,
  onAddEvaluation,
  onUpdateNote,
  calculationMode,
  onCalculationModeChange
}: SubjectViewProps) {
  const validation = validateWeights(subject)
  
  const getRequiredNote = (evalId: string) => {
    const req = calculation.requiredNotes.find(r => r.evaluationId === evalId)
    if (!req) return null
    return req[calculationMode]
  }

  const formatNote = (points: number, maxPoints: number) => {
    return `${points.toFixed(1)}/${maxPoints}`
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{subject.name}</h1>
            {subject.hasSplit && (
              <div className="flex gap-2">
                <Badge variant="outline">
                  Teoría {subject.theoryWeight}%
                </Badge>
                <Badge variant="outline">
                  Práctica {subject.practiceWeight}%
                </Badge>
              </div>
            )}
          </div>
          <Button onClick={onAddEvaluation}>
            <Plus className="mr-2" />
            Agregar Evaluación
          </Button>
        </div>

        {!validation.isValid && (
          <Alert variant="destructive">
            <WarningCircle className="h-4 w-4" />
            <AlertDescription>{validation.message}</AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <div className="flex flex-col gap-4">
            {subject.hasSplit ? (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Teoría</span>
                    <div className="flex items-center gap-2">
                      <span className="font-data text-lg">
                        {calculation.currentTheoryPercentage?.toFixed(1)}%
                      </span>
                      {calculation.theoryApproved ? (
                        <CheckCircle className="text-accent" weight="fill" />
                      ) : (
                        <WarningCircle className="text-destructive" weight="fill" />
                      )}
                    </div>
                  </div>
                  <Progress value={calculation.currentTheoryPercentage} className="h-2" />
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Práctica</span>
                    <div className="flex items-center gap-2">
                      <span className="font-data text-lg">
                        {calculation.currentPracticePercentage?.toFixed(1)}%
                      </span>
                      {calculation.practiceApproved ? (
                        <CheckCircle className="text-accent" weight="fill" />
                      ) : (
                        <WarningCircle className="text-destructive" weight="fill" />
                      )}
                    </div>
                  </div>
                  <Progress value={calculation.currentPracticePercentage} className="h-2" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <div className="flex items-center gap-2">
                    <span className="font-data text-xl font-bold">
                      {calculation.currentPercentage.toFixed(1)}%
                    </span>
                    {calculation.isApproved ? (
                      <CheckCircle className="text-accent" weight="fill" size={24} />
                    ) : (
                      <WarningCircle className="text-destructive" weight="fill" size={24} />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Porcentaje Actual</span>
                  <div className="flex items-center gap-2">
                    <span className="font-data text-xl font-bold">
                      {calculation.currentPercentage.toFixed(1)}%
                    </span>
                    {calculation.isApproved ? (
                      <CheckCircle className="text-accent" weight="fill" size={24} />
                    ) : (
                      <WarningCircle className="text-destructive" weight="fill" size={24} />
                    )}
                  </div>
                </div>
                <Progress value={calculation.currentPercentage} className="h-2" />
              </div>
            )}
          </div>
        </Card>
      </div>

      {subject.evaluations.length > 0 && (
        <Tabs value={calculationMode} onValueChange={(v) => onCalculationModeChange(v as CalculationMode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pessimistic">Pesimista</TabsTrigger>
            <TabsTrigger value="normal">Normal</TabsTrigger>
            <TabsTrigger value="optimistic">Optimista</TabsTrigger>
          </TabsList>

          <TabsContent value={calculationMode} className="mt-4">
            <div className="flex flex-col gap-3">
              {subject.evaluations.map((evaluation) => (
                <Card key={evaluation.id} className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">{evaluation.name}</h3>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          {evaluation.date && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(evaluation.date).toLocaleDateString()}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Percent size={14} />
                            {evaluation.weight}%
                          </div>
                          {evaluation.section && (
                            <Badge variant="secondary" className="text-xs">
                              {evaluation.section === 'theory' ? 'Teoría' : 'Práctica'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">Porcentaje Obtenido</span>
                          <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
                            <span className="font-data font-semibold">
                              {((evaluation.obtainedPoints / evaluation.maxPoints) * evaluation.weight).toFixed(2)}%
                            </span>
                          </div>
                        </div>
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
        <Card className="p-8 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-muted-foreground">No hay evaluaciones registradas</p>
          <Button onClick={onAddEvaluation} variant="outline">
            <Plus className="mr-2" />
            Agregar primera evaluación
          </Button>
        </Card>
      )}
    </div>
  )
}
