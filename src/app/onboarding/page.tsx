import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OnboardingContainer } from '@/components/features/onboarding'

export default async function OnboardingPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if already completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_completed_onboarding')
    .eq('id', user.id)
    .single()

  if (profile?.has_completed_onboarding) {
    redirect('/dashboard')
  }

  return <OnboardingContainer userId={user.id} userEmail={user.email || ''} />
}
