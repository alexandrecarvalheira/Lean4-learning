import { Lesson } from '@/lib/types'

export const logicProofsLesson: Lesson = {
  id: '02-logic-proofs',
  title: 'Propositional Logic & Proofs',
  description: 'Learn the fundamentals of logical reasoning and proof construction in Lean 4',
  category: 'basics',
  order: 2,
  sections: [
    {
      type: 'content',
      title: 'Introduction to Logic in Lean',
      content: `# Propositional Logic in Lean 4

Logic is the foundation of mathematical reasoning and formal verification. In Lean, we can express and prove logical statements with precision.

## Why Logic Matters

- **Formal proofs**: Verify that your reasoning is correct
- **Type theory**: Lean's type system is based on logic
- **Cryptographic proofs**: Security proofs rely on logical arguments

## Propositions as Types

In Lean, propositions are types! This is called the **Curry-Howard correspondence**.

**The key insight:** A proposition is a type, and a proof is a value of that type.

**How logic maps to types:**

- **Proposition** becomes a **Type**
- **Proof of P** becomes a **value of type P**
- **True** becomes the **Unit type** (always has a value)
- **False** becomes the **Empty type** (has no values)
- **A ∧ B (and)** becomes **A × B** (a pair: you need both)
- **A ∨ B (or)** becomes **A ⊕ B** (a sum: you have one or the other)
- **A → B (implies)** becomes **A → B** (a function: transform proof of A into proof of B)

\`\`\`lean
-- A simple proposition
def isTrue : Prop := True

-- A proof of True
def proofOfTrue : True := trivial
\`\`\`

When you prove a proposition in Lean, you're constructing a value of that type!`
    },
    {
      type: 'content',
      title: 'Logical Connectives',
      content: `## Logical Connectives

### Conjunction (AND): ∧

Two propositions are both true.

\`\`\`lean
-- To prove A ∧ B, we need proofs of both A and B
example (hA : A) (hB : B) : A ∧ B := And.intro hA hB

-- Or using angle bracket notation
example (hA : A) (hB : B) : A ∧ B := ⟨hA, hB⟩

-- To use A ∧ B, we can extract either part
example (h : A ∧ B) : A := h.left   -- or h.1
example (h : A ∧ B) : B := h.right  -- or h.2
\`\`\`

### Disjunction (OR): ∨

At least one proposition is true.

\`\`\`lean
-- To prove A ∨ B, provide proof of either A or B
example (hA : A) : A ∨ B := Or.inl hA
example (hB : B) : A ∨ B := Or.inr hB

-- To use A ∨ B, handle both cases
example (h : A ∨ B) : C :=
  match h with
  | Or.inl hA => ... -- use hA : A to prove C
  | Or.inr hB => ... -- use hB : B to prove C
\`\`\`

### Implication: →

If A is true, then B is true.

\`\`\`lean
-- To prove A → B, assume A and prove B
example : A → A := fun hA => hA

-- To use A → B with a proof of A
example (f : A → B) (hA : A) : B := f hA
\`\`\`

### Negation: ¬

A proposition is false (A → False).

\`\`\`lean
-- ¬A is defined as A → False
example (h : A) (hn : ¬A) : False := hn h
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Prove And Commutativity',
      exercise: {
        id: 'ex-logic-01',
        title: 'And is Commutative',
        description: 'Prove that A ∧ B implies B ∧ A. This shows that the order of conjunction doesn\'t matter.',
        initialCode: `-- Prove: A ∧ B → B ∧ A
-- Use h.left and h.right to extract parts of the conjunction
-- Use And.intro or ⟨_, _⟩ to construct the result

theorem and_comm (A B : Prop) (h : A ∧ B) : B ∧ A :=
  sorry
`,
        solution: `theorem and_comm (A B : Prop) (h : A ∧ B) : B ∧ A :=
  ⟨h.right, h.left⟩`,
        explanation: `This proof demonstrates the commutativity of logical AND.

**Step by step:**
1. We have h : A ∧ B, which contains proofs of both A and B
2. h.left gives us the proof of A
3. h.right gives us the proof of B
4. We need to construct B ∧ A, so we put them in reversed order
5. ⟨h.right, h.left⟩ creates the pair with B first, then A

**Alternative syntax:**
- And.intro h.right h.left
- { left := h.right, right := h.left }

The key insight is that ∧ is just a pair type, so "swapping" the conjunction is literally swapping the elements of the pair.`,
        hints: [
          'h.left gives you a proof of A, h.right gives you a proof of B',
          'To prove B ∧ A, you need to provide B first, then A',
          'Use ⟨h.right, h.left⟩ to swap the order'
        ],
        testCases: [
          {
            description: 'defines theorem and_comm',
            validator: (code) => /theorem\s+and_comm/.test(code)
          },
          {
            description: 'uses h.left or h.1',
            validator: (code) => /h\.(left|right|1|2)/.test(code)
          },
          {
            description: 'returns B ∧ A',
            validator: (code) => /⟨.*⟩|And\.intro/.test(code) && !code.includes('sorry')
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Proof Tactics',
      content: `## Proof Tactics in Lean 4

Tactics are commands that help you construct proofs interactively.

### The \`intro\` Tactic

Introduces hypotheses for implications and universal quantifiers.

\`\`\`lean
theorem example1 (A B : Prop) : A → B → A := by
  intro hA    -- introduces hA : A
  intro hB    -- introduces hB : B
  exact hA    -- proves A using hA
\`\`\`

### The \`exact\` Tactic

Provides an exact proof term.

\`\`\`lean
theorem example2 (A : Prop) (h : A) : A := by
  exact h
\`\`\`

### The \`apply\` Tactic

Applies a function or theorem backwards.

\`\`\`lean
theorem example3 (A B : Prop) (f : A → B) (h : A) : B := by
  apply f     -- goal becomes A
  exact h     -- proves A
\`\`\`

### The \`constructor\` Tactic

Splits a goal like A ∧ B into subgoals.

\`\`\`lean
theorem example4 (A B : Prop) (hA : A) (hB : B) : A ∧ B := by
  constructor
  · exact hA  -- first goal: A
  · exact hB  -- second goal: B
\`\`\`

### The \`cases\` Tactic

Performs case analysis on a hypothesis.

\`\`\`lean
theorem example5 (A B : Prop) (h : A ∨ B) : B ∨ A := by
  cases h with
  | inl hA => exact Or.inr hA
  | inr hB => exact Or.inl hB
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Or Commutativity',
      exercise: {
        id: 'ex-logic-02',
        title: 'Or is Commutative',
        description: 'Prove that A ∨ B implies B ∨ A using pattern matching or tactics.',
        initialCode: `-- Prove: A ∨ B → B ∨ A
-- Use cases or match to handle both possibilities

theorem or_comm (A B : Prop) (h : A ∨ B) : B ∨ A :=
  sorry
`,
        solution: `theorem or_comm (A B : Prop) (h : A ∨ B) : B ∨ A :=
  match h with
  | Or.inl hA => Or.inr hA
  | Or.inr hB => Or.inl hB`,
        explanation: `This proof demonstrates the commutativity of logical OR.

**Step by step:**
1. We have h : A ∨ B, meaning either A is true OR B is true
2. We use pattern matching to handle both cases:
   - Case Or.inl hA: A is true. To prove B ∨ A, we put A on the right: Or.inr hA
   - Case Or.inr hB: B is true. To prove B ∨ A, we put B on the left: Or.inl hB

**Why Or.inl and Or.inr?**
- inl = "inject left" - puts the proof in the left position
- inr = "inject right" - puts the proof in the right position

**Tactic version:**
\`\`\`lean
theorem or_comm' (A B : Prop) (h : A ∨ B) : B ∨ A := by
  cases h with
  | inl hA => exact Or.inr hA
  | inr hB => exact Or.inl hB
\`\`\``,
        hints: [
          'A ∨ B means either A is true (Or.inl) or B is true (Or.inr)',
          'Use match h with | Or.inl hA => ... | Or.inr hB => ...',
          'If you have a proof of A, use Or.inr to put it on the right of B ∨ A'
        ],
        testCases: [
          {
            description: 'defines theorem or_comm',
            validator: (code) => /theorem\s+or_comm/.test(code)
          },
          {
            description: 'handles both cases',
            validator: (code) => /(Or\.inl|inl)/.test(code) && /(Or\.inr|inr)/.test(code)
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
      title: 'Quantifiers',
      content: `## Quantifiers in Lean 4

### Universal Quantifier: ∀ (forall)

"For all x, P(x) holds"

\`\`\`lean
-- To prove ∀ x, P x: introduce x and prove P x
example : ∀ n : Nat, n + 0 = n := by
  intro n
  rfl  -- reflexivity: n + 0 = n by definition

-- To use ∀ x, P x: apply it to a specific value
example (h : ∀ n : Nat, n < n + 1) : 5 < 6 := h 5
\`\`\`

### Existential Quantifier: ∃ (exists)

"There exists an x such that P(x) holds"

\`\`\`lean
-- To prove ∃ x, P x: provide a witness and proof
example : ∃ n : Nat, n > 5 := ⟨10, by decide⟩

-- To use ∃ x, P x: extract the witness
example (h : ∃ n : Nat, n = 42) : True := by
  obtain ⟨n, hn⟩ := h  -- n : Nat, hn : n = 42
  trivial
\`\`\`

### Combining Quantifiers

\`\`\`lean
-- "For all n, there exists m such that m > n"
example : ∀ n : Nat, ∃ m : Nat, m > n :=
  fun n => ⟨n + 1, Nat.lt_succ_self n⟩
\`\`\`

### Negation of Quantifiers

- ¬(∀ x, P x) ↔ ∃ x, ¬P x
- ¬(∃ x, P x) ↔ ∀ x, ¬P x

\`\`\`lean
-- If not all numbers are even, then some number is odd
-- If no number satisfies P, then all numbers fail P
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Modus Ponens',
      exercise: {
        id: 'ex-logic-03',
        title: 'Prove Modus Ponens',
        description: 'Modus ponens is a fundamental rule of inference: if P is true and P → Q is true, then Q is true. Prove this in Lean.',
        initialCode: `-- Modus Ponens: P ∧ (P → Q) → Q
-- If we have P and we know P implies Q, then Q must be true

theorem modus_ponens (P Q : Prop) (h : P ∧ (P → Q)) : Q :=
  sorry
`,
        solution: `theorem modus_ponens (P Q : Prop) (h : P ∧ (P → Q)) : Q :=
  h.right h.left`,
        explanation: `Modus ponens is one of the most fundamental rules of logical inference.

**Step by step:**
1. We have h : P ∧ (P → Q), a conjunction containing:
   - h.left : P (proof that P is true)
   - h.right : P → Q (a function from P to Q)
2. Since h.right is a function expecting a proof of P, we can apply it to h.left
3. h.right h.left gives us a proof of Q

**Why this works:**
In the Curry-Howard correspondence, P → Q is a function type.
- h.right : P → Q is a function
- h.left : P is an argument
- h.right h.left : Q is the result

**Tactic version:**
\`\`\`lean
theorem modus_ponens' (P Q : Prop) (h : P ∧ (P → Q)) : Q := by
  have hP := h.left
  have hPQ := h.right
  exact hPQ hP
\`\`\`

This is exactly the logical reasoning: "If P, and if P implies Q, then Q."`,
        hints: [
          'h.left gives you P, h.right gives you P → Q',
          'P → Q is a function that takes a proof of P and returns a proof of Q',
          'Apply h.right to h.left: h.right h.left'
        ],
        testCases: [
          {
            description: 'defines theorem modus_ponens',
            validator: (code) => /theorem\s+modus_ponens/.test(code)
          },
          {
            description: 'uses h.left and h.right',
            validator: (code) => /h\.(left|right|1|2)/.test(code)
          },
          {
            description: 'applies function to argument',
            validator: (code) => !code.includes('sorry') && /(h\.right\s+h\.left|h\.2\s+h\.1)/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Classical vs Constructive Logic',
      content: `## Classical vs Constructive Logic

Lean's default logic is **constructive**, meaning:

- To prove ∃ x, P x, you must provide an actual witness x
- To prove A ∨ B, you must prove A or prove B (you must know which!)
- The law of excluded middle (P ∨ ¬P) is not automatically available

### Constructive Logic

\`\`\`lean
-- This is constructively valid: we provide a witness
example : ∃ n : Nat, n > 0 := ⟨1, Nat.one_pos⟩
\`\`\`

### Classical Logic

For some proofs, we need **classical** reasoning:

\`\`\`lean
open Classical

-- Law of excluded middle
example (P : Prop) : P ∨ ¬P := em P

-- Double negation elimination
example (P : Prop) (h : ¬¬P) : P := by
  by_contra hn
  exact h hn

-- Proof by contradiction
example (P : Prop) : ¬¬P → P := by
  intro h
  by_contra hn
  exact h hn
\`\`\`

### When to Use Classical Logic

- **Constructive** is preferred for computation (proofs can be extracted as programs)
- **Classical** is needed for:
  - Proof by contradiction
  - Case analysis on arbitrary propositions
  - Some existence proofs where you can't construct a witness

### The \`decide\` Tactic

For decidable propositions, Lean can automatically check:

\`\`\`lean
example : 2 + 2 = 4 := by decide
example : 10 < 20 := by decide
\`\`\``
    },
    {
      type: 'exercise',
      title: 'Exercise: Contraposition',
      exercise: {
        id: 'ex-logic-04',
        title: 'Prove Contraposition',
        description: 'The contrapositive of P → Q is ¬Q → ¬P. Prove that if P implies Q, then not Q implies not P.',
        initialCode: `-- Contraposition: (P → Q) → (¬Q → ¬P)
-- Remember: ¬P is the same as P → False

theorem contraposition (P Q : Prop) (h : P → Q) : ¬Q → ¬P :=
  sorry
`,
        solution: `theorem contraposition (P Q : Prop) (h : P → Q) : ¬Q → ¬P :=
  fun hnQ => fun hP => hnQ (h hP)`,
        explanation: `Contraposition is a fundamental logical equivalence.

**Understanding the types:**
- h : P → Q (if P then Q)
- We need to return: ¬Q → ¬P
- ¬Q means Q → False
- ¬P means P → False

**Step by step:**
1. fun hnQ => ... takes hnQ : ¬Q (i.e., hnQ : Q → False)
2. fun hP => ... takes hP : P
3. h hP gives us Q (applying our assumption)
4. hnQ (h hP) gives us False (Q contradicts ¬Q)

**The logic:**
- Assume ¬Q (Q is false)
- Now assume P (for contradiction)
- From P, we get Q (using h : P → Q)
- But Q contradicts ¬Q, so we have False
- Therefore ¬P (assuming P leads to False)

**Tactic version:**
\`\`\`lean
theorem contraposition' (P Q : Prop) (h : P → Q) : ¬Q → ¬P := by
  intro hnQ
  intro hP
  apply hnQ
  exact h hP
\`\`\``,
        hints: [
          '¬Q → ¬P is a function taking ¬Q and returning ¬P',
          '¬P is P → False, so it\'s also a function taking P',
          'Chain the functions: if you have P, use h to get Q, then use ¬Q to get False'
        ],
        testCases: [
          {
            description: 'defines theorem contraposition',
            validator: (code) => /theorem\s+contraposition/.test(code)
          },
          {
            description: 'uses function syntax',
            validator: (code) => /fun/.test(code) || /=>/.test(code) || /by/.test(code)
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

You've completed the Propositional Logic & Proofs lesson! 🎉

## What You Learned

- **Propositions as Types**: The Curry-Howard correspondence
- **Logical Connectives**: AND (∧), OR (∨), implication (→), negation (¬)
- **Proof Tactics**: intro, exact, apply, constructor, cases
- **Quantifiers**: Universal (∀) and existential (∃)
- **Classical vs Constructive**: Different approaches to logic

## Key Proof Strategies

1. **To prove A ∧ B**: Prove both A and B
2. **To prove A ∨ B**: Prove either A or B
3. **To prove A → B**: Assume A, then prove B
4. **To prove ¬A**: Assume A, derive False
5. **To prove ∀ x, P x**: Introduce arbitrary x, prove P x
6. **To prove ∃ x, P x**: Provide witness and proof

## Coming Up Next

In the next lesson, you'll learn about:
- Natural numbers and their properties
- Mathematical induction
- Recursive proofs

These skills will be essential for the cryptographic applications that follow!`
    }
  ]
}
