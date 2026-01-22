import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // Without auth, we can't personalize the dashboard
  // Redirect to onboarding to start fresh research
  redirect('/onboarding')
}
