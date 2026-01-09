'use client'

import { useState, useEffect } from 'react'
import { Lesson, LessonSection } from '@/lib/types'
import { CodeEditor } from './CodeEditor'
import { useProgressStore } from '@/lib/progressStore'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

interface LessonViewerProps {
  lesson: Lesson
}

export function LessonViewer({ lesson }: LessonViewerProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const { completeLesson, isLessonComplete, exerciseProgress } = useProgressStore()

  const currentSection = lesson.sections[currentSectionIndex]
  const isLastSection = currentSectionIndex === lesson.sections.length - 1
  const isFirstSection = currentSectionIndex === 0

  // Check if all exercises in this lesson are completed
  const lessonExercises = lesson.sections.filter((s) => s.type === 'exercise')
  const completedExercises = lessonExercises.filter((s) =>
    exerciseProgress.find(
      (p) => p.lessonId === lesson.id && p.exerciseId === s.exercise?.id && p.completed
    )
  )
  const allExercisesCompleted = completedExercises.length === lessonExercises.length

  // Reset to first section when lesson changes
  useEffect(() => {
    setCurrentSectionIndex(0)
  }, [lesson.id])

  // Auto-complete lesson when all exercises are done
  useEffect(() => {
    if (allExercisesCompleted && lessonExercises.length > 0) {
      completeLesson(lesson.id)
    }
  }, [allExercisesCompleted, lessonExercises.length, lesson.id, completeLesson])

  const handleNext = () => {
    if (!isLastSection) {
      setCurrentSectionIndex(currentSectionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(currentSectionIndex - 1)
    }
  }

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    let inCodeBlock = false
    let codeContent: string[] = []
    let codeLanguage = ''

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre key={`code-${index}`} className="bg-gray-900 p-4 rounded-lg mb-4 overflow-x-auto">
              <code className="text-green-400 font-mono text-sm">{codeContent.join('\n')}</code>
            </pre>
          )
          codeContent = []
          inCodeBlock = false
        } else {
          // Start code block
          inCodeBlock = true
          codeLanguage = line.slice(3)
        }
        return
      }

      if (inCodeBlock) {
        codeContent.push(line)
        return
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-medium mb-2 text-gray-200 mt-6">
            {line.slice(4)}
          </h3>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold mb-3 text-blue-300 mt-8">
            {line.slice(3)}
          </h2>
        )
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold mb-4 text-blue-400">
            {line.slice(2)}
          </h1>
        )
      }
      // Lists
      else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="ml-4 text-gray-300 mb-1">
            {renderInlineCode(line.slice(2))}
          </li>
        )
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li key={index} className="ml-4 text-gray-300 mb-1 list-decimal">
            {renderInlineCode(line.replace(/^\d+\.\s/, ''))}
          </li>
        )
      }
      // Empty lines
      else if (line.trim() === '') {
        elements.push(<div key={index} className="h-4" />)
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={index} className="text-gray-300 mb-3 leading-relaxed">
            {renderInlineCode(line)}
          </p>
        )
      }
    })

    return elements
  }

  const renderInlineCode = (text: string) => {
    const parts = text.split(/(`[^`]+`)/)
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-gray-800 px-2 py-0.5 rounded text-green-400 font-mono text-sm">
            {part.slice(1, -1)}
          </code>
        )
      }
      // Bold
      const boldParts = part.split(/(\*\*[^*]+\*\*)/)
      return boldParts.map((bp, bi) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return (
            <strong key={`${index}-${bi}`} className="font-semibold text-white">
              {bp.slice(2, -2)}
            </strong>
          )
        }
        return bp
      })
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
              {isLessonComplete(lesson.id) && (
                <span className="flex items-center gap-1 text-sm bg-green-900/50 text-green-400 px-2 py-1 rounded">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-gray-400 mt-1">{lesson.description}</p>
          </div>
          <div className="text-sm text-gray-500">
            Section {currentSectionIndex + 1} of {lesson.sections.length}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-4">
          {lesson.sections.map((section, index) => {
            const isExercise = section.type === 'exercise'
            const isCompleted =
              isExercise &&
              exerciseProgress.find(
                (p) =>
                  p.lessonId === lesson.id && p.exerciseId === section.exercise?.id && p.completed
              )

            return (
              <button
                key={index}
                onClick={() => setCurrentSectionIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSectionIndex
                    ? 'bg-blue-500 scale-125'
                    : isCompleted
                    ? 'bg-green-500'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                title={section.title}
              />
            )
          })}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">{currentSection.title}</h2>

            {currentSection.type === 'content' && currentSection.content && (
              <div className="lesson-content">{renderContent(currentSection.content)}</div>
            )}

            {currentSection.type === 'exercise' && currentSection.exercise && (
              <div className="mt-4">
                <CodeEditor
                  exercise={currentSection.exercise}
                  lessonId={lesson.id}
                  onComplete={handleNext}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation */}
      <footer className="px-8 py-4 border-t border-gray-700 bg-gray-800/50 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={isFirstSection}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={isLastSection}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  )
}
