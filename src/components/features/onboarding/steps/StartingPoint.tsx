'use client'

import SelectableCard from '../SelectableCard'

interface StartingPointProps {
  email: string
  selectedPath: 'direct' | 'discovery' | null
  onEmailChange: (email: string) => void
  onSelect: (path: 'direct' | 'discovery') => void
  onNext: () => void
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function StartingPoint({ email, selectedPath, onEmailChange, onSelect, onNext }: StartingPointProps) {
  const canContinue = selectedPath && email && isValidEmail(email)

  return (
    <div className="bg-[#243351] rounded-xl p-8 border border-white/10">
      <h1 className="text-2xl font-bold text-white mb-2">
        Let&apos;s get started
      </h1>
      <p className="text-gray-400 mb-6">
        We&apos;ll send your completed report to this email.
      </p>

      {/* Email input */}
      <div className="mb-8">
        <label className="block text-sm text-gray-400 mb-2">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full px-4 py-3 bg-[#1a2744] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <h2 className="text-lg font-semibold text-white mb-2">
        Do you know who you&apos;re here to serve?
      </h2>
      <p className="text-gray-400 mb-6">
        This helps us tailor the research to where you&apos;re at.
      </p>

      <div className="space-y-4 mb-8">
        <SelectableCard
          icon="&#127919;"
          title="Yes, I know my audience"
          description="I can describe who I serve and what they struggle with"
          selected={selectedPath === 'direct'}
          onClick={() => onSelect('direct')}
        />

        <SelectableCard
          icon="&#129517;"
          title="I'm still figuring it out"
          description="I need help uncovering who I'm best positioned to serve"
          selected={selectedPath === 'discovery'}
          onClick={() => onSelect('discovery')}
        />
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  )
}
