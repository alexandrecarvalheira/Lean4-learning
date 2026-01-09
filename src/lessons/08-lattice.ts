import { Lesson } from '@/lib/types'

export const latticeLesson: Lesson = {
  id: '08-lattice',
  title: 'Lattice-based Cryptography',
  description: 'Introduction to lattices and their applications in post-quantum cryptography',
  category: 'cryptography',
  order: 8,
  sections: [
    {
      type: 'content',
      title: 'Introduction to Lattices',
      content: `# Lattice-based Cryptography

Lattice-based cryptography is one of the most promising approaches for **post-quantum security**.

## Why Lattices?

- **Post-quantum**: Resistant to quantum computer attacks
- **Versatile**: Enables homomorphic encryption, signatures, key exchange
- **Efficient**: Fast in practice with moderate key sizes
- **Mathematical foundation**: Well-studied hard problems

## What is a Lattice?

A lattice is a discrete subgroup of ℝⁿ consisting of all integer linear combinations of a set of basis vectors.

\`\`\`
L = { Σᵢ aᵢbᵢ : aᵢ ∈ ℤ }
\`\`\`

### Visual Intuition (2D)

Imagine a grid of points in 2D space. Given two vectors b₁ and b₂, the lattice is all points you can reach by taking integer steps along these vectors.

\`\`\`
b₁ = (1, 0)
b₂ = (0, 1)
→ Standard integer grid
\`\`\`

\`\`\`
b₁ = (2, 1)
b₂ = (1, 3)
→ Tilted, stretched grid
\`\`\`

## NIST Post-Quantum Standards

| Algorithm | Type | Based On |
|-----------|------|----------|
| ML-KEM (Kyber) | Key encapsulation | Module-LWE |
| ML-DSA (Dilithium) | Signatures | Module-LWE |
| SLH-DSA (SPHINCS+) | Signatures | Hash-based |`
    },
    {
      type: 'content',
      title: 'Lattice Representation',
      content: `## Representing Lattices in Lean

A lattice is defined by its **basis matrix**.

### Matrix Basics

\`\`\`lean
-- Simple matrix as list of rows
structure Matrix where
  rows : List (List Int)
  numRows : Nat
  numCols : Nat
deriving Repr

def Matrix.get (m : Matrix) (i j : Nat) : Int :=
  (m.rows.getD i []).getD j 0
\`\`\`

### Lattice as Basis Vectors

\`\`\`lean
structure Lattice where
  basis : Matrix  -- Each row is a basis vector
deriving Repr

-- Dimension of the lattice
def Lattice.dimension (l : Lattice) : Nat :=
  l.basis.numCols
\`\`\`

### Lattice Point Generation

A point is in the lattice if it's an integer combination of basis vectors:

\`\`\`lean
-- Check if v is in lattice by finding integer coefficients
-- v = Σᵢ cᵢ × bᵢ where cᵢ ∈ ℤ
def isLatticePoint (l : Lattice) (v : List Int) : Bool :=
  -- This requires solving a system of linear equations
  -- and checking if solution is all integers
  -- Simplified version for demonstration
  true
\`\`\`

### Example

\`\`\`lean
-- The standard integer lattice Z²
def standardLattice2D : Lattice :=
  { basis := { rows := [[1, 0], [0, 1]], numRows := 2, numCols := 2 } }

-- A different basis for the same lattice
def altBasis2D : Lattice :=
  { basis := { rows := [[1, 1], [0, 1]], numRows := 2, numCols := 2 } }
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Define Lattice Types',
      exercise: {
        id: 'ex-lat-01',
        title: 'Create Matrix and Lattice Structures',
        description: 'Define the basic Matrix and Lattice structures in Lean.',
        initialCode: `-- Define a Matrix structure
-- Should have: rows (List of List Int), numRows (Nat), numCols (Nat)
-- YOUR CODE HERE


-- Define a Lattice structure with a basis of type Matrix
-- YOUR CODE HERE


-- Create the 2D standard integer lattice with basis [[1,0], [0,1]]
-- YOUR CODE HERE

`,
        solution: `structure Matrix where
  rows : List (List Int)
  numRows : Nat
  numCols : Nat

structure Lattice where
  basis : Matrix

def standardLattice2D : Lattice :=
  { basis := { rows := [[1, 0], [0, 1]], numRows := 2, numCols := 2 } }`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Matrix needs rows as List (List Int) and dimension info',
          'Lattice just wraps a Matrix as its basis',
          'The standard 2D lattice uses identity-like basis vectors'
        ],
        testCases: [
          {
            description: 'structure Matrix',
            validator: (code) => /structure\s+Matrix\s+where/.test(code) && /rows\s*:\s*List\s*\(List\s+Int\)/.test(code)
          },
          {
            description: 'structure Lattice',
            validator: (code) => /structure\s+Lattice\s+where/.test(code) && /basis\s*:\s*Matrix/.test(code)
          },
          {
            description: 'def standardLattice2D',
            validator: (code) => /def\s+standardLattice2D\s*:\s*Lattice/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Hard Lattice Problems',
      content: `## Computationally Hard Problems

The security of lattice cryptography relies on these hard problems:

### 1. Shortest Vector Problem (SVP)

**Problem**: Find the shortest non-zero vector in a lattice.

\`\`\`
Given: Lattice basis B
Find: Shortest v ∈ L(B) with v ≠ 0
\`\`\`

- NP-hard to solve exactly
- Even approximating within polynomial factor is hard

### 2. Closest Vector Problem (CVP)

**Problem**: Find the lattice point closest to a target.

\`\`\`
Given: Lattice basis B, target point t
Find: v ∈ L(B) minimizing ||v - t||
\`\`\`

### 3. Learning With Errors (LWE)

**Problem**: Distinguish (A, As + e) from random.

\`\`\`
Given: Matrix A ∈ Zqⁿˣᵐ, vector b = As + e mod q
       where s is secret, e is small error
Find: s (or distinguish b from random)
\`\`\`

### Why These Are Hard

- **Quantum resistance**: No known quantum algorithm solves them efficiently
- **Worst-case hardness**: Average-case hardness reduces to worst-case
- **Parameter flexibility**: Security can be precisely tuned

### Comparison to Classical Problems

| Problem | Classical | Quantum |
|---------|-----------|---------|
| Factoring | Subexponential | Polynomial (Shor) |
| DLP | Subexponential | Polynomial (Shor) |
| SVP/LWE | Exponential | Exponential |`
    },
    {
      type: 'content',
      title: 'The Learning With Errors (LWE) Problem',
      content: `## LWE: Foundation of Lattice Crypto

LWE is the most important problem in lattice cryptography.

### The Problem Setup

1. Secret vector s ∈ Zqⁿ
2. Random matrix A ∈ Zqᵐˣⁿ
3. Small error vector e ∈ Zqᵐ (entries from small distribution)
4. Compute b = As + e mod q

### The Challenge

Given (A, b), find s OR distinguish from random (A, r).

### In Lean

\`\`\`lean
structure LWEInstance where
  n : Nat        -- Secret dimension
  m : Nat        -- Number of samples
  q : Nat        -- Modulus
  A : Matrix     -- Public matrix
  b : List Nat   -- b = As + e mod q

-- Generate an LWE sample
def generateLWE (n m q : Nat) (s : List Nat) (e : List Nat) : LWEInstance :=
  let A := generateRandomMatrix m n q
  let As := matrixVectorMul A s q
  let b := vectorAdd As e q
  { n := n, m := m, q := q, A := A, b := b }
\`\`\`

### Why Small Errors Matter

Without error: b = As is easy (Gaussian elimination)
With error: Finding s becomes as hard as worst-case SVP!

### Parameter Selection

| Parameter | Meaning | Typical Values |
|-----------|---------|----------------|
| n | Security parameter | 256-1024 |
| q | Modulus | Prime ~10000 |
| m | Samples | ~2n |
| σ | Error std dev | ~3-8 |`
    },
    {
      type: 'exercise',
      title: 'Exercise: Vector Operations',
      exercise: {
        id: 'ex-lat-02',
        title: 'Implement Modular Vector Operations',
        description: 'Implement vector addition and scalar-vector multiplication modulo q.',
        initialCode: `-- Add two vectors element-wise modulo q
-- [a₁, a₂, ...] + [b₁, b₂, ...] = [(a₁+b₁) mod q, (a₂+b₂) mod q, ...]
def vectorAddMod (a b : List Nat) (q : Nat) : List Nat :=
  -- YOUR CODE HERE
  sorry

-- Multiply vector by scalar modulo q
-- c * [a₁, a₂, ...] = [(c*a₁) mod q, (c*a₂) mod q, ...]
def scalarMulMod (c : Nat) (v : List Nat) (q : Nat) : List Nat :=
  -- YOUR CODE HERE
  sorry

-- Test: vectorAddMod [1, 2, 3] [4, 5, 6] 7 = [5, 0, 2]
-- Test: scalarMulMod 3 [1, 2, 3] 7 = [3, 6, 2]
`,
        solution: `def vectorAddMod (a b : List Nat) (q : Nat) : List Nat :=
  a.zipWith (fun x y => (x + y) % q) b

def scalarMulMod (c : Nat) (v : List Nat) (q : Nat) : List Nat :=
  v.map (fun x => (c * x) % q)`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Use zipWith to combine two lists element by element',
          'Use map to apply a function to each element',
          'Remember to take modulo q in both operations'
        ],
        testCases: [
          {
            description: 'def vectorAddMod',
            validator: (code) => /def\s+vectorAddMod/.test(code)
          },
          {
            description: 'uses zipWith',
            validator: (code) => /zipWith/.test(code)
          },
          {
            description: 'def scalarMulMod',
            validator: (code) => /def\s+scalarMulMod/.test(code)
          },
          {
            description: 'uses map',
            validator: (code) => /\.map/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'LWE-based Encryption',
      content: `## Regev Encryption Scheme

A simple public-key encryption scheme based on LWE.

### Key Generation

\`\`\`lean
structure PublicKey where
  A : Matrix      -- m × n matrix
  b : List Nat    -- b = As + e

structure SecretKey where
  s : List Nat    -- n-dimensional secret

def keyGen (n m q : Nat) (s : List Nat) (e : List Nat) : PublicKey × SecretKey :=
  let A := randomMatrix m n q
  let b := matrixVectorMul A s q |>.zipWith (·+·) e |>.map (· % q)
  ({ A := A, b := b }, { s := s })
\`\`\`

### Encryption

To encrypt a bit μ ∈ {0, 1}:

\`\`\`lean
def encrypt (pk : PublicKey) (μ : Nat) (q : Nat) (r : List Nat) : (List Nat × Nat) :=
  -- r is a random subset selector (0/1 vector)
  let u := rᵀA mod q       -- Subset sum of A rows
  let v := rᵀb + μ(q/2)    -- Subset sum of b + encoding
  (u, v % q)
\`\`\`

### Decryption

\`\`\`lean
def decrypt (sk : SecretKey) (u : List Nat) (v : Nat) (q : Nat) : Nat :=
  let diff := (v - dotProduct u sk.s) % q
  -- diff ≈ μ(q/2) + small error
  if diff > q / 4 && diff < 3 * q / 4 then 1 else 0
\`\`\`

### Why It Works

- Ciphertext: (u, v) where v ≈ ⟨u, s⟩ + μ(q/2) + small error
- Decryption: v - ⟨u, s⟩ ≈ μ(q/2)
- If μ = 0: result near 0
- If μ = 1: result near q/2`
    },
    {
      type: 'exercise',
      title: 'Exercise: Dot Product',
      exercise: {
        id: 'ex-lat-03',
        title: 'Implement Modular Dot Product',
        description: 'Implement the dot product of two vectors modulo q, which is essential for LWE operations.',
        initialCode: `-- Compute dot product of two vectors modulo q
-- ⟨a, b⟩ = Σᵢ aᵢ × bᵢ mod q
def dotProductMod (a b : List Nat) (q : Nat) : Nat :=
  -- YOUR CODE HERE
  -- Hint: zip the lists, multiply pairs, sum, take mod q
  sorry

-- Test: dotProductMod [1, 2, 3] [4, 5, 6] 10 = (4 + 10 + 18) mod 10 = 32 mod 10 = 2
`,
        solution: `def dotProductMod (a b : List Nat) (q : Nat) : Nat :=
  a.zipWith (· * ·) b |>.foldl (· + ·) 0 |> (· % q)`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'First zipWith to multiply corresponding elements',
          'Then foldl with + to sum all products',
          'Finally take modulo q'
        ],
        testCases: [
          {
            description: 'def dotProductMod',
            validator: (code) => /def\s+dotProductMod/.test(code)
          },
          {
            description: 'uses zipWith for multiplication',
            validator: (code) => /zipWith/.test(code)
          },
          {
            description: 'uses foldl for sum',
            validator: (code) => /foldl/.test(code)
          },
          {
            description: 'uses modulo q',
            validator: (code) => /%\s*q/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Ring-LWE Preview',
      content: `## From LWE to Ring-LWE

Standard LWE has large key sizes. Ring-LWE offers much better efficiency.

### The Idea

Instead of vectors in Zqⁿ, use polynomials in Zq[x]/(xⁿ + 1).

| Aspect | LWE | Ring-LWE |
|--------|-----|----------|
| Elements | Vectors | Polynomials |
| Operations | Matrix-vector | Polynomial multiplication |
| Key size | O(n²) | O(n) |
| Speed | Slower | Faster (NTT) |

### Ring Structure

\`\`\`
Rq = Zq[x]/(xⁿ + 1)
\`\`\`

Elements are polynomials of degree < n with coefficients in Zq.

### Ring-LWE Problem

\`\`\`
Given: (a, b = a·s + e) in Rq × Rq
Find: s ∈ Rq (or distinguish from random)
\`\`\`

### Why Polynomials Help

1. **Structured**: Single polynomial a instead of matrix A
2. **Fast multiplication**: Use NTT (Number Theoretic Transform)
3. **Same security**: Reduction from worst-case lattice problems

### Real-World Impact

| Scheme | Based On | Key Size |
|--------|----------|----------|
| Kyber | Module-LWE | ~1.5 KB |
| Dilithium | Module-LWE | ~2.5 KB |
| NTRU | Ring problems | ~1 KB |

We'll explore Ring-LWE in detail in the next lesson!`
    },
    {
      type: 'exercise',
      title: 'Exercise: Simple LWE Instance',
      exercise: {
        id: 'ex-lat-04',
        title: 'Create LWE Instance Structure',
        description: 'Define the LWE instance structure and a function to create one from components.',
        initialCode: `-- Define the LWE instance structure
-- n: dimension, q: modulus, a: coefficient vector, b: noisy product
structure LWEInstance where
  -- YOUR CODE HERE: add fields n, q (Nat), a (List Nat), b (Nat)
  sorry

-- Create an LWE instance given parameters
-- b = ⟨a, s⟩ + e mod q
def createLWE (a s : List Nat) (e q : Nat) : LWEInstance :=
  -- Compute dot product, add error, create instance
  -- YOUR CODE HERE
  sorry

-- Test: createLWE [1, 2] [3, 4] 1 17
-- b = (1*3 + 2*4 + 1) mod 17 = 12 mod 17 = 12
`,
        solution: `structure LWEInstance where
  n : Nat
  q : Nat
  a : List Nat
  b : Nat

def createLWE (a s : List Nat) (e q : Nat) : LWEInstance :=
  let dotProd := a.zipWith (· * ·) s |>.foldl (· + ·) 0
  let b := (dotProd + e) % q
  { n := a.length, q := q, a := a, b := b }`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'LWEInstance needs n, q, a (vector), and b (single value)',
          'Use zipWith and foldl to compute dot product',
          'Add error e and take modulo q'
        ],
        testCases: [
          {
            description: 'structure LWEInstance',
            validator: (code) => /structure\s+LWEInstance\s+where/.test(code)
          },
          {
            description: 'has n and q fields',
            validator: (code) => /n\s*:\s*Nat/.test(code) && /q\s*:\s*Nat/.test(code)
          },
          {
            description: 'def createLWE',
            validator: (code) => /def\s+createLWE/.test(code)
          },
          {
            description: 'computes dot product',
            validator: (code) => /zipWith/.test(code) || /foldl/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Summary',
      content: `# Summary: Lattice-based Cryptography

You've learned the foundations of lattice-based cryptography!

## Key Concepts

### Lattices
- Discrete grid of points in ℝⁿ
- Defined by basis vectors
- Integer linear combinations

### Hard Problems
- **SVP**: Find shortest vector
- **CVP**: Find closest lattice point
- **LWE**: Distinguish noisy products from random

### LWE Structure
\`\`\`
b = As + e mod q
\`\`\`
- A: random public matrix
- s: secret vector
- e: small error vector
- Security from noise!

## Why This Matters

### Post-Quantum Security
- Resistant to Shor's algorithm
- NIST standardized: Kyber, Dilithium

### Versatility
- Encryption (Regev, Kyber)
- Signatures (Dilithium)
- Homomorphic encryption (BGV, BFV, CKKS)

## Next Lesson

In **Ring-LWE**, you'll learn:
- Polynomial ring arithmetic
- Efficient multiplication with NTT
- How Kyber and Dilithium actually work!`
    }
  ]
}
