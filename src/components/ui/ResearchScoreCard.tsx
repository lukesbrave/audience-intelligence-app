'use client';

interface ResearchScoreCardProps {
  depth: number;        // 0-100 percentage
  sourceCount: number;
  confidence: 'high' | 'medium' | 'low';
}

const confidenceConfig = {
  high: { dots: 4, color: 'bg-green-500', label: 'HIGH' },
  medium: { dots: 3, color: 'bg-amber-500', label: 'MEDIUM' },
  low: { dots: 2, color: 'bg-red-500', label: 'LOW' }
};

function ResearchScoreCard({ depth, sourceCount, confidence }: ResearchScoreCardProps) {
  const config = confidenceConfig[confidence];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        {/* Depth */}
        <div className="p-4 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Depth
          </p>
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{depth}%</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0a0a0a] rounded-full transition-all duration-500"
              style={{ width: `${depth}%` }}
            />
          </div>
        </div>

        {/* Sources */}
        <div className="p-4 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Sources
          </p>
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{sourceCount}</p>
          <div className="mt-2 flex justify-center gap-0.5">
            {/* Visual indicator bars */}
            {Array.from({ length: Math.min(6, Math.ceil(sourceCount / 10)) }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-3 rounded-sm bg-[#BBDCEF]"
              />
            ))}
            {Array.from({ length: Math.max(0, 6 - Math.ceil(sourceCount / 10)) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-1.5 h-3 rounded-sm bg-gray-100"
              />
            ))}
          </div>
        </div>

        {/* Confidence */}
        <div className="p-4 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Confidence
          </p>
          <p className="text-lg font-bold text-gray-900">{config.label}</p>
          <div className="mt-2 flex justify-center gap-1">
            {/* Dot indicators */}
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${i < config.dots ? config.color : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ResearchScoreCard };
export type { ResearchScoreCardProps };
