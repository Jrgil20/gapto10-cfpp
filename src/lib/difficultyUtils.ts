import { DifficultyLevel } from '../types'

export function getDifficultyLabel(level?: DifficultyLevel): string {
  switch (level) {
    case 'easy':
      return 'Fácil'
    case 'normal':
      return 'Normal'
    case 'hard':
      return 'Difícil'
    case 'very-hard':
      return 'Muy Difícil'
    default:
      return 'Sin especificar'
  }
}

export function getDifficultyColor(level?: DifficultyLevel): string {
  switch (level) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'normal':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'hard':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'very-hard':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export function getDifficultyMultiplier(level?: DifficultyLevel): number {
  switch (level) {
    case 'easy':
      return 0.8
    case 'normal':
      return 1.0
    case 'hard':
      return 1.2
    case 'very-hard':
      return 1.5
    default:
      return 1.0
  }
}

export function getEffectiveDifficulty(
  subjectDifficulty?: DifficultyLevel,
  evalDifficulty?: DifficultyLevel
): DifficultyLevel {
  if (!subjectDifficulty && !evalDifficulty) return 'normal'
  if (!subjectDifficulty) return evalDifficulty || 'normal'
  if (!evalDifficulty) return subjectDifficulty

  const subjectMult = getDifficultyMultiplier(subjectDifficulty)
  const evalMult = getDifficultyMultiplier(evalDifficulty)
  const avgMult = (subjectMult + evalMult) / 2

  if (avgMult < 0.9) return 'easy'
  if (avgMult < 1.1) return 'normal'
  if (avgMult < 1.35) return 'hard'
  return 'very-hard'
}

export function normalizeDifficultyFactor(level?: DifficultyLevel): number {
  const mult = getDifficultyMultiplier(level)
  return (mult - 0.8) / (1.5 - 0.8)
}
