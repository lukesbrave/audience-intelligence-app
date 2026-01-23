interface SelectableCardProps {
  icon: string
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

export default function SelectableCard({ icon, title, description, selected, onClick }: SelectableCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-[var(--color-brave-500)] bg-[var(--color-brave-600)]/10'
          : 'border-white/10 hover:border-white/20 bg-transparent'
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium">{title}</h3>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
        {selected && (
          <div className="w-6 h-6 rounded-full bg-[var(--color-brave-600)] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  )
}
