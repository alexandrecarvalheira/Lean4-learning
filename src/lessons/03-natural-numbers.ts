import { Lesson } from '@/lib/types'

export const naturalNumbersLesson: Lesson = {
  id: '03-natural-numbers',
  title: 'Natural Numbers & Induction',
  description: 'Master mathematical induction and prove properties of natural numbers in Lean 4',
  category: 'basics',
  order: 3,
  sections: [
    {
      type: 'content',
      title: 'Natural Numbers in Lean',
      content: `# Natural Numbers in Lean 4

Natural numbers (ℕ = {0, 1, 2, 3, ...}) are fundamental to mathematics and computing.

## The Peano Axioms

In Lean, natural numbers are defined inductively:

\`\`\`lean
inductive Nat where
  | zero : Nat
  | succ : Nat → Nat
\`\`\`

This captures the **Peano axioms**:
1. Zero is a natural number
2. Every natural number has a successor
3. Zero is not the successor of any number
4. Different numbers have different successors
5. **Induction**: If P(0) and P(n) → P(n+1), then P holds for all n

## How Numbers Work

\`\`\`lean
#check (0 : Nat)     -- Nat.zero
#check (1 : Nat)     -- Nat.succ Nat.zero
#check (2 : Nat)     -- Nat.succ (Nat.succ Nat.zero)
\`\`\`

So 3 is really: succ (succ (succ zero))

## Basic Operations

Operations are defined recursively:

\`\`\`lean
def add : Nat → Nat → Nat
  | n, 0 => n
  | n, succ m => succ (add n m)

def mul : Nat → Nat → Nat
  | _, 0 => 0
  | n, succ m => add (mul n m) n
\`\`\`

Understanding these definitions is key to proving properties!`
    },
    {
      type: 'content',
      title: 'Mathematical Induction',
      content: `## Mathematical Induction

Induction is the key technique for proving properties of natural numbers.

### The Principle

To prove P(n) for all n : Nat:
1. **Base case**: Prove P(0)
2. **Inductive step**: Prove P(n) → P(n+1) for any n

### In Lean: Pattern Matching as Induction

\`\`\`lean
-- Proving n + 0 = n for all n
theorem add_zero (n : Nat) : n + 0 = n := by
  induction n with
  | zero => rfl                    -- Base: 0 + 0 = 0
  | succ n ih => simp [Nat.add_succ, ih]  -- Step: use IH
\`\`\`

### The \`induction\` Tactic

\`\`\`lean
theorem example_induction (n : Nat) : P n := by
  induction n with
  | zero =>
    -- Prove P 0 (base case)
    sorry
  | succ k ih =>
    -- ih : P k (inductive hypothesis)
    -- Goal: P (k + 1)
    sorry
\`\`\`

### Pattern Matching Style

\`\`\`lean
def sum_to : Nat → Nat
  | 0 => 0
  | n + 1 => (n + 1) + sum_to n

-- 1 + 2 + 3 + ... + n = n * (n + 1) / 2
theorem sum_formula (n : Nat) : 2 * sum_to n = n * (n + 1) := by
  induction n with
  | zero => rfl
  | succ k ih =>
    simp [sum_to, Nat.mul_add, Nat.add_mul, ih]
    ring
\`\`\`

The \`induction\` tactic automatically provides the inductive hypothesis!`
    },
    {
      type: 'exercise',
      title: 'Exercise: Zero is Identity',
      exercise: {
        id: 'ex-nat-01',
        title: 'Prove n + 0 = n',
        description: 'Prove that adding zero on the right doesn\'t change a number. This seems obvious, but needs proof because addition is defined by recursion on the right argument!',
        initialCode: `-- Prove that n + 0 = n for all natural numbers n
-- This uses the definition: add n 0 = n (base case of add)

theorem add_zero (n : Nat) : n + 0 = n :=
  sorry
`,
        solution: `theorem add_zero (n : Nat) : n + 0 = n :=
  rfl`,
        explanation: `This proof is surprisingly simple because of how addition is defined!

**Why rfl works:**
In Lean, addition is defined as:
\`\`\`
def add : Nat → Nat → Nat
  | n, 0 => n            -- This is exactly our theorem!
  | n, succ m => succ (add n m)
\`\`\`

The first clause says n + 0 = n **by definition**.
So n + 0 and n are **definitionally equal**, and rfl (reflexivity) works.

**Key insight:**
n + 0 literally computes to n when Lean evaluates it.
There's no actual work to do - we're just observing the definition.

**Contrast with 0 + n = n:**
This one is NOT definitional! The definition recurses on the second argument, not the first.
To prove 0 + n = n, you'd need induction.

**Tactic version:**
\`\`\`lean
theorem add_zero' (n : Nat) : n + 0 = n := by rfl
\`\`\``,
        hints: [
          'Think about how addition is defined in Lean',
          'Addition is defined by recursion on the SECOND argument',
          'n + 0 is the base case of the definition, so it equals n by definition',
          'When two things are equal by definition, use rfl'
        ],
        testCases: [
          {
            description: 'defines theorem add_zero',
            validator: (code) => /theorem\s+add_zero/.test(code)
          },
          {
            description: 'uses rfl or reflexivity',
            validator: (code) => /rfl|Eq\.refl/.test(code) || /by\s+rfl/.test(code)
          },
          {
            description: 'no sorry',
            validator: (code) => !code.includes('sorry')
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Commutativity and Associativity',
      content: `## Proving Arithmetic Properties

### Addition is Commutative: a + b = b + a

This requires induction! The definition isn't symmetric.

\`\`\`lean
theorem add_comm (a b : Nat) : a + b = b + a := by
  induction b with
  | zero => simp [Nat.add_zero, Nat.zero_add]
  | succ k ih => simp [Nat.add_succ, Nat.succ_add, ih]
\`\`\`

### Addition is Associative: (a + b) + c = a + (b + c)

\`\`\`lean
theorem add_assoc (a b c : Nat) : (a + b) + c = a + (b + c) := by
  induction c with
  | zero => rfl
  | succ k ih => simp [Nat.add_succ, ih]
\`\`\`

### Key Lemmas for Proofs

\`\`\`lean
-- Built-in lemmas you can use:
#check Nat.add_zero    -- n + 0 = n
#check Nat.zero_add    -- 0 + n = n
#check Nat.add_succ    -- n + succ m = succ (n + m)
#check Nat.succ_add    -- succ n + m = succ (n + m)
#check Nat.add_comm    -- a + b = b + a
#check Nat.add_assoc   -- (a + b) + c = a + (b + c)
\`\`\`

### The \`simp\` Tactic

\`simp\` applies simplification rules automatically:

\`\`\`lean
example (a b : Nat) : a + 0 + b = a + b := by simp
example (a : Nat) : a + a = 2 * a := by ring
\`\`\`

### The \`ring\` Tactic

\`ring\` solves ring (arithmetic) equations:

\`\`\`lean
example (a b c : Nat) : (a + b) * c = a * c + b * c := by ring
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Successor Addition',
      exercise: {
        id: 'ex-nat-02',
        title: 'Prove succ n + m = succ (n + m)',
        description: 'Prove that adding 1 to the first argument is the same as adding 1 to the result. This requires induction on m.',
        initialCode: `-- Prove: succ n + m = succ (n + m)
-- Use induction on m
-- Remember: addition recurses on the second argument

theorem succ_add (n m : Nat) : Nat.succ n + m = Nat.succ (n + m) := by
  sorry
`,
        solution: `theorem succ_add (n m : Nat) : Nat.succ n + m = Nat.succ (n + m) := by
  induction m with
  | zero => rfl
  | succ k ih => simp [Nat.add_succ, ih]`,
        explanation: `This theorem is fundamental for proving commutativity of addition.

**Why we need induction on m:**
Addition is defined by recursion on the RIGHT argument:
- n + 0 = n
- n + (succ k) = succ (n + k)

So we need to induct on m to unpack the definition.

**Step by step:**

**Base case (m = 0):**
- LHS: succ n + 0 = succ n (by def of +)
- RHS: succ (n + 0) = succ n (by def of +)
- Equal by rfl

**Inductive case (m = succ k):**
- Assume ih: succ n + k = succ (n + k)
- Goal: succ n + succ k = succ (n + succ k)

- LHS = succ (succ n + k)     -- by definition of +
- LHS = succ (succ (n + k))   -- by ih
- RHS = succ (succ (n + k))   -- by definition of +

**Why this matters:**
This lemma is used to prove n + m = m + n (commutativity).
Without it, we can't "move" the succ from one side to the other.`,
        hints: [
          'Use induction m with | zero => ... | succ k ih => ...',
          'Base case: both sides simplify to succ n',
          'Inductive case: use Nat.add_succ to unfold the definition',
          'Apply the inductive hypothesis ih with simp'
        ],
        testCases: [
          {
            description: 'defines theorem succ_add',
            validator: (code) => /theorem\s+succ_add/.test(code)
          },
          {
            description: 'uses induction',
            validator: (code) => /induction/.test(code)
          },
          {
            description: 'handles base and inductive cases',
            validator: (code) => /zero/.test(code) && /succ/.test(code) && !code.includes('sorry')
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Inequalities and Ordering',
      content: `## Inequalities on Natural Numbers

### Definitions

\`\`\`lean
-- Less than or equal (≤)
def le (n m : Nat) : Prop := ∃ k, n + k = m

-- Less than (<)
def lt (n m : Nat) : Prop := n + 1 ≤ m
\`\`\`

### Key Lemmas

\`\`\`lean
#check Nat.zero_le      -- 0 ≤ n
#check Nat.le_refl      -- n ≤ n
#check Nat.le_trans     -- a ≤ b → b ≤ c → a ≤ c
#check Nat.lt_irrefl    -- ¬(n < n)
#check Nat.le_antisymm  -- a ≤ b → b ≤ a → a = b
\`\`\`

### Proving Inequalities

\`\`\`lean
-- 0 is the smallest natural number
example (n : Nat) : 0 ≤ n := Nat.zero_le n

-- Every number is less than its successor
example (n : Nat) : n < n + 1 := Nat.lt_succ_self n

-- Transitivity
example (a b c : Nat) (h1 : a ≤ b) (h2 : b ≤ c) : a ≤ c :=
  Nat.le_trans h1 h2
\`\`\`

### The \`omega\` Tactic

\`omega\` automatically proves linear arithmetic goals:

\`\`\`lean
example (a b : Nat) (h : a < b) : a + 1 ≤ b := by omega
example (a b c : Nat) (h1 : a ≤ b) (h2 : b < c) : a < c := by omega
example (n : Nat) : n ≤ n + n := by omega
\`\`\`

### Case Analysis on Natural Numbers

\`\`\`lean
example (n : Nat) : n = 0 ∨ ∃ k, n = k + 1 := by
  cases n with
  | zero => left; rfl
  | succ k => right; exact ⟨k, rfl⟩
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Zero is Least',
      exercise: {
        id: 'ex-nat-03',
        title: 'Prove 0 ≤ n',
        description: 'Prove that zero is less than or equal to any natural number. Use the definition that a ≤ b means ∃k, a + k = b.',
        initialCode: `-- Prove that 0 ≤ n for any natural number n
-- Use the fact that 0 + n = n

theorem zero_le (n : Nat) : 0 ≤ n :=
  sorry
`,
        solution: `theorem zero_le (n : Nat) : 0 ≤ n :=
  ⟨n, Nat.zero_add n⟩`,
        explanation: `This proof uses the definition of ≤ directly.

**Understanding ≤:**
a ≤ b is defined as ∃ k, a + k = b
(There exists some k that we can add to a to get b)

**For 0 ≤ n:**
We need to show ∃ k, 0 + k = n
The witness k = n works because 0 + n = n

**Step by step:**
1. We need to construct ∃ k, 0 + k = n
2. The witness is n itself
3. We need a proof that 0 + n = n
4. Nat.zero_add n provides this proof
5. ⟨n, Nat.zero_add n⟩ packages the witness and proof

**Why Nat.zero_add?**
- Nat.add_zero : n + 0 = n (by definition)
- Nat.zero_add : 0 + n = n (needs proof, not definitional!)

We need zero_add because zero is on the LEFT side of the addition.

**Alternative proofs:**
\`\`\`lean
theorem zero_le' (n : Nat) : 0 ≤ n := Nat.zero_le n  -- built-in
theorem zero_le'' (n : Nat) : 0 ≤ n := by omega      -- automation
\`\`\``,
        hints: [
          'a ≤ b means ∃ k, a + k = b',
          'For 0 ≤ n, you need a k such that 0 + k = n',
          'What value of k makes 0 + k = n?',
          'Use ⟨witness, proof⟩ to construct the existential'
        ],
        testCases: [
          {
            description: 'defines theorem zero_le',
            validator: (code) => /theorem\s+zero_le/.test(code)
          },
          {
            description: 'uses existential constructor',
            validator: (code) => /⟨.*⟩|Exists\.intro|omega|Nat\.zero_le/.test(code)
          },
          {
            description: 'no sorry',
            validator: (code) => !code.includes('sorry')
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Strong Induction and Division',
      content: `## Strong Induction

Sometimes regular induction isn't enough. **Strong induction** lets you assume P holds for ALL smaller values.

### Regular vs Strong Induction

**Regular**: To prove P(n+1), assume P(n)
**Strong**: To prove P(n), assume P(k) for ALL k < n

\`\`\`lean
-- Strong induction principle
theorem strong_induction (P : Nat → Prop)
  (h : ∀ n, (∀ k < n, P k) → P n) : ∀ n, P n := by
  intro n
  induction n using Nat.strong_induction_on with
  | _ n ih => exact h n ih
\`\`\`

### Division Algorithm

The division algorithm is a perfect example of strong induction:

\`\`\`lean
-- For any n and positive d, there exist q and r such that
-- n = d * q + r and r < d
theorem div_algorithm (n d : Nat) (hd : 0 < d) :
    ∃ q r, n = d * q + r ∧ r < d := by
  induction n using Nat.strong_induction_on with
  | _ n ih =>
    by_cases h : n < d
    · exact ⟨0, n, by simp, h⟩
    · have : n - d < n := Nat.sub_lt (Nat.le_of_not_lt h |> Nat.lt_of_lt_of_le hd) hd
      obtain ⟨q, r, hr, hrd⟩ := ih (n - d) this
      exact ⟨q + 1, r, by omega, hrd⟩
\`\`\`

### Well-Founded Recursion

Lean ensures all recursive functions terminate. For complex recursion patterns, you might need to prove termination:

\`\`\`lean
-- GCD using well-founded recursion
def gcd (a b : Nat) : Nat :=
  if b = 0 then a
  else gcd b (a % b)
termination_by b
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Multiplication Distributes',
      exercise: {
        id: 'ex-nat-04',
        title: 'Prove a * (b + c) = a * b + a * c',
        description: 'Prove that multiplication distributes over addition from the left. This is a fundamental property of arithmetic.',
        initialCode: `-- Prove left distributivity: a * (b + c) = a * b + a * c
-- Use induction and the ring tactic

theorem mul_add_distrib (a b c : Nat) : a * (b + c) = a * b + a * c := by
  sorry
`,
        solution: `theorem mul_add_distrib (a b c : Nat) : a * (b + c) = a * b + a * c := by
  ring`,
        explanation: `The ring tactic handles this automatically, but let's understand why it works.

**Why ring works:**
The \`ring\` tactic knows all the ring axioms:
- Addition is associative and commutative
- Multiplication is associative and commutative
- Multiplication distributes over addition
- 0 and 1 are identities

It automatically applies these to prove equality.

**Manual proof with induction:**
\`\`\`lean
theorem mul_add_distrib' (a b c : Nat) : a * (b + c) = a * b + a * c := by
  induction c with
  | zero => simp
  | succ k ih =>
    simp [Nat.add_succ, Nat.mul_succ]
    rw [ih]
    ring
\`\`\`

**Step by step (manual):**

**Base case (c = 0):**
- LHS: a * (b + 0) = a * b
- RHS: a * b + a * 0 = a * b + 0 = a * b ✓

**Inductive case (c = k + 1):**
- Assume ih: a * (b + k) = a * b + a * k
- Goal: a * (b + (k + 1)) = a * b + a * (k + 1)
- LHS = a * ((b + k) + 1) = a * (b + k) + a
- LHS = (a * b + a * k) + a  (by ih)
- RHS = a * b + (a * k + a)
- These are equal by associativity!`,
        hints: [
          'The ring tactic can solve this directly',
          'For a manual proof, induct on c',
          'Use Nat.mul_succ: a * (n + 1) = a * n + a',
          'The inductive hypothesis lets you split a * (b + k)'
        ],
        testCases: [
          {
            description: 'defines theorem mul_add_distrib',
            validator: (code) => /theorem\s+mul_add_distrib/.test(code)
          },
          {
            description: 'uses ring or induction',
            validator: (code) => /ring|induction|simp/.test(code)
          },
          {
            description: 'no sorry',
            validator: (code) => !code.includes('sorry')
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Congratulations!',
      content: `# Congratulations!

You've completed the Natural Numbers & Induction lesson! 🎉

## What You Learned

- **Peano Axioms**: How natural numbers are defined inductively
- **Mathematical Induction**: The key technique for proving properties of Nat
- **Arithmetic Properties**: Commutativity, associativity, distributivity
- **Inequalities**: Working with ≤ and < on natural numbers
- **Strong Induction**: When regular induction isn't enough

## Key Tactics Learned

- **\`induction n with\`** - Perform induction on n
- **\`cases n with\`** - Case analysis (zero or succ)
- **\`simp\`** - Simplify using known lemmas
- **\`ring\`** - Solve ring equations
- **\`omega\`** - Solve linear arithmetic
- **\`rfl\`** - Prove definitional equality

## Why This Matters for Cryptography

- **Modular arithmetic** is based on natural number properties
- **Algorithm correctness** often requires inductive proofs
- **Security bounds** use inequalities and arithmetic
- **Key sizes** and **protocol rounds** are natural numbers

## Next Steps

You now have the foundations to tackle:
- Polynomials and polynomial arithmetic
- Elliptic curve mathematics
- Cryptographic protocols

The induction skills you've learned will be essential for proving properties of these more complex structures!`
    }
  ]
}
