'use client'

import { useState } from 'react'

interface EmailModalProps {
  email: any
  isOpen: boolean
  onClose: () => void
  onMarkAsRead: () => void
  onToggleStar: () => void
  onDelete: () => void
}

export default function EmailModal({
  email,
  isOpen,
  onClose,
  onMarkAsRead,
  onToggleStar,
  onDelete,
}: EmailModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white mb-1 break-words">{email.subject}</h2>
            <p className="text-sm text-slate-400 break-words">{email.sender}</p>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(email.received_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl flex-shrink-0"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Action buttons */}
        <div className="border-b border-slate-700 p-4 flex gap-2 flex-wrap">
          {!email.is_read && (
            <button
              onClick={onMarkAsRead}
              className="px-3 py-1.5 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Mark as Read
            </button>
          )}
          <button
            onClick={onToggleStar}
            className="px-3 py-1.5 rounded text-sm bg-slate-700 text-white hover:bg-slate-600 transition-colors"
          >
            {email.is_starred ? '⭐ Unstar' : '☆ Star'}
          </button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-1.5 rounded text-sm bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
            >
              🗑️ Delete
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onDelete}
                className="px-3 py-1.5 rounded text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 rounded text-sm bg-slate-700 text-white hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Email body */}
        <div className="p-6 prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-slate-300 font-sans text-sm">
            {email.body || email.preview}
          </div>
        </div>
      </div>
    </div>
  )
}
