'use client'

import { useState } from 'react'
import { deleteReminder, updateReminder } from '@/lib/supabase/queries'

interface ReminderListProps {
  reminders: any[]
  userId: string
  onReminderDeleted: () => void
}

export default function ReminderList({
  reminders,
  userId,
  onReminderDeleted,
}: ReminderListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleToggleComplete = async (reminder: any) => {
    try {
      setLoadingId(reminder.id)
      await updateReminder(reminder.id, userId, {
        is_completed: !reminder.is_completed,
      })
      onReminderDeleted()
    } catch (error) {
      console.error('[v0] Error updating reminder:', error)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (reminderId: string) => {
    if (!confirm('Delete this reminder?')) return

    try {
      setLoadingId(reminderId)
      await deleteReminder(reminderId, userId)
      onReminderDeleted()
    } catch (error) {
      console.error('[v0] Error deleting reminder:', error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-2">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          className="flex items-start justify-between p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => handleToggleComplete(reminder)}
              disabled={loadingId === reminder.id}
              className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                reminder.is_completed
                  ? 'bg-green-600 border-green-600'
                  : 'border-border hover:border-primary'
              }`}
            >
              {reminder.is_completed && <span className="text-white text-sm">✓</span>}
            </button>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  reminder.is_completed
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                }`}
              >
                {reminder.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(reminder.reminder_date)}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleDelete(reminder.id)}
            disabled={loadingId === reminder.id}
            className="ml-2 px-2 py-1 text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 rounded transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
