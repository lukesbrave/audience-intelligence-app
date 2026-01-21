'use client';

import { useEffect, useState, useRef } from 'react';

interface Phase {
  id: number;
  name: string;
  description: string;
}

const RESEARCH_PHASES: Phase[] = [
  {
    id: 1,
    name: 'Reading Your Profile',
    description: 'Getting to know who you\'re serving',
  },
  {
    id: 2,
    name: 'Finding Their Frustrations',
    description: 'What keeps them up at night',
  },
  {
    id: 3,
    name: 'Mapping Their World',
    description: 'Where they hang out and who they listen to',
  },
  {
    id: 4,
    name: 'Spotting Opportunities',
    description: 'What content actually resonates with them',
  },
  {
    id: 5,
    name: 'Decoding Their Language',
    description: 'The exact words they type when searching for help',
  },
];

// Estimated time in seconds for each phase (total ~90 seconds)
const PHASE_DURATIONS = [15, 20, 20, 20, 15];

type PhaseStatus = 'pending' | 'active' | 'completed' | 'error';

interface ProgressStepperProps {
  isRunning: boolean;
  isComplete?: boolean;
  hasError?: boolean;
  errorPhase?: number;
  onPhaseChange?: (phase: number) => void;
  darkMode?: boolean;
}

function ProgressStepper({
  isRunning,
  isComplete = false,
  hasError = false,
  errorPhase,
  onPhaseChange,
  darkMode = false,
}: ProgressStepperProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onPhaseChangeRef = useRef(onPhaseChange);

  // Keep callback ref in sync
  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  // Calculate cumulative times for phase boundaries
  const phaseBoundaries = PHASE_DURATIONS.reduce<number[]>((acc, duration, i) => {
    const prev = i > 0 ? acc[i - 1] : 0;
    acc.push(prev + duration);
    return acc;
  }, []);

  // Determine phase based on elapsed time
  const calculatePhase = (time: number): number => {
    for (let i = 0; i < phaseBoundaries.length; i++) {
      if (time < phaseBoundaries[i]) {
        return i + 1;
      }
    }
    return 5; // Cap at last phase
  };

  // Start/stop timer based on running state
  useEffect(() => {
    // Clean up any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Don't run if complete, error, or not running
    if (!isRunning || isComplete || hasError) {
      return;
    }

    // Initialize
    setElapsedTime(0);
    setCurrentPhase(1);
    onPhaseChangeRef.current?.(1);

    // Start the interval
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        const newPhase = calculatePhase(newTime);

        // Update phase if changed
        setCurrentPhase((prevPhase) => {
          if (newPhase !== prevPhase) {
            onPhaseChangeRef.current?.(newPhase);
            return newPhase;
          }
          return prevPhase;
        });

        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isComplete, hasError]);

  // When complete, mark all phases as completed
  useEffect(() => {
    if (isComplete) {
      setCurrentPhase(6); // Beyond all phases = all complete
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isComplete]);

  const getPhaseStatus = (phaseId: number): PhaseStatus => {
    if (hasError && errorPhase === phaseId) return 'error';
    if (isComplete || phaseId < currentPhase) return 'completed';
    if (phaseId === currentPhase && isRunning) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Research Progress
        </h3>
        {isRunning && !isComplete && (
          <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Usually 3-5 minutes
          </span>
        )}
      </div>

      <div className="relative">
        {/* Vertical line connecting steps */}
        <div
          className={`absolute left-4 top-4 bottom-4 w-0.5 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}
          aria-hidden="true"
        />

        <div className="space-y-6" role="group" aria-label="Research progress">
          {RESEARCH_PHASES.map((phase, index) => {
            const status = getPhaseStatus(phase.id);
            const isLast = index === RESEARCH_PHASES.length - 1;

            return (
              <div
                key={phase.id}
                className="relative flex items-start gap-4"
                aria-current={status === 'active' ? 'step' : undefined}
              >
                {/* Step indicator */}
                <div
                  className={`
                    relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${status === 'completed'
                      ? darkMode ? 'bg-[#0d9488]' : 'bg-[#16314C]'
                      : status === 'active'
                        ? darkMode ? 'bg-[#0d9488]/30 border-2 border-[#0d9488]' : 'bg-[#BBDCEF] border-2 border-[#16314C]'
                        : status === 'error'
                          ? 'bg-red-500'
                          : darkMode ? 'bg-slate-700 border-2 border-slate-500' : 'bg-white border-2 border-gray-200'
                    }
                  `}
                >
                  {status === 'completed' ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : status === 'active' ? (
                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${darkMode ? 'bg-[#0d9488]' : 'bg-[#16314C]'}`} />
                  ) : status === 'error' ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                      {phase.id}
                    </span>
                  )}
                </div>

                {/* Step content */}
                <div className={`flex-1 ${!isLast ? 'pb-2' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        status === 'active'
                          ? darkMode ? 'text-[#0d9488]' : 'text-[#16314C]'
                          : status === 'completed'
                            ? darkMode ? 'text-white' : 'text-gray-900'
                            : status === 'error'
                              ? 'text-red-600'
                              : darkMode ? 'text-slate-400' : 'text-gray-400'
                      }`}
                    >
                      {phase.name}
                    </span>
                    {status === 'active' && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        darkMode
                          ? 'text-[#0d9488] bg-[#0d9488]/20'
                          : 'text-[#16314C] bg-[#BBDCEF]/50'
                      }`}>
                        In Progress
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-0.5 ${
                      status === 'pending'
                        ? darkMode ? 'text-slate-500' : 'text-gray-400'
                        : darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}
                  >
                    {phase.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isComplete && (
        <div className={`mt-6 p-4 rounded-lg ${
          darkMode
            ? 'bg-[#0d9488]/20 border border-[#0d9488]/30'
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className={`flex items-center gap-2 ${darkMode ? 'text-[#0d9488]' : 'text-green-700'}`}>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Research Complete!</span>
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-green-600'}`}>
            Your report is ready below. A copy has also been sent to your email.
          </p>
        </div>
      )}

      {hasError && (
        <div className={`mt-6 p-4 rounded-lg ${
          darkMode
            ? 'bg-red-500/20 border border-red-500/30'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className={`flex items-center gap-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Research Failed</span>
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
            An error occurred during research. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}

export { ProgressStepper, RESEARCH_PHASES };
export type { ProgressStepperProps };
