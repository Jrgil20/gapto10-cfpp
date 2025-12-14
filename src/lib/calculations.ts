import { Subject, Evaluation, Config, CalculationResult, ProgressParams, StatusInfo, ProgressStatus, RoundingType } from '../types'

/**
 * Aplica el tipo de redondeo configurado a un valor numérico.
 * @param value - Valor a redondear
 * @param roundingType - Tipo de redondeo: 'standard' (Math.round), 'floor' (Math.floor), 'ceil' (Math.ceil)
 * @returns Valor redondeado según el tipo especificado
 */
export function applyRounding(value: number, roundingType: RoundingType = 'standard'): number {
  switch (roundingType) {
    case 'floor':
      return Math.floor(value)
    case 'ceil':
      return Math.ceil(value)
    case 'standard':
    default:
      return Math.round(value)
  }
}

/**
 * Convierte un porcentaje a puntos usando el porcentaje por punto configurado,
 * aplicando el tipo de redondeo especificado.
 * @param percentage - Porcentaje a convertir
 * @param percentagePerPoint - Porcentaje que representa un punto
 * @param roundingType - Tipo de redondeo a aplicar
 * @returns Puntos calculados con el redondeo aplicado
 */
export function percentageToPoints(
  percentage: number,
  percentagePerPoint: number,
  roundingType: RoundingType = 'standard'
): number {
  const points = percentage / percentagePerPoint
  return applyRounding(points, roundingType)
}

/**
 * Calcula el estado de progreso basado en los parámetros dados.
 * Esta función centraliza la lógica que antes estaba duplicada en:
 * - ProgressBar.tsx
 * - ProgressVisualization.tsx
 * - Dashboard.tsx
 */
export function getProgressStatus(params: ProgressParams): StatusInfo {
  const { current, evaluated, passingPoint, target, label } = params
  
  const percentageOfEvaluated = evaluated > 0 ? (current / evaluated) * 100 : 0
  const remainingWeight = target - evaluated
  const maxPossiblePercentage = current + remainingWeight
  const canStillPass = maxPossiblePercentage >= passingPoint
  const neededFromRemaining = Math.max(0, passingPoint - current)
  const neededPercentFromRemaining = remainingWeight > 0 
    ? (neededFromRemaining / remainingWeight) * 100 
    : 0

  // Sin evaluaciones
  if (evaluated === 0) {
    return {
      status: 'no_evaluations',
      label: 'Sin evaluaciones',
      details: `No hay evaluaciones${label ? ` de ${label.toLowerCase()}` : ''} completadas aún`
    }
  }

  // Ya aprobado
  if (current >= passingPoint) {
    const highPerformance = evaluated >= (target * 0.75)
    return {
      status: 'approved',
      label: highPerformance ? 'Aprobado (alto rendimiento)' : 'Aprobado',
      details: `Has obtenido ${current.toFixed(1)}% de ${evaluated.toFixed(1)}% evaluado (${percentageOfEvaluated.toFixed(1)}% de rendimiento).${remainingWeight > 0 ? ` Quedan ${remainingWeight.toFixed(1)}% por evaluar.` : ''}`
    }
  }

  // Imposible aprobar
  if (!canStillPass) {
    return {
      status: 'impossible',
      label: 'Imposible aprobar',
      details: `Has obtenido ${current.toFixed(1)}% de ${evaluated.toFixed(1)}% evaluado. No es posible alcanzar el ${passingPoint.toFixed(1)}% necesario con los ${remainingWeight.toFixed(1)}% restantes.`
    }
  }

  // Calcular rendimiento
  let status: ProgressStatus
  let statusLabel: string

  if (percentageOfEvaluated >= 70) {
    status = 'high_performance'
    statusLabel = 'Rendimiento alto'
  } else if (percentageOfEvaluated >= 40) {
    status = 'medium_performance'
    statusLabel = 'Rendimiento moderado'
  } else {
    status = 'low_performance'
    statusLabel = 'Rendimiento bajo'
  }

  return {
    status,
    label: statusLabel,
    details: `Has obtenido ${current.toFixed(1)}% de ${evaluated.toFixed(1)}% evaluado (${percentageOfEvaluated.toFixed(1)}% de rendimiento). Necesitas obtener ${neededFromRemaining.toFixed(1)}% de los ${remainingWeight.toFixed(1)}% restantes (${neededPercentFromRemaining.toFixed(1)}% de rendimiento).`
  }
}

