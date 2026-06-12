'use client'

import { useEffect, useState } from 'react'
import { getRemindersForNote, deleteReminder, createReminder } from '@/lib/supabase/queries'
import ReminderList from './ReminderList'
import ReminderForm from './ReminderForm'

interface NoteDetailModalProps {
  note: any
  userId: string
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export default function NoteDetailModal({
  note,
  userId,
  isOpen,
  onClose,
  onUpdate,
}: NoteDetailModalProps) {
  const [reminders, setReminders] = useState<any[]>([])
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadReminders()
    }
  }, [isOpen, note.id])

  const loadReminders = async () => {
    try {
      setLoading(true)
      const data = await getRemindersForNote(userId, note.id)
      setReminders(data || [])
    } catch (error) {
      console.error('[v0] Error loading reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReminderCreated = async () => {
    await loadReminders()
    setShowReminderForm(false)
    onUpdate()
  }

  const handleReminderDeleted = async () => {
    await loadReminders()
    onUpdate()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{note.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Created {new Date(note.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Note Content */}
          <div className="mb-8 pb-8 border-b border-border">
            <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
          </div>

          {/* Reminders Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Reminders ({reminders.length})
              </h3>
              <button
                onClick={() => setShowReminderForm(!showReminderForm)}
                className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {showReminderForm ? 'Cancel' : 'Add Reminder'}
              </button>
            </div>

            {showReminderForm && (
              <div className="mb-6 p-4 bg-background border border-border rounded-lg">
                <ReminderForm
                  userId={userId}
                  noteId={note.id}
                  onReminderCreated={handleReminderCreated}
                />
              </div>
            )}

            {reminders.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No reminders yet. Add one to be notified!
              </p>
            ) : (
              <ReminderList
                reminders={reminders}
                userId={userId}
                onReminderDeleted={handleReminderDeleted}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
