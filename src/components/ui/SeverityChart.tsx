'use client';

interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

interface SeverityChartProps {
  segments: ChartSegment[];
  title?: string;
  type?: 'bar' | 'donut';
  showLegend?: boolean;
  showValues?: boolean;
  className?: string;
}

function SeverityChart({
  segments,
  title,
  type = 'bar',
  showLegend = true,
  showValues = true,
  className = ''
}: SeverityChartProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  if (type === 'donut') {
    return <DonutChart segments={segments} title={title} showLegend={showLegend} showValues={showValues} total={total} className={className} />;
  }

  return <BarChart segments={segments} title={title} showLegend={showLegend} showValues={showValues} total={total} className={className} />;
}

interface ChartInnerProps {
  segments: ChartSegment[];
  title?: string;
  showLegend: boolean;
  showValues: boolean;
  total: number;
  className: string;
}

function BarChart({ segments, title, showLegend, showValues, total, className }: ChartInnerProps) {
  return (
    <div className={`${className}`}>
      {title && (
        <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      )}

      {/* Stacked bar */}
      <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
        {segments.map((segment, index) => (
          <div
            key={segment.label}
            className="h-full transition-all duration-300"
            style={{
              width: total > 0 ? `${(segment.value / total) * 100}%` : '0%',
              backgroundColor: segment.color,
              marginLeft: index > 0 ? '1px' : '0'
            }}
            title={`${segment.label}: ${segment.value}`}
          />
        ))}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {segments.map(segment => (
            <div key={segment.label} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-white/60">{segment.label}</span>
              {showValues && (
                <span className="font-medium text-gray-900">{segment.value}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DonutChart({ segments, title, showLegend, showValues, total, className }: ChartInnerProps) {
  // Calculate stroke-dasharray values for each segment
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  const segmentArcs = segments.map(segment => {
    const segmentLength = total > 0 ? (segment.value / total) * circumference : 0;
    const arc = {
      ...segment,
      strokeDasharray: `${segmentLength} ${circumference}`,
      strokeDashoffset: -currentOffset
    };
    currentOffset += segmentLength;
    return arc;
  });

  return (
    <div className={`${className}`}>
      {title && (
        <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      )}

      <div className="flex items-center gap-6">
        {/* Donut SVG */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="12"
            />
            {/* Segment arcs */}
            {segmentArcs.map((segment, index) => (
              <circle
                key={segment.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="12"
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                className="transition-all duration-500"
              />
            ))}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{total}</span>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-col gap-2">
            {segments.map(segment => (
              <div key={segment.label} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-white/60">{segment.label}</span>
                {showValues && (
                  <span className="font-medium text-gray-900 ml-auto">{segment.value}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Preset color schemes
const SEVERITY_COLORS = {
  critical: '#ef4444',  // red-500
  moderate: '#f59e0b',  // amber-500
  minor: '#22c55e'      // green-500
};

const PRIORITY_COLORS = {
  high: '#ef4444',      // red-500
  medium: '#f59e0b',    // amber-500
  low: '#22c55e'        // green-500
};

export { SeverityChart, SEVERITY_COLORS, PRIORITY_COLORS };
export type { SeverityChartProps, ChartSegment };
