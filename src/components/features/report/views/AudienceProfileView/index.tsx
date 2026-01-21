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
  const { demographics, painPoints, goals, currentSolutions, decisionFactors, communicationPrefs } = profile;

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

      {/* Solutions & Decision Factors */}
      <SolutionsFactorsGrid
        currentSolutions={currentSolutions}
        decisionFactors={decisionFactors}
      />

      {/* Communication Preferences */}
      <CommunicationPrefsCard preferences={communicationPrefs} />
    </div>
  );
}

export { AudienceProfileView };
export type { AudienceProfileViewProps };
