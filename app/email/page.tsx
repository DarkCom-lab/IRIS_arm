'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/dashboard/Navigation'
import EmailList from '@/components/email/EmailList'
import EmailModal from '@/components/email/EmailModal'

export const dynamic = 'force-dynamic'

export default function EmailPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [emails, setEmails] = useState<any[]>([])
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const initUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login')
        return
      }
      setUser(authUser)
      setUserId(authUser.id)
      await loadEmails()
    }
    initUser()
  }, [])

  const loadEmails = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/email?hours=24')
      if (!response.ok) throw new Error('Failed to load emails')
      const data = await response.json()
      setEmails(data.emails || [])
      setLastUpdated(new Date())
      const unread = data.emails?.filter((e: any) => !e.is_read).length || 0
      setUnreadCount(unread)
    } catch (error) {
      console.error('[v0] Error loading emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (emailId: string) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', messageId: emailId }),
      })
      if (!response.ok) throw new Error('Failed to mark email as read')
      await loadEmails()
    } catch (error) {
      console.error('[v0] Error marking email as read:', error)
    }
  }

  const handleToggleStar = async (emailId: string, currentStarred: boolean) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_star', messageId: emailId, starred: !currentStarred }),
      })
      if (!response.ok) throw new Error('Failed to toggle star')
      await loadEmails()
    } catch (error) {
      console.error('[v0] Error toggling star:', error)
    }
  }

  const handleDelete = async (emailId: string) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', messageId: emailId }),
      })
      if (!response.ok) throw new Error('Failed to delete email')
      await loadEmails()
      setSelectedEmail(null)
    } catch (error) {
      console.error('[v0] Error deleting email:', error)
    }
  }

  const handleRefresh = async () => {
    await loadEmails()
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
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Email</h1>
              <p className="text-muted-foreground">
                Messages from the last 24 hours ({unreadCount} unread)
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                ⟳ Refresh
              </button>
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-12 text-center">
              <p className="text-slate-400">Loading emails...</p>
            </div>
          ) : emails.length === 0 ? (
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-12 text-center">
              <p className="text-slate-400">No emails in the last 24 hours</p>
            </div>
          ) : (
            <EmailList
              emails={emails}
              onSelectEmail={setSelectedEmail}
              onMarkAsRead={handleMarkAsRead}
              onToggleStar={handleToggleStar}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <EmailModal
          email={selectedEmail}
          isOpen={!!selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onMarkAsRead={() => handleMarkAsRead(selectedEmail.id)}
          onToggleStar={() => handleToggleStar(selectedEmail.id, selectedEmail.is_starred)}
          onDelete={() => handleDelete(selectedEmail.id)}
        />
      )}
    </div>
  )
}
