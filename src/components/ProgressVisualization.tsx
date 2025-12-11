import { Subject, Config } from '../types'
import { Card } from './ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { CheckCircle, WarningCircle, Target, X, Check } from '@phosphor-icons/react'

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

function getStatusInfo(
  currentPercentage: number,
  evaluatedWeight: number,
  percentageOfEvaluated: number,
  passingPoint: number,
  canStillPass: boolean,
  remainingWeight: number
) {
  if (evaluatedWeight === 0) {
    return {
      icon: <WarningCircle className="text-muted-foreground" weight="fill" size={32} />,
      status: 'Sin evaluaciones',
      details: 'No hay evaluaciones completadas aún'
    }
  }

  const neededFromRemaining = Math.max(0, passingPoint - currentPercentage)
  const neededPercentFromRemaining = remainingWeight > 0 ? (neededFromRemaining / remainingWeight) * 100 : 0

  if (currentPercentage >= passingPoint) {
    const statusIcon = evaluatedWeight >= 75
      ? <Check className="text-accent" weight="bold" size={32} />
      : <Check className="text-orange" weight="bold" size={32} />
    
    return {
      icon: statusIcon,
      status: 'Aprobado',
      details: `Has obtenido ${currentPercentage.toFixed(1)}% de ${evaluatedWeight}% evaluado (${percentageOfEvaluated.toFixed(1)}% de rendimiento).${remainingWeight > 0 ? ` Quedan ${remainingWeight}% por evaluar.` : ''}`
    }
  }

  if (!canStillPass) {
    return {
      icon: <X className="text-destructive" weight="bold" size={32} />,
      status: 'Imposible aprobar',
      details: `Has obtenido ${currentPercentage.toFixed(1)}% de ${evaluatedWeight}% evaluado. No es posible alcanzar el ${passingPoint}% necesario con los ${remainingWeight}% restantes.`
    }
  }

  let statusText = ''
  let statusIcon: React.ReactElement

  if (percentageOfEvaluated >= 70) {
    statusText = 'Rendimiento alto'
    statusIcon = <WarningCircle className="text-accent" weight="fill" size={32} />
  } else if (percentageOfEvaluated >= 40) {
    statusText = 'Rendimiento moderado'
    statusIcon = <WarningCircle className="text-orange" weight="fill" size={32} />
  } else {
    statusText = 'Rendimiento bajo'
    statusIcon = <WarningCircle className="text-destructive" weight="fill" size={32} />
  }

  return {
    icon: statusIcon,
    status: statusText,
    details: `Has obtenido ${currentPercentage.toFixed(1)}% de ${evaluatedWeight}% evaluado (${percentageOfEvaluated.toFixed(1)}% de rendimiento). Necesitas obtener ${neededFromRemaining.toFixed(1)}% de los ${remainingWeight}% restantes (${neededPercentFromRemaining.toFixed(1)}% de rendimiento).`
  }
}

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

  const percentageOfEvaluated = evaluatedWeight > 0 ? (currentPercentage / evaluatedWeight) * 100 : 0
  const remainingWeight = 100 - evaluatedWeight
  const maxPossiblePercentage = currentPercentage + remainingWeight
  const canStillPass = maxPossiblePercentage >= passingPoint

  const statusInfo = getStatusInfo(
    currentPercentage, 
    evaluatedWeight, 
    percentageOfEvaluated, 
    passingPoint, 
    canStillPass,
    remainingWeight
  )

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Nota Acumulada</h2>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="font-data text-3xl font-bold text-primary">
                  {currentPoints}
                </span>
                <span className="text-muted-foreground">/ {totalPoints} pts</span>
              </div>
              <span className="font-data text-xl text-muted-foreground">
                {currentPercentage.toFixed(2)}%
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    {statusInfo.icon}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{statusInfo.status}</p>
                    <p className="text-xs">{statusInfo.details}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

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
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent" />
            <span className="text-muted-foreground">Obtenido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted" />
            <span className="text-muted-foreground">Por evaluar</span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary" weight="fill" />
            <span className="text-muted-foreground">Mínimo para aprobar</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface ProgressBarProps {
  label: string
  current: number
  evaluated: number
  passingPoint: number
  target: number
  isApproved?: boolean
  isTotal?: boolean
}

