import { Subject, Evaluation, Config, CalculationResult } from '../types'

export function calculateCurrentPercentage(
  evaluations: Evaluation[],
  section?: 'theory' | 'practice'
): number {
  const filteredEvals = section
    ? evaluations.filter(e => e.section === section)
    : evaluations

  const totalObtained = filteredEvals.reduce((sum, eval_) => {
    if (eval_.obtainedPoints !== undefined) {
      const percentage = (eval_.obtainedPoints / eval_.maxPoints) * eval_.weight
      return sum + percentage
    }
    return sum
  }, 0)

  return totalObtained
}

export function calculateRequiredNotes(
  subject: Subject,
  config: Config,
  targetPercentage: number = config.passingPercentage
): CalculationResult {
  const { evaluations, hasSplit, theoryWeight, practiceWeight } = subject

  const pendingEvaluations = evaluations.filter(e => e.obtainedPoints === undefined)
  const completedEvaluations = evaluations.filter(e => e.obtainedPoints !== undefined)

  if (hasSplit && theoryWeight && practiceWeight) {
    const currentTheoryPercentage = calculateCurrentPercentage(completedEvaluations, 'theory')
    const currentPracticePercentage = calculateCurrentPercentage(completedEvaluations, 'practice')
    
    const theoryTarget = (theoryWeight * config.passingPercentage) / 100
    const practiceTarget = (practiceWeight * config.passingPercentage) / 100
    
    const theoryNeeded = Math.max(0, theoryTarget - currentTheoryPercentage)
    const practiceNeeded = Math.max(0, practiceTarget - currentPracticePercentage)
    
    const pendingTheory = pendingEvaluations.filter(e => e.section === 'theory')
    const pendingPractice = pendingEvaluations.filter(e => e.section === 'practice')
    
    const requiredNotes = pendingEvaluations.map(eval_ => {
      const isTheory = eval_.section === 'theory'
      const needed = isTheory ? theoryNeeded : practiceNeeded
      const pending = isTheory ? pendingTheory : pendingPractice
      const completed = completedEvaluations.filter(e => e.section === eval_.section)
      
      return {
        evaluationId: eval_.id,
        pessimistic: calculatePessimisticNote(eval_, needed, pending),
        normal: calculateNormalNote(eval_, completed, needed, pending),
        optimistic: calculateOptimisticNote(eval_, needed, pending, targetPercentage)
      }
    })
    
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
    const currentPercentage = calculateCurrentPercentage(completedEvaluations)
    const needed = Math.max(0, targetPercentage - currentPercentage)
    
    const requiredNotes = pendingEvaluations.map(eval_ => ({
      evaluationId: eval_.id,
      pessimistic: calculatePessimisticNote(eval_, needed, pendingEvaluations),
      normal: calculateNormalNote(eval_, completedEvaluations, needed, pendingEvaluations),
      optimistic: calculateOptimisticNote(eval_, needed, pendingEvaluations, targetPercentage)
    }))
    
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
  pendingEvaluations: Evaluation[]
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
  
  return Math.min(evaluation.maxPoints, Math.max(0, requiredPointsPercentage * evaluation.maxPoints))
}

function calculateNormalNote(
  evaluation: Evaluation,
  completedEvaluations: Evaluation[],
  neededPercentage: number,
  pendingEvaluations: Evaluation[]
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
  
  return Math.min(evaluation.maxPoints, Math.max(0, requiredPercentage * evaluation.maxPoints))
}

function calculateOptimisticNote(
  evaluation: Evaluation,
  neededPercentage: number,
  pendingEvaluations: Evaluation[],
  targetPercentage: number
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
  
  return Math.max(calculatedNote, Math.min(evaluation.maxPoints, aspirationalNote))
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
    
    const theorySum = theoryEvals.reduce((sum, e) => sum + e.weight, 0)
    const practiceSum = practiceEvals.reduce((sum, e) => sum + e.weight, 0)
    
    if (theorySum !== subject.theoryWeight && theoryEvals.length > 0) {
      return { isValid: false, message: `Las evaluaciones de teoría deben sumar ${subject.theoryWeight}%` }
    }
    
    if (practiceSum !== subject.practiceWeight && practiceEvals.length > 0) {
      return { isValid: false, message: `Las evaluaciones de práctica deben sumar ${subject.practiceWeight}%` }
    }
  } else {
    const totalWeight = subject.evaluations.reduce((sum, e) => sum + e.weight, 0)
    
    if (totalWeight !== 100 && subject.evaluations.length > 0) {
      return { isValid: false, message: 'Las evaluaciones deben sumar 100%' }
    }
  }
  
  return { isValid: true }
}
