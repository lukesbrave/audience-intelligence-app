'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SavedReport } from '@/lib/storage';
import { fetchReports, deleteReportApi } from '@/lib/api/reports';

export default function HistoryPage() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get user email from cookie (set by research API)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const email = getCookie('user-email');
    setUserEmail(email || null);

    if (email) {
      fetchReports(email)
        .then((data) => {
          setReports(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching reports:', err);
          setError('Failed to load reports');
          setIsLoading(false);
        });
    } else {
      // No email cookie - check localStorage for legacy reports
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReportApi(id);
        setReports((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        console.error('Error deleting report:', err);
        alert('Failed to delete report. Please try again.');
      }
    }
  }, []);

  const getReportStatus = (report: SavedReport) => {
    if (!report.response) return 'pending';
    if (report.response.report?.audienceProfile) return 'complete';
    return 'pending';
  };

  const getAudienceSummary = (report: SavedReport) => {
    if (!report.response) return report.name || 'Research Report';

    // Check for report data
    if (report.response.report?.audienceProfile?.demographics) {
      const demo = report.response.report.audienceProfile.demographics;
      if (demo.industry && demo.jobTitles?.length > 0) {
        return `${demo.jobTitles[0]} in ${demo.industry}`;
      }
    }

    return report.name || 'Research Report';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a2744] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-64 bg-white/5 rounded mt-2 animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#243351] border border-white/10 rounded-xl h-24 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a2744] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!userEmail && reports.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a2744] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-white mb-8">Report History</h1>

          <div className="bg-[#243351] rounded-xl p-12 border border-white/10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No Reports Yet
            </h2>
            <p className="text-gray-400 mb-6">
              Complete your first research to see it here.
            </p>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start Research
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2744] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
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
            <h1 className="text-2xl font-bold text-white">Report History</h1>
            <p className="text-gray-400 mt-1">
              {reports.length} saved report{reports.length === 1 ? '' : 's'}
            </p>
          </div>
          <Link
            href="/research"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Research
          </Link>
        </div>

        {/* Report List */}
        <div className="space-y-4">
          {reports.map((report) => {
            const status = getReportStatus(report);
            return (
              <Link
                key={report.id}
                href={`/research/history/${report.id}`}
                className="block bg-[#243351] rounded-xl p-6 border border-white/10 hover:border-teal-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white font-medium truncate">
                      {getAudienceSummary(report)}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(report.savedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm flex-shrink-0 ${
                      status === 'complete'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {status === 'complete' ? 'Complete' : 'In Progress'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(report.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
