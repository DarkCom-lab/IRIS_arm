'use client'

import { useState } from 'react'
import NoteDetailModal from './NoteDetailModal'

interface NoteGridProps {
  notes: any[]
  userId: string
  onUpdate: (noteId: string, updates: any) => void
  onDelete: (noteId: string) => void
}

export default function NoteGrid({ notes, userId, onUpdate, onDelete }: NoteGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [selectedNote, setSelectedNote] = useState<any | null>(null)
  const [reminderCounts, setReminderCounts] = useState<Record<string, number>>({})

  const handlePin = (noteId: string, isPinned: boolean) => {
    onUpdate(noteId, { is_pinned: !isPinned })
  }

  const handleArchive = (noteId: string) => {
    onUpdate(noteId, { is_archived: true })
  }

  const handleEdit = (note: any) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const handleSaveEdit = (noteId: string) => {
    if (editContent.trim()) {
      onUpdate(noteId, { content: editContent })
      setEditingId(null)
    }
  }

  const handleOpenDetail = (note: any) => {
    setSelectedNote(note)
  }

  const handleUpdateNote = () => {
    onUpdate(selectedNote.id, {})
  }

  if (notes.length === 0) {
    return (
      <div className="rounded-lg bg-slate-800 border border-slate-700 p-12 text-center">
        <p className="text-slate-400">No notes yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors relative group"
            style={{ backgroundColor: note.color || '#FFFFFF' }}
          >
            {/* Reminder Badge */}
            {reminderCounts[note.id] && reminderCounts[note.id] > 0 && (
              <div className="absolute top-2 right-12 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {reminderCounts[note.id]}
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <h3
                className={`font-semibold line-clamp-2 flex-1 ${
                  note.color && note.color !== '#FFFFFF'
                    ? 'text-slate-900'
                    : 'text-slate-900'
                }`}
              >
                {note.title}
              </h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handlePin(note.id, note.is_pinned)}
                  className={`p-1 rounded hover:bg-black/10 transition-colors ${
                    note.is_pinned ? 'text-yellow-600' : 'text-gray-500'
                  }`}
                  title={note.is_pinned ? 'Unpin' : 'Pin'}
                >
                  📌
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-1 rounded hover:bg-red-500/20 text-red-600 transition-colors"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            {note.category && (
              <span className="inline-block text-xs px-2 py-1 rounded bg-black/10 text-slate-700 mb-3">
                {note.category}
              </span>
            )}

            {/* Content */}
            {editingId === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full rounded text-slate-900 p-2 text-sm border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(note.id)}
                    className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs px-2 py-1 rounded bg-slate-400 text-slate-900 hover:bg-slate-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p
                className="text-sm text-slate-700 line-clamp-4 cursor-pointer hover:line-clamp-none"
                onClick={() => handleOpenDetail(note)}
              >
                {note.content}
              </p>
            )}

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-black/10 text-xs text-slate-600 flex justify-between">
              <span>{new Date(note.created_at).toLocaleDateString()}</span>
              <button
                onClick={() => handleOpenDetail(note)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          userId={userId}
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdate={handleUpdateNote}
        />
      )}
    </>
  )
}
