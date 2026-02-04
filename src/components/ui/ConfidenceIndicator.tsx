'use client';

type ConfidenceLevel = 'high' | 'medium' | 'low';

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  sourceCount?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const levelConfig: Record<ConfidenceLevel, { dots: number; color: string; label: string }> = {
  high: { dots: 4, color: 'bg-green-400', label: 'High confidence' },
  medium: { dots: 3, color: 'bg-amber-400', label: 'Medium confidence' },
  low: { dots: 2, color: 'bg-gray-400', label: 'Low confidence' },
};

function ConfidenceIndicator({
  level,
  sourceCount,
  showLabel = false,
  size = 'sm',
  className = '',
}: ConfidenceIndicatorProps) {
  const config = levelConfig[level];
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const gap = size === 'sm' ? 'gap-1' : 'gap-1.5';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex items-center ${gap}`} title={config.label}>
        {[1, 2, 3, 4].map((dot) => (
          <span
            key={dot}
            className={`${dotSize} rounded-full ${
              dot <= config.dots ? config.color : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-white/60">{config.label}</span>
      )}
      {sourceCount !== undefined && (
        <span className="text-xs text-white/50">
          {sourceCount} source{sourceCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

export { ConfidenceIndicator };
export type { ConfidenceIndicatorProps, ConfidenceLevel };
