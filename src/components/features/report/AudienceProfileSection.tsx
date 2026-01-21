'use client';

import { Collapsible, Badge, Card } from '@/components/ui';
import { AudienceProfile } from '@/lib/types';

interface AudienceProfileSectionProps {
  profile: AudienceProfile;
  defaultOpen?: boolean;
}

function AudienceProfileSection({ profile, defaultOpen = false }: AudienceProfileSectionProps) {
  const { demographics, painPoints, goals, currentSolutions, decisionFactors, communicationPrefs } = profile;

  return (
    <Collapsible
      title="Audience Profile"
      badge={`${painPoints.length} pain points, ${goals.length} goals`}
      defaultOpen={defaultOpen}
    >
      <div className="space-y-6">
        {/* Demographics */}
        <Card padding="sm" className="bg-gray-50 border-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Demographics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Age Range:</span>
              <span className="ml-2 text-gray-900">{demographics.ageRange}</span>
            </div>
            <div>
              <span className="text-gray-500">Industry:</span>
              <span className="ml-2 text-gray-900">{demographics.industry}</span>
            </div>
            <div>
              <span className="text-gray-500">Income Level:</span>
              <span className="ml-2 text-gray-900">{demographics.incomeLevel}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Locations:</span>
              <span className="ml-2 text-gray-900">{demographics.locations.join(', ')}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Job Titles:</span>
              <span className="ml-2 text-gray-900">{demographics.jobTitles.join(', ')}</span>
            </div>
          </div>
        </Card>

        {/* Pain Points */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Pain Points</h4>
          <div className="space-y-3">
            {painPoints.map((point, index) => (
              <Card key={index} padding="sm" className="bg-gray-50 border-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{point.pain}</p>
                    <p className="text-sm text-gray-600 mt-1">{point.emotionalContext}</p>
                    {point.details && (
                      <p className="text-sm text-gray-500 mt-2">{point.details}</p>
                    )}
                  </div>
                  <Badge
                    variant={
                      point.severity === 'critical'
                        ? 'error'
                        : point.severity === 'moderate'
                          ? 'warning'
                          : 'default'
                    }
                  >
                    {point.severity}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Goals</h4>
          <div className="space-y-3">
            {goals.map((goal, index) => (
              <Card key={index} padding="sm" className="bg-gray-50 border-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{goal.goal}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                      <span>Timeframe: {goal.timeframe}</span>
                      <span>Success Metric: {goal.successMetric}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      goal.priority === 'high'
                        ? 'error'
                        : goal.priority === 'medium'
                          ? 'warning'
                          : 'default'
                    }
                  >
                    {goal.priority}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Solutions & Decision Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="sm" className="bg-gray-50 border-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Current Solutions</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {currentSolutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#16314C] mt-1">•</span>
                  {solution}
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="sm" className="bg-gray-50 border-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Decision Factors</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {decisionFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#16314C] mt-1">•</span>
                  {factor}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Communication Preferences */}
        <Card padding="sm" className="bg-gray-50 border-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Communication Preferences</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Channels:</span>
              <span className="ml-2 text-gray-900">{communicationPrefs.channels.join(', ')}</span>
            </div>
            <div>
              <span className="text-gray-500">Content Formats:</span>
              <span className="ml-2 text-gray-900">{communicationPrefs.contentFormats.join(', ')}</span>
            </div>
            <div>
              <span className="text-gray-500">Tone Preference:</span>
              <span className="ml-2 text-gray-900">{communicationPrefs.tonePreference}</span>
            </div>
          </div>
        </Card>
      </div>
    </Collapsible>
  );
}

export { AudienceProfileSection };
export type { AudienceProfileSectionProps };
