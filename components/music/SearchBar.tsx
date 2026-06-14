'use client'

import { useState } from 'react'

interface SearchBarProps {
  playlistId: string | null
  onTrackAdded: () => void
}

export default function SearchBar({ playlistId, onTrackAdded }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      // Mock search results - in production, integrate with YouTube Data API
      const mockResults = [
        {
          id: 'dQw4w9WgXcQ',
          title: 'Never Gonna Give You Up',
          artist: 'Rick Astley',
          duration: 213,
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg',
        },
        {
          id: '9bZkp7q19f0',
          title: 'Bohemian Rhapsody',
          artist: 'Queen',
          duration: 354,
          thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/default.jpg',
        },
      ]
      setSearchResults(mockResults)
    } catch (error) {
      console.error('[v0] Search error:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleAddTrack = async (result: any) => {
    if (!playlistId) return

    try {
      const response = await fetch('/api/music/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          playlistId,
          youtubeId: result.id,
          title: result.title,
          artist: result.artist,
          durationSeconds: result.duration,
          thumbnailUrl: result.thumbnail,
        }),
      })

      if (!response.ok) throw new Error('Failed to add track')
      setSearchQuery('')
      setSearchResults([])
      onTrackAdded()
    } catch (error) {
      console.error('[v0] Error adding track:', error)
    }
  }

  return (
    <div className="bg-slate-900 border-b border-border p-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search YouTube music..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 max-h-80 overflow-auto">
            {searchResults.map((result) => (
              <div key={result.id} className="flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-b-0">
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{result.title}</div>
                  <div className="text-xs text-slate-400 truncate">{result.artist}</div>
                </div>
                <button
                  onClick={() => handleAddTrack(result)}
                  className="px-3 py-1 rounded text-sm bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
