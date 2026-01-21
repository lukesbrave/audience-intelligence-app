'use client';

import { useState } from 'react';
import { ResearchResponse, OfferBuilderResponse } from '@/lib/types';
import { ToolkitNavigation } from './ToolkitNavigation';
import { DashboardSection } from './sections/DashboardSection';
import { YourAudienceSection } from './sections/YourAudienceSection';
import { YourMessageSection } from './sections/YourMessageSection';
import { YourChannelsSection } from './sections/YourChannelsSection';
import { YourOfferSection } from './sections/YourOfferSection';
import { LibraryAudienceProfile } from './library/LibraryAudienceProfile';
import { LibrarySources } from './library/LibrarySources';

interface ToolkitContainerProps {
  response: ResearchResponse;
  reportName?: string;
  googleDocUrl?: string;
  onSave?: () => void;
  isSaved?: boolean;
}

function ToolkitContainer({
  response,
  reportName,
  googleDocUrl,
  onSave,
  isSaved = false,
}: ToolkitContainerProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [offerData, setOfferData] = useState<OfferBuilderResponse | null>(null);
  const [isGeneratingOffer, setIsGeneratingOffer] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);

  const { report, generatedAt } = response;

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
      setActiveSection('your-offer');
    } catch (err) {
      setOfferError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGeneratingOffer(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardSection
            report={report}
            generatedAt={generatedAt}
            onNavigate={setActiveSection}
            googleDocUrl={googleDocUrl}
            onSave={onSave}
            isSaved={isSaved}
            hasOfferData={!!offerData}
            onGenerateOffer={handleGenerateOffer}
            isGeneratingOffer={isGeneratingOffer}
          />
        );

      case 'your-audience':
        return <YourAudienceSection profile={report.audienceProfile} />;

      case 'your-message':
        return <YourMessageSection language={report.audienceProfile.themCentricLanguage} />;

      case 'your-channels':
        return (
          <YourChannelsSection
            communicationPrefs={report.audienceProfile.communicationPrefs}
            marketingStrategy={report.marketingStrategy}
          />
        );

      case 'your-offer':
        return (
          <YourOfferSection
            offerData={offerData}
            urgencyGateway={report.audienceProfile.urgencyGateway}
            isLoading={isGeneratingOffer}
            error={offerError}
            onGenerate={handleGenerateOffer}
          />
        );

      case 'library-audience':
        return <LibraryAudienceProfile profile={report.audienceProfile} />;

      case 'library-pain':
        return (
          <LibraryAudienceProfile
            profile={report.audienceProfile}
            focusSection="painPoints"
          />
        );

      case 'library-congregation':
        return (
          <YourChannelsSection
            communicationPrefs={report.audienceProfile.communicationPrefs}
            marketingStrategy={report.marketingStrategy}
            isLibraryView
          />
        );

      case 'library-search':
        return (
          <YourMessageSection
            language={report.audienceProfile.themCentricLanguage}
            focusSection="search"
          />
        );

      case 'library-psychographic':
        return (
          <LibraryAudienceProfile
            profile={report.audienceProfile}
            focusSection="goals"
          />
        );

      case 'library-sources':
        return <LibrarySources findings={report.researchFindings} />;

      default:
        return (
          <DashboardSection
            report={report}
            generatedAt={generatedAt}
            onNavigate={setActiveSection}
            googleDocUrl={googleDocUrl}
            onSave={onSave}
            isSaved={isSaved}
            hasOfferData={!!offerData}
            onGenerateOffer={handleGenerateOffer}
            isGeneratingOffer={isGeneratingOffer}
          />
        );
    }
  };

  return (
    <div className="flex h-full bg-[#1a2744]">
      <ToolkitNavigation
        activeSection={activeSection}
        onNavigate={setActiveSection}
        hasOfferData={!!offerData}
        reportName={reportName}
        generatedAt={generatedAt}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          <div key={activeSection} className="animate-fadeIn">
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  );
}

export { ToolkitContainer };
export type { ToolkitContainerProps };
