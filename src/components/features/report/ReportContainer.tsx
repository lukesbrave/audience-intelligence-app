'use client';

import { ResearchResponse } from '@/lib/types';
import { AudienceProfileSection } from './AudienceProfileSection';
import { ResearchFindingsSection } from './ResearchFindingsSection';
import { SynthesisSection } from './SynthesisSection';
import { MarketingStrategySection } from './MarketingStrategySection';
import { ExecutiveSummary } from './ExecutiveSummary';
import { ReportActions } from './ReportActions';
import { UrgencyGatewaySection } from './UrgencyGatewaySection';
import { ThemCentricLanguageSection } from './ThemCentricLanguageSection';

interface ReportContainerProps {
  response: ResearchResponse;
  onSave: () => void;
  isSaved?: boolean;
}

function ReportContainer({ response, onSave, isSaved = false }: ReportContainerProps) {
  const { report, googleDocUrl, generatedAt } = response;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Executive Summary / Overview */}
      <ExecutiveSummary
        report={report}
        generatedAt={generatedAt}
      />

      {/* Actions Bar */}
      <div className="flex items-center justify-end gap-3 pb-4 border-b border-gray-200">
        <ReportActions
          googleDocUrl={googleDocUrl}
          onSave={onSave}
          isSaved={isSaved}
        />
      </div>

      {/* Report Sections with IDs for scroll navigation */}
      <div className="space-y-6">
        {/* Course Framework Sections - Urgency Gateway & Language Map */}
        {report.audienceProfile.urgencyGateway && (
          <section id="urgency-gateway">
            <UrgencyGatewaySection urgencyGateway={report.audienceProfile.urgencyGateway} />
          </section>
        )}

        {report.audienceProfile.themCentricLanguage && (
          <section id="them-centric-language">
            <ThemCentricLanguageSection language={report.audienceProfile.themCentricLanguage} />
          </section>
        )}

        <section id="audience-profile">
          <AudienceProfileSection profile={report.audienceProfile} />
        </section>

        <section id="research-findings">
          <ResearchFindingsSection findings={report.researchFindings} />
        </section>

        <section id="synthesis">
          <SynthesisSection synthesis={report.synthesis} />
        </section>

        <section id="marketing-strategy">
          <MarketingStrategySection strategy={report.marketingStrategy} />
        </section>
      </div>
    </div>
  );
}

export { ReportContainer };
export type { ReportContainerProps };
