'use client';

interface QuickWinsCardProps {
  wins: string[];
}

function QuickWinsCard({ wins }: QuickWinsCardProps) {
  if (!wins || wins.length === 0) return null;

  return (
    <div className="bg-amber-50 rounded-xl border border-amber-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-amber-200 bg-amber-100/50">
        <div className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label="lightning bolt">
            ⚡
          </span>
          <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wider">
            Quick Wins - Start Here
          </h3>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {wins.slice(0, 3).map((win, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded border-2 border-amber-400 bg-white flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{win}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { QuickWinsCard };
export type { QuickWinsCardProps };
