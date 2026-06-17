import { useState, useMemo } from 'react'
import { CalendarBlank, ClockCountdown, CheckCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Subject, Config, CalculationMode } from '../types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { getUpcomingEvaluations, calculateRequiredNotes } from '../lib/calculations'

interface UpcomingEvaluationsProps {
  subjects: Subject[]
  config: Config
  calculationMode: CalculationMode
}

const RANGE_OPTIONS: { label: string; days: number }[] = [
  { label: '7 días', days: 7 },
  { label: '14 días', days: 14 },
  { label: '30 días', days: 30 },
]

export function UpcomingEvaluations({ subjects, config, calculationMode }: UpcomingEvaluationsProps) {
  const [daysAhead, setDaysAhead] = useState(14)
  const [simulated, setSimulated] = useState<Map<string, number>>(new Map())

  const upcoming = useMemo(
    () => getUpcomingEvaluations(subjects, config, daysAhead),
    [subjects, config, daysAhead]
  )

  const simulatedResults = useMemo(() => {
    const results = new Map<string, { isApproved: boolean; currentPercentage: number } | null>()
    for (const [evalId, points] of simulated.entries()) {
      const item = upcoming.find(u => u.evaluation.id === evalId)
      if (!item) continue

      const modifiedSubject: Subject = {
        ...item.subject,
        evaluations: item.subject.evaluations.map(e => {
          if (e.id === evalId) return { ...e, obtainedPoints: points }
          if (e.isSummative && e.subEvaluations) {
            return {
              ...e,
              subEvaluations: e.subEvaluations.map(sub =>
                sub.id === evalId ? { ...sub, obtainedPoints: points } : sub
              ),
            }
          }
          return e
        }),
      }
      const result = calculateRequiredNotes(modifiedSubject, config)
      results.set(evalId, { isApproved: result.isApproved, currentPercentage: result.currentPercentage })
    }
    return results
  }, [simulated, upcoming, config])

  const setSimulatedValue = (evalId: string, value: string) => {
    const num = parseFloat(value)
    setSimulated(prev => {
      const next = new Map(prev)
      if (value === '' || isNaN(num)) {
        next.delete(evalId)
      } else {
        next.set(evalId, num)
      }
      return next
    })
  }

  if (upcoming.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.days}
              onClick={() => setDaysAhead(opt.days)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                daysAhead === opt.days
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Card className="p-8 flex flex-col items-center gap-3 text-center text-muted-foreground">
          <CalendarBlank size={40} className="opacity-40" />
          <div>
            <p className="text-sm font-medium">Sin evaluaciones próximas</p>
            <p className="text-xs mt-1">
              No hay evaluaciones pendientes con fecha en los próximos {daysAhead} días.
              Agrega fechas a tus evaluaciones para verlas aquí.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        {RANGE_OPTIONS.map(opt => (
          <button
            key={opt.days}
            onClick={() => setDaysAhead(opt.days)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              daysAhead === opt.days
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">
          {upcoming.length} evaluación{upcoming.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {upcoming.map(item => {
          const { subject, evaluation, daysUntil, requiredPoints } = item
          const simResult = simulatedResults.get(evaluation.id)
          const simValue = simulated.get(evaluation.id)

          const urgencyColor = item.urgencyScore >= 70
            ? 'text-destructive'
            : item.urgencyScore >= 40
            ? 'text-orange'
            : 'text-muted-foreground'

          return (
            <Card key={`${subject.id}-${evaluation.id}`} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`flex flex-col items-center gap-0.5 shrink-0 pt-0.5 ${urgencyColor}`}>
                    <ClockCountdown size={18} weight="fill" />
                    <span className="text-xs font-data font-bold">
                      {daysUntil === 0 ? 'Hoy' : `${daysUntil}d`}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{subject.name}</p>
                    <p className="text-sm font-medium truncate">{evaluation.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarBlank size={11} />
                        <span>
                          {evaluation.date
                            ? format(new Date(evaluation.date), 'dd MMM yyyy', { locale: es })
                            : ''}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {evaluation.weight}%
                      </Badge>
                      {evaluation.section && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {evaluation.section === 'theory' ? 'Teoría' : 'Práctica'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:items-end shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Necesitas (pesimista)</p>
                    <p className="text-sm font-data font-bold text-primary">
                      {requiredPoints} / {evaluation.maxPoints} pts
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">¿Y si obtienes…?</p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={evaluation.maxPoints}
                        step={0.5}
                        placeholder={`0–${evaluation.maxPoints}`}
                        value={simValue ?? ''}
                        onChange={e => setSimulatedValue(evaluation.id, e.target.value)}
                        className="w-24 h-8 text-xs font-data text-right"
                      />
                      {simResult && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${simResult.isApproved ? 'text-accent' : 'text-orange'}`}>
                          {simResult.isApproved && <CheckCircle size={14} weight="fill" />}
                          <span>{simResult.isApproved ? 'Aprobado' : `${simResult.currentPercentage.toFixed(1)}%`}</span>
                        </div>
                      )}
                    </div>
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
