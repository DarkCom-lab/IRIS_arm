'use client'

interface EmailListProps {
  emails: any[]
  onSelectEmail: (email: any) => void
  onMarkAsRead: (emailId: string) => void
  onToggleStar: (emailId: string, currentStarred: boolean) => void
  onDelete: (emailId: string) => void
}

export default function EmailList({
  emails,
  onSelectEmail,
  onMarkAsRead,
  onToggleStar,
  onDelete,
}: EmailListProps) {
  const handleEmailClick = (email: any) => {
    if (!email.is_read) {
      onMarkAsRead(email.id)
    }
    onSelectEmail(email)
  }

  return (
    <div className="space-y-2">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`rounded-lg border transition-all cursor-pointer p-4 hover:bg-slate-700/50 ${
            email.is_read
              ? 'border-slate-700 bg-slate-800/30'
              : 'border-slate-600 bg-slate-800 shadow-md'
          }`}
          onClick={() => handleEmailClick(email)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Status indicators */}
              <div className="flex flex-col gap-2 mt-1">
                {!email.is_read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleStar(email.id, email.is_starred)
                  }}
                  className="text-lg hover:scale-110 transition-transform"
                  title={email.is_starred ? 'Unstar' : 'Star'}
                >
                  {email.is_starred ? '⭐' : '☆'}
                </button>
              </div>

              {/* Email content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold truncate ${!email.is_read ? 'text-white' : 'text-slate-300'}`}>
                    {email.sender}
                  </h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(email.received_at).toLocaleString()}
                  </span>
                </div>
                <p className={`text-sm mb-1 truncate ${!email.is_read ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                  {email.subject}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {email.preview || email.body?.substring(0, 100)}
                </p>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(email.id)
              }}
              className="p-2 rounded hover:bg-red-500/20 text-red-500 transition-colors flex-shrink-0"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
