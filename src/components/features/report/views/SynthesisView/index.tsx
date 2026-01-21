'use client';

import { RichTextDisplay, InsightCallout, Badge } from '@/components/ui';

interface SynthesisViewProps {
  synthesis: string;
}

// Clean markdown from text
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, '')  // Remove bold
    .replace(/\*/g, '')    // Remove italics
    .replace(/[#_]/g, '')  // Remove headers and underscores
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .trim();
}

// Extract key takeaways from synthesis content
function extractKeyTakeaways(content: string): { insights: string[]; actions: string[] } {
  const insights: string[] = [];
  const actions: string[] = [];

  // Skip phrases that indicate AI meta-commentary
  const skipPhrases = [
    'i need to',
    'i cannot',
    'search results',
    'available to me',
    'i appreciate',
    'let me'
  ];

  // Look for sections that might contain key insights
  const lines = content.split('\n');

  for (const line of lines) {
    const cleanLine = cleanMarkdown(line);

    // Skip empty lines, very short lines, or AI commentary
    if (cleanLine.length < 15) continue;
    if (cleanLine.length > 200) continue;
    if (skipPhrases.some(phrase => cleanLine.toLowerCase().includes(phrase))) continue;

    const lowerLine = cleanLine.toLowerCase();

    // Look for action-oriented language
    if (
      lowerLine.includes('should') ||
      lowerLine.includes('recommend') ||
      lowerLine.includes('focus on') ||
      lowerLine.includes('prioritize')
    ) {
      if (actions.length < 3) {
        actions.push(cleanLine);
      }
    }
    // Look for insight patterns
    else if (
      lowerLine.includes('key') ||
      lowerLine.includes('important') ||
      lowerLine.includes('finding') ||
      lowerLine.includes('audience')
    ) {
      if (insights.length < 3) {
        insights.push(cleanLine);
      }
    }
  }

  // If we didn't find enough, take first few meaningful sentences
  if (insights.length === 0 && actions.length === 0) {
    const sentences = cleanMarkdown(content)
      .split(/[.!?]/)
      .filter(s => {
        const trimmed = s.trim();
        return trimmed.length > 30 &&
               trimmed.length < 200 &&
               !skipPhrases.some(phrase => trimmed.toLowerCase().includes(phrase));
      })
      .slice(0, 4);

    sentences.forEach((s, i) => {
      if (i < 2) insights.push(s.trim());
      else actions.push(s.trim());
    });
  }

  return { insights, actions };
}

// Extract themes from content (look for repeated words, capitalized terms, quoted items)
function extractThemes(content: string): string[] {
  const themes: string[] = [];

  // Skip terms that are just markdown artifacts or meta-content
  const skipTerms = ['i', 'the', 'this', 'that', 'what', 'how', 'why', 'can', 'cannot'];

  // Look for quoted terms
  const quotedMatches = content.match(/"([^"]+)"/g);
  if (quotedMatches) {
    quotedMatches.slice(0, 3).forEach(match => {
      const term = match.replace(/"/g, '').trim();
      if (term.length > 2 && term.length < 30 && !themes.includes(term) && !skipTerms.includes(term.toLowerCase())) {
        themes.push(term);
      }
    });
  }

  // Look for bold terms (but clean them properly)
  const boldMatches = content.match(/\*\*([^*]+)\*\*/g);
  if (boldMatches) {
    boldMatches.slice(0, 5).forEach(match => {
      const term = match.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      if (term.length > 2 && term.length < 25 && !themes.includes(term) && !skipTerms.includes(term.toLowerCase())) {
        themes.push(term);
      }
    });
  }

  // Common marketing/research themes to look for
  const commonThemes = [
    'efficiency', 'trust', 'integration', 'support', 'price', 'quality',
    'reliability', 'ease of use', 'scalability', 'security', 'performance',
    'community', 'education', 'awareness', 'engagement', 'conversion'
  ];

  const lowerContent = content.toLowerCase();
  commonThemes.forEach(theme => {
    if (lowerContent.includes(theme) && !themes.some(t => t.toLowerCase() === theme)) {
      themes.push(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
  });

  return themes.slice(0, 8);
}

function SynthesisView({ synthesis }: SynthesisViewProps) {
  const { insights, actions } = extractKeyTakeaways(synthesis);
  const themes = extractThemes(synthesis);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Synthesis</h1>
        <p className="text-sm text-gray-500 mt-1">
          Key patterns and actionable insights from your research
        </p>
      </div>

      {/* Key Takeaways */}
      {(insights.length > 0 || actions.length > 0) && (
        <div className="bg-[#BBDCEF]/10 rounded-xl border border-[#BBDCEF]/30 p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Key Takeaways
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, i) => (
              <InsightCallout
                key={`insight-${i}`}
                variant="insight"
                title={`Key Insight ${i + 1}`}
                description={insight}
              />
            ))}
            {actions.map((action, i) => (
              <InsightCallout
                key={`action-${i}`}
                variant="action"
                title={`Action Item ${i + 1}`}
                description={action}
              />
            ))}
          </div>
        </div>
      )}

      {/* Themes */}
      {themes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Themes Identified
          </h3>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme, i) => (
              <Badge key={i} variant="default" size="md">
                {theme}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Detailed Analysis
        </h3>
        <div className="prose prose-gray max-w-none">
          <RichTextDisplay content={synthesis} />
        </div>
      </div>
    </div>
  );
}

export { SynthesisView };
export type { SynthesisViewProps };
