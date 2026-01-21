'use client';

import { useState, useCallback, ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ResearchForm, ResearchFormData, ProgressStepper, RotatingTips, CompletionModal } from '@/components/features/research';
import { ReportViewContainer } from '@/components/features/report/views';
import { ResearchResponse, ResearchRequest } from '@/lib/types';

type AppState = 'form' | 'processing' | 'completing' | 'complete' | 'error';

// Wrapper component that receives props from DashboardLayout and passes them to ReportViewContainer
interface ReportWrapperProps {
  response: ResearchResponse;
  onSave: () => void;
  isSaved: boolean;
  onNewResearch: () => void;
  onOfferGenerated: (hasOffer: boolean) => void;
  activeSection?: string;
  onNavigate?: (section: string) => void;
  children?: ReactNode;
}

function ReportWrapper({
  response,
  onSave,
  isSaved,
  onNewResearch,
  onOfferGenerated,
  activeSection = 'overview',
  onNavigate = () => {}
}: ReportWrapperProps) {
  return (
    <div className="bg-white min-h-full">
      {/* Top bar with new research button */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-end">
        <button
          onClick={onNewResearch}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#16314C] bg-[#BBDCEF]/20 hover:bg-[#BBDCEF]/40 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Research
        </button>
      </div>

      <ReportViewContainer
        response={response}
        activeSection={activeSection}
        onNavigate={onNavigate}
        onSave={onSave}
        isSaved={isSaved}
        onOfferGenerated={onOfferGenerated}
      />
    </div>
  );
}

export default function ResearchPage() {
  const [state, setState] = useState<AppState>('form');
  const [response, setResponse] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<ResearchFormData | null>(null);
  const [hasOfferData, setHasOfferData] = useState(false);

  const handleSubmit = useCallback(async (formData: ResearchFormData) => {
    setState('processing');
    setError(null);
    setLastRequest(formData);

    try {
      const requestBody: ResearchRequest = {
        email: formData.email,
        pdfBase64: formData.pdfBase64,
        pdfFilename: formData.pdfFilename,
        businessContext: '',
        researchPriority: 'All Areas (Recommended)',
      };

      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Research request failed');
      }

      const data = await res.json();
      setResponse(data);
      // Report is auto-saved by the API, check for savedReportId
      if (data.savedReportId) {
        setSavedReportId(data.savedReportId);
      }
      setState('completing'); // Show completion modal first
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  }, []);

  const handleCompletionDone = useCallback(() => {
    setState('complete');
  }, []);

  // Reports are now auto-saved by the API, so this is a no-op
  // but we keep the function for UI compatibility
  const handleSave = useCallback(() => {
    // Report was already saved by the API when research completed
    // savedReportId is already set from the API response
  }, []);

  const handleNewResearch = useCallback(() => {
    setState('form');
    setResponse(null);
    setError(null);
    setSavedReportId(null);
    setLastRequest(null);
    setHasOfferData(false);
  }, []);

  // Use dashboard layout when viewing completed report
  // ReportWrapper receives activeSection and onNavigate from DashboardLayout via cloneElement
  // and passes them to ReportViewContainer
  if (state === 'complete' && response) {
    return (
      <DashboardLayout
        showReportNav={true}
        researchPhases={response.report.researchFindings}
        hasOfferData={hasOfferData}
        isResearchComplete={true}
      >
        <ReportWrapper
          response={response}
          onSave={handleSave}
          isSaved={!!savedReportId}
          onNewResearch={handleNewResearch}
          onOfferGenerated={setHasOfferData}
        />
      </DashboardLayout>
    );
  }

  // Full-screen dark layout for form, processing, completing, and error states (no sidebar)
  return (
    <div className="min-h-screen bg-[#1a2744]">
        {state === 'form' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
                Your Digital Home is built.
                <br />
                Now let&apos;s find out who should walk through the door.
              </h1>
              <p className="text-lg text-slate-300 max-w-xl mx-auto">
                Upload your Audience Profile and we&apos;ll run deep intelligence — uncovering their Urgency Gateway, mapping their language, and showing you exactly how to position your offer.
              </p>
            </div>

            {/* Form Card */}
            <div className="max-w-lg mx-auto">
              <ResearchForm onSubmit={handleSubmit} darkMode={true} />
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
