import { useMemo } from 'react'
import { ArrowRight, SortDescending } from '@phosphor-icons/react'
import { Subject, Config } from '../types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { StatusIndicator } from './StatusIndicator'
import { getSemesterSummary, getSubjectUrgencyScore, calculateRequiredNotes, getProgressStatus, calculateProgressMetrics } from '../lib/calculations'
import { getDifficultyLabel, getDifficultyColor } from '../lib/difficultyUtils'

interface UrgencyRankingProps {
  subjects: Subject[]
  config: Config
  onSelectSubject: (id: string) => void
}

function urgencyLabel(score: number): { label: string; variant: 'destructive' | 'default' | 'secondary' | 'outline' } {
  if (score >= 70) return { label: 'Alta', variant: 'destructive' }
  if (score >= 40) return { label: 'Media', variant: 'default' }
  return { label: 'Baja', variant: 'secondary' }
}

export function UrgencyRanking({ subjects, config }: UrgencyRankingProps & { onSelectSubject: (id: string) => void }) {
  const ranked = useMemo(() => {
    const summary = getSemesterSummary(subjects, config)
    const approvedIds = new Set(summary.approved.map(s => s.id))
    const notStartedIds = new Set(summary.notStarted.map(s => s.id))

    return [...subjects]
      .map(subject => {
        const score = getSubjectUrgencyScore(subject, config)
        const result = calculateRequiredNotes(subject, config)
        const evaluatedWeight = subject.evaluations
          .filter(e => e.obtainedPoints !== undefined || (e.isSummative && e.subEvaluations?.every(s => s.obtainedPoints !== undefined)))
          .reduce((sum, e) => sum + e.weight, 0)
        const statusInfo = getProgressStatus({
          current: result.currentPercentage,
          evaluated: evaluatedWeight,
          passingPoint: config.passingPercentage,
          target: 100,
        })
        return { subject, score, statusInfo, isApproved: approvedIds.has(subject.id), notStarted: notStartedIds.has(subject.id) }
      })
      .sort((a, b) => {
        if (a.isApproved !== b.isApproved) return a.isApproved ? 1 : -1
        if (a.notStarted !== b.notStarted) return a.notStarted ? 1 : -1
        return b.score - a.score
      })
  }, [subjects, config])

  if (subjects.length === 0) return null

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <SortDescending size={16} className="text-primary" />
        <h3 className="text-sm font-semibold">Ranking de urgencia</h3>
        <span className="text-xs text-muted-foreground ml-auto">¿Qué estudiar primero?</span>
      </div>

      <div className="flex flex-col divide-y">
        {ranked.map(({ subject, score, statusInfo, isApproved, notStarted }, index) => {
          const { label: urgLabel, variant } = urgencyLabel(score)
          return (
            <div key={subject.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className="text-sm font-data font-bold text-muted-foreground w-5 shrink-0 text-center">
                {index + 1}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{subject.name}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {subject.difficulty && (
                  <Badge className={`text-xs px-1.5 py-0 ${getDifficultyColor(subject.difficulty)}`}>
                    {getDifficultyLabel(subject.difficulty)}
                  </Badge>
                )}
                {!isApproved && !notStarted && (
                  <Badge variant={variant} className="text-xs px-1.5 py-0">
                    {urgLabel}
                  </Badge>
                )}
                <StatusIndicator statusInfo={statusInfo} size="sm" showTooltip />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
