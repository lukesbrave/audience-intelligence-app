import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface Report {
  id: string
  name: string
  created_at: string
  response_data: {
    success?: boolean
    onboardingData?: {
      audienceSummary?: string
    }
    report?: {
      audienceProfile?: {
        demographics?: {
          overview?: string
        }
      }
    }
  } | null
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user needs onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_completed_onboarding')
    .eq('id', user.id)
    .single()

  if (!profile?.has_completed_onboarding) {
    redirect('/onboarding')
  }

  // Get user's email to fetch reports
  const { data: userRecord } = await supabase
    .from('users')
    .select('id')
    .eq('email', user.email?.toLowerCase())
    .single()

  // Fetch user's reports
  const { data: reports } = userRecord
    ? await supabase
        .from('reports')
        .select('id, name, created_at, response_data')
        .eq('user_id', userRecord.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const getReportStatus = (report: Report) => {
    if (!report.response_data) return 'pending'
    if (report.response_data.success) return 'complete'
    return 'error'
  }

  const getAudienceSummary = (report: Report) => {
    if (!report.response_data) return 'Research Report'

    // Check onboarding data first
    if (report.response_data.onboardingData?.audienceSummary) {
      return report.response_data.onboardingData.audienceSummary
    }

    // Fallback to demographics overview
    if (report.response_data.report?.audienceProfile?.demographics?.overview) {
      return report.response_data.report.audienceProfile.demographics.overview
    }

    return report.name || 'Research Report'
  }

  return (
    <div className="min-h-screen bg-[#1a2744] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Research</h1>
            <p className="text-gray-400 mt-1">View and manage your audience intelligence reports</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/research"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Research
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {reports && reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => {
              const status = getReportStatus(report)
              return (
                <Link
                  key={report.id}
                  href={`/research/history/${report.id}`}
                  className="block bg-[#243351] rounded-xl p-6 border border-white/10 hover:border-teal-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-medium truncate">
                        {getAudienceSummary(report)}
                      </h2>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(report.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm flex-shrink-0 ml-4 ${
                      status === 'complete'
                        ? 'bg-green-500/20 text-green-400'
                        : status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {status === 'complete' ? 'Complete' : status === 'pending' ? 'In Progress' : 'Error'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-[#243351] rounded-xl p-12 border border-white/10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No research yet</h3>
            <p className="text-gray-400 mb-6">Start your first audience research to get deep insights.</p>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start Research
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