/**
 * Calcula métricas de progreso útiles para la UI
 */
export function calculateProgressMetrics(params: ProgressParams) {
  const { current, evaluated, passingPoint, target } = params
  
  return {
    currentPercent: (current / target) * 100,
    evaluatedPercent: (evaluated / target) * 100,
    passingPercent: (passingPoint / target) * 100,
    percentageOfEvaluated: evaluated > 0 ? (current / evaluated) * 100 : 0,
    remainingWeight: target - evaluated,
    maxPossiblePercentage: current + (target - evaluated),
    canStillPass: current + (target - evaluated) >= passingPoint,
    neededFromRemaining: Math.max(0, passingPoint - current)
  }
}

/**
 * Calcula el porcentaje obtenido de una evaluación sumativa basado en sus sub-evaluaciones
 * Suma las contribuciones de cada sub-evaluación completada
 */
export function calculateSummativePercentage(evaluation: Evaluation): number {
  if (!evaluation.isSummative || !evaluation.subEvaluations || evaluation.subEvaluations.length === 0) {
    return 0
  }

  // Calcular la suma de las contribuciones de cada sub-evaluación completada
  // Cada sub-evaluación contribuye: (obtainedPoints / maxPoints) * subWeight
  const totalPercentage = evaluation.subEvaluations.reduce((sum, sub) => {
    if (sub.obtainedPoints !== undefined) {
      const subContribution = (sub.obtainedPoints / sub.maxPoints) * sub.weight
      return sum + subContribution
    }
    return sum
  }, 0)

  return totalPercentage
}

export function calculateCurrentPercentage(
  evaluations: Evaluation[],
  section?: 'theory' | 'practice'
): number {
  const filteredEvals = section
    ? evaluations.filter(e => e.section === section)
    : evaluations

  const totalObtained = filteredEvals.reduce((sum, eval_) => {
    if (eval_.isSummative && eval_.subEvaluations && eval_.subEvaluations.length > 0) {
      // Para evaluaciones sumativas, calcular basado en sub-evaluaciones
      return sum + calculateSummativePercentage(eval_)
    } else if (eval_.obtainedPoints !== undefined) {
      // Para evaluaciones normales
      const percentage = (eval_.obtainedPoints / eval_.maxPoints) * eval_.weight
      return sum + percentage
    }
    return sum
  }, 0)

  return totalObtained
}

/**
 * Determina si una evaluación está completa (tiene nota o todas sus sub-evaluaciones tienen nota)
 */
function isEvaluationFullyComplete(evaluation: Evaluation): boolean {
  if (evaluation.isSummative && evaluation.subEvaluations && evaluation.subEvaluations.length > 0) {
    // Una evaluación sumativa está completa si todas sus sub-evaluaciones tienen nota
    return evaluation.subEvaluations.every(sub => sub.obtainedPoints !== undefined)
  }
  // Una evaluación normal está completa si tiene nota
  return evaluation.obtainedPoints !== undefined
}

/**
 * Determina si una evaluación está pendiente (no tiene nota o no todas sus sub-evaluaciones tienen nota)
 */
function isEvaluationPending(evaluation: Evaluation): boolean {
  return !isEvaluationFullyComplete(evaluation)
}

