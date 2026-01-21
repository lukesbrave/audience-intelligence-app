'use client';

import { Collapsible, RichTextDisplay } from '@/components/ui';
import { ResearchFinding } from '@/lib/types';

interface ResearchFindingsSectionProps {
  findings: ResearchFinding[];
  defaultOpen?: boolean;
}

function ResearchFindingsSection({ findings, defaultOpen = false }: ResearchFindingsSectionProps) {
  return (
    <Collapsible
      title="Research Findings"
      badge={`${findings.length} phases`}
      defaultOpen={defaultOpen}
    >
      <div className="space-y-4">
        {findings.map((finding) => (
          <Collapsible
            key={finding.phase}
            title={`Phase ${finding.phase}: ${finding.phaseName}`}
            badge={`${finding.citations.length} sources`}
            defaultOpen={false}
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-500 italic">{finding.phaseDescription}</p>

              <RichTextDisplay content={finding.findings} />

              {finding.citations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Sources
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {finding.citations.map((citation, index) => (
                      <a
                        key={index}
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#16314C] bg-[#BBDCEF]/30 hover:bg-[#BBDCEF]/50 px-2 py-1 rounded transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
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
                        Source {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Collapsible>
        ))}
      </div>
    </Collapsible>
  );
}

export { ResearchFindingsSection };
export type { ResearchFindingsSectionProps };
