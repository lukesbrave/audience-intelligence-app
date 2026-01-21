'use client';

interface HeroInsightProps {
  insight: string;
  sourceCount: number;
  confidence: 'high' | 'medium' | 'low';
}

const confidenceLabels = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence'
};

const confidenceColors = {
  high: 'text-green-300',
  medium: 'text-amber-300',
  low: 'text-red-300'
};

function HeroInsight({ insight, sourceCount, confidence }: HeroInsightProps) {
  return (
    <div className="bg-gradient-to-br from-[#16314C] to-[#1e4a6e] rounded-2xl overflow-hidden shadow-lg animate-fadeIn">
      <div className="px-6 py-8 sm:px-8 sm:py-10">
        {/* Label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl" role="img" aria-label="target">
            🎯
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Your #1 Opportunity
          </span>
        </div>

        {/* Main Insight */}
        <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
          &ldquo;{insight}&rdquo;
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-white/10 backdrop-blur px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-white/70 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Based on {sourceCount} source{sourceCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Confidence dots */}
            <div className="flex items-center gap-0.5">
              <span className={`w-2 h-2 rounded-full ${confidence === 'high' || confidence === 'medium' || confidence === 'low' ? 'bg-white' : 'bg-white/30'}`} />
              <span className={`w-2 h-2 rounded-full ${confidence === 'high' || confidence === 'medium' ? 'bg-white' : 'bg-white/30'}`} />
              <span className={`w-2 h-2 rounded-full ${confidence === 'high' ? 'bg-white' : 'bg-white/30'}`} />
            </div>
            <span className={`ml-1.5 ${confidenceColors[confidence]}`}>
              {confidenceLabels[confidence]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HeroInsight };
export type { HeroInsightProps };
