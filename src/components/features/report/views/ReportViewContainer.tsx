'use client';

import { useState } from 'react';
import { ResearchResponse, OfferBuilderResponse } from '@/lib/types';
import { ExecutiveSummary } from '../ExecutiveSummary';
import { ReportActions } from '../ReportActions';
import { AudienceProfileView } from './AudienceProfileView';
import { ResearchFindingsView } from './ResearchFindingsView';
import { PhaseDetailView } from './ResearchFindingsView/PhaseDetailView';
import { SynthesisView } from './SynthesisView';
import { MarketingStrategyView } from './MarketingStrategyView';
import { UrgencyGatewayView } from './UrgencyGatewayView';
import { ThemCentricLanguageView } from './ThemCentricLanguageView';
import { OfferBuilderView } from './OfferBuilderView';

interface ReportViewContainerProps {
  response: ResearchResponse;
  activeSection?: string;
  onNavigate?: (section: string) => void;
  onSave: () => void;
  isSaved?: boolean;
  onOfferGenerated?: (hasOffer: boolean) => void;
}

function ReportViewContainer({
  response,
  activeSection = 'overview',
  onNavigate = () => {},
  onSave,
  isSaved = false,
  onOfferGenerated
}: ReportViewContainerProps) {
  const { report, googleDocUrl, generatedAt } = response;

  // Offer builder state
  const [offerData, setOfferData] = useState<OfferBuilderResponse | null>(null);
  const [isGeneratingOffer, setIsGeneratingOffer] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);

  const handleGenerateOffer = async () => {
    setIsGeneratingOffer(true);
    setOfferError(null);

    try {
      const res = await fetch('/api/offer-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audienceProfile: report.audienceProfile,
          synthesis: report.synthesis,
          marketingStrategy: report.marketingStrategy,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate offer');
      }

      const data: OfferBuilderResponse = await res.json();
      setOfferData(data);
      onOfferGenerated?.(true);
      onNavigate('offer-builder');
    } catch (err) {
      setOfferError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGeneratingOffer(false);
    }
  };

  const renderSection = () => {
    // Handle phase-X sections
    if (activeSection.startsWith('phase-')) {
      const phaseNum = parseInt(activeSection.replace('phase-', ''), 10);
      const finding = report.researchFindings.find(f => f.phase === phaseNum);
      if (finding) {
        return (
          <PhaseDetailView
            finding={finding}
            onBack={() => onNavigate('research-findings')}
          />
        );
      }
    }

    switch (activeSection) {
      case 'overview':
        return (
          <ExecutiveSummary
            report={report}
            generatedAt={generatedAt}
            onNavigate={onNavigate}
          />
        );
      case 'urgency-gateway':
        return (
          <UrgencyGatewayView
            urgencyGateway={report.audienceProfile.urgencyGateway}
            painPoints={report.audienceProfile.painPoints}
          />
        );
      case 'them-centric-language':
        return (
          <ThemCentricLanguageView
            language={report.audienceProfile.themCentricLanguage}
          />
        );
      case 'audience-profile':
        return <AudienceProfileView profile={report.audienceProfile} />;
      case 'research-findings':
        return (
          <ResearchFindingsView
            findings={report.researchFindings}
            onNavigate={onNavigate}
          />
        );
      case 'synthesis':
        return <SynthesisView synthesis={report.synthesis} />;
      case 'marketing-strategy':
        return <MarketingStrategyView strategy={report.marketingStrategy} />;
      case 'offer-builder':
        return (
          <OfferBuilderView
            offerData={offerData}
            isLoading={isGeneratingOffer}
            error={offerError}
            onGenerate={handleGenerateOffer}
          />
        );
      default:
        return (
          <ExecutiveSummary
            report={report}
            generatedAt={generatedAt}
            onNavigate={onNavigate}
          />
        );
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Persistent actions bar */}
      <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-gray-200">
        {/* Generate Offer CTA */}
        <div className="flex items-center gap-3">
          {!offerData && (
            <button
              onClick={handleGenerateOffer}
              disabled={isGeneratingOffer}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#16314C] to-[#1e4366] text-white font-medium rounded-lg hover:from-[#1e4366] hover:to-[#16314C] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isGeneratingOffer ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Offer...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Your Offer
                </>
              )}
            </button>
          )}
          {offerData && (
            <button
              onClick={() => onNavigate('offer-builder')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              View Your Offer
            </button>
          )}
          {offerError && (
            <span className="text-sm text-red-600">{offerError}</span>
          )}
        </div>
        <ReportActions
          googleDocUrl={googleDocUrl}
          onSave={onSave}
          isSaved={isSaved}
        />
      </div>

      {/* Dynamic section content with transition */}
      <div key={activeSection} className="animate-fadeIn">
        {renderSection()}
      </div>
    </div>
  );
}

export { ReportViewContainer };
export type { ReportViewContainerProps };
