import { Lesson } from '@/lib/types'

export const sumcheckLesson: Lesson = {
  id: '10-sumcheck',
  title: 'Sumcheck Protocol',
  description: 'Learn the Sumcheck protocol, fundamental to interactive proofs and ZK-SNARKs',
  category: 'advanced',
  order: 10,
  sections: [
    {
      type: 'content',
      title: 'Introduction to Sumcheck',
      content: `# The Sumcheck Protocol

The Sumcheck protocol is one of the most important building blocks in modern proof systems.

## The Problem

Given a multivariate polynomial g(x₁, x₂, ..., xₙ) over a finite field F, prove that:

\`\`\`
H = Σ_{x₁∈{0,1}} Σ_{x₂∈{0,1}} ... Σ_{xₙ∈{0,1}} g(x₁, x₂, ..., xₙ)
\`\`\`

## Why This Matters

- **Interactive Proofs**: Foundation of IP = PSPACE
- **ZK-SNARKs**: Used in Spartan, Lasso, Jolt
- **STARKs**: Low-degree testing
- **Verifiable Computation**: Proving computation correctness

## The Challenge

Naive verification requires 2ⁿ evaluations of g.
Sumcheck reduces this to O(n) rounds!

## Key Insight

Instead of verifying the sum directly:
1. Reduce to a simpler claim each round
2. Final claim is a single point evaluation
3. Verifier checks the single point

## Example Application

Proving matrix multiplication:
\`\`\`
C = A × B

Σ_{x,y,z ∈ {0,1}^log(n)} ã(x,y) · b̃(y,z) · c̃(x,z)
\`\`\`

Where ã, b̃, c̃ are multilinear extensions.`
    },
    {
      type: 'content',
      title: 'The Protocol',
      content: `## Sumcheck Protocol in Detail

### Setup

- **Prover** knows polynomial g(x₁, ..., xₙ) of degree d in each variable
- **Verifier** wants to check: H = Σ_{b∈{0,1}ⁿ} g(b)
- Both agree on claimed sum H

### Round 1

Prover sends univariate polynomial:
\`\`\`
g₁(X₁) = Σ_{x₂,...,xₙ ∈ {0,1}} g(X₁, x₂, ..., xₙ)
\`\`\`

Verifier checks: g₁(0) + g₁(1) = H

Verifier sends random challenge r₁ ∈ F

### Round i (for i = 2, ..., n)

Prover sends:
\`\`\`
gᵢ(Xᵢ) = Σ_{xᵢ₊₁,...,xₙ ∈ {0,1}} g(r₁, ..., rᵢ₋₁, Xᵢ, xᵢ₊₁, ..., xₙ)
\`\`\`

Verifier checks: gᵢ(0) + gᵢ(1) = gᵢ₋₁(rᵢ₋₁)

Verifier sends random rᵢ

### Final Check

After round n, verifier has (r₁, ..., rₙ).

Verifier queries oracle for g(r₁, ..., rₙ) and checks:
\`\`\`
g(r₁, ..., rₙ) = gₙ(rₙ)
\`\`\`

### Security

If prover cheats, with probability ≥ 1 - nd/|F|, verifier detects.`
    },
    {
      type: 'exercise',
      title: 'Exercise: Univariate Sum Check',
      exercise: {
        id: 'ex-sum-01',
        title: 'Verify Univariate Sumcheck Round',
        description: 'Implement the verifier check for one round of sumcheck: verify that g(0) + g(1) equals the claimed sum.',
        initialCode: `-- A univariate polynomial over a finite field
structure UniPoly where
  coeffs : List Nat  -- Coefficient representation
  p : Nat            -- Field modulus

-- Evaluate polynomial at a point
def evalPoly (poly : UniPoly) (x : Nat) : Nat :=
  poly.coeffs.enum.foldl (fun acc (i, c) =>
    (acc + c * (x ^ i)) % poly.p
  ) 0

-- Verify one round of sumcheck
-- Check that poly(0) + poly(1) = claimedSum (mod p)
def verifySumcheckRound (poly : UniPoly) (claimedSum : Nat) : Bool :=
  -- YOUR CODE HERE
  -- 1. Evaluate poly at 0
  -- 2. Evaluate poly at 1
  -- 3. Check if sum equals claimedSum mod p
  sorry

-- Test: For poly = 3x + 2 in Z_7:
-- poly(0) = 2, poly(1) = 5
-- verifySumcheckRound poly 0 should be true (2 + 5 = 7 ≡ 0 mod 7)
`,
        solution: `structure UniPoly where
  coeffs : List Nat
  p : Nat

def evalPoly (poly : UniPoly) (x : Nat) : Nat :=
  poly.coeffs.enum.foldl (fun acc (i, c) =>
    (acc + c * (x ^ i)) % poly.p
  ) 0

def verifySumcheckRound (poly : UniPoly) (claimedSum : Nat) : Bool :=
  let val0 := evalPoly poly 0
  let val1 := evalPoly poly 1
  (val0 + val1) % poly.p == claimedSum % poly.p`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Evaluate the polynomial at x=0 and x=1',
          'Add the two values',
          'Check if the sum equals claimedSum modulo p'
        ],
        testCases: [
          {
            description: 'def verifySumcheckRound',
            validator: (code) => /def\s+verifySumcheckRound/.test(code)
          },
          {
            description: 'evaluates at 0',
            validator: (code) => /evalPoly\s+poly\s+0/.test(code)
          },
          {
            description: 'evaluates at 1',
            validator: (code) => /evalPoly\s+poly\s+1/.test(code)
          },
          {
            description: 'checks sum mod p',
            validator: (code) => /%\s*poly\.p/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Multivariate Polynomials',
      content: `## Working with Multivariate Polynomials

Sumcheck uses multivariate polynomials. Let's represent them.

### Representation in Lean

\`\`\`lean
-- Term: coefficient and list of variable exponents
-- E.g., 3x₁²x₂ = (3, [2, 1, 0, ...])
structure Term where
  coeff : Nat
  exponents : List Nat

-- Multivariate polynomial as sum of terms
structure MultiPoly where
  terms : List Term
  numVars : Nat
  p : Nat  -- Field modulus
\`\`\`

### Evaluation

\`\`\`lean
def Term.eval (t : Term) (point : List Nat) (p : Nat) : Nat :=
  let varProd := t.exponents.zipWith (fun exp x => x ^ exp) point
                 |>.foldl (· * ·) 1
  (t.coeff * varProd) % p

def MultiPoly.eval (poly : MultiPoly) (point : List Nat) : Nat :=
  poly.terms.foldl (fun acc t =>
    (acc + t.eval point poly.p) % poly.p
  ) 0
\`\`\`

### Multilinear Polynomials

In sumcheck, we often use **multilinear** polynomials:
- Degree at most 1 in each variable
- n-variable multilinear poly has 2ⁿ terms

\`\`\`
f(x₁, x₂) = c₀₀ + c₁₀x₁ + c₀₁x₂ + c₁₁x₁x₂
\`\`\`

### Partial Evaluation

Key operation: fix some variables, get new polynomial.

\`\`\`lean
-- Fix first variable to r, return poly in remaining vars
def partialEval (poly : MultiPoly) (r : Nat) : MultiPoly :=
  -- Replace x₁ with r in all terms
  ...
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Multivariate Evaluation',
      exercise: {
        id: 'ex-sum-02',
        title: 'Evaluate Multivariate Polynomial',
        description: 'Implement evaluation of a multivariate polynomial at a specific point.',
        initialCode: `-- A monomial term: coefficient × x₁^e₁ × x₂^e₂ × ...
structure Term where
  coeff : Nat
  exponents : List Nat

-- Evaluate a single term at a point
-- term = c × x₁^e₁ × x₂^e₂ × ...
-- point = [v₁, v₂, ...]
-- result = c × v₁^e₁ × v₂^e₂ × ... mod p
def evalTerm (t : Term) (point : List Nat) (p : Nat) : Nat :=
  -- YOUR CODE HERE
  sorry

-- Test: Term {coeff := 3, exponents := [2, 1]} at point [2, 3] in Z_17
-- = 3 × 2² × 3¹ = 3 × 4 × 3 = 36 mod 17 = 2
`,
        solution: `structure Term where
  coeff : Nat
  exponents : List Nat

def evalTerm (t : Term) (point : List Nat) (p : Nat) : Nat :=
  let varProd := t.exponents.zipWith (fun exp x => (x ^ exp) % p) point
                 |>.foldl (fun acc v => (acc * v) % p) 1
  (t.coeff * varProd) % p`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Use zipWith to pair each exponent with its corresponding value',
          'Compute x^exp for each pair',
          'Multiply all together with foldl',
          'Multiply by coefficient and take mod p'
        ],
        testCases: [
          {
            description: 'def evalTerm',
            validator: (code) => /def\s+evalTerm/.test(code)
          },
          {
            description: 'uses zipWith',
            validator: (code) => /zipWith/.test(code)
          },
          {
            description: 'computes powers',
            validator: (code) => /\^/.test(code)
          },
          {
            description: 'uses modulo',
            validator: (code) => /%\s*p/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'The Prover Algorithm',
      content: `## Prover's Work in Sumcheck

### Round i Computation

The prover needs to compute:
\`\`\`
gᵢ(X) = Σ_{xᵢ₊₁,...,xₙ ∈ {0,1}} g(r₁, ..., rᵢ₋₁, X, xᵢ₊₁, ..., xₙ)
\`\`\`

### Naive Approach

For each X, sum over 2ⁿ⁻ⁱ Boolean assignments:
- Total work: O(d · 2ⁿ) per round
- Total protocol: O(n · d · 2ⁿ)

### Optimization: Caching

Maintain partial sums:
\`\`\`lean
-- After round i, store:
-- cache[b] = Σ_{xᵢ₊₂,...} g(r₁,...,rᵢ, b, xᵢ₊₂,...)
-- for all relevant suffixes b ∈ {0,1}^(n-i-1)

def updateCache (cache : Array Nat) (r : Nat) (g : MultiPoly) : Array Nat :=
  -- For each pair (cache[2j], cache[2j+1]):
  -- new_cache[j] = (1-r) * cache[2j] + r * cache[2j+1]
  ...
\`\`\`

### Complexity Improvement

With caching:
- Round i work: O(2ⁿ⁻ⁱ)
- Total: O(2ⁿ) overall (linear in table size!)

### Generating Round Polynomial

\`\`\`lean
def generateRoundPoly (cache : Array Nat) (g : MultiPoly) (roundNum : Nat) : UniPoly :=
  -- Sum over remaining variables to get coefficients
  -- gᵢ(X) is degree d in X
  let coeffs := (List.range (g.maxDegree + 1)).map (fun deg =>
    -- coefficient of X^deg in gᵢ
    computeCoeff cache deg
  )
  { coeffs := coeffs, p := g.p }
\`\`\``
    },
    {
      type: 'content',
      title: 'The Verifier Algorithm',
      content: `## Verifier's Role

The verifier is efficient: O(n) field operations!

### Verification Steps

\`\`\`lean
structure SumcheckTranscript where
  claimedSum : Nat
  roundPolys : List UniPoly  -- g₁, g₂, ..., gₙ
  challenges : List Nat      -- r₁, r₂, ..., rₙ
  finalValue : Nat           -- g(r₁, ..., rₙ)

def verifySumcheck (transcript : SumcheckTranscript) (p : Nat) : Bool :=
  -- Check 1: First round
  let g1 := transcript.roundPolys.head!
  let firstCheck := (evalPoly g1 0 + evalPoly g1 1) % p == transcript.claimedSum % p

  -- Check 2: Intermediate rounds
  let intermediateChecks := transcript.roundPolys.zip transcript.challenges
    |>.zipWith (fun (gPrev, r) gCurr =>
      (evalPoly gCurr 0 + evalPoly gCurr 1) % p == evalPoly gPrev r
    ) transcript.roundPolys.tail

  -- Check 3: Final round
  let gn := transcript.roundPolys.getLast!
  let rn := transcript.challenges.getLast!
  let finalCheck := evalPoly gn rn == transcript.finalValue

  firstCheck && intermediateChecks.all id && finalCheck
\`\`\`

### Verifier Complexity

| Operation | Count |
|-----------|-------|
| Receive polynomials | n |
| Evaluate at 0, 1 | 2n |
| Generate challenges | n |
| Query oracle | 1 |
| **Total** | O(n) |

### Soundness

If the prover cheats:
- At some round, their polynomial disagrees with truth
- Random challenge hits agreement point with prob ≤ d/|F|
- Union bound: cheat detected except prob nd/|F|`
    },
    {
      type: 'exercise',
      title: 'Exercise: Verifier Check',
      exercise: {
        id: 'ex-sum-03',
        title: 'Full Round Verification',
        description: 'Implement verification of all rounds: first, intermediate, and final checks.',
        initialCode: `structure UniPoly where
  coeffs : List Nat
  p : Nat

def evalPoly (poly : UniPoly) (x : Nat) : Nat :=
  poly.coeffs.enum.foldl (fun acc (i, c) =>
    (acc + c * (x ^ i)) % poly.p
  ) 0

-- Verify the first round of sumcheck
-- g₁(0) + g₁(1) should equal claimedSum
def verifyFirstRound (g1 : UniPoly) (claimedSum : Nat) : Bool :=
  -- YOUR CODE HERE
  sorry

-- Verify intermediate round
-- gᵢ(0) + gᵢ(1) should equal gᵢ₋₁(rᵢ₋₁)
def verifyIntermediateRound (gPrev : UniPoly) (rPrev : Nat) (gCurr : UniPoly) : Bool :=
  -- YOUR CODE HERE
  sorry

-- Verify final round
-- gₙ(rₙ) should equal the oracle value
def verifyFinalRound (gn : UniPoly) (rn : Nat) (oracleValue : Nat) : Bool :=
  -- YOUR CODE HERE
  sorry
`,
        solution: `structure UniPoly where
  coeffs : List Nat
  p : Nat

def evalPoly (poly : UniPoly) (x : Nat) : Nat :=
  poly.coeffs.enum.foldl (fun acc (i, c) =>
    (acc + c * (x ^ i)) % poly.p
  ) 0

def verifyFirstRound (g1 : UniPoly) (claimedSum : Nat) : Bool :=
  (evalPoly g1 0 + evalPoly g1 1) % g1.p == claimedSum % g1.p

def verifyIntermediateRound (gPrev : UniPoly) (rPrev : Nat) (gCurr : UniPoly) : Bool :=
  (evalPoly gCurr 0 + evalPoly gCurr 1) % gCurr.p == evalPoly gPrev rPrev % gCurr.p

def verifyFinalRound (gn : UniPoly) (rn : Nat) (oracleValue : Nat) : Bool :=
  evalPoly gn rn == oracleValue % gn.p`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'First round: eval at 0 and 1, sum should equal claimedSum',
          'Intermediate: sum of current should equal prev evaluated at challenge',
          'Final: current evaluated at challenge should equal oracle value'
        ],
        testCases: [
          {
            description: 'def verifyFirstRound',
            validator: (code) => /def\s+verifyFirstRound/.test(code)
          },
          {
            description: 'first round evals at 0 and 1',
            validator: (code) => /evalPoly\s+g1\s+0.*evalPoly\s+g1\s+1/.test(code.replace(/\n/g, ''))
          },
          {
            description: 'def verifyIntermediateRound',
            validator: (code) => /def\s+verifyIntermediateRound/.test(code)
          },
          {
            description: 'def verifyFinalRound',
            validator: (code) => /def\s+verifyFinalRound/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Applications',
      content: `## Applications of Sumcheck

### 1. #SAT Counting

Count satisfying assignments of a Boolean formula:
- Convert formula to polynomial g
- Satisfying assignment → g(b) = 1
- Sum over {0,1}ⁿ counts solutions

### 2. GKR Protocol

Verify layered arithmetic circuits:
- Each layer reduction uses sumcheck
- Prover does O(|C|) work
- Verifier does O(depth · log|C|) work

### 3. Polynomial Identity Testing

Prove two polynomials are equal:
\`\`\`
Σ_b (f(b) - g(b))² = 0  iff  f ≡ g on {0,1}ⁿ
\`\`\`

### 4. Matrix Multiplication

Prove C = A × B:
\`\`\`
Σ_{x,y,z} ã(x,y)·b̃(y,z)·c̃(x,z) - Σ_{x,y} ã(x,y)·[Σ_z b̃(y,z)·c̃(x,z)] = 0
\`\`\`

### 5. Modern ZK-SNARKs

| System | Uses Sumcheck For |
|--------|-------------------|
| Spartan | Constraint satisfaction |
| Lasso | Lookup arguments |
| Jolt | VM execution proofs |
| Plonky3 | FRI queries |

### Why Sumcheck is Powerful

1. **Interactive → Non-interactive**: Fiat-Shamir transform
2. **Composable**: Chain multiple sumchecks
3. **Efficient**: O(n) verifier, O(2ⁿ) prover (often improved)`
    },
    {
      type: 'exercise',
      title: 'Exercise: Complete Sumcheck',
      exercise: {
        id: 'ex-sum-04',
        title: 'Simple Sumcheck Instance',
        description: 'Create a complete sumcheck instance for a simple polynomial and verify it.',
        initialCode: `structure UniPoly where
  coeffs : List Nat
  p : Nat

def evalPoly (poly : UniPoly) (x : Nat) : Nat :=
  poly.coeffs.enum.foldl (fun acc (i, c) =>
    (acc + c * (x ^ i)) % poly.p
  ) 0

-- Consider g(x₁, x₂) = x₁ + x₂ over Z_7
-- Sum over {0,1}² = g(0,0) + g(0,1) + g(1,0) + g(1,1)
--                 = 0 + 1 + 1 + 2 = 4

-- Round 1: g₁(X) = g(X, 0) + g(X, 1) = X + (X + 1) = 2X + 1
-- Check: g₁(0) + g₁(1) = 1 + 3 = 4 ✓

-- Create the round 1 polynomial: 2X + 1 in Z_7
def g1 : UniPoly :=
  -- YOUR CODE HERE: coeffs for 1 + 2X
  sorry

-- Verify the sumcheck for claimed sum = 4
def verifyExample : Bool :=
  let claimedSum := 4
  let val0 := evalPoly g1 0
  let val1 := evalPoly g1 1
  -- YOUR CODE: check val0 + val1 == claimedSum mod 7
  sorry
`,
        solution: `structure UniPoly where
  coeffs : List Nat
  p : Nat

def evalPoly (poly : UniPoly) (x : Nat) : Nat :=
  poly.coeffs.enum.foldl (fun acc (i, c) =>
    (acc + c * (x ^ i)) % poly.p
  ) 0

def g1 : UniPoly :=
  { coeffs := [1, 2], p := 7 }

def verifyExample : Bool :=
  let claimedSum := 4
  let val0 := evalPoly g1 0
  let val1 := evalPoly g1 1
  (val0 + val1) % 7 == claimedSum`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'g₁(X) = 1 + 2X, so coeffs = [1, 2]',
          'Don\'t forget to set p = 7',
          'Verify by checking (g₁(0) + g₁(1)) mod 7 == 4'
        ],
        testCases: [
          {
            description: 'def g1',
            validator: (code) => /def\s+g1\s*:\s*UniPoly/.test(code)
          },
          {
            description: 'coeffs [1, 2]',
            validator: (code) => /coeffs\s*:=\s*\[1,\s*2\]/.test(code)
          },
          {
            description: 'def verifyExample',
            validator: (code) => /def\s+verifyExample/.test(code)
          },
          {
            description: 'returns true for valid sum',
            validator: (code) => /val0\s*\+\s*val1/.test(code) && /%\s*7/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Summary',
      content: `# Summary: Sumcheck Protocol

You've learned one of the most important tools in modern cryptography!

## The Protocol

\`\`\`
Claim: H = Σ_{b∈{0,1}ⁿ} g(b)

For i = 1 to n:
  Prover sends gᵢ(X)
  Verifier checks: gᵢ(0) + gᵢ(1) = gᵢ₋₁(rᵢ₋₁)
  Verifier sends random rᵢ

Final: Verifier checks g(r₁,...,rₙ) = gₙ(rₙ)
\`\`\`

## Complexity

| Party | Work |
|-------|------|
| Prover | O(2ⁿ) with caching |
| Verifier | O(n) field operations |

## Security

- Soundness error: ≤ nd/|F|
- Can be made negligible with large field

## Applications

- Interactive proofs (IP = PSPACE)
- ZK-SNARKs (Spartan, Lasso, Jolt)
- Verifiable computation
- Polynomial identity testing

## Congratulations!

You've completed all lessons in this course:
1. ✅ Lean Basics
2. ✅ Polynomials
3. ✅ Elliptic Curves
4. ✅ Diffie-Hellman
5. ✅ Lagrange Interpolation
6. ✅ Lattice Cryptography
7. ✅ Ring-LWE
8. ✅ Sumcheck Protocol

You now have a foundation in both Lean programming and cryptographic mathematics. Keep exploring!`
    }
  ]
}
