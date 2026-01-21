'use client';

import { OfferBuilderResponse, UrgencyGateway } from '@/lib/types';
import { OfferStageCard, CopyButton, Spinner } from '@/components/ui';

interface YourOfferSectionProps {
  offerData: OfferBuilderResponse | null;
  urgencyGateway?: UrgencyGateway;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
}

function YourOfferSection({
  offerData,
  urgencyGateway,
  isLoading,
  error,
  onGenerate,
}: YourOfferSectionProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="lg" />
        <h3 className="text-lg font-medium text-white mt-4 mb-2">Generating Your Offer</h3>
        <p className="text-sm text-gray-400 max-w-md text-center">
          Analyzing your research data and crafting a compelling offer based on your
          audience&apos;s Urgency Gateway...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Offer Generation Failed</h3>
        <p className="text-sm text-gray-400 max-w-md text-center mb-4">{error}</p>
        <button
          onClick={onGenerate}
          className="px-6 py-2 bg-[#BBDCEF] text-[#1a2744] font-medium rounded-lg hover:bg-[#9fcce8] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state - no offer yet
  if (!offerData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Offer</h1>
          <p className="text-sm text-gray-400 mt-1">
            Turn your research into something you can sell
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-12 bg-[#243351] rounded-xl border border-white/10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#BBDCEF]/20 to-[#BBDCEF]/5 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-[#BBDCEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Generate Your Value Ladder</h3>
          <p className="text-gray-400 max-w-lg text-center mb-6">
            Based on your research findings, we&apos;ll create a complete offer structure that
            speaks directly to your audience&apos;s most pressing problem.
          </p>

          {urgencyGateway && (
            <div className="bg-[#1a2744] rounded-lg p-4 mb-6 max-w-md text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Based on</p>
              <p className="text-sm text-white">&ldquo;{urgencyGateway.problem}&rdquo;</p>
            </div>
          )}

          <button
            onClick={onGenerate}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#BBDCEF] text-[#1a2744] font-medium rounded-lg hover:bg-[#9fcce8] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Your Offer
          </button>
        </div>
      </div>
    );
  }

  // Offer exists - show value ladder
  const valueLadder = offerData.valueLadder || [];
  const messaging = offerData.messagingFramework;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Your Offer</h1>
        <p className="text-sm text-gray-400 mt-1">
          Turn your research into something you can sell
        </p>
      </div>

      {/* Strategy Intro */}
      <div className="bg-gradient-to-br from-[#243351] to-[#1e3a5f] rounded-xl border border-[#BBDCEF]/20 p-6">
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">The Value Ladder Strategy</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Based on your audience&apos;s journey, here&apos;s the offer structure that will
              resonate. Start with the Entry Offer to solve their immediate pain, then guide
              them through increasingly valuable solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Value Ladder */}
      {valueLadder.length > 0 ? (
        <div className="space-y-4">
          {valueLadder.map((stage, i) => {
            const level = i === 0 ? 'entry' : i === 1 ? 'scaling' : i === 2 ? 'core' : 'premium';
            return (
              <OfferStageCard
                key={i}
                level={level as 'entry' | 'scaling' | 'core' | 'premium'}
                name={stage.stageName || stage.offer}
                priceRange={stage.pricePoint}
                problemSolved={stage.problem}
                promise={stage.outcome}
              />
            );
          })}
        </div>
      ) : urgencyGateway ? (
        // Fallback if no value ladder but we have urgency gateway
        <div className="space-y-4">
          <OfferStageCard
            level="entry"
            name="Entry Offer"
            priceRange="$47 - $97"
            problemSolved={urgencyGateway.problem}
            promise={urgencyGateway.aspirinSolution}
            format="Quick-start guide or templates"
          />
        </div>
      ) : null}

      {/* Messaging Framework */}
      {messaging && (
        <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Ready-to-Use Messaging
          </p>

          <div className="space-y-4">
            {messaging.hook && (
              <div className="bg-[#1a2744] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#BBDCEF]">
                    The Hook
                  </p>
                  <CopyButton text={messaging.hook} size="sm" />
                </div>
                <p className="text-sm text-gray-300">{messaging.hook}</p>
              </div>
            )}

            {messaging.agitate && (
              <div className="bg-[#1a2744] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    The Agitate
                  </p>
                  <CopyButton text={messaging.agitate} size="sm" />
                </div>
                <p className="text-sm text-gray-300">{messaging.agitate}</p>
              </div>
            )}

            {messaging.solution && (
              <div className="bg-[#1a2744] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-400">
                    The Solution
                  </p>
                  <CopyButton text={messaging.solution} size="sm" />
                </div>
                <p className="text-sm text-gray-300">{messaging.solution}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {offerData.quickWins && offerData.quickWins.length > 0 && (
        <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Quick Wins to Implement
          </p>
          <div className="space-y-2">
            {offerData.quickWins.map((win, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#1a2744] rounded-lg">
                <span className="text-[#BBDCEF]">☑</span>
                <p className="text-sm text-gray-300">{win}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { YourOfferSection };
export type { YourOfferSectionProps };