export function calculateRequiredNotes(
  subject: Subject,
  config: Config,
  targetPercentage: number = config.passingPercentage
): CalculationResult {
  const { evaluations, hasSplit, theoryWeight, practiceWeight } = subject
  const roundingType = config.roundingType || 'standard'

  const pendingEvaluations = evaluations.filter(isEvaluationPending)
  const completedEvaluations = evaluations.filter(isEvaluationFullyComplete)

  if (hasSplit && theoryWeight && practiceWeight) {
    // Usar todas las evaluaciones para calcular el porcentaje actual (no solo las completas)
    // calculateCurrentPercentage ya maneja correctamente las evaluaciones parcialmente completadas
    const currentTheoryPercentage = calculateCurrentPercentage(evaluations, 'theory')
    const currentPracticePercentage = calculateCurrentPercentage(evaluations, 'practice')
    
    const theoryTarget = (theoryWeight * config.passingPercentage) / 100
    const practiceTarget = (practiceWeight * config.passingPercentage) / 100
    
    const theoryNeeded = Math.max(0, theoryTarget - currentTheoryPercentage)
    const practiceNeeded = Math.max(0, practiceTarget - currentPracticePercentage)
    
    const pendingTheory = pendingEvaluations.filter(e => e.section === 'theory')
    const pendingPractice = pendingEvaluations.filter(e => e.section === 'practice')
    
    // Para evaluaciones sumativas, necesitamos calcular notas para las sub-evaluaciones pendientes
    const requiredNotes: { evaluationId: string; pessimistic: number; normal: number; optimistic: number }[] = []
    
    for (const eval_ of pendingEvaluations) {
      if (eval_.isSummative && eval_.subEvaluations && eval_.subEvaluations.length > 0) {
        // Para evaluaciones sumativas, calcular notas para cada sub-evaluación pendiente
        const pendingSubs = eval_.subEvaluations.filter(sub => sub.obtainedPoints === undefined)
        
        // Calcular el porcentaje actual de la evaluación sumativa
        const currentSummativePercentage = calculateSummativePercentage(eval_)
        const isTheory = eval_.section === 'theory'
        const needed = isTheory ? theoryNeeded : practiceNeeded
        const pending = isTheory ? pendingTheory : pendingPractice
        
        // Calcular cuánto porcentaje falta para completar la evaluación sumativa
        // El porcentaje que falta es la diferencia entre lo necesario y lo obtenido
        const neededFromSummative = Math.max(0, needed - currentSummativePercentage)
        
        // El peso total de las sub-evaluaciones pendientes
        const totalPendingSubWeight = pendingSubs.reduce((sum, sub) => sum + sub.weight, 0)
        
        // Para cada sub-evaluación pendiente, calcular la nota necesaria
        // El porcentaje necesario se distribuye proporcionalmente al peso de cada sub-evaluación
        for (const subEval of pendingSubs) {
          // Calcular el porcentaje necesario para esta sub-evaluación
          const subNeeded = totalPendingSubWeight > 0 
            ? (neededFromSummative * subEval.weight) / totalPendingSubWeight
            : neededFromSummative / pendingSubs.length
          
          // Usar todas las evaluaciones pendientes (incluyendo otras sumativas) para el cálculo
          const subPending = pending
          const subCompleted = completedEvaluations.filter(e => e.section === eval_.section)
          
          requiredNotes.push({
            evaluationId: subEval.id,
            pessimistic: calculatePessimisticNote(subEval, subNeeded, subPending, roundingType),
            normal: calculateNormalNote(subEval, subCompleted, subNeeded, subPending, roundingType),
            optimistic: calculateOptimisticNote(subEval, subNeeded, subPending, targetPercentage, roundingType)
          })
        }
      } else {
        // Para evaluaciones normales
        const isTheory = eval_.section === 'theory'
        const needed = isTheory ? theoryNeeded : practiceNeeded
        const pending = isTheory ? pendingTheory : pendingPractice
        const completed = completedEvaluations.filter(e => e.section === eval_.section)
        
        requiredNotes.push({
          evaluationId: eval_.id,
          pessimistic: calculatePessimisticNote(eval_, needed, pending, roundingType),
          normal: calculateNormalNote(eval_, completed, needed, pending, roundingType),
          optimistic: calculateOptimisticNote(eval_, needed, pending, targetPercentage, roundingType)
        })
      }
    }
    
    return {
      currentPercentage: currentTheoryPercentage + currentPracticePercentage,
      currentTheoryPercentage,
      currentPracticePercentage,
      isApproved: currentTheoryPercentage >= theoryTarget && currentPracticePercentage >= practiceTarget,
      theoryApproved: currentTheoryPercentage >= theoryTarget,
      practiceApproved: currentPracticePercentage >= practiceTarget,
      requiredNotes
    }
  } else {
    // Usar todas las evaluaciones para calcular el porcentaje actual (no solo las completas)
    // calculateCurrentPercentage ya maneja correctamente las evaluaciones parcialmente completadas
    const currentPercentage = calculateCurrentPercentage(evaluations)
    const needed = Math.max(0, targetPercentage - currentPercentage)
    
    // Para evaluaciones sumativas, necesitamos calcular notas para las sub-evaluaciones pendientes
    const requiredNotes: { evaluationId: string; pessimistic: number; normal: number; optimistic: number }[] = []
    
    for (const eval_ of pendingEvaluations) {
      if (eval_.isSummative && eval_.subEvaluations && eval_.subEvaluations.length > 0) {
        // Para evaluaciones sumativas, calcular notas para cada sub-evaluación pendiente
        const pendingSubs = eval_.subEvaluations.filter(sub => sub.obtainedPoints === undefined)
        
        // Calcular el porcentaje actual de la evaluación sumativa
        const currentSummativePercentage = calculateSummativePercentage(eval_)
        
        // Calcular cuánto porcentaje falta obtener de la evaluación sumativa para alcanzar el objetivo
        // Primero, restamos la contribución actual de la sumativa del porcentaje total actual
        // Luego, calculamos cuánto porcentaje falta cubrir con la sumativa, relativo a su peso
        const nonSummativeCurrent = currentPercentage - currentSummativePercentage
        const neededFromSummative = Math.max(0, (targetPercentage - nonSummativeCurrent) / eval_.weight * 100 - (currentSummativePercentage / eval_.weight * 100))
        
        // El peso total de las sub-evaluaciones pendientes
        const totalPendingSubWeight = pendingSubs.reduce((sum, sub) => sum + sub.weight, 0)
        
        // Para cada sub-evaluación pendiente, calcular la nota necesaria
        // El porcentaje necesario se distribuye proporcionalmente al peso de cada sub-evaluación
        for (const subEval of pendingSubs) {
          // Calcular el porcentaje necesario para esta sub-evaluación
          const subNeeded = totalPendingSubWeight > 0 
            ? (neededFromSummative * subEval.weight) / totalPendingSubWeight
            : neededFromSummative / pendingSubs.length
          
          requiredNotes.push({
            evaluationId: subEval.id,
            pessimistic: calculatePessimisticNote(subEval, subNeeded, pendingEvaluations, roundingType),
            normal: calculateNormalNote(subEval, completedEvaluations, subNeeded, pendingEvaluations, roundingType),
            optimistic: calculateOptimisticNote(subEval, subNeeded, pendingEvaluations, targetPercentage, roundingType)
          })
        }
      } else {
        // Para evaluaciones normales
        requiredNotes.push({
          evaluationId: eval_.id,
          pessimistic: calculatePessimisticNote(eval_, needed, pendingEvaluations, roundingType),
          normal: calculateNormalNote(eval_, completedEvaluations, needed, pendingEvaluations, roundingType),
          optimistic: calculateOptimisticNote(eval_, needed, pendingEvaluations, targetPercentage, roundingType)
        })
      }
    }
    
    return {
      currentPercentage,
      isApproved: currentPercentage >= config.passingPercentage,
      requiredNotes
    }
  }
}

