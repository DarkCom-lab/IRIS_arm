'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getTasks, getHabits, getNotes, getReminders } from '@/lib/supabase/queries'
import DashboardContent from '@/components/dashboard/DashboardContent'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [habits, setHabits] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      try {
        const [tasksData, habitsData, notesData, remindersData] = await Promise.all([
          getTasks(user.id),
          getHabits(user.id),
          getNotes(user.id),
          getReminders(user.id),
        ])

        setTasks(tasksData || [])
        setHabits(habitsData || [])
        setNotes(notesData || [])
        setReminders(remindersData || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-slate-300">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardContent
      user={user}
      tasks={tasks}
      habits={habits}
      notes={notes}
      reminders={reminders}
    />
  )
}
