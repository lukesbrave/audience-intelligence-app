'use client';

import { AudienceProfile } from '@/lib/types';
import { Badge } from '@/components/ui';

interface LibraryAudienceProfileProps {
  profile: AudienceProfile;
  focusSection?: 'painPoints' | 'goals' | 'all';
}

function LibraryAudienceProfile({
  profile,
  focusSection = 'all',
}: LibraryAudienceProfileProps) {
  const { demographics, painPoints, goals, currentSolutions, decisionFactors, communicationPrefs } =
    profile;

  if (focusSection === 'painPoints') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pain Point Validation</h1>
          <p className="text-sm text-gray-400 mt-1">
            Detailed analysis of your audience&apos;s frustrations
          </p>
        </div>

        <div className="space-y-3">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className={`bg-[#243351] rounded-xl border p-5 ${
                point.severity === 'critical'
                  ? 'border-red-500/30'
                  : point.severity === 'moderate'
                  ? 'border-amber-500/30'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h4 className="font-medium text-white">{point.pain}</h4>
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

              {point.emotionalContext && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Emotional Context
                  </p>
                  <p className="text-sm text-gray-300">{point.emotionalContext}</p>
                </div>
              )}

              {point.details && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Details</p>
                  <p className="text-sm text-gray-300">{point.details}</p>
                </div>
              )}

              {point.classification && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      point.classification === 'URGENCY_GATEWAY'
                        ? 'bg-amber-500/20 text-amber-400'
                        : point.classification === 'ROOT_CAUSE'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {point.classification.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (focusSection === 'goals') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Psychographic Deep Dive</h1>
          <p className="text-sm text-gray-400 mt-1">Goals, motivations, and aspirations</p>
        </div>

        <div className="space-y-3">
          {goals.map((goal, i) => (
            <div
              key={i}
              className={`bg-[#243351] rounded-xl border p-5 ${
                goal.priority === 'high'
                  ? 'border-green-500/30'
                  : goal.priority === 'medium'
                  ? 'border-[#BBDCEF]/30'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h4 className="font-medium text-white">{goal.goal}</h4>
                <Badge
                  variant={
                    goal.priority === 'high'
                      ? 'success'
                      : goal.priority === 'medium'
                      ? 'info'
                      : 'default'
                  }
                >
                  {goal.priority} priority
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {goal.timeframe && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Timeframe</p>
                    <p className="text-sm text-gray-300">{goal.timeframe}</p>
                  </div>
                )}

                {goal.successMetric && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Success Metric
                    </p>
                    <p className="text-sm text-gray-300">{goal.successMetric}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Decision Factors */}
        {decisionFactors && decisionFactors.length > 0 && (
          <div className="bg-[#243351] rounded-xl border border-white/10 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Decision Factors
            </h3>
            <ul className="space-y-2">
              {decisionFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-[#BBDCEF]">•</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Full profile view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Full Audience Profile</h1>
        <p className="text-sm text-gray-400 mt-1">Complete research data</p>
      </div>

      {/* Demographics */}
      <div className="bg-[#243351] rounded-xl border border-white/10 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Demographics
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Age Range</p>
            <p className="text-sm text-white">{demographics.ageRange || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Industry</p>
            <p className="text-sm text-white">{demographics.industry || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Income Level</p>
            <p className="text-sm text-white">{demographics.incomeLevel || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Job Titles</p>
            <div className="flex flex-wrap gap-1">
              {(demographics.jobTitles || []).map((title, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[#1a2744] rounded text-xs text-gray-300"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
          {demographics.locations && demographics.locations.length > 0 && (
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Locations</p>
              <div className="flex flex-wrap gap-1">
                {demographics.locations.map((loc, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#1a2744] rounded text-xs text-gray-300"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pain Points Summary */}
      <div className="bg-[#243351] rounded-xl border border-white/10 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Pain Points ({painPoints.length})
        </h3>
        <div className="space-y-2">
          {painPoints.slice(0, 5).map((point, i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-2">
              <p className="text-sm text-gray-300 flex-1">{point.pain}</p>
              <Badge
                variant={
                  point.severity === 'critical'
                    ? 'error'
                    : point.severity === 'moderate'
                    ? 'warning'
                    : 'default'
                }
                size="sm"
              >
                {point.severity}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Goals Summary */}
      <div className="bg-[#243351] rounded-xl border border-white/10 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Goals ({goals.length})
        </h3>
        <div className="space-y-2">
          {goals.slice(0, 5).map((goal, i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-2">
              <p className="text-sm text-gray-300 flex-1">{goal.goal}</p>
              <Badge
                variant={
                  goal.priority === 'high'
                    ? 'success'
                    : goal.priority === 'medium'
                    ? 'info'
                    : 'default'
                }
                size="sm"
              >
                {goal.priority}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Current Solutions */}
      {currentSolutions && currentSolutions.length > 0 && (
        <div className="bg-[#243351] rounded-xl border border-white/10 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Current Solutions They&apos;ve Tried
          </h3>
          <ul className="space-y-2">
            {currentSolutions.map((solution, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-gray-500">•</span>
                {solution}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Communication Preferences */}
      {communicationPrefs && (
        <div className="bg-[#243351] rounded-xl border border-white/10 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Communication Preferences
          </h3>
          <div className="space-y-4">
            {communicationPrefs.channels && communicationPrefs.channels.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Preferred Channels</p>
                <div className="flex flex-wrap gap-2">
                  {communicationPrefs.channels.map((channel, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#1a2744] rounded-full text-sm text-gray-300"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {communicationPrefs.contentFormats && communicationPrefs.contentFormats.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Content Formats</p>
                <div className="flex flex-wrap gap-2">
                  {communicationPrefs.contentFormats.map((format, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#BBDCEF]/10 rounded-full text-sm text-[#BBDCEF]"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {communicationPrefs.tonePreference && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Tone Preference</p>
                <p className="text-sm text-gray-300">{communicationPrefs.tonePreference}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { LibraryAudienceProfile };
export type { LibraryAudienceProfileProps };
