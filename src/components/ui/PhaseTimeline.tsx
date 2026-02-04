'use client';

interface Phase {
  phase: number;
  name: string;
}

interface PhaseTimelineProps {
  phases: Phase[];
  activePhase?: number;
  onPhaseClick?: (phase: number) => void;
}

function PhaseTimeline({ phases, activePhase, onPhaseClick }: PhaseTimelineProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => {
          const isActive = activePhase === phase.phase;
          const isClickable = !!onPhaseClick;

          return (
            <div key={phase.phase} className="flex items-center flex-1">
              {/* Phase circle */}
              <button
                onClick={() => onPhaseClick?.(phase.phase)}
                disabled={!isClickable}
                className={`
                  relative flex flex-col items-center group
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-200
                    ${isActive
                      ? 'bg-[#0a0a0a] text-white shadow-lg scale-110'
                      : 'bg-gray-100 text-white/60 group-hover:bg-[#BBDCEF]/50 group-hover:text-[#0a0a0a]'
                    }
                  `}
                >
                  {phase.phase}
                </div>
                <span
                  className={`
                    absolute -bottom-6 text-xs whitespace-nowrap max-w-[80px] truncate text-center
                    ${isActive ? 'text-[#0a0a0a] font-medium' : 'text-white/50'}
                  `}
                >
                  {phase.name}
                </span>
              </button>

              {/* Connector line */}
              {index < phases.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { PhaseTimeline };
export type { PhaseTimelineProps, Phase };
