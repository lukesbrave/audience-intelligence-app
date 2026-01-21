'use client';

import { useReportStatus } from '@/lib/hooks/useReportStatus';
import { ProcessingScreen, ReportView } from '@/components/features/report/gamma';
import { ResearchStatus } from '@/lib/supabase/types';

interface ReportPageClientProps {
  reportId: string;
  initialStatus: ResearchStatus;
  businessName: string;
  createdAt: string;
  gammaEmbedUrl: string | null;
  gammaDownloadUrl: string | null;
  error: string | null;
}

export function ReportPageClient({
  reportId,
  initialStatus,
  businessName,
  createdAt,
  gammaEmbedUrl: initialGammaEmbedUrl,
  gammaDownloadUrl: initialGammaDownloadUrl,
  error: initialError,
}: ReportPageClientProps) {
  const { report } = useReportStatus(reportId);

  // Use realtime values if available, otherwise fall back to initial SSR values
  const status = report?.status ?? initialStatus;
  const gammaEmbedUrl = report?.gammaEmbedUrl ?? initialGammaEmbedUrl;
  const gammaDownloadUrl = report?.gammaDownloadUrl ?? initialGammaDownloadUrl;
  const error = report?.error ?? initialError;
  const displayName = report?.businessName ?? businessName;
  const displayCreatedAt = report?.createdAt ?? createdAt;

  // Show error state
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#1a2744] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-400 mb-6">
            {error || 'An error occurred while generating your report. Please try again.'}
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-[#0d9488] text-white rounded-lg font-medium hover:bg-[#0b7c71] transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Show processing state
  if (status === 'processing' || status === 'pending') {
    return <ProcessingScreen />;
  }

  // Show completed state with Gamma embed
  if (status === 'completed' && gammaEmbedUrl) {
    return (
      <ReportView
        reportId={reportId}
        businessName={displayName}
        createdAt={displayCreatedAt}
        gammaEmbedUrl={gammaEmbedUrl}
        gammaDownloadUrl={gammaDownloadUrl}
      />
    );
  }

  // Fallback - waiting for data
  return <ProcessingScreen />;
}
