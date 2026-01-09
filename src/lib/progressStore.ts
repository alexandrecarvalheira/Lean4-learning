import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ExerciseProgress, UserProgress } from './types'

interface ProgressState extends UserProgress {
  // Actions
  completeLesson: (lessonId: string) => void
  updateExerciseProgress: (progress: ExerciseProgress) => void
  completeExercise: (lessonId: string, exerciseId: string, code: string) => void
  addPoints: (points: number) => void
  resetProgress: () => void
  getExerciseProgress: (lessonId: string, exerciseId: string) => ExerciseProgress | undefined
  isLessonComplete: (lessonId: string) => boolean
}

const initialState: UserProgress = {
  completedLessons: [],
  exerciseProgress: [],
  currentStreak: 0,
  totalPoints: 0,
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeLesson: (lessonId: string) => {
        set((state) => {
          if (state.completedLessons.includes(lessonId)) {
            return state
          }
          return {
            completedLessons: [...state.completedLessons, lessonId],
            totalPoints: state.totalPoints + 100,
          }
        })
      },

      updateExerciseProgress: (progress: ExerciseProgress) => {
        set((state) => {
          const existingIndex = state.exerciseProgress.findIndex(
            (p) => p.lessonId === progress.lessonId && p.exerciseId === progress.exerciseId
          )

          if (existingIndex >= 0) {
            const newProgress = [...state.exerciseProgress]
            newProgress[existingIndex] = progress
            return { exerciseProgress: newProgress }
          }

          return { exerciseProgress: [...state.exerciseProgress, progress] }
        })
      },

      completeExercise: (lessonId: string, exerciseId: string, code: string) => {
        const currentProgress = get().getExerciseProgress(lessonId, exerciseId)
        const points = currentProgress?.completed ? 0 : 25 // Only award points once

        set((state) => {
          const existingIndex = state.exerciseProgress.findIndex(
            (p) => p.lessonId === lessonId && p.exerciseId === exerciseId
          )

          const newProgress: ExerciseProgress = {
            lessonId,
            exerciseId,
            completed: true,
            userCode: code,
            attempts: (currentProgress?.attempts || 0) + 1,
          }

          if (existingIndex >= 0) {
            const progressList = [...state.exerciseProgress]
            progressList[existingIndex] = newProgress
            return {
              exerciseProgress: progressList,
              totalPoints: state.totalPoints + points,
            }
          }

          return {
            exerciseProgress: [...state.exerciseProgress, newProgress],
            totalPoints: state.totalPoints + points,
          }
        })
      },

      addPoints: (points: number) => {
        set((state) => ({ totalPoints: state.totalPoints + points }))
      },

      resetProgress: () => {
        set(initialState)
      },

      getExerciseProgress: (lessonId: string, exerciseId: string) => {
        return get().exerciseProgress.find(
          (p) => p.lessonId === lessonId && p.exerciseId === exerciseId
        )
      },

      isLessonComplete: (lessonId: string) => {
        return get().completedLessons.includes(lessonId)
      },
    }),
    {
      name: 'lean-learning-progress',
    }
  )
)
