'use client';

import { FrontendReport } from '@/lib/types';
import { ConfidenceIndicator } from '@/components/ui';

interface DashboardSectionProps {
  report: FrontendReport;
  generatedAt: string;
  onNavigate: (section: string) => void;
  googleDocUrl?: string;
  onSave?: () => void;
  isSaved?: boolean;
  hasOfferData?: boolean;
  onGenerateOffer?: () => void;
  isGeneratingOffer?: boolean;
}

function DashboardSection({
  report,
  generatedAt,
  onNavigate,
  googleDocUrl,
  onSave,
  isSaved = false,
  hasOfferData = false,
  onGenerateOffer,
  isGeneratingOffer = false,
}: DashboardSectionProps) {
  const { audienceProfile, researchFindings } = report;

  const painPoints = audienceProfile?.painPoints || [];
  const goals = audienceProfile?.goals || [];
  const findings = researchFindings || [];
  const totalSources = findings.reduce((sum, phase) => sum + (phase.citations?.length || 0), 0);

  // Calculate depth score
  let depthScore = 0;
  depthScore += Math.min(20, findings.length * 5);
  depthScore += Math.min(30, totalSources);
  depthScore += Math.min(15, painPoints.length * 3);
  depthScore += Math.min(15, goals.length * 3);
  const demo = audienceProfile?.demographics || {};
  if (demo.ageRange) depthScore += 2;
  if (demo.industry) depthScore += 2;
  if ((demo.jobTitles?.length || 0) > 0) depthScore += 3;
  if ((demo.locations?.length || 0) > 0) depthScore += 3;
  const commPrefs = audienceProfile?.communicationPrefs || {};
  if ((commPrefs.channels?.length || 0) > 0) depthScore += 5;
  if ((commPrefs.contentFormats?.length || 0) > 0) depthScore += 5;
  depthScore = Math.min(100, depthScore);

  const confidence: 'high' | 'medium' | 'low' =
    depthScore >= 70 && totalSources >= 30 ? 'high' : depthScore < 40 || totalSources < 15 ? 'low' : 'medium';

  const criticalPainPoint = painPoints.find((p) => p.severity === 'critical');
  const primaryGoal = goals.find((g) => g.priority === 'high') || goals[0];

  const urgencyGateway = audienceProfile?.urgencyGateway;

  const formattedDate = new Date(generatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Research Report</h1>
          <p className="text-sm text-gray-400 mt-1">Generated {formattedDate}</p>
        </div>

        <div className="flex items-center gap-3">
          {googleDocUrl && (
            <a
              href={googleDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Doc
            </a>
          )}
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                isSaved
                  ? 'bg-green-500/20 text-green-400 cursor-default'
                  : 'bg-[#BBDCEF] text-[#1a2744] hover:bg-[#9fcce8]'
              }`}
            >
              {isSaved ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* #1 Opportunity Card */}
      <div className="bg-gradient-to-br from-[#243351] to-[#1e3a5f] rounded-xl border border-[#BBDCEF]/20 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#BBDCEF] mb-2">
              Your #1 Opportunity
            </p>
            <p className="text-xl font-medium text-white leading-relaxed">
              {criticalPainPoint
                ? `Help your audience overcome: "${criticalPainPoint.pain}"`
                : primaryGoal
                ? `Help your audience achieve: "${primaryGoal.goal}"`
                : 'Review the detailed research findings to identify your key opportunities'}
            </p>
          </div>
          <ConfidenceIndicator level={confidence} sourceCount={totalSources} showLabel />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#243351] rounded-xl border border-white/10 p-4 text-center">
          <p className="text-3xl font-bold text-white">{depthScore}%</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">Depth</p>
        </div>
        <div className="bg-[#243351] rounded-xl border border-white/10 p-4 text-center">
          <p className="text-3xl font-bold text-white">{totalSources}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">Sources</p>
        </div>
        <div className="bg-[#243351] rounded-xl border border-white/10 p-4 text-center">
          <p className="text-3xl font-bold text-white capitalize">{confidence}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">Confidence</p>
        </div>
      </div>

      {/* Quick Wins */}
      {urgencyGateway && (
        <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⚡</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Wins - Start Here
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-[#1a2744] rounded-lg">
              <span className="text-[#BBDCEF]">☑</span>
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">Entry Offer:</span>{' '}
                {urgencyGateway.aspirinSolution}
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#1a2744] rounded-lg">
              <span className="text-[#BBDCEF]">☑</span>
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">Gateway Problem:</span>{' '}
                {urgencyGateway.problem}
              </p>
            </div>
            {criticalPainPoint && (
              <div className="flex items-start gap-3 p-3 bg-[#1a2744] rounded-lg">
                <span className="text-[#BBDCEF]">☑</span>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">Critical Pain:</span>{' '}
                  {criticalPainPoint.pain}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Urgency Gateway Preview */}
      {urgencyGateway && (
        <div className="bg-[#243351] rounded-xl border border-amber-500/20 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            The Urgency Gateway
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Their most pressing problem RIGHT NOW
          </p>
          <blockquote className="text-lg font-medium text-white border-l-2 border-amber-500 pl-4 mb-4">
            &ldquo;{urgencyGateway.problem}&rdquo;
          </blockquote>
          <p className="text-sm text-gray-400 mb-4">{urgencyGateway.whyUrgent}</p>
          <button
            onClick={() => onNavigate('your-audience')}
            className="text-sm text-[#BBDCEF] hover:text-white transition-colors"
          >
            Explore Your Audience →
          </button>
        </div>
      )}

      {/* Navigation Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('your-audience')}
          className="bg-[#243351] rounded-xl border border-white/10 p-5 text-left hover:border-[#BBDCEF]/30 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">👤</span>
            <h4 className="font-medium text-white group-hover:text-[#BBDCEF] transition-colors">
              Your Audience
            </h4>
          </div>
          <p className="text-sm text-gray-400">
            Who they are, what they struggle with
          </p>
        </button>

        <button
          onClick={() => onNavigate('your-message')}
          className="bg-[#243351] rounded-xl border border-white/10 p-5 text-left hover:border-[#BBDCEF]/30 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">💬</span>
            <h4 className="font-medium text-white group-hover:text-[#BBDCEF] transition-colors">
              Your Message
            </h4>
          </div>
          <p className="text-sm text-gray-400">
            The exact words they use - copy-paste ready
          </p>
        </button>

        <button
          onClick={() => onNavigate('your-channels')}
          className="bg-[#243351] rounded-xl border border-white/10 p-5 text-left hover:border-[#BBDCEF]/30 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">📍</span>
            <h4 className="font-medium text-white group-hover:text-[#BBDCEF] transition-colors">
              Your Channels
            </h4>
          </div>
          <p className="text-sm text-gray-400">
            Where to find them online
          </p>
        </button>

        <button
          onClick={() => (hasOfferData ? onNavigate('your-offer') : onGenerateOffer?.())}
          disabled={isGeneratingOffer}
          className="bg-[#243351] rounded-xl border border-white/10 p-5 text-left hover:border-[#BBDCEF]/30 transition-colors group disabled:opacity-50"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">🎯</span>
            <h4 className="font-medium text-white group-hover:text-[#BBDCEF] transition-colors">
              {hasOfferData ? 'Your Offer' : 'Generate Offer'}
            </h4>
            {isGeneratingOffer && (
              <svg className="w-4 h-4 animate-spin text-[#BBDCEF]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {hasOfferData ? 'View your value ladder' : 'Turn research into offers'}
          </p>
        </button>
      </div>
    </div>
  );
}

export { DashboardSection };
export type { DashboardSectionProps };
