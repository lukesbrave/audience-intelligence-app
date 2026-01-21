'use client';

import { ResearchFinding } from '@/lib/types';
import { RichTextDisplay, InsightCallout } from '@/components/ui';
import { CitationCard } from './CitationCard';

interface PhaseDetailViewProps {
  finding: ResearchFinding;
  onBack: () => void;
}

// Extract key findings from markdown content - filters out AI meta-commentary
function extractKeyFindings(content: string): string[] {
  const keyFindings: string[] = [];

  // Skip phrases that indicate AI meta-commentary
  const skipPhrases = [
    'i need to clarify',
    'i cannot',
    'i can\'t',
    'search results',
    'available to me',
    'i appreciate',
    'let me',
    'what i can offer',
    'i would need',
    'this means i cannot',
    'to properly address',
    'you would need',
    'what i *can* offer'
  ];

  const lines = content.split('\n');

  // First pass: look for meaningful bullet points or numbered items
  for (const line of lines) {
    const cleanLine = line.replace(/^[-*•\d.)\s#]+/, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();

    // Skip if too short, too long, or contains AI commentary
    if (cleanLine.length < 20 || cleanLine.length > 200) continue;
    if (skipPhrases.some(phrase => cleanLine.toLowerCase().includes(phrase))) continue;

    // Look for meaningful findings
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().startsWith('* ');
    const isNumbered = /^\d+\./.test(line.trim());
    const hasData = cleanLine.match(/\d+%/) || cleanLine.match(/\d+ (users?|people|companies|businesses|percent)/i);
    const hasKeyValue = cleanLine.includes(': ') && !cleanLine.toLowerCase().startsWith('what');

    if ((isBullet || isNumbered || hasData || hasKeyValue) && keyFindings.length < 3) {
      keyFindings.push(cleanLine);
    }
  }

  // Second pass: look for bold text that isn't AI commentary
  if (keyFindings.length === 0) {
    const boldMatches = content.match(/\*\*([^*]+)\*\*/g) || [];
    for (const match of boldMatches) {
      const text = match.replace(/\*\*/g, '').trim();
      if (text.length > 10 && text.length < 150) {
        if (!skipPhrases.some(phrase => text.toLowerCase().includes(phrase))) {
          keyFindings.push(text);
          if (keyFindings.length >= 3) break;
        }
      }
    }
  }

  // Final fallback: extract sentences that look like findings (not meta-commentary)
  if (keyFindings.length === 0) {
    const sentences = content
      .replace(/[#*_]/g, '')
      .split(/[.!?]/)
      .filter(s => {
        const trimmed = s.trim();
        return trimmed.length > 30 &&
               trimmed.length < 200 &&
               !skipPhrases.some(phrase => trimmed.toLowerCase().includes(phrase));
      })
      .slice(0, 3);
    keyFindings.push(...sentences.map(s => s.trim()));
  }

  return keyFindings.slice(0, 3);
}

function PhaseDetailView({ finding, onBack }: PhaseDetailViewProps) {
  const keyFindings = extractKeyFindings(finding.findings);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center text-sm text-gray-600 hover:text-[#16314C] transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to All Phases
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#16314C] text-white flex items-center justify-center text-2xl font-bold">
            {finding.phase}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Phase {finding.phase}: {finding.phaseName}
            </h1>
            <p className="text-gray-600 mt-1">{finding.phaseDescription}</p>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      {keyFindings.length > 0 && (
        <div className="bg-[#BBDCEF]/10 rounded-xl border border-[#BBDCEF]/30 p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Key Findings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {keyFindings.map((finding, i) => (
              <InsightCallout
                key={i}
                variant="insight"
                title={`Finding ${i + 1}`}
                description={finding}
              />
            ))}
          </div>
        </div>
      )}

      {/* Full Findings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Detailed Findings
        </h3>
        <div className="prose prose-gray max-w-none">
          <RichTextDisplay content={finding.findings} />
        </div>
      </div>

      {/* Sources */}
      {finding.citations.length > 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Sources
            </h3>
            <span className="text-sm text-gray-500">
              {finding.citations.length} source{finding.citations.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {finding.citations.map((citation, i) => (
              <CitationCard key={i} url={citation} index={i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { PhaseDetailView };
export type { PhaseDetailViewProps };
