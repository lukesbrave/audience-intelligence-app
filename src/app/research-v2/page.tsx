'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ProgressBar,
  ResearchStep,
  AnglesStep,
  HooksStep,
  PlaybookStep,
  OfferStep,
} from '@/components/research'
import { StickyHeader, Footer } from '@/components/ui'
import { ResearchOutput, BrandAngle, RatedHook, OfferCoreOutput, FocusGroupInsights } from '@/lib/research/schemas'

type Step = 1 | 2 | 3 | 4 | 5

// Sample profile for testing
const TEST_PROFILE = {
  audienceSummary:
    'Corporate employees building side hustles while working 9-5 jobs, feeling trapped and seeking financial freedom',
  demographics: {
    jobTitles: ['Software Engineer', 'Marketing Manager', 'Accountant', 'Project Manager'],
    industries: ['Tech', 'Finance', 'Consulting', 'Healthcare'],
    ageRange: '28-42',
    incomeLevel: '$70K-$150K',
  },
  painPoints: [
    {
      pain: 'No time after work to build business',
      severity: 'high',
      emotionalContext: 'Exhausted and frustrated',
    },
    {
      pain: 'Fear of leaving stable income',
      severity: 'high',
      emotionalContext: 'Anxious about risk',
    },
    {
      pain: 'Imposter syndrome about going solo',
      severity: 'medium',
      emotionalContext: 'Doubts their expertise',
    },
  ],
  goals: [
    {
      goal: 'Replace 9-5 income with side hustle',
      timeframe: '12-24 months',
      priority: 'primary',
    },
    {
      goal: 'Build income while still employed',
      timeframe: '6-12 months',
      priority: 'primary',
    },
  ],
  currentState: 'Working full-time, dabbling in side projects, never gaining traction',
  desiredState: 'Running profitable business with freedom to leave job when ready',
}

interface FlowState {
  step: Step
  audienceProfile: Record<string, unknown> | null
  focusGroupInsights: FocusGroupInsights | null
  focusGroupBusinessContext: string | null
  research: ResearchOutput | null
  selectedAngles: BrandAngle[]
  ratedHooks: RatedHook[]
  offerCore: OfferCoreOutput | null
}

// Helper to get storage key based on report ID
const getStorageKey = (reportId: string | null) => {
  return reportId ? `researchFlow_${reportId}` : 'researchFlow_test'
}

// Helper to save flow state to localStorage
const saveFlowState = (reportId: string | null, state: FlowState) => {
  try {
    const key = getStorageKey(reportId)
    localStorage.setItem(key, JSON.stringify(state))
  } catch (e) {
    console.warn('Failed to save flow state to localStorage:', e)
  }
}

// Helper to load flow state from localStorage
const loadFlowState = (reportId: string | null): FlowState | null => {
  try {
    const key = getStorageKey(reportId)
    const saved = localStorage.getItem(key)
    if (saved) {
      return JSON.parse(saved) as FlowState
    }
  } catch (e) {
    console.warn('Failed to load flow state from localStorage:', e)
  }
  return null
}

// Helper to clear flow state from localStorage
const clearFlowState = (reportId: string | null) => {
  try {
    const key = getStorageKey(reportId)
    localStorage.removeItem(key)
  } catch (e) {
    console.warn('Failed to clear flow state from localStorage:', e)
  }
}

