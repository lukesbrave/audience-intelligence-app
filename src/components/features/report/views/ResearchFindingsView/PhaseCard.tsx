'use client';

import { ResearchFinding } from '@/lib/types';

interface PhaseCardProps {
  finding: ResearchFinding;
  onClick: () => void;
}

function PhaseCard({ finding, onClick }: PhaseCardProps) {
  // Extract first meaningful sentence as preview (skip AI meta-commentary)
  const skipPhrases = ['i need to', 'i cannot', 'search results', 'available to me', 'i appreciate'];

  const sentences = finding.findings.split(/[.!?]/);
  let previewText = '';

  for (const sentence of sentences) {
    const cleaned = sentence
      .replace(/\*\*/g, '')  // Remove bold markers first
      .replace(/[#*_]/g, '') // Remove other markdown
      .trim();

    if (cleaned.length > 20 && cleaned.length < 200) {
      if (!skipPhrases.some(phrase => cleaned.toLowerCase().includes(phrase))) {
        previewText = cleaned.slice(0, 150);
        break;
      }
    }
  }

  // Fallback to first sentence if no good one found
  if (!previewText) {
    previewText = finding.findings
      .split(/[.!?]/)[0]
      ?.slice(0, 150)
      .replace(/\*\*/g, '')
      .replace(/[#*_]/g, '')
      .trim() || '';
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-[#BBDCEF] hover:shadow-md transition-all duration-200 group"
    >
      {/* Phase number and name */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#16314C] text-white flex items-center justify-center font-bold">
          {finding.phase}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-[#16314C] transition-colors">
            {finding.phaseName}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
            {finding.phaseDescription}
          </p>
        </div>
      </div>

      {/* Preview text */}
      {previewText && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {previewText}...
        </p>
      )}

      {/* Footer with source count and action */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="inline-flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {finding.citations.length} source{finding.citations.length !== 1 ? 's' : ''}
        </span>
        <span className="inline-flex items-center text-sm font-medium text-[#16314C] group-hover:translate-x-1 transition-transform">
          View Details
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </button>
  );
}

export { PhaseCard };
export type { PhaseCardProps };
