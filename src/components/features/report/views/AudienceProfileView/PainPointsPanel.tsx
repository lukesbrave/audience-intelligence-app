'use client';

import { PainPoint } from '@/lib/types';
import { SeverityIndicator } from '@/components/ui';

interface PainPointsPanelProps {
  painPoints: PainPoint[];
}

function PainPointsPanel({ painPoints }: PainPointsPanelProps) {
  // Group by severity
  const critical = painPoints.filter(p => p.severity === 'critical');
  const moderate = painPoints.filter(p => p.severity === 'moderate');
  const minor = painPoints.filter(p => p.severity === 'minor');

  const renderPainPointCard = (point: PainPoint, index: number) => (
    <div
      key={index}
      className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start gap-3">
        {/* Severity bar */}
        <div
          className={`w-1 self-stretch rounded-full ${
            point.severity === 'critical'
              ? 'bg-red-500'
              : point.severity === 'moderate'
                ? 'bg-amber-500'
                : 'bg-green-500'
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{point.pain}</p>
          {point.emotionalContext && (
            <p className="text-sm text-gray-600 mt-1 italic">
              &ldquo;{point.emotionalContext}&rdquo;
            </p>
          )}
          {point.details && (
            <p className="text-sm text-gray-500 mt-2">{point.details}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Pain Points
        </h3>
        <span className="text-sm text-gray-500">{painPoints.length} total</span>
      </div>

      <div className="space-y-5">
        {/* Critical */}
        {critical.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SeverityIndicator level="critical" size="sm" />
              <span className="text-sm text-gray-600">({critical.length})</span>
            </div>
            <div className="space-y-2">
              {critical.map((point, i) => renderPainPointCard(point, i))}
            </div>
          </div>
        )}

        {/* Moderate */}
        {moderate.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SeverityIndicator level="moderate" size="sm" />
              <span className="text-sm text-gray-600">({moderate.length})</span>
            </div>
            <div className="space-y-2">
              {moderate.map((point, i) => renderPainPointCard(point, i))}
            </div>
          </div>
        )}

        {/* Minor */}
        {minor.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SeverityIndicator level="minor" size="sm" />
              <span className="text-sm text-gray-600">({minor.length})</span>
            </div>
            <div className="space-y-2">
              {minor.map((point, i) => renderPainPointCard(point, i))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { PainPointsPanel };
export type { PainPointsPanelProps };
