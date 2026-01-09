'use client'

import { useCallback, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Play, RotateCcw, Lightbulb, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react'
import { executeLeanCode } from '@/lib/leanExecutor'
import { Exercise, LeanExecutionResult } from '@/lib/types'
import { useProgressStore } from '@/lib/progressStore'

interface CodeEditorProps {
  exercise: Exercise
  lessonId: string
  onComplete?: () => void
}

export function CodeEditor({ exercise, lessonId, onComplete }: CodeEditorProps) {
  const { getExerciseProgress, completeExercise, updateExerciseProgress } = useProgressStore()

  const savedProgress = getExerciseProgress(lessonId, exercise.id)
  const [code, setCode] = useState(savedProgress?.userCode || exercise.initialCode)
  const [result, setResult] = useState<LeanExecutionResult | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(savedProgress?.completed || null)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setResult(null)
    setIsCorrect(null)

    try {
      // Execute the code
      const execResult = await executeLeanCode(code)
      setResult(execResult)

      if (execResult.success) {
        // Run custom validators and collect feedback
        const failedTests: string[] = []
        const passedTests: string[] = []

        for (const testCase of exercise.testCases) {
          if (testCase.validator(code)) {
            passedTests.push(testCase.description)
          } else {
            failedTests.push(testCase.description)
          }
        }

        // Check for sorry/admit
        if (code.includes('sorry')) {
          failedTests.push('Remove "sorry" - complete the implementation')
        }
        if (code.includes('admit')) {
          failedTests.push('Remove "admit" - complete the proof')
        }

        if (failedTests.length === 0) {
          setIsCorrect(true)
          setResult({
            ...execResult,
            output: `All tests passed!\n\nPassed:\n${passedTests.map(t => `  ✓ ${t}`).join('\n')}`
          })
          completeExercise(lessonId, exercise.id, code)
          onComplete?.()
        } else {
          setIsCorrect(false)
          setResult({
            ...execResult,
            output: `Tests: ${passedTests.length}/${passedTests.length + failedTests.length} passed\n\n` +
              (passedTests.length > 0 ? `Passed:\n${passedTests.map(t => `  ✓ ${t}`).join('\n')}\n\n` : '') +
              `Failed:\n${failedTests.map(t => `  ✗ ${t}`).join('\n')}\n\nHint: Check the exercise requirements and make sure your code matches the expected pattern.`
          })
          updateExerciseProgress({
            lessonId,
            exerciseId: exercise.id,
            completed: false,
            userCode: code,
            attempts: (savedProgress?.attempts || 0) + 1,
          })
        }
      } else {
        setIsCorrect(false)
      }
    } catch (error) {
      setResult({
        success: false,
        output: '',
        errors: ['An error occurred while running the code.'],
        warnings: [],
      })
      setIsCorrect(false)
    }

    setIsRunning(false)
  }, [code, exercise, lessonId, completeExercise, updateExerciseProgress, savedProgress, onComplete])

  const handleReset = () => {
    setCode(exercise.initialCode)
    setResult(null)
    setIsCorrect(null)
    setShowHint(false)
    setHintIndex(0)
    setShowAnswer(false)
  }

  const handleToggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  const handleShowHint = () => {
    setShowHint(true)
  }

  const handleNextHint = () => {
    if (hintIndex < exercise.hints.length - 1) {
      setHintIndex(hintIndex + 1)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">{exercise.title}</span>
          {savedProgress?.completed && (
            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
              Completed
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShowHint}
            disabled={showHint && hintIndex >= exercise.hints.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-yellow-900/50 text-yellow-300 rounded hover:bg-yellow-900/70 transition disabled:opacity-50"
          >
            <Lightbulb className="w-4 h-4" />
            Hint
          </button>
          <button
            onClick={handleToggleAnswer}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded transition ${
              showAnswer
                ? 'bg-purple-600 text-white hover:bg-purple-500'
                : 'bg-purple-900/50 text-purple-300 hover:bg-purple-900/70'
            }`}
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1 px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-500 transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
        <p className="text-sm text-gray-300">{exercise.description}</p>
      </div>

      {/* Hint Panel */}
      {showHint && exercise.hints.length > 0 && (
        <div className="px-4 py-3 bg-yellow-900/20 border-b border-yellow-700/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs text-yellow-400 font-medium">
                Hint {hintIndex + 1} of {exercise.hints.length}
              </span>
              <p className="text-sm text-yellow-200 mt-1">{exercise.hints[hintIndex]}</p>
            </div>
            {hintIndex < exercise.hints.length - 1 && (
              <button
                onClick={handleNextHint}
                className="text-xs text-yellow-400 hover:text-yellow-300 whitespace-nowrap"
              >
                Next hint →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Answer Panel */}
      {showAnswer && (
        <div className="px-4 py-3 bg-purple-900/20 border-b border-purple-700/50 max-h-64 overflow-y-auto">
          <div className="mb-3">
            <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">Solution Code</span>
            <pre className="mt-2 p-3 bg-gray-950 rounded text-sm text-purple-200 font-mono overflow-x-auto whitespace-pre-wrap">{exercise.solution}</pre>
          </div>
          <div>
            <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">Explanation</span>
            <p className="mt-2 text-sm text-purple-200 whitespace-pre-wrap">{exercise.explanation}</p>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1" style={{ minHeight: '300px' }}>
        <Editor
          height="300px"
          defaultLanguage="plaintext"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            readOnly: false,
          }}
          loading={<div className="p-4 text-gray-400">Loading editor...</div>}
        />
      </div>

      {/* Output Panel */}
      {result && (
        <div className="border-t border-gray-700">
          <div className="px-4 py-2 bg-gray-800 flex items-center gap-2">
            {isCorrect === true ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Correct!</span>
              </>
            ) : isCorrect === false ? (
              <>
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Not quite right</span>
              </>
            ) : (
              <span className="text-gray-400">Output</span>
            )}
          </div>
          <div className="px-4 py-3 max-h-48 overflow-y-auto bg-gray-950">
            {result.errors.length > 0 && (
              <div className="mb-2">
                {result.errors.map((error, i) => (
                  <p key={i} className="text-red-400 text-sm font-mono">
                    {error}
                  </p>
                ))}
              </div>
            )}
            {result.warnings.length > 0 && (
              <div className="mb-2">
                {result.warnings.map((warning, i) => (
                  <p key={i} className="text-yellow-400 text-sm font-mono">
                    {warning}
                  </p>
                ))}
              </div>
            )}
            {result.output && <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">{result.output}</pre>}
          </div>
        </div>
      )}
    </div>
  )
}
