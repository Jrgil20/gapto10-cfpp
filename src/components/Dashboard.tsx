import { Subject, Config } from '../types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Plus } from '@phosphor-icons/react'
import { calculateRequiredNotes, getProgressStatus, percentageToPoints } from '../lib/calculations'
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
      <Card className="p-6 sm:p-12 flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold">Bienvenido</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md">
          Comienza creando una materia para gestionar tus evaluaciones y calcular las notas necesarias para aprobar.
        </p>
        <Button onClick={onAddSubject} size="lg" className="w-full sm:w-auto">
          <Plus className="mr-2" />
          Crear Primera Materia
        </Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard de Materias</h1>
        <Button onClick={onAddSubject} className="w-full sm:w-auto">
          <Plus className="mr-2" />
          Nueva Materia
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {subjects.map((subject) => {
          const calculation = calculateRequiredNotes(subject, config)
          const passingPoint = config.passingPercentage

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

          // Para materias con split, verificar si es imposible aprobar teoría o práctica por separado
          let statusInfo
          if (subject.hasSplit && subject.theoryWeight && subject.practiceWeight) {
            const evaluatedTheoryWeight = subject.evaluations
              .filter(e => e.obtainedPoints !== undefined && e.section === 'theory')
              .reduce((sum, e) => sum + e.weight, 0)
            
            const evaluatedPracticeWeight = subject.evaluations
              .filter(e => e.obtainedPoints !== undefined && e.section === 'practice')
              .reduce((sum, e) => sum + e.weight, 0)
            
            const theoryStatus = getProgressStatus({
              current: calculation.currentTheoryPercentage || 0,
              evaluated: evaluatedTheoryWeight,
              passingPoint: theoryTarget,
              target: subject.theoryWeight,
              label: 'Teoría'
            })
            
            const practiceStatus = getProgressStatus({
              current: calculation.currentPracticePercentage || 0,
              evaluated: evaluatedPracticeWeight,
              passingPoint: practiceTarget,
              target: subject.practiceWeight,
              label: 'Práctica'
            })
            
            // Si alguna sección es imposible de aprobar, el estado general es imposible
            if (theoryStatus.status === 'impossible' || practiceStatus.status === 'impossible') {
              statusInfo = {
                status: 'impossible' as const,
                label: 'Imposible aprobar',
                details: theoryStatus.status === 'impossible' 
                  ? `No es posible aprobar la teoría. ${theoryStatus.details}`
                  : `No es posible aprobar la práctica. ${practiceStatus.details}`
              }
            } else {
              // Si ambas secciones pueden aprobarse, verificar el total combinado
              statusInfo = getProgressStatus({
                current: calculation.currentPercentage,
                evaluated: evaluatedWeight,
                passingPoint,
                target: 100
              })
            }
          } else {
            // Para materias sin split, usar la lógica normal
            statusInfo = getProgressStatus({
              current: calculation.currentPercentage,
              evaluated: evaluatedWeight,
              passingPoint,
              target: 100
            })
          }

          const currentPoints = percentageToPoints(
            calculation.currentPercentage,
            config.percentagePerPoint,
            config.roundingType
          ).toFixed(1)
          const totalPoints = percentageToPoints(
            100,
            config.percentagePerPoint,
            config.roundingType
          ).toFixed(0)

          return (
            <Card 
              key={subject.id} 
              className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 hover:border-primary/50"
              onClick={() => onSelectSubject(subject.id)}
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Encabezado con nombre y estado */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-2 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold truncate">{subject.name}</h2>
                    {subject.hasSplit && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <Badge variant="outline" className={`text-xs ${theoryApproved ? "border-accent/50" : "border-destructive/50"}`}>
                          Teoría {subject.theoryWeight}%
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${practiceApproved ? "border-accent/50" : "border-destructive/50"}`}>
                          Práctica {subject.practiceWeight}%
                        </Badge>
                      </div>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {subject.evaluations.length} evaluaciones • {subject.evaluations.filter(e => e.obtainedPoints !== undefined).length} completadas
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                    <div className="flex flex-col items-start sm:items-end gap-0.5 sm:gap-1">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="font-data text-xl sm:text-2xl font-bold text-primary">
                          {currentPoints}
                        </span>
                        <span className="text-muted-foreground text-xs sm:text-sm">/ {totalPoints} pts</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Por evaluar: <span className="font-data font-medium">{percentageToPoints(
                          100 - evaluatedWeight,
                          config.percentagePerPoint,
                          config.roundingType
                        )}</span> pts
                      </span>
                    </div>
                    <StatusIndicator 
                      statusInfo={statusInfo}
                      size="lg"
                      highEvaluatedWeight={evaluatedWeight >= 75}
                    />
                  </div>
                </div>

                {/* Barra de progreso completa */}
                <div>
                  {!subject.hasSplit ? (
                      <ProgressBar
                        label="Progreso Total"
                        current={calculation.currentPercentage}
                        evaluated={evaluatedWeight}
                        passingPoint={passingPoint}
                        target={100}
                      />
                    ) : (
                      <div className="flex flex-col gap-4">
                        {/* Progreso de Teoría */}
                        <ProgressBar
                          label="Teoría"
                          current={calculation.currentTheoryPercentage || 0}
                          evaluated={subject.evaluations
                            .filter(e => e.obtainedPoints !== undefined && e.section === 'theory')
                            .reduce((sum, e) => sum + e.weight, 0)}
                          passingPoint={theoryTarget}
                          target={subject.theoryWeight || 100}
                          isApproved={theoryApproved}
                        />

                        {/* Progreso de Práctica */}
                        <ProgressBar
                          label="Práctica"
                          current={calculation.currentPracticePercentage || 0}
                          evaluated={subject.evaluations
                            .filter(e => e.obtainedPoints !== undefined && e.section === 'practice')
                            .reduce((sum, e) => sum + e.weight, 0)}
                          passingPoint={practiceTarget}
                          target={subject.practiceWeight || 100}
                          isApproved={practiceApproved}
                        />
                      </div>
                    )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
