'use client'

import SelectableCard from '../SelectableCard'

interface StartingPointProps {
  selectedPath: 'direct' | 'discovery' | null
  onSelect: (path: 'direct' | 'discovery') => void
  onNext: () => void
}

export default function StartingPoint({ selectedPath, onSelect, onNext }: StartingPointProps) {
  return (
    <div className="bg-[#243351] rounded-xl p-8 border border-white/10">
      <h1 className="text-2xl font-bold text-white mb-2">
        Do you know who you&apos;re here to serve?
      </h1>
      <p className="text-gray-400 mb-8">
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
        disabled={!selectedPath}
        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  )
}
