import { Lesson } from '@/lib/types'

export const polynomialsLesson: Lesson = {
  id: '04-polynomials',
  title: 'Polynomials in Lean',
  description: 'Learn to represent and manipulate polynomials, essential for cryptographic protocols',
  category: 'cryptography',
  order: 4,
  sections: [
    {
      type: 'content',
      title: 'Introduction to Polynomials',
      content: `# Polynomials in Cryptography

Polynomials are fundamental building blocks in modern cryptography. They appear in:

- **Secret Sharing** (Shamir's scheme)
- **Zero-Knowledge Proofs** (polynomial commitments)
- **Error-Correcting Codes** (Reed-Solomon)
- **Homomorphic Encryption** (RLWE-based schemes)

## What is a Polynomial?

A polynomial is an expression of the form:

\`\`\`
p(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀
\`\`\`

Where:
- \`x\` is the variable (indeterminate)
- \`aᵢ\` are the coefficients
- \`n\` is the degree (highest power with non-zero coefficient)

## Examples

- \`p(x) = 3x² + 2x + 1\` has degree 2
- \`p(x) = x³ - 4x\` has degree 3
- \`p(x) = 5\` has degree 0 (constant)

## In Lean

We'll represent polynomials as **lists of coefficients** where the index represents the power of x.

\`\`\`lean
-- [1, 2, 3] represents: 1 + 2x + 3x²
-- Coefficient at index i is for xⁱ
\`\`\``
    },
    {
      type: 'content',
      title: 'Representing Polynomials',
      content: `## Polynomial Representation in Lean

We'll use a structure to represent polynomials with integer coefficients:

\`\`\`lean
-- Polynomial as a list of coefficients
-- Index i contains the coefficient of x^i
structure Polynomial where
  coeffs : List Int
deriving Repr
\`\`\`

### Creating Polynomials

\`\`\`lean
-- 3x² + 2x + 1
def p1 : Polynomial := { coeffs := [1, 2, 3] }

-- x³ - 4x = -4x + 0x² + 1x³
def p2 : Polynomial := { coeffs := [0, -4, 0, 1] }

-- Constant 5
def p3 : Polynomial := { coeffs := [5] }
\`\`\`

### Getting the Degree

\`\`\`lean
def Polynomial.degree (p : Polynomial) : Nat :=
  p.coeffs.length - 1
\`\`\`

### Getting a Coefficient

\`\`\`lean
def Polynomial.coeff (p : Polynomial) (i : Nat) : Int :=
  p.coeffs.getD i 0  -- Default to 0 if index out of bounds
\`\`\`

### Normalizing (removing trailing zeros)

\`\`\`lean
def Polynomial.normalize (p : Polynomial) : Polynomial :=
  { coeffs := p.coeffs.reverse.dropWhile (· == 0) |>.reverse }
\`\`\`

This representation is simple but effective for our cryptographic applications!`
    },
    {
      type: 'exercise',
      title: 'Exercise: Define Polynomial Structure',
      exercise: {
        id: 'ex-poly-01',
        title: 'Create Polynomial Structure',
        description: 'Define the Polynomial structure with a coeffs field of type List Int. Then create a polynomial representing 2x² + 3x + 5.',
        initialCode: `-- Define a structure called Polynomial with coeffs : List Int
-- YOUR CODE HERE


-- Create myPoly representing 2x² + 3x + 5
-- Remember: [a₀, a₁, a₂] means a₀ + a₁x + a₂x²
-- YOUR CODE HERE

`,
        solution: `structure Polynomial where
  coeffs : List Int

def myPoly : Polynomial := { coeffs := [5, 3, 2] }`,
        explanation: `This exercise introduces polynomial representation in Lean.

**The coefficient list convention:**
We store coefficients in order of increasing powers:
- Index 0 → coefficient of x⁰ (constant term)
- Index 1 → coefficient of x¹
- Index 2 → coefficient of x²

So [5, 3, 2] represents 5 + 3x + 2x²

**Why this order?**
- Matches how we naturally index arrays (starting at 0)
- Easy to find coefficient of xⁱ: just access index i
- Constant term is always at index 0

**Alternative representations:**
Some systems use the opposite convention (highest degree first), but our choice:
- Makes polynomial evaluation simpler with foldl
- Aligns with the mathematical indexing aᵢ for xⁱ

**Creating the structure:**
\`{ coeffs := [5, 3, 2] }\` uses record syntax to initialize the coeffs field.`,
        hints: [
          'The structure has one field: coeffs of type List Int',
          'For 2x² + 3x + 5, the coefficients are [5, 3, 2] (constant term first)',
          'Use { coeffs := [...] } to create an instance'
        ],
        testCases: [
          {
            description: 'structure Polynomial',
            validator: (code) => /structure\s+Polynomial\s+where/.test(code) && /coeffs\s*:\s*List\s+Int/.test(code)
          },
          {
            description: 'def myPoly',
            validator: (code) => /def\s+myPoly\s*:\s*Polynomial/.test(code) && /\[5,\s*3,\s*2\]/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Polynomial Evaluation',
      content: `## Evaluating Polynomials

To evaluate a polynomial at a point x, we use **Horner's method** for efficiency.

### Naive Evaluation

\`\`\`
p(x) = a₀ + a₁x + a₂x² + a₃x³
\`\`\`

This requires computing powers of x separately.

### Horner's Method

Rewrite as nested multiplication:
\`\`\`
p(x) = a₀ + x(a₁ + x(a₂ + x(a₃)))
\`\`\`

This uses only n multiplications instead of n(n+1)/2!

### Implementation in Lean

\`\`\`lean
def Polynomial.eval (p : Polynomial) (x : Int) : Int :=
  p.coeffs.reverse.foldl (fun acc a => acc * x + a) 0
\`\`\`

Let's trace through an example:
- \`p = [1, 2, 3]\` represents \`1 + 2x + 3x²\`
- Evaluate at x = 2
- Reversed: [3, 2, 1]
- Fold: 0 → 0*2+3=3 → 3*2+2=8 → 8*2+1=17
- Result: 17 ✓ (since 1 + 2(2) + 3(4) = 1 + 4 + 12 = 17)

### Why This Matters

- **Cryptographic protocols** evaluate polynomials at many points
- **Shamir's Secret Sharing** reconstructs secrets by evaluating at x=0
- **Polynomial commitments** use evaluations as proofs`
    },
    {
      type: 'exercise',
      title: 'Exercise: Polynomial Evaluation',
      exercise: {
        id: 'ex-poly-02',
        title: 'Implement Horner\'s Method',
        description: 'Implement the evalPoly function that evaluates a polynomial at a given point using Horner\'s method.',
        initialCode: `structure Polynomial where
  coeffs : List Int

-- Implement polynomial evaluation using Horner's method
-- Hint: Use foldl on the reversed coefficient list
-- The fold function should be: (acc, coeff) => acc * x + coeff
def evalPoly (p : Polynomial) (x : Int) : Int :=
  -- YOUR CODE HERE
  sorry

-- Test: evalPoly { coeffs := [1, 2, 3] } 2 should equal 17
-- Because: 1 + 2(2) + 3(4) = 1 + 4 + 12 = 17
`,
        solution: `structure Polynomial where
  coeffs : List Int

def evalPoly (p : Polynomial) (x : Int) : Int :=
  p.coeffs.reverse.foldl (fun acc a => acc * x + a) 0`,
        explanation: `Horner's method is an efficient algorithm for polynomial evaluation.

**The problem with naive evaluation:**
For p(x) = a₀ + a₁x + a₂x² + a₃x³:
- Compute x², x³ separately (many multiplications)
- Multiply each aᵢ by xⁱ
- Add everything up

This needs O(n²) multiplications for degree n.

**Horner's insight:**
Rewrite as nested form:
p(x) = a₀ + x(a₁ + x(a₂ + x·a₃))

Now we only need n multiplications!

**The algorithm:**
1. Start with the highest coefficient: a₃
2. Multiply by x and add next: a₃·x + a₂
3. Multiply by x and add next: (a₃·x + a₂)·x + a₁
4. Continue until done

**Why reverse?**
Our list [a₀, a₁, a₂, a₃] has lowest coefficient first.
Reversing gives [a₃, a₂, a₁, a₀], starting with highest.

**The foldl operation:**
\`\`\`
foldl f init [a₃, a₂, a₁, a₀]
= f(f(f(f(init, a₃), a₂), a₁), a₀)
= ((init·x + a₃)·x + a₂)·x + a₁)·x + a₀
\`\`\`

With init=0, this gives exactly p(x)!`,
        hints: [
          'First reverse the coefficients list',
          'Use foldl with initial value 0',
          'The fold function: fun acc a => acc * x + a'
        ],
        testCases: [
          {
            description: 'def evalPoly',
            validator: (code) => /def\s+evalPoly/.test(code) && /foldl/.test(code)
          },
          {
            description: 'uses reverse',
            validator: (code) => /\.reverse/.test(code)
          },
          {
            description: 'fold function',
            validator: (code) => /acc\s*\*\s*x\s*\+\s*a/.test(code) || /acc.*\*.*x.*\+/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Polynomial Addition',
      content: `## Adding Polynomials

To add two polynomials, we add their coefficients at each power of x.

\`\`\`
(a₀ + a₁x + a₂x²) + (b₀ + b₁x + b₂x²) = (a₀+b₀) + (a₁+b₁)x + (a₂+b₂)x²
\`\`\`

### Implementation Strategy

1. Pad the shorter list with zeros
2. Zip the lists together
3. Add corresponding coefficients

\`\`\`lean
def padRight (lst : List Int) (n : Nat) : List Int :=
  lst ++ List.replicate (n - lst.length) 0

def Polynomial.add (p q : Polynomial) : Polynomial :=
  let maxLen := max p.coeffs.length q.coeffs.length
  let padP := padRight p.coeffs maxLen
  let padQ := padRight q.coeffs maxLen
  { coeffs := padP.zipWith (· + ·) padQ }
\`\`\`

### Example

\`\`\`lean
-- p1 = 1 + 2x + 3x²  → [1, 2, 3]
-- p2 = 4 + 5x        → [4, 5]
-- After padding p2   → [4, 5, 0]
-- Sum                → [5, 7, 3] = 5 + 7x + 3x²
\`\`\`

### Properties (for proofs later!)

- **Commutativity**: p + q = q + p
- **Associativity**: (p + q) + r = p + (q + r)
- **Identity**: p + 0 = p

These properties make polynomials form a **ring** - essential for cryptographic applications.`
    },
    {
      type: 'exercise',
      title: 'Exercise: Polynomial Addition',
      exercise: {
        id: 'ex-poly-03',
        title: 'Implement Polynomial Addition',
        description: 'Implement a function addPoly that adds two polynomials by adding their corresponding coefficients.',
        initialCode: `structure Polynomial where
  coeffs : List Int

-- Helper: pad a list with zeros to length n
def padRight (lst : List Int) (n : Nat) : List Int :=
  lst ++ List.replicate (n - lst.length) 0

-- Implement polynomial addition
-- 1. Find the max length of the two coefficient lists
-- 2. Pad both lists to the max length
-- 3. Zip and add corresponding coefficients
def addPoly (p q : Polynomial) : Polynomial :=
  -- YOUR CODE HERE
  sorry
`,
        solution: `structure Polynomial where
  coeffs : List Int

def padRight (lst : List Int) (n : Nat) : List Int :=
  lst ++ List.replicate (n - lst.length) 0

def addPoly (p q : Polynomial) : Polynomial :=
  let maxLen := max p.coeffs.length q.coeffs.length
  let padP := padRight p.coeffs maxLen
  let padQ := padRight q.coeffs maxLen
  { coeffs := padP.zipWith (· + ·) padQ }`,
        explanation: `Polynomial addition adds corresponding coefficients.

**Mathematical definition:**
(a₀ + a₁x + a₂x²) + (b₀ + b₁x + b₂x²) = (a₀+b₀) + (a₁+b₁)x + (a₂+b₂)x²

**The challenge:**
What if polynomials have different degrees?
- [1, 2, 3] + [4, 5] = ?
- We need to align the coefficients properly

**The solution - padding:**
1. Find the maximum length: max(3, 2) = 3
2. Pad shorter list with zeros: [4, 5, 0]
3. Now both lists have same length: [1,2,3] and [4,5,0]
4. Add element-wise: [5, 7, 3]

**zipWith explained:**
\`zipWith f [a,b,c] [x,y,z] = [f(a,x), f(b,y), f(c,z)]\`

With (· + ·) as f:
\`zipWith (+) [1,2,3] [4,5,0] = [1+4, 2+5, 3+0] = [5,7,3]\`

**Why this matters:**
In cryptography, we constantly add polynomials:
- Combining shares in secret sharing
- Adding noise in RLWE encryption
- Polynomial arithmetic in STARKs`,
        hints: [
          'Use max to find the larger length',
          'Use padRight to pad both lists',
          'Use zipWith with (· + ·) to add corresponding elements'
        ],
        testCases: [
          {
            description: 'def addPoly',
            validator: (code) => /def\s+addPoly/.test(code)
          },
          {
            description: 'uses max',
            validator: (code) => /max\s+p\.coeffs\.length\s+q\.coeffs\.length/.test(code) || /max.*\.length.*\.length/.test(code)
          },
          {
            description: 'uses zipWith',
            validator: (code) => /zipWith/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Polynomial Multiplication',
      content: `## Multiplying Polynomials

Polynomial multiplication uses the **convolution** of coefficients.

### The Algorithm

For p(x) = Σ aᵢxⁱ and q(x) = Σ bⱼxʲ, the product is:

\`\`\`
(p · q)(x) = Σₖ cₖxᵏ  where  cₖ = Σᵢ₊ⱼ₌ₖ aᵢbⱼ
\`\`\`

### Example

\`\`\`
(1 + 2x) · (3 + 4x) = 3 + 4x + 6x + 8x² = 3 + 10x + 8x²
\`\`\`

### Implementation in Lean

\`\`\`lean
def Polynomial.mul (p q : Polynomial) : Polynomial :=
  let n := p.coeffs.length
  let m := q.coeffs.length
  if n == 0 || m == 0 then { coeffs := [] }
  else
    let resultLen := n + m - 1
    let computeCoeff (k : Nat) : Int :=
      let pairs := List.range (k + 1)
      pairs.foldl (fun acc i =>
        if i < n && k - i < m then
          acc + (p.coeffs.getD i 0) * (q.coeffs.getD (k - i) 0)
        else acc
      ) 0
    { coeffs := List.range resultLen |>.map computeCoeff }
\`\`\`

### Computational Complexity

- Naive: O(n²)
- FFT-based (for large polynomials): O(n log n)

For cryptographic applications, specialized algorithms like **Number Theoretic Transform (NTT)** are used for efficiency.`
    },
    {
      type: 'exercise',
      title: 'Exercise: Simple Multiplication',
      exercise: {
        id: 'ex-poly-04',
        title: 'Multiply Linear Polynomials',
        description: 'Implement a function mulLinear that multiplies two linear polynomials (degree 1). Given (a₀ + a₁x) and (b₀ + b₁x), compute the result.',
        initialCode: `structure Polynomial where
  coeffs : List Int

-- Multiply two linear polynomials (degree 1)
-- (a₀ + a₁x) · (b₀ + b₁x) = a₀b₀ + (a₀b₁ + a₁b₀)x + a₁b₁x²
-- Input: p and q each have exactly 2 coefficients
def mulLinear (p q : Polynomial) : Polynomial :=
  -- Extract coefficients
  let a0 := p.coeffs.getD 0 0
  let a1 := p.coeffs.getD 1 0
  let b0 := q.coeffs.getD 0 0
  let b1 := q.coeffs.getD 1 0
  -- Compute result coefficients
  -- YOUR CODE HERE
  sorry
`,
        solution: `structure Polynomial where
  coeffs : List Int

def mulLinear (p q : Polynomial) : Polynomial :=
  let a0 := p.coeffs.getD 0 0
  let a1 := p.coeffs.getD 1 0
  let b0 := q.coeffs.getD 0 0
  let b1 := q.coeffs.getD 1 0
  let c0 := a0 * b0
  let c1 := a0 * b1 + a1 * b0
  let c2 := a1 * b1
  { coeffs := [c0, c1, c2] }`,
        explanation: `Polynomial multiplication uses the FOIL method (for linear polynomials).

**The formula:**
(a₀ + a₁x)(b₀ + b₁x) = ?

Expand using distributive property:
- a₀ × b₀ = a₀b₀ (constant term)
- a₀ × b₁x = a₀b₁x
- a₁x × b₀ = a₁b₀x
- a₁x × b₁x = a₁b₁x²

Combine:
a₀b₀ + (a₀b₁ + a₁b₀)x + a₁b₁x²

**Concrete example:**
(1 + 2x)(3 + 4x):
- c₀ = 1×3 = 3
- c₁ = 1×4 + 2×3 = 4 + 6 = 10
- c₂ = 2×4 = 8
Result: 3 + 10x + 8x²

**The general pattern (convolution):**
For polynomials of any degree:
cₖ = Σᵢ₊ⱼ₌ₖ aᵢbⱼ

The coefficient of xᵏ is the sum of products where indices add to k.

**Why this matters:**
- Linear polynomials appear in Lagrange interpolation
- Understanding the degree increase (deg(p×q) = deg(p) + deg(q))
- Foundation for general polynomial multiplication`,
        hints: [
          'c₀ = a₀ × b₀ (constant term)',
          'c₁ = a₀ × b₁ + a₁ × b₀ (coefficient of x)',
          'c₂ = a₁ × b₁ (coefficient of x²)'
        ],
        testCases: [
          {
            description: 'def mulLinear',
            validator: (code) => /def\s+mulLinear/.test(code)
          },
          {
            description: 'computes c0 = a0 * b0',
            validator: (code) => /a0\s*\*\s*b0/.test(code)
          },
          {
            description: 'computes c1',
            validator: (code) => /(a0\s*\*\s*b1.*a1\s*\*\s*b0)|(a1\s*\*\s*b0.*a0\s*\*\s*b1)/.test(code)
          },
          {
            description: 'computes c2 = a1 * b1',
            validator: (code) => /a1\s*\*\s*b1/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Polynomials over Finite Fields',
      content: `## Finite Field Polynomials

In cryptography, we often work with polynomials over **finite fields** (modular arithmetic).

### Why Finite Fields?

- **Bounded arithmetic**: Results don't grow infinitely
- **Exact computation**: No floating-point errors
- **Security**: Mathematical structure enables cryptographic protocols

### Modular Arithmetic

In a field Zₚ (integers mod prime p):
- All arithmetic is done modulo p
- Every non-zero element has a multiplicative inverse

\`\`\`lean
-- Operations in Z₇ (mod 7)
def modAdd (a b p : Nat) : Nat := (a + b) % p
def modMul (a b p : Nat) : Nat := (a * b) % p

-- Example in Z₇:
-- 5 + 4 = 9 ≡ 2 (mod 7)
-- 5 × 4 = 20 ≡ 6 (mod 7)
\`\`\`

### Polynomial Operations mod p

\`\`\`lean
structure ModPolynomial where
  coeffs : List Nat
  modulus : Nat

def ModPolynomial.eval (p : ModPolynomial) (x : Nat) : Nat :=
  p.coeffs.reverse.foldl (fun acc a => (acc * x + a) % p.modulus) 0
\`\`\`

### Application: Shamir's Secret Sharing

To split a secret S among n parties (k required to reconstruct):
1. Create random polynomial: p(x) = S + a₁x + ... + aₖ₋₁xᵏ⁻¹
2. Give party i the share (i, p(i))
3. Any k parties can reconstruct p(0) = S using Lagrange interpolation`
    },
    {
      type: 'exercise',
      title: 'Exercise: Modular Polynomial',
      exercise: {
        id: 'ex-poly-05',
        title: 'Evaluate Polynomial mod p',
        description: 'Implement evalMod that evaluates a polynomial at a point x, with all operations done modulo p.',
        initialCode: `structure ModPolynomial where
  coeffs : List Nat
  modulus : Nat

-- Evaluate polynomial at x with all operations mod p
-- Use Horner's method with modular arithmetic
def evalMod (poly : ModPolynomial) (x : Nat) : Nat :=
  -- YOUR CODE HERE
  sorry

-- Test: evalMod { coeffs := [1, 2, 3], modulus := 7 } 2
-- = (1 + 2×2 + 3×4) mod 7 = 17 mod 7 = 3
`,
        solution: `structure ModPolynomial where
  coeffs : List Nat
  modulus : Nat

def evalMod (poly : ModPolynomial) (x : Nat) : Nat :=
  poly.coeffs.reverse.foldl (fun acc a => (acc * x + a) % poly.modulus) 0`,
        explanation: `Modular polynomial evaluation keeps all values in a finite field.

**Why modular arithmetic?**
In cryptography, we need:
- Bounded numbers (don't grow infinitely large)
- Exact arithmetic (no rounding errors)
- Algebraic structure (every non-zero element has an inverse mod p)

**The key change from regular evaluation:**
Apply % poly.modulus at each step of Horner's method.

**Step-by-step example:**
Evaluate [1, 2, 3] at x=2 mod 7:
\`\`\`
Reversed: [3, 2, 1]
Step 1: (0 * 2 + 3) % 7 = 3
Step 2: (3 * 2 + 2) % 7 = 8 % 7 = 1
Step 3: (1 * 2 + 1) % 7 = 3
Result: 3
\`\`\`

Compare to regular: 1 + 4 + 12 = 17 ≡ 3 (mod 7) ✓

**Why apply mod at each step?**
- Keeps intermediate values small
- Prevents integer overflow
- Same result as applying mod at the end (due to modular arithmetic properties)

**Cryptographic applications:**
- Shamir's Secret Sharing: evaluate shares mod a prime p
- Polynomial commitments: all arithmetic is in a finite field
- RLWE encryption: coefficients in Zq`,
        hints: [
          'Similar to regular Horner\'s method, but apply mod at each step',
          'Use (acc * x + a) % poly.modulus in the fold',
          'Start with initial value 0'
        ],
        testCases: [
          {
            description: 'def evalMod',
            validator: (code) => /def\s+evalMod/.test(code)
          },
          {
            description: 'uses modulus',
            validator: (code) => /%\s*poly\.modulus/.test(code) || /mod\s+poly\.modulus/.test(code)
          },
          {
            description: 'uses foldl',
            validator: (code) => /foldl/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Summary',
      content: `# Summary: Polynomials in Lean

You've learned how to work with polynomials in Lean, a crucial skill for cryptography!

## Key Concepts

### Representation
- Polynomials as coefficient lists
- Index i = coefficient of xⁱ

### Operations
- **Evaluation**: Horner's method for efficiency
- **Addition**: Add corresponding coefficients
- **Multiplication**: Convolution of coefficients

### Finite Fields
- Modular arithmetic prevents overflow
- Essential for cryptographic security

## Applications Ahead

These polynomial operations are used in:

| Protocol | Polynomial Use |
|----------|---------------|
| Shamir's Secret Sharing | Share generation & reconstruction |
| KZG Commitments | Polynomial commitment schemes |
| STARKs | Polynomial interpolation & evaluation |
| Reed-Solomon | Error correction codes |
| RLWE Encryption | Ring polynomial operations |

## Next Lesson

In the next lesson, we'll explore **Elliptic Curves** - another fundamental mathematical structure in modern cryptography!`
    }
  ]
}
