import { Subject, Config } from '../types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Plus } from '@phosphor-icons/react'
import { calculateRequiredNotes, getProgressStatus } from '../lib/calculations'
import { ProgressBar } from './ProgressBar'
import { StatusIndicator } from './StatusIndicator'

interface DashboardProps {
  subjects: Subject[]
  config: Config
  onSelectSubject: (subjectId: string) => void
  onAddSubject: () => void
}

/**
 * Dashboard principal que muestra todas las materias con su progreso.
 */
export function Dashboard({ subjects, config, onSelectSubject, onAddSubject }: DashboardProps) {
  if (!subjects || subjects.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-semibold">Bienvenido</h2>
        <p className="text-muted-foreground max-w-md">
          Comienza creando una materia para gestionar tus evaluaciones y calcular las notas necesarias para aprobar.
        </p>
        <Button onClick={onAddSubject} size="lg">
          <Plus className="mr-2" />
          Crear Primera Materia
        </Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard de Materias</h1>
        <Button onClick={onAddSubject}>
          <Plus className="mr-2" />
          Nueva Materia
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.map((subject) => {
          const calculation = calculateRequiredNotes(subject, config)
          const passingPoint = config.passingPercentage
          const currentPoints = (calculation.currentPercentage / config.percentagePerPoint).toFixed(1)
          const totalPoints = (100 / config.percentagePerPoint).toFixed(0)

          // Calcular peso evaluado
          const evaluatedWeight = subject.evaluations
            .filter(e => e.obtainedPoints !== undefined)
            .reduce((sum, e) => sum + e.weight, 0)

          // Calcular objetivos de teoría y práctica
          const theoryTarget = subject.hasSplit && subject.theoryWeight
            ? (subject.theoryWeight * config.passingPercentage) / 100
            : 0
          const practiceTarget = subject.hasSplit && subject.practiceWeight
            ? (subject.practiceWeight * config.passingPercentage) / 100
            : 0

          const theoryApproved = subject.hasSplit && calculation.currentTheoryPercentage !== undefined
            ? calculation.currentTheoryPercentage >= theoryTarget
            : true
          const practiceApproved = subject.hasSplit && calculation.currentPracticePercentage !== undefined
            ? calculation.currentPracticePercentage >= practiceTarget
            : true

          // Usar utilidad centralizada para obtener estado
          const statusInfo = getProgressStatus({
            current: calculation.currentPercentage,
            evaluated: evaluatedWeight,
            passingPoint,
            target: 100
          })

          return (
            <Card 
              key={subject.id} 
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 hover:border-primary/50"
              onClick={() => onSelectSubject(subject.id)}
            >
              <div className="flex flex-col gap-4">
                {/* Encabezado con nombre y estado */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">{subject.name}</h2>
                    {subject.hasSplit && (
                      <div className="flex gap-2">
                        <Badge variant="outline" className={theoryApproved ? "border-accent/50" : "border-destructive/50"}>
                          Teoría {subject.theoryWeight}%
                        </Badge>
                        <Badge variant="outline" className={practiceApproved ? "border-accent/50" : "border-destructive/50"}>
                          Práctica {subject.practiceWeight}%
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {subject.evaluations.length} evaluaciones • {subject.evaluations.filter(e => e.obtainedPoints !== undefined).length} completadas
                    </p>
                  </div>
                  <StatusIndicator 
                    statusInfo={statusInfo}
                    size="lg"
                    highEvaluatedWeight={evaluatedWeight >= 75}
                  />
                </div>

                {/* Puntos y porcentaje */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-data text-2xl font-bold text-primary">
                      {currentPoints}
                    </span>
                    <span className="text-muted-foreground">/ {totalPoints} pts</span>
                    <span className="font-data text-lg text-muted-foreground ml-auto">
                      {calculation.currentPercentage.toFixed(1)}%
                    </span>
                  </div>

                  {/* Barra de progreso compacta */}
                  <div className="mt-2">
                    {!subject.hasSplit ? (
                      <ProgressBar
                        current={calculation.currentPercentage}
                        evaluated={evaluatedWeight}
                        passingPoint={passingPoint}
                        target={100}
                        compact
                        showLabels={false}
                      />
                    ) : (
                      <div className="flex flex-col gap-3">
                        {/* Progreso de Teoría */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Teoría</span>
                            <span className="font-data text-xs">
                              {calculation.currentTheoryPercentage?.toFixed(1)}%
                            </span>
                          </div>
                          <ProgressBar
                            current={calculation.currentTheoryPercentage || 0}
                            evaluated={subject.evaluations
                              .filter(e => e.obtainedPoints !== undefined && e.section === 'theory')
                              .reduce((sum, e) => sum + e.weight, 0)}
                            passingPoint={theoryTarget}
                            target={subject.theoryWeight || 100}
                            compact
                            showLabels={false}
                          />
                        </div>

                        {/* Progreso de Práctica */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Práctica</span>
                            <span className="font-data text-xs">
                              {calculation.currentPracticePercentage?.toFixed(1)}%
                            </span>
                          </div>
                          <ProgressBar
                            current={calculation.currentPracticePercentage || 0}
                            evaluated={subject.evaluations
                              .filter(e => e.obtainedPoints !== undefined && e.section === 'practice')
                              .reduce((sum, e) => sum + e.weight, 0)}
                            passingPoint={practiceTarget}
                            target={subject.practiceWeight || 100}
                            compact
                            showLabels={false}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
