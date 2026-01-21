'use client';

import Link from 'next/link';
import { SavedReport } from '@/lib/storage';
import { Badge } from '@/components/ui';

interface ReportListItemProps {
  report: SavedReport;
  onDelete: (id: string) => void;
}

function ReportListItem({ report, onDelete }: ReportListItemProps) {
  const date = new Date(report.savedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const painPointCount = report.response?.report?.audienceProfile?.painPoints?.length ?? 0;
  const findingsCount = report.response?.report?.researchFindings?.length ?? 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            href={`/research/history/${report.id}`}
            className="block group"
          >
            <h3 className="font-medium text-gray-900 group-hover:text-[#16314C] transition-colors truncate">
              {report.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {report.request.pdfFilename}
            </p>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="info">{report.request.researchPriority}</Badge>
            <span className="text-xs text-gray-400">
              {painPointCount} pain points
            </span>
            <span className="text-xs text-gray-400">
              {findingsCount} phases
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-sm text-gray-600">{formattedDate}</p>
            <p className="text-xs text-gray-400">{formattedTime}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/research/history/${report.id}`}
              className="p-2 text-gray-400 hover:text-[#16314C] hover:bg-gray-100 rounded transition-colors"
              title="View report"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>

            {report.response?.googleDocUrl && (
              <a
                href={report.response.googleDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-[#16314C] hover:bg-gray-100 rounded transition-colors"
                title="Open Google Doc"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            <button
              onClick={() => onDelete(report.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete report"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ReportListItem };
export type { ReportListItemProps };
