'use client';

import { Card, Badge, Spinner } from '@/components/ui';

// Define a flexible type for the offer data since the n8n workflow can return various structures
interface OfferBlueprint {
  headline?: string;
  subheadline?: string;
  targetAudience?: string;
  solution?: string;
  benefits?: Array<{ benefit: string; proof?: string }>;
  guarantee?: string;
  cta?: string;
}

interface OfferData {
  success?: boolean;
  generatedAt?: string;
  offerBlueprint?: OfferBlueprint;
  theOfferGivesYou?: string[];
  youCanUseItTo?: string[];
  hiddenBenefits?: string[];
  programNameOptions?: Array<{ name: string; uniqueMechanism: string; rationale: string }>;
  variations?: Array<{ type: string; text: string }>;
  fullNarrative?: string;
  valueLadder?: Array<{
    stage: number;
    stageName: string;
    problem: string;
    offer: string;
    pricePoint: string;
    outcome: string;
  }>;
}

interface OfferBuilderViewProps {
  offerData: OfferData | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
}

function OfferBuilderView({ offerData, isLoading, error, onGenerate }: OfferBuilderViewProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <Spinner size="lg" />
        <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Generating Your Offer</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Analyzing your research data and crafting a compelling offer statement based on your
          audience&apos;s Urgency Gateway and language patterns...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Offer Generation Failed</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">{error}</p>
        <button
          onClick={onGenerate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#16314C] text-white rounded-lg hover:bg-[#1e4366] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state - no offer generated yet
  if (!offerData) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#16314C]/10 to-[#BBDCEF]/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Your Urgency Gateway Offer</h3>
        <p className="text-gray-500 max-w-lg mx-auto mb-6">
          Based on your research findings, we&apos;ll create a compelling offer that speaks directly to
          your audience&apos;s most pressing problem using their own language.
        </p>
        <button
          onClick={onGenerate}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#16314C] to-[#1e4366] text-white font-medium rounded-lg hover:from-[#1e4366] hover:to-[#16314C] transition-all shadow-md"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate Your Offer
        </button>
      </div>
    );
  }

  // Extract data with defaults
  const blueprint = offerData.offerBlueprint || {};
  const theOfferGivesYou = offerData.theOfferGivesYou || [];
  const youCanUseItTo = offerData.youCanUseItTo || [];
  const hiddenBenefits = offerData.hiddenBenefits || [];
  const programNameOptions = offerData.programNameOptions || [];
  const variations = offerData.variations || [];
  const valueLadder = offerData.valueLadder || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Offer</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generated from your research — ready to use in your marketing
        </p>
      </div>

      {/* Main Offer Card */}
      {blueprint.headline && (
        <Card padding="lg" className="bg-gradient-to-br from-[#16314C] to-[#1e4366] text-white">
          <div className="space-y-4">
            <Badge variant="default" className="bg-white/20 text-white border-white/30">
              Urgency Gateway Offer
            </Badge>
            <h2 className="text-2xl font-bold leading-tight">
              {blueprint.headline}
            </h2>
            {blueprint.subheadline && (
              <p className="text-lg text-white/80">
                {blueprint.subheadline}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Offer Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Audience */}
        {blueprint.targetAudience && (
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Target Audience
            </h3>
            <p className="text-gray-700">{blueprint.targetAudience}</p>
          </Card>
        )}

        {/* Solution */}
        {blueprint.solution && (
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              The Solution
            </h3>
            <p className="text-gray-700">{blueprint.solution}</p>
          </Card>
        )}
      </div>

      {/* Benefits */}
      {blueprint.benefits && blueprint.benefits.length > 0 && (
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Key Benefits
          </h3>
          <div className="space-y-3">
            {blueprint.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-green-50/50 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{b.benefit}</p>
                  {b.proof && <p className="text-sm text-gray-500 mt-1">{b.proof}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* The Offer Gives You / You Can Use It To */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {theOfferGivesYou.length > 0 && (
          <Card padding="md" className="bg-blue-50/50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">The Offer Gives You</h3>
            <ul className="space-y-2">
              {theOfferGivesYou.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {youCanUseItTo.length > 0 && (
          <Card padding="md" className="bg-purple-50/50 border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-3">You Can Use It To</h3>
            <ul className="space-y-2">
              {youCanUseItTo.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Value Ladder */}
      {valueLadder.length > 0 && (
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Value Ladder
          </h3>
          <div className="space-y-4">
            {valueLadder.map((stage, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="w-8 h-8 rounded-full bg-[#16314C] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {stage.stage}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{stage.stageName}</h4>
                  <p className="text-sm text-gray-600 mt-1"><strong>Problem:</strong> {stage.problem}</p>
                  <p className="text-sm text-gray-600"><strong>Offer:</strong> {stage.offer}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-gray-500">{stage.pricePoint}</span>
                    <span className="text-green-600">{stage.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Hidden Benefits */}
      {hiddenBenefits.length > 0 && (
        <Card padding="md" className="bg-amber-50/50 border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Hidden Benefits
          </h3>
          <p className="text-sm text-gray-500 mb-3">Unexpected positive outcomes your customers haven&apos;t considered</p>
          <ul className="space-y-2">
            {hiddenBenefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-amber-500">+</span>
                {benefit}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Program Name Options */}
      {programNameOptions.length > 0 && (
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-4">Program Name Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {programNameOptions.map((opt, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-[#16314C] mb-1">{opt.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{opt.uniqueMechanism}</p>
                <p className="text-xs text-gray-400">{opt.rationale}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Variations */}
      {variations.length > 0 && (
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-4">Copy Variations</h3>
          <div className="space-y-4">
            {variations.map((v, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <Badge variant="default" className="mb-2 capitalize">{v.type}</Badge>
                <p className="text-gray-700">{v.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Full Narrative */}
      {offerData.fullNarrative && (
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">Full Offer Narrative</h3>
          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="whitespace-pre-wrap">{offerData.fullNarrative}</p>
          </div>
        </Card>
      )}

      {/* Guarantee & CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blueprint.guarantee && (
          <Card padding="md" className="bg-green-50/50 border-green-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Risk Reversal / Guarantee
            </h3>
            <p className="text-gray-700">{blueprint.guarantee}</p>
          </Card>
        )}

        {blueprint.cta && (
          <Card padding="md" className="bg-[#16314C]/5 border-[#16314C]/20">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Call to Action
            </h3>
            <p className="text-lg font-medium text-[#16314C]">{blueprint.cta}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export { OfferBuilderView };
export type { OfferBuilderViewProps };
