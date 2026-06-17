import { useMemo } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { Subject, Config, CalculationMode } from '../types'
import { Button } from './ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { SemesterSummary } from './SemesterSummary'
import { UrgencyRanking } from './UrgencyRanking'
import { UpcomingEvaluations } from './UpcomingEvaluations'
import { getSemesterSummary } from '../lib/calculations'

interface SemesterViewProps {
  subjects: Subject[]
  config: Config
  calculationMode: CalculationMode
  onSelectSubject: (id: string) => void
  onBack: () => void
}

export function SemesterView({ subjects, config, calculationMode, onSelectSubject, onBack }: SemesterViewProps) {
  const summary = useMemo(
    () => getSemesterSummary(subjects, config),
    [subjects, config]
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft size={18} className="text-primary" />
        </Button>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Vista Semestral</h2>
          <p className="text-xs text-muted-foreground">
            {subjects.length} materia{subjects.length !== 1 ? 's' : ''} •{' '}
            {summary.approved.length} aprobada{summary.approved.length !== 1 ? 's' : ''} •{' '}
            {summary.atRisk.length + summary.impossible.length} en riesgo
          </p>
        </div>
      </div>

      <Tabs defaultValue="resumen">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="resumen" className="flex-1 sm:flex-none">Resumen</TabsTrigger>
          <TabsTrigger value="proximas" className="flex-1 sm:flex-none">Próximas evaluaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="mt-4 flex flex-col gap-4">
          <SemesterSummary summary={summary} config={config} />
          <UrgencyRanking subjects={subjects} config={config} onSelectSubject={onSelectSubject} />
        </TabsContent>

        <TabsContent value="proximas" className="mt-4">
          <UpcomingEvaluations
            subjects={subjects}
            config={config}
            calculationMode={calculationMode}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
