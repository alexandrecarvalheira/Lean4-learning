import { describe, it, expect } from 'vitest'
import type { Lesson, Exercise, LessonSection, TestCase } from '@/lib/types'

describe('Type Definitions', () => {
  describe('Exercise type', () => {
    it('should accept valid exercise structure', () => {
      const exercise: Exercise = {
        id: 'test-exercise',
        title: 'Test Exercise',
        description: 'A test exercise',
        initialCode: 'def test := 0',
        solution: 'def test := 1',
        explanation: 'This is a test explanation.',
        hints: ['Hint 1', 'Hint 2'],
        testCases: [
          {
            description: 'Test case 1',
            validator: (code) => code.includes('test')
          }
        ]
      }

      expect(exercise.id).toBe('test-exercise')
      expect(exercise.hints).toHaveLength(2)
      expect(exercise.testCases[0].validator('def test')).toBe(true)
    })
  })

  describe('LessonSection type', () => {
    it('should accept content section', () => {
      const section: LessonSection = {
        type: 'content',
        title: 'Introduction',
        content: '# Hello World'
      }

      expect(section.type).toBe('content')
      expect(section.content).toBeDefined()
    })

    it('should accept exercise section', () => {
      const section: LessonSection = {
        type: 'exercise',
        title: 'Practice',
        exercise: {
          id: 'ex-1',
          title: 'Exercise 1',
          description: 'Do something',
          initialCode: '',
          solution: '',
          explanation: 'Test explanation.',
          hints: [],
          testCases: []
        }
      }

      expect(section.type).toBe('exercise')
      expect(section.exercise).toBeDefined()
    })
  })

  describe('Lesson type', () => {
    it('should accept valid lesson structure', () => {
      const lesson: Lesson = {
        id: 'test-lesson',
        title: 'Test Lesson',
        description: 'A test lesson',
        category: 'basics',
        order: 1,
        sections: [
          { type: 'content', title: 'Intro', content: 'Hello' }
        ]
      }

      expect(lesson.id).toBe('test-lesson')
      expect(lesson.category).toBe('basics')
      expect(lesson.sections).toHaveLength(1)
    })

    it('should accept all category types', () => {
      const categories: Array<'basics' | 'cryptography' | 'advanced'> = ['basics', 'cryptography', 'advanced']

      categories.forEach(cat => {
        const lesson: Lesson = {
          id: `test-${cat}`,
          title: 'Test',
          description: 'Test',
          category: cat,
          order: 1,
          sections: []
        }
        expect(lesson.category).toBe(cat)
      })
    })
  })

  describe('TestCase type', () => {
    it('should validate code correctly', () => {
      const testCase: TestCase = {
        description: 'Check for def keyword',
        validator: (code) => /def\s+\w+/.test(code)
      }

      expect(testCase.validator('def hello')).toBe(true)
      expect(testCase.validator('val hello')).toBe(false)
    })

    it('should support optional input/output', () => {
      const testCase: TestCase = {
        description: 'With expected output',
        input: 'test input',
        expectedOutput: 'test output',
        validator: () => true
      }

      expect(testCase.input).toBe('test input')
      expect(testCase.expectedOutput).toBe('test output')
    })
  })
})
