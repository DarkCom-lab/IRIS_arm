'use client'

import { useState } from 'react'

interface PlaylistSidebarProps {
  playlists: any[]
  selectedPlaylistId: string | null
  onSelectPlaylist: (playlistId: string) => void
  onCreatePlaylist: (name: string, description?: string) => void
  onDeletePlaylist: (playlistId: string) => void
}

export default function PlaylistSidebar({
  playlists,
  selectedPlaylistId,
  onSelectPlaylist,
  onCreatePlaylist,
  onDeletePlaylist,
}: PlaylistSidebarProps) {
  const [showNewPlaylist, setShowNewPlaylist] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    if (newName.trim()) {
      onCreatePlaylist(newName)
      setNewName('')
      setShowNewPlaylist(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white mb-4">Playlists</h2>
        <button
          onClick={() => setShowNewPlaylist(!showNewPlaylist)}
          className="w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
        >
          + New Playlist
        </button>
      </div>

      {showNewPlaylist && (
        <div className="p-4 border-b border-slate-700 bg-slate-800">
          <input
            type="text"
            placeholder="Playlist name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex-1 px-2 py-1 rounded text-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create
            </button>
            <button
              onClick={() => setShowNewPlaylist(false)}
              className="flex-1 px-2 py-1 rounded text-sm bg-slate-700 text-white hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-2">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="flex items-center justify-between mb-2 group">
            <button
              onClick={() => onSelectPlaylist(playlist.id)}
              className={`flex-1 text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedPlaylistId === playlist.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="truncate font-medium">{playlist.name}</div>
              <div className="text-xs opacity-75">{playlist.track_count || 0} tracks</div>
            </button>
            <button
              onClick={() => onDeletePlaylist(playlist.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-xs text-red-400 hover:text-red-300 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
