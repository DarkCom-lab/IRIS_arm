'use client'

import Link from 'next/link'

interface TasksOverviewProps {
  tasks: any[]
}

export default function TasksOverview({ tasks }: TasksOverviewProps) {
  const activeTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 5)
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high').length

  return (
    <div className="rounded-lg bg-slate-800 border border-slate-700 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Tasks</h2>
        <Link
          href="/tasks"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all →
        </Link>
      </div>

      {activeTasks.length === 0 ? (
        <p className="text-slate-400">No active tasks. Create one to get started!</p>
      ) : (
        <div className="space-y-3">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg bg-slate-700 p-3 border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-white">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block text-xs px-2 py-1 bg-slate-600 rounded text-slate-200">
                      {task.priority}
                    </span>
                    {task.category && (
                      <span className="inline-block text-xs px-2 py-1 bg-slate-600 rounded text-slate-200">
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {highPriorityTasks > 0 && (
        <p className="mt-4 text-sm text-orange-400">
          ⚠️ {highPriorityTasks} high priority tasks
        </p>
      )}
    </div>
  )
}
