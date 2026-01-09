import { describe, it, expect } from 'vitest'
import { lessons } from '@/lessons'

describe('Exercise Validators', () => {
  // Collect all exercises from all lessons
  const allExercises = lessons.flatMap(lesson =>
    lesson.sections
      .filter(s => s.type === 'exercise')
      .map(s => ({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        exercise: s.exercise!
      }))
  )

  describe('All exercises have valid structure', () => {
    allExercises.forEach(({ lessonId, lessonTitle, exercise }) => {
      describe(`${lessonTitle} - ${exercise.title}`, () => {
        it('should have an id', () => {
          expect(exercise.id).toBeDefined()
          expect(exercise.id.length).toBeGreaterThan(0)
        })

        it('should have initial code', () => {
          expect(exercise.initialCode).toBeDefined()
        })

        it('should have a solution', () => {
          expect(exercise.solution).toBeDefined()
          expect(exercise.solution.length).toBeGreaterThan(0)
        })

        it('should have at least one hint', () => {
          expect(exercise.hints.length).toBeGreaterThan(0)
        })

        it('should have at least one test case', () => {
          expect(exercise.testCases.length).toBeGreaterThan(0)
        })

        it('solution should pass all test cases', () => {
          exercise.testCases.forEach(tc => {
            const passes = tc.validator(exercise.solution)
            expect(passes).toBe(true)
          })
        })
      })
    })
  })

  describe('Lesson 1 specific exercises', () => {
    const lesson = lessons.find(l => l.id === '01-lean-basics')!
    const exercises = lesson.sections
      .filter(s => s.type === 'exercise')
      .map(s => s.exercise!)

    it('Basic Values exercise should validate def myNumber', () => {
      const ex = exercises.find(e => e.id === 'ex-01-basic-values')!
      const validCode = 'def myNumber : Nat := 42\ndef myName : String := "Alice"'
      const invalidCode = 'def someNumber : Nat := 42'

      expect(ex.testCases[0].validator(validCode)).toBe(true)
      expect(ex.testCases[0].validator(invalidCode)).toBe(false)
    })

    it('Functions exercise should validate square function', () => {
      const ex = exercises.find(e => e.id === 'ex-02-functions')!
      const validCode = 'def square (n : Nat) : Nat := n * n'

      expect(ex.testCases[0].validator(validCode)).toBe(true)
    })

    it('Fibonacci exercise should validate pattern matching', () => {
      const ex = exercises.find(e => e.id === 'ex-04-pattern-matching')!
      const solution = ex.solution

      // Should have base cases
      expect(ex.testCases[0].validator(solution)).toBe(true) // 0 => 0
      expect(ex.testCases[1].validator(solution)).toBe(true) // 1 => 1
    })
  })

  describe('Lesson 2 Polynomial exercises', () => {
    const lesson = lessons.find(l => l.id === '02-polynomials')!
    const exercises = lesson.sections
      .filter(s => s.type === 'exercise')
      .map(s => s.exercise!)

    it('Polynomial structure exercise should validate structure', () => {
      const ex = exercises.find(e => e.id === 'ex-poly-01')!
      const validCode = 'structure Polynomial where\n  coeffs : List Int'

      expect(ex.testCases[0].validator(validCode)).toBe(true)
    })

    it('Horner evaluation exercise should use foldl', () => {
      const ex = exercises.find(e => e.id === 'ex-poly-02')!
      const solution = ex.solution

      expect(ex.testCases[0].validator(solution)).toBe(true)
      expect(ex.testCases[1].validator(solution)).toBe(true) // uses reverse
    })
  })

  describe('Lesson 4 DH exercises', () => {
    const lesson = lessons.find(l => l.id === '04-diffie-hellman')!
    const exercises = lesson.sections
      .filter(s => s.type === 'exercise')
      .map(s => s.exercise!)

    it('modExp exercise should have proper structure', () => {
      const ex = exercises.find(e => e.id === 'ex-dh-01')!
      const solution = ex.solution

      // Should return 1 for base case
      expect(solution.includes('1')).toBe(true)
      // Should have recursive calls
      expect(solution.includes('modExp')).toBe(true)
    })

    it('Shared secret exercise should use modExp correctly', () => {
      const ex = exercises.find(e => e.id === 'ex-dh-03')!
      const solution = ex.solution

      expect(ex.testCases[0].validator(solution)).toBe(true)
      expect(ex.testCases[1].validator(solution)).toBe(true)
    })
  })

  describe('Lesson 6 Lattice exercises', () => {
    const lesson = lessons.find(l => l.id === '06-lattice')!
    const exercises = lesson.sections
      .filter(s => s.type === 'exercise')
      .map(s => s.exercise!)

    it('Vector operations should use zipWith', () => {
      const ex = exercises.find(e => e.id === 'ex-lat-02')!
      const solution = ex.solution

      expect(ex.testCases[1].validator(solution)).toBe(true) // uses zipWith
    })

    it('Dot product should use foldl', () => {
      const ex = exercises.find(e => e.id === 'ex-lat-03')!
      const solution = ex.solution

      expect(ex.testCases[2].validator(solution)).toBe(true) // uses foldl
    })
  })

  describe('Lesson 7 RLWE exercises', () => {
    const lesson = lessons.find(l => l.id === '07-rlwe')!
    const exercises = lesson.sections
      .filter(s => s.type === 'exercise')
      .map(s => s.exercise!)

    it('RingPoly structure should have required fields', () => {
      const ex = exercises.find(e => e.id === 'ex-rlwe-01')!
      const solution = ex.solution

      expect(ex.testCases[0].validator(solution)).toBe(true) // structure RingPoly
      expect(ex.testCases[1].validator(solution)).toBe(true) // has coeffs, n, q
    })

    it('Encode/decode should work correctly', () => {
      const ex = exercises.find(e => e.id === 'ex-rlwe-04')!
      const solution = ex.solution

      expect(ex.testCases[0].validator(solution)).toBe(true) // def encode
      expect(ex.testCases[2].validator(solution)).toBe(true) // def decode
    })
  })

  describe('Lesson 8 Sumcheck exercises', () => {
    const lesson = lessons.find(l => l.id === '08-sumcheck')!
    const exercises = lesson.sections
      .filter(s => s.type === 'exercise')
      .map(s => s.exercise!)

    it('Sumcheck round verification should eval at 0 and 1', () => {
      const ex = exercises.find(e => e.id === 'ex-sum-01')!
      const solution = ex.solution

      expect(ex.testCases[1].validator(solution)).toBe(true) // evaluates at 0
      expect(ex.testCases[2].validator(solution)).toBe(true) // evaluates at 1
    })

    it('Verifier checks should be complete', () => {
      const ex = exercises.find(e => e.id === 'ex-sum-03')!
      const solution = ex.solution

      expect(ex.testCases[0].validator(solution)).toBe(true) // verifyFirstRound
      expect(ex.testCases[2].validator(solution)).toBe(true) // verifyIntermediateRound
      expect(ex.testCases[3].validator(solution)).toBe(true) // verifyFinalRound
    })
  })
})
