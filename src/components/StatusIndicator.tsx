import { CheckCircle, WarningCircle, X, Check } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { StatusInfo } from '../types'

interface StatusIndicatorProps {
  statusInfo: StatusInfo
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  /** Si es true, usa icono de CheckCircle para aprobado en vez de Check */
  useCircleForApproved?: boolean
  /** Indica si el rendimiento fue alto (>= 75% evaluado) - reservado para futuras funcionalidades */
  highEvaluatedWeight?: boolean
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32
}

/**
 * Componente que muestra un icono de estado con tooltip opcional.
 * Centraliza la lógica visual que antes estaba duplicada en múltiples componentes.
 */
export function StatusIndicator({ 
  statusInfo, 
  size = 'md',
  showTooltip = true,
  useCircleForApproved = false,
  highEvaluatedWeight = false
}: StatusIndicatorProps) {
  const iconSize = sizeMap[size]
  
  const getIcon = () => {
    const status = statusInfo.status
    
    switch (status) {
      case 'no_evaluations':
        return <WarningCircle size={iconSize} className="text-muted-foreground" weight="fill" />
      
      case 'approved':
        if (useCircleForApproved) {
          return <CheckCircle size={iconSize} className="text-accent" weight="fill" />
        }
        // Estado aprobado siempre usa color accent (verde) según reglas de diseño
        return <Check size={iconSize} className="text-accent" weight="bold" />
      
      case 'impossible':
        return <X size={iconSize} className="text-destructive" weight="bold" />
      
      case 'high_performance':
        return <WarningCircle size={iconSize} className="text-accent" weight="fill" />
      
      case 'medium_performance':
        return <WarningCircle size={iconSize} className="text-orange" weight="fill" />
      
      case 'low_performance':
        return <WarningCircle size={iconSize} className="text-destructive" weight="fill" />
      
      default:
        return <WarningCircle size={iconSize} className="text-muted-foreground" weight="fill" />
    }
  }

  const icon = getIcon()

  if (!showTooltip) {
    return <div className="cursor-default">{icon}</div>
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{statusInfo.label}</p>
            <p className="text-xs">{statusInfo.details}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


