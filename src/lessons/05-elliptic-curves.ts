import { Lesson } from '@/lib/types'

export const ellipticCurvesLesson: Lesson = {
  id: '05-elliptic-curves',
  title: 'Elliptic Curves',
  description: 'Understand elliptic curves, the foundation of modern public-key cryptography',
  category: 'cryptography',
  order: 5,
  sections: [
    {
      type: 'content',
      title: 'Introduction to Elliptic Curves',
      content: `# Elliptic Curves in Cryptography

Elliptic Curve Cryptography (ECC) provides the same security as RSA with **much smaller key sizes**.

## The Basic Equation

An elliptic curve over a field is defined by:

\`\`\`
y² = x³ + ax + b
\`\`\`

Where 4a³ + 27b² ≠ 0 (non-singular condition)

## Why Elliptic Curves?

| Algorithm | Key Size | Security Level |
|-----------|----------|----------------|
| RSA | 3072 bits | 128 bits |
| ECC | 256 bits | 128 bits |

ECC offers:
- **Smaller keys**: 256-bit vs 3072-bit for equivalent security
- **Faster operations**: Less computation needed
- **Less bandwidth**: Smaller signatures and ciphertexts

## Real-World Applications

- **Bitcoin/Ethereum**: secp256k1 curve
- **TLS/HTTPS**: ECDHE key exchange
- **Signal Protocol**: Curve25519
- **Digital Signatures**: ECDSA, EdDSA

## Curve Examples

- **secp256k1** (Bitcoin): y² = x³ + 7
- **P-256** (NIST): y² = x³ - 3x + b (specific b)
- **Curve25519**: y² = x³ + 486662x² + x`
    },
    {
      type: 'content',
      title: 'Points on Elliptic Curves',
      content: `## Points on the Curve

A **point** on an elliptic curve is a pair (x, y) satisfying the curve equation, plus a special "point at infinity" O.

### Representing Points in Lean

\`\`\`lean
-- A point is either a coordinate pair or the identity
inductive ECPoint where
  | infinity : ECPoint
  | point : Int → Int → ECPoint
deriving Repr

-- Curve parameters: y² = x³ + ax + b
structure EllipticCurve where
  a : Int
  b : Int
  -- For finite fields, we also need a prime modulus
  p : Nat  -- 0 means working over integers
\`\`\`

### Checking if a Point is on the Curve

\`\`\`lean
def isOnCurve (curve : EllipticCurve) (pt : ECPoint) : Bool :=
  match pt with
  | .infinity => true
  | .point x y =>
    let lhs := y * y
    let rhs := x * x * x + curve.a * x + curve.b
    if curve.p == 0 then
      lhs == rhs
    else
      (lhs % curve.p) == (rhs % curve.p)
\`\`\`

### Example Points

For y² = x³ + 7 (secp256k1 simplified):
- (1, √8) is NOT on the curve (√8 is not an integer)
- Working over finite fields, we find integer solutions

The point at infinity O serves as the **identity element** for point addition.`
    },
    {
      type: 'exercise',
      title: 'Exercise: Define EC Point',
      exercise: {
        id: 'ex-ec-01',
        title: 'Define Elliptic Curve Types',
        description: 'Define the ECPoint inductive type with two constructors: infinity (the identity) and point (with x, y coordinates as Int).',
        initialCode: `-- Define an inductive type for elliptic curve points
-- Should have two constructors:
--   infinity : the point at infinity (identity element)
--   point : takes two Int values (x and y coordinates)
-- YOUR CODE HERE


-- Define a structure for the curve parameters
-- Should have fields a, b (Int) and p (Nat) for modulus
-- YOUR CODE HERE

`,
        solution: `inductive ECPoint where
  | infinity : ECPoint
  | point : Int → Int → ECPoint

structure EllipticCurve where
  a : Int
  b : Int
  p : Nat`,
        explanation: `**Understanding the Solution**

This exercise establishes the fundamental data types for elliptic curve cryptography in Lean.

**The ECPoint Inductive Type**

We define \`ECPoint\` as an inductive type with two constructors:

1. \`infinity\` - The "point at infinity" which serves as the **identity element** for elliptic curve group operations. Just as 0 is the identity for addition (a + 0 = a), the point at infinity is the identity for point addition (P + O = P).

2. \`point : Int → Int → ECPoint\` - A constructor that takes two integers (x and y coordinates) and creates a point on the curve. Using \`Int\` allows negative coordinates which is important for finite field arithmetic.

**The EllipticCurve Structure**

The structure defines the curve parameters for the Weierstrass form: y² = x³ + ax + b

- \`a : Int\` and \`b : Int\` - The curve coefficients
- \`p : Nat\` - The prime modulus for finite field operations (0 indicates working over integers)

**Cryptographic Context**

In real cryptographic applications like Bitcoin (secp256k1: y² = x³ + 7), these types would be instantiated with specific parameters. The separation of ECPoint and EllipticCurve allows the same point type to be used with different curves.`,
        hints: [
          'Use "inductive" keyword for ECPoint',
          'infinity takes no arguments, point takes two Int arguments',
          'The structure has three fields: a, b of type Int and p of type Nat'
        ],
        testCases: [
          {
            description: 'inductive ECPoint',
            validator: (code) => /inductive\s+ECPoint\s+where/.test(code)
          },
          {
            description: 'infinity constructor',
            validator: (code) => /\|\s*infinity/.test(code)
          },
          {
            description: 'point constructor',
            validator: (code) => /\|\s*point\s*:.*Int.*Int/.test(code)
          },
          {
            description: 'structure EllipticCurve',
            validator: (code) => /structure\s+EllipticCurve\s+where/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Point Addition',
      content: `## Adding Points on Elliptic Curves

The key operation on elliptic curves is **point addition**. Given points P and Q, we can compute P + Q.

### Geometric Interpretation

1. Draw a line through P and Q
2. The line intersects the curve at a third point R'
3. Reflect R' over the x-axis to get R = P + Q

### The Formulas

For P = (x₁, y₁) and Q = (x₂, y₂):

**Case 1: P ≠ Q (different points)**
\`\`\`
λ = (y₂ - y₁) / (x₂ - x₁)
x₃ = λ² - x₁ - x₂
y₃ = λ(x₁ - x₃) - y₁
\`\`\`

**Case 2: P = Q (point doubling)**
\`\`\`
λ = (3x₁² + a) / (2y₁)
x₃ = λ² - 2x₁
y₃ = λ(x₁ - x₃) - y₁
\`\`\`

**Case 3: Identity rules**
- P + O = P (O is identity)
- P + (-P) = O (where -P = (x, -y))

### In Lean (conceptual)

\`\`\`lean
def ecAdd (curve : EllipticCurve) (p q : ECPoint) : ECPoint :=
  match p, q with
  | .infinity, _ => q
  | _, .infinity => p
  | .point x1 y1, .point x2 y2 =>
    if x1 == x2 && y1 == -y2 then .infinity
    else if x1 == x2 && y1 == y2 then
      -- Point doubling
      ...
    else
      -- Regular addition
      ...
\`\`\`

**Note**: Over finite fields, division becomes modular inverse!`
    },
    {
      type: 'exercise',
      title: 'Exercise: Point Addition Cases',
      exercise: {
        id: 'ex-ec-02',
        title: 'Handle Addition Identity Cases',
        description: 'Implement the identity cases for elliptic curve point addition: P + O = P, O + Q = Q.',
        initialCode: `inductive ECPoint where
  | infinity : ECPoint
  | point : Int → Int → ECPoint

-- Implement the identity cases for point addition
-- P + infinity = P
-- infinity + Q = Q
def ecAddIdentity (p q : ECPoint) : ECPoint :=
  match p, q with
  | .infinity, _ => -- YOUR CODE: return q
    sorry
  | _, .infinity => -- YOUR CODE: return p
    sorry
  | .point x1 y1, .point x2 y2 =>
    -- For now, just return infinity for non-identity cases
    .infinity
`,
        solution: `inductive ECPoint where
  | infinity : ECPoint
  | point : Int → Int → ECPoint

def ecAddIdentity (p q : ECPoint) : ECPoint :=
  match p, q with
  | .infinity, _ => q
  | _, .infinity => p
  | .point x1 y1, .point x2 y2 =>
    .infinity`,
        explanation: `**Understanding the Solution**

This exercise implements the **identity element rules** for elliptic curve point addition, which are fundamental to the group structure.

**Pattern Matching on ECPoint**

The solution uses Lean's \`match\` expression to handle different cases:

1. \`| .infinity, _ => q\` - When the first point is infinity (the identity), adding anything to it returns the other point. This is like saying 0 + x = x in regular addition.

2. \`| _, .infinity => p\` - When the second point is infinity, return the first point. This is like x + 0 = x.

3. \`| .point x1 y1, .point x2 y2 => .infinity\` - A placeholder for the general case (actual point addition would go here).

**Why These Rules Work**

In abstract algebra, a **group** requires an identity element e such that e * a = a * e = a for all elements a. On elliptic curves:
- The point at infinity O plays this role
- P + O = O + P = P for any point P

**Cryptographic Significance**

These identity rules are essential for:
- **Key generation**: The base point G can be added to itself n times to get public key Q = nG
- **Point validation**: Checking if a point is on the curve
- **Protocol correctness**: Ensuring mathematical properties hold during encryption/signing`,
        hints: [
          'When p is infinity, the result is q',
          'When q is infinity, the result is p',
          'These are the identity element rules for the group operation'
        ],
        testCases: [
          {
            description: 'infinity + q = q',
            validator: (code) => /\|\s*\.infinity\s*,\s*_\s*=>\s*q/.test(code)
          },
          {
            description: 'p + infinity = p',
            validator: (code) => /\|\s*_\s*,\s*\.infinity\s*=>\s*p/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Scalar Multiplication',
      content: `## Scalar Multiplication

**Scalar multiplication** is adding a point to itself n times:

\`\`\`
nP = P + P + P + ... + P  (n times)
\`\`\`

This is the core operation in ECC protocols!

### Double-and-Add Algorithm

Instead of n additions (O(n)), we use binary expansion (O(log n)):

\`\`\`
5P = 4P + P = 2(2P) + P
\`\`\`

\`\`\`lean
def scalarMul (curve : EllipticCurve) (n : Nat) (p : ECPoint) : ECPoint :=
  if n == 0 then .infinity
  else if n == 1 then p
  else if n % 2 == 0 then
    -- n is even: nP = 2 * (n/2 * P)
    let half := scalarMul curve (n / 2) p
    ecDouble curve half
  else
    -- n is odd: nP = P + (n-1)P
    let rest := scalarMul curve (n - 1) p
    ecAdd curve p rest
\`\`\`

### The Discrete Logarithm Problem

Given P and Q = nP, finding n is **computationally hard**!

This is the **Elliptic Curve Discrete Logarithm Problem (ECDLP)**.

Security relies on this being hard:
- Easy: Given n and P, compute Q = nP
- Hard: Given P and Q, find n such that Q = nP

### Time Complexity

| Attack | Time Complexity |
|--------|----------------|
| Brute Force | O(n) |
| Baby-step Giant-step | O(√n) |
| Pollard's rho | O(√n) |
| Best known | ~O(√n) |

For 256-bit curves: √(2²⁵⁶) = 2¹²⁸ operations ≈ infeasible`
    },
    {
      type: 'exercise',
      title: 'Exercise: Scalar Multiplication',
      exercise: {
        id: 'ex-ec-03',
        title: 'Implement Double-and-Add',
        description: 'Implement the recursive structure of the double-and-add algorithm for scalar multiplication.',
        initialCode: `inductive ECPoint where
  | infinity : ECPoint
  | point : Int → Int → ECPoint

-- Placeholder functions (assume these work correctly)
def ecDouble (p : ECPoint) : ECPoint := p  -- placeholder
def ecAdd (p q : ECPoint) : ECPoint := p   -- placeholder

-- Implement scalar multiplication using double-and-add
-- scalarMul 0 P = infinity (identity)
-- scalarMul 1 P = P
-- scalarMul n P where n is even = double(scalarMul (n/2) P)
-- scalarMul n P where n is odd = add(P, scalarMul (n-1) P)
def scalarMul (n : Nat) (p : ECPoint) : ECPoint :=
  if n == 0 then
    -- YOUR CODE: base case for 0
    sorry
  else if n == 1 then
    -- YOUR CODE: base case for 1
    sorry
  else if n % 2 == 0 then
    -- YOUR CODE: even case - double the result of n/2
    sorry
  else
    -- YOUR CODE: odd case - add P to result of n-1
    sorry
`,
        solution: `inductive ECPoint where
  | infinity : ECPoint
  | point : Int → Int → ECPoint

def ecDouble (p : ECPoint) : ECPoint := p
def ecAdd (p q : ECPoint) : ECPoint := p

def scalarMul (n : Nat) (p : ECPoint) : ECPoint :=
  if n == 0 then
    .infinity
  else if n == 1 then
    p
  else if n % 2 == 0 then
    ecDouble (scalarMul (n / 2) p)
  else
    ecAdd p (scalarMul (n - 1) p)`,
        explanation: `**Understanding the Solution**

This exercise implements the **double-and-add algorithm** for scalar multiplication, which is the core operation in elliptic curve cryptography.

**The Algorithm Structure**

The function computes nP (adding point P to itself n times) efficiently:

1. \`if n == 0 then .infinity\` - Base case: 0 * P = O (the identity). Adding a point 0 times gives the identity element.

2. \`else if n == 1 then p\` - Base case: 1 * P = P. Adding a point once gives the point itself.

3. \`else if n % 2 == 0 then ecDouble (scalarMul (n / 2) p)\` - **Even case**: nP = 2 * (n/2)P. We recursively compute (n/2)P and then double it. This halves the problem size!

4. \`else ecAdd p (scalarMul (n - 1) p)\` - **Odd case**: nP = P + (n-1)P. We reduce to an even case by adding P once.

**Why This is Efficient**

- **Naive approach**: n additions → O(n) operations
- **Double-and-add**: O(log n) operations because we halve n each time

Example: Computing 13P
- 13P = P + 12P (odd)
- 12P = 2 * 6P (even)
- 6P = 2 * 3P (even)
- 3P = P + 2P (odd)
- 2P = 2 * P (even)

Total: 4 doublings + 2 additions instead of 12 additions!

**Cryptographic Importance**

This algorithm enables:
- **Fast public key generation**: Q = dG where d is a large private key
- **ECDSA signing**: Requires scalar multiplication
- **ECDH key exchange**: Computing shared secrets

The security of ECC relies on the fact that given P and Q = nP, finding n is computationally infeasible (the Elliptic Curve Discrete Logarithm Problem).`,
        hints: [
          'n = 0 returns infinity (identity element)',
          'n = 1 returns the point itself',
          'Even n: double the result of n/2 multiplied by P',
          'Odd n: add P to the result of (n-1) multiplied by P'
        ],
        testCases: [
          {
            description: 'base case n=0',
            validator: (code) => /n\s*==\s*0/.test(code) && /\.infinity/.test(code)
          },
          {
            description: 'base case n=1',
            validator: (code) => /n\s*==\s*1/.test(code) && /then[\s\S]*?p[\s\S]*?else/.test(code)
          },
          {
            description: 'even case with ecDouble',
            validator: (code) => /ecDouble\s*\(?\s*scalarMul/.test(code)
          },
          {
            description: 'odd case with ecAdd',
            validator: (code) => /ecAdd\s+p\s*\(?\s*scalarMul/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Finite Field Arithmetic',
      content: `## Working over Finite Fields

In cryptography, we use elliptic curves over **finite fields** Fₚ (integers mod prime p).

### Why Finite Fields?

- Computations stay bounded (no infinite precision)
- Mathematical structure enables proofs
- Discrete points work better for cryptography

### Modular Inverse

Division in a finite field requires **modular inverse**:

a⁻¹ mod p = the number b such that (a × b) mod p = 1

\`\`\`lean
-- Extended Euclidean Algorithm
def extGcd (a b : Int) : Int × Int × Int :=
  if b == 0 then (a, 1, 0)
  else
    let (g, x, y) := extGcd b (a % b)
    (g, y, x - (a / b) * y)

def modInverse (a p : Nat) : Option Nat :=
  let (g, x, _) := extGcd a p
  if g == 1 then some ((x % p + p) % p).toNat
  else none  -- No inverse exists
\`\`\`

### Point Addition in Fₚ

All operations become modular:

\`\`\`lean
def modAdd (a b p : Nat) : Nat := (a + b) % p
def modSub (a b p : Nat) : Nat := ((a : Int) - b + p) % p |>.toNat
def modMul (a b p : Nat) : Nat := (a * b) % p
def modDiv (a b p : Nat) : Nat :=
  match modInverse b p with
  | some inv => modMul a inv p
  | none => 0  -- Error case
\`\`\`

### Example: secp256k1

The Bitcoin curve uses:
- p = 2²⁵⁶ - 2³² - 977 (a large prime)
- a = 0, b = 7
- Equation: y² ≡ x³ + 7 (mod p)`
    },
    {
      type: 'exercise',
      title: 'Exercise: Modular Inverse',
      exercise: {
        id: 'ex-ec-04',
        title: 'Implement Modular Inverse Check',
        description: 'Implement a function to verify that a number is the modular inverse of another.',
        initialCode: `-- Check if b is the modular inverse of a modulo p
-- i.e., verify that (a * b) mod p == 1
def isModInverse (a b p : Nat) : Bool :=
  -- YOUR CODE HERE
  sorry

-- Test cases:
-- isModInverse 3 5 7 should be true (because 3 * 5 = 15 ≡ 1 mod 7)
-- isModInverse 2 4 7 should be true (because 2 * 4 = 8 ≡ 1 mod 7)
-- isModInverse 2 3 7 should be false (because 2 * 3 = 6 ≢ 1 mod 7)
`,
        solution: `def isModInverse (a b p : Nat) : Bool :=
  (a * b) % p == 1`,
        explanation: `**Understanding the Solution**

This exercise verifies the fundamental property of **modular multiplicative inverses**, which are essential for division in finite fields.

**What is a Modular Inverse?**

The modular inverse of a number \`a\` modulo \`p\` is a number \`b\` such that:
\`\`\`
a * b ≡ 1 (mod p)
\`\`\`

This is like finding 1/a in regular arithmetic, but in modular arithmetic.

**The Verification**

The solution simply checks the definition:
1. Multiply \`a * b\`
2. Take the result modulo \`p\`
3. Check if it equals 1

**Example Walkthrough**

For the test case isModInverse 3 5 7:
- 3 * 5 = 15
- 15 mod 7 = 1 (since 15 = 2*7 + 1)
- Returns true because 3 and 5 are modular inverses mod 7

**Why Modular Inverses Matter in ECC**

In elliptic curve arithmetic over finite fields:
1. **Point Addition**: Requires computing slopes like (y2-y1)/(x2-x1), where division means multiplying by the modular inverse
2. **Point Doubling**: The formula involves (3x²+a)/(2y), again requiring modular inverse

Without modular inverses, we couldn't perform division in finite fields, making EC operations impossible.

**Finding Inverses**

Inverses can be computed using:
- **Extended Euclidean Algorithm**: Efficient and general
- **Fermat's Little Theorem**: a^(p-2) mod p when p is prime`,
        hints: [
          'Multiply a and b together',
          'Take the result modulo p',
          'Check if it equals 1'
        ],
        testCases: [
          {
            description: 'def isModInverse',
            validator: (code) => /def\s+isModInverse/.test(code)
          },
          {
            description: 'multiplies a and b',
            validator: (code) => /a\s*\*\s*b/.test(code)
          },
          {
            description: 'uses modulo p',
            validator: (code) => /%\s*p/.test(code)
          },
          {
            description: 'compares to 1',
            validator: (code) => /==\s*1/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'ECC Protocols',
      content: `## Cryptographic Protocols Using ECC

### ECDH (Elliptic Curve Diffie-Hellman)

Key exchange protocol:

1. **Setup**: Agree on curve and generator point G
2. **Alice**: Pick secret a, compute A = aG, send A
3. **Bob**: Pick secret b, compute B = bG, send B
4. **Shared secret**: Alice computes aB = a(bG) = abG
   Bob computes bA = b(aG) = abG

\`\`\`lean
structure ECDHKeyPair where
  privateKey : Nat
  publicKey : ECPoint

def generateKeyPair (curve : EllipticCurve) (g : ECPoint) (secret : Nat) : ECDHKeyPair :=
  { privateKey := secret
    publicKey := scalarMul curve secret g }

def computeSharedSecret (curve : EllipticCurve) (myPrivate : Nat) (theirPublic : ECPoint) : ECPoint :=
  scalarMul curve myPrivate theirPublic
\`\`\`

### ECDSA (Elliptic Curve Digital Signature Algorithm)

Digital signatures:

**Signing** (with private key d):
1. Pick random k
2. R = kG, take r = R.x mod n
3. s = k⁻¹(hash(m) + r·d) mod n
4. Signature is (r, s)

**Verifying** (with public key Q = dG):
1. u₁ = hash(m)·s⁻¹ mod n
2. u₂ = r·s⁻¹ mod n
3. Check if (u₁G + u₂Q).x ≡ r mod n

### Security Considerations

- Random k is **critical** - reuse leaks private key!
- Curve parameters must be carefully chosen
- Side-channel attacks must be mitigated`
    },
    {
      type: 'exercise',
      title: 'Exercise: ECDH Key Pair',
      exercise: {
        id: 'ex-ec-05',
        title: 'Create ECDH Key Pair Structure',
        description: 'Define a structure for ECDH key pairs and implement key pair generation.',
        initialCode: `inductive ECPoint where
  | infinity : ECPoint
  | point : Int → Int → ECPoint

-- Placeholder
def scalarMul (n : Nat) (p : ECPoint) : ECPoint := p

-- Define a structure for ECDH key pairs
-- Should have privateKey (Nat) and publicKey (ECPoint)
-- YOUR CODE HERE


-- Generate a key pair from a secret and generator point
-- publicKey = scalarMul secret generator
def generateKeyPair (secret : Nat) (generator : ECPoint) : ECDHKeyPair :=
  -- YOUR CODE HERE
  sorry
`,
        solution: `inductive ECPoint where
  | infinity : ECPoint
  | point : Int → Int → ECPoint

def scalarMul (n : Nat) (p : ECPoint) : ECPoint := p

structure ECDHKeyPair where
  privateKey : Nat
  publicKey : ECPoint

def generateKeyPair (secret : Nat) (generator : ECPoint) : ECDHKeyPair :=
  { privateKey := secret
    publicKey := scalarMul secret generator }`,
        explanation: `**Understanding the Solution**

This exercise implements the key pair structure for **Elliptic Curve Diffie-Hellman (ECDH)**, one of the most widely used key exchange protocols.

**The ECDHKeyPair Structure**

The structure bundles together:
- \`privateKey : Nat\` - The secret scalar value known only to the owner. This must be kept confidential.
- \`publicKey : ECPoint\` - The corresponding public point that can be shared openly.

**Key Generation Process**

The \`generateKeyPair\` function:
1. Takes a secret value and a generator point G
2. Computes \`publicKey = secret * G\` using scalar multiplication
3. Returns both keys packaged in the structure

**The Mathematical Relationship**

If Alice's private key is \`a\` and the generator point is \`G\`:
- Alice's public key is \`A = aG\`
- Anyone can verify A is a valid point on the curve
- No one can recover \`a\` from \`A\` (ECDLP hardness)

**ECDH Protocol Flow**

1. Alice generates (a, A = aG)
2. Bob generates (b, B = bG)
3. They exchange public keys A and B
4. Alice computes: aB = a(bG) = abG
5. Bob computes: bA = b(aG) = abG
6. Both have the same shared secret!

**Real-World Usage**

- **TLS 1.3**: ECDHE for forward-secret key exchange
- **Signal Protocol**: X25519 for initial key agreement
- **Bitcoin**: secp256k1 for wallet key derivation`,
        hints: [
          'The structure has two fields: privateKey (Nat) and publicKey (ECPoint)',
          'generateKeyPair returns an ECDHKeyPair',
          'The public key is computed as scalarMul secret generator'
        ],
        testCases: [
          {
            description: 'structure ECDHKeyPair',
            validator: (code) => /structure\s+ECDHKeyPair\s+where/.test(code)
          },
          {
            description: 'privateKey field',
            validator: (code) => /privateKey\s*:\s*Nat/.test(code)
          },
          {
            description: 'publicKey field',
            validator: (code) => /publicKey\s*:\s*ECPoint/.test(code)
          },
          {
            description: 'generateKeyPair uses scalarMul',
            validator: (code) => /scalarMul\s+secret\s+generator/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Summary',
      content: `# Summary: Elliptic Curves

You've learned the fundamentals of elliptic curve cryptography!

## Key Concepts

### The Curve
- Equation: y² = x³ + ax + b
- Points: (x, y) pairs plus point at infinity O

### Operations
- **Point Addition**: Geometric chord-tangent method
- **Point Doubling**: Adding a point to itself
- **Scalar Multiplication**: nP using double-and-add

### Security Foundation
- ECDLP: Given P and Q=nP, finding n is hard
- Enables: Key exchange, signatures, encryption

### Finite Fields
- All operations done modulo prime p
- Division requires modular inverse

## Protocols

| Protocol | Use Case |
|----------|----------|
| ECDH | Key exchange |
| ECDSA | Digital signatures |
| EdDSA | Fast signatures |
| ECIES | Encryption |

## Next Lesson

Next, we'll explore **Diffie-Hellman** key exchange in detail, including both classic DH and ECDH implementations!`
    }
  ]
}
