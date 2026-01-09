import { Lesson } from '@/lib/types'

export const rlweLesson: Lesson = {
  id: '09-rlwe',
  title: 'Ring-LWE',
  description: 'Learn Ring Learning With Errors and polynomial ring arithmetic',
  category: 'cryptography',
  order: 9,
  sections: [
    {
      type: 'content',
      title: 'Introduction to Ring-LWE',
      content: `# Ring Learning With Errors (RLWE)

Ring-LWE is an efficient variant of LWE that uses polynomial arithmetic instead of matrices.

## The Key Insight

Replace vectors and matrices with polynomials:
- Instead of Zqⁿ, work in Zq[x]/(xⁿ + 1)
- Matrix multiplication becomes polynomial multiplication
- Key sizes shrink from O(n²) to O(n)!

## The Ring Structure

We work in the **polynomial ring**:

\`\`\`
Rq = Zq[x]/(xⁿ + 1)
\`\`\`

This means:
- Polynomials with coefficients in Zq
- Degree at most n-1
- When degree reaches n, reduce using xⁿ = -1

## RLWE Problem

\`\`\`
Given: (a, b = a·s + e) ∈ Rq × Rq
Find: s ∈ Rq (or distinguish from random)
\`\`\`

Where:
- a is a random polynomial
- s is a secret polynomial
- e is a polynomial with small coefficients (error)

## Why Ring-LWE Matters

| Scheme | Problem | Status |
|--------|---------|--------|
| Kyber | Module-LWE | NIST Standard (ML-KEM) |
| Dilithium | Module-LWE | NIST Standard (ML-DSA) |
| NewHope | Ring-LWE | Previous candidate |
| NTRU | Ring problems | Alternative standard |`
    },
    {
      type: 'content',
      title: 'Polynomial Ring Arithmetic',
      content: `## Arithmetic in Zq[x]/(xⁿ + 1)

### Representing Polynomials

\`\`\`lean
-- Polynomial in Rq: coefficients for x⁰, x¹, ..., xⁿ⁻¹
structure RingPoly where
  coeffs : List Nat  -- Length n, each in [0, q)
  n : Nat            -- Ring dimension (usually power of 2)
  q : Nat            -- Coefficient modulus
deriving Repr
\`\`\`

### Addition

Simply add coefficients mod q:

\`\`\`lean
def RingPoly.add (a b : RingPoly) : RingPoly :=
  { coeffs := a.coeffs.zipWith (fun x y => (x + y) % a.q) b.coeffs
    n := a.n
    q := a.q }
\`\`\`

### Subtraction

\`\`\`lean
def RingPoly.sub (a b : RingPoly) : RingPoly :=
  { coeffs := a.coeffs.zipWith (fun x y => (x + a.q - y) % a.q) b.coeffs
    n := a.n
    q := a.q }
\`\`\`

### Negation (needed for xⁿ = -1)

\`\`\`lean
def RingPoly.neg (a : RingPoly) : RingPoly :=
  { coeffs := a.coeffs.map (fun x => (a.q - x) % a.q)
    n := a.n
    q := a.q }
\`\`\`

### The Tricky Part: Multiplication

Multiply normally, then reduce by xⁿ + 1:
- xⁿ → -1
- xⁿ⁺¹ → -x
- xⁿ⁺ᵏ → -xᵏ

This is **negative wrapped convolution**.`
    },
    {
      type: 'exercise',
      title: 'Exercise: Ring Polynomial Structure',
      exercise: {
        id: 'ex-rlwe-01',
        title: 'Define Ring Polynomial Type',
        description: 'Define the RingPoly structure and implement polynomial addition in the ring Zq[x]/(xⁿ + 1).',
        initialCode: `-- Define the ring polynomial structure
-- coeffs: list of coefficients (length n)
-- n: ring dimension, q: modulus
-- YOUR CODE HERE


-- Implement polynomial addition
-- Add coefficients elementwise mod q
def ringAdd (a b : RingPoly) : RingPoly :=
  -- YOUR CODE HERE
  sorry

-- Test: ringAdd {coeffs := [1, 2, 3, 4], n := 4, q := 7}
--              {coeffs := [3, 4, 5, 6], n := 4, q := 7}
-- = {coeffs := [4, 6, 1, 3], n := 4, q := 7}
`,
        solution: `structure RingPoly where
  coeffs : List Nat
  n : Nat
  q : Nat

def ringAdd (a b : RingPoly) : RingPoly :=
  { coeffs := a.coeffs.zipWith (fun x y => (x + y) % a.q) b.coeffs
    n := a.n
    q := a.q }`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'RingPoly needs coeffs (List Nat), n (Nat), and q (Nat)',
          'Use zipWith to add corresponding coefficients',
          'Take modulo q for each sum'
        ],
        testCases: [
          {
            description: 'structure RingPoly',
            validator: (code) => /structure\s+RingPoly\s+where/.test(code)
          },
          {
            description: 'has coeffs, n, q fields',
            validator: (code) => /coeffs\s*:\s*List\s+Nat/.test(code) && /n\s*:\s*Nat/.test(code) && /q\s*:\s*Nat/.test(code)
          },
          {
            description: 'def ringAdd',
            validator: (code) => /def\s+ringAdd/.test(code)
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
      content: `## Multiplying in Zq[x]/(xⁿ + 1)

### Naive Multiplication

Standard polynomial multiplication, then reduce:

\`\`\`lean
-- Naive O(n²) multiplication
def naiveMul (a b : RingPoly) : RingPoly :=
  let n := a.n
  let q := a.q
  -- First compute full product (degree up to 2n-2)
  let fullProduct := Array.mkArray (2 * n - 1) 0
  let fullProduct := a.coeffs.enum.foldl (fun prod (i, ai) =>
    b.coeffs.enum.foldl (fun prod' (j, bj) =>
      prod'.modify (i + j) (· + ai * bj)
    ) prod
  ) fullProduct
  -- Reduce by x^n = -1
  let reduced := Array.mkArray n 0
  let reduced := fullProduct.toList.enum.foldl (fun red (i, coeff) =>
    if i < n then
      red.modify i (· + coeff)
    else
      -- x^i = -x^(i-n) when i >= n
      red.modify (i - n) (fun c => (c + q - coeff % q) % q)
  ) reduced
  { coeffs := reduced.toList.map (· % q), n := n, q := q }
\`\`\`

### Reduction Rule

When i ≥ n:
- xⁱ = xⁱ⁻ⁿ · xⁿ = xⁱ⁻ⁿ · (-1) = -xⁱ⁻ⁿ

So we **subtract** the high coefficient from position (i - n).

### Example

In Z₇[x]/(x⁴ + 1):
\`\`\`
(1 + 2x) × (3 + x²) = 3 + 6x + x² + 2x³
\`\`\`
No reduction needed (degree < 4).

\`\`\`
(1 + x³) × (1 + x³) = 1 + 2x³ + x⁶
x⁶ = x² · x⁴ = x² · (-1) = -x²
Result: 1 + 2x³ - x² = 1 - x² + 2x³ mod 7 = 1 + 6x² + 2x³
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Coefficient Reduction',
      exercise: {
        id: 'ex-rlwe-02',
        title: 'Implement Modular Reduction',
        description: 'Implement the reduction of a polynomial by xⁿ + 1, which converts xⁿ → -1.',
        initialCode: `structure RingPoly where
  coeffs : List Nat
  n : Nat
  q : Nat

-- Reduce a polynomial of degree < 2n to degree < n
-- using the rule x^n = -1
-- Input: extended coefficients (length up to 2n-1)
-- Output: reduced coefficients (length n)
def reduceByXnPlus1 (extended : List Nat) (n q : Nat) : List Nat :=
  -- Create result array of size n
  let base := extended.take n  -- Coefficients for x^0 to x^(n-1)
  let high := extended.drop n  -- Coefficients for x^n to x^(2n-2)
  -- Subtract high coefficients from corresponding low positions
  -- x^(n+i) -> -x^i
  -- YOUR CODE HERE
  sorry

-- Test: reduceByXnPlus1 [1, 0, 0, 0, 1] 4 7
-- Full poly: 1 + x^4 = 1 + (-1) = 0 in Z_7[x]/(x^4+1)
-- Result: [0, 0, 0, 0]
`,
        solution: `structure RingPoly where
  coeffs : List Nat
  n : Nat
  q : Nat

def reduceByXnPlus1 (extended : List Nat) (n q : Nat) : List Nat :=
  let base := extended.take n
  let high := extended.drop n
  -- Pad base to length n if needed
  let basePadded := base ++ List.replicate (n - base.length) 0
  -- Subtract high from base (with wraparound for negatives)
  let highPadded := high ++ List.replicate (n - high.length) 0
  basePadded.zipWith (fun b h => (b + q - h % q) % q) highPadded`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Split extended into base (first n) and high (rest)',
          'Pad both to length n with zeros',
          'Subtract: (base - high) mod q = (base + q - high) mod q'
        ],
        testCases: [
          {
            description: 'def reduceByXnPlus1',
            validator: (code) => /def\s+reduceByXnPlus1/.test(code)
          },
          {
            description: 'uses take for base',
            validator: (code) => /\.take\s+n/.test(code)
          },
          {
            description: 'uses drop for high',
            validator: (code) => /\.drop\s+n/.test(code)
          },
          {
            description: 'subtracts with mod',
            validator: (code) => /q\s*-.*%\s*q/.test(code) || /\+\s*q\s*-/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Number Theoretic Transform (NTT)',
      content: `## Fast Multiplication with NTT

Naive multiplication is O(n²). NTT achieves O(n log n)!

### What is NTT?

NTT is the FFT for finite fields:
- FFT uses complex roots of unity (eⁱ²π/ⁿ)
- NTT uses modular roots of unity (ωⁿ ≡ 1 mod q)

### NTT Multiplication

1. Transform a and b to NTT domain: NTT(a), NTT(b)
2. Multiply pointwise: c' = NTT(a) ⊙ NTT(b)
3. Inverse transform: c = INTT(c')

\`\`\`lean
def nttMul (a b : RingPoly) : RingPoly :=
  let nttA := ntt a
  let nttB := ntt b
  let nttC := pointwiseMul nttA nttB
  intt nttC
\`\`\`

### Why This Works

The convolution theorem:
\`\`\`
NTT(a * b) = NTT(a) ⊙ NTT(b)
\`\`\`

### Finding Roots of Unity

For NTT, we need ω such that:
- ω²ⁿ ≡ 1 (mod q)
- ωⁿ ≡ -1 (mod q)

Choose q such that q ≡ 1 (mod 2n) to ensure roots exist.

### Example Parameters

Kyber uses:
- n = 256
- q = 3329 = 1 + 256 × 13
- ω = 17 (primitive 512th root of unity)

### Performance Comparison

| Method | Complexity | For n=256 |
|--------|------------|-----------|
| Naive | O(n²) | 65536 ops |
| NTT | O(n log n) | ~2048 ops |
| ~32× speedup! |`
    },
    {
      type: 'content',
      title: 'RLWE Encryption Scheme',
      content: `## A Complete RLWE Encryption Scheme

### Key Generation

\`\`\`lean
structure RLWEPublicKey where
  a : RingPoly    -- Random polynomial
  b : RingPoly    -- b = a·s + e

structure RLWESecretKey where
  s : RingPoly    -- Secret polynomial (small coeffs)

def keyGen (n q : Nat) : IO (RLWEPublicKey × RLWESecretKey) := do
  let a ← randomPoly n q
  let s ← smallPoly n q 1    -- Coefficients in {-1, 0, 1}
  let e ← smallPoly n q 1    -- Small error
  let b := ringMul a s |>.add e
  return ({ a := a, b := b }, { s := s })
\`\`\`

### Encryption

Encrypt a polynomial message m:

\`\`\`lean
def encrypt (pk : RLWEPublicKey) (m : RingPoly) : IO (RingPoly × RingPoly) := do
  let r ← smallPoly pk.a.n pk.a.q 1   -- Random small
  let e1 ← smallPoly pk.a.n pk.a.q 1  -- Error 1
  let e2 ← smallPoly pk.a.n pk.a.q 1  -- Error 2

  let u := ringMul pk.a r |>.add e1   -- u = ar + e1
  let v := ringMul pk.b r |>.add e2 |>.add (encode m)  -- v = br + e2 + m'

  return (u, v)
\`\`\`

### Decryption

\`\`\`lean
def decrypt (sk : RLWESecretKey) (u v : RingPoly) : RingPoly :=
  let diff := v.sub (ringMul u sk.s)  -- v - us = m' + small
  decode diff
\`\`\`

### Why Decryption Works

\`\`\`
v - u·s = (b·r + e2 + m') - (a·r + e1)·s
        = (a·s + e)·r + e2 + m' - a·r·s - e1·s
        = e·r + e2 - e1·s + m'
        ≈ m' (errors are small and cancel approximately)
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: RLWE Structures',
      exercise: {
        id: 'ex-rlwe-03',
        title: 'Define RLWE Key Structures',
        description: 'Define the public key, secret key, and ciphertext structures for RLWE encryption.',
        initialCode: `structure RingPoly where
  coeffs : List Nat
  n : Nat
  q : Nat

-- Define RLWE Public Key
-- Contains: a (random poly), b (b = a*s + e)
-- YOUR CODE HERE


-- Define RLWE Secret Key
-- Contains: s (secret poly with small coefficients)
-- YOUR CODE HERE


-- Define RLWE Ciphertext
-- Contains: u and v polynomials
-- YOUR CODE HERE


-- Placeholder multiplication
def ringMul (a b : RingPoly) : RingPoly := a

-- Simple decryption structure: v - u*s
def decryptCore (sk : RLWESecretKey) (ct : RLWECiphertext) : RingPoly :=
  -- YOUR CODE: compute ct.v - ringMul ct.u sk.s
  sorry
`,
        solution: `structure RingPoly where
  coeffs : List Nat
  n : Nat
  q : Nat

structure RLWEPublicKey where
  a : RingPoly
  b : RingPoly

structure RLWESecretKey where
  s : RingPoly

structure RLWECiphertext where
  u : RingPoly
  v : RingPoly

def ringMul (a b : RingPoly) : RingPoly := a

def ringSub (a b : RingPoly) : RingPoly :=
  { coeffs := a.coeffs.zipWith (fun x y => (x + a.q - y) % a.q) b.coeffs
    n := a.n, q := a.q }

def decryptCore (sk : RLWESecretKey) (ct : RLWECiphertext) : RingPoly :=
  ringSub ct.v (ringMul ct.u sk.s)`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'Public key has two polynomials: a and b',
          'Secret key has one polynomial: s',
          'Ciphertext has two polynomials: u and v',
          'Decryption computes v - u*s'
        ],
        testCases: [
          {
            description: 'structure RLWEPublicKey',
            validator: (code) => /structure\s+RLWEPublicKey\s+where/.test(code) && /a\s*:\s*RingPoly/.test(code) && /b\s*:\s*RingPoly/.test(code)
          },
          {
            description: 'structure RLWESecretKey',
            validator: (code) => /structure\s+RLWESecretKey\s+where/.test(code) && /s\s*:\s*RingPoly/.test(code)
          },
          {
            description: 'structure RLWECiphertext',
            validator: (code) => /structure\s+RLWECiphertext\s+where/.test(code)
          },
          {
            description: 'decryptCore defined',
            validator: (code) => /def\s+decryptCore/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Message Encoding',
      content: `## Encoding Messages in RLWE

### The Challenge

Coefficients live in Zq (e.g., q = 3329).
We want to encode bits or small messages.

### Solution: Scale to Middle

Encode bit b ∈ {0, 1} as:
- 0 → 0
- 1 → q/2 (roughly)

After decryption with error e:
- If result near 0: decode as 0
- If result near q/2: decode as 1

### Implementation

\`\`\`lean
-- Encode a bit polynomial (coefficients in {0, 1})
def encode (m : RingPoly) : RingPoly :=
  let halfQ := m.q / 2
  { coeffs := m.coeffs.map (fun b => if b == 1 then halfQ else 0)
    n := m.n
    q := m.q }

-- Decode by rounding to nearest {0, q/2}
def decode (c : RingPoly) : RingPoly :=
  let quarterQ := c.q / 4
  let threeQuarterQ := 3 * c.q / 4
  { coeffs := c.coeffs.map (fun x =>
      if x > quarterQ && x < threeQuarterQ then 1 else 0)
    n := c.n
    q := c.q }
\`\`\`

### Error Tolerance

- If error |e| < q/4, decoding succeeds
- Kyber uses parameters ensuring this holds with overwhelming probability

### Higher Bit Depth

For encoding t bits per coefficient:
- Encode: m → m · (q / 2ᵗ)
- Decode: c → round(c · 2ᵗ / q)

Kyber encodes 1 bit per coefficient for messages, uses compression for ciphertexts.`
    },
    {
      type: 'exercise',
      title: 'Exercise: Message Encoding',
      exercise: {
        id: 'ex-rlwe-04',
        title: 'Implement Encode and Decode',
        description: 'Implement the encode and decode functions for RLWE message encoding.',
        initialCode: `structure RingPoly where
  coeffs : List Nat
  n : Nat
  q : Nat

-- Encode: convert bits to scaled coefficients
-- 0 -> 0, 1 -> q/2
def encode (bits : RingPoly) : RingPoly :=
  let halfQ := bits.q / 2
  -- YOUR CODE HERE
  sorry

-- Decode: convert noisy coefficients back to bits
-- Near 0 -> 0, Near q/2 -> 1
def decode (noisy : RingPoly) : RingPoly :=
  let quarterQ := noisy.q / 4
  let threeQuarterQ := 3 * noisy.q / 4
  -- YOUR CODE HERE
  -- If quarterQ < coeff < threeQuarterQ, decode as 1, else 0
  sorry

-- Test: In Z_101, q/2 = 50, q/4 = 25
-- encode {coeffs := [1, 0, 1], n := 3, q := 101} = {coeffs := [50, 0, 50], ...}
-- decode {coeffs := [48, 5, 53], n := 3, q := 101} = {coeffs := [1, 0, 1], ...}
`,
        solution: `structure RingPoly where
  coeffs : List Nat
  n : Nat
  q : Nat

def encode (bits : RingPoly) : RingPoly :=
  let halfQ := bits.q / 2
  { coeffs := bits.coeffs.map (fun b => if b == 1 then halfQ else 0)
    n := bits.n
    q := bits.q }

def decode (noisy : RingPoly) : RingPoly :=
  let quarterQ := noisy.q / 4
  let threeQuarterQ := 3 * noisy.q / 4
  { coeffs := noisy.coeffs.map (fun x =>
      if x > quarterQ && x < threeQuarterQ then 1 else 0)
    n := noisy.n
    q := noisy.q }`,
        explanation: `See the solution code and hints below for guidance on how to solve this exercise.`,
        hints: [
          'For encode: map each coefficient, return halfQ if 1, else 0',
          'For decode: map each coefficient, return 1 if between quarterQ and threeQuarterQ',
          'Both return new RingPoly with same n and q'
        ],
        testCases: [
          {
            description: 'def encode',
            validator: (code) => /def\s+encode/.test(code)
          },
          {
            description: 'encode maps to halfQ',
            validator: (code) => /halfQ/.test(code) && /\.map/.test(code)
          },
          {
            description: 'def decode',
            validator: (code) => /def\s+decode/.test(code)
          },
          {
            description: 'decode checks bounds',
            validator: (code) => /quarterQ/.test(code) && /threeQuarterQ/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Kyber Overview',
      content: `## Kyber: The NIST Standard

Kyber (now ML-KEM) is the NIST-selected key encapsulation mechanism.

### Module-LWE

Kyber uses **Module-LWE** instead of Ring-LWE:
- Elements are vectors of ring elements
- More flexible security/efficiency tradeoff

\`\`\`
Rq^k = (Zq[x]/(x^n + 1))^k
\`\`\`

### Kyber Parameters

| Variant | k | Security | Public Key | Ciphertext |
|---------|---|----------|------------|------------|
| Kyber512 | 2 | 128-bit | 800 B | 768 B |
| Kyber768 | 3 | 192-bit | 1184 B | 1088 B |
| Kyber1024 | 4 | 256-bit | 1568 B | 1568 B |

Common: n=256, q=3329

### Key Encapsulation

Kyber is a **KEM**, not direct encryption:

1. **KeyGen**: Generate (pk, sk)
2. **Encapsulate**: Using pk, generate (shared_secret, ciphertext)
3. **Decapsulate**: Using sk and ciphertext, recover shared_secret

The shared secret is then used for symmetric encryption (AES-GCM).

### Security Features

- **CCA security**: Resistant to chosen-ciphertext attacks
- **IND-CPA**: Core encryption is semantically secure
- **Fujisaki-Okamoto transform**: Converts CPA to CCA security

### Real-World Usage

- **Signal**: Testing Kyber for post-quantum
- **Chrome**: CECPQ2 experiment with Kyber
- **Cloudflare**: Post-quantum TLS deployment`
    },
    {
      type: 'content',
      title: 'Summary',
      content: `# Summary: Ring-LWE

You've learned the foundation of modern post-quantum cryptography!

## Key Concepts

### The Ring

\`\`\`
Rq = Zq[x]/(xⁿ + 1)
\`\`\`

- Polynomials with modular coefficients
- Degree reduction via xⁿ = -1

### Operations

- **Addition**: Coefficient-wise mod q
- **Multiplication**: Convolution + reduction
- **NTT**: Fast O(n log n) multiplication

### RLWE Problem

Given (a, b = a·s + e), find s is hard!

### Encryption Structure

- **KeyGen**: b = a·s + e
- **Encrypt**: (u, v) = (a·r + e₁, b·r + e₂ + m')
- **Decrypt**: v - u·s ≈ m'

### Message Encoding

- Scale bits to q/2
- Decode by rounding

## Real-World Impact

| What | Uses RLWE |
|------|-----------|
| Kyber/ML-KEM | Key exchange |
| Dilithium/ML-DSA | Signatures |
| Homomorphic encryption | Computation on encrypted data |

## Next Lesson

The **Sumcheck Protocol** is fundamental to:
- Interactive proofs
- ZK-SNARKs
- Verifiable computation

It's where polynomials meet proof systems!`
    }
  ]
}
