'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getNotes, createNote, updateNote, deleteNote } from '@/lib/supabase/queries'
import Navigation from '@/components/dashboard/Navigation'
import NoteForm from '@/components/notes/NoteForm'
import NoteGrid from '@/components/notes/NoteGrid'

export default function NotesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
        const notesData = await getNotes(user.id)
        setNotes(notesData || [])
      } catch (error) {
        console.error('Error loading notes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleAddNote = async (formData: any) => {
    if (!user) return

    try {
      const newNote = await createNote(
        user.id,
        formData.title,
        formData.content,
        formData.category,
        formData.color
      )

      if (newNote) {
        setNotes([...newNote, ...notes])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const handleUpdateNote = async (noteId: string, updates: any) => {
    if (!user) return

    try {
      await updateNote(noteId, user.id, updates)
      const updatedNotes = notes.map((n) =>
        n.id === noteId ? { ...n, ...updates } : n
      )
      setNotes(updatedNotes)
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return

    try {
      await deleteNote(noteId, user.id)
      setNotes(notes.filter((n) => n.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Notes</h1>
            <p className="mt-2 text-slate-400">Capture your ideas and thoughts</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            + New Note
          </button>
        </div>

        {showForm && (
          <NoteForm
            onSubmit={handleAddNote}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <NoteGrid
          notes={filteredNotes}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
        />
      </main>
    </div>
  )
}
