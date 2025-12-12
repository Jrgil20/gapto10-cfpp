export interface Evaluation {
  id: string
  name: string
  date: string
  weight: number
  maxPoints: number
  obtainedPoints?: number
  section?: 'theory' | 'practice'
}

export interface Subject {
  id: string
  name: string
  hasSplit: boolean
  theoryWeight?: number
  practiceWeight?: number
  evaluations: Evaluation[]
}

export interface Config {
  defaultMaxPoints: number
  percentagePerPoint: number
  passingPercentage: number
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