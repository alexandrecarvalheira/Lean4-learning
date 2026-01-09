'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { LessonViewer } from '@/components/LessonViewer'
import { lessons } from '@/lessons'

export default function Home() {
  const [currentLessonId, setCurrentLessonId] = useState<string>('01-lean-basics')

  const currentLesson = lessons.find(l => l.id === currentLessonId) || lessons[0]

  return (
    <main className="flex min-h-screen">
      <Sidebar
        lessons={lessons}
        currentLessonId={currentLessonId}
        onSelectLesson={setCurrentLessonId}
      />
      <div className="flex-1 overflow-auto">
        <LessonViewer lesson={currentLesson} />
      </div>
    </main>
  )
}
