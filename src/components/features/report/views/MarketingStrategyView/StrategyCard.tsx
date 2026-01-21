'use client';

interface StrategyCardProps {
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  index: number;
}

const impactStyles = {
  high: {
    badge: 'bg-red-100 text-red-700 border-red-200',
    accent: 'border-l-red-500',
    label: 'High Impact'
  },
  medium: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    accent: 'border-l-amber-500',
    label: 'Medium Impact'
  },
  low: {
    badge: 'bg-green-100 text-green-700 border-green-200',
    accent: 'border-l-green-500',
    label: 'Lower Priority'
  }
};

function StrategyCard({ recommendation, impact, index }: StrategyCardProps) {
  const styles = impactStyles[impact];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 border-l-4 ${styles.accent} p-4`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#16314C] text-white text-xs font-medium flex items-center justify-center">
            {index}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles.badge}`}>
            {styles.label}
          </span>
        </div>
      </div>
      <p className="text-gray-800">{recommendation}</p>
    </div>
  );
}

export { StrategyCard };
export type { StrategyCardProps };
