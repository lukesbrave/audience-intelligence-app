'use client';

import { ResearchFinding } from '@/lib/types';

interface LibrarySourcesProps {
  findings: ResearchFinding[];
}

function LibrarySources({ findings }: LibrarySourcesProps) {
  const totalSources = findings.reduce((sum, phase) => sum + (phase.citations?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sources & Citations</h1>
        <p className="text-sm text-gray-400 mt-1">
          {totalSources} sources across {findings.length} research phases
        </p>
      </div>

      {findings.map((phase) => (
        <div
          key={phase.phase}
          className="bg-[#243351] rounded-xl border border-white/10 overflow-hidden"
        >
          <div className="px-5 py-4 bg-[#1a2744] border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">
                  Phase {phase.phase}: {phase.phaseName}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">{phase.phaseDescription}</p>
              </div>
              <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400">
                {phase.citations?.length || 0} sources
              </span>
            </div>
          </div>

          <div className="p-5">
            {phase.citations && phase.citations.length > 0 ? (
              <ul className="space-y-3">
                {phase.citations.map((citation, i) => (
                  <li key={i}>
                    {isUrl(citation) ? (
                      <a
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 bg-[#1a2744] rounded-lg hover:bg-[#1e3a5f] transition-colors group"
                      >
                        <svg
                          className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <span className="text-sm text-[#BBDCEF] group-hover:text-white break-all">
                          {formatUrl(citation)}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-500 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-[#1a2744] rounded-lg">
                        <svg
                          className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-300">{citation}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No citations recorded for this phase
              </p>
            )}
          </div>
        </div>
      ))}

      {findings.length === 0 && (
        <div className="bg-[#243351] rounded-xl border border-white/10 p-12 text-center">
          <svg
            className="w-12 h-12 text-gray-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No Sources Available</h3>
          <p className="text-gray-400">Citation data wasn&apos;t captured in this research.</p>
        </div>
      )}
    </div>
  );
}

function isUrl(text: string): boolean {
  return text.startsWith('http://') || text.startsWith('https://') || text.startsWith('www.');
}

function formatUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('www.') ? `https://${url}` : url);
    return parsed.hostname + parsed.pathname.slice(0, 50) + (parsed.pathname.length > 50 ? '...' : '');
  } catch {
    return url.slice(0, 60) + (url.length > 60 ? '...' : '');
  }
}

export { LibrarySources };
export type { LibrarySourcesProps };
