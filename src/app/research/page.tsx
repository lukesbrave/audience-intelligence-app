'use client';

import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProgressStepper, RotatingTips, CompletionModal } from '@/components/features/research';
import { ResultsContainer } from '@/components/features/results';
import { ResearchResponse } from '@/lib/types';

type AppState = 'initializing' | 'processing' | 'completing' | 'complete' | 'error';

// Polling interval in milliseconds
const POLL_INTERVAL = 3000;
// Maximum polling time before timeout (5 minutes)
const MAX_POLL_TIME = 5 * 60 * 1000;

function ResearchPageContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<AppState>('initializing');
  const [response, setResponse] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);

  // Ref to track polling state
  const pollingRef = useRef<{
    intervalId: NodeJS.Timeout | null;
    startTime: number;
    reportId: string | null;
  }>({ intervalId: null, startTime: 0, reportId: null });

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current.intervalId) {
        clearInterval(pollingRef.current.intervalId);
      }
    };
  }, []);

  // Poll for research status
  const pollForStatus = useCallback(async (reportId: string) => {
    try {
      const res = await fetch(`/api/research/status/${reportId}`);
      if (!res.ok) {
        throw new Error('Failed to check research status');
      }

      const data = await res.json();

      if (data.status === 'completed' && data.response) {
        // Research complete - stop polling and show results
        if (pollingRef.current.intervalId) {
          clearInterval(pollingRef.current.intervalId);
          pollingRef.current.intervalId = null;
        }

        // Transform the response to match expected format
        const researchResponse: ResearchResponse = data.response;
        setResponse(researchResponse);
        setSavedReportId(reportId);
        setState('completing');
      } else if (data.status === 'error') {
        // Research failed - stop polling and show error
        if (pollingRef.current.intervalId) {
          clearInterval(pollingRef.current.intervalId);
          pollingRef.current.intervalId = null;
        }
        setError(data.error || 'Research failed. Please try again.');
        setState('error');
      } else if (data.status === 'processing' || data.status === 'pending') {
        // Still processing - check timeout
        const elapsed = Date.now() - pollingRef.current.startTime;
        if (elapsed > MAX_POLL_TIME) {
          if (pollingRef.current.intervalId) {
            clearInterval(pollingRef.current.intervalId);
            pollingRef.current.intervalId = null;
          }
          setError('Research is taking longer than expected. Please try again later.');
          setState('error');
        }
        // Otherwise, keep polling (interval will call this again)
      }
    } catch (err) {
      console.error('Error polling for status:', err);
      // Don't stop polling on transient errors, but log them
    }
  }, []);

  // Start polling for research status
  const startPolling = useCallback((reportId: string) => {
    // Clear any existing polling
    if (pollingRef.current.intervalId) {
      clearInterval(pollingRef.current.intervalId);
    }

    pollingRef.current = {
      intervalId: null,
      startTime: Date.now(),
      reportId: reportId,
    };

    // Poll immediately, then at intervals
    pollForStatus(reportId);
    pollingRef.current.intervalId = setInterval(() => {
      pollForStatus(reportId);
    }, POLL_INTERVAL);
  }, [pollForStatus]);

  // Auto-trigger research when coming from onboarding
  useEffect(() => {
    const fromOnboarding = searchParams.get('fromOnboarding') === 'true';
    const reportId = searchParams.get('reportId');

    if (fromOnboarding && reportId) {
      // Start research automatically
      triggerOnboardingResearch(reportId);
    } else {
      // Redirect to onboarding if not coming from there
      // Since we removed the PDF upload flow, users must go through onboarding
      window.location.href = '/onboarding';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const triggerOnboardingResearch = async (reportId: string) => {
    setState('processing');
    setError(null);

    try {
      // First, fetch the report to get the audience profile
      const reportRes = await fetch(`/api/reports/${reportId}`);
      if (!reportRes.ok) {
        throw new Error('Failed to fetch report data');
      }
      const { report } = await reportRes.json();

      // Extract the audience profile from the onboarding data
      const onboardingData = report.response?.onboardingData;
      if (!onboardingData?.profile) {
        throw new Error('No audience profile found in report');
      }

      // Trigger the research API with the audience profile
      // This now returns immediately and processes asynchronously
      const res = await fetch('/api/research/from-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          email: report.request?.email || report.request_email,
          audienceProfile: onboardingData.profile,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Research request failed');
      }

      // Start polling for status
      startPolling(reportId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  };

  const handleCompletionDone = useCallback(() => {
    setState('complete');
  }, []);

  const handleNewResearch = useCallback(() => {
    // Redirect to onboarding to start fresh
    window.location.href = '/onboarding';
  }, []);

  // Use the new ResultsContainer for completed research
  if (state === 'complete' && response && savedReportId) {
    return <ResultsContainer response={response} reportId={savedReportId} />;
  }

  // Full-screen dark layout for initializing, processing, completing, and error states (no sidebar)
  return (
    <div className="min-h-screen bg-[#1a2744]">
        {state === 'initializing' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
              <p className="text-lg text-slate-300">Preparing your research...</p>
            </div>
          </div>
        )}

        {state === 'processing' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Building your intelligence dossier...
              </h1>
              <p className="text-lg text-slate-300">
                We&apos;re going deep on your audience. This isn&apos;t a quick scan — grab a coffee.
              </p>
            </div>

            {/* Progress Card */}
            <div className="max-w-lg mx-auto">
              <div className="bg-[#243351] border border-slate-600/50 rounded-2xl p-8">
                <ProgressStepper isRunning isComplete={false} hasError={false} darkMode={true} />
              </div>

              {/* Rotating Tips */}
              <div className="mt-8">
                <RotatingTips />
              </div>
            </div>
          </div>
        )}

        {state === 'completing' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
              <CompletionModal onComplete={handleCompletionDone} />
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
              <div className="bg-[#243351] border border-slate-600/50 rounded-2xl p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-red-400"
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
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    {error || 'An unexpected error occurred during research. Please try again.'}
                  </p>
                  <button
                    onClick={handleNewResearch}
                    className="inline-flex items-center px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

// Loading fallback for Suspense
function ResearchPageLoading() {
  return (
    <div className="min-h-screen bg-[#1a2744]">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-lg text-slate-300">Loading...</p>
        </div>
      </div>
    </div>
  );
}

// Wrap the page content in Suspense for useSearchParams
export default function ResearchPage() {
  return (
    <Suspense fallback={<ResearchPageLoading />}>
      <ResearchPageContent />
    </Suspense>
  );
}
