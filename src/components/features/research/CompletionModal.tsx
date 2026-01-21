'use client';

import { useEffect } from 'react';

interface CompletionModalProps {
  sourcesCount?: number;
  onComplete: () => void;
  autoAdvanceDelay?: number;
}

function CompletionModal({
  sourcesCount = 50,
  onComplete,
  autoAdvanceDelay = 2000,
}: CompletionModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, autoAdvanceDelay);

    return () => clearTimeout(timer);
  }, [onComplete, autoAdvanceDelay]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Animated checkmark */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-[#0d9488] rounded-full flex items-center justify-center animate-checkmark">
          <svg
            className="w-10 h-10 text-white"
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
        </div>
      </div>

      {/* Headline */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Your research is ready.
      </h2>

      {/* Subhead */}
      <p className="text-lg text-slate-300 max-w-md">
        We analysed {sourcesCount}+ sources and found your audience&apos;s Urgency Gateway.
        Let&apos;s dive in.
      </p>
    </div>
  );
}

export { CompletionModal };
export type { CompletionModalProps };
