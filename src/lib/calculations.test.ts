import { describe, it, expect } from 'vitest'
import {
  applyRounding,
  percentageToPoints,
  getProgressStatus,
  calculateProgressMetrics,
  calculateSummativePercentage,
  calculateCurrentPercentage,
  calculateRequiredNotes,
  validateWeights,
} from './calculations'
import type { Evaluation, Subject, Config } from '../types'

// ── Helpers ────────────────────────────────────────────────────────────────

function makeEval(overrides: Partial<Evaluation> & { id: string }): Evaluation {
  return {
    name: 'Eval',
    weight: 20,
    maxPoints: 20,
    ...overrides,
  }
}

const defaultConfig: Config = {
  defaultMaxPoints: 20,
  percentagePerPoint: 5,
  passingPercentage: 60,
  roundingType: 'standard',
}

function makeSubject(evaluations: Evaluation[], overrides: Partial<Subject> = {}): Subject {
  return {
    id: 's1',
    name: 'Materia',
    hasSplit: false,
    evaluations,
    ...overrides,
  }
}

// ── applyRounding ──────────────────────────────────────────────────────────

describe('applyRounding', () => {
  it('rounds to nearest integer by default', () => {
    expect(applyRounding(4.5)).toBe(5)
    expect(applyRounding(4.4)).toBe(4)
  })

  it('floors when type is floor', () => {
    expect(applyRounding(4.9, 'floor')).toBe(4)
    expect(applyRounding(4.1, 'floor')).toBe(4)
  })

  it('ceils when type is ceil', () => {
    expect(applyRounding(4.1, 'ceil')).toBe(5)
    expect(applyRounding(4.0, 'ceil')).toBe(4)
  })
})

// ── percentageToPoints ─────────────────────────────────────────────────────

describe('percentageToPoints', () => {
  it('converts percentage to points correctly', () => {
    // 60% / 5 (percentagePerPoint) = 12 points
    expect(percentageToPoints(60, 5)).toBe(12)
  })

  it('applies rounding type', () => {
    // 61% / 5 = 12.2 → floor → 12
    expect(percentageToPoints(61, 5, 'floor')).toBe(12)
    // 61% / 5 = 12.2 → ceil → 13
    expect(percentageToPoints(61, 5, 'ceil')).toBe(13)
  })
})

// ── getProgressStatus ──────────────────────────────────────────────────────

describe('getProgressStatus', () => {
  const base = { target: 100, passingPoint: 60 }

  it('returns no_evaluations when evaluated is 0', () => {
    const result = getProgressStatus({ ...base, current: 0, evaluated: 0 })
    expect(result.status).toBe('no_evaluations')
  })

  it('returns approved when current >= passingPoint', () => {
    const result = getProgressStatus({ ...base, current: 60, evaluated: 80 })
    expect(result.status).toBe('approved')
  })

  it('returns approved with high_performance label when >= 75% evaluated', () => {
    const result = getProgressStatus({ ...base, current: 60, evaluated: 80 })
    expect(result.label).toContain('alto rendimiento')
  })

  it('returns impossible when max possible is below passingPoint', () => {
    // current=10, evaluated=80, remaining=20 → max=30 < 60
    const result = getProgressStatus({ ...base, current: 10, evaluated: 80 })
    expect(result.status).toBe('impossible')
  })

  it('returns high_performance when >= 70% of evaluated', () => {
    // current=14, evaluated=20 → 70% performance
    const result = getProgressStatus({ ...base, current: 14, evaluated: 20 })
    expect(result.status).toBe('high_performance')
  })

  it('returns medium_performance when 40-70% of evaluated', () => {
    // current=9, evaluated=20 → 45% performance
    const result = getProgressStatus({ ...base, current: 9, evaluated: 20 })
    expect(result.status).toBe('medium_performance')
  })

  it('returns low_performance when < 40% of evaluated', () => {
    // current=6, evaluated=20 → 30% performance
    const result = getProgressStatus({ ...base, current: 6, evaluated: 20 })
    expect(result.status).toBe('low_performance')
  })
})