function calculatePessimisticNote(
  evaluation: Evaluation,
  neededPercentage: number,
  pendingEvaluations: Evaluation[],
  roundingType: RoundingType = 'standard'
): number {
  if (pendingEvaluations.length === 0) return 0
  
  const totalPendingWeight = pendingEvaluations.reduce((sum, e) => sum + e.weight, 0)
  
  const sortedByWeight = [...pendingEvaluations].sort((a, b) => b.weight - a.weight)
  const evalIndex = sortedByWeight.findIndex(e => e.id === evaluation.id)
  
  const inverseWeightFactor = 1 - (evalIndex / pendingEvaluations.length) * 0.4
  
  const adjustedNeeded = neededPercentage * inverseWeightFactor
  const baseShare = adjustedNeeded / pendingEvaluations.length
  
  const percentageContribution = baseShare + (baseShare * (evaluation.weight / totalPendingWeight) * 0.5)
  
  const requiredPointsPercentage = percentageContribution / evaluation.weight
  
  const calculatedPoints = Math.min(evaluation.maxPoints, Math.max(0, requiredPointsPercentage * evaluation.maxPoints))
  
  return applyRounding(calculatedPoints, roundingType)
}

function calculateNormalNote(
  evaluation: Evaluation,
  completedEvaluations: Evaluation[],
  neededPercentage: number,
  pendingEvaluations: Evaluation[],
  roundingType: RoundingType = 'standard'
): number {
  if (pendingEvaluations.length === 0) return 0
  
  const totalPendingWeight = pendingEvaluations.reduce((sum, e) => sum + e.weight, 0)
  
  let targetPercentageForEval: number
  
  if (completedEvaluations.length === 0) {
    targetPercentageForEval = 0.6
  } else {
    const similarWeight = completedEvaluations.find(e => 
      Math.abs(e.weight - evaluation.weight) < 5
    )
    
    if (similarWeight) {
      targetPercentageForEval = similarWeight.obtainedPoints! / similarWeight.maxPoints
    } else {
      const averagePercentage = completedEvaluations.reduce((sum, eval_) => {
        return sum + (eval_.obtainedPoints! / eval_.maxPoints)
      }, 0) / completedEvaluations.length
      targetPercentageForEval = averagePercentage
    }
  }
  
  const sortedByWeight = [...pendingEvaluations].sort((a, b) => b.weight - a.weight)
  const evalIndex = sortedByWeight.findIndex(e => e.id === evaluation.id)
  
  const weightRatio = evaluation.weight / totalPendingWeight
  const balanceFactor = 1 - (evalIndex / pendingEvaluations.length) * 0.2
  
  const percentageForThisEval = (neededPercentage * weightRatio) * balanceFactor
  const requiredPercentage = Math.max(targetPercentageForEval, percentageForThisEval / evaluation.weight)
  
  const calculatedPoints = Math.min(evaluation.maxPoints, Math.max(0, requiredPercentage * evaluation.maxPoints))
  
  return applyRounding(calculatedPoints, roundingType)
}

