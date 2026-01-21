'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ReportContainer } from '@/components/features/report';
import { SavedReport } from '@/lib/storage';
import { fetchReport, deleteReportApi } from '@/lib/api/reports';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReportDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<SavedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchReport(id)
      .then((loadedReport) => {
        if (loadedReport) {
          setReport(loadedReport);
        } else {
          setNotFound(true);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching report:', err);
        setNotFound(true);
        setIsLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReportApi(id);
        router.push('/dashboard');
      } catch (err) {
        console.error('Error deleting report:', err);
        alert('Failed to delete report. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a2744] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-white/10 rounded mb-8" />
            <div className="bg-[#243351] border border-white/10 rounded-xl h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#1a2744] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#243351] rounded-xl p-12 border border-white/10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-white mb-2">
              Report Not Found
            </h2>
            <p className="text-gray-400 mb-6">
              This report may have been deleted or the link is invalid.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const savedDate = new Date(report.savedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Check if the report has complete research data
  const hasCompleteReport = report.response?.report?.audienceProfile;

  return (
    <div className="min-h-screen bg-[#1a2744]">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header with back button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Report
          </button>
        </div>

        {/* Report Info Header */}
        <div className="bg-[#243351] rounded-xl p-6 border border-white/10 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-white">{report.name}</h1>
              <p className="text-sm text-gray-400 mt-1">
                Saved {savedDate}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-sm rounded-full">
                {report.request.researchPriority}
              </span>
              {report.request.pdfFilename && (
                <span className="text-sm text-gray-400">{report.request.pdfFilename}</span>
              )}
            </div>
          </div>
        </div>

        {/* Report Content or Incomplete State */}
        {hasCompleteReport && report.response ? (
          <div className="bg-white rounded-xl overflow-hidden">
            <ReportContainer
              response={report.response}
              onSave={() => {}}
              isSaved
            />
          </div>
        ) : (
          <div className="bg-[#243351] rounded-xl p-12 border border-white/10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-white mb-2">
              Research Incomplete
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              This research report was started but the analysis didn&apos;t complete.
              This can happen if the research process was interrupted.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/research"
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                Start New Research
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Delete This Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
