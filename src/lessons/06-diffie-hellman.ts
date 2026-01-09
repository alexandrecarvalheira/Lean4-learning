import { Lesson } from '@/lib/types'

export const diffieHellmanLesson: Lesson = {
  id: '06-diffie-hellman',
  title: 'Diffie-Hellman Protocol',
  description: 'Learn the Diffie-Hellman key exchange protocol and implement it in Lean',
  category: 'cryptography',
  order: 6,
  sections: [
    {
      type: 'content',
      title: 'Introduction to Diffie-Hellman',
      content: `# The Diffie-Hellman Key Exchange

The Diffie-Hellman (DH) protocol, published in 1976, revolutionized cryptography by enabling two parties to establish a **shared secret** over an insecure channel.

## The Problem

Alice and Bob want to communicate securely, but:
- They've never met before
- They can only communicate over a public channel
- Eve is listening to everything

How can they establish a shared secret key?

## The Breakthrough Idea

Use a **one-way function** based on the **Discrete Logarithm Problem**:
- Easy: Given g, a, p → compute g^a mod p
- Hard: Given g, g^a mod p → find a

## The Protocol

1. **Public Parameters**: Prime p and generator g
2. **Alice**: Picks secret a, sends A = g^a mod p
3. **Bob**: Picks secret b, sends B = g^b mod p
4. **Shared Secret**:
   - Alice computes: B^a = (g^b)^a = g^(ab) mod p
   - Bob computes: A^b = (g^a)^b = g^(ab) mod p

Eve sees p, g, A, B but cannot compute g^(ab) without knowing a or b!

## Historical Significance

- First practical public-key protocol
- Foundation for modern internet security (TLS/SSL)
- Led to RSA and elliptic curve cryptography`
    },
    {
      type: 'content',
      title: 'Mathematical Foundation',
      content: `## The Math Behind DH

### Modular Exponentiation

The core operation is computing g^a mod p efficiently.

\`\`\`lean
-- Naive approach: O(a) multiplications
def modExpNaive (g a p : Nat) : Nat :=
  if a == 0 then 1
  else (g * modExpNaive g (a - 1) p) % p
\`\`\`

### Fast Exponentiation (Square-and-Multiply)

Use binary representation for O(log a) multiplications:

\`\`\`lean
def modExp (g a p : Nat) : Nat :=
  if a == 0 then 1
  else if a % 2 == 0 then
    let half := modExp g (a / 2) p
    (half * half) % p
  else
    (g * modExp g (a - 1) p) % p
\`\`\`

### Example Calculation

Let p = 23, g = 5:
- Alice: a = 6, A = 5^6 mod 23 = 15625 mod 23 = 8
- Bob: b = 15, B = 5^15 mod 23 = 19

Shared secret:
- Alice: 19^6 mod 23 = 2
- Bob: 8^15 mod 23 = 2 ✓

### Why This Works

\`\`\`
(g^a)^b = g^(a×b) = g^(b×a) = (g^b)^a
\`\`\`

The **commutative property** of multiplication ensures both parties get the same result!`
    },
    {
      type: 'exercise',
      title: 'Exercise: Modular Exponentiation',
      exercise: {
        id: 'ex-dh-01',
        title: 'Implement Fast Modular Exponentiation',
        description: 'Implement the square-and-multiply algorithm for modular exponentiation: g^a mod p.',
        initialCode: `-- Implement fast modular exponentiation
-- modExp g a p computes g^a mod p
-- Use the square-and-multiply algorithm:
--   g^0 = 1
--   g^a where a is even = (g^(a/2))^2 mod p
--   g^a where a is odd = g * g^(a-1) mod p
def modExp (g a p : Nat) : Nat :=
  if a == 0 then
    -- Base case: g^0 = 1
    -- YOUR CODE HERE
    sorry
  else if a % 2 == 0 then
    -- Even case: square the half result
    -- YOUR CODE HERE
    sorry
  else
    -- Odd case: multiply by g
    -- YOUR CODE HERE
    sorry

-- Test: modExp 5 6 23 should equal 8
-- Because 5^6 = 15625, and 15625 mod 23 = 8
`,
        solution: `def modExp (g a p : Nat) : Nat :=
  if a == 0 then
    1
  else if a % 2 == 0 then
    let half := modExp g (a / 2) p
    (half * half) % p
  else
    (g * modExp g (a - 1) p) % p`,
        explanation: `**Understanding the Solution**

This exercise implements **fast modular exponentiation** using the square-and-multiply algorithm, which is essential for efficient Diffie-Hellman key exchange.

**The Algorithm**

The function computes g^a mod p in O(log a) multiplications:

1. \`if a == 0 then 1\` - Base case: g^0 = 1 for any g. This is the mathematical definition of exponentiation.

2. \`else if a % 2 == 0 then (half * half) % p\` - **Even case**: When a is even, g^a = (g^(a/2))^2. We:
   - Recursively compute half = g^(a/2) mod p
   - Square it: (half * half) mod p

3. \`else (g * modExp g (a - 1) p) % p\` - **Odd case**: When a is odd, g^a = g * g^(a-1). We multiply g by the result of g^(a-1), which will be an even exponent.

**Why Square-and-Multiply Works**

The algorithm exploits the binary representation of the exponent:
- 13 = 1101 in binary
- g^13 = g^8 * g^4 * g^1

Each squaring corresponds to a bit position, and we only multiply when that bit is 1.

**Efficiency Comparison**

- **Naive**: a-1 multiplications → O(a)
- **Square-and-multiply**: log₂(a) multiplications → O(log a)

For a 256-bit exponent, that's ~256 multiplications instead of 2^256!

**Cryptographic Importance**

This algorithm makes Diffie-Hellman practical:
- Computing g^a mod p for 2048-bit numbers is fast
- Without it, DH would be computationally infeasible

**Example: modExp 5 6 23**
- 6 is even: compute half = modExp 5 3 23
- 3 is odd: 5 * modExp 5 2 23
- 2 is even: compute half = modExp 5 1 23
- 1 is odd: 5 * modExp 5 0 23 = 5 * 1 = 5
- Back up: half=5, 5*5=25 mod 23 = 2
- Back up: 5 * 2 = 10 mod 23 = 10
- Back up: half=10, 10*10=100 mod 23 = 8`,
        hints: [
          'Base case: any number to power 0 is 1',
          'Even case: compute half = modExp g (a/2) p, then return (half * half) % p',
          'Odd case: return (g * modExp g (a-1) p) % p'
        ],
        testCases: [
          {
            description: 'base case returns 1',
            validator: (code) => /a\s*==\s*0.*then\s*\n?\s*1/.test(code) || /a\s*==\s*0\s+then\s+1/.test(code)
          },
          {
            description: 'even case squares half',
            validator: (code) => /half\s*\*\s*half/.test(code)
          },
          {
            description: 'odd case multiplies by g',
            validator: (code) => /g\s*\*\s*modExp/.test(code)
          },
          {
            description: 'uses modulo p',
            validator: (code) => /%\s*p/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'DH Protocol Structure',
      content: `## Implementing DH in Lean

Let's build the full Diffie-Hellman protocol with proper types.

### Parameter Structure

\`\`\`lean
structure DHParams where
  p : Nat  -- Prime modulus
  g : Nat  -- Generator
deriving Repr
\`\`\`

### Key Pair Structure

\`\`\`lean
structure DHKeyPair where
  privateKey : Nat
  publicKey : Nat
deriving Repr
\`\`\`

### Key Generation

\`\`\`lean
def generatePublicKey (params : DHParams) (privateKey : Nat) : Nat :=
  modExp params.g privateKey params.p

def generateKeyPair (params : DHParams) (privateKey : Nat) : DHKeyPair :=
  { privateKey := privateKey
    publicKey := generatePublicKey params privateKey }
\`\`\`

### Computing Shared Secret

\`\`\`lean
def computeSharedSecret (params : DHParams) (myPrivate : Nat) (theirPublic : Nat) : Nat :=
  modExp theirPublic myPrivate params.p
\`\`\`

### Full Protocol Example

\`\`\`lean
def dhProtocol : IO Unit := do
  let params : DHParams := { p := 23, g := 5 }

  -- Alice generates her key pair
  let alicePrivate := 6
  let aliceKeyPair := generateKeyPair params alicePrivate

  -- Bob generates his key pair
  let bobPrivate := 15
  let bobKeyPair := generateKeyPair params bobPrivate

  -- They exchange public keys and compute shared secret
  let aliceSecret := computeSharedSecret params alicePrivate bobKeyPair.publicKey
  let bobSecret := computeSharedSecret params bobPrivate aliceKeyPair.publicKey

  -- Both get the same secret!
  IO.println s!"Alice's secret: {aliceSecret}"
  IO.println s!"Bob's secret: {bobSecret}"
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: DH Structures',
      exercise: {
        id: 'ex-dh-02',
        title: 'Define DH Protocol Structures',
        description: 'Define the DHParams and DHKeyPair structures for the Diffie-Hellman protocol.',
        initialCode: `-- Define a structure for DH parameters
-- Should have p (prime) and g (generator), both Nat
-- YOUR CODE HERE


-- Define a structure for DH key pairs
-- Should have privateKey and publicKey, both Nat
-- YOUR CODE HERE


-- Placeholder for modExp
def modExp (g a p : Nat) : Nat := (g ^ a) % p

-- Generate a public key from private key and params
-- publicKey = g^privateKey mod p
def generatePublicKey (params : DHParams) (privateKey : Nat) : Nat :=
  -- YOUR CODE HERE
  sorry
`,
        solution: `structure DHParams where
  p : Nat
  g : Nat

structure DHKeyPair where
  privateKey : Nat
  publicKey : Nat

def modExp (g a p : Nat) : Nat := (g ^ a) % p

def generatePublicKey (params : DHParams) (privateKey : Nat) : Nat :=
  modExp params.g privateKey params.p`,
        explanation: `**Understanding the Solution**

This exercise creates the foundational data structures for the Diffie-Hellman protocol.

**DHParams Structure**

Contains the public parameters that both parties agree on:
- \`p : Nat\` - A large prime number (the modulus)
- \`g : Nat\` - A generator of the multiplicative group Z*_p

In real implementations:
- p is typically 2048+ bits
- g generates a large subgroup (often 2 or a small value for efficiency)

**DHKeyPair Structure**

Bundles a party's keys together:
- \`privateKey : Nat\` - The secret exponent (must be kept confidential)
- \`publicKey : Nat\` - The value g^privateKey mod p (can be shared openly)

**generatePublicKey Function**

Computes the public key using modular exponentiation:
\`\`\`
publicKey = g^privateKey mod p
\`\`\`

This is a **one-way function**:
- **Easy**: Given g, privateKey, p → compute publicKey
- **Hard**: Given g, publicKey, p → find privateKey (Discrete Log Problem)

**Why This Structure Works**

The separation of DHParams allows:
1. Multiple key pairs can use the same parameters
2. Parameters can be standardized (RFC 3526, RFC 7919)
3. Precomputation can be shared across key generations

**Security Considerations**

- p must be a "safe prime" (p = 2q + 1 where q is prime)
- privateKey should be random and at least 256 bits
- The generator g should have order q to prevent small subgroup attacks`,
        hints: [
          'DHParams needs two Nat fields: p and g',
          'DHKeyPair needs two Nat fields: privateKey and publicKey',
          'generatePublicKey uses modExp with params.g as base'
        ],
        testCases: [
          {
            description: 'structure DHParams',
            validator: (code) => /structure\s+DHParams\s+where/.test(code) && /p\s*:\s*Nat/.test(code) && /g\s*:\s*Nat/.test(code)
          },
          {
            description: 'structure DHKeyPair',
            validator: (code) => /structure\s+DHKeyPair\s+where/.test(code) && /privateKey\s*:\s*Nat/.test(code) && /publicKey\s*:\s*Nat/.test(code)
          },
          {
            description: 'generatePublicKey',
            validator: (code) => /modExp\s+params\.g\s+privateKey\s+params\.p/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Security Analysis',
      content: `## Security of Diffie-Hellman

### The Discrete Logarithm Problem (DLP)

Given g, p, and A = g^a mod p, finding a is computationally hard.

\`\`\`
Best known algorithms:
- Baby-step Giant-step: O(√p)
- Pollard's rho: O(√p)
- Index calculus: Subexponential (for certain groups)
\`\`\`

### Attacks on DH

**1. Man-in-the-Middle (MitM)**
\`\`\`
Alice → [A] → Eve → [E1] → Bob
Alice ← [E2] ← Eve ← [B] ← Bob
\`\`\`
Eve establishes separate secrets with each party!

**Solution**: Authenticated DH (signatures, certificates)

**2. Small Subgroup Attack**
If the group has small subgroups, attacker can reduce security.

**Solution**: Use safe primes (p = 2q + 1 where q is prime)

**3. Logjam Attack**
Precomputation for common DH parameters.

**Solution**: Use 2048+ bit primes, unique parameters

### Secure Parameter Selection

\`\`\`lean
-- Requirements for secure DH:
-- 1. p should be a large prime (≥ 2048 bits)
-- 2. p = 2q + 1 where q is also prime (safe prime)
-- 3. g should have order q (generates subgroup of size q)
-- 4. Private keys should be random, ≥ 256 bits

def isSafePrime (p : Nat) : Bool :=
  isPrime p && isPrime ((p - 1) / 2)
\`\`\`

### Real-World Parameters

Standard groups from RFC 3526:
- Group 14: 2048-bit prime
- Group 16: 4096-bit prime
- Group 18: 8192-bit prime`
    },
    {
      type: 'exercise',
      title: 'Exercise: Shared Secret',
      exercise: {
        id: 'ex-dh-03',
        title: 'Compute Shared Secret',
        description: 'Implement the function to compute the shared secret given your private key and their public key.',
        initialCode: `structure DHParams where
  p : Nat
  g : Nat

def modExp (g a p : Nat) : Nat :=
  if a == 0 then 1
  else if a % 2 == 0 then
    let half := modExp g (a / 2) p
    (half * half) % p
  else
    (g * modExp g (a - 1) p) % p

-- Compute the shared secret
-- Given your private key and their public key
-- sharedSecret = theirPublic^myPrivate mod p
def computeSharedSecret (params : DHParams) (myPrivate : Nat) (theirPublic : Nat) : Nat :=
  -- YOUR CODE HERE
  sorry

-- Verify the protocol works
-- Alice: private=6, public = 5^6 mod 23 = 8
-- Bob: private=15, public = 5^15 mod 23 = 19
-- Shared secret: 8^15 mod 23 = 19^6 mod 23 = 2
`,
        solution: `structure DHParams where
  p : Nat
  g : Nat

def modExp (g a p : Nat) : Nat :=
  if a == 0 then 1
  else if a % 2 == 0 then
    let half := modExp g (a / 2) p
    (half * half) % p
  else
    (g * modExp g (a - 1) p) % p

def computeSharedSecret (params : DHParams) (myPrivate : Nat) (theirPublic : Nat) : Nat :=
  modExp theirPublic myPrivate params.p`,
        explanation: `**Understanding the Solution**

This exercise implements the core operation of Diffie-Hellman: computing the shared secret from your private key and the other party's public key.

**The Formula**

\`\`\`
sharedSecret = theirPublic^myPrivate mod p
\`\`\`

**Why Both Parties Get the Same Secret**

Let's trace through the mathematics:

Alice has private key \`a\`, Bob has private key \`b\`
- Alice's public key: A = g^a mod p
- Bob's public key: B = g^b mod p

When Alice computes the shared secret:
- Alice computes: B^a = (g^b)^a = g^(ba) mod p

When Bob computes the shared secret:
- Bob computes: A^b = (g^a)^b = g^(ab) mod p

Since multiplication is commutative (ab = ba), both get **g^(ab) mod p**!

**The Magic of Commutativity**

This works because:
1. Exponentiation respects the group structure
2. (g^b)^a = g^(b*a) (power rule)
3. b*a = a*b (commutativity of multiplication)

**Security Analysis**

An eavesdropper (Eve) sees:
- p, g (public parameters)
- A = g^a mod p (Alice's public key)
- B = g^b mod p (Bob's public key)

To find g^(ab), Eve would need to solve the **Computational Diffie-Hellman (CDH) problem**, which is believed to be as hard as the Discrete Logarithm Problem.

**Example Verification**

With p=23, g=5, a=6, b=15:
- A = 5^6 mod 23 = 8
- B = 5^15 mod 23 = 19
- Alice: 19^6 mod 23 = 2
- Bob: 8^15 mod 23 = 2 (same!)`,
        hints: [
          'Use modExp to compute theirPublic^myPrivate mod p',
          'The base is theirPublic, exponent is myPrivate, modulus is params.p',
          'This gives g^(ab) mod p for both parties'
        ],
        testCases: [
          {
            description: 'def computeSharedSecret',
            validator: (code) => /def\s+computeSharedSecret/.test(code)
          },
          {
            description: 'uses modExp',
            validator: (code) => /modExp\s+theirPublic\s+myPrivate\s+params\.p/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'ECDH: Elliptic Curve DH',
      content: `## Elliptic Curve Diffie-Hellman

ECDH applies the same concept to elliptic curves, with better efficiency.

### Comparison

| Aspect | Classic DH | ECDH |
|--------|-----------|------|
| Operation | g^a mod p | aG (scalar mul) |
| Security | DLP | ECDLP |
| Key size (128-bit) | 3072 bits | 256 bits |
| Speed | Slower | Faster |

### ECDH Protocol

1. **Public Parameters**: Curve and generator point G
2. **Alice**: Picks secret a, sends A = aG
3. **Bob**: Picks secret b, sends B = bG
4. **Shared Secret**:
   - Alice: aB = a(bG) = abG
   - Bob: bA = b(aG) = abG

### In Lean

\`\`\`lean
structure ECDHParams where
  curve : EllipticCurve
  generator : ECPoint

def ecdhGeneratePublic (params : ECDHParams) (privateKey : Nat) : ECPoint :=
  scalarMul params.curve privateKey params.generator

def ecdhSharedSecret (params : ECDHParams) (myPrivate : Nat) (theirPublic : ECPoint) : ECPoint :=
  scalarMul params.curve myPrivate theirPublic
\`\`\`

### Why ECDH is Preferred Today

1. **Smaller keys**: 256-bit vs 3072-bit
2. **Faster**: Fewer operations, better for mobile
3. **Forward secrecy**: Used in TLS 1.3
4. **Quantum consideration**: Both DH and ECDH are vulnerable to quantum computers (Shor's algorithm)`
    },
    {
      type: 'exercise',
      title: 'Exercise: Full DH Protocol',
      exercise: {
        id: 'ex-dh-04',
        title: 'Complete DH Key Exchange',
        description: 'Implement a complete DH key exchange function that generates key pairs for Alice and Bob and verifies they compute the same shared secret.',
        initialCode: `structure DHParams where
  p : Nat
  g : Nat

structure DHKeyPair where
  privateKey : Nat
  publicKey : Nat

def modExp (g a p : Nat) : Nat :=
  if a == 0 then 1
  else if a % 2 == 0 then
    let half := modExp g (a / 2) p
    (half * half) % p
  else
    (g * modExp g (a - 1) p) % p

def generateKeyPair (params : DHParams) (privateKey : Nat) : DHKeyPair :=
  { privateKey := privateKey
    publicKey := modExp params.g privateKey params.p }

def computeSharedSecret (params : DHParams) (myPrivate : Nat) (theirPublic : Nat) : Nat :=
  modExp theirPublic myPrivate params.p

-- Implement a function that runs the full DH protocol
-- Returns true if both parties compute the same shared secret
def verifyDHProtocol (params : DHParams) (alicePrivate : Nat) (bobPrivate : Nat) : Bool :=
  -- 1. Generate Alice's key pair
  -- 2. Generate Bob's key pair
  -- 3. Alice computes shared secret using her private key and Bob's public key
  -- 4. Bob computes shared secret using his private key and Alice's public key
  -- 5. Return true if both secrets match
  -- YOUR CODE HERE
  sorry
`,
        solution: `structure DHParams where
  p : Nat
  g : Nat

structure DHKeyPair where
  privateKey : Nat
  publicKey : Nat

def modExp (g a p : Nat) : Nat :=
  if a == 0 then 1
  else if a % 2 == 0 then
    let half := modExp g (a / 2) p
    (half * half) % p
  else
    (g * modExp g (a - 1) p) % p

def generateKeyPair (params : DHParams) (privateKey : Nat) : DHKeyPair :=
  { privateKey := privateKey
    publicKey := modExp params.g privateKey params.p }

def computeSharedSecret (params : DHParams) (myPrivate : Nat) (theirPublic : Nat) : Nat :=
  modExp theirPublic myPrivate params.p

def verifyDHProtocol (params : DHParams) (alicePrivate : Nat) (bobPrivate : Nat) : Bool :=
  let aliceKeyPair := generateKeyPair params alicePrivate
  let bobKeyPair := generateKeyPair params bobPrivate
  let aliceSecret := computeSharedSecret params alicePrivate bobKeyPair.publicKey
  let bobSecret := computeSharedSecret params bobPrivate aliceKeyPair.publicKey
  aliceSecret == bobSecret`,
        explanation: `This exercise demonstrates the complete Diffie-Hellman key exchange protocol.

**The Protocol Steps:**

1. **Key Generation:** Each party generates their key pair:
   - Alice: publicA = g^alicePrivate mod p
   - Bob: publicB = g^bobPrivate mod p

2. **Secret Computation:** Each party computes the shared secret:
   - Alice computes: bobPublic^alicePrivate mod p
   - Bob computes: alicePublic^bobPrivate mod p

3. **Verification:** Both secrets should be equal because:
   - Alice's secret = (g^b)^a = g^(ab) mod p
   - Bob's secret = (g^a)^b = g^(ab) mod p

**Why This Works:**
The security relies on the Discrete Logarithm Problem (DLP): given g^a mod p, it's computationally hard to find a. An eavesdropper can see g, p, g^a, and g^b, but cannot compute g^(ab) without knowing a or b.`,
        hints: [
          'First generate key pairs for both Alice and Bob using generateKeyPair',
          'Then compute shared secrets using computeSharedSecret',
          'Alice uses her private key with Bob\'s public key',
          'Bob uses his private key with Alice\'s public key',
          'Compare the two secrets with =='
        ],
        testCases: [
          {
            description: 'generates Alice key pair',
            validator: (code) => /generateKeyPair\s+params\s+alicePrivate/.test(code)
          },
          {
            description: 'generates Bob key pair',
            validator: (code) => /generateKeyPair\s+params\s+bobPrivate/.test(code)
          },
          {
            description: 'computes both secrets',
            validator: (code) => /computeSharedSecret.*computeSharedSecret/.test(code.replace(/\n/g, ' '))
          },
          {
            description: 'compares secrets',
            validator: (code) => /aliceSecret\s*==\s*bobSecret/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Summary',
      content: `# Summary: Diffie-Hellman

You've learned one of the most important cryptographic protocols!

## Key Concepts

### The Protocol
1. Agree on public parameters (p, g)
2. Each party generates private key a (or b)
3. Compute public key: A = g^a mod p
4. Exchange public keys
5. Compute shared secret: g^(ab) mod p

### Security Foundation
- Based on Discrete Logarithm Problem
- Easy: compute g^a mod p
- Hard: find a given g^a mod p

### Implementation
- Fast modular exponentiation (square-and-multiply)
- Proper parameter selection (safe primes)
- Authentication to prevent MitM attacks

## Variants

| Variant | Use |
|---------|-----|
| Classic DH | Legacy systems |
| ECDH | Modern TLS, Signal |
| DHE | Ephemeral (forward secrecy) |
| X25519 | Fast ECDH variant |

## Next Lesson

Next, we'll explore **Lagrange Interpolation**, which is fundamental to:
- Secret sharing schemes
- Polynomial commitments
- Zero-knowledge proofs`
    }
  ]
}
