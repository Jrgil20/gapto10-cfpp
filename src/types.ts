export interface Evaluation {
  id: string
  name: string
  date?: string // Opcional cuando isSummative es true
  weight: number
  maxPoints: number
  obtainedPoints?: number
  section?: 'theory' | 'practice'
  isSummative?: boolean
  subEvaluations?: Evaluation[] // Sub-evaluaciones para actividades sumativas
}

export interface Subject {
  id: string
  name: string
  hasSplit: boolean
  theoryWeight?: number
  practiceWeight?: number
  evaluations: Evaluation[]
}

/**
 * Tipo de redondeo para cálculos de puntos.
 * - 'standard': Redondeo estándar (Math.round) - redondea al entero más cercano
 * - 'floor': Redondeo hacia abajo (Math.floor) - siempre redondea hacia abajo
 * - 'ceil': Redondeo hacia arriba (Math.ceil) - siempre redondea hacia arriba
 */
export type RoundingType = 'standard' | 'floor' | 'ceil'

export interface Config {
  defaultMaxPoints: number
  percentagePerPoint: number
  passingPercentage: number
  showJsonInExportImport?: boolean
  /**
   * Tipo de redondeo a aplicar en los cálculos de conversión de porcentaje a puntos.
   * Afecta el comportamiento de cálculos críticos en toda la aplicación.
   * @default 'standard'
   */
  roundingType?: RoundingType
}

export interface CalculationResult {
  currentPercentage: number
  currentTheoryPercentage?: number
  currentPracticePercentage?: number
  isApproved: boolean
  theoryApproved?: boolean
  practiceApproved?: boolean
  requiredNotes: {
    evaluationId: string
    pessimistic: number
    normal: number
    optimistic: number
  }[]
}

export type CalculationMode = 'pessimistic' | 'normal' | 'optimistic'

/**
 * Representa el estado de progreso de una materia o evaluación
 */
export type ProgressStatus = 
  | 'no_evaluations'   // Sin evaluaciones completadas
  | 'approved'         // Ya aprobado
  | 'impossible'       // Imposible aprobar
  | 'high_performance' // Rendimiento >= 70%
  | 'medium_performance' // Rendimiento 40-70%
  | 'low_performance'  // Rendimiento < 40%

/**
 * Información de estado para mostrar en UI
 */
export interface StatusInfo {
  status: ProgressStatus
  label: string
  details: string
}

/**
 * Parámetros para calcular el estado de progreso
 */
export interface ProgressParams {
  current: number           // Porcentaje actual obtenido
  evaluated: number         // Peso total evaluado
  passingPoint: number      // Porcentaje mínimo para aprobar
  target: number            // Peso total objetivo (usualmente 100)
  label?: string            // Etiqueta opcional para mensajes
}