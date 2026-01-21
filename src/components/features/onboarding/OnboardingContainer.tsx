'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepIndicator from './StepIndicator'
import StartingPoint from './steps/StartingPoint'
import DescribeAudience from './steps/DescribeAudience'
import StoryQuestions from './steps/StoryQuestions'
import StrengthsQuestions from './steps/StrengthsQuestions'
import EnergyQuestions from './steps/EnergyQuestions'
import AudienceSuggestions from './steps/AudienceSuggestions'
import Confirmation from './steps/Confirmation'

interface OnboardingContainerProps {
  userId: string
  userEmail: string
}

export interface OnboardingState {
  selectedPath: 'direct' | 'discovery' | null

  // Path A (direct)
  businessDescription: string
  idealClientDescription: string

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
  selectedPath: null,
  businessDescription: '',
  idealClientDescription: '',
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

export default function OnboardingContainer({ userId, userEmail }: OnboardingContainerProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [state, setState] = useState<OnboardingState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

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
      // Generate profile using Gemini
      const profileRes = await fetch('/api/generate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: state.selectedPath,
          data: state.selectedPath === 'direct'
            ? {
                businessDescription: state.businessDescription,
                idealClientDescription: state.idealClientDescription,
              }
            : {
                introspection: state.introspection,
                selectedAudience: state.customAudienceDescription ||
                  state.audienceSuggestions.find(s => s.id === state.selectedAudienceId)?.title,
              }
        }),
      })

      if (!profileRes.ok) {
        throw new Error('Failed to generate profile')
      }

      const { profile } = await profileRes.json()

      // Create report in database
      const reportRes = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
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
              audienceSummary: profile.audienceSummary,
            },
          },
        }),
      })

      if (!reportRes.ok) {
        throw new Error('Failed to create report')
      }

      const { report } = await reportRes.json()

      // Mark onboarding as complete
      await fetch('/api/profile/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          onboardingPath: state.selectedPath,
        }),
      })

      // Redirect to the research page with the report ID to trigger processing
      router.push(`/research?fromOnboarding=true&reportId=${report.id}`)
      router.refresh()

    } catch (error) {
      console.error('Error completing onboarding:', error)
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    // Step 1: Path selection
    if (currentStep === 1) {
      return (
        <StartingPoint
          selectedPath={state.selectedPath}
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

  return (
    <div className="min-h-screen bg-[#1a2744] flex flex-col items-center justify-center p-4">
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
  )
}
