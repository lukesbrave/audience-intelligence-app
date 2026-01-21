'use client';

type ChannelPriority = 'tier1' | 'tier2' | 'tier3';

interface ChannelCardProps {
  name: string;
  priority: ChannelPriority;
  why?: string;
  whatWorks?: string[];
  className?: string;
}

const priorityStyles: Record<ChannelPriority, { badge: string; border: string; label: string }> = {
  tier1: {
    badge: 'bg-[#BBDCEF]/20 text-[#BBDCEF]',
    border: 'border-[#BBDCEF]/30',
    label: 'HIGH PRIORITY',
  },
  tier2: {
    badge: 'bg-amber-500/20 text-amber-400',
    border: 'border-amber-500/20',
    label: 'MEDIUM',
  },
  tier3: {
    badge: 'bg-gray-500/20 text-gray-400',
    border: 'border-gray-500/20',
    label: 'SECONDARY',
  },
};

const channelIcons: Record<string, string> = {
  linkedin: '💼',
  twitter: '𝕏',
  x: '𝕏',
  youtube: '▶️',
  discord: '💬',
  slack: '💬',
  reddit: '🔴',
  substack: '📰',
  newsletter: '📧',
  email: '📧',
  podcast: '🎙️',
  blog: '📝',
  facebook: '👤',
  instagram: '📷',
  tiktok: '🎵',
};

function getChannelIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(channelIcons)) {
    if (lower.includes(key)) return icon;
  }
  return '📍';
}

function ChannelCard({ name, priority, why, whatWorks, className = '' }: ChannelCardProps) {
  const styles = priorityStyles[priority];
  const icon = getChannelIcon(name);

  return (
    <div
      className={`bg-[#243351] rounded-xl p-5 border ${styles.border} hover:border-white/20 transition-colors ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h4 className="font-medium text-white">{name}</h4>
        </div>
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles.badge}`}>
          {styles.label}
        </span>
      </div>

      {why && (
        <div className="mb-4">
          <p className="text-sm text-gray-300 leading-relaxed">{why}</p>
        </div>
      )}

      {whatWorks && whatWorks.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            What works:
          </p>
          <ul className="space-y-1.5">
            {whatWorks.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-[#BBDCEF] mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface ChannelListItemProps {
  name: string;
  description?: string;
  className?: string;
}

function ChannelListItem({ name, description, className = '' }: ChannelListItemProps) {
  const icon = getChannelIcon(name);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-[#243351] rounded-lg border border-white/10 ${className}`}
    >
      <span className="text-lg">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate">{name}</p>
        {description && (
          <p className="text-xs text-gray-400 truncate">{description}</p>
        )}
      </div>
    </div>
  );
}

export { ChannelCard, ChannelListItem };
export type { ChannelCardProps, ChannelListItemProps, ChannelPriority };
