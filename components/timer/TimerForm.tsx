'use client'

import { useState } from 'react'
import { createTimer } from '@/lib/supabase/queries'

interface TimerFormProps {
  userId: string
  onTimerCreated: () => void
}

export default function TimerForm({ userId, onTimerCreated }: TimerFormProps) {
  const [name, setName] = useState('')
  const [duration, setDuration] = useState(25)
  const [timerType, setTimerType] = useState<'pomodoro' | 'countdown' | 'stopwatch'>('pomodoro')
  const [loading, setLoading] = useState(false)

  const presets = {
    pomodoro: { name: 'Pomodoro', duration: 25 },
    break: { name: 'Break', duration: 5 },
    longBreak: { name: 'Long Break', duration: 15 },
  }

  const handlePreset = (presetDuration: number) => {
    setDuration(presetDuration)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setLoading(true)
      await createTimer(userId, name, duration * 60, timerType)
      setName('')
      setDuration(25)
      setTimerType('pomodoro')
      onTimerCreated()
    } catch (error) {
      console.error('[v0] Error creating timer:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Create Timer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Timer Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Focus Session"
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Timer Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['pomodoro', 'countdown', 'stopwatch'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTimerType(type)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  timerType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border text-foreground hover:border-primary'
                }`}
                disabled={loading}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="120"
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Quick Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handlePreset(presets.pomodoro.duration)}
              className="px-2 py-1 text-xs bg-background border border-border rounded hover:border-primary text-foreground transition-colors"
              disabled={loading}
            >
              {presets.pomodoro.name}
            </button>
            <button
              type="button"
              onClick={() => handlePreset(presets.break.duration)}
              className="px-2 py-1 text-xs bg-background border border-border rounded hover:border-primary text-foreground transition-colors"
              disabled={loading}
            >
              {presets.break.name}
            </button>
            <button
              type="button"
              onClick={() => handlePreset(presets.longBreak.duration)}
              className="px-2 py-1 text-xs bg-background border border-border rounded hover:border-primary text-foreground transition-colors"
              disabled={loading}
            >
              {presets.longBreak.name}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating...' : 'Create Timer'}
        </button>
      </form>
    </div>
  )
}
