import { Lesson } from '@/lib/types'

export const lagrangeLesson: Lesson = {
  id: '07-lagrange',
  title: 'Lagrange Interpolation',
  description: 'Learn Lagrange interpolation for polynomial reconstruction and secret sharing',
  category: 'cryptography',
  order: 7,
  sections: [
    {
      type: 'content',
      title: 'Introduction to Lagrange Interpolation',
      content: `# Lagrange Interpolation

Lagrange interpolation allows us to reconstruct a polynomial from its values at certain points.

## The Problem

Given n points (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ), find the unique polynomial p(x) of degree at most n-1 that passes through all points.

## Why This Matters in Cryptography

- **Shamir's Secret Sharing**: Reconstruct the secret (polynomial value at x=0)
- **Polynomial Commitments**: Verify evaluations in KZG schemes
- **Error Correction**: Reed-Solomon codes
- **Zero-Knowledge Proofs**: Polynomial interpolation in STARKs

## The Lagrange Formula

\`\`\`
p(x) = Σᵢ yᵢ · Lᵢ(x)
\`\`\`

Where Lᵢ(x) is the **Lagrange basis polynomial**:

\`\`\`
Lᵢ(x) = Πⱼ≠ᵢ (x - xⱼ) / (xᵢ - xⱼ)
\`\`\`

## Key Property

Lᵢ(xᵢ) = 1 and Lᵢ(xⱼ) = 0 for j ≠ i

This ensures p(xᵢ) = yᵢ for all points!`
    },
    {
      type: 'content',
      title: 'Lagrange Basis Polynomials',
      content: `## Understanding Basis Polynomials

The Lagrange basis polynomial Lᵢ(x) is designed to be:
- **1** at point xᵢ
- **0** at all other points xⱼ (j ≠ i)

### Construction

For points x₀, x₁, x₂, the basis polynomials are:

\`\`\`
L₀(x) = (x - x₁)(x - x₂) / [(x₀ - x₁)(x₀ - x₂)]
L₁(x) = (x - x₀)(x - x₂) / [(x₁ - x₀)(x₁ - x₂)]
L₂(x) = (x - x₀)(x - x₁) / [(x₂ - x₀)(x₂ - x₁)]
\`\`\`

### Example

Given points (1, 3), (2, 5), (3, 7):

\`\`\`
L₀(x) = (x - 2)(x - 3) / [(1 - 2)(1 - 3)] = (x - 2)(x - 3) / 2
L₁(x) = (x - 1)(x - 3) / [(2 - 1)(2 - 3)] = -(x - 1)(x - 3)
L₂(x) = (x - 1)(x - 2) / [(3 - 1)(3 - 2)] = (x - 1)(x - 2) / 2
\`\`\`

### In Lean

\`\`\`lean
-- Compute the numerator: Πⱼ≠ᵢ (x - xⱼ)
def basisNumerator (x : Int) (xs : List Int) (skipIdx : Nat) : Int :=
  xs.enum.foldl (fun acc (j, xj) =>
    if j == skipIdx then acc else acc * (x - xj)
  ) 1

-- Compute the denominator: Πⱼ≠ᵢ (xᵢ - xⱼ)
def basisDenominator (xs : List Int) (i : Nat) : Int :=
  let xi := xs.getD i 0
  xs.enum.foldl (fun acc (j, xj) =>
    if j == i then acc else acc * (xi - xj)
  ) 1
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Basis Polynomial Denominator',
      exercise: {
        id: 'ex-lag-01',
        title: 'Compute Basis Denominator',
        description: 'Implement a function that computes the denominator of a Lagrange basis polynomial: Πⱼ≠ᵢ (xᵢ - xⱼ).',
        initialCode: `-- Compute the denominator of the i-th Lagrange basis polynomial
-- denominator = Πⱼ≠ᵢ (xᵢ - xⱼ)
-- xs: list of all x-coordinates
-- i: index of the basis polynomial
def basisDenominator (xs : List Int) (i : Nat) : Int :=
  let xi := xs.getD i 0  -- Get xᵢ (default to 0 if out of bounds)
  -- Iterate through all points, multiply (xᵢ - xⱼ) for j ≠ i
  -- YOUR CODE HERE
  sorry

-- Test: For xs = [1, 2, 3] and i = 0:
-- denominator = (1 - 2) * (1 - 3) = (-1) * (-2) = 2
`,
        solution: `def basisDenominator (xs : List Int) (i : Nat) : Int :=
  let xi := xs.getD i 0
  xs.enum.foldl (fun acc (j, xj) =>
    if j == i then acc else acc * (xi - xj)
  ) 1`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Use xs.enum to get (index, value) pairs',
          'Use foldl with initial value 1 (identity for multiplication)',
          'Skip when j == i, otherwise multiply acc * (xi - xj)'
        ],
        testCases: [
          {
            description: 'def basisDenominator',
            validator: (code) => /def\s+basisDenominator/.test(code)
          },
          {
            description: 'uses xs.enum',
            validator: (code) => /xs\.enum/.test(code)
          },
          {
            description: 'skips when j == i',
            validator: (code) => /j\s*==\s*i/.test(code)
          },
          {
            description: 'multiplies xi - xj',
            validator: (code) => /xi\s*-\s*xj/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'The Full Interpolation Formula',
      content: `## Lagrange Interpolation Algorithm

Now we can combine everything:

\`\`\`
p(x) = Σᵢ yᵢ · Lᵢ(x) = Σᵢ yᵢ · [Πⱼ≠ᵢ (x - xⱼ)] / [Πⱼ≠ᵢ (xᵢ - xⱼ)]
\`\`\`

### Implementation in Lean

\`\`\`lean
-- Evaluate the Lagrange interpolation at point x
def lagrangeInterpolate (points : List (Int × Int)) (x : Int) : Int :=
  let xs := points.map (·.1)
  let ys := points.map (·.2)

  points.enum.foldl (fun acc (i, (xi, yi)) =>
    let num := basisNumerator x xs i
    let den := basisDenominator xs i
    -- Note: In finite fields, use modular division
    acc + yi * num / den
  ) 0
\`\`\`

### Example Walkthrough

Points: (1, 2), (2, 4), (3, 8)

To find p(0):

\`\`\`
L₀(0) = (0-2)(0-3) / (1-2)(1-3) = 6 / 2 = 3
L₁(0) = (0-1)(0-3) / (2-1)(2-3) = 3 / (-1) = -3
L₂(0) = (0-1)(0-2) / (3-1)(3-2) = 2 / 2 = 1

p(0) = 2·3 + 4·(-3) + 8·1 = 6 - 12 + 8 = 2
\`\`\`

### Complexity

- Time: O(n²) for n points
- Can be optimized with barycentric form: O(n) after O(n²) preprocessing`
    },
    {
      type: 'exercise',
      title: 'Exercise: Lagrange Interpolation',
      exercise: {
        id: 'ex-lag-02',
        title: 'Implement Full Interpolation',
        description: 'Implement the complete Lagrange interpolation function that evaluates the interpolating polynomial at a given point.',
        initialCode: `-- Helper: compute basis numerator Πⱼ≠ᵢ (x - xⱼ)
def basisNumerator (x : Int) (xs : List Int) (i : Nat) : Int :=
  xs.enum.foldl (fun acc (j, xj) =>
    if j == i then acc else acc * (x - xj)
  ) 1

-- Helper: compute basis denominator Πⱼ≠ᵢ (xᵢ - xⱼ)
def basisDenominator (xs : List Int) (i : Nat) : Int :=
  let xi := xs.getD i 0
  xs.enum.foldl (fun acc (j, xj) =>
    if j == i then acc else acc * (xi - xj)
  ) 1

-- Lagrange interpolation
-- Given a list of points (xᵢ, yᵢ), evaluate the interpolating polynomial at x
-- p(x) = Σᵢ yᵢ * basisNumerator(x, xs, i) / basisDenominator(xs, i)
def lagrangeInterpolate (points : List (Int × Int)) (x : Int) : Int :=
  let xs := points.map (·.1)  -- Extract all x-coordinates
  -- YOUR CODE HERE
  -- Sum over all points: yᵢ * num / den
  sorry

-- Test: points = [(1, 2), (2, 4)], evaluate at x = 3
-- This is the line y = 2x, so p(3) should be 6
`,
        solution: `def basisNumerator (x : Int) (xs : List Int) (i : Nat) : Int :=
  xs.enum.foldl (fun acc (j, xj) =>
    if j == i then acc else acc * (x - xj)
  ) 1

def basisDenominator (xs : List Int) (i : Nat) : Int :=
  let xi := xs.getD i 0
  xs.enum.foldl (fun acc (j, xj) =>
    if j == i then acc else acc * (xi - xj)
  ) 1

def lagrangeInterpolate (points : List (Int × Int)) (x : Int) : Int :=
  let xs := points.map (·.1)
  points.enum.foldl (fun acc (i, (_, yi)) =>
    let num := basisNumerator x xs i
    let den := basisDenominator xs i
    acc + yi * num / den
  ) 0`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Extract xs using points.map',
          'Use foldl over points.enum to sum contributions',
          'For each point i, compute num and den, then add yi * num / den to accumulator'
        ],
        testCases: [
          {
            description: 'def lagrangeInterpolate',
            validator: (code) => /def\s+lagrangeInterpolate/.test(code)
          },
          {
            description: 'uses basisNumerator',
            validator: (code) => /basisNumerator\s+x\s+xs\s+i/.test(code)
          },
          {
            description: 'uses basisDenominator',
            validator: (code) => /basisDenominator\s+xs\s+i/.test(code)
          },
          {
            description: 'sums yi * num / den',
            validator: (code) => /yi\s*\*\s*num\s*\/\s*den/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Shamir Secret Sharing',
      content: `## Shamir's Secret Sharing Scheme

One of the most important applications of Lagrange interpolation!

### The Goal

Split a secret S among n parties such that:
- Any k parties can reconstruct S
- Fewer than k parties learn nothing about S

### How It Works

1. **Share Generation**:
   - Create random polynomial p(x) = S + a₁x + a₂x² + ... + aₖ₋₁xᵏ⁻¹
   - The secret S is the constant term (p(0) = S)
   - Give party i the share (i, p(i))

2. **Secret Reconstruction**:
   - Collect k shares (x₁, y₁), ..., (xₖ, yₖ)
   - Use Lagrange interpolation to find p(x)
   - Evaluate p(0) to get the secret S

### In Lean

\`\`\`lean
structure Share where
  x : Int
  y : Int

-- Generate shares for secret S with threshold k
def generateShares (secret : Int) (coeffs : List Int) (n : Nat) (p : Nat) : List Share :=
  -- p(x) = secret + coeffs[0]*x + coeffs[1]*x² + ...
  let evalPoly (x : Int) : Int :=
    coeffs.enum.foldl (fun acc (i, ai) =>
      (acc + ai * (x ^ (i + 1))) % p
    ) secret
  List.range n |>.map (fun i => { x := i + 1, y := evalPoly (i + 1) })

-- Reconstruct secret from k shares
def reconstructSecret (shares : List Share) (p : Nat) : Int :=
  -- Evaluate interpolating polynomial at x = 0
  lagrangeInterpolateMod shares.map (fun s => (s.x, s.y)) 0 p
\`\`\`

### Security Property

With k-1 shares, every possible secret is equally likely!`
    },
    {
      type: 'exercise',
      title: 'Exercise: Secret Reconstruction',
      exercise: {
        id: 'ex-lag-03',
        title: 'Reconstruct Secret from Shares',
        description: 'Implement the secret reconstruction function that uses Lagrange interpolation at x=0 to recover the secret.',
        initialCode: `-- Simplified Lagrange interpolation at x = 0
-- When x = 0: numerator = Πⱼ≠ᵢ (0 - xⱼ) = Πⱼ≠ᵢ (-xⱼ)
def lagrangeAtZero (points : List (Int × Int)) : Int :=
  let xs := points.map (·.1)
  points.enum.foldl (fun acc (i, (xi, yi)) =>
    let num := xs.enum.foldl (fun n (j, xj) =>
      if j == i then n else n * (-xj)
    ) 1
    let den := xs.enum.foldl (fun d (j, xj) =>
      if j == i then d else d * (xi - xj)
    ) 1
    acc + yi * num / den
  ) 0

structure Share where
  x : Int
  y : Int

-- Reconstruct the secret from shares
-- The secret is the value of the polynomial at x = 0
def reconstructSecret (shares : List Share) : Int :=
  -- Convert shares to points and call lagrangeAtZero
  -- YOUR CODE HERE
  sorry

-- Test: If we have shares from p(x) = 5 + 2x + 3x²
-- shares at x=1,2,3 would be (1,10), (2,21), (3,38)
-- reconstructSecret should return 5
`,
        solution: `def lagrangeAtZero (points : List (Int × Int)) : Int :=
  let xs := points.map (·.1)
  points.enum.foldl (fun acc (i, (xi, yi)) =>
    let num := xs.enum.foldl (fun n (j, xj) =>
      if j == i then n else n * (-xj)
    ) 1
    let den := xs.enum.foldl (fun d (j, xj) =>
      if j == i then d else d * (xi - xj)
    ) 1
    acc + yi * num / den
  ) 0

structure Share where
  x : Int
  y : Int

def reconstructSecret (shares : List Share) : Int :=
  let points := shares.map (fun s => (s.x, s.y))
  lagrangeAtZero points`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Convert each Share to a tuple (x, y)',
          'Use shares.map with a lambda function',
          'Pass the resulting list to lagrangeAtZero'
        ],
        testCases: [
          {
            description: 'def reconstructSecret',
            validator: (code) => /def\s+reconstructSecret/.test(code)
          },
          {
            description: 'converts shares to points',
            validator: (code) => /shares\.map/.test(code)
          },
          {
            description: 'calls lagrangeAtZero',
            validator: (code) => /lagrangeAtZero/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Modular Lagrange Interpolation',
      content: `## Working in Finite Fields

In cryptographic applications, we work modulo a prime p.

### Modular Division

Division becomes multiplication by modular inverse:

\`\`\`
a / b mod p = a × b⁻¹ mod p
\`\`\`

### Modular Inverse using Extended GCD

\`\`\`lean
def modInverse (a p : Nat) : Nat :=
  let rec extGcd (a b : Int) : Int × Int :=
    if b == 0 then (1, 0)
    else
      let (x, y) := extGcd b (a % b)
      (y, x - (a / b) * y)
  let (x, _) := extGcd a p
  ((x % p + p) % p).toNat
\`\`\`

### Modular Lagrange Interpolation

\`\`\`lean
def lagrangeInterpolateMod (points : List (Int × Int)) (x : Int) (p : Nat) : Nat :=
  let xs := points.map (·.1)
  points.enum.foldl (fun acc (i, (_, yi)) =>
    let num := xs.enum.foldl (fun n (j, xj) =>
      if j == i then n else (n * ((x - xj) % p + p)) % p
    ) 1
    let den := xs.enum.foldl (fun d (j, xj) =>
      let xi := xs.getD i 0
      if j == i then d else (d * ((xi - xj) % p + p)) % p
    ) 1
    let term := (yi.toNat * num % p * modInverse den p) % p
    (acc + term) % p
  ) 0
\`\`\`

### Why Finite Fields?

1. **Bounded arithmetic**: No overflow concerns
2. **Exact division**: Every non-zero element has an inverse
3. **Security**: Information-theoretic security for Shamir's scheme`
    },
    {
      type: 'exercise',
      title: 'Exercise: Modular Inverse',
      exercise: {
        id: 'ex-lag-04',
        title: 'Verify Modular Inverse',
        description: 'Implement a function to verify that a number is the modular inverse of another, then use it in a simple test.',
        initialCode: `-- Check if b is the modular inverse of a modulo p
-- i.e., (a * b) mod p == 1
def isModInverse (a b p : Nat) : Bool :=
  -- YOUR CODE HERE
  sorry

-- Find modular inverse using Fermat's little theorem
-- a⁻¹ ≡ a^(p-2) mod p (when p is prime)
def modExp (base exp p : Nat) : Nat :=
  if exp == 0 then 1
  else if exp % 2 == 0 then
    let half := modExp base (exp / 2) p
    (half * half) % p
  else
    (base * modExp base (exp - 1) p) % p

def modInverseFermat (a p : Nat) : Nat :=
  modExp a (p - 2) p

-- Test: in Z₇, the inverse of 3 is 5 (because 3 * 5 = 15 ≡ 1 mod 7)
-- Verify: isModInverse 3 (modInverseFermat 3 7) 7 should be true
`,
        solution: `def isModInverse (a b p : Nat) : Bool :=
  (a * b) % p == 1

def modExp (base exp p : Nat) : Nat :=
  if exp == 0 then 1
  else if exp % 2 == 0 then
    let half := modExp base (exp / 2) p
    (half * half) % p
  else
    (base * modExp base (exp - 1) p) % p

def modInverseFermat (a p : Nat) : Nat :=
  modExp a (p - 2) p`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Multiply a and b, take modulo p, check if equals 1',
          'Use the formula: (a * b) % p == 1'
        ],
        testCases: [
          {
            description: 'def isModInverse',
            validator: (code) => /def\s+isModInverse/.test(code)
          },
          {
            description: 'multiplies a * b',
            validator: (code) => /a\s*\*\s*b/.test(code)
          },
          {
            description: 'checks mod p == 1',
            validator: (code) => /%\s*p\s*==\s*1/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Applications Summary',
      content: `# Summary: Lagrange Interpolation

You've learned a fundamental algorithm used throughout cryptography!

## The Core Idea

Given n points, find the unique polynomial of degree ≤ n-1 passing through them.

\`\`\`
p(x) = Σᵢ yᵢ · Πⱼ≠ᵢ (x - xⱼ) / (xᵢ - xⱼ)
\`\`\`

## Key Applications

| Application | How Lagrange is Used |
|-------------|---------------------|
| Shamir's Secret Sharing | Reconstruct secret at x=0 |
| KZG Commitments | Verify polynomial evaluations |
| Reed-Solomon Codes | Error correction/detection |
| STARKs | Low-degree testing |
| Plonk | Polynomial identities |

## Implementation Notes

### Integer Arithmetic
- Simple but limited to small values
- Division must be exact

### Finite Field Arithmetic
- Use modular inverse for division
- No precision issues
- Standard in cryptography

### Optimization
- Barycentric form: O(n) evaluation after O(n²) preprocessing
- Can be parallelized

## Next Lesson

Next, we'll explore **Lattice-based Cryptography**, which provides:
- Post-quantum security
- Homomorphic encryption foundations
- Different mathematical structure from EC/DH`
    }
  ]
}
