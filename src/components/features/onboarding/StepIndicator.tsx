interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  title: string
}

export default function StepIndicator({ currentStep, totalSteps, title }: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="bg-[#243351] rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[var(--color-brave-600)]/20 flex items-center justify-center">
          <span className="text-[var(--color-brave-500)] text-lg">&#10022;</span>
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-wide">Getting Started</p>
          <h2 className="text-white font-semibold text-lg">{title}</h2>
        </div>
      </div>

      <div className="h-1 bg-[#1a2744] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-brave-500)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
