import { Subject, Config } from '../types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { CheckCircle, WarningCircle, Target, Plus, XCircle, Check, X } from '@phosphor-icons/react'
import { calculateRequiredNotes } from '../lib/calculations'

interface DashboardProps {
  subjects: Subject[]
  config: Config
  onSelectSubject: (subjectId: string) => void
  onAddSubject: () => void
}

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
          const isApproved = calculation.currentPercentage >= passingPoint

          const evaluatedWeight = subject.evaluations
            .filter(e => e.obtainedPoints !== undefined)
            .reduce((sum, e) => sum + e.weight, 0)

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

          const totalPendingWeight = subject.evaluations
            .filter(e => e.obtainedPoints === undefined)
            .reduce((sum, e) => sum + e.weight, 0)

          const canStillPass = calculation.currentPercentage + totalPendingWeight >= passingPoint

          const getStatusIcon = () => {
            if (evaluatedWeight === 0) {
              return <WarningCircle className="text-muted-foreground" weight="fill" size={32} />
            }

            const evaluatedPercent = (calculation.currentPercentage / evaluatedWeight) * 100

            if (calculation.currentPercentage >= passingPoint) {
              if (evaluatedWeight >= 75) {
                return <Check className="text-accent" weight="bold" size={32} />
              } else {
                return <Check className="text-orange" weight="bold" size={32} />
              }
            }

            if (!canStillPass) {
              return <X className="text-destructive" weight="bold" size={32} />
            }

            if (evaluatedPercent >= 70) {
              return <WarningCircle className="text-accent" weight="fill" size={32} />
            } else if (evaluatedPercent >= 40) {
              return <WarningCircle className="text-orange" weight="fill" size={32} />
            } else {
              return <WarningCircle className="text-destructive" weight="fill" size={32} />
            }
          }

          return (
            <Card 
              key={subject.id} 
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 hover:border-primary/50"
              onClick={() => onSelectSubject(subject.id)}
            >
              <div className="flex flex-col gap-4">
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
                  {getStatusIcon()}
                </div>

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

                  {!subject.hasSplit ? (
                    <ProgressBar
                      current={calculation.currentPercentage}
                      evaluated={evaluatedWeight}
                      passingPoint={passingPoint}
                      target={100}
                    />
                  ) : (
                    <div className="flex flex-col gap-3">
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
                        />
                      </div>

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
                        />
                      </div>
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

interface ProgressBarProps {
  current: number
  evaluated: number
  passingPoint: number
  target: number
  compact?: boolean
}

function ProgressBar({ current, evaluated, passingPoint, target, compact = false }: ProgressBarProps) {
  const currentPercent = (current / target) * 100
  const evaluatedPercent = (evaluated / target) * 100
  const passingPercent = (passingPoint / target) * 100

  return (
    <div className="relative h-6 w-full bg-muted rounded-lg overflow-hidden border">
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
          {!compact && (
            <Target 
              size={16} 
              className="absolute text-primary bg-background rounded-full" 
              weight="fill"
              style={{ transform: 'translateX(-50%)' }}
            />
          )}
        </div>
      )}

      {!compact && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-data text-xs font-medium text-foreground/70 mix-blend-difference">
            {evaluatedPercent.toFixed(0)}% evaluado
          </span>
        </div>
      )}
    </div>
  )
}
