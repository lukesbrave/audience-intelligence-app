'use client';

import { Button } from '@/components/ui';

interface ReportActionsProps {
  googleDocUrl?: string;
  onSave: () => void;
  isSaved?: boolean;
}

function ReportActions({ googleDocUrl, onSave, isSaved = false }: ReportActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {googleDocUrl && (
        <a
          href={googleDocUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <Button variant="primary">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open Google Doc
          </Button>
        </a>
      )}

      <Button
        variant="secondary"
        onClick={onSave}
        disabled={isSaved}
      >
        {isSaved ? (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Saved to History
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save to History
          </>
        )}
      </Button>
    </div>
  );
}

export { ReportActions };
export type { ReportActionsProps };