// ── calculateProgressMetrics ───────────────────────────────────────────────

describe('calculateProgressMetrics', () => {
  it('calculates all metrics correctly', () => {
    const metrics = calculateProgressMetrics({
      current: 40,
      evaluated: 60,
      passingPoint: 60,
      target: 100,
    })
    expect(metrics.remainingWeight).toBe(40)
    expect(metrics.maxPossiblePercentage).toBe(80)
    expect(metrics.canStillPass).toBe(true)
    expect(metrics.neededFromRemaining).toBe(20)
    expect(metrics.percentageOfEvaluated).toBeCloseTo(66.67, 1)
  })

  it('canStillPass is false when impossible', () => {
    const metrics = calculateProgressMetrics({
      current: 10,
      evaluated: 80,
      passingPoint: 60,
      target: 100,
    })
    expect(metrics.canStillPass).toBe(false)
  })

  it('percentageOfEvaluated is 0 when evaluated is 0', () => {
    const metrics = calculateProgressMetrics({
      current: 0,
      evaluated: 0,
      passingPoint: 60,
      target: 100,
    })
    expect(metrics.percentageOfEvaluated).toBe(0)
  })
})

// ── calculateSummativePercentage ───────────────────────────────────────────

describe('calculateSummativePercentage', () => {
  it('returns 0 for non-summative evaluations', () => {
    const eval_ = makeEval({ id: 'e1', isSummative: false })
    expect(calculateSummativePercentage(eval_)).toBe(0)
  })

  it('returns 0 when subEvaluations is empty', () => {
    const eval_ = makeEval({ id: 'e1', isSummative: true, subEvaluations: [] })
    expect(calculateSummativePercentage(eval_)).toBe(0)
  })

  it('sums contributions of completed sub-evaluations', () => {
    // subA: 15/20 * 10 = 7.5, subB: 10/20 * 10 = 5 → total 12.5
    const eval_ = makeEval({
      id: 'e1',
      isSummative: true,
      subEvaluations: [
        makeEval({ id: 's1', weight: 10, maxPoints: 20, obtainedPoints: 15 }),
        makeEval({ id: 's2', weight: 10, maxPoints: 20, obtainedPoints: 10 }),
      ],
    })
    expect(calculateSummativePercentage(eval_)).toBeCloseTo(12.5)
  })

  it('ignores sub-evaluations without obtainedPoints', () => {
    // subA: 15/20 * 10 = 7.5, subB: pending → 0
    const eval_ = makeEval({
      id: 'e1',
      isSummative: true,
      subEvaluations: [
        makeEval({ id: 's1', weight: 10, maxPoints: 20, obtainedPoints: 15 }),
        makeEval({ id: 's2', weight: 10, maxPoints: 20 }), // no obtainedPoints
      ],
    })
    expect(calculateSummativePercentage(eval_)).toBeCloseTo(7.5)
  })
})

// ── calculateCurrentPercentage ─────────────────────────────────────────────

