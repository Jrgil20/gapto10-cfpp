import { Subject, Config } from '../types'
import { Card } from './ui/card'
import { Target } from '@phosphor-icons/react'
import { ProgressBar } from './ProgressBar'
import { StatusIndicator } from './StatusIndicator'
import { getProgressStatus, percentageToPoints } from '../lib/calculations'

interface ProgressVisualizationProps {
  subject: Subject
  config: Config
  currentPercentage: number
  currentTheoryPercentage?: number
  currentPracticePercentage?: number
  evaluatedWeight: number
  evaluatedTheoryWeight?: number
  evaluatedPracticeWeight?: number
}

/**
 * Visualización completa del progreso de una materia.
 * Incluye barra de progreso general y desglose por teoría/práctica si aplica.
 */
export function ProgressVisualization({
  subject,
  config,
  currentPercentage,
  currentTheoryPercentage,
  currentPracticePercentage,
  evaluatedWeight,
  evaluatedTheoryWeight,
  evaluatedPracticeWeight
}: ProgressVisualizationProps) {
  const passingPoint = config.passingPercentage
  const currentPoints = (currentPercentage / config.percentagePerPoint).toFixed(1)
  const totalPoints = (100 / config.percentagePerPoint).toFixed(0)
  
  const isApproved = currentPercentage >= passingPoint
  
  // Calcular objetivos de teoría y práctica
  const theoryTarget = subject.hasSplit && subject.theoryWeight
    ? (subject.theoryWeight * config.passingPercentage) / 100
    : 0
  const practiceTarget = subject.hasSplit && subject.practiceWeight
    ? (subject.practiceWeight * config.passingPercentage) / 100
    : 0

  const theoryApproved = subject.hasSplit && currentTheoryPercentage !== undefined
    ? currentTheoryPercentage >= theoryTarget
    : true
  const practiceApproved = subject.hasSplit && currentPracticePercentage !== undefined
    ? currentPracticePercentage >= practiceTarget
    : true

  // Para materias con split, verificar si es imposible aprobar teoría o práctica por separado
  let statusInfo
  if (subject.hasSplit && subject.theoryWeight && subject.practiceWeight) {
    const theoryStatus = getProgressStatus({
      current: currentTheoryPercentage || 0,
      evaluated: evaluatedTheoryWeight || 0,
      passingPoint: theoryTarget,
      target: subject.theoryWeight,
      label: 'Teoría'
    })
    
    const practiceStatus = getProgressStatus({
      current: currentPracticePercentage || 0,
      evaluated: evaluatedPracticeWeight || 0,
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
        current: currentPercentage,
        evaluated: evaluatedWeight,
        passingPoint,
        target: 100
      })
    }
  } else {
    // Para materias sin split, usar la lógica normal
    statusInfo = getProgressStatus({
      current: currentPercentage,
      evaluated: evaluatedWeight,
      passingPoint,
      target: 100
    })
  }

  // Contar evaluaciones completadas (incluyendo sub-evaluaciones)
  const completedEvaluations = subject.evaluations.reduce((count, e) => {
    if (e.isSummative && e.subEvaluations && e.subEvaluations.length > 0) {
      // Para evaluaciones sumativas, contar sub-evaluaciones completadas
      return count + e.subEvaluations.filter(sub => sub.obtainedPoints !== undefined).length
    } else if (e.obtainedPoints !== undefined) {
      // Para evaluaciones normales, contar como 1
      return count + 1
    }
    return count
  }, 0)
  
  // Contar total de evaluaciones (incluyendo sub-evaluaciones)
  const totalEvaluations = subject.evaluations.reduce((count, e) => {
    if (e.isSummative && e.subEvaluations && e.subEvaluations.length > 0) {
      // Para evaluaciones sumativas, contar todas las sub-evaluaciones
      return count + e.subEvaluations.length
    }
    // Para evaluaciones normales, contar como 1
    return count + 1
  }, 0)

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Encabezado con puntos y estado */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-base sm:text-lg font-semibold">Nota Acumulada</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {totalEvaluations} evaluaciones • {completedEvaluations} completadas
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
            <div className="flex flex-col items-start sm:items-end gap-0.5 sm:gap-1">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="font-data text-2xl sm:text-3xl font-bold text-primary">
                  {currentPoints}
                </span>
                <span className="text-xs sm:text-base text-muted-foreground">/ {totalPoints} pts</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Por evaluar: <span className="font-data font-medium">{percentageToPoints(
                  100 - evaluatedWeight,
                  config.percentagePerPoint,
                  config.roundingType
                ).toFixed(1)}</span> pts
              </span>
            </div>
            <StatusIndicator 
              statusInfo={statusInfo}
              size="lg"
              highEvaluatedWeight={evaluatedWeight > 0 ? (currentPercentage / evaluatedWeight) * 100 >= 75 : false}
            />
          </div>
        </div>

        {/* Barras de progreso */}
        <div className="flex flex-col gap-4">
          {!subject.hasSplit ? (
            <ProgressBar
              label="Progreso Total"
              current={currentPercentage}
              evaluated={evaluatedWeight}
              passingPoint={passingPoint}
              target={100}
            />
          ) : (
            <>
              <ProgressBar
                label="Teoría"
                current={currentTheoryPercentage || 0}
                evaluated={evaluatedTheoryWeight || 0}
                passingPoint={theoryTarget}
                target={subject.theoryWeight || 100}
                isApproved={theoryApproved}
              />
              
              <ProgressBar
                label="Práctica"
                current={currentPracticePercentage || 0}
                evaluated={evaluatedPracticeWeight || 0}
                passingPoint={practiceTarget}
                target={subject.practiceWeight || 100}
                isApproved={practiceApproved}
              />

              <div className="pt-2 border-t">
                <ProgressBar
                  label="Total Combinado"
                  current={currentPercentage}
                  evaluated={evaluatedWeight}
                  passingPoint={passingPoint}
                  target={100}
                  isTotal
                  isApproved={isApproved}
                />
              </div>
            </>
          )}
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-accent" />
            <span className="text-muted-foreground">Obtenido</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-muted" />
            <span className="text-muted-foreground">Por evaluar</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Target size={14} className="text-primary sm:hidden" weight="fill" />
            <Target size={16} className="text-primary hidden sm:block" weight="fill" />
            <span className="text-muted-foreground">Mín. aprobar</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
