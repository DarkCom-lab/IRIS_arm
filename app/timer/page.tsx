'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getTimers, getTimerSessions } from '@/lib/supabase/queries'
import Navigation from '@/components/dashboard/Navigation'
import TimerForm from '@/components/timer/TimerForm'
import TimerList from '@/components/timer/TimerList'
import TimerHistory from '@/components/timer/TimerHistory'

export const dynamic = 'force-dynamic'

export default function TimerPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [timers, setTimers] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login')
        return
      }
      setUser(authUser)
      setUserId(authUser.id)
      await loadTimers(authUser.id)
    }
    getUser()
  }, [])

  const loadTimers = async (id: string) => {
    try {
      setLoading(true)
      const timerData = await getTimers(id)
      const sessionData = await getTimerSessions(id)
      setTimers(timerData || [])
      setSessions(sessionData || [])
    } catch (error) {
      console.error('[v0] Error loading timers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTimerCreated = async () => {
    if (userId) {
      await loadTimers(userId)
    }
  }

  const handleTimerDeleted = async () => {
    if (userId) {
      await loadTimers(userId)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!userId) return null

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navigation user={user} onSignOut={handleSignOut} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Timer</h1>
            <p className="text-muted-foreground">
              Manage your Pomodoro, countdown, and stopwatch timers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Timer Form */}
            <div className="lg:col-span-1">
              <TimerForm userId={userId} onTimerCreated={handleTimerCreated} />
            </div>

            {/* Timers and History */}
            <div className="lg:col-span-2">
              <div className="flex gap-4 mb-6 border-b border-border">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'active'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Active Timers
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  History
                </button>
              </div>

              {activeTab === 'active' ? (
                <TimerList
                  userId={userId}
                  timers={timers}
                  onTimerDeleted={handleTimerDeleted}
                />
              ) : (
                <TimerHistory sessions={sessions} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
