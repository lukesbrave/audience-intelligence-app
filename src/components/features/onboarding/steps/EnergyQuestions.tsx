'use client'

import { useState } from 'react'

interface IntrospectionData {
  firesYouUp: string
  pissesYouOff: string
  lightsUpInConversation: string
  loveToDoAnyway: string
}

interface EnergyQuestionsProps {
  introspection: IntrospectionData
  onUpdate: (updates: Partial<IntrospectionData>) => void
  onBack: () => void
  onNext: () => void
  onGenerateSuggestions: () => Promise<void>
}

export default function EnergyQuestions({
  introspection,
  onUpdate,
  onBack,
  onNext,
  onGenerateSuggestions
}: EnergyQuestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const MIN_LENGTH = 10

  const isValid =
    introspection.firesYouUp.length >= MIN_LENGTH &&
    introspection.pissesYouOff.length >= MIN_LENGTH &&
    introspection.lightsUpInConversation.length >= MIN_LENGTH &&
    introspection.loveToDoAnyway.length >= MIN_LENGTH

  const getCharacterHint = (value: string) => {
    const remaining = MIN_LENGTH - value.length
    if (remaining > 0) {
      return <span className="text-amber-400 text-xs">{remaining} more characters needed</span>
    }
    return <span className="text-[var(--color-brave-500)] text-xs">✓</span>
  }

  const handleContinue = async () => {
    setIsGenerating(true)
    try {
      await onGenerateSuggestions()
      onNext()
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-[#243351] rounded-xl p-8 border border-white/10">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-[var(--color-brave-600)]/20 text-[var(--color-brave-500)] text-sm rounded-full mb-3">
          Your Energy
        </span>
        <h1 className="text-2xl font-bold text-white mb-2">
          What lights you up?
        </h1>
        <p className="text-gray-400">
          Your energy is a compass pointing to who you should serve.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white">
              What fires you up?
            </label>
            {getCharacterHint(introspection.firesYouUp)}
          </div>
          <textarea
            value={introspection.firesYouUp}
            onChange={(e) => onUpdate({ firesYouUp: e.target.value })}
            placeholder="What topics or causes make you feel energized and motivated?"
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brave-500)] focus:ring-1 focus:ring-[var(--color-brave-500)] resize-none"
            rows={3}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white">
              What pisses you off?
            </label>
            {getCharacterHint(introspection.pissesYouOff)}
          </div>
          <textarea
            value={introspection.pissesYouOff}
            onChange={(e) => onUpdate({ pissesYouOff: e.target.value })}
            placeholder="What injustices, bad advice, or problems in your industry frustrate you?"
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brave-500)] focus:ring-1 focus:ring-[var(--color-brave-500)] resize-none"
            rows={3}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white">
              What lights you up in conversation?
            </label>
            {getCharacterHint(introspection.lightsUpInConversation)}
          </div>
          <textarea
            value={introspection.lightsUpInConversation}
            onChange={(e) => onUpdate({ lightsUpInConversation: e.target.value })}
            placeholder="What topics make you lean in? When do people say 'your eyes light up'?"
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brave-500)] focus:ring-1 focus:ring-[var(--color-brave-500)] resize-none"
            rows={3}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white">
              What would you do even if you weren&apos;t paid?
            </label>
            {getCharacterHint(introspection.loveToDoAnyway)}
          </div>
          <textarea
            value={introspection.loveToDoAnyway}
            onChange={(e) => onUpdate({ loveToDoAnyway: e.target.value })}
            placeholder="What do you find yourself doing for free because you genuinely love it?"
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brave-500)] focus:ring-1 focus:ring-[var(--color-brave-500)] resize-none"
            rows={3}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
          disabled={isGenerating}
        >
          &#8592; Back
        </button>

        <button
          onClick={handleContinue}
          disabled={!isValid || isGenerating}
          className="px-8 py-3 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
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
              Analyzing...
            </span>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  )
}
