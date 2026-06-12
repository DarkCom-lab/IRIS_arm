import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hoursBack = request.nextUrl.searchParams.get('hours') || '24'
    const since = new Date(Date.now() - Number(hoursBack) * 60 * 60 * 1000).toISOString()

    const { data: emails, error } = await supabase
      .from('email_messages')
      .select('*')
      .eq('user_id', user.id)
      .gte('received_at', since)
      .order('received_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ emails })
  } catch (error) {
    console.error('[v0] Error in GET /api/email:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
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

    const body = await request.json()
    const { action, ...data } = body

    if (action === 'mark_read') {
      const { error } = await supabase
        .from('email_messages')
        .update({ is_read: true })
        .eq('id', data.messageId)
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (action === 'toggle_star') {
      const { error } = await supabase
        .from('email_messages')
        .update({ is_starred: data.starred })
        .eq('id', data.messageId)
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('email_messages')
        .delete()
        .eq('id', data.messageId)
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('[v0] Error in POST /api/email:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
