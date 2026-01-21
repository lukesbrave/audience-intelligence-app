'use client'

interface IntrospectionData {
  whoComesToYou: string
  questionsTheyAsk: string
  passionateAbout: string
}

interface StrengthsQuestionsProps {
  introspection: IntrospectionData
  onUpdate: (updates: Partial<IntrospectionData>) => void
  onBack: () => void
  onNext: () => void
}

export default function StrengthsQuestions({
  introspection,
  onUpdate,
  onBack,
  onNext
}: StrengthsQuestionsProps) {
  const isValid =
    introspection.whoComesToYou.length >= 20 &&
    introspection.questionsTheyAsk.length >= 20 &&
    introspection.passionateAbout.length >= 20

  return (
    <div className="bg-[#243351] rounded-xl p-8 border border-white/10">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-400 text-sm rounded-full mb-3">
          Your Strengths
        </span>
        <h1 className="text-2xl font-bold text-white mb-2">
          What do people come to you for?
        </h1>
        <p className="text-gray-400">
          Sometimes others see our gifts more clearly than we do.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Who comes to you for help or advice?
          </label>
          <textarea
            value={introspection.whoComesToYou}
            onChange={(e) => onUpdate({ whoComesToYou: e.target.value })}
            placeholder="Friends, colleagues, strangers online? What types of people seek you out?"
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What questions do they ask you?
          </label>
          <textarea
            value={introspection.questionsTheyAsk}
            onChange={(e) => onUpdate({ questionsTheyAsk: e.target.value })}
            placeholder="What topics keep coming up? What do people assume you know about?"
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What are you deeply passionate about?
          </label>
          <textarea
            value={introspection.passionateAbout}
            onChange={(e) => onUpdate({ passionateAbout: e.target.value })}
            placeholder="What topics could you talk about for hours? What gets you excited?"
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            rows={4}
          />
        </div>
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
          className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