describe('calculateCurrentPercentage', () => {
  it('returns 0 when no evaluations have grades', () => {
    const evals = [makeEval({ id: 'e1' }), makeEval({ id: 'e2' })]
    expect(calculateCurrentPercentage(evals)).toBe(0)
  })

  it('sums percentage contributions from completed evaluations', () => {
    // e1: 16/20 * 30 = 24, e2: 18/20 * 30 = 27 → total 51
    const evals = [
      makeEval({ id: 'e1', weight: 30, maxPoints: 20, obtainedPoints: 16 }),
      makeEval({ id: 'e2', weight: 30, maxPoints: 20, obtainedPoints: 18 }),
    ]
    expect(calculateCurrentPercentage(evals)).toBeCloseTo(51)
  })

  it('filters by section when specified', () => {
    const evals = [
      makeEval({ id: 'e1', weight: 30, maxPoints: 20, obtainedPoints: 20, section: 'theory' }),
      makeEval({ id: 'e2', weight: 30, maxPoints: 20, obtainedPoints: 20, section: 'practice' }),
    ]
    expect(calculateCurrentPercentage(evals, 'theory')).toBeCloseTo(30)
    expect(calculateCurrentPercentage(evals, 'practice')).toBeCloseTo(30)
  })

  it('handles summative evaluations via sub-evaluations', () => {
    // subA: 20/20 * 20 = 20 → total from summative = 20
    const evals = [
      makeEval({
        id: 'e1',
        isSummative: true,
        weight: 20,
        subEvaluations: [
          makeEval({ id: 's1', weight: 20, maxPoints: 20, obtainedPoints: 20 }),
        ],
      }),
    ]
    expect(calculateCurrentPercentage(evals)).toBeCloseTo(20)
  })
})

// ── validateWeights ────────────────────────────────────────────────────────

describe('validateWeights', () => {
  it('is valid for a subject with no evaluations', () => {
    const subject = makeSubject([])
    expect(validateWeights(subject).isValid).toBe(true)
  })

  it('is valid when evaluations sum to 100%', () => {
    const evals = [
      makeEval({ id: 'e1', weight: 60 }),
      makeEval({ id: 'e2', weight: 40 }),
    ]
    expect(validateWeights(makeSubject(evals)).isValid).toBe(true)
  })

  it('is invalid when evaluations do not sum to 100%', () => {
    const evals = [makeEval({ id: 'e1', weight: 60 })]
    const result = validateWeights(makeSubject(evals))
    expect(result.isValid).toBe(false)
    expect(result.message).toBeDefined()
  })

  it('is invalid for split subject when theory + practice != 100', () => {
    const subject = makeSubject([], {
      hasSplit: true,
      theoryWeight: 60,
      practiceWeight: 30,
    })
    const result = validateWeights(subject)
    expect(result.isValid).toBe(false)
  })

  it('is valid for split subject when weights sum to 100 and no evals', () => {
    const subject = makeSubject([], {
      hasSplit: true,
      theoryWeight: 60,
      practiceWeight: 40,
    })
    expect(validateWeights(subject).isValid).toBe(true)
  })

  it('is invalid for split subject when section evals do not match section weight', () => {
    const subject = makeSubject(
      [makeEval({ id: 'e1', weight: 50, section: 'theory' })],
      { hasSplit: true, theoryWeight: 60, practiceWeight: 40 }
    )
    const result = validateWeights(subject)
    expect(result.isValid).toBe(false)
    expect(result.message).toContain('teoría')
  })
})

// ── calculateRequiredNotes ─────────────────────────────────────────────────

