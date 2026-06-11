'use client'

interface TaskListProps {
  tasks: any[]
  onUpdate: (taskId: string, updates: any) => void
  onDelete: (taskId: string) => void
}

export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600'
      case 'medium':
        return 'bg-yellow-600'
      case 'low':
        return 'bg-green-600'
      default:
        return 'bg-slate-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'in-progress':
        return 'text-blue-400'
      default:
        return 'text-slate-400'
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg bg-slate-800 border border-slate-700 p-12 text-center">
        <p className="text-slate-400">No tasks yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-lg bg-slate-800 border border-slate-700 p-4 hover:border-slate-600 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={(e) =>
                    onUpdate(task.id, {
                      status: e.target.checked ? 'completed' : 'todo',
                    })
                  }
                  className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                />
                <h3
                  className={`text-lg font-medium ${
                    task.status === 'completed'
                      ? 'line-through text-slate-400'
                      : 'text-white'
                  }`}
                >
                  {task.title}
                </h3>
              </div>

              {task.description && (
                <p className="mt-2 ml-8 text-slate-400">{task.description}</p>
              )}

              <div className="mt-3 ml-8 flex flex-wrap gap-2">
                <span className={`inline-block text-xs px-2 py-1 rounded text-white font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`inline-block text-xs px-2 py-1 rounded font-medium border ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </span>
                {task.category && (
                  <span className="inline-block text-xs px-2 py-1 rounded text-slate-300 bg-slate-700">
                    {task.category}
                  </span>
                )}
                {task.due_date && (
                  <span className="inline-block text-xs px-2 py-1 rounded text-slate-300 bg-slate-700">
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onDelete(task.id)}
              className="text-slate-400 hover:text-red-400 transition-colors p-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
