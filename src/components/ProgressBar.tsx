import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { CheckCircle, WarningCircle, Target, X, Check } from '@phosphor-icons/react'

interface ProgressBarProps {
  label?: string
  current: number
  evaluated: number
  passingPoint: number
  target: number
  isApproved?: boolean
  isTotal?: boolean
  compact?: boolean
  showLabels?: boolean
  showTooltip?: boolean
}

export function ProgressBar({ 
  label,
  current, 
  evaluated, 
  passingPoint, 
  target,
  isApproved,
  isTotal,
  compact = false,
  showLabels = true,
  showTooltip = true
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
        details: `No hay evaluaciones${label ? ` de ${label.toLowerCase()}` : ''} completadas aún`
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
      {label && showLabels && (
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isTotal ? 'font-semibold' : ''}`}>
            {label}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-data text-sm">
              {current.toFixed(1)}% {evaluated > 0 && <span className="text-muted-foreground">/ {evaluated.toFixed(1)}%</span>}
            </span>
            {showTooltip && !isTotal && (
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
      )}

      <div className={`relative ${compact ? 'h-6' : 'pt-8 pb-0 h-14'} w-full`}>
        {currentPercent > 0 && currentPercent <= 100 && !compact && (
          <div
            className="absolute top-0 flex flex-col items-center z-10"
            style={{ left: `${Math.min(currentPercent, 100)}%`, transform: 'translateX(-50%)' }}
          >
            <div className="bg-accent text-accent-foreground px-2 py-0.5 rounded-md text-xs font-data font-semibold mb-0.5 shadow-md border border-accent/20 whitespace-nowrap">
              {currentPercent.toFixed(1)}%
            </div>
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-accent" />
          </div>
        )}

        {evaluatedPercent > 0 && evaluatedPercent <= 100 && !compact && (
          <div
            className="absolute top-0 flex flex-col items-center z-10"
            style={{ left: `${Math.min(evaluatedPercent, 100)}%`, transform: 'translateX(-50%)' }}
          >
            <div className="bg-muted-foreground/70 text-background px-2 py-0.5 rounded-md text-xs font-data font-semibold mb-0.5 shadow-md border border-muted-foreground/30 whitespace-nowrap">
              {evaluatedPercent.toFixed(0)}% evaluado
            </div>
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-muted-foreground/70" />
          </div>
        )}

        <div className={`relative h-8 w-full bg-muted rounded-lg overflow-hidden border ${compact ? '' : 'absolute bottom-0 left-0 right-0'}`}>
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
              className="absolute top-0 h-full w-0.5 flex items-center justify-center"
              style={{ left: `${passingPercent}%` }}
            >
              <div className="absolute w-0.5 h-full bg-primary" />
              <Target 
                size={16} 
                className="absolute text-primary bg-background rounded-full" 
                weight="fill"
                style={{ transform: 'translateX(-50%)' }}
              />
            </div>
          )}
        </div>
      </div>

      {showLabels && !compact && (
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>0%</span>
          <span className="font-medium text-primary">
            Aprobar: {passingPoint.toFixed(0)}%
          </span>
          <span>{target}%</span>
        </div>
      )}
    </div>
  )
}
