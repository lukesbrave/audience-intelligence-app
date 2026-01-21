'use client';

type SeverityLevel = 'critical' | 'moderate' | 'minor' | 'high' | 'medium' | 'low';

interface SeverityIndicatorProps {
  level: SeverityLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const levelColors: Record<SeverityLevel, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  high: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  moderate: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  medium: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  minor: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  low: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

const levelLabels: Record<SeverityLevel, string> = {
  critical: 'Critical',
  high: 'High',
  moderate: 'Moderate',
  medium: 'Medium',
  minor: 'Minor',
  low: 'Low',
};

const sizeStyles = {
  sm: { dot: 'w-2 h-2', text: 'text-xs', padding: 'px-2 py-0.5' },
  md: { dot: 'w-2.5 h-2.5', text: 'text-sm', padding: 'px-2.5 py-1' },
  lg: { dot: 'w-3 h-3', text: 'text-sm', padding: 'px-3 py-1.5' },
};

function SeverityIndicator({ level, showLabel = true, size = 'md' }: SeverityIndicatorProps) {
  const colors = levelColors[level];
  const sizes = sizeStyles[size];

  if (!showLabel) {
    return (
      <span
        className={`inline-block rounded-full ${sizes.dot} ${colors.dot}`}
        role="img"
        aria-label={`${levelLabels[level]} severity`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizes.padding} ${colors.bg}`}
    >
      <span className={`rounded-full ${sizes.dot} ${colors.dot}`} />
      <span className={`${sizes.text} font-medium ${colors.text}`}>
        {levelLabels[level]}
      </span>
    </span>
  );
}

export { SeverityIndicator };
export type { SeverityIndicatorProps, SeverityLevel };
