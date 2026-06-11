'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/dashboard/Navigation'
import TasksOverview from '@/components/dashboard/TasksOverview'
import HabitsOverview from '@/components/dashboard/HabitsOverview'
import NotesOverview from '@/components/dashboard/NotesOverview'
import RemindersOverview from '@/components/dashboard/RemindersOverview'

interface DashboardContentProps {
  user: any
  tasks: any[]
  habits: any[]
  notes: any[]
  reminders: any[]
}

export default function DashboardContent({
  user,
  tasks,
  habits,
  notes,
  reminders,
}: DashboardContentProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const activeTasks = tasks.filter((t) => t.status !== 'completed').length
  const upcomingTasks = tasks.filter((t) => t.due_date).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation user={user} onSignOut={handleSignOut} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.email?.split('@')[0]}!</h1>
          <p className="mt-2 text-slate-400">Here's your productivity overview</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-800 p-4 border border-slate-700">
            <p className="text-sm font-medium text-slate-400">Active Tasks</p>
            <p className="mt-2 text-3xl font-bold text-white">{activeTasks}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4 border border-slate-700">
            <p className="text-sm font-medium text-slate-400">Completed Today</p>
            <p className="mt-2 text-3xl font-bold text-white">{completedTasks}</p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4 border border-slate-700">
            <p className="text-sm font-medium text-slate-400">Habits Tracked</p>
            <p className="mt-2 text-3xl font-bold text-white">{habits.length}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <TasksOverview tasks={tasks} />
            <HabitsOverview habits={habits} />
          </div>

          <div className="space-y-8">
            <RemindersOverview reminders={reminders} />
            <NotesOverview notes={notes} />
          </div>
        </div>
      </main>
    </div>
  )
}
