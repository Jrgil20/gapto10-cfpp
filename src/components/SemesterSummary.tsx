import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip } from 'recharts'
import { CheckCircle, WarningCircle, X, Student } from '@phosphor-icons/react'
import { SemesterSummary as SemesterSummaryType, Config } from '../types'
import { Card } from './ui/card'
import { calculateRequiredNotes } from '../lib/calculations'

interface SemesterSummaryProps {
  summary: SemesterSummaryType
  config: Config
}

const CATEGORY_COLORS = {
  approved:   'var(--accent)',
  safe:       'var(--primary)',
  atRisk:     'var(--orange)',
  impossible: 'var(--destructive)',
  notStarted: 'var(--muted-foreground)',
} as const

type Category = keyof typeof CATEGORY_COLORS

const statCards = [
  {
    key: 'approved' as Category,
    label: 'Aprobadas',
    icon: CheckCircle,
    colorClass: 'text-accent',
    bgClass: 'bg-accent/10',
  },
  {
    key: 'safe' as Category,
    label: 'En buen camino',
    icon: WarningCircle,
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
  },
  {
    key: 'atRisk' as Category,
    label: 'En riesgo',
    icon: WarningCircle,
    colorClass: 'text-orange',
    bgClass: 'bg-orange/10',
  },
  {
    key: 'impossible' as Category,
    label: 'Imposible',
    icon: X,
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
  },
]

export function SemesterSummary({ summary, config }: SemesterSummaryProps) {
  const allSubjects = useMemo(() => [
    ...summary.impossible,
    ...summary.atRisk,
    ...summary.notStarted,
    ...summary.safe,
    ...summary.approved,
  ], [summary])

  const chartData = useMemo(() => {
    const categoryOf = (id: string): Category => {
      if (summary.approved.some(s => s.id === id))  return 'approved'
      if (summary.impossible.some(s => s.id === id)) return 'impossible'
      if (summary.safe.some(s => s.id === id))      return 'safe'
      if (summary.atRisk.some(s => s.id === id))    return 'atRisk'
      return 'notStarted'
    }

    return allSubjects
      .map(subject => {
        const result = calculateRequiredNotes(subject, config)
        const truncated = subject.name.length > 22
          ? subject.name.slice(0, 20) + '…'
          : subject.name
        return {
          id: subject.id,
          name: truncated,
          current: Math.round(result.currentPercentage * 10) / 10,
          category: categoryOf(subject.id),
        }
      })
      .sort((a, b) => a.current - b.current)
  }, [allSubjects, config, summary])

  const total = allSubjects.length + summary.notStarted.length

  if (total === 0) {
    return (
      <Card className="p-6 flex flex-col items-center gap-3 text-center text-muted-foreground">
        <Student size={40} className="opacity-40" />
        <p className="text-sm">Aún no tienes materias. Agrégalas desde el inicio.</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map(({ key, label, icon: Icon, colorClass, bgClass }) => (
          <Card key={key} className="p-4 flex flex-col gap-2">
            <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center`}>
              <Icon size={16} className={colorClass} weight="fill" />
            </div>
            <div>
              <p className={`text-2xl font-bold font-data ${colorClass}`}>
                {summary[key].length}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card className="p-4">
          <p className="text-sm font-semibold mb-3">Progreso por materia</p>
          <ResponsiveContainer width="100%" height={Math.max(120, chartData.length * 36)}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Progreso actual']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                x={config.passingPercentage}
                stroke="hsl(var(--primary))"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{
                  value: `${config.passingPercentage}%`,
                  position: 'right',
                  fill: 'hsl(var(--primary))',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
              <Bar dataKey="current" radius={[0, 3, 3, 0]} maxBarSize={22}>
                {chartData.map(entry => (
                  <Cell key={entry.id} fill={CATEGORY_COLORS[entry.category]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
