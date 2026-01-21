'use client';

import { Goal } from '@/lib/types';
import { SeverityIndicator } from '@/components/ui';

interface GoalsPanelProps {
  goals: Goal[];
}

function GoalsPanel({ goals }: GoalsPanelProps) {
  // Normalize priority values (handle both old and new formats)
  const normalizePriority = (priority: string): 'high' | 'medium' | 'low' => {
    if (priority === 'high' || priority === 'primary') return 'high';
    if (priority === 'medium' || priority === 'secondary') return 'medium';
    return 'low';
  };

  // Group by priority
  const high = goals.filter(g => normalizePriority(g.priority) === 'high');
  const medium = goals.filter(g => normalizePriority(g.priority) === 'medium');
  const low = goals.filter(g => normalizePriority(g.priority) === 'low');

  const renderGoalCard = (goal: Goal, index: number) => {
    const priority = normalizePriority(goal.priority);
    return (
      <div
        key={index}
        className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-start gap-3">
          {/* Priority bar */}
          <div
            className={`w-1 self-stretch rounded-full ${
              priority === 'high'
                ? 'bg-[#16314C]'
                : priority === 'medium'
                  ? 'bg-[#BBDCEF]'
                  : 'bg-gray-300'
            }`}
          />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{goal.goal}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {goal.timeframe && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {goal.timeframe}
              </span>
            )}
            {goal.successMetric && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {goal.successMetric}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Goals
        </h3>
        <span className="text-sm text-gray-500">{goals.length} total</span>
      </div>

      <div className="space-y-5">
        {/* High Priority */}
        {high.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SeverityIndicator level="high" size="sm" />
              <span className="text-sm text-gray-600">Priority ({high.length})</span>
            </div>
            <div className="space-y-2">
              {high.map((goal, i) => renderGoalCard(goal, i))}
            </div>
          </div>
        )}

        {/* Medium Priority */}
        {medium.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SeverityIndicator level="medium" size="sm" />
              <span className="text-sm text-gray-600">Priority ({medium.length})</span>
            </div>
            <div className="space-y-2">
              {medium.map((goal, i) => renderGoalCard(goal, i))}
            </div>
          </div>
        )}

        {/* Low Priority */}
        {low.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SeverityIndicator level="low" size="sm" />
              <span className="text-sm text-gray-600">Priority ({low.length})</span>
            </div>
            <div className="space-y-2">
              {low.map((goal, i) => renderGoalCard(goal, i))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { GoalsPanel };
export type { GoalsPanelProps };
