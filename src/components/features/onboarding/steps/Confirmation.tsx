'use client'

interface OnboardingState {
  email: string
  selectedPath: 'direct' | 'discovery' | null
  businessDescription: string
  idealClientDescription: string
  introspection: {
    biggestChallenge: string
    biggestTrauma: string
    proudestAchievement: string
    whoComesToYou: string
    questionsTheyAsk: string
    passionateAbout: string
    firesYouUp: string
    pissesYouOff: string
    lightsUpInConversation: string
    loveToDoAnyway: string
  }
  audienceSuggestions: Array<{
    id: string
    title: string
    description: string
  }>
  selectedAudienceId: string | null
  customAudienceDescription: string
}

interface ConfirmationProps {
  state: OnboardingState
  onBack: () => void
  onComplete: () => void
  isSubmitting: boolean
}

export default function Confirmation({
  state,
  onBack,
  onComplete,
  isSubmitting
}: ConfirmationProps) {
  const getAudienceSummary = () => {
    if (state.selectedPath === 'direct') {
      return state.idealClientDescription
    }

    if (state.customAudienceDescription) {
      return state.customAudienceDescription
    }

    const selectedAudience = state.audienceSuggestions.find(
      (s) => s.id === state.selectedAudienceId
    )
    return selectedAudience?.title || 'Your ideal audience'
  }

  return (
    <div className="bg-[#141414] rounded-xl p-8 border border-white/10">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-[var(--color-brave-600)]/20 text-[var(--color-brave-500)] text-sm rounded-full mb-3">
          Ready to Launch
        </span>
        <h1 className="text-2xl font-bold text-white mb-2">
          Let&apos;s run your deep research
        </h1>
        <p className="text-gray-400">
          We&apos;ll analyze your audience and create a comprehensive intelligence report.
        </p>
      </div>

      <div className="bg-[#0a0a0a] rounded-lg p-6 mb-8 border border-white/5">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
          Delivery Email
        </h3>
        <p className="text-white mb-6">{state.email}</p>

        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
          Your Target Audience
        </h3>
        <p className="text-white">{getAudienceSummary()}</p>

        {state.selectedPath === 'direct' && (
          <>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mt-6 mb-3">
              Your Business
            </h3>
            <p className="text-white">{state.businessDescription}</p>
          </>
        )}
      </div>

      <div className="bg-gradient-to-r from-[var(--color-brave-600)]/10 to-[var(--color-brave-500)]/10 rounded-lg p-6 mb-8 border border-[var(--color-brave-500)]/20">
        <h3 className="text-white font-medium mb-3">What you&apos;ll get:</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-[var(--color-brave-500)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Deep audience profile with demographics, pain points, and goals
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-[var(--color-brave-500)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Research findings from real conversations and data
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-[var(--color-brave-500)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Their exact language and words they use
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-[var(--color-brave-500)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Urgency Gateway - the #1 problem they&apos;ll pay to solve
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-[var(--color-brave-500)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Marketing strategy tailored to your audience
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
          disabled={isSubmitting}
        >
          &#8592; Back
        </button>

        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className="px-8 py-3 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Starting Research...
            </span>
          ) : (
            'Start My Research'
          )}
        </button>
      </div>
    </div>
  )
}
