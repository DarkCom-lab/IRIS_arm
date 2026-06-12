'use client'

interface TimerCardProps {
  timer: any
  timerState: any
  isExpanded: boolean
  onToggle: () => void
  onReset: () => void
  onDelete: () => void
  onExpand: () => void
}

export default function TimerCard({
  timer,
  timerState,
  isExpanded,
  onToggle,
  onReset,
  onDelete,
  onExpand,
}: TimerCardProps) {
  const elapsed = timerState?.elapsed || 0
  const total = timer.duration_seconds || 0
  const remaining = Math.max(0, total - elapsed)

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const progress = total > 0 ? (elapsed / total) * 100 : 0
  const isRunning = timerState?.isRunning

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{timer.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{timer.timer_type}</p>
        </div>
        <button
          onClick={onExpand}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="text-5xl font-bold text-primary text-center font-mono mb-4">
          {formatTime(remaining)}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-background rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${
              isRunning ? 'bg-primary' : 'bg-muted'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatTime(elapsed)} elapsed</span>
          <span>{formatTime(total)} total</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`flex-1 py-2 rounded-md font-medium transition-colors ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors"
        >
          Reset
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md font-medium transition-colors"
        >
          Delete
        </button>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="text-foreground font-medium capitalize">
                {isRunning ? 'Running' : 'Paused'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Progress</p>
              <p className="text-foreground font-medium">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
