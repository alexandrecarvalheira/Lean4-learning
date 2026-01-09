import { describe, it, expect } from 'vitest'
import { lessons } from '@/lessons'

describe('Lessons', () => {
  it('should have all 8 lessons', () => {
    expect(lessons).toHaveLength(8)
  })

  it('should have unique ids', () => {
    const ids = lessons.map(l => l.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should be sorted by order', () => {
    for (let i = 1; i < lessons.length; i++) {
      expect(lessons[i].order).toBeGreaterThanOrEqual(lessons[i - 1].order)
    }
  })

  it('should have required fields in all lessons', () => {
    lessons.forEach(lesson => {
      expect(lesson.id).toBeDefined()
      expect(lesson.title).toBeDefined()
      expect(lesson.description).toBeDefined()
      expect(lesson.category).toBeDefined()
      expect(lesson.order).toBeDefined()
      expect(lesson.sections).toBeDefined()
      expect(lesson.sections.length).toBeGreaterThan(0)
    })
  })

  describe('Lesson 1: Lean Basics', () => {
    const lesson = lessons.find(l => l.id === '01-lean-basics')!

    it('should exist', () => {
      expect(lesson).toBeDefined()
    })

    it('should be in basics category', () => {
      expect(lesson.category).toBe('basics')
    })

    it('should have exercises', () => {
      const exercises = lesson.sections.filter(s => s.type === 'exercise')
      expect(exercises.length).toBeGreaterThan(0)
    })

    it('should have valid exercise test cases', () => {
      const exercises = lesson.sections.filter(s => s.type === 'exercise')
      exercises.forEach(section => {
        const exercise = section.exercise!
        expect(exercise.testCases.length).toBeGreaterThan(0)
        exercise.testCases.forEach(tc => {
          expect(typeof tc.validator).toBe('function')
        })
      })
    })
  })

  describe('Lesson 2: Polynomials', () => {
    const lesson = lessons.find(l => l.id === '02-polynomials')!

    it('should exist', () => {
      expect(lesson).toBeDefined()
    })

    it('should be in cryptography category', () => {
      expect(lesson.category).toBe('cryptography')
    })

    it('should cover polynomial evaluation', () => {
      const hasEvalContent = lesson.sections.some(s =>
        s.content?.includes('Horner') || s.title?.includes('Evaluation')
      )
      expect(hasEvalContent).toBe(true)
    })
  })

  describe('Lesson 3: Elliptic Curves', () => {
    const lesson = lessons.find(l => l.id === '03-elliptic-curves')!

    it('should exist', () => {
      expect(lesson).toBeDefined()
    })

    it('should cover point addition', () => {
      const hasPointAddition = lesson.sections.some(s =>
        s.title?.includes('Point Addition') || s.content?.includes('point addition')
      )
      expect(hasPointAddition).toBe(true)
    })

    it('should cover scalar multiplication', () => {
      const hasScalarMul = lesson.sections.some(s =>
        s.title?.includes('Scalar') || s.content?.includes('scalar multiplication')
      )
      expect(hasScalarMul).toBe(true)
    })
  })

  describe('Lesson 4: Diffie-Hellman', () => {
    const lesson = lessons.find(l => l.id === '04-diffie-hellman')!

    it('should exist', () => {
      expect(lesson).toBeDefined()
    })

    it('should cover modular exponentiation', () => {
      const hasModExp = lesson.sections.some(s =>
        s.content?.includes('modExp') || s.content?.includes('modular exponentiation')
      )
      expect(hasModExp).toBe(true)
    })

    it('should cover the protocol steps', () => {
      const hasProtocol = lesson.sections.some(s =>
        s.content?.includes('Alice') && s.content?.includes('Bob')
      )
      expect(hasProtocol).toBe(true)
    })
  })

  describe('Lesson 5: Lagrange Interpolation', () => {
    const lesson = lessons.find(l => l.id === '05-lagrange')!

    it('should exist', () => {
      expect(lesson).toBeDefined()
    })

    it('should cover secret sharing', () => {
      const hasSecretSharing = lesson.sections.some(s =>
        s.title?.includes('Secret') || s.content?.includes('Shamir')
      )
      expect(hasSecretSharing).toBe(true)
    })
  })

  describe('Lesson 6: Lattice Cryptography', () => {
    const lesson = lessons.find(l => l.id === '06-lattice')!

    it('should exist', () => {
      expect(lesson).toBeDefined()
    })

    it('should cover LWE problem', () => {
      const hasLWE = lesson.sections.some(s =>
        s.title?.includes('LWE') || s.content?.includes('Learning With Errors')
      )
      expect(hasLWE).toBe(true)
    })
  })

  describe('Lesson 7: Ring-LWE', () => {
    const lesson = lessons.find(l => l.id === '07-rlwe')!

    it('should exist', () => {
      expect(lesson).toBeDefined()
    })

    it('should cover polynomial ring arithmetic', () => {
      const hasRingArithmetic = lesson.sections.some(s =>
        s.content?.includes('Zq[x]') || s.title?.includes('Ring')
      )
      expect(hasRingArithmetic).toBe(true)
    })

    it('should mention Kyber', () => {
      const hasKyber = lesson.sections.some(s =>
        s.content?.includes('Kyber')
      )
      expect(hasKyber).toBe(true)
    })
  })

  describe('Lesson 8: Sumcheck Protocol', () => {
    const lesson = lessons.find(l => l.id === '08-sumcheck')!

    it('should exist', () => {
      expect(lesson).toBeDefined()
    })

    it('should be in advanced category', () => {
      expect(lesson.category).toBe('advanced')
    })

    it('should cover verifier complexity', () => {
      const hasVerifier = lesson.sections.some(s =>
        s.content?.includes('Verifier') || s.title?.includes('Verifier')
      )
      expect(hasVerifier).toBe(true)
    })

    it('should mention applications', () => {
      const hasApplications = lesson.sections.some(s =>
        s.title?.includes('Applications') || s.content?.includes('ZK-SNARK')
      )
      expect(hasApplications).toBe(true)
    })
  })
})
