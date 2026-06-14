'use client'

import { useEffect, useState } from 'react'
import { useMusicContext } from '@/context/MusicContext'

interface TracklistViewProps {
  playlistId: string
  userId: string
  onUpdate: () => void
}

export default function TracklistView({ playlistId, userId, onUpdate }: TracklistViewProps) {
  const [tracks, setTracks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { setQueue, setCurrentTrack, currentTrack } = useMusicContext()

  useEffect(() => {
    loadTracks()
  }, [playlistId])

  const loadTracks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/music/tracks?playlistId=${playlistId}`)
      if (!response.ok) throw new Error('Failed to load tracks')
      const data = await response.json()
      setTracks(data.tracks || [])
    } catch (error) {
      console.error('[v0] Error loading tracks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveTrack = async (playlistTrackId: string) => {
    try {
      const response = await fetch('/api/music/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', trackId: playlistTrackId }),
      })
      if (!response.ok) throw new Error('Failed to remove track')
      await loadTracks()
      onUpdate()
    } catch (error) {
      console.error('[v0] Error removing track:', error)
    }
  }

  const handlePlayTrack = (track: any) => {
    setCurrentTrack(track.track)
    setQueue(tracks.map((t) => t.track))
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading tracks...</div>
  }

  if (tracks.length === 0) {
    return <div className="p-8 text-center text-slate-400">No tracks in this playlist. Search and add some music!</div>
  }

  return (
    <div className="p-6">
      <div className="space-y-2">
        {tracks.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-colors group cursor-pointer ${
              currentTrack?.youtube_id === item.track.youtube_id ? 'bg-slate-700' : ''
            }`}
            onClick={() => handlePlayTrack(item)}
          >
            <img
              src={item.track.thumbnail_url || 'https://via.placeholder.com/50'}
              alt={item.track.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{item.track.title}</div>
              <div className="text-sm text-slate-400 truncate">{item.track.artist || 'Unknown Artist'}</div>
            </div>
            <div className="text-sm text-slate-400 whitespace-nowrap">
              {item.track.duration_seconds ? `${Math.floor(item.track.duration_seconds / 60)}:${String(item.track.duration_seconds % 60).padStart(2, '0')}` : '-:--'}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveTrack(item.id)
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-300 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
