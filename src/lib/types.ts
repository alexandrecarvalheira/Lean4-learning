export interface Exercise {
  id: string
  title: string
  description: string
  initialCode: string
  solution: string
  explanation: string  // Detailed explanation of the solution
  hints: string[]
  testCases: TestCase[]
}

export interface TestCase {
  input?: string
  expectedOutput?: string
  description: string
  validator: (output: string) => boolean
}

export interface LessonSection {
  type: 'content' | 'exercise'
  title: string
  content?: string  // For content sections
  exercise?: Exercise  // For exercise sections
}

export interface Lesson {
  id: string
  title: string
  description: string
  category: 'basics' | 'cryptography' | 'advanced'
  order: number
  sections: LessonSection[]
}

export interface LeanExecutionResult {
  success: boolean
  output: string
  errors: string[]
  warnings: string[]
}

export interface ExerciseProgress {
  lessonId: string
  exerciseId: string
  completed: boolean
  userCode: string
  attempts: number
}

export interface UserProgress {
  completedLessons: string[]
  exerciseProgress: ExerciseProgress[]
  currentStreak: number
  totalPoints: number
}
