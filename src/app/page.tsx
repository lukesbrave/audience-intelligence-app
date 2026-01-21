import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_completed_onboarding')
    .eq('id', user.id)
    .single()

  if (!profile?.has_completed_onboarding) {
    redirect('/onboarding')
  }

  // User has completed onboarding, check if they have reports
  const { data: userRecord } = await supabase
    .from('users')
    .select('id')
    .eq('email', user.email?.toLowerCase())
    .single()

  if (userRecord) {
    const { data: reports } = await supabase
      .from('reports')
      .select('id')
      .eq('user_id', userRecord.id)
      .limit(1)

    if (reports && reports.length > 0) {
      redirect('/dashboard')
    }
  }

  // No reports yet, go to new research
  redirect('/research')
}
