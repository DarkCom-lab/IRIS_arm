'use client'

import { useState, useEffect } from 'react'
import { deleteTimer, updateTimer } from '@/lib/supabase/queries'
import TimerCard from './TimerCard'

interface TimerListProps {
  userId: string
  timers: any[]
  onTimerDeleted: () => void
}

export default function TimerList({ userId, timers, onTimerDeleted }: TimerListProps) {
  const [expandedTimerId, setExpandedTimerId] = useState<string | null>(null)
  const [timerStates, setTimerStates] = useState<Record<string, any>>({})

  useEffect(() => {
    const timerState: Record<string, any> = {}
    timers.forEach((timer) => {
      timerState[timer.id] = {
        isRunning: timer.is_active,
        elapsed: timer.elapsed_seconds || 0,
      }
    })
    setTimerStates(timerState)
  }, [timers])

  // Update elapsed time for running timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerStates((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((timerId) => {
          if (updated[timerId].isRunning) {
            updated[timerId].elapsed += 1
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleToggleTimer = async (timer: any) => {
    try {
      const isCurrentlyRunning = timerStates[timer.id]?.isRunning
      const newElapsed = timerStates[timer.id]?.elapsed || 0

      await updateTimer(timer.id, userId, {
        is_active: !isCurrentlyRunning,
        elapsed_seconds: newElapsed,
        started_at: !isCurrentlyRunning ? new Date().toISOString() : null,
      })

      setTimerStates((prev) => ({
        ...prev,
        [timer.id]: {
          ...prev[timer.id],
          isRunning: !isCurrentlyRunning,
        },
      }))
    } catch (error) {
      console.error('[v0] Error toggling timer:', error)
    }
  }

  const handleResetTimer = async (timer: any) => {
    try {
      await updateTimer(timer.id, userId, {
        is_active: false,
        elapsed_seconds: 0,
      })

      setTimerStates((prev) => ({
        ...prev,
        [timer.id]: {
          ...prev[timer.id],
          isRunning: false,
          elapsed: 0,
        },
      }))
    } catch (error) {
      console.error('[v0] Error resetting timer:', error)
    }
  }

  const handleDeleteTimer = async (timerId: string) => {
    try {
      await deleteTimer(timerId, userId)
      onTimerDeleted()
    } catch (error) {
      console.error('[v0] Error deleting timer:', error)
    }
  }

  if (timers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No timers yet. Create one to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {timers.map((timer) => (
        <TimerCard
          key={timer.id}
          timer={timer}
          timerState={timerStates[timer.id]}
          isExpanded={expandedTimerId === timer.id}
          onToggle={() => handleToggleTimer(timer)}
          onReset={() => handleResetTimer(timer)}
          onDelete={() => handleDeleteTimer(timer.id)}
          onExpand={() =>
            setExpandedTimerId(
              expandedTimerId === timer.id ? null : timer.id
            )
          }
        />
      ))}
    </div>
  )
}
