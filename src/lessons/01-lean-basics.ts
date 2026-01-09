import { Lesson } from '@/lib/types'

export const leanBasicsLesson: Lesson = {
  id: '01-lean-basics',
  title: 'Lean 4 Basics',
  description: 'Learn the fundamental syntax, types, and functions in Lean 4',
  category: 'basics',
  order: 1,
  sections: [
    {
      type: 'content',
      title: 'Welcome to Lean 4',
      content: `# Welcome to Lean 4

Lean is a **functional programming language** and **theorem prover** developed at Microsoft Research. It's designed to help you write correct programs and prove mathematical theorems.

## Why Learn Lean?

- **Formal Verification**: Prove that your code is correct, not just test it
- **Mathematical Proofs**: Formalize mathematical theorems and proofs
- **Cryptographic Applications**: Verify cryptographic algorithms and protocols
- **Type Safety**: Lean's type system catches errors at compile time

## Key Features

- **Dependent Types**: Types can depend on values, enabling precise specifications
- **Tactics**: Interactive proof mode for constructing proofs step by step
- **Metaprogramming**: Extend the language with custom tactics and automation
- **Mathlib**: Extensive mathematical library with thousands of theorems

## Basic Syntax

In Lean, we define things using the \`def\` keyword:

\`\`\`lean
def greeting : String := "Hello, Lean!"
\`\`\`

The structure is: \`def name : Type := value\`

Let's start learning!`
    },
    {
      type: 'content',
      title: 'Types and Values',
      content: `## Basic Types in Lean 4

Lean has several built-in types that form the foundation of all programs:

### Natural Numbers (Nat)
Natural numbers are non-negative integers: 0, 1, 2, 3, ...

\`\`\`lean
def myAge : Nat := 25
def zero : Nat := 0
\`\`\`

### Integers (Int)
Integers include negative numbers: ..., -2, -1, 0, 1, 2, ...

\`\`\`lean
def temperature : Int := -5
def balance : Int := 100
\`\`\`

### Booleans (Bool)
Boolean values are either \`true\` or \`false\`:

\`\`\`lean
def isReady : Bool := true
def isEmpty : Bool := false
\`\`\`

### Strings
Text values enclosed in double quotes:

\`\`\`lean
def name : String := "Alice"
def message : String := "Hello, World!"
\`\`\`

### Type Inference
Lean can often infer types automatically:

\`\`\`lean
def x := 42        -- Lean infers Nat
def y := "hello"   -- Lean infers String
\`\`\`

But explicit types improve readability and catch errors early!`
    },
    {
      type: 'exercise',
      title: 'Exercise: Define Basic Values',
      exercise: {
        id: 'ex-01-basic-values',
        title: 'Define Basic Values',
        description: 'Define a natural number called `myNumber` with value 42, and a string called `myName` with your name.',
        initialCode: `-- Define a natural number called myNumber with value 42
-- YOUR CODE HERE


-- Define a string called myName with any name
-- YOUR CODE HERE

`,
        solution: `def myNumber : Nat := 42
def myName : String := "Alice"`,
        explanation: `This exercise introduces the basic syntax for defining values in Lean 4.

**The def keyword:**
\`def\` is used to define constants, values, and functions in Lean.

**Anatomy of a definition:**
\`\`\`
def myNumber : Nat := 42
│   │         │      │
│   │         │      └─ The value (42)
│   │         └─ The type (Nat = natural number)
│   └─ The name (myNumber)
└─ The keyword
\`\`\`

**Why specify types?**
While Lean can often infer types, explicit types:
- Make code self-documenting
- Catch errors early
- Help Lean's type checker

**Type examples:**
- Nat: Natural numbers (0, 1, 2, ...)
- Int: Integers (..., -1, 0, 1, ...)
- String: Text in double quotes
- Bool: true or false`,
        hints: [
          'Use the `def` keyword to define values',
          'The syntax is: def name : Type := value',
          'Nat is the type for natural numbers, String for text'
        ],
        testCases: [
          {
            description: 'def myNumber',
            validator: (code) => /def\s+myNumber\s*:\s*Nat\s*:=\s*42/.test(code)
          },
          {
            description: 'def myName',
            validator: (code) => /def\s+myName\s*:\s*String\s*:=\s*"[^"]+"/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Functions',
      content: `## Functions in Lean 4

Functions are the building blocks of Lean programs. They transform inputs into outputs.

### Basic Function Syntax

\`\`\`lean
def double (n : Nat) : Nat := n * 2
\`\`\`

Breaking this down:
- \`def double\`: We're defining something called "double"
- \`(n : Nat)\`: It takes a parameter \`n\` of type \`Nat\`
- \`: Nat\`: It returns a \`Nat\`
- \`:= n * 2\`: The body multiplies n by 2

### Multiple Parameters

\`\`\`lean
def add (a : Nat) (b : Nat) : Nat := a + b

-- Or using a more compact syntax:
def add' (a b : Nat) : Nat := a + b
\`\`\`

### Calling Functions

\`\`\`lean
#eval double 5        -- Returns 10
#eval add 3 4         -- Returns 7
\`\`\`

### Anonymous Functions (Lambdas)

\`\`\`lean
def triple := fun (n : Nat) => n * 3

-- Or with shorthand:
def quadruple := (· * 4)
\`\`\`

### Function Composition

\`\`\`lean
def doubleThenAdd5 (n : Nat) : Nat := (double n) + 5
\`\`\`

Functions in Lean are **pure**: they always produce the same output for the same input, with no side effects.`
    },
    {
      type: 'exercise',
      title: 'Exercise: Write Functions',
      exercise: {
        id: 'ex-02-functions',
        title: 'Write Your First Functions',
        description: 'Create a function `square` that takes a natural number and returns its square. Then create a function `isEven` that returns true if a number is even.',
        initialCode: `-- Define a function called square that returns n * n
-- YOUR CODE HERE


-- Define a function called isEven that returns true if n is even
-- Hint: Use n % 2 == 0 to check if even
-- YOUR CODE HERE

`,
        solution: `def square (n : Nat) : Nat := n * n

def isEven (n : Nat) : Bool := n % 2 == 0`,
        explanation: `This exercise teaches you to define functions in Lean 4.

**Function syntax:**
\`\`\`
def square (n : Nat) : Nat := n * n
│   │       │           │      │
│   │       │           │      └─ The function body
│   │       │           └─ Return type
│   │       └─ Parameter with type annotation
│   └─ Function name
└─ def keyword
\`\`\`

**The square function:**
- Takes one parameter n of type Nat
- Returns Nat (the result of n * n)
- Body is simply n * n

**The isEven function:**
- Takes n : Nat and returns Bool
- Uses modulo operator % to get remainder
- n % 2 gives 0 for even numbers, 1 for odd
- == 0 compares and returns a Bool

**Key concepts:**
- Parameters go in parentheses: (n : Nat)
- Multiple params: (a : Nat) (b : Nat) or (a b : Nat)
- := separates signature from body
- Functions are pure: same input always gives same output`,
        hints: [
          'The square function should multiply n by itself: n * n',
          'For isEven, use the modulo operator: n % 2',
          'Compare with == 0 to check if the remainder is zero'
        ],
        testCases: [
          {
            description: 'def square',
            validator: (code) => /def\s+square\s*\([^)]*\)\s*:\s*Nat\s*:=\s*n\s*\*\s*n/.test(code)
          },
          {
            description: 'def isEven',
            validator: (code) => /def\s+isEven\s*\([^)]*\)\s*:\s*Bool\s*:=/.test(code) && /(%\s*2|mod\s+2)/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Structures',
      content: `## Structures in Lean 4

Structures let you group related data together, similar to classes or records in other languages.

### Defining a Structure

\`\`\`lean
structure Point where
  x : Float
  y : Float
\`\`\`

### Creating Instances

\`\`\`lean
def origin : Point := { x := 0.0, y := 0.0 }
def p1 : Point := { x := 3.0, y := 4.0 }

-- Or using the constructor:
def p2 : Point := Point.mk 1.0 2.0
\`\`\`

### Accessing Fields

\`\`\`lean
#eval p1.x  -- Returns 3.0
#eval p1.y  -- Returns 4.0
\`\`\`

### Structures with Methods

\`\`\`lean
structure Point where
  x : Float
  y : Float
deriving Repr

def Point.distanceFromOrigin (p : Point) : Float :=
  Float.sqrt (p.x * p.x + p.y * p.y)
\`\`\`

### Updating Structures

\`\`\`lean
def moveRight (p : Point) (dx : Float) : Point :=
  { p with x := p.x + dx }
\`\`\`

The \`{ p with field := newValue }\` syntax creates a new structure with updated fields.`
    },
    {
      type: 'exercise',
      title: 'Exercise: Define a Structure',
      exercise: {
        id: 'ex-03-structures',
        title: 'Create a Cryptographic Key Structure',
        description: 'Define a structure called `PublicKey` with two Nat fields: `n` (the modulus) and `e` (the public exponent). Then create an instance called `myKey` with n=3233 and e=17.',
        initialCode: `-- Define a structure called PublicKey with fields n and e (both Nat)
-- YOUR CODE HERE


-- Create an instance called myKey with n=3233 and e=17
-- YOUR CODE HERE

`,
        solution: `structure PublicKey where
  n : Nat
  e : Nat

def myKey : PublicKey := { n := 3233, e := 17 }`,
        explanation: `Structures in Lean group related data together, like records or objects.

**Defining a structure:**
\`\`\`
structure PublicKey where
  n : Nat    -- field 1
  e : Nat    -- field 2
\`\`\`

The \`where\` keyword introduces the fields. Each field has a name and type.

**Creating instances:**
There are multiple ways to create structure instances:

1. **Record syntax (recommended):**
   \`{ n := 3233, e := 17 }\`

2. **Constructor syntax:**
   \`PublicKey.mk 3233 17\`

3. **Named constructor:**
   \`⟨3233, 17⟩\`

**Why n=3233 and e=17?**
These are actual RSA parameters!
- n = 3233 = 61 × 53 (product of two primes)
- e = 17 (public exponent, coprime to (61-1)(53-1) = 3120)

**Accessing fields:**
\`\`\`lean
#eval myKey.n  -- Returns 3233
#eval myKey.e  -- Returns 17
\`\`\`

Structures are fundamental for organizing cryptographic data like keys, points on curves, and protocol messages.`,
        hints: [
          'Use the `structure` keyword followed by the name and `where`',
          'List each field on its own line with name : Type',
          'Create instances using { field := value, ... } syntax'
        ],
        testCases: [
          {
            description: 'structure PublicKey',
            validator: (code) => /structure\s+PublicKey\s+where/.test(code) && /n\s*:\s*Nat/.test(code) && /e\s*:\s*Nat/.test(code)
          },
          {
            description: 'def myKey',
            validator: (code) => /def\s+myKey\s*:\s*PublicKey\s*:=/.test(code) && /n\s*:=\s*3233/.test(code) && /e\s*:=\s*17/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Pattern Matching',
      content: `## Pattern Matching in Lean 4

Pattern matching is a powerful way to examine and deconstruct data.

### Match Expressions

\`\`\`lean
def describe (n : Nat) : String :=
  match n with
  | 0 => "zero"
  | 1 => "one"
  | _ => "many"
\`\`\`

The \`_\` is a wildcard that matches anything.

### Matching on Multiple Values

\`\`\`lean
def compare (a b : Nat) : String :=
  match a, b with
  | 0, 0 => "both zero"
  | 0, _ => "first is zero"
  | _, 0 => "second is zero"
  | _, _ => "neither is zero"
\`\`\`

### Recursive Functions with Pattern Matching

\`\`\`lean
def factorial : Nat → Nat
  | 0 => 1
  | n + 1 => (n + 1) * factorial n
\`\`\`

### Matching on Structures

\`\`\`lean
structure Point where
  x : Nat
  y : Nat

def isOrigin : Point → Bool
  | { x := 0, y := 0 } => true
  | _ => false
\`\`\`

### Guards in Patterns

\`\`\`lean
def classify (n : Nat) : String :=
  match n with
  | n => if n < 10 then "small"
         else if n < 100 then "medium"
         else "large"
\`\`\`

Pattern matching is exhaustive - Lean will warn you if you miss a case!`
    },
    {
      type: 'exercise',
      title: 'Exercise: Pattern Matching',
      exercise: {
        id: 'ex-04-pattern-matching',
        title: 'Implement Fibonacci with Pattern Matching',
        description: 'Implement the Fibonacci function using pattern matching. fib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2).',
        initialCode: `-- Implement the Fibonacci function
-- fib 0 = 0
-- fib 1 = 1
-- fib n = fib (n-1) + fib (n-2)
def fib : Nat → Nat
  -- YOUR CODE HERE
  | 0 => sorry
  | 1 => sorry
  | n + 2 => sorry
`,
        solution: `def fib : Nat → Nat
  | 0 => 0
  | 1 => 1
  | n + 2 => fib (n + 1) + fib n`,
        explanation: `The Fibonacci sequence demonstrates pattern matching with recursion.

**Pattern matching syntax:**
Instead of using \`match\` explicitly, we define cases directly:
\`\`\`
def fib : Nat → Nat
  | 0 => 0           -- pattern for zero
  | 1 => 1           -- pattern for one
  | n + 2 => ...     -- pattern for n ≥ 2
\`\`\`

**Why n + 2 instead of n?**
The pattern \`n + 2\` matches any natural number ≥ 2, binding n to (value - 2).
- When input is 2, n = 0
- When input is 3, n = 1
- When input is 10, n = 8

So \`fib (n + 1) + fib n\` computes:
- fib(10) calls fib(9) + fib(8)  (n=8, so n+1=9)

**The Fibonacci sequence:**
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
Each number is the sum of the two preceding ones.

**Why this matters for crypto:**
Fibonacci-like recurrences appear in:
- Analysis of Euclidean algorithm (GCD)
- Worst-case analysis of algorithms
- Certain number-theoretic sequences

**Termination:**
Lean automatically verifies this function terminates because recursive calls are on smaller arguments.`,
        hints: [
          'The base cases are: fib 0 = 0 and fib 1 = 1',
          'For n + 2, you need to add fib(n+1) and fib(n)',
          'Remember: when matching n + 2, the actual value is 2 more than n'
        ],
        testCases: [
          {
            description: 'pattern 0 => 0',
            validator: (code) => /\|\s*0\s*=>\s*0/.test(code)
          },
          {
            description: 'pattern 1 => 1',
            validator: (code) => /\|\s*1\s*=>\s*1/.test(code)
          },
          {
            description: 'recursive case',
            validator: (code) => /fib\s*\(?\s*n\s*\+\s*1\s*\)?/.test(code) && /fib\s+n/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Lists and Recursion',
      content: `## Lists in Lean 4

Lists are fundamental data structures for storing sequences of values.

### Creating Lists

\`\`\`lean
def numbers : List Nat := [1, 2, 3, 4, 5]
def empty : List Nat := []
def words : List String := ["hello", "world"]
\`\`\`

### List Operations

\`\`\`lean
#eval [1, 2, 3].length        -- 3
#eval [1, 2, 3].head?         -- some 1
#eval [1, 2, 3].tail?         -- some [2, 3]
#eval [1, 2] ++ [3, 4]        -- [1, 2, 3, 4]
#eval 0 :: [1, 2, 3]          -- [0, 1, 2, 3]
\`\`\`

### Recursive Functions on Lists

\`\`\`lean
def sum : List Nat → Nat
  | [] => 0
  | x :: xs => x + sum xs

#eval sum [1, 2, 3, 4]  -- 10
\`\`\`

### Map and Filter

\`\`\`lean
def double (n : Nat) : Nat := n * 2

#eval [1, 2, 3].map double           -- [2, 4, 6]
#eval [1, 2, 3, 4].filter (· > 2)    -- [3, 4]
\`\`\`

### Folding Lists

\`\`\`lean
-- foldl applies a function from left to right
#eval [1, 2, 3].foldl (· + ·) 0      -- 6

-- foldr applies from right to left
#eval [1, 2, 3].foldr (· + ·) 0      -- 6
\`\`\`

Lists are immutable - operations create new lists rather than modifying existing ones.`
    },
    {
      type: 'exercise',
      title: 'Exercise: List Operations',
      exercise: {
        id: 'ex-05-lists',
        title: 'Implement List Length',
        description: 'Implement a function `myLength` that calculates the length of a list using recursion and pattern matching.',
        initialCode: `-- Implement a function that returns the length of a list
-- myLength [] = 0
-- myLength (x :: xs) = 1 + myLength xs
def myLength : List α → Nat
  -- YOUR CODE HERE
  | [] => sorry
  | _ :: xs => sorry
`,
        solution: `def myLength : List α → Nat
  | [] => 0
  | _ :: xs => 1 + myLength xs`,
        explanation: `This exercise shows how to process lists recursively.

**Understanding List structure:**
Lists in Lean are defined inductively:
\`\`\`lean
inductive List (α : Type) where
  | nil : List α                    -- empty list []
  | cons : α → List α → List α      -- x :: xs
\`\`\`

**Pattern matching on lists:**
- \`[]\` matches the empty list
- \`x :: xs\` matches a list with head x and tail xs
- \`_\` ignores a value (we don't need the head element)

**The recursion:**
\`\`\`
myLength [1, 2, 3]
= 1 + myLength [2, 3]      -- match _ :: xs
= 1 + (1 + myLength [3])   -- match _ :: xs
= 1 + (1 + (1 + myLength []))  -- match _ :: xs
= 1 + (1 + (1 + 0))        -- match []
= 3
\`\`\`

**Why List α?**
The α is a type parameter making the function polymorphic:
- Works on List Nat, List String, List Bool, etc.
- You don't need to write separate functions for each type

**Key insight:**
Recursive list functions follow the structure of the list type:
- Handle the empty case ([])
- Handle the cons case (x :: xs) using recursion on xs`,
        hints: [
          'The length of an empty list [] is 0',
          'For a non-empty list x :: xs, the length is 1 + length of xs',
          'Use _ when you don\'t need to use the head element'
        ],
        testCases: [
          {
            description: 'base case [] => 0',
            validator: (code) => /\|\s*\[\]\s*=>\s*0/.test(code)
          },
          {
            description: 'recursive case',
            validator: (code) => /\|\s*_\s*::\s*\w+\s*=>\s*1\s*\+\s*myLength\s+\w+/.test(code)
          }
        ]
      }
    },
    {
      type: 'content',
      title: 'Congratulations!',
      content: `# Congratulations!

You've completed the Lean 4 Basics lesson! 🎉

## What You Learned

- **Basic Types**: Nat, Int, Bool, String
- **Functions**: Definition, parameters, and calling
- **Structures**: Grouping related data
- **Pattern Matching**: Deconstructing and analyzing data
- **Lists**: Working with sequences using recursion

## Key Takeaways

1. Lean uses \`def\` for definitions with explicit types
2. Functions are pure - same input always gives same output
3. Pattern matching is exhaustive and powerful
4. Recursion is the primary way to process data

## Next Steps

In the upcoming lessons, you'll apply these concepts to:
- **Polynomials**: Representing and manipulating polynomial expressions
- **Elliptic Curves**: Defining curves used in cryptography
- **Cryptographic Protocols**: Formalizing DH, Lagrange, and more

Keep practicing and see you in the next lesson!`
    }
  ]
}
