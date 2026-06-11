'use client'

import Link from 'next/link'

interface HabitsOverviewProps {
  habits: any[]
}

export default function HabitsOverview({ habits }: HabitsOverviewProps) {
  const topHabits = habits.slice(0, 4)

  return (
    <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Your Habits</h2>
        <Link
          href="/habits"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all →
        </Link>
      </div>

      {topHabits.length === 0 ? (
        <p className="text-slate-400">No habits yet. Start building new ones!</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {topHabits.map((habit) => (
            <div
              key={habit.id}
              className="rounded-lg bg-slate-700 p-4 border-l-4"
              style={{ borderColor: habit.color || '#3B82F6' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-white">{habit.name}</p>
                  <p className="text-xs text-slate-400 mt-1 capitalize">{habit.frequency}</p>
                </div>
                <span className="text-2xl">{habit.icon}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(habit.streak_count * 10, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-white">{habit.streak_count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
