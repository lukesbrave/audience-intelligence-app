'use client';

import { FrontendReport } from '@/lib/types';
import {
  InsightCallout,
  SeverityChart,
  SEVERITY_COLORS,
  PRIORITY_COLORS,
  SectionNavigationCard,
  HeroInsight,
  ResearchScoreCard,
  QuickWinsCard
} from '@/components/ui';

interface ExecutiveSummaryProps {
  report: FrontendReport;
  generatedAt: string;
  onNavigate?: (section: string) => void;
}

// Extract the #1 opportunity for HeroInsight
function extractHeroInsight(report: FrontendReport): {
  insight: string;
  sourceCount: number;
  confidence: 'high' | 'medium' | 'low';
} {
  const { audienceProfile, researchFindings, synthesis } = report;
  const safeFindings = researchFindings || [];
  const safePainPoints = audienceProfile?.painPoints || [];
  const safeGoals = audienceProfile?.goals || [];
  const totalSources = safeFindings.reduce((sum, phase) => sum + (phase.citations?.length || 0), 0);

  // Determine confidence based on sources and data quality
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (totalSources >= 30 && safePainPoints.length >= 3) {
    confidence = 'high';
  } else if (totalSources < 15 || safePainPoints.length < 2) {
    confidence = 'low';
  }

  // Find the most critical pain point
  const criticalPainPoint = safePainPoints.find(p => p.severity === 'critical');

  if (criticalPainPoint) {
    return {
      insight: `Your target audience struggles most with ${criticalPainPoint.pain.toLowerCase()} — address this first for maximum impact`,
      sourceCount: totalSources,
      confidence
    };
  }

  // Fallback: extract from synthesis
  const synthLines = synthesis.split('\n').filter(line => {
    const lower = line.toLowerCase();
    return (
      (lower.includes('opportunity') || lower.includes('recommend') || lower.includes('should')) &&
      line.length > 30 && line.length < 200
    );
  });

  if (synthLines.length > 0) {
    const cleanLine = synthLines[0]
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^[-•]\s*/, '')
      .trim();
    return { insight: cleanLine, sourceCount: totalSources, confidence };
  }

  // Last resort: use the primary goal
  const primaryGoal = safeGoals.find(g => g.priority === 'high') || safeGoals[0];
  if (primaryGoal) {
    return {
      insight: `Help your audience achieve: ${primaryGoal.goal}`,
      sourceCount: totalSources,
      confidence
    };
  }

  return {
    insight: 'Review the detailed research findings to identify your key opportunities',
    sourceCount: totalSources,
    confidence: 'low'
  };
}

// Extract quick wins from marketing strategy
function extractQuickWins(report: FrontendReport): string[] {
  const { marketingStrategy, audienceProfile } = report;
  const safePainPoints = audienceProfile?.painPoints || [];
  const safeGoals = audienceProfile?.goals || [];
  const safeChannels = audienceProfile?.communicationPrefs?.channels || [];
  const wins: string[] = [];
  const skipPhrases = ['i need to', 'i cannot', 'search results', 'let me', 'available to me'];

  // Extract actionable items from marketing strategy
  const lines = marketingStrategy.split('\n');
  for (const line of lines) {
    const cleanLine = line
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^[-•\d.]+\s*/, '')
      .trim();

    if (cleanLine.length < 20 || cleanLine.length > 120) continue;
    if (skipPhrases.some(p => cleanLine.toLowerCase().includes(p))) continue;

    const lower = cleanLine.toLowerCase();
    if (
      lower.includes('start') ||
      lower.includes('focus') ||
      lower.includes('create') ||
      lower.includes('use') ||
      lower.includes('leverage') ||
      lower.includes('target') ||
      lower.includes('address')
    ) {
      if (!wins.includes(cleanLine)) {
        wins.push(cleanLine);
        if (wins.length >= 3) break;
      }
    }
  }

  // Fallback: generate from data
  if (wins.length < 3) {
    const topPainPoint = safePainPoints.find(p => p.severity === 'critical') || safePainPoints[0];
    const primaryGoal = safeGoals.find(g => g.priority === 'high') || safeGoals[0];
    const topChannel = safeChannels[0];

    if (wins.length < 1 && topPainPoint) {
      wins.push(`Address "${topPainPoint.pain.toLowerCase()}" in your messaging`);
    }
    if (wins.length < 2 && primaryGoal) {
      wins.push(`Focus on helping users achieve: ${primaryGoal.goal.toLowerCase()}`);
    }
    if (wins.length < 3 && topChannel) {
      wins.push(`Use ${topChannel} as your primary outreach channel`);
    }
  }

  return wins.slice(0, 3);
}

