'use client'

interface TimerHistoryProps {
  sessions: any[]
}

export default function TimerHistory({ sessions }: TimerHistoryProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No completed sessions yet. Start a timer to see history!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="bg-card border border-border rounded-lg p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{session.name}</h3>
              <p className="text-sm text-muted-foreground capitalize mt-1">
                {session.timer_type}
              </p>
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>Duration: {formatTime(session.duration_seconds)}</span>
                {session.actual_duration_seconds && (
                  <span>
                    Actual: {formatTime(session.actual_duration_seconds)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-sm font-medium ${
                  session.completed ? 'text-green-600' : 'text-amber-600'
                }`}
              >
                {session.completed ? '✓ Completed' : 'Pending'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {session.created_at && formatDate(session.created_at)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
