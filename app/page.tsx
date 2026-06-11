'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push('/dashboard')
      }
    }

    checkAuth()
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">FocusFlow</h1>
          <p className="text-xl text-slate-300">Productivity Platform</p>
        </div>

        <div className="space-y-3 pt-8">
          <p className="text-pretty text-sm leading-relaxed text-slate-400">
            Manage your tasks, build habits, take notes, and stay focused.
          </p>
        </div>

        <div className="flex w-full gap-3 pt-4">
          <button
            onClick={() => router.push('/auth/sign-up')}
            className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push('/auth/login')}
            className="flex-1 rounded-lg border border-slate-500 py-2 font-semibold text-slate-300 hover:text-white hover:border-slate-400 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </main>
  )
}
