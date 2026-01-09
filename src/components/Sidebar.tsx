'use client'

import { Lesson } from '@/lib/types'
import { useProgressStore } from '@/lib/progressStore'
import { BookOpen, CheckCircle, Lock, Trophy } from 'lucide-react'

interface SidebarProps {
  lessons: Lesson[]
  currentLessonId: string
  onSelectLesson: (id: string) => void
}

export function Sidebar({ lessons, currentLessonId, onSelectLesson }: SidebarProps) {
  const { completedLessons, totalPoints } = useProgressStore()

  const categories = {
    basics: lessons.filter((l) => l.category === 'basics'),
    cryptography: lessons.filter((l) => l.category === 'cryptography'),
    advanced: lessons.filter((l) => l.category === 'advanced'),
  }

  const renderLesson = (lesson: Lesson) => {
    const isCompleted = completedLessons.includes(lesson.id)
    const isCurrent = currentLessonId === lesson.id

    return (
      <button
        key={lesson.id}
        onClick={() => onSelectLesson(lesson.id)}
        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
          isCurrent
            ? 'bg-blue-600 text-white'
            : isCompleted
            ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
            : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <BookOpen className="w-5 h-5" />
        )}
        <span className="flex-1 truncate">{lesson.title}</span>
      </button>
    )
  }

  return (
    <aside className="w-72 bg-gray-800 min-h-screen flex flex-col border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">λ</span>
          Lean Learning
        </h1>
        <p className="text-sm text-gray-400 mt-1">Cryptographic Mathematics</p>
      </div>

      {/* Points Display */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-yellow-900/30 to-orange-900/30">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-300 font-semibold">{totalPoints} points</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {completedLessons.length} / {lessons.length} lessons completed
        </p>
      </div>

      {/* Lessons List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basics */}
        <div>
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">
            Lean Basics
          </h2>
          <div className="space-y-2">{categories.basics.map(renderLesson)}</div>
        </div>

        {/* Cryptography */}
        <div>
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">
            Cryptographic Math
          </h2>
          <div className="space-y-2">{categories.cryptography.map(renderLesson)}</div>
        </div>

        {/* Advanced */}
        {categories.advanced.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">
              Advanced Topics
            </h2>
            <div className="space-y-2">{categories.advanced.map(renderLesson)}</div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        <p>Built with Lean 4</p>
        <a
          href="https://lean-lang.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Learn more about Lean
        </a>
      </div>
    </aside>
  )
}
