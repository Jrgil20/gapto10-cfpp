import { useMemo } from 'react'
import { Subject, Config } from '../types'
import { Card } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface HistoricalChartProps {
  subject: Subject
  config: Config
}

export function HistoricalChart({ subject, config }: HistoricalChartProps) {
  const chartData = useMemo(() => {
    const completedEvaluations = subject.evaluations
      .filter(e => e.obtainedPoints !== undefined && e.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (completedEvaluations.length === 0) return []

    let cumulativePercentage = 0
    let cumulativeTheoryPercentage = 0
    let cumulativePracticePercentage = 0

    return completedEvaluations.map((evaluation) => {
      const obtainedPercentage = (evaluation.obtainedPoints! / evaluation.maxPoints) * evaluation.weight
      cumulativePercentage += obtainedPercentage

      const dataPoint: any = {
        date: format(new Date(evaluation.date), 'dd MMM', { locale: es }),
        fullDate: format(new Date(evaluation.date), 'dd/MM/yyyy', { locale: es }),
        name: evaluation.name,
        percentage: Number(cumulativePercentage.toFixed(2)),
        points: Number((cumulativePercentage / config.percentagePerPoint).toFixed(2)),
        evaluationPercentage: Number(obtainedPercentage.toFixed(2)),
        evaluationPoints: Number((obtainedPercentage / config.percentagePerPoint).toFixed(2))
      }

      if (subject.hasSplit) {
        if (evaluation.section === 'theory') {
          cumulativeTheoryPercentage += obtainedPercentage
          dataPoint.theoryPercentage = Number(cumulativeTheoryPercentage.toFixed(2))
        } else if (evaluation.section === 'practice') {
          cumulativePracticePercentage += obtainedPercentage
          dataPoint.practicePercentage = Number(cumulativePracticePercentage.toFixed(2))
        }
      }

      return dataPoint
    })
  }, [subject.evaluations, subject.hasSplit, config.percentagePerPoint])

  if (chartData.length === 0) {
    return null
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Card className="p-3 shadow-lg">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold text-sm">{data.name}</p>
              <p className="text-xs text-muted-foreground">{data.fullDate}</p>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Esta evaluación:</span>
                <span className="font-data font-semibold">
                  {data.evaluationPoints} pts ({data.evaluationPercentage}%)
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Acumulado:</span>
                <span className="font-data font-semibold text-primary">
                  {data.points} pts ({data.percentage}%)
                </span>
              </div>
              {subject.hasSplit && (
                <>
                  {data.theoryPercentage !== undefined && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Teoría acum.:</span>
                      <span className="font-data font-semibold text-chart-1">
                        {data.theoryPercentage}%
                      </span>
                    </div>
                  )}
                  {data.practicePercentage !== undefined && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Práctica acum.:</span>
                      <span className="font-data font-semibold text-chart-2">
                        {data.practicePercentage}%
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      )
    }
    return null
  }

  const passingPercentage = config.passingPercentage
  const theoryTarget = subject.hasSplit && subject.theoryWeight
    ? (subject.theoryWeight * config.passingPercentage) / 100
    : 0
  const practiceTarget = subject.hasSplit && subject.practiceWeight
    ? (subject.practiceWeight * config.passingPercentage) / 100
    : 0

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Evolución Histórica</h2>
          <p className="text-sm text-muted-foreground">
            Progreso acumulado de las notas a lo largo del tiempo
          </p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs font-data"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            <ReferenceLine 
              y={passingPercentage} 
              stroke="hsl(var(--primary))" 
              strokeDasharray="5 5"
              label={{ 
                value: `Aprobar (${passingPercentage}%)`, 
                position: 'right',
                fill: 'hsl(var(--primary))',
                fontSize: 12,
                fontWeight: 600
              }}
            />

            {!subject.hasSplit ? (
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', r: 5 }}
                activeDot={{ r: 7 }}
                name="Porcentaje Acumulado"
              />
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="theoryPercentage"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2.5}
                  dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Teoría Acumulada"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="practicePercentage"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2.5}
                  dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Práctica Acumulada"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent))', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Total Acumulado"
                />
                {theoryTarget > 0 && (
                  <ReferenceLine 
                    y={theoryTarget} 
                    stroke="hsl(var(--chart-1))" 
                    strokeDasharray="3 3"
                    strokeOpacity={0.5}
                  />
                )}
                {practiceTarget > 0 && (
                  <ReferenceLine 
                    y={practiceTarget} 
                    stroke="hsl(var(--chart-2))" 
                    strokeDasharray="3 3"
                    strokeOpacity={0.5}
                  />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
