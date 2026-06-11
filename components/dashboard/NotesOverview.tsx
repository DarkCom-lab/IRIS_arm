'use client'

import Link from 'next/link'

interface NotesOverviewProps {
  notes: any[]
}

export default function NotesOverview({ notes }: NotesOverviewProps) {
  const pinnedNotes = notes.filter((n) => n.is_pinned).slice(0, 4)

  return (
    <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Notes</h2>
        <Link
          href="/notes"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all →
        </Link>
      </div>

      {pinnedNotes.length === 0 ? (
        <p className="text-slate-400 text-sm">No pinned notes</p>
      ) : (
        <div className="space-y-3">
          {pinnedNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg p-3 border border-slate-600"
              style={{ backgroundColor: note.color || '#1e293b' }}
            >
              <p className="font-medium text-white text-sm line-clamp-2">{note.title}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
