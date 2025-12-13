import { useMemo } from 'react'
import { Subject, Config } from '../types'
import { Card } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
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

    return completedEvaluations.map((evaluation) => {
      // Normalizar la nota a escala de 20 puntos
      const normalizedNote = (evaluation.obtainedPoints! / evaluation.maxPoints) * 20
      
      // Calcular el porcentaje obtenido en esta evaluación
      const obtainedPercentage = (evaluation.obtainedPoints! / evaluation.maxPoints) * evaluation.weight
      cumulativePercentage += obtainedPercentage
      
      // Convertir acumulado a puntos (escala de 20)
      const cumulativePoints = cumulativePercentage / config.percentagePerPoint

      return {
        date: format(new Date(evaluation.date), 'dd MMM', { locale: es }),
        fullDate: format(new Date(evaluation.date), 'dd/MM/yyyy', { locale: es }),
        name: evaluation.name,
        note: Number(normalizedNote.toFixed(1)),
        originalNote: evaluation.obtainedPoints,
        maxPoints: evaluation.maxPoints,
        weight: evaluation.weight,
        section: evaluation.section,
        cumulativePoints: Number(cumulativePoints.toFixed(2)),
        cumulativePercentage: Number(cumulativePercentage.toFixed(2))
      }
    })
  }, [subject.evaluations, config.percentagePerPoint])

  if (chartData.length === 0) {
    return null
  }

  interface TooltipProps {
    active?: boolean
    payload?: Array<{
      payload: {
        name: string
        fullDate: string
        originalNote: number
        maxPoints: number
        weight: number
        section?: 'theory' | 'practice'
        cumulativePoints: number
        cumulativePercentage: number
      }
    }>
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
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
                <span className="text-muted-foreground">Nota:</span>
                <span className="font-data font-semibold text-accent">
                  {data.originalNote}/{data.maxPoints}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Peso:</span>
                <span className="font-data">
                  {data.weight}%
                </span>
              </div>
              {data.section && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Sección:</span>
                  <span className="font-medium">
                    {data.section === 'theory' ? 'Teoría' : 'Práctica'}
                  </span>
                </div>
              )}
              <div className="border-t pt-1 mt-1">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Acumulado:</span>
                  <span className="font-data font-bold text-primary">
                    {data.cumulativePoints} pts ({data.cumulativePercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )
    }
    return null
  }

  const passingNote = (config.passingPercentage / 100) * 20 // Nota mínima para aprobar (ej: 10/20)

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <h2 className="text-base sm:text-lg font-semibold">Rendimiento por Evaluación</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Notas obtenidas en cada evaluación (escala 0-20)
          </p>
        </div>

        <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
          <LineChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }} className="sm:!m-[20px_30px_10px_10px]">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              className="text-xs font-data"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              domain={[0, 20]}
              ticks={[0, 10, 20]}
              width={25}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Línea de aprobación (10/20) */}
            <ReferenceLine 
              y={passingNote} 
              stroke="hsl(var(--primary))" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: `Mín: ${passingNote}`, 
                position: 'right',
                fill: 'hsl(var(--primary))',
                fontSize: 10,
                fontWeight: 600
              }}
            />

            {/* Línea de rendimiento */}
            <Line
              type="linear"
              dataKey="note"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--accent))', r: 5, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              activeDot={{ r: 7, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              name="Nota"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
