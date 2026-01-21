'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Container, PageTitle } from '@/components/layout';
import { ReportList } from '@/components/features/history';
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

  if (isLoading) {
    return (
      <div className="py-8">
        <Container size="lg">
          <PageTitle>Report History</PageTitle>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg h-24"
              />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <Container size="lg">
          <PageTitle>Report History</PageTitle>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </Container>
      </div>
    );
  }

  if (!userEmail && reports.length === 0) {
    return (
      <div className="py-8 pb-16">
        <Container size="lg">
          <div className="mb-6">
            <Link
              href="/research"
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#16314C] transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Research
            </Link>
          </div>

          <PageTitle>Report History</PageTitle>

          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              No Reports Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Complete your first research to see it here.
            </p>
            <Link
              href="/research"
              className="inline-flex items-center px-4 py-2 bg-[#16314C] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors"
            >
              Start Research
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 pb-16">
      <Container size="lg">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/research"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#16314C] transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Research
          </Link>
        </div>

        <PageTitle
          description={
            reports.length > 0
              ? `${reports.length} saved report${reports.length === 1 ? '' : 's'}`
              : undefined
          }
        >
          Report History
        </PageTitle>

        <ReportList reports={reports} onDelete={handleDelete} />
      </Container>
    </div>
  );
}
