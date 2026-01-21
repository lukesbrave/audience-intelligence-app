'use client';

interface SolutionsFactorsGridProps {
  currentSolutions: string[];
  decisionFactors: string[];
}

function SolutionsFactorsGrid({ currentSolutions, decisionFactors }: SolutionsFactorsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Current Solutions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Current Solutions
          </h3>
        </div>
        <ul className="space-y-2">
          {currentSolutions.map((solution, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-green-500 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-700">{solution}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Decision Factors */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#BBDCEF]/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Decision Factors
          </h3>
        </div>
        <ol className="space-y-2">
          {decisionFactors.map((factor, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#16314C] text-white text-xs font-medium flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-gray-700">{factor}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export { SolutionsFactorsGrid };
export type { SolutionsFactorsGridProps };
