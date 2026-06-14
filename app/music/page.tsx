'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/dashboard/Navigation'
import PlaylistSidebar from '@/components/music/PlaylistSidebar'
import SearchBar from '@/components/music/SearchBar'
import TracklistView from '@/components/music/TracklistView'
import MediaDock from '@/components/music/MediaDock'
import { MusicProvider } from '@/context/MusicContext'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function MusicPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
      await loadPlaylists()
    }
    initUser()
  }, [])

  const loadPlaylists = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/music/playlists')
      if (!response.ok) throw new Error('Failed to load playlists')
      const data = await response.json()
      setPlaylists(data.playlists || [])
      if (data.playlists?.length > 0 && !selectedPlaylistId) {
        setSelectedPlaylistId(data.playlists[0].id)
      }
    } catch (error) {
      console.error('[v0] Error loading playlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async (name: string, description?: string) => {
    try {
      const response = await fetch('/api/music/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', name, description }),
      })
      if (!response.ok) throw new Error('Failed to create playlist')
      await loadPlaylists()
    } catch (error) {
      console.error('[v0] Error creating playlist:', error)
    }
  }

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      const response = await fetch('/api/music/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', playlistId }),
      })
      if (!response.ok) throw new Error('Failed to delete playlist')
      if (selectedPlaylistId === playlistId) {
        setSelectedPlaylistId(playlists[0]?.id || null)
      }
      await loadPlaylists()
    } catch (error) {
      console.error('[v0] Error deleting playlist:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!userId) return null

  return (
    <MusicProvider>
      <div className="flex flex-col h-screen bg-background">
        <Navigation user={user} onSignOut={handleSignOut} />
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border bg-slate-900 overflow-auto">
            <PlaylistSidebar
              playlists={playlists}
              selectedPlaylistId={selectedPlaylistId}
              onSelectPlaylist={setSelectedPlaylistId}
              onCreatePlaylist={handleCreatePlaylist}
              onDeletePlaylist={handleDeletePlaylist}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <SearchBar playlistId={selectedPlaylistId} onTrackAdded={loadPlaylists} />
            <div className="flex-1 overflow-auto">
              {selectedPlaylistId && (
                <TracklistView playlistId={selectedPlaylistId} userId={userId} onUpdate={loadPlaylists} />
              )}
            </div>
          </div>
        </div>

        {/* Media Dock Player */}
        <MediaDock />
      </div>
    </MusicProvider>
  )
}
