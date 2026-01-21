'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToolkitContainer } from '@/components/features/report/toolkit';
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
      <div className="min-h-screen bg-[#1a2744] flex">
        <div className="w-64 bg-[#1a2744] border-r border-white/10 p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="h-8 w-full bg-white/10 rounded" />
            <div className="space-y-2 mt-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-white/5 rounded" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-white/10 rounded" />
            <div className="h-40 bg-white/5 rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#1a2744] flex items-center justify-center p-8">
        <div className="bg-[#243351] rounded-xl p-12 border border-white/10 text-center max-w-md">
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
          <h2 className="text-lg font-medium text-white mb-2">Report Not Found</h2>
          <p className="text-gray-400 mb-6">
            This report may have been deleted or the link is invalid.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-[#BBDCEF] hover:bg-[#9fcce8] text-[#1a2744] font-medium rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const hasCompleteReport = report.response?.report?.audienceProfile;

  if (!hasCompleteReport || !report.response) {
    return (
      <div className="min-h-screen bg-[#1a2744] flex items-center justify-center p-8">
        <div className="bg-[#243351] rounded-xl p-12 border border-white/10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-amber-400"
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
          <h2 className="text-lg font-medium text-white mb-2">Research Incomplete</h2>
          <p className="text-gray-400 mb-6">
            This research report was started but the analysis didn&apos;t complete. This can happen
            if the research process was interrupted.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/research"
              className="px-6 py-3 bg-[#BBDCEF] hover:bg-[#9fcce8] text-[#1a2744] font-medium rounded-lg transition-colors"
            >
              Start New Research
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2744]">
      {/* Top Bar */}
      <div className="h-14 bg-[#1a2744] border-b border-white/10 flex items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Dashboard</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-[#BBDCEF]/20 text-[#BBDCEF] text-xs font-medium rounded-full">
            {report.request.researchPriority}
          </span>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Main Content with Toolkit */}
      <div className="h-[calc(100vh-3.5rem)]">
        <ToolkitContainer
          response={report.response}
          reportName={report.name}
          googleDocUrl={report.response.googleDocUrl}
        />
      </div>
    </div>
  );
}
