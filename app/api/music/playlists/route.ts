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

    const { data: playlists, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ playlists })
  } catch (error) {
    console.error('[v0] Error fetching playlists:', error)
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 })
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

    const { action, name, description, playlistId, updates } = await request.json()

    if (action === 'create') {
      const { data, error } = await supabase
        .from('playlists')
        .insert([{ user_id: user.id, name, description }])
        .select()

      if (error) throw error
      return NextResponse.json({ playlist: data?.[0] })
    }

    if (action === 'update') {
      const { data, error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .select()

      if (error) throw error
      return NextResponse.json({ playlist: data?.[0] })
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId)
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[v0] Error managing playlists:', error)
    return NextResponse.json({ error: 'Failed to manage playlists' }, { status: 500 })
  }
}
