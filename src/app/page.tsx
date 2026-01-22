import { redirect } from 'next/navigation'

export default function HomePage() {
  // No auth - redirect to onboarding where users enter their email
  redirect('/onboarding')
}