function calculateOptimisticNote(
  evaluation: Evaluation,
  neededPercentage: number,
  pendingEvaluations: Evaluation[],
  targetPercentage: number,
  roundingType: RoundingType = 'standard'
): number {
  if (pendingEvaluations.length === 0) return 0
  
  const totalPendingWeight = pendingEvaluations.reduce((sum, e) => sum + e.weight, 0)
  
  const sortedByWeight = [...pendingEvaluations].sort((a, b) => a.weight - b.weight)
  const evalIndex = sortedByWeight.findIndex(e => e.id === evaluation.id)
  
  const weightRatio = evaluation.weight / totalPendingWeight
  const optimisticFactor = 1 + (evalIndex / pendingEvaluations.length) * 0.15
  
  const percentageForThisEval = (neededPercentage * weightRatio) * optimisticFactor
  const requiredPercentage = percentageForThisEval / evaluation.weight
  
  const targetNotePercentage = targetPercentage / 100
  const aspirationalNote = targetNotePercentage * evaluation.maxPoints
  
  const calculatedNote = Math.min(evaluation.maxPoints, Math.max(0, requiredPercentage * evaluation.maxPoints))
  const finalNote = Math.max(calculatedNote, Math.min(evaluation.maxPoints, aspirationalNote))
  
  return applyRounding(finalNote, roundingType)
}

export function validateWeights(subject: Subject): { isValid: boolean; message?: string } {
  if (subject.hasSplit) {
    if (!subject.theoryWeight || !subject.practiceWeight) {
      return { isValid: false, message: 'Debe definir pesos para teoría y práctica' }
    }
    
    if (subject.theoryWeight + subject.practiceWeight !== 100) {
      return { isValid: false, message: 'Los pesos de teoría y práctica deben sumar 100%' }
    }
    
    const theoryEvals = subject.evaluations.filter(e => e.section === 'theory')
    const practiceEvals = subject.evaluations.filter(e => e.section === 'practice')
    
    // Solo contar el peso de las evaluaciones principales (las sub-evaluaciones ya están incluidas en el peso de la sumativa)
    const theorySum = theoryEvals.reduce((sum, e) => sum + e.weight, 0)
    const practiceSum = practiceEvals.reduce((sum, e) => sum + e.weight, 0)
    
    if (theorySum !== subject.theoryWeight && theoryEvals.length > 0) {
      return { isValid: false, message: `Las evaluaciones de teoría deben sumar ${subject.theoryWeight}%` }
    }
    
    if (practiceSum !== subject.practiceWeight && practiceEvals.length > 0) {
      return { isValid: false, message: `Las evaluaciones de práctica deben sumar ${subject.practiceWeight}%` }
    }
  } else {
    // Solo contar el peso de las evaluaciones principales (las sub-evaluaciones ya están incluidas en el peso de la sumativa)
    const totalWeight = subject.evaluations.reduce((sum, e) => sum + e.weight, 0)
    
    if (totalWeight !== 100 && subject.evaluations.length > 0) {
      return { isValid: false, message: 'Las evaluaciones deben sumar 100%' }
    }
  }
  
  return { isValid: true }
}
