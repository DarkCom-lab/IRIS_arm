'use client'

import Link from 'next/link'

interface RemindersOverviewProps {
  reminders: any[]
}

export default function RemindersOverview({ reminders }: RemindersOverviewProps) {
  const upcomingReminders = reminders.slice(0, 5)

  return (
    <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Reminders</h2>
        <Link
          href="/notes"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all →
        </Link>
      </div>

      {upcomingReminders.length === 0 ? (
        <p className="text-slate-400 text-sm">No upcoming reminders</p>
      ) : (
        <div className="space-y-2">
          {upcomingReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="rounded-lg bg-slate-700 p-3 border-l-4 border-yellow-500"
            >
              <p className="font-medium text-white text-sm">{reminder.title}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(reminder.reminder_date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
