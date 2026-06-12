'use server'

import { createClient } from './server'

// Task queries
export async function getTasks(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createTask(
  userId: string,
  title: string,
  description?: string,
  priority?: string,
  category?: string,
  dueDate?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        user_id: userId,
        title,
        description,
        priority: priority || 'medium',
        category,
        due_date: dueDate,
      },
    ])
    .select()

  if (error) throw error
  return data
}

export async function updateTask(
  taskId: string,
  userId: string,
  updates: Record<string, any>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()

  if (error) throw error
  return data
}

export async function deleteTask(taskId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId)

  if (error) throw error
}

// Habit queries
export async function getHabits(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createHabit(
  userId: string,
  name: string,
  frequency: string,
  description?: string,
  color?: string,
  icon?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('habits')
    .insert([
      {
        user_id: userId,
        name,
        frequency,
        description,
        color: color || '#3B82F6',
        icon: icon || 'star',
      },
    ])
    .select()

  if (error) throw error
  return data
}

export async function updateHabit(
  habitId: string,
  userId: string,
  updates: Record<string, any>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habitId)
    .eq('user_id', userId)
    .select()

  if (error) throw error
  return data
}

export async function deleteHabit(habitId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', userId)

  if (error) throw error
}

// Habit log queries
export async function getHabitLogs(userId: string, habitId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)

  if (habitId) {
    query = query.eq('habit_id', habitId)
  }

  const { data, error } = await query.order('logged_date', { ascending: false })

  if (error) throw error
  return data
}

export async function logHabit(
  userId: string,
  habitId: string,
  loggedDate: string,
  count: number = 1,
  notes?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('habit_logs')
    .insert([
      {
        user_id: userId,
        habit_id: habitId,
        logged_date: loggedDate,
        count,
        notes,
      },
    ])
    .select()

  if (error) throw error
  return data
}

// Note queries
export async function getNotes(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createNote(
  userId: string,
  title: string,
  content: string,
  category?: string,
  color?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        user_id: userId,
        title,
        content,
        category,
        color: color || '#FFFFFF',
      },
    ])
    .select()

  if (error) throw error
  return data
}

export async function updateNote(
  noteId: string,
  userId: string,
  updates: Record<string, any>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .eq('user_id', userId)
    .select()

  if (error) throw error
  return data
}

export async function deleteNote(noteId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', userId)

  if (error) throw error
}

// Reminder queries
export async function getReminders(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .eq('is_completed', false)
    .order('reminder_date', { ascending: true })

  if (error) throw error
  return data
}

export async function createReminder(
  userId: string,
  title: string,
  reminderDate: string,
  noteId?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reminders')
    .insert([
      {
        user_id: userId,
        title,
        reminder_date: reminderDate,
        note_id: noteId,
      },
    ])
    .select()

  if (error) throw error
  return data
}

export async function updateReminder(
  reminderId: string,
  userId: string,
  updates: Record<string, any>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reminders')
    .update(updates)
    .eq('id', reminderId)
    .eq('user_id', userId)
    .select()

  if (error) throw error
  return data
}

export async function deleteReminder(reminderId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', reminderId)
    .eq('user_id', userId)

  if (error) throw error
}

// Get reminders for a specific note
export async function getRemindersForNote(userId: string, noteId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .eq('note_id', noteId)
    .order('reminder_date', { ascending: true })

  if (error) throw error
  return data
}

// Timer queries
export async function getTimers(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('timers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createTimer(
  userId: string,
  name: string,
  durationSeconds: number,
  timerType: 'pomodoro' | 'countdown' | 'stopwatch'
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('timers')
    .insert([
      {
        user_id: userId,
        name,
        duration_seconds: durationSeconds,
        timer_type: timerType,
      },
    ])
    .select()

  if (error) throw error
  return data
}

export async function updateTimer(
  timerId: string,
  userId: string,
  updates: Record<string, any>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('timers')
    .update(updates)
    .eq('id', timerId)
    .eq('user_id', userId)
    .select()

  if (error) throw error
  return data
}

export async function deleteTimer(timerId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('timers')
    .delete()
    .eq('id', timerId)
    .eq('user_id', userId)

  if (error) throw error
}

// Timer session queries
export async function getTimerSessions(userId: string, limit: number = 20) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('timer_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function createTimerSession(
  userId: string,
  name: string,
  timerType: string,
  durationSeconds: number,
  timerId?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('timer_sessions')
    .insert([
      {
        user_id: userId,
        timer_id: timerId,
        name,
        timer_type: timerType,
        duration_seconds: durationSeconds,
      },
    ])
    .select()

  if (error) throw error
  return data
}

export async function completeTimerSession(
  sessionId: string,
  userId: string,
  actualDurationSeconds: number
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('timer_sessions')
    .update({
      completed: true,
      actual_duration_seconds: actualDurationSeconds,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select()

  if (error) throw error
  return data
}

// Email queries
export async function getEmailMessages(userId: string, hoursBack: number = 24) {
  const supabase = await createClient()
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('email_messages')
    .select('*')
    .eq('user_id', userId)
    .gte('received_at', since)
    .order('received_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createEmailMessage(
  userId: string,
  emailId: string,
  sender: string,
  senderEmail: string,
  subject: string,
  preview: string,
  body: string,
  receivedAt: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('email_messages')
    .insert([
      {
        user_id: userId,
        email_id: emailId,
        sender,
        sender_email: senderEmail,
        subject,
        preview,
        body,
        received_at: receivedAt,
      },
    ])
    .select()

  if (error) throw error
  return data
}

export async function updateEmailMessage(
  messageId: string,
  userId: string,
  updates: Record<string, any>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('email_messages')
    .update(updates)
    .eq('id', messageId)
    .eq('user_id', userId)
    .select()

  if (error) throw error
  return data
}

export async function deleteEmailMessage(messageId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('email_messages')
    .delete()
    .eq('id', messageId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function markEmailAsRead(messageId: string, userId: string) {
  return updateEmailMessage(messageId, userId, { is_read: true })
}

export async function markEmailAsStarred(messageId: string, userId: string, starred: boolean) {
  return updateEmailMessage(messageId, userId, { is_starred: starred })
}
