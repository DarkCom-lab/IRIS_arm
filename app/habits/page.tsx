'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getHabits, createHabit, updateHabit, deleteHabit, logHabit } from '@/lib/supabase/queries'
import Navigation from '@/components/dashboard/Navigation'
import HabitForm from '@/components/habits/HabitForm'
import HabitCard from '@/components/habits/HabitCard'

export default function HabitsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [habits, setHabits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

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
        const habitsData = await getHabits(user.id)
        setHabits(habitsData || [])
      } catch (error) {
        console.error('Error loading habits:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleAddHabit = async (formData: any) => {
    if (!user) return

    try {
      const newHabit = await createHabit(
        user.id,
        formData.name,
        formData.frequency,
        formData.description,
        formData.color,
        formData.icon
      )

      if (newHabit) {
        setHabits([...habits, ...newHabit])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating habit:', error)
    }
  }

  const handleLogHabit = async (habitId: string) => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      await logHabit(user.id, habitId, today, 1)

      // Update habit streak
      const updatedHabits = habits.map((h) => {
        if (h.id === habitId) {
          return {
            ...h,
            streak_count: h.streak_count + 1,
            best_streak: Math.max(h.best_streak, h.streak_count + 1),
          }
        }
        return h
      })
      setHabits(updatedHabits)
    } catch (error) {
      console.error('Error logging habit:', error)
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (!user) return

    try {
      await deleteHabit(habitId, user.id)
      setHabits(habits.filter((h) => h.id !== habitId))
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation user={user} onSignOut={handleSignOut} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Habits</h1>
            <p className="mt-2 text-slate-400">Build consistent habits and track your progress</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            + New Habit
          </button>
        </div>

        {showForm && (
          <HabitForm
            onSubmit={handleAddHabit}
            onCancel={() => setShowForm(false)}
          />
        )}

        {habits.length === 0 ? (
          <div className="rounded-lg bg-slate-800 border border-slate-700 p-12 text-center">
            <p className="text-slate-400">No habits yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onLog={() => handleLogHabit(habit.id)}
                onDelete={() => handleDeleteHabit(habit.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
