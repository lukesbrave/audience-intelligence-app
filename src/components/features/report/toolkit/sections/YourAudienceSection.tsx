'use client';

import { AudienceProfile } from '@/lib/types';
import { CopyButton } from '@/components/ui';

interface YourAudienceSectionProps {
  profile: AudienceProfile;
}

function YourAudienceSection({ profile }: YourAudienceSectionProps) {
  const { demographics, painPoints, goals, urgencyGateway } = profile;

  // Generate a one-liner summary
  const oneLiner = generateOneLiner(demographics, painPoints);

  // Get top emotions from pain points
  const emotions = extractEmotions(painPoints);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Your Audience</h1>
        <p className="text-sm text-gray-400 mt-1">Who you&apos;re here to serve</p>
      </div>

      {/* One-Liner */}
      <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          The One-Liner
        </p>
        <div className="flex items-start justify-between gap-4">
          <blockquote className="text-lg text-white leading-relaxed">
            &ldquo;{oneLiner}&rdquo;
          </blockquote>
          <CopyButton text={oneLiner} size="md" />
        </div>
      </div>

      {/* At a Glance */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          At a Glance
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DemographicCard
            icon="👤"
            label="Age Range"
            value={demographics.ageRange || 'Not specified'}
          />
          <DemographicCard
            icon="💼"
            label="Job Titles"
            value={demographics.jobTitles?.slice(0, 2).join(', ') || 'Not specified'}
          />
          <DemographicCard
            icon="🏢"
            label="Industries"
            value={demographics.industry || 'Not specified'}
          />
          <DemographicCard
            icon="💰"
            label="Income"
            value={demographics.incomeLevel || 'Not specified'}
          />
        </div>
      </div>

      {/* Urgency Gateway */}
      {urgencyGateway && (
        <div className="bg-[#243351] rounded-xl border border-amber-500/20 overflow-hidden">
          <div className="px-6 py-4 bg-amber-500/10 border-b border-amber-500/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              The Urgency Gateway
            </p>
            <p className="text-sm text-gray-400 mt-0.5">
              The #1 problem they need solved RIGHT NOW
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Gateway Problem */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400">🔥</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Gateway Problem
                </p>
              </div>
              <p className="text-white font-medium">{urgencyGateway.problem}</p>
            </div>

            {/* Why Urgent */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span>⏰</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Why It&apos;s Urgent
                </p>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{urgencyGateway.whyUrgent}</p>
            </div>

            {/* Emotional State */}
            {urgencyGateway.emotionalState && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span>💭</span>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Emotional State
                  </p>
                </div>
                <blockquote className="text-gray-300 text-sm italic border-l-2 border-gray-600 pl-4">
                  &ldquo;{urgencyGateway.emotionalState}&rdquo;
                </blockquote>
              </div>
            )}

            {/* The Aspirin */}
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span>💊</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-green-400">
                  The Aspirin (Your Quick Win)
                </p>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {urgencyGateway.aspirinSolution}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* How They Feel */}
      {emotions.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            How They Feel
          </p>
          <div className="flex flex-wrap gap-3">
            {emotions.map((emotion, i) => (
              <div
                key={i}
                className="px-4 py-2 bg-[#243351] rounded-lg border border-white/10 text-center"
              >
                <span className="text-xl block mb-1">{emotion.emoji}</span>
                <span className="text-sm text-gray-300">{emotion.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Pain Points Preview */}
      {painPoints.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Top Pain Points
          </p>
          <div className="space-y-2">
            {painPoints.slice(0, 3).map((point, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  point.severity === 'critical'
                    ? 'bg-red-500/10 border-red-500/20'
                    : point.severity === 'moderate'
                    ? 'bg-amber-500/10 border-amber-500/20'
                    : 'bg-[#243351] border-white/10'
                }`}
              >
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    point.severity === 'critical'
                      ? 'bg-red-500/20 text-red-400'
                      : point.severity === 'moderate'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {point.severity}
                </span>
                <p className="text-sm text-gray-300 flex-1">{point.pain}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Goal */}
      {goals.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Primary Goal
          </p>
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <p className="text-white font-medium">
              {goals.find((g) => g.priority === 'high')?.goal || goals[0]?.goal}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface DemographicCardProps {
  icon: string;
  label: string;
  value: string;
}

function DemographicCard({ icon, label, value }: DemographicCardProps) {
  return (
    <div className="bg-[#243351] rounded-lg border border-white/10 p-4 text-center">
      <span className="text-2xl block mb-2">{icon}</span>
      <p className="text-sm text-white font-medium truncate">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function generateOneLiner(
  demographics: AudienceProfile['demographics'],
  painPoints: AudienceProfile['painPoints']
): string {
  const age = demographics.ageRange || '';
  const jobs = demographics.jobTitles?.slice(0, 2).join(' and ') || 'professionals';
  const criticalPain = painPoints.find((p) => p.severity === 'critical');
  const painDescription = criticalPain?.pain || painPoints[0]?.pain || 'seeking growth';

  return `${age ? age + ' year old ' : ''}${jobs} who ${painDescription.toLowerCase()}`;
}

function extractEmotions(
  painPoints: AudienceProfile['painPoints']
): { emoji: string; label: string }[] {
  const emotionMap: Record<string, { emoji: string; label: string }> = {
    frustrated: { emoji: '😤', label: 'Frustrated' },
    trapped: { emoji: '😔', label: 'Trapped' },
    anxious: { emoji: '😰', label: 'Anxious' },
    overwhelmed: { emoji: '😩', label: 'Overwhelmed' },
    exhausted: { emoji: '😓', label: 'Exhausted' },
    hopeful: { emoji: '🌟', label: 'Hopeful' },
    ambitious: { emoji: '💪', label: 'Ambitious' },
    curious: { emoji: '🤔', label: 'Curious' },
  };

  const emotions: { emoji: string; label: string }[] = [];
  const seenLabels = new Set<string>();

  for (const point of painPoints) {
    const context = (point.emotionalContext || '').toLowerCase();
    for (const [keyword, emotion] of Object.entries(emotionMap)) {
      if (context.includes(keyword) && !seenLabels.has(emotion.label)) {
        emotions.push(emotion);
        seenLabels.add(emotion.label);
      }
    }
    if (emotions.length >= 3) break;
  }

  // Default emotions if none found
  if (emotions.length === 0) {
    return [
      { emoji: '😤', label: 'Frustrated' },
      { emoji: '😔', label: 'Trapped' },
      { emoji: '😰', label: 'Anxious' },
    ];
  }

  return emotions.slice(0, 3);
}

export { YourAudienceSection };
export type { YourAudienceSectionProps };