describe('calculateRequiredNotes', () => {
  describe('no split', () => {
    it('reports approved when all evaluations pass the threshold', () => {
      // 20/20 * 100 = 100% → approved
      const evals = [makeEval({ id: 'e1', weight: 100, maxPoints: 20, obtainedPoints: 20 })]
      const result = calculateRequiredNotes(makeSubject(evals), defaultConfig)
      expect(result.isApproved).toBe(true)
      expect(result.requiredNotes).toHaveLength(0)
    })

    it('calculates required notes for pending evaluations', () => {
      // e1 done: 12/20 * 50 = 30%; e2 pending weight 50; need 60 total → 30 more from e2
      const evals = [
        makeEval({ id: 'e1', weight: 50, maxPoints: 20, obtainedPoints: 12 }),
        makeEval({ id: 'e2', weight: 50, maxPoints: 20 }),
      ]
      const result = calculateRequiredNotes(makeSubject(evals), defaultConfig)
      expect(result.isApproved).toBe(false)
      expect(result.requiredNotes).toHaveLength(1)
      expect(result.requiredNotes[0].evaluationId).toBe('e2')
      // all modes should return a value between 0 and maxPoints
      const { pessimistic, normal, optimistic } = result.requiredNotes[0]
      expect(pessimistic).toBeGreaterThanOrEqual(0)
      expect(pessimistic).toBeLessThanOrEqual(20)
      expect(normal).toBeGreaterThanOrEqual(0)
      expect(optimistic).toBeGreaterThanOrEqual(normal)
    })

    it('all notes are 0 when no evaluations are pending', () => {
      const evals = [makeEval({ id: 'e1', weight: 100, maxPoints: 20, obtainedPoints: 8 })]
      const result = calculateRequiredNotes(makeSubject(evals), defaultConfig)
      expect(result.requiredNotes).toHaveLength(0)
    })

    it('returns currentPercentage = 0 when no evaluations are graded', () => {
      const evals = [
        makeEval({ id: 'e1', weight: 50 }),
        makeEval({ id: 'e2', weight: 50 }),
      ]
      const result = calculateRequiredNotes(makeSubject(evals), defaultConfig)
      expect(result.currentPercentage).toBe(0)
      expect(result.requiredNotes).toHaveLength(2)
    })

    it('respects custom passingPercentage', () => {
      // With 70% passing requirement, harder to approve
      const config = { ...defaultConfig, passingPercentage: 70 }
      const evals = [
        makeEval({ id: 'e1', weight: 50, maxPoints: 20, obtainedPoints: 12 }), // 30%
        makeEval({ id: 'e2', weight: 50, maxPoints: 20 }),
      ]
      const result = calculateRequiredNotes(makeSubject(evals), config)
      expect(result.isApproved).toBe(false)
      expect(result.requiredNotes[0].pessimistic).toBeGreaterThan(0)
    })
  })

  describe('with theory/practice split', () => {
    it('tracks theory and practice percentages separately', () => {
      const evals = [
        makeEval({ id: 'e1', weight: 60, maxPoints: 20, obtainedPoints: 20, section: 'theory' }),
        makeEval({ id: 'e2', weight: 40, maxPoints: 20, section: 'practice' }),
      ]
      const subject = makeSubject(evals, {
        hasSplit: true,
        theoryWeight: 60,
        practiceWeight: 40,
      })
      const result = calculateRequiredNotes(subject, defaultConfig)
      expect(result.currentTheoryPercentage).toBeCloseTo(60)
      expect(result.currentPracticePercentage).toBe(0)
      expect(result.theoryApproved).toBe(true)
      expect(result.practiceApproved).toBe(false)
      expect(result.isApproved).toBe(false)
    })

    it('is approved only when both sections pass', () => {
      const evals = [
        makeEval({ id: 'e1', weight: 60, maxPoints: 20, obtainedPoints: 20, section: 'theory' }),
        makeEval({ id: 'e2', weight: 40, maxPoints: 20, obtainedPoints: 20, section: 'practice' }),
      ]
      const subject = makeSubject(evals, {
        hasSplit: true,
        theoryWeight: 60,
        practiceWeight: 40,
      })
      const result = calculateRequiredNotes(subject, defaultConfig)
      expect(result.theoryApproved).toBe(true)
      expect(result.practiceApproved).toBe(true)
      expect(result.isApproved).toBe(true)
    })
  })

  describe('summative evaluations', () => {
    it('generates required notes for pending sub-evaluations', () => {
      const evals = [
        makeEval({
          id: 'e1',
          isSummative: true,
          weight: 100,
          subEvaluations: [
            makeEval({ id: 's1', weight: 50, maxPoints: 20, obtainedPoints: 10 }),
            makeEval({ id: 's2', weight: 50, maxPoints: 20 }), // pending
          ],
        }),
      ]
      const result = calculateRequiredNotes(makeSubject(evals), defaultConfig)
      expect(result.requiredNotes).toHaveLength(1)
      expect(result.requiredNotes[0].evaluationId).toBe('s2')
    })
  })
})
