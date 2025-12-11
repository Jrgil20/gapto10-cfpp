import { Subject, Config } from '../types'
import { Card } from './ui/card'
import { CheckCircle, WarningCircle, Target } from '@phosphor-icons/react'

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
            {isApproved ? (
              <CheckCircle className="text-accent" weight="fill" size={32} />
            ) : (
              <WarningCircle className="text-destructive" weight="fill" size={32} />
            )}
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
          {isApproved !== undefined && (
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
