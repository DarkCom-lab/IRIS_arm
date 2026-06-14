'use server'

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const playlistId = request.nextUrl.searchParams.get('playlistId')

    if (!playlistId) {
      return NextResponse.json({ error: 'playlistId is required' }, { status: 400 })
    }

    const { data: tracks, error } = await supabase
      .from('playlist_tracks')
      .select('*, track:tracks(*)')
      .eq('playlist_id', playlistId)
      .eq('user_id', user.id)
      .order('position', { ascending: true })

    if (error) throw error

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error('[v0] Error fetching tracks:', error)
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, playlistId, youtubeId, title, artist, durationSeconds, thumbnailUrl, trackId, position } =
      await request.json()

    if (action === 'add') {
      // First, create or get the track
      let track = await supabase
        .from('tracks')
        .select('id')
        .eq('user_id', user.id)
        .eq('youtube_id', youtubeId)
        .single()

      let trackId: string

      if (!track.data) {
        const { data: newTrack, error: trackError } = await supabase
          .from('tracks')
          .insert([
            {
              user_id: user.id,
              youtube_id: youtubeId,
              title,
              artist,
              duration_seconds: durationSeconds,
              thumbnail_url: thumbnailUrl,
            },
          ])
          .select()

        if (trackError) throw trackError
        trackId = newTrack?.[0]?.id
      } else {
        trackId = track.data.id
      }

      // Get the next position
      const { data: lastTrack } = await supabase
        .from('playlist_tracks')
        .select('position')
        .eq('playlist_id', playlistId)
        .eq('user_id', user.id)
        .order('position', { ascending: false })
        .limit(1)
        .single()

      const nextPosition = (lastTrack?.position ?? -1) + 1

      // Add to playlist
      const { data: playlistTrack, error: addError } = await supabase
        .from('playlist_tracks')
        .insert([
          {
            playlist_id: playlistId,
            track_id: trackId,
            user_id: user.id,
            position: nextPosition,
          },
        ])
        .select()

      if (addError) throw addError
      return NextResponse.json({ playlistTrack: playlistTrack?.[0] })
    }

    if (action === 'remove') {
      const { error } = await supabase
        .from('playlist_tracks')
        .delete()
        .eq('id', trackId)
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (action === 'reorder') {
      const { data, error } = await supabase
        .from('playlist_tracks')
        .update({ position })
        .eq('id', trackId)
        .eq('user_id', user.id)
        .select()

      if (error) throw error
      return NextResponse.json({ playlistTrack: data?.[0] })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[v0] Error managing tracks:', error)
    return NextResponse.json({ error: 'Failed to manage tracks' }, { status: 500 })
  }
}
