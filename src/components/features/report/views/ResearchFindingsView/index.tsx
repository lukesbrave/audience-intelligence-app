'use client';

import { ResearchFinding } from '@/lib/types';
import { PhaseTimeline } from '@/components/ui';
import { PhaseCard } from './PhaseCard';

interface ResearchFindingsViewProps {
  findings: ResearchFinding[];
  onNavigate: (section: string) => void;
}

function ResearchFindingsView({ findings, onNavigate }: ResearchFindingsViewProps) {
  const totalSources = findings.reduce((sum, f) => sum + f.citations.length, 0);

  const handlePhaseClick = (phase: number) => {
    onNavigate(`phase-${phase}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research Findings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Deep research across {findings.length} phases
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {findings.length} Phases
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {totalSources} Sources
          </span>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="pt-8 pb-4">
        <PhaseTimeline
          phases={findings.map(f => ({ phase: f.phase, name: f.phaseName }))}
          onPhaseClick={handlePhaseClick}
        />
      </div>

      {/* Phase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {findings.map(finding => (
          <PhaseCard
            key={finding.phase}
            finding={finding}
            onClick={() => handlePhaseClick(finding.phase)}
          />
        ))}
      </div>
    </div>
  );
}

export { ResearchFindingsView };
export type { ResearchFindingsViewProps };
