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
