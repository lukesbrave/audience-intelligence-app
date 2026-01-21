'use client';

import { SavedReport } from '@/lib/storage';
import { ReportListItem } from './ReportListItem';

interface ReportListProps {
  reports: SavedReport[];
  onDelete: (id: string) => void;
}

function ReportList({ reports, onDelete }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
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
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved reports</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          When you run research and save reports, they&apos;ll appear here for easy access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <ReportListItem
          key={report.id}
          report={report}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export { ReportList };
export type { ReportListProps };
