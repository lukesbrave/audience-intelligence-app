'use client';

type OfferLevel = 'entry' | 'scaling' | 'core' | 'premium';

interface OfferStageCardProps {
  level: OfferLevel;
  name: string;
  priceRange: string;
  problemSolved: string;
  promise: string;
  format?: string;
  className?: string;
}

const levelConfig: Record<OfferLevel, { color: string; bg: string; icon: string; label: string }> = {
  entry: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    icon: '💊',
    label: 'THE ASPIRIN (Entry Offer)',
  },
  scaling: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    icon: '📈',
    label: 'THE BRIDGE (Scaling Offer)',
  },
  core: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    icon: '🏆',
    label: 'THE CURE (Core Offer)',
  },
  premium: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    icon: '👑',
    label: 'THE DREAM (Premium Offer)',
  },
};

function OfferStageCard({
  level,
  name,
  priceRange,
  problemSolved,
  promise,
  format,
  className = '',
}: OfferStageCardProps) {
  const config = levelConfig[level];

  return (
    <div className={`bg-[#141414] rounded-xl border border-white/10 overflow-hidden ${className}`}>
      <div className={`px-5 py-3 ${config.bg} border-b border-white/10`}>
        <p className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
          {config.label}
        </p>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <h4 className="font-semibold text-white text-lg">{name}</h4>
          </div>
          <span className="text-sm font-medium text-gray-400 whitespace-nowrap">{priceRange}</span>
        </div>

        <div className="space-y-3">
          <div className="bg-[#0a0a0a] rounded-lg p-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Solves
            </p>
            <p className="text-sm text-gray-300">{problemSolved}</p>
          </div>

          <div className="bg-[#0a0a0a] rounded-lg p-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Promise
            </p>
            <p className="text-sm text-gray-300">{promise}</p>
          </div>

          {format && (
            <div className="bg-[#0a0a0a] rounded-lg p-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                Format
              </p>
              <p className="text-sm text-gray-300">{format}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { OfferStageCard };
export type { OfferStageCardProps, OfferLevel };
