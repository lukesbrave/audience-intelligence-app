'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StickyHeader, Footer } from '@/components/ui'
import StepIndicator from './StepIndicator'
import LaserIntro from './steps/LaserIntro'
import StartingPoint from './steps/StartingPoint'
import DescribeAudience from './steps/DescribeAudience'
import StoryQuestions from './steps/StoryQuestions'
import StrengthsQuestions from './steps/StrengthsQuestions'
import EnergyQuestions from './steps/EnergyQuestions'
import AudienceSuggestions from './steps/AudienceSuggestions'
import Confirmation from './steps/Confirmation'
import { FocusGroupInsights } from '@/lib/research/schemas'

export interface OnboardingState {
  // Email for report delivery
  email: string

  selectedPath: 'direct' | 'discovery' | null

  // Path A (direct)
  businessDescription: string
  idealClientDescription: string
  focusGroupInsights: FocusGroupInsights | null
  focusGroupBusinessContext: string

  // Path B (discovery)
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

const initialState: OnboardingState = {
  email: '',
  selectedPath: null,
  businessDescription: '',
  idealClientDescription: '',
  focusGroupInsights: null,
  focusGroupBusinessContext: '',
  introspection: {
    biggestChallenge: '',
    biggestTrauma: '',
    proudestAchievement: '',
    whoComesToYou: '',
    questionsTheyAsk: '',
    passionateAbout: '',
    firesYouUp: '',
    pissesYouOff: '',
    lightsUpInConversation: '',
    loveToDoAnyway: '',
  },
  audienceSuggestions: [],
  selectedAudienceId: null,
  customAudienceDescription: '',
}

export default function OnboardingContainer() {
  const [showIntro, setShowIntro] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [state, setState] = useState<OnboardingState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  // Calculate total steps based on path
  const getTotalSteps = () => {
    if (!state.selectedPath) return 3 // Starting + unknown
    if (state.selectedPath === 'direct') return 3 // Starting + Describe + Confirm
    return 6 // Starting + Story + Strengths + Energy + Suggestions + Confirm
  }

  const updateState = (updates: Partial<OnboardingState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handlePathSelect = (path: 'direct' | 'discovery') => {
    updateState({ selectedPath: path })
  }

  const handleComplete = async () => {
    setIsSubmitting(true)

    try {
      // Build audience summary from raw inputs (no Gemini call needed)
      const selectedAudience = state.customAudienceDescription ||
        state.audienceSuggestions.find(s => s.id === state.selectedAudienceId)?.title

      const audienceSummary = state.selectedPath === 'direct'
        ? state.idealClientDescription
        : selectedAudience || 'Target audience from discovery'

      // Create a simple profile from raw onboarding data
      const profile = {
        audienceSummary,
        rawInputs: state.selectedPath === 'direct'
          ? {
              businessDescription: state.businessDescription,
              idealClientDescription: state.idealClientDescription,
            }
          : {
              introspection: state.introspection,
              selectedAudience,
            },
      }

      // Create report in database (quick operation)
      const reportRes = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.email,
          name: `Research - ${new Date().toLocaleDateString()}`,
          pdfFilename: '',
          businessContext: state.selectedPath === 'direct'
            ? state.businessDescription
            : JSON.stringify(state.introspection),
          researchPriority: 'All Areas (Recommended)',
          response: {
            success: true,
            message: 'Research initiated from onboarding',
            generatedAt: new Date().toISOString(),
            onboardingData: {
              path: state.selectedPath,
              profile,
              audienceSummary,
              focusGroupInsights: state.focusGroupInsights,
              focusGroupBusinessContext: state.focusGroupBusinessContext,
            },
          },
        }),
      })

      if (!reportRes.ok) {
        throw new Error('Failed to create report')
      }

      const { report } = await reportRes.json()

