'use client'

interface HabitCardProps {
  habit: any
  onLog: () => void
  onDelete: () => void
}

export default function HabitCard({ habit, onLog, onDelete }: HabitCardProps) {
  return (
    <div
      className="rounded-lg p-6 border-2 text-white transition-all hover:shadow-lg"
      style={{ borderColor: habit.color, backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-4xl mb-2">{habit.icon}</div>
          <h3 className="text-lg font-bold">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-slate-400 mt-1">{habit.description}</p>
          )}
        </div>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-red-400 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 my-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Frequency</span>
          <span className="font-medium capitalize">{habit.frequency}</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-400">Streak</span>
            <span className="text-lg font-bold" style={{ color: habit.color }}>
              {habit.streak_count}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.min(habit.streak_count * 10, 100)}%`,
                backgroundColor: habit.color,
              }}
            ></div>
          </div>
        </div>

        {habit.best_streak > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Best Streak</span>
            <span className="font-medium">{habit.best_streak}</span>
          </div>
        )}
      </div>

      <button
        onClick={onLog}
        className="w-full mt-4 rounded-lg py-2 font-semibold transition-colors"
        style={{
          backgroundColor: habit.color,
          color: 'white',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = '0.8'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        Log Today
      </button>
    </div>
  )
}
