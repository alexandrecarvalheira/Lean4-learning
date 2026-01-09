import { LeanExecutionResult } from './types'

/**
 * Lean Code Executor
 *
 * This module handles the execution of Lean 4 code.
 * In a production environment, this would connect to a backend service
 * running Lean 4. For this interactive learning platform, we provide
 * a simulated execution environment with validation.
 */

// Lean 4 syntax validation patterns
const LEAN_PATTERNS = {
  definition: /\bdef\s+\w+/,
  theorem: /\btheorem\s+\w+/,
  lemma: /\blemma\s+\w+/,
  structure: /\bstructure\s+\w+/,
  inductive: /\binductive\s+\w+/,
  class: /\bclass\s+\w+/,
  instance: /\binstance\s+/,
  namespace: /\bnamespace\s+\w+/,
  open: /\bopen\s+\w+/,
  import: /\bimport\s+\w+/,
  variable: /\bvariable\s+/,
  example: /\bexample\s+/,
  proof: /\bby\s+/,
  sorry: /\bsorry\b/,
  admit: /\badmit\b/,
}

// Common Lean 4 error patterns
const ERROR_PATTERNS = [
  { pattern: /unknown identifier '(\w+)'/, message: (m: RegExpMatchArray) => `Unknown identifier '${m[1]}'. Did you define it?` },
  { pattern: /type mismatch/, message: () => 'Type mismatch: the expected type does not match the provided type.' },
  { pattern: /function expected/, message: () => 'Function expected: you\'re trying to apply something that isn\'t a function.' },
  { pattern: /unsolved goals/, message: () => 'Unsolved goals: the proof is incomplete. Use tactics to complete it.' },
]

/**
 * Validates basic Lean 4 syntax
 */
export function validateLeanSyntax(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for balanced braces, parentheses, brackets
  const brackets = { '(': ')', '[': ']', '{': '}' }
  const stack: string[] = []

  for (const char of code) {
    if (char in brackets) {
      stack.push(brackets[char as keyof typeof brackets])
    } else if (Object.values(brackets).includes(char)) {
      if (stack.pop() !== char) {
        errors.push(`Mismatched bracket: ${char}`)
      }
    }
  }

  if (stack.length > 0) {
    errors.push(`Unclosed bracket(s): ${stack.join(', ')}`)
  }

  // Check for incomplete definitions
  const lines = code.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('def ') && !line.includes(':=') && !line.includes('where')) {
      // Check if next lines complete it
      const nextLines = lines.slice(i + 1).join('\n')
      if (!nextLines.includes(':=') && !nextLines.includes('where')) {
        errors.push(`Line ${i + 1}: Definition appears incomplete. Use ':=' or 'where'.`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Simulates Lean 4 code execution with validation
 * In production, this would call a backend Lean service
 */
export async function executeLeanCode(code: string): Promise<LeanExecutionResult> {
  // Validate syntax first
  const syntaxCheck = validateLeanSyntax(code)

  if (!syntaxCheck.valid) {
    return {
      success: false,
      output: '',
      errors: syntaxCheck.errors,
      warnings: []
    }
  }

  const warnings: string[] = []
  const output: string[] = []

  // Check for 'sorry' or 'admit' (incomplete proofs)
  if (LEAN_PATTERNS.sorry.test(code)) {
    warnings.push("Warning: 'sorry' found - this proof is incomplete.")
  }
  if (LEAN_PATTERNS.admit.test(code)) {
    warnings.push("Warning: 'admit' found - this proof is incomplete.")
  }

  // Simulate successful compilation for valid code
  if (LEAN_PATTERNS.definition.test(code)) {
    output.push('Definition compiled successfully.')
  }
  if (LEAN_PATTERNS.theorem.test(code)) {
    output.push('Theorem compiled successfully.')
  }
  if (LEAN_PATTERNS.structure.test(code)) {
    output.push('Structure defined successfully.')
  }

  // Extract #eval and #check results
  const evalMatches = code.matchAll(/#eval\s+(.+)/g)
  for (const match of evalMatches) {
    output.push(`#eval ${match[1].trim()}: [evaluated]`)
  }

  const checkMatches = code.matchAll(/#check\s+(.+)/g)
  for (const match of checkMatches) {
    output.push(`#check ${match[1].trim()}: [type checked]`)
  }

  return {
    success: true,
    output: output.join('\n'),
    errors: [],
    warnings
  }
}

/**
 * Validates exercise solution against expected patterns
 */
export function validateExerciseSolution(
  code: string,
  expectedPatterns: RegExp[],
  forbiddenPatterns: RegExp[] = []
): { correct: boolean; feedback: string } {
  // Check forbidden patterns first
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(code)) {
      return {
        correct: false,
        feedback: `Your solution contains forbidden patterns. Try a different approach.`
      }
    }
  }

  // Check all expected patterns are present
  for (const pattern of expectedPatterns) {
    if (!pattern.test(code)) {
      return {
        correct: false,
        feedback: `Your solution is missing required elements. Check the exercise requirements.`
      }
    }
  }

  // Check for sorry/admit
  if (LEAN_PATTERNS.sorry.test(code) || LEAN_PATTERNS.admit.test(code)) {
    return {
      correct: false,
      feedback: `Your proof is incomplete. Remove 'sorry' or 'admit' and complete the proof.`
    }
  }

  return {
    correct: true,
    feedback: 'Correct! Well done.'
  }
}
