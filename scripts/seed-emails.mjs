import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const mockEmails = [
  {
    email_id: '1',
    sender: 'John Doe',
    sender_email: 'john@example.com',
    subject: 'Project Update - Q1 Goals',
    preview: 'Hi, I wanted to update you on the Q1 project goals and timeline...',
    body: 'Hi,\n\nI wanted to update you on the Q1 project goals and timeline. We have made significant progress on the core features and are on track for the scheduled release.\n\nBest regards,\nJohn',
  },
  {
    email_id: '2',
    sender: 'Sarah Smith',
    sender_email: 'sarah@example.com',
    subject: 'Meeting Scheduled for Tomorrow at 2 PM',
    preview: 'The meeting has been scheduled for tomorrow at 2 PM EST. Please check your calendar...',
    body: 'Hi,\n\nThe meeting has been scheduled for tomorrow at 2 PM EST. Please check your calendar and let me know if there are any conflicts.\n\nThanks,\nSarah',
  },
  {
    email_id: '3',
    sender: 'Alex Johnson',
    sender_email: 'alex@example.com',
    subject: 'Your Weekly Report is Ready',
    preview: 'Your weekly report has been generated and is ready for review. Click here to view...',
    body: 'Hi,\n\nYour weekly report has been generated and is ready for review. This week shows a 15% improvement in productivity metrics.\n\nBest,\nAlex',
  },
  {
    email_id: '4',
    sender: 'Emily Watson',
    sender_email: 'emily@example.com',
    subject: 'Feedback on Your Proposal',
    preview: 'Great work on the proposal! I have some feedback and suggestions for improvement...',
    body: 'Hi,\n\nGreat work on the proposal! I have reviewed it and have some feedback. Overall, the direction is solid, and I like the approach you have taken.\n\nLooking forward to discussing this further.\n\nBest regards,\nEmily',
  },
  {
    email_id: '5',
    sender: 'Mike Chen',
    sender_email: 'mike@example.com',
    subject: 'Action Items from Today\'s Standup',
    preview: 'Here are the action items we discussed in today\'s standup meeting...',
    body: 'Hi team,\n\nHere are the action items from today\'s standup:\n1. Complete feature implementation\n2. Update documentation\n3. Schedule review meeting\n\nPlease update your progress by EOD.\n\nThanks,\nMike',
  },
]

async function seedEmails() {
  try {
    // Get all users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) throw usersError
    
    if (users.length === 0) {
      console.log('No users found. Please create a user first.')
      return
    }

    const userId = users[0].id
    console.log(`Seeding emails for user: ${userId}`)

    // Generate emails from last 24 hours
    const now = new Date()
    const emails = mockEmails.map((email, index) => ({
      ...email,
      user_id: userId,
      received_at: new Date(now.getTime() - (index + 1) * 2 * 60 * 60 * 1000).toISOString(), // 2 hours apart
      is_read: index > 2, // First 3 unread
      is_starred: index === 0,
    }))

    // Insert emails
    const { data, error } = await supabase
      .from('email_messages')
      .insert(emails)
      .select()

    if (error) throw error
    
    console.log(`Successfully seeded ${data.length} emails`)
  } catch (error) {
    console.error('Error seeding emails:', error)
    process.exit(1)
  }
}

seedEmails()