function ResearchV2Content() {
  const searchParams = useSearchParams()
  const reportId = searchParams.get('reportId')
  const [flowState, setFlowState] = useState<FlowState>({
    step: 1,
    audienceProfile: null,
    focusGroupInsights: null,
    focusGroupBusinessContext: null,
    research: null,
    selectedAngles: [],
    ratedHooks: [],
    offerCore: null,
  })
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Load audience profile from report ID, test mode, or redirect to onboarding
  useEffect(() => {
    const testMode = searchParams.get('test') === 'true'

    // First, try to restore saved flow state
    const savedFlowState = loadFlowState(reportId)

    if (testMode) {
      // Use sample profile for quick testing
      if (savedFlowState && savedFlowState.audienceProfile) {
        // Restore full saved state in test mode
        setFlowState(savedFlowState)
        setInitialized(true)
        setLoading(false)
      } else {
        setFlowState((prev) => ({
          ...prev,
          audienceProfile: TEST_PROFILE,
        }))
        setInitialized(true)
        setLoading(false)
      }
    } else if (reportId) {
      if (savedFlowState && savedFlowState.audienceProfile) {
        // Restore saved state - user is resuming their session
        setFlowState(savedFlowState)
        setInitialized(true)
        setLoading(false)
      } else {
        // Fresh start - load from report
        loadAudienceProfile(reportId)
      }
    } else {
      // Check if we have a profile in localStorage (for direct testing)
      const savedProfile = localStorage.getItem('testAudienceProfile')
      if (savedProfile) {
        if (savedFlowState && savedFlowState.audienceProfile) {
          setFlowState(savedFlowState)
        } else {
          setFlowState((prev) => ({
            ...prev,
            audienceProfile: JSON.parse(savedProfile),
          }))
        }
        setInitialized(true)
        setLoading(false)
      } else {
        // Redirect to onboarding
        window.location.href = '/onboarding?v2=true'
      }
    }
  }, [searchParams, reportId])

  // Save flow state to localStorage whenever it changes (after initialization)
  useEffect(() => {
    if (initialized && flowState.audienceProfile) {
      saveFlowState(reportId, flowState)
    }
  }, [flowState, reportId, initialized])

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [flowState.step])

  const loadAudienceProfile = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`)
      if (!res.ok) {
        throw new Error('Failed to load report')
      }

      const { report } = await res.json()

      // Try multiple paths to find the profile
      const profile =
        report.response?.onboardingData?.profile || // New onboarding flow
        report.response?.report?.audienceProfile || // Existing n8n research
        report.response?.audienceProfile // Direct path

      if (!profile) {
        console.error('Report structure:', JSON.stringify(report, null, 2).slice(0, 500))
        throw new Error('No profile found in report')
      }

      // Extract focus group insights if they were uploaded during onboarding
      const focusGroupInsights = report.response?.onboardingData?.focusGroupInsights || null
      const focusGroupBusinessContext = report.response?.onboardingData?.focusGroupBusinessContext || null

      setFlowState((prev) => ({
        ...prev,
        audienceProfile: profile,
        focusGroupInsights,
        focusGroupBusinessContext,
      }))
      setInitialized(true)
    } catch (err) {
      console.error('Error loading profile:', err)
      window.location.href = '/onboarding?v2=true'
    } finally {
      setLoading(false)
    }
  }

  const handleResearchComplete = (research: ResearchOutput) => {
    setFlowState((prev) => ({
      ...prev,
      step: 2,
      research,
    }))
  }

  const handleAnglesComplete = (selectedAngles: BrandAngle[]) => {
    setFlowState((prev) => ({
      ...prev,
      step: 3,
      selectedAngles,
    }))
  }

  const handleHooksComplete = (ratedHooks: RatedHook[]) => {
    setFlowState((prev) => ({
      ...prev,
      step: 4,
      ratedHooks,
    }))
  }

  const handleOfferComplete = (offerCore: OfferCoreOutput) => {
    setFlowState((prev) => ({
      ...prev,
      offerCore,
    }))
  }

  const goToOfferCore = () => {
    setFlowState((prev) => ({
      ...prev,
      step: 5,
    }))
  }

  const goToStep = (step: Step) => {
    setFlowState((prev) => ({
      ...prev,
      step,
    }))
  }

  const handleRestart = () => {
    localStorage.removeItem('testAudienceProfile')
    clearFlowState(reportId)
    window.location.href = '/onboarding?v2=true'
  }

  const completedSteps = (() => {
    const completed: number[] = []
    if (flowState.research) completed.push(1)
    if (flowState.selectedAngles.length > 0) completed.push(2)
    if (flowState.ratedHooks.length > 0) completed.push(3)
    // Playbook (4) is only completed when you've moved to Offer Core (5)
    if (flowState.step > 4) completed.push(4)
    // Offer Core (5) only completed after user generates it
    // Note: offerCore starts as null and is only set after successful generation
    if (flowState.offerCore !== null) completed.push(5)
    return completed
  })()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2744] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brave-500)] mx-auto mb-4" />
          <p className="text-gray-400">Loading your audience profile...</p>
        </div>
      </div>
    )
  }

  if (!flowState.audienceProfile) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#1a2744] flex flex-col">
      <StickyHeader />
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={flowState.step} completedSteps={completedSteps} />

        <div className="mt-8">
          {flowState.step === 1 && (
            <ResearchStep
              audienceProfile={flowState.audienceProfile}
              focusGroupInsights={flowState.focusGroupInsights}
              businessContext={flowState.focusGroupBusinessContext}
              onComplete={handleResearchComplete}
            />
          )}

          {flowState.step === 2 && flowState.research && (
            <AnglesStep
              research={flowState.research}
              onComplete={handleAnglesComplete}
              onBack={() => goToStep(1)}
            />
          )}

          {flowState.step === 3 && flowState.research && (
            <HooksStep
              selectedAngles={flowState.selectedAngles}
              research={flowState.research}
              onComplete={handleHooksComplete}
              onBack={() => goToStep(2)}
            />
          )}

          {flowState.step === 4 && flowState.research && (
            <PlaybookStep
              research={flowState.research}
              selectedAngles={flowState.selectedAngles}
              ratedHooks={flowState.ratedHooks}
              onBack={() => goToStep(3)}
              onRestart={handleRestart}
              onOfferCore={goToOfferCore}
            />
          )}

          {flowState.step === 5 && flowState.research && (
            <OfferStep
              research={flowState.research}
              selectedAngles={flowState.selectedAngles}
              ratedHooks={flowState.ratedHooks}
              onComplete={handleOfferComplete}
              onBack={() => goToStep(4)}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

function ResearchV2Loading() {
  return (
    <div className="min-h-screen bg-[#1a2744] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brave-500)] mx-auto mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

export default function ResearchV2Page() {
  return (
    <Suspense fallback={<ResearchV2Loading />}>
      <ResearchV2Content />
    </Suspense>
  )
}
