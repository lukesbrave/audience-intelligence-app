'use client'

interface DescribeAudienceProps {
  businessDescription: string
  idealClientDescription: string
  onUpdate: (updates: { businessDescription?: string; idealClientDescription?: string }) => void
  onBack: () => void
  onNext: () => void
}

export default function DescribeAudience({
  businessDescription,
  idealClientDescription,
  onUpdate,
  onBack,
  onNext
}: DescribeAudienceProps) {
  const isValid = businessDescription.length >= 20 && idealClientDescription.length >= 20

  return (
    <div className="bg-[#243351] rounded-xl p-8 border border-white/10">
      <h1 className="text-2xl font-bold text-white mb-2">
        Tell us about your business and who you serve
      </h1>
      <p className="text-gray-400 mb-8">
        The more detail you share, the sharper your research will be.
      </p>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What do you do?
          </label>
          <textarea
            value={businessDescription}
            onChange={(e) => onUpdate({ businessDescription: e.target.value })}
            placeholder="I help [who] achieve [what] through [how]..."
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            rows={4}
          />
          <p className="text-gray-500 text-sm mt-1">
            Describe your business, service, or expertise in a few sentences.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Who is your ideal client?
          </label>
          <textarea
            value={idealClientDescription}
            onChange={(e) => onUpdate({ idealClientDescription: e.target.value })}
            placeholder="They're typically [role/situation] who struggle with [problem] and want [outcome]..."
            className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            rows={6}
          />
          <p className="text-gray-500 text-sm mt-1">
            Describe them like you&apos;re telling a friend - their situation, struggles, and what they&apos;re hoping for.
          </p>
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
          Generate My Research
        </button>
      </div>
    </div>
  )
}
