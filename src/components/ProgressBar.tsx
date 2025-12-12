import { Target } from '@phosphor-icons/react'
import { calculateProgressMetrics } from '../lib/calculations'
import { ProgressParams } from '../types'

interface ProgressBarProps extends ProgressParams {
  isApproved?: boolean
  isTotal?: boolean
  compact?: boolean
  showLabels?: boolean
}

/**
 * Barra de progreso visual que muestra el avance hacia un objetivo.
 * Incluye indicadores de porcentaje actual, evaluado y punto de aprobación.
 */
export function ProgressBar({ 
  label,
  current, 
  evaluated, 
  passingPoint, 
  target,
  isApproved,
  isTotal,
  compact = false,
  showLabels = true
}: ProgressBarProps) {
  // Usar utilidades centralizadas
  const progressParams: ProgressParams = { current, evaluated, passingPoint, target, label }
  const metrics = calculateProgressMetrics(progressParams)
  
  const { currentPercent, evaluatedPercent, passingPercent } = metrics

  return (
    <div className="flex flex-col gap-2">
      {label && showLabels && (
        <span className={`text-sm font-medium ${isTotal ? 'font-semibold' : ''}`}>
          {label}
        </span>
      )}

      <div className={`relative ${compact ? 'h-6' : 'pt-8 pb-0 h-14'} w-full`}>
        {/* Indicador de porcentaje actual */}
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

        {/* Indicador de porcentaje evaluado */}
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

        {/* Barra de progreso */}
        <div className={`relative h-8 w-full bg-muted rounded-lg overflow-hidden border ${compact ? '' : 'absolute bottom-0 left-0 right-0'}`}>
          {/* Sección obtenida */}
          <div
            className="absolute top-0 left-0 h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${Math.min(currentPercent, 100)}%` }}
          />
          
          {/* Sección evaluada pero no obtenida */}
          <div
            className="absolute top-0 h-full bg-muted-foreground/20 transition-all duration-500 ease-out"
            style={{ 
              left: `${Math.min(currentPercent, 100)}%`,
              width: `${Math.max(0, Math.min(evaluatedPercent - currentPercent, 100 - currentPercent))}%` 
            }}
          />

          {/* Marcador de punto de aprobación */}
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

      {/* Etiquetas de escala */}
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
