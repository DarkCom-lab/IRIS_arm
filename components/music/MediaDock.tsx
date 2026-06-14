'use client'

import { useMusicContext } from '@/context/MusicContext'

export default function MediaDock() {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    repeatMode,
    setRepeatMode,
    isShuffled,
    setIsShuffled,
  } = useMusicContext()

  if (!currentTrack) {
    return (
      <div className="bg-slate-900 border-t border-border p-4 text-center text-slate-400">
        Select a track to start playing
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border-t border-border p-4">
      <div className="flex items-center gap-4 max-w-6xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={currentTrack.thumbnail_url || 'https://via.placeholder.com/50'}
            alt={currentTrack.title}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-medium text-white truncate">{currentTrack.title}</div>
            <div className="text-sm text-slate-400 truncate">{currentTrack.artist || 'Unknown'}</div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`p-2 rounded text-sm transition-colors ${
              isShuffled ? 'text-primary' : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            🔀
          </button>

          <button className="p-2 rounded text-slate-400 hover:text-white" title="Previous">
            ⏮
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          <button className="p-2 rounded text-slate-400 hover:text-white" title="Next">
            ⏭
          </button>

          <button
            onClick={() => {
              const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one']
              const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length
              setRepeatMode(modes[nextIndex])
            }}
            className={`p-2 rounded text-sm transition-colors ${
              repeatMode !== 'off' ? 'text-primary' : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            🔁 {repeatMode !== 'off' ? repeatMode : ''}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-slate-400">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="w-24 accent-primary"
          />
        </div>
      </div>
    </div>
  )
}
