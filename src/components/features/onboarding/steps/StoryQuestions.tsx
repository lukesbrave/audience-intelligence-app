'use client'

interface IntrospectionData {
  biggestChallenge: string
  biggestTrauma: string
  proudestAchievement: string
}

interface StoryQuestionsProps {
  introspection: IntrospectionData
  onUpdate: (updates: Partial<IntrospectionData>) => void
  onBack: () => void
  onNext: () => void
}

export default function StoryQuestions({
  introspection,
  onUpdate,
  onBack,
  onNext
}: StoryQuestionsProps) {
  const isValid =
    introspection.biggestChallenge.length >= 20 &&
    introspection.biggestTrauma.length >= 20 &&
    introspection.proudestAchievement.length >= 20

  return (
    <div className="bg-[#243351] rounded-xl p-8 border border-white/10">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-400 text-sm rounded-full mb-3">
          Your Story
        </span>
        <h1 className="text-2xl font-bold text-white mb-2">
          Let&apos;s dig into your journey
        </h1>
        <p className="text-gray-400">
          Your experiences shape who you can best serve. Be honest - there are no wrong answers.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What&apos;s the biggest challenge you&apos;ve overcome?
          </label>
          <textarea
            value={introspection.biggestChallenge}
            onChange={(e) => onUpdate({ biggestChallenge: e.target.value })}
            placeholder="Describe a significant obstacle you faced and how you moved through it..."
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What&apos;s the biggest trauma or setback you&apos;ve faced?
          </label>
          <textarea
            value={introspection.biggestTrauma}
            onChange={(e) => onUpdate({ biggestTrauma: e.target.value })}
            placeholder="This could be professional, personal, or both. What shaped who you are today?"
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What&apos;s your proudest achievement?
          </label>
          <textarea
            value={introspection.proudestAchievement}
            onChange={(e) => onUpdate({ proudestAchievement: e.target.value })}
            placeholder="Something that made you think 'I did that.' Big or small."
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
