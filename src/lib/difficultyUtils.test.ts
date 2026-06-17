import { describe, it, expect } from 'vitest'
import {
  getDifficultyLabel,
  getDifficultyColor,
  getDifficultyMultiplier,
  getEffectiveDifficulty,
  normalizeDifficultyFactor,
} from './difficultyUtils'

describe('difficultyUtils', () => {
  describe('getDifficultyLabel', () => {
    it('returns Spanish labels for difficulty levels', () => {
      expect(getDifficultyLabel('easy')).toBe('Fácil')
      expect(getDifficultyLabel('normal')).toBe('Normal')
      expect(getDifficultyLabel('hard')).toBe('Difícil')
      expect(getDifficultyLabel('very-hard')).toBe('Muy Difícil')
    })

    it('returns "Sin especificar" for undefined', () => {
      expect(getDifficultyLabel(undefined)).toBe('Sin especificar')
    })
  })

  describe('getDifficultyColor', () => {
    it('returns color classes for each difficulty level', () => {
      const easyColor = getDifficultyColor('easy')
      expect(easyColor).toContain('green')

      const normalColor = getDifficultyColor('normal')
      expect(normalColor).toContain('blue')

      const hardColor = getDifficultyColor('hard')
      expect(hardColor).toContain('orange')

      const veryHardColor = getDifficultyColor('very-hard')
      expect(veryHardColor).toContain('red')
    })

    it('returns gray for undefined', () => {
      expect(getDifficultyColor(undefined)).toContain('gray')
    })
  })

  describe('getDifficultyMultiplier', () => {
    it('returns correct multipliers', () => {
      expect(getDifficultyMultiplier('easy')).toBe(0.8)
      expect(getDifficultyMultiplier('normal')).toBe(1.0)
      expect(getDifficultyMultiplier('hard')).toBe(1.2)
      expect(getDifficultyMultiplier('very-hard')).toBe(1.5)
    })

    it('returns 1.0 for undefined', () => {
      expect(getDifficultyMultiplier(undefined)).toBe(1.0)
    })
  })

  describe('getEffectiveDifficulty', () => {
    it('returns normal when both are undefined', () => {
      expect(getEffectiveDifficulty(undefined, undefined)).toBe('normal')
    })

    it('returns subject difficulty when eval is undefined', () => {
      expect(getEffectiveDifficulty('hard', undefined)).toBe('hard')
      expect(getEffectiveDifficulty('easy', undefined)).toBe('easy')
    })

    it('returns eval difficulty when subject is undefined', () => {
      expect(getEffectiveDifficulty(undefined, 'hard')).toBe('hard')
      expect(getEffectiveDifficulty(undefined, 'easy')).toBe('easy')
    })

    it('combines both difficulties when both are defined', () => {
      // easy + easy = easy (0.8 + 0.8) / 2 = 0.8 < 0.9
      expect(getEffectiveDifficulty('easy', 'easy')).toBe('easy')

      // easy + normal = normal (0.8 + 1.0) / 2 = 0.9
      expect(getEffectiveDifficulty('easy', 'normal')).toBe('normal')

      // hard + very-hard = very-hard (1.2 + 1.5) / 2 = 1.35
      expect(getEffectiveDifficulty('hard', 'very-hard')).toBe('very-hard')
    })
  })

  describe('normalizeDifficultyFactor', () => {
    it('returns 0 for easy', () => {
      expect(normalizeDifficultyFactor('easy')).toBe(0)
    })

    it('returns 1 for very-hard', () => {
      expect(normalizeDifficultyFactor('very-hard')).toBe(1)
    })

    it('returns ~0.29 for normal', () => {
      const factor = normalizeDifficultyFactor('normal')
      expect(factor).toBeCloseTo(0.286, 1)
    })

    it('returns ~0.29 for hard', () => {
      const factor = normalizeDifficultyFactor('hard')
      expect(factor).toBeCloseTo(0.571, 1)
    })
  })
})
