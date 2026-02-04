'use client';

import { CopyButton } from './CopyButton';

type LanguageType = 'pain' | 'desire' | 'search' | 'trigger';

interface LanguageCardProps {
  phrase: string;
  type: LanguageType;
  className?: string;
}

const typeStyles: Record<LanguageType, { bg: string; border: string; icon: string }> = {
  pain: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
  },
  desire: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-400',
  },
  search: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
  },
  trigger: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: 'text-purple-400',
  },
};

function LanguageCard({ phrase, type, className = '' }: LanguageCardProps) {
  const styles = typeStyles[type];

  return (
    <div
      className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-colors ${styles.bg} ${styles.border} hover:border-white/20 ${className}`}
    >
      <span className="text-sm text-white/90">&ldquo;{phrase}&rdquo;</span>
      <CopyButton
        text={phrase}
        size="sm"
        variant="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}

interface LanguageGridProps {
  phrases: string[];
  type: LanguageType;
  title: string;
  description?: string;
  className?: string;
}

function LanguageGrid({ phrases, type, title, description, className = '' }: LanguageGridProps) {
  const styles = typeStyles[type];

  if (!phrases || phrases.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${styles.bg} ${styles.icon}`} />
            {title}
          </h3>
          {description && (
            <p className="text-xs text-white/60 mt-0.5">{description}</p>
          )}
        </div>
        <CopyButton text={phrases} label="Copy All" variant="full" />
      </div>
      <div className="grid gap-2">
        {phrases.map((phrase, index) => (
          <LanguageCard key={index} phrase={phrase} type={type} />
        ))}
      </div>
    </div>
  );
}

export { LanguageCard, LanguageGrid };
export type { LanguageCardProps, LanguageGridProps, LanguageType };