// Calculate research depth score
function calculateResearchScore(report: FrontendReport): {
  depth: number;
  sources: number;
  confidence: 'high' | 'medium' | 'low';
} {
  const { audienceProfile, researchFindings } = report;
  const safeFindings = researchFindings || [];
  const safePainPoints = audienceProfile?.painPoints || [];
  const safeGoals = audienceProfile?.goals || [];
  const totalSources = safeFindings.reduce((sum, phase) => sum + (phase.citations?.length || 0), 0);
  const phasesCount = safeFindings.length;

  // Calculate depth based on completeness of data
  let depthScore = 0;

  // Phases (max 20 points)
  depthScore += Math.min(20, phasesCount * 5);

  // Sources (max 30 points)
  depthScore += Math.min(30, totalSources);

  // Pain points (max 15 points)
  depthScore += Math.min(15, safePainPoints.length * 3);

  // Goals (max 15 points)
  depthScore += Math.min(15, safeGoals.length * 3);

  // Demographics completeness (max 10 points)
  const demo = audienceProfile?.demographics || {};
  if (demo.ageRange) depthScore += 2;
  if (demo.industry) depthScore += 2;
  if ((demo.jobTitles?.length || 0) > 0) depthScore += 3;
  if ((demo.locations?.length || 0) > 0) depthScore += 3;

  // Communication prefs (max 10 points)
  const commPrefs = audienceProfile?.communicationPrefs || {};
  if ((commPrefs.channels?.length || 0) > 0) depthScore += 5;
  if ((commPrefs.contentFormats?.length || 0) > 0) depthScore += 5;

  // Determine confidence
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (depthScore >= 70 && totalSources >= 30) {
    confidence = 'high';
  } else if (depthScore < 40 || totalSources < 15) {
    confidence = 'low';
  }

  return {
    depth: Math.min(100, depthScore),
    sources: totalSources,
    confidence
  };
}

