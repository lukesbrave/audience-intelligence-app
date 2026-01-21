'use client';

import { Spinner } from '@/components/ui/Spinner';

interface ProgressStep {
  label: string;
  status: 'complete' | 'active' | 'pending';
}

const PROGRESS_STEPS: ProgressStep[] = [
  { label: 'Gathering market data', status: 'complete' },
  { label: 'Analyzing audience psychology', status: 'active' },
  { label: 'Mapping language patterns', status: 'pending' },
  { label: 'Building your report', status: 'pending' },
];

function ProgressStep({ label, status }: ProgressStep) {
  return (
    <div className="flex items-center gap-3">
      {status === 'complete' && (
        <div className="w-5 h-5 rounded-full bg-[#0d9488] flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {status === 'active' && (
        <div className="w-5 h-5 rounded-full border-2 border-[#0d9488] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#0d9488] animate-pulse" />
        </div>
      )}
      {status === 'pending' && (
        <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
      )}
      <span className={status === 'pending' ? 'text-slate-500' : 'text-slate-300'}>
        {label}
      </span>
    </div>
  );
}

export function ProcessingScreen() {
  return (
    <div className="min-h-screen bg-[#1a2744] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <Spinner size="lg" className="text-[#0d9488] mx-auto" />
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">
          Researching Your Audience
        </h2>
        <p className="text-gray-400 mb-8">
          We&apos;re analyzing your market and building your intelligence report.
          This usually takes 2-3 minutes.
        </p>

        <div className="space-y-3 text-left bg-[#243351] rounded-lg p-6 border border-white/10">
          {PROGRESS_STEPS.map((step) => (
            <ProgressStep key={step.label} {...step} />
          ))}
        </div>
      </div>
    </div>
  );
}
