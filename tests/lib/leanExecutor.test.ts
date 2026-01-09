import { describe, it, expect } from 'vitest'
import { validateLeanSyntax, executeLeanCode, validateExerciseSolution } from '@/lib/leanExecutor'

describe('validateLeanSyntax', () => {
  it('should accept valid Lean code with balanced brackets', () => {
    const code = `def hello : String := "world"`
    const result = validateLeanSyntax(code)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject code with mismatched brackets', () => {
    const code = `def foo (x : Nat := x + 1`
    const result = validateLeanSyntax(code)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should accept code with nested brackets', () => {
    const code = `def nested (x : List (Option Nat)) : Nat := 0`
    const result = validateLeanSyntax(code)
    expect(result.valid).toBe(true)
  })

  it('should handle empty code', () => {
    const result = validateLeanSyntax('')
    expect(result.valid).toBe(true)
  })

  it('should accept structure definitions', () => {
    const code = `
structure Point where
  x : Nat
  y : Nat
`
    const result = validateLeanSyntax(code)
    expect(result.valid).toBe(true)
  })
})

describe('executeLeanCode', () => {
  it('should return success for valid definition', async () => {
    const code = `def myValue : Nat := 42`
    const result = await executeLeanCode(code)
    expect(result.success).toBe(true)
    expect(result.output).toContain('Definition compiled successfully')
  })

  it('should return success for theorem', async () => {
    const code = `theorem myTheorem : 1 = 1 := rfl`
    const result = await executeLeanCode(code)
    expect(result.success).toBe(true)
    expect(result.output).toContain('Theorem compiled successfully')
  })

  it('should warn about sorry', async () => {
    const code = `def incomplete : Nat := sorry`
    const result = await executeLeanCode(code)
    expect(result.success).toBe(true)
    expect(result.warnings.some(w => w.includes('sorry'))).toBe(true)
  })

  it('should return failure for syntax errors', async () => {
    const code = `def broken (x : Nat := x`
    const result = await executeLeanCode(code)
    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should handle #eval expressions', async () => {
    const code = `#eval 1 + 2`
    const result = await executeLeanCode(code)
    expect(result.output).toContain('#eval')
  })

  it('should handle #check expressions', async () => {
    const code = `#check Nat`
    const result = await executeLeanCode(code)
    expect(result.output).toContain('#check')
  })
})

describe('validateExerciseSolution', () => {
  it('should accept solution matching expected patterns', () => {
    const code = `def myNumber : Nat := 42`
    const patterns = [/def myNumber/, /Nat/, /:= 42/]
    const result = validateExerciseSolution(code, patterns)
    expect(result.correct).toBe(true)
  })

  it('should reject solution missing patterns', () => {
    const code = `def myNumber : Int := 42`
    const patterns = [/def myNumber/, /Nat/]
    const result = validateExerciseSolution(code, patterns)
    expect(result.correct).toBe(false)
  })

  it('should reject solution with forbidden patterns', () => {
    const code = `def myNumber : Nat := sorry`
    const patterns = [/def myNumber/]
    const forbidden = [/sorry/]
    const result = validateExerciseSolution(code, patterns, forbidden)
    expect(result.correct).toBe(false)
  })

  it('should reject solution containing admit', () => {
    const code = `theorem test : True := by admit`
    const patterns = [/theorem/]
    const result = validateExerciseSolution(code, patterns)
    expect(result.correct).toBe(false)
    expect(result.feedback).toContain('incomplete')
  })
})