      // Redirect immediately to research-v2 (research will start there)
      router.push(`/research-v2?reportId=${report.id}`)

    } catch (error) {
      console.error('Error completing onboarding:', error)
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    // Step 1: Email + Path selection
    if (currentStep === 1) {
      return (
        <StartingPoint
          email={state.email}
          selectedPath={state.selectedPath}
          onEmailChange={(email) => updateState({ email })}
          onSelect={handlePathSelect}
          onNext={handleNext}
        />
      )
    }

    // Path A: Direct
    if (state.selectedPath === 'direct') {
      if (currentStep === 2) {
        return (
          <DescribeAudience
            businessDescription={state.businessDescription}
            idealClientDescription={state.idealClientDescription}
            focusGroupInsights={state.focusGroupInsights}
            focusGroupBusinessContext={state.focusGroupBusinessContext}
            onUpdate={(updates) => updateState(updates)}
            onBack={handleBack}
            onNext={handleNext}
          />
        )
      }
      if (currentStep === 3) {
        return (
          <Confirmation
            state={state}
            onBack={handleBack}
            onComplete={handleComplete}
            isSubmitting={isSubmitting}
          />
        )
      }
    }

    // Path B: Discovery
    if (state.selectedPath === 'discovery') {
      if (currentStep === 2) {
        return (
          <StoryQuestions
            introspection={state.introspection}
            onUpdate={(introspection) => updateState({ introspection: { ...state.introspection, ...introspection } })}
            onBack={handleBack}
            onNext={handleNext}
          />
        )
      }
      if (currentStep === 3) {
        return (
          <StrengthsQuestions
            introspection={state.introspection}
            onUpdate={(introspection) => updateState({ introspection: { ...state.introspection, ...introspection } })}
            onBack={handleBack}
            onNext={handleNext}
          />
        )
      }
      if (currentStep === 4) {
        return (
          <EnergyQuestions
            introspection={state.introspection}
            onUpdate={(introspection) => updateState({ introspection: { ...state.introspection, ...introspection } })}
            onBack={handleBack}
            onNext={handleNext}
            onGenerateSuggestions={async () => {
              const res = await fetch('/api/suggest-audiences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ introspection: state.introspection }),
              })
              const { suggestions } = await res.json()
              updateState({ audienceSuggestions: suggestions })
            }}
          />
        )
      }
      if (currentStep === 5) {
        return (
          <AudienceSuggestions
            suggestions={state.audienceSuggestions}
            selectedId={state.selectedAudienceId}
            customDescription={state.customAudienceDescription}
            onSelect={(id) => updateState({ selectedAudienceId: id, customAudienceDescription: '' })}
            onCustomChange={(desc) => updateState({ customAudienceDescription: desc, selectedAudienceId: null })}
            onBack={handleBack}
            onNext={handleNext}
          />
        )
      }
      if (currentStep === 6) {
        return (
          <Confirmation
            state={state}
            onBack={handleBack}
            onComplete={handleComplete}
            isSubmitting={isSubmitting}
          />
        )
      }
    }

    return null
  }

  const getStepTitle = () => {
    if (currentStep === 1) return "Let's Begin"
    if (state.selectedPath === 'direct') {
      if (currentStep === 2) return 'Describe Your Audience'
      if (currentStep === 3) return 'Ready to Launch'
    }
    if (state.selectedPath === 'discovery') {
      if (currentStep === 2) return 'Your Story'
      if (currentStep === 3) return 'Your Strengths'
      if (currentStep === 4) return 'Your Energy'
      if (currentStep === 5) return 'Your Audience'
      if (currentStep === 6) return 'Ready to Launch'
    }
    return 'Onboarding'
  }

  // Show the intro screen first
  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#1a2744] flex flex-col">
        <StickyHeader />
        <div className="flex-1">
          <LaserIntro onStart={() => setShowIntro(false)} />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a2744] flex flex-col">
      <StickyHeader />
      <div className="flex-1 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-xl">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={getTotalSteps()}
            title={getStepTitle()}
          />

          <div className="mt-8">
            {renderStep()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
