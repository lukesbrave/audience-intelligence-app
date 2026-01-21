'use client';

import { AudienceProfile } from '@/lib/types';
import { DemographicsGrid } from './DemographicsGrid';
import { PainPointsPanel } from './PainPointsPanel';
import { GoalsPanel } from './GoalsPanel';
import { SolutionsFactorsGrid } from './SolutionsFactorsGrid';
import { CommunicationPrefsCard } from './CommunicationPrefsCard';

interface AudienceProfileViewProps {
  profile: AudienceProfile;
}

function AudienceProfileView({ profile }: AudienceProfileViewProps) {
  // Defensive: provide defaults for all properties
  const demographics = profile?.demographics || { ageRange: '', locations: [], jobTitles: [], industry: '', incomeLevel: '' };
  const painPoints = profile?.painPoints || [];
  const goals = profile?.goals || [];
  const currentSolutions = profile?.currentSolutions || [];
  const decisionFactors = profile?.decisionFactors || [];
  const communicationPrefs = profile?.communicationPrefs || { channels: [], contentFormats: [], tonePreference: '' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audience Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Comprehensive overview of your target audience
        </p>
      </div>

      {/* Demographics */}
      <DemographicsGrid demographics={demographics} />

      {/* Pain Points & Goals - Side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PainPointsPanel painPoints={painPoints} />
        <GoalsPanel goals={goals} />
      </div>

      {/* Solutions & Decision Factors - only show if data exists */}
      {(currentSolutions.length > 0 || decisionFactors.length > 0) && (
        <SolutionsFactorsGrid
          currentSolutions={currentSolutions}
          decisionFactors={decisionFactors}
        />
      )}

      {/* Communication Preferences - only show if data exists */}
      {(communicationPrefs.channels?.length > 0 || communicationPrefs.contentFormats?.length > 0 || communicationPrefs.tonePreference) && (
        <CommunicationPrefsCard preferences={communicationPrefs} />
      )}
    </div>
  );
}

export { AudienceProfileView };
export type { AudienceProfileViewProps };
