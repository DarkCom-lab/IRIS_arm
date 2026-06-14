'use client'

import React, { createContext, useContext, useState } from 'react'

export interface Track {
  id: string
  youtube_id: string
  title: string
  artist?: string
  duration_seconds?: number
  thumbnail_url?: string
}

export interface MusicContextType {
  currentTrack: Track | null
  setCurrentTrack: (track: Track | null) => void
  queue: Track[]
  setQueue: (tracks: Track[]) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  currentTime: number
  setCurrentTime: (time: number) => void
  volume: number
  setVolume: (volume: number) => void
  isShuffled: boolean
  setIsShuffled: (shuffled: boolean) => void
  repeatMode: 'off' | 'all' | 'one'
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [queue, setQueue] = useState<Track[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')

  const value: MusicContextType = {
    currentTrack,
    setCurrentTrack,
    queue,
    setQueue,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    volume,
    setVolume,
    isShuffled,
    setIsShuffled,
    repeatMode,
    setRepeatMode,
  }

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusicContext() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusicContext must be used within MusicProvider')
  }
  return context
}