// Extract top insights from synthesis content
function extractTopInsights(synthesis: string): string[] {
  const insights: string[] = [];
  const skipPhrases = ['i need to', 'i cannot', 'search results', 'let me', 'available to me', 'i appreciate'];

  // Clean markdown
  const clean = (text: string) => text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/[#_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const lines = synthesis.split('\n');

  // First pass: look for insight-rich lines
  for (const line of lines) {
    const cleanLine = clean(line);
    if (cleanLine.length < 25 || cleanLine.length > 150) continue;
    if (skipPhrases.some(p => cleanLine.toLowerCase().includes(p))) continue;

    const lower = cleanLine.toLowerCase();
    if (
      lower.includes('key') ||
      lower.includes('primary') ||
      lower.includes('should') ||
      lower.includes('recommend') ||
      lower.includes('focus') ||
      lower.includes('opportunity') ||
      lower.includes('audience') ||
      lower.includes('important') ||
      lower.includes('critical')
    ) {
      if (!insights.some(i => i.toLowerCase() === cleanLine.toLowerCase())) {
        insights.push(cleanLine);
        if (insights.length >= 4) break;
      }
    }
  }

  // Fallback: take meaningful sentences
  if (insights.length < 4) {
    const sentences = clean(synthesis)
      .split(/[.!?]/)
      .filter(s => s.trim().length > 30 && s.trim().length < 150)
      .filter(s => !skipPhrases.some(p => s.toLowerCase().includes(p)));

    for (const s of sentences) {
      if (insights.length >= 4) break;
      const trimmed = s.trim();
      if (!insights.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
        insights.push(trimmed);
      }
    }
  }

  return insights.slice(0, 4);
}

function ExecutiveSummary({ report, generatedAt, onNavigate }: ExecutiveSummaryProps) {
  const { audienceProfile, researchFindings } = report;

  // Defensive defaults for malformed data
  const safeAudienceProfile = {
    painPoints: audienceProfile?.painPoints || [],
    goals: audienceProfile?.goals || [],
    demographics: audienceProfile?.demographics || {
      ageRange: 'Not available',
      industry: 'Not available',
      incomeLevel: 'Not available',
      jobTitles: [],
      locations: []
    },
    communicationPrefs: audienceProfile?.communicationPrefs || {
      channels: [],
      contentFormats: [],
      tonePreference: ''
    }
  };
  const safeResearchFindings = researchFindings || [];

  // Calculate metrics with safe defaults
  const painPointsCount = safeAudienceProfile.painPoints.length;
  const goalsCount = safeAudienceProfile.goals.length;
  const phasesCount = safeResearchFindings.length;
  const totalSources = safeResearchFindings.reduce((sum, phase) => sum + (phase.citations?.length || 0), 0);

  // Severity distribution for pain points
  const severityCounts = {
    critical: safeAudienceProfile.painPoints.filter(p => p.severity === 'critical').length,
    moderate: safeAudienceProfile.painPoints.filter(p => p.severity === 'moderate').length,
    minor: safeAudienceProfile.painPoints.filter(p => p.severity === 'minor').length
  };

  // Priority distribution for goals
  const priorityCounts = {
    high: safeAudienceProfile.goals.filter(g => g.priority === 'high').length,
    medium: safeAudienceProfile.goals.filter(g => g.priority === 'medium').length,
    low: safeAudienceProfile.goals.filter(g => g.priority === 'low').length
  };

  // Get top pain point (critical severity, first one)
  const topPainPoint = safeAudienceProfile.painPoints.find(p => p.severity === 'critical') || safeAudienceProfile.painPoints[0];

  // Get primary goal (high priority, first one)
  const primaryGoal = safeAudienceProfile.goals.find(g => g.priority === 'high') || safeAudienceProfile.goals[0];

  // Extract data for new components
  const heroInsight = extractHeroInsight(report);
  const researchScore = calculateResearchScore(report);
  const quickWins = extractQuickWins(report);
  const topInsights = extractTopInsights(report.synthesis || '');

  const formattedDate = new Date(generatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <section id="overview" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research Report</h1>
          <p className="text-sm text-gray-500 mt-1">Generated {formattedDate}</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Complete
        </span>
      </div>

      {/* NEW: Hero Insight - The #1 Opportunity */}
      <HeroInsight
        insight={heroInsight.insight}
        sourceCount={heroInsight.sourceCount}
        confidence={heroInsight.confidence}
      />

      {/* NEW: Research Score Card - Gamified Stats */}
      <ResearchScoreCard
        depth={researchScore.depth}
        sourceCount={researchScore.sources}
        confidence={researchScore.confidence}
      />

      {/* NEW: Quick Wins - 3 Actionable Items */}
      {quickWins.length > 0 && (
        <QuickWinsCard wins={quickWins} />
      )}

      {/* Key Insights from Synthesis */}
      {topInsights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topInsights.map((insight, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-[#BBDCEF] hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#BBDCEF]/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#16314C]">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3">
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {painPointsCount} pain point{painPointsCount !== 1 ? 's' : ''}
          {severityCounts.critical > 0 && <span className="text-red-600 font-medium">({severityCounts.critical} critical)</span>}
        </span>
        <span className="text-gray-300">•</span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {goalsCount} goal{goalsCount !== 1 ? 's' : ''}
        </span>
        <span className="text-gray-300">•</span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {phasesCount} research phase{phasesCount !== 1 ? 's' : ''}
        </span>
        <span className="text-gray-300">•</span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {totalSources} source{totalSources !== 1 ? 's' : ''} cited
        </span>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <SeverityChart
            title="Pain Point Severity"
            type="bar"
            segments={[
              { label: 'Critical', value: severityCounts.critical, color: SEVERITY_COLORS.critical },
              { label: 'Moderate', value: severityCounts.moderate, color: SEVERITY_COLORS.moderate },
              { label: 'Minor', value: severityCounts.minor, color: SEVERITY_COLORS.minor }
            ]}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <SeverityChart
            title="Goal Priority"
            type="bar"
            segments={[
              { label: 'High', value: priorityCounts.high, color: PRIORITY_COLORS.high },
              { label: 'Medium', value: priorityCounts.medium, color: PRIORITY_COLORS.medium },
              { label: 'Low', value: priorityCounts.low, color: PRIORITY_COLORS.low }
            ]}
          />
        </div>
      </div>

      {/* Key Insights */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Highlighted Findings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topPainPoint && (
            <InsightCallout
              variant="warning"
              title="Top Pain Point"
              description={topPainPoint.pain}
            />
          )}

          {primaryGoal && (
            <InsightCallout
              variant="action"
              title="Primary Goal"
              description={primaryGoal.goal}
            />
          )}
        </div>

        {/* Demographics Quick View */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Target Audience</h4>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {safeAudienceProfile.demographics.ageRange}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {safeAudienceProfile.demographics.industry}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {safeAudienceProfile.demographics.incomeLevel}
            </span>
            {safeAudienceProfile.demographics.jobTitles.slice(0, 2).map((title, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#BBDCEF]/30 text-[#16314C]">
                {title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section Navigation Cards */}
      {onNavigate && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Explore Sections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionNavigationCard
              title="Audience Profile"
              description="Demographics, pain points, goals, and communication preferences"
              stats={`${painPointsCount} pain points, ${goalsCount} goals`}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              onClick={() => onNavigate('audience-profile')}
            />
            <SectionNavigationCard
              title="Research Findings"
              description="Deep research across multiple phases with cited sources"
              stats={`${phasesCount} phases, ${totalSources} sources`}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              onClick={() => onNavigate('research-findings')}
            />
            <SectionNavigationCard
              title="Synthesis"
              description="Key patterns and insights synthesized from research"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              onClick={() => onNavigate('synthesis')}
            />
            <SectionNavigationCard
              title="Marketing Strategy"
              description="Actionable recommendations and channel strategies"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              }
              onClick={() => onNavigate('marketing-strategy')}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export { ExecutiveSummary };
export type { ExecutiveSummaryProps };
