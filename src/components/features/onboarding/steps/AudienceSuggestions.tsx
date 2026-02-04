'use client'

interface AudienceSuggestion {
  id: string
  title: string
  description: string
}

interface AudienceSuggestionsProps {
  suggestions: AudienceSuggestion[]
  selectedId: string | null
  customDescription: string
  onSelect: (id: string) => void
  onCustomChange: (description: string) => void
  onBack: () => void
  onNext: () => void
}

export default function AudienceSuggestions({
  suggestions,
  selectedId,
  customDescription,
  onSelect,
  onCustomChange,
  onBack,
  onNext
}: AudienceSuggestionsProps) {
  const isValid = selectedId || customDescription.length >= 20

  return (
    <div className="bg-[#141414] rounded-xl p-8 border border-white/10">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-[var(--color-brave-600)]/20 text-[var(--color-brave-500)] text-sm rounded-full mb-3">
          Your Audience
        </span>
        <h1 className="text-2xl font-bold text-white mb-2">
          Based on your answers, you&apos;re well-positioned to serve...
        </h1>
        <p className="text-gray-400">
          Select the audience that resonates most, or describe your own.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedId === suggestion.id
                ? 'border-[var(--color-brave-500)] bg-[var(--color-brave-600)]/10'
                : 'border-white/10 hover:border-white/20 bg-transparent'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium">{suggestion.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{suggestion.description}</p>
              </div>
              {selectedId === suggestion.id && (
                <div className="w-6 h-6 rounded-full bg-[var(--color-brave-600)] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#141414] text-gray-400">Or describe your own</span>
          </div>
        </div>

        <textarea
          value={customDescription}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Describe your ideal audience in detail..."
          className={`w-full mt-4 px-4 py-3 bg-[#0a0a0a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brave-500)] focus:ring-1 focus:ring-[var(--color-brave-500)] resize-none ${
            customDescription.length > 0 ? 'border-[var(--color-brave-500)]' : 'border-white/10'
          }`}
          rows={4}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          &#8592; Back
        </button>

        <button
          onClick={onNext}
          disabled={!isValid}
          className="px-8 py-3 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
