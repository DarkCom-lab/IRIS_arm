'use client'

import { useState } from 'react'
import { createReminder } from '@/lib/supabase/queries'

interface ReminderFormProps {
  userId: string
  noteId: string
  onReminderCreated: () => void
}

export default function ReminderForm({
  userId,
  noteId,
  onReminderCreated,
}: ReminderFormProps) {
  const [title, setTitle] = useState('')
  const [reminderDate, setReminderDate] = useState('')
  const [reminderTime, setReminderTime] = useState('09:00')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !reminderDate || !reminderTime) {
      alert('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const dateTimeString = `${reminderDate}T${reminderTime}:00`
      await createReminder(userId, title, dateTimeString, noteId)
      setTitle('')
      setReminderDate('')
      setReminderTime('09:00')
      onReminderCreated()
    } catch (error) {
      console.error('[v0] Error creating reminder:', error)
      alert('Failed to create reminder')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground block mb-1">
          Reminder Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Review this note"
          className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">
            Date
          </label>
          <input
            type="date"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">
            Time
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Creating...' : 'Create Reminder'}
      </button>
    </form>
  )
}
