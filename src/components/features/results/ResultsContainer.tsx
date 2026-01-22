'use client';

import { ResearchResponse } from '@/lib/types';
import { PresentationPanel } from './PresentationPanel';
import { JsonExportPanel } from './JsonExportPanel';

interface ResultsContainerProps {
  response: ResearchResponse;
  reportId: string;
}

export function ResultsContainer({ response, reportId }: ResultsContainerProps) {
  // Use the new presentation URLs from Google Apps Script (fallback to legacy Gamma URLs)
  const presentationUrl = response.presentationUrl || response.gammaUrl;
  const presentationEmbedUrl = response.presentationEmbedUrl || response.gammaEmbedUrl;
  const presentationExportUrl = response.presentationExportUrl || response.gammaDownloadUrl;

  // Determine status: if we have a URL, it's completed
  const presentationStatus: 'completed' | 'error' = presentationUrl ? 'completed' : 'error';

  return (
    <div className="min-h-screen bg-[#1a2744]">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-[#1a2744]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-teal-500/20 text-teal-400 text-sm font-medium rounded-full mb-4">
              Research Complete
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Your Audience Intelligence Report
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Your research is ready. Save the JSON file securely - you&apos;ll need it for the next step.
            </p>
          </div>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Presentation */}
          <div className="order-2 lg:order-1">
            <PresentationPanel
              status={presentationStatus}
              url={presentationUrl}
              embedUrl={presentationEmbedUrl}
              exportUrl={presentationExportUrl}
            />
          </div>

          {/* Right Panel - JSON Export */}
          <div className="order-1 lg:order-2">
            <JsonExportPanel response={response} />
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <button
          onClick={() => window.location.href = '/onboarding'}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Start New Research
        </button>
      </div>
    </div>
  );
}
