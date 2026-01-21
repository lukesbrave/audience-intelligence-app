'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, PageTitle } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
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
        router.push('/research/history');
      } catch (err) {
        console.error('Error deleting report:', err);
        alert('Failed to delete report. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <Container size="lg">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-8" />
            <div className="bg-white border border-gray-200 rounded-lg h-96" />
          </div>
        </Container>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="py-8">
        <Container size="lg">
          <Card>
            <div className="text-center py-12">
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Report Not Found
              </h2>
              <p className="text-gray-500 mb-6">
                This report may have been deleted or the link is invalid.
              </p>
              <Link href="/research/history">
                <Button variant="secondary">Back to History</Button>
              </Link>
            </div>
          </Card>
        </Container>
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

  return (
    <div className="py-8 pb-16">
      <Container size="lg">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/research/history"
              className="text-gray-500 hover:text-[#16314C] transition-colors"
            >
              History
            </Link>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {report.name}
            </span>
          </nav>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
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

        {/* Report Info */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{report.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Saved {savedDate}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">{report.request.researchPriority}</Badge>
              <span className="text-sm text-gray-500">{report.request.pdfFilename}</span>
            </div>
          </div>
        </Card>

        {/* Report Content */}
        <ReportContainer
          response={report.response}
          onSave={() => {}}
          isSaved
        />
      </Container>
    </div>
  );
}