function ProgressBar({ 
  label, 
  current, 
  evaluated, 
  passingPoint, 
  target,
  isApproved,
  isTotal 
}: ProgressBarProps) {
  const currentPercent = (current / target) * 100
  const evaluatedPercent = (evaluated / target) * 100
  const passingPercent = (passingPoint / target) * 100

  const percentageOfEvaluated = evaluated > 0 ? (current / evaluated) * 100 : 0
  const remainingWeight = target - evaluated
  const maxPossiblePercentage = current + remainingWeight
  const canStillPass = maxPossiblePercentage >= passingPoint
  const neededFromRemaining = Math.max(0, passingPoint - current)
  const neededPercentFromRemaining = remainingWeight > 0 ? (neededFromRemaining / remainingWeight) * 100 : 0

  const getStatusInfo = () => {
    if (evaluated === 0) {
      return {
        icon: <WarningCircle size={16} className="text-muted-foreground" weight="fill" />,
        status: 'Sin evaluaciones',
        details: `No hay evaluaciones de ${label.toLowerCase()} completadas aún`
      }
    }

    if (current >= passingPoint) {
      const statusText = evaluated >= (target * 0.75) ? 'Aprobado (alto rendimiento)' : 'Aprobado'
      const statusIcon = evaluated >= (target * 0.75)
        ? <Check size={16} className="text-accent" weight="bold" />
        : <Check size={16} className="text-orange" weight="bold" />
      return {
        icon: statusIcon,
        status: statusText,
        details: `Has obtenido ${current.toFixed(1)}% de ${evaluated}% evaluado (${percentageOfEvaluated.toFixed(1)}% de rendimiento).${remainingWeight > 0 ? ` Quedan ${remainingWeight.toFixed(1)}% por evaluar.` : ''}`
      }
    }

    if (!canStillPass) {
      return {
        icon: <X size={16} className="text-destructive" weight="bold" />,
        status: 'Imposible aprobar',
        details: `Has obtenido ${current.toFixed(1)}% de ${evaluated}% evaluado. No es posible alcanzar el ${passingPoint.toFixed(1)}% necesario con los ${remainingWeight.toFixed(1)}% restantes.`
      }
    }

    let statusText = ''
    let statusIcon: React.ReactElement
    if (percentageOfEvaluated >= 70) {
      statusText = 'Rendimiento alto'
      statusIcon = <WarningCircle size={16} className="text-accent" weight="fill" />
    } else if (percentageOfEvaluated >= 40) {
      statusText = 'Rendimiento moderado'
      statusIcon = <WarningCircle size={16} className="text-orange" weight="fill" />
    } else {
      statusText = 'Rendimiento bajo'
      statusIcon = <WarningCircle size={16} className="text-destructive" weight="fill" />
    }

    return {
      icon: statusIcon,
      status: statusText,
      details: `Has obtenido ${current.toFixed(1)}% de ${evaluated}% evaluado (${percentageOfEvaluated.toFixed(1)}% de rendimiento). Necesitas obtener ${neededFromRemaining.toFixed(1)}% de los ${remainingWeight.toFixed(1)}% restantes (${neededPercentFromRemaining.toFixed(1)}% de rendimiento).`
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${isTotal ? 'font-semibold' : ''}`}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-data text-sm">
            {current.toFixed(1)}%
          </span>
          {!isTotal && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    {statusInfo.icon}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{statusInfo.status}</p>
                    <p className="text-xs">{statusInfo.details}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {isTotal && (
            isApproved ? (
              <CheckCircle size={16} className="text-accent" weight="fill" />
            ) : (
              <WarningCircle size={16} className="text-destructive" weight="fill" />
            )
          )}
        </div>
      </div>

      <div className="relative h-8 w-full bg-muted rounded-lg overflow-hidden border">
        <div
          className="absolute top-0 left-0 h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${Math.min(currentPercent, 100)}%` }}
        />
        
        <div
          className="absolute top-0 h-full bg-muted-foreground/20 transition-all duration-500 ease-out"
          style={{ 
            left: `${Math.min(currentPercent, 100)}%`,
            width: `${Math.max(0, Math.min(evaluatedPercent - currentPercent, 100 - currentPercent))}%` 
          }}
        />

        {passingPercent > 0 && passingPercent <= 100 && (
          <div
            className="absolute top-0 h-full w-1 flex items-center justify-center"
            style={{ left: `${passingPercent}%` }}
          >
            <div className="absolute w-1 h-full bg-primary" />
            <Target 
              size={20} 
              className="absolute text-primary bg-background rounded-full" 
              weight="fill"
              style={{ transform: 'translateX(-50%)' }}
            />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-data text-xs font-medium text-foreground/70 mix-blend-difference">
            {evaluatedPercent.toFixed(0)}% evaluado
          </span>
        </div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>0%</span>
        <span className="font-medium text-primary">
          Aprobar: {passingPoint.toFixed(0)}%
        </span>
        <span>{target}%</span>
      </div>
    </div>
  )
}
